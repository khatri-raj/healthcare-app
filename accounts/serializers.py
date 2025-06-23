# serializers.py
from rest_framework import serializers
from .models import CustomUser, BlogPost, Appointment
from django.conf import settings

class CustomUserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'user_type', 'profile_picture', 'address_line1', 'city', 'state', 'pincode', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return f"{settings.MEDIA_URL}{obj.profile_picture}"
        return None

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        profile_picture = validated_data.pop('profile_picture', None)
        user = CustomUser(**validated_data)
        if password:
            user.set_password(password)
        if profile_picture:
            user.profile_picture = profile_picture
        user.save()
        return user

class BlogPostSerializer(serializers.ModelSerializer):
    author = CustomUserSerializer(read_only=True)
    created_at = serializers.DateTimeField(read_only=True, format="%Y-%m-%d %H:%M:%S")

    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = BlogPost
        fields = '__all__'
        extra_kwargs = {
            'is_draft': {'required': True}
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image and hasattr(instance.image, 'url'):
            request = self.context.get('request')
            image_url = instance.image.url
            if request:
                representation['image'] = request.build_absolute_uri(image_url)
            else:
                representation['image'] = f"http://localhost:8000{image_url}"
        else:
            representation['image'] = None
        return representation

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
    end_time = serializers.TimeField(format="%H:%M", required=False)

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'speciality', 'date', 'start_time', 'end_time', 'created_at']