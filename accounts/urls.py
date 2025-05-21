from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('patient/dashboard/', views.patient_dashboard, name='patient_dashboard'),
    path('doctor/dashboard/', views.doctor_dashboard, name='doctor_dashboard'),
    path('doctor/blogs/', views.doctor_blog_list, name='doctor_blog_list'),
    path('doctor/blogs/create/', views.doctor_blog_create, name='doctor_blog_create'),
    path('patient/blogs/', views.patient_blog_list, name='patient_blog_list'),
    path('patient/blogs/<int:blog_id>/', views.patient_blog_detail, name='patient_blog_detail'),

]