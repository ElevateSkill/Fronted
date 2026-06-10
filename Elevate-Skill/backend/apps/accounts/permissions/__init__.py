from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model

User = get_user_model()

class IsAdmin(BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == User.ADMIN or request.user.is_staff or request.user.is_superuser)
        )

class IsStudent(BasePermission):
    """
    Allows access only to student users.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == User.STUDENT
        )
