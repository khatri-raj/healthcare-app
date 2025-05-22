from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import CustomUser, BlogPost, Appointment
from django import forms
from django.contrib.auth.decorators import login_required
from datetime import datetime, time, timedelta
from django.utils import timezone
from django.conf import settings
from google.oauth2 import service_account  # Add this import
from googleapiclient.discovery import build
from collections import defaultdict
import os

def home(request):
    return render(request, 'home.html')

class SignupForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)
    
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'profile_picture', 'username', 'email', 
                 'password', 'confirm_password', 'address_line1', 'city', 'state', 
                 'pincode', 'user_type']
        
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        
        if password != confirm_password:
            raise forms.ValidationError("Passwords do not match")
        return cleaned_data

def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            messages.success(request, 'Account created successfully!')
            return redirect('login')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = SignupForm()
    return render(request, 'signup.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if user.user_type == 'patient':
                return redirect('patient_dashboard')
            else:
                return redirect('doctor_dashboard')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'login.html')

@login_required
def patient_dashboard(request):
    if not request.user.is_authenticated or request.user.user_type != 'patient':
        return redirect('login')
    return render(request, 'patient_dashboard.html', {'user': request.user})

@login_required
def doctor_dashboard(request):
    if not request.user.is_authenticated or request.user.user_type != 'doctor':
        return redirect('login')
    appointments = Appointment.objects.filter(doctor=request.user).order_by('date', 'start_time')
    return render(request, 'doctor_dashboard.html', {
        ' airs': request.user,
        'appointments': appointments
    })

@login_required
def user_logout(request):
    logout(request)
    return redirect('login')

class BlogPostForm(forms.ModelForm):
    class Meta:
        model = BlogPost
        fields = ['title', 'image', 'category', 'summary', 'content', 'is_draft']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter blog title'}),
            'image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'category': forms.Select(attrs={'class': 'form-select'}),
            'summary': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Enter a brief summary'}),
            'content': forms.Textarea(attrs={'class': 'form-control', 'rows': 6, 'placeholder': 'Enter detailed content'}),
            'is_draft': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

@login_required
def doctor_blog_list(request):
    if request.user.user_type != 'doctor':
        return redirect('login')
    posts = BlogPost.objects.filter(author=request.user).order_by('-created_at')
    return render(request, 'doctor_blog_list.html', {'posts': posts})

@login_required
def doctor_blog_create(request):
    if request.user.user_type != 'doctor':
        return redirect('login')

    if request.method == 'POST':
        form = BlogPostForm(request.POST, request.FILES)
        if form.is_valid():
            blog_post = form.save(commit=False)
            blog_post.author = request.user
            blog_post.save()
            return redirect('doctor_blog_list')
    else:
        form = BlogPostForm()
    return render(request, 'doctor_blog_create.html', {'form': form})

from collections import defaultdict

@login_required
def patient_blog_list(request):
    if request.user.user_type != 'patient':
        return redirect('login')
    
    blogs = BlogPost.objects.filter(is_draft=False).order_by('-created_at')
    
    blogs_by_category = defaultdict(list)
    for blog in blogs:
        blogs_by_category[blog.get_category_display()].append(blog)

    return render(request, 'patient_blog_list.html', {'blogs_by_category': dict(blogs_by_category)})

@login_required
def patient_blog_detail(request, blog_id):
    blog = get_object_or_404(BlogPost, id=blog_id, is_draft=False)
    return render(request, 'patient_blog_detail.html', {'blog': blog})

# Form for booking appointment
class AppointmentForm(forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ['speciality', 'date', 'start_time']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'start_time': forms.TimeInput(attrs={'type': 'time'}),
        }

@login_required
def doctor_list(request):
    if request.user.user_type != 'patient':
        return redirect('login')
    doctors = CustomUser.objects.filter(user_type='doctor')
    return render(request, 'doctor_list.html', {'doctors': doctors})

@login_required
def book_appointment(request, doctor_id):
    if request.user.user_type != 'patient':
        return redirect('login')
    doctor = get_object_or_404(CustomUser, id=doctor_id, user_type='doctor')

    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        if form.is_valid():
            appointment = form.save(commit=False)
            appointment.patient = request.user
            appointment.doctor = doctor
            appointment.save()
            try:
                if not os.path.exists(settings.GOOGLE_CALENDAR_CREDENTIALS_PATH):
                    raise FileNotFoundError(f"Credentials file not found at {settings.GOOGLE_CALENDAR_CREDENTIALS_PATH}")
                create_google_calendar_event(appointment)
                messages.success(request, "Appointment booked and synced with Google Calendar.")
            except Exception as e:
                messages.error(request, f"Appointment saved but failed to sync with Google Calendar: {str(e)}")
            return redirect('appointment_confirmed', appointment_id=appointment.id)
    else:
        form = AppointmentForm()
    return render(request, 'book_appointment.html', {'form': form, 'doctor': doctor})


@login_required
def appointment_confirmed(request, appointment_id):
    appointment = get_object_or_404(Appointment, id=appointment_id, patient=request.user)
    return render(request, 'appointment_confirmed.html', {'appointment': appointment})

from googleapiclient.errors import HttpError

def create_google_calendar_event(appointment):
    try:
        credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_CALENDAR_CREDENTIALS_PATH,
            scopes=['https://www.googleapis.com/auth/calendar']
        )
        service = build('calendar', 'v3', credentials=credentials)

        start_datetime = datetime.combine(appointment.date, appointment.start_time)
        end_datetime = datetime.combine(appointment.date, appointment.end_time)

        event = {
            'summary': f'Appointment with {appointment.patient.first_name} {appointment.patient.last_name}',
            'description': f'Medical appointment for {appointment.speciality}',
            'start': {
                'dateTime': start_datetime.isoformat(),
                'timeZone': 'Asia/Kolkata',
            },
            'end': {
                'dateTime': end_datetime.isoformat(),
                'timeZone': 'Asia/Kolkata',
            }
        }

        # Use primary calendar of the service account
        calendar_id = 'primary'
        try:
            service.events().insert(calendarId=calendar_id, body=event).execute()
            return True
        except HttpError as e:
            raise Exception(f"Failed to create calendar event: {e}")
    except FileNotFoundError:
        raise Exception(f"Credentials file not found at {settings.GOOGLE_CALENDAR_CREDENTIALS_PATH}")
    except Exception as e:
        raise Exception(f"Error creating Google Calendar event: {e}")