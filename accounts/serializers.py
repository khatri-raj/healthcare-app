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
    image = serializers.ImageField(required=False, allow_null=True)
    author = CustomUserSerializer(read_only=True)
    created_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")  # Mark as read_only

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'image', 'category', 'summary', 'content', 'is_draft', 'author', 'created_at']
        extra_kwargs = {
            'image': {'required': False},
            'is_draft': {'required': True}
        }

    def validate(self, data):
        if not data.get('title'):
            raise serializers.ValidationError({'title': 'Title is required.'})
        if not data.get('summary'):
            raise serializers.ValidationError({'summary': 'Summary is required.'})
        if not data.get('content'):
            raise serializers.ValidationError({'content': 'Content is required.'})
        return data

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