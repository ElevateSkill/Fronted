from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        
        if 'username' not in extra_fields:
            # Fallback for username since AbstractUser requires it
            extra_fields['username'] = email.split('@')[0]
            
        if 'full_name' not in extra_fields:
            extra_fields['full_name'] = ""
            
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # Ensure superuser is always created as ADMIN role, not STUDENT
        extra_fields.setdefault('role', self.model.ADMIN)
        extra_fields.setdefault('full_name', 'Admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    STUDENT = "student"
    ADMIN = "admin"
    
    ROLE_CHOICES = (
        (STUDENT, "Student"),
        (ADMIN, "Admin"),
    )
    
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=STUDENT)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # We use full_name instead of separate first/last name fields
    first_name = None
    last_name = None
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    
    objects = CustomUserManager()
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
