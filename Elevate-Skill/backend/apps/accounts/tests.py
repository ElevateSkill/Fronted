from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class AccountsTests(APITestCase):
    def setUp(self):
        self.register_url = reverse("register")
        self.login_url = reverse("login")
        self.logout_url = reverse("logout")
        self.profile_url = reverse("profile")
        
        self.user_data = {
            "username": "teststudent",
            "email": "student@test.com",
            "password": "password123",
            "full_name": "Test Student",
            "phone_number": "1234567890",
        }
        self.admin_data = {
            "username": "testadmin",
            "email": "admin@test.com",
            "password": "adminpassword123",
            "full_name": "Test Admin",
            "role": "admin",
        }
        
    def test_user_model_creation(self):
        """Test User model creation fields and defaults."""
        user = User.objects.create_user(
            username="newuser",
            email="new@test.com",
            password="password123",
            full_name="New User"
        )
        self.assertEqual(user.role, User.STUDENT)
        self.assertEqual(user.full_name, "New User")
        self.assertIsNone(user.phone_number)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        
    def test_user_registration_success(self):
        """Test user registration endpoint with default student role."""
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("refresh", response.data)
        self.assertIn("access", response.data)
        self.assertEqual(response.data["user"]["username"], "teststudent")
        self.assertEqual(response.data["user"]["role"], "student")
        self.assertNotIn("password", response.data["user"])
        
        # Verify db entry
        user = User.objects.get(username="teststudent")
        self.assertTrue(user.check_password("password123"))

    def test_user_registration_validation(self):
        """Test registration field validation."""
        # 1. Short password validation
        data = self.user_data.copy()
        data["password"] = "12345"
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)
        
        # Create a valid user
        self.client.post(self.register_url, self.user_data)
        
        # 2. Duplicate username validation
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)
        
        # 3. Duplicate email validation
        data = self.user_data.copy()
        data["username"] = "anotherusername"
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_user_login_success(self):
        """Test user login endpoint returns access/refresh token and user info."""
        user = User.objects.create_user(**self.user_data)
        
        login_payload = {
            "email": "student@test.com",
            "password": "password123"
        }
        response = self.client.post(self.login_url, login_payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["username"], user.username)
        self.assertEqual(response.data["user"]["role"], "student")

    def test_user_login_failure(self):
        """Test login fails with incorrect credentials."""
        User.objects.create_user(**self.user_data)
        
        login_payload = {
            "email": "student@test.com",
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, login_payload)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_logout_success(self):
        """Test logging out blacklists the refresh token."""
        user = User.objects.create_user(**self.user_data)
        refresh = RefreshToken.for_user(user)
        refresh_token_str = str(refresh)
        
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        
        logout_payload = {
            "refresh": refresh_token_str
        }
        response = self.client.post(self.logout_url, logout_payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "Successfully logged out and token blacklisted.")

    def test_profile_retrieve(self):
        """Test retrieving authenticated user's profile."""
        user = User.objects.create_user(**self.user_data)
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], user.username)
        self.assertEqual(response.data["full_name"], user.full_name)
        self.assertEqual(response.data["phone_number"], user.phone_number)

    def test_profile_update(self):
        """Test updating user profile details."""
        user = User.objects.create_user(**self.user_data)
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        
        update_payload = {
            "full_name": "Updated Name",
            "phone_number": "0987654321"
        }
        response = self.client.put(self.profile_url, update_payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["full_name"], "Updated Name")
        self.assertEqual(response.data["phone_number"], "0987654321")
        
        # Verify db changes
        user.refresh_from_db()
        self.assertEqual(user.full_name, "Updated Name")
        self.assertEqual(user.phone_number, "0987654321")

    def test_profile_update_password(self):
        """Test updating user password through profile update endpoint."""
        user = User.objects.create_user(**self.user_data)
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        
        update_payload = {
            "password": "newpassword123"
        }
        response = self.client.put(self.profile_url, update_payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify db changes (password should be hashed and updated)
        user.refresh_from_db()
        self.assertTrue(user.check_password("newpassword123"))


    def test_unauthenticated_profile_access(self):
        """Test unauthenticated requests are blocked from profile."""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
