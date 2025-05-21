from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import CustomUser, BlogPost
from django import forms
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404


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

def patient_dashboard(request):
    if not request.user.is_authenticated or request.user.user_type != 'patient':
        return redirect('login')
    return render(request, 'patient_dashboard.html', {'user': request.user})

def doctor_dashboard(request):
    if not request.user.is_authenticated or request.user.user_type != 'doctor':
        return redirect('login')
    return render(request, 'doctor_dashboard.html', {'user': request.user})

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

    # Filter non-draft posts, order by created date desc
    blogs = BlogPost.objects.filter(is_draft=False).order_by('-created_at')

    # Group blogs by category into a dictionary
    blogs_by_category = defaultdict(list)
    for blog in blogs:
        blogs_by_category[blog.get_category_display()].append(blog)

    return render(request, 'patient_blog_list.html', {'blogs_by_category': dict(blogs_by_category)})

@login_required
def patient_blog_detail(request, blog_id):
    blog = get_object_or_404(BlogPost, id=blog_id, is_draft=False)
    return render(request, 'patient_blog_detail.html', {'blog': blog})