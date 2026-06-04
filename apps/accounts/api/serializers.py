from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.accounts.services import UserService

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "full_name",
            "role",
            "phone_number",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "role", "created_at", "updated_at")

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ("username", "email", "password", "full_name", "role", "phone_number")
        extra_kwargs = {
            "role": {"default": User.STUDENT, "required": False},
            "phone_number": {"required": False, "allow_null": True},
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        return UserService.register_user(**validated_data)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims to the JWT payload
        token["role"] = user.role
        token["username"] = user.username
        token["email"] = user.email
        token["full_name"] = user.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add custom user data to the response body
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "full_name": self.user.full_name,
            "role": self.user.role,
            "phone_number": self.user.phone_number,
        }
        return data

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("full_name", "email", "phone_number")
        extra_kwargs = {
            "email": {"required": False},
            "full_name": {"required": False},
            "phone_number": {"required": False, "allow_null": True},
        }

    def validate_email(self, value):
        user = self.context["request"].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def update(self, instance, validated_data):
        return UserService.update_profile(instance, **validated_data)

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(help_text="The refresh token to be blacklisted.")

class RegisterResponseSerializer(serializers.Serializer):
    refresh = serializers.CharField(help_text="The refresh token.")
    access = serializers.CharField(help_text="The access token.")
    user = UserSerializer()

class LoginResponseSerializer(serializers.Serializer):
    refresh = serializers.CharField(help_text="The refresh token.")
    access = serializers.CharField(help_text="The access token.")
    user = UserSerializer()


