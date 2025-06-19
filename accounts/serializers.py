from rest_framework import serializers
from .models import CustomUser, BlogPost, Appointment
from django.conf import settings

class CustomUserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'user_type', 'profile_picture', 'address_line1', 'city', 'state', 'pincode']

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return f"{settings.MEDIA_URL}{obj.profile_picture}"
        return None

class BlogPostSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    author = CustomUserSerializer(read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'image', 'category', 'summary', 'content', 'is_draft', 'author', 'created_at']

    def get_image(self, obj):
        if obj.image:
            return f"{settings.MEDIA_URL}{obj.image}"
        return None

class AppointmentSerializer(serializers.ModelSerializer):
    patient = CustomUserSerializer(read_only=True)
    doctor = CustomUserSerializer(read_only=True)
    date = serializers.DateField(format="%Y-%m-%d")
    start_time = serializers.TimeField(format="%H:%M")
    end_time = serializers.TimeField(format="%H:%M")

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'speciality', 'date', 'start_time', 'end_time', 'created_at']