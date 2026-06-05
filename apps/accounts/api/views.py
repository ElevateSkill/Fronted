from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema

from apps.accounts.api.serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    ProfileUpdateSerializer,
    LogoutSerializer,
    RegisterResponseSerializer,
    LoginResponseSerializer,
)

User = get_user_model()

@extend_schema(tags=["Account"])
class RegisterView(generics.CreateAPIView):
    """
    Register a new user in the system. Role defaults to 'student'.
    Returns JWT access and refresh tokens.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

    @extend_schema(responses={201: RegisterResponseSerializer}, tags=["Account"])
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens for the newly registered user
        refresh = RefreshToken.for_user(user)
        
        response_data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


@extend_schema(responses={200: LoginResponseSerializer}, tags=["Account"])
class LoginView(TokenObtainPairView):
    """
    Obtain JWT access and refresh token pair along with user details.
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = (permissions.AllowAny,)

@extend_schema(tags=["Account"])
class LogoutView(APIView):
    """
    Blacklist the provided refresh token to logout the user.
    """
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = LogoutSerializer

    @extend_schema(request=LogoutSerializer, responses={200: dict, 400: dict}, tags=["Account"])
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            refresh_token = serializer.validated_data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Successfully logged out and token blacklisted."},
                status=status.HTTP_200_OK,
            )
        except Exception:
            return Response(
                {"detail": "Token is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

@extend_schema(tags=["Account"])
class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update the authenticated user's profile.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        # Always return the currently authenticated user
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return ProfileUpdateSerializer
        return UserSerializer
