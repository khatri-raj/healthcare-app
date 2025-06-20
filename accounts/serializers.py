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

# serializers.py
class BlogPostSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()  # Use SerializerMethodField for image
    author = CustomUserSerializer(read_only=True)
    created_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'image', 'category', 'summary', 'content', 'is_draft', 'author', 'created_at']
        extra_kwargs = {
            'is_draft': {'required': True}
        }

    def get_image(self, obj):
        if obj.image:
            # Ensure the full URL is returned
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"{settings.MEDIA_URL}{obj.image}"
        return None

    def validate(self, data):
        if not data.get('title'):
            raise serializers.ValidationError({'title': 'Title is required.'})
        if not data.get('summary'):
            raise serializers.ValidationError({'summary': 'Summary is required.'})
        if not data.get('content'):
            raise serializers.ValidationError({'content': 'Content is required.'})
        return data

class AppointmentSerializer(serializers.ModelSerializer):
    patient = CustomUserSerializer(read_only=True)
    doctor = CustomUserSerializer(read_only=True)
    date = serializers.DateField(format="%Y-%m-%d")
    start_time = serializers.TimeField(format="%H:%M")
    end_time = serializers.TimeField(format="%H:%M", required=False)  # Make end_time optional

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'speciality', 'date', 'start_time', 'end_time', 'created_at']