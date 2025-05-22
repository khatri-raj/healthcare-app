from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, BlogPost, Appointment


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'first_name', 'last_name', 'user_type', 'is_staff']
    list_filter = ['user_type', 'is_staff']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'user_type', 'profile_picture', 'address_line1', 'city', 'state', 'pincode')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'user_type', 'password1', 'password2', 'address_line1', 'city', 'state', 'pincode', 'profile_picture'),
        }),
    )
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['username']

admin.site.register(CustomUser, CustomUserAdmin)

class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'is_draft', 'created_at')
    list_filter = ('category', 'is_draft', 'created_at')
    search_fields = ('title', 'summary', 'content')
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(BlogPost, BlogPostAdmin)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'patient', 'speciality', 'date', 'start_time', 'end_time', 'created_at')
    list_filter = ('date', 'doctor', 'speciality')
    search_fields = ('doctor__username', 'patient__username', 'speciality')