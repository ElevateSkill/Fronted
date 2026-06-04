from django.db import models
from django.contrib.auth.models import AbstractUser

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
    
    REQUIRED_FIELDS = ["email", "full_name"]
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
