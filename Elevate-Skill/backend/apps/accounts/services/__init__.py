from django.contrib.auth import get_user_model

User = get_user_model()

class UserService:
    @staticmethod
    def register_user(email, password, role=User.STUDENT, **kwargs):
        """
        Business logic for registering a new user.
        """
        user = User.objects.create_user(email=email, password=password, role=role, **kwargs)
        if role == User.ADMIN:
            user.is_staff = True
            user.is_superuser = True
            user.save()
        return user

    @staticmethod
    def update_profile(user, **kwargs):
        """
        Business logic for updating user profile.
        """
        password = kwargs.pop("password", None)
        if password is not None:
            user.set_password(password)
            
        for field, value in kwargs.items():
            if hasattr(user, field) and value is not None:
                setattr(user, field, value)
        user.save()
        return user

