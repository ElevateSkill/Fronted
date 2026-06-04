from django.contrib.auth import get_user_model

User = get_user_model()

class UserService:
    @staticmethod
    def register_user(username, email, password, full_name, role=User.STUDENT, phone_number=None):
        """
        Business logic for registering a new user.
        """
        user = User(
            username=username,
            email=email,
            full_name=full_name,
            role=role,
            phone_number=phone_number
        )
        user.set_password(password)
        user.save()
        return user

    @staticmethod
    def update_profile(user, **kwargs):
        """
        Business logic for updating user profile.
        """
        for field, value in kwargs.items():
            if hasattr(user, field) and value is not None:
                setattr(user, field, value)
        user.save()
        return user
