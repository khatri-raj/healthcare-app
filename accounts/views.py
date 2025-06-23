from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import CustomUser, BlogPost, Appointment
from django import forms
from django.contrib.auth.decorators import login_required
from django.conf import settings
from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.errors import HttpError
from datetime import datetime
import os
import logging

logger = logging.getLogger(__name__)

# Home view
def home(request):
    return render(request, 'home.html')

# Signup form
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

# Signup view
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

# Login view
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

# Patient dashboard
@login_required
def patient_dashboard(request):
    if request.user.user_type != 'patient':
        return redirect('login')
    return render(request, 'patient_dashboard.html', {'user': request.user})

# Doctor dashboard
@login_required
def doctor_dashboard(request):
    if request.user.user_type != 'doctor':
        return redirect('login')
    appointments = Appointment.objects.filter(doctor=request.user).order_by('date', 'start_time')
    return render(request, 'doctor_dashboard.html', {
        'user': request.user,
        'appointments': appointments
    })

# Logout view
@login_required
def user_logout(request):
    logout(request)
    return redirect('login')

# Blog post form
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

# Doctor blog list
@login_required
def doctor_blog_list(request):
    if request.user.user_type != 'doctor':
        return redirect('login')
    posts = BlogPost.objects.filter(author=request.user).order_by('-created_at')
    return render(request, 'doctor_blog_list.html', {'posts': posts})

# Doctor blog create
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

# Patient blog list
@login_required
def patient_blog_list(request):
    if request.user.user_type != 'patient':
        return redirect('login')
    blogs = BlogPost.objects.filter(is_draft=False).order_by('-created_at')
    blogs_by_category = defaultdict(list)
    for blog in blogs:
        blogs_by_category[blog.get_category_display()].append(blog)
    return render(request, 'patient_blog_list.html', {'blogs_by_category': dict(blogs_by_category)})

# Patient blog detail
@login_required
def patient_blog_detail(request, blog_id):
    blog = get_object_or_404(BlogPost, id=blog_id, is_draft=False)
    return render(request, 'patient_blog_detail.html', {'blog': blog})

# Appointment form
class AppointmentForm(forms.ModelForm):
    class Meta:
        model = Appointment
        fields = ['speciality', 'date', 'start_time']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'start_time': forms.TimeInput(attrs={'type': 'time'}),
        }

# Doctor list
@login_required
def doctor_list(request):
    if request.user.user_type != 'patient':
        return redirect('login')
    doctors = CustomUser.objects.filter(user_type='doctor')
    return render(request, 'doctor_list.html', {'doctors': doctors})

# Book appointment
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

# Appointment confirmed
@login_required
def appointment_confirmed(request, appointment_id):
    appointment = get_object_or_404(Appointment, id=appointment_id, patient=request.user)
    return render(request, 'appointment_confirmed.html', {'appointment': appointment})

# Google Calendar event creation
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
        calendar_id = 'primary'
        service.events().insert(calendarId=calendar_id, body=event).execute()
        return True
    except FileNotFoundError:
        raise Exception(f"Credentials file not found at {settings.GOOGLE_CALENDAR_CREDENTIALS_PATH}")
    except HttpError as e:
        raise Exception(f"Failed to create calendar event: {e}")
    
    
    
    
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser, BlogPost, Appointment
from .serializers import CustomUserSerializer, BlogPostSerializer, AppointmentSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.errors import HttpError
from django.shortcuts import get_object_or_404
from django.conf import settings
from collections import defaultdict
from datetime import datetime
import logging
import os

logger = logging.getLogger(__name__)

# API Signup
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def api_signup(request):
    print("Received data:", request.data)
    print("Received files:", request.FILES)
    mutable_data = request.data.copy()
    mutable_data['username'] = mutable_data['username'].lower()
    serializer = CustomUserSerializer(data=mutable_data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User created successfully', 'user': CustomUserSerializer(user).data}, status=status.HTTP_201_CREATED)
    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API Login
@api_view(['POST'])
def api_user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print(f"Login attempt with username: {username}, password: {password}")
    user = authenticate(request, username=username, password=password)
    if user is not None:
        print(f"Authenticated user: {user.username}, user_type: {user.user_type}")
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        user_serializer = CustomUserSerializer(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_type': user.user_type,
            'user': user_serializer.data
        })
    print("Authentication failed: User is None")
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

# API Patient Appointments
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_patient_appointments(request):
    if request.user.user_type != 'patient':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    appointments = Appointment.objects.filter(patient=request.user)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response({'appointments': serializer.data})

# API Doctor Appointments
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_doctor_appointments(request):
    if request.user.user_type != 'doctor':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    appointments = Appointment.objects.filter(doctor=request.user)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response({'appointments': serializer.data})

# API Doctor Blog List
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_doctor_blog_list(request):
    if request.user.user_type != 'doctor':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    blogs = BlogPost.objects.filter(author=request.user)
    serializer = BlogPostSerializer(blogs, many=True)
    return Response({'blogs': serializer.data})

# API Doctor Blog Create
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def api_doctor_blog_create(request):
    if request.user.user_type != 'doctor':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    try:
        logger.info('Creating blog with data: %s, files: %s', request.data, request.FILES)
        if 'image' in request.FILES:
            logger.info('甚至 file received: %s', request.FILES['image'].name)
        else:
            logger.warning('No image file received')
        serializer = BlogPostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            blog = serializer.save(author=request.user)
            logger.info('Blog created successfully: %s', blog.id)
            return Response({'message': 'Blog created', 'id': blog.id}, status=status.HTTP_201_CREATED)
        logger.error('Serializer errors: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error('Error creating blog: %s', str(e))
        return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API Doctor Blog Update
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def api_doctor_blog_update(request, blog_id):
    try:
        blog = BlogPost.objects.get(id=blog_id, author=request.user)
    except BlogPost.DoesNotExist:
        return Response({'error': 'Blog not found or you are not the author'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BlogPostSerializer(blog, context={'request': request})
        return Response(serializer.data)

    if request.method == 'PATCH':
        logger.info('Updating blog %s with data: %s, files: %s', blog_id, request.data, request.FILES)
        if 'image' in request.FILES:
            logger.info('Image file received for update: %s', request.FILES['image'].name)
        else:
            logger.warning('No image file received for update')
        serializer = BlogPostSerializer(blog, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            logger.info('Blog %s updated successfully', blog_id)
            return Response({'message': 'Blog updated'}, status=status.HTTP_200_OK)
        logger.error('Serializer errors: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API Doctor Blog Delete
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def api_doctor_blog_delete(request, blog_id):
    if request.user.user_type != 'doctor':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    blog = get_object_or_404(BlogPost, id=blog_id, author=request.user)
    try:
        blog.delete()
        return Response({'message': 'Blog deleted'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        logger.error(f"Error deleting blog: {str(e)}")
        return Response({'error': 'Server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API Patient Blog List
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_patient_blog_list(request):
    if request.user.user_type != 'patient':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    blogs = BlogPost.objects.filter(is_draft=False)
    blogs_by_category = defaultdict(list)
    for blog in blogs:
        blogs_by_category[blog.get_category_display()].append(BlogPostSerializer(blog).data)
    return Response(blogs_by_category)

# API Patient Blog Detail
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_patient_blog_detail(request, blog_id):
    if request.user.user_type != 'patient':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    blog = get_object_or_404(BlogPost, id=blog_id, is_draft=False)
    serializer = BlogPostSerializer(blog)
    return Response(serializer.data)

# API Doctor List
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_doctor_list(request):
    if request.user.user_type != 'patient':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    doctors = CustomUser.objects.filter(user_type='doctor')
    serializer = CustomUserSerializer(doctors, many=True)
    return Response({'doctors': serializer.data})

# API Book Appointment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_book_appointment(request, doctor_id):
    print(f"Booking appointment for doctor_id: {doctor_id}, user: {request.user.username}")
    print(f"Request data: {request.data}")
    if request.user.user_type != 'patient':
        print("User is not a patient")
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    doctor = get_object_or_404(CustomUser, id=doctor_id, user_type='doctor')
    print(f"Doctor found: {doctor.username}")
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        print("Serializer is valid, saving appointment")
        appointment = serializer.save(patient=request.user, doctor=doctor)
        try:
            if not os.path.exists(settings.GOOGLE_CALENDAR_CREDENTIALS_PATH):
                raise FileNotFoundError(f"Credentials file not found at {settings.GOOGLE_CALENDAR_CREDENTIALS_PATH}")
            create_google_calendar_event(appointment)
            print("Google Calendar event created")
        except Exception as e:
            print(f"Google Calendar error: {str(e)}")
        return Response({'message': 'Appointment booked', 'id': serializer.data['id']}, status=status.HTTP_201_CREATED)
    print(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API Appointment Confirmed
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_appointment_confirmed(request, appointment_id):
    if request.user.user_type != 'patient':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    appointment = get_object_or_404(Appointment, id=appointment_id, patient=request.user)
    serializer = AppointmentSerializer(appointment)
    return Response(serializer.data, status=status.HTTP_200_OK)

# API Logout
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_user_logout(request):
    logout(request)
    return Response({'message': 'Logged out'})

# API Doctor Detail
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_doctor_detail(request, doctor_id):
    print(f"Fetching doctor with ID: {doctor_id}")
    if request.user.user_type != 'patient':
        print("User is not a patient")
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    try:
        doctor = CustomUser.objects.get(id=doctor_id, user_type='doctor')
        serializer = CustomUserSerializer(doctor)
        print(f"Doctor found: {doctor.username}")
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        print(f"Doctor not found for ID: {doctor_id}")
        return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error fetching doctor: {str(e)}")
        return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Google Calendar event creation
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
        calendar_id = 'primary'
        service.events().insert(calendarId=calendar_id, body=event).execute()
        return True
    except FileNotFoundError:
        raise Exception(f"Credentials file not found at {settings.GOOGLE_CALENDAR_CREDENTIALS_PATH}")
    except HttpError as e:
        raise Exception(f"Failed to create calendar event: {e}")