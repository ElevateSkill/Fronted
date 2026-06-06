from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from apps.cms.models import HeroSection, About, SiteSettings

User = get_user_model()


class CmsModelTests(APITestCase):
    """
    Test that the singleton pattern works correctly at the model layer.
    """
    def test_hero_section_singleton(self):
        hero1 = HeroSection.objects.create(title="First Hero", subtitle="First Subtitle")
        self.assertEqual(HeroSection.objects.count(), 1)
        self.assertEqual(hero1.pk, 1)

        # Creating a second one should overwrite the first (pk=1)
        hero2 = HeroSection(title="Second Hero", subtitle="Second Subtitle")
        hero2.save()
        self.assertEqual(HeroSection.objects.count(), 1)
        self.assertEqual(HeroSection.objects.first().title, "Second Hero")

    def test_about_singleton(self):
        about1 = About.objects.create(title="First About", content="First Content")
        self.assertEqual(About.objects.count(), 1)
        self.assertEqual(about1.pk, 1)

        about2 = About(title="Second About", content="Second Content")
        about2.save()
        self.assertEqual(About.objects.count(), 1)
        self.assertEqual(About.objects.first().title, "Second About")

    def test_site_settings_singleton(self):
        settings1 = SiteSettings.objects.create(site_name="First Site")
        self.assertEqual(SiteSettings.objects.count(), 1)
        self.assertEqual(settings1.pk, 1)

        settings2 = SiteSettings(site_name="Second Site")
        settings2.save()
        self.assertEqual(SiteSettings.objects.count(), 1)
        self.assertEqual(SiteSettings.objects.first().site_name, "Second Site")


class CmsApiTests(APITestCase):
    """
    Test permissions and CRUD behavior for the admin CMS endpoints.
    """
    def setUp(self):
        # URLs
        self.hero_url = reverse("admin-hero")
        self.about_url = reverse("admin-about")
        self.settings_url = reverse("admin-site-settings")

        # Create users
        self.student = User.objects.create_user(
            username="student1",
            email="student1@test.com",
            password="password123",
            full_name="Student One",
            role="student",
        )
        self.admin = User.objects.create_user(
            username="admin1",
            email="admin1@test.com",
            password="adminpassword",
            full_name="Admin One",
            role="admin",
        )

    def auth_as(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_endpoints_require_auth(self):
        # No authentication should yield 401 Unauthorized
        self.assertEqual(self.client.get(self.hero_url).status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(self.client.get(self.about_url).status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(self.client.get(self.settings_url).status_code, status.HTTP_401_UNAUTHORIZED)

    def test_endpoints_block_students(self):
        # Student user should yield 403 Forbidden
        self.auth_as(self.student)
        self.assertEqual(self.client.get(self.hero_url).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.get(self.about_url).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.get(self.settings_url).status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_retrieve_creates_defaults_if_not_exist(self):
        self.auth_as(self.admin)

        # GET hero
        resp = self.client.get(self.hero_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "")

        # GET about
        resp = self.client.get(self.about_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "")

        # GET site settings
        resp = self.client.get(self.settings_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["site_name"], "")

    def test_admin_update_hero(self):
        self.auth_as(self.admin)
        payload = {
            "title": "Welcome to Elevate",
            "subtitle": "Learn anything",
            "cta_text": "Get Started",
            "cta_link": "/courses/",
        }
        resp = self.client.put(self.hero_url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "Welcome to Elevate")
        self.assertEqual(resp.data["subtitle"], "Learn anything")
        self.assertEqual(resp.data["cta_text"], "Get Started")
        self.assertEqual(resp.data["cta_link"], "/courses/")

    def test_admin_update_about(self):
        self.auth_as(self.admin)
        payload = {
            "title": "About Elevate",
            "content": "We are a leading LMS platform.",
        }
        resp = self.client.put(self.about_url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "About Elevate")
        self.assertEqual(resp.data["content"], "We are a leading LMS platform.")

    def test_admin_update_site_settings(self):
        self.auth_as(self.admin)
        payload = {
            "site_name": "Elevate LMS",
            "contact_info": "admin@elevate.com",
            "bank_details": "Bank of Elevate",
            "payment_instructions": "Send receipt after transfer.",
        }
        resp = self.client.put(self.settings_url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["site_name"], "Elevate LMS")
        self.assertEqual(resp.data["contact_info"], "admin@elevate.com")
        self.assertEqual(resp.data["bank_details"], "Bank of Elevate")
        self.assertEqual(resp.data["payment_instructions"], "Send receipt after transfer.")
