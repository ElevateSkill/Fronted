from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from apps.cms.models import HeroSection, About, SiteSettings, Testimonial, FAQ

User = get_user_model()


def get_results(resp):
    if isinstance(resp.data, dict) and 'results' in resp.data:
        return resp.data['results']
    return resp.data


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


class TestimonialModelTests(APITestCase):
    """Test Testimonial model behaviour."""

    def test_create_testimonial(self):
        t = Testimonial.objects.create(
            student_name="Alice", message="Great course!", rating=5
        )
        self.assertEqual(str(t), "Alice (5★)")
        self.assertTrue(t.is_active)

    def test_rating_validators(self):
        """Rating outside 1-5 should fail full_clean validation."""
        t = Testimonial(student_name="Bob", message="Bad", rating=0)
        with self.assertRaises(Exception):
            t.full_clean()

        t2 = Testimonial(student_name="Bob", message="Bad", rating=6)
        with self.assertRaises(Exception):
            t2.full_clean()

    def test_valid_ratings_pass(self):
        for r in [1, 3, 5]:
            t = Testimonial(student_name="Test", message="msg", rating=r)
            t.full_clean()  # should not raise


class FAQModelTests(APITestCase):
    """Test FAQ model behaviour."""

    def test_create_faq(self):
        faq = FAQ.objects.create(question="What is this?", answer="A platform.")
        self.assertEqual(str(faq), "What is this?")
        self.assertTrue(faq.is_active)
        self.assertEqual(faq.order, 0)

    def test_ordering(self):
        faq2 = FAQ.objects.create(question="Second", answer="B", order=2)
        faq1 = FAQ.objects.create(question="First", answer="A", order=1)
        faqs = list(FAQ.objects.all())
        self.assertEqual(faqs[0].question, "First")
        self.assertEqual(faqs[1].question, "Second")


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


class AdminTestimonialApiTests(APITestCase):
    """Test admin CRUD for Testimonials."""

    def setUp(self):
        self.list_url = reverse("admin-testimonial-list")
        self.student = User.objects.create_user(
            username="student1", email="s@test.com",
            password="pass123", full_name="Student", role="student",
        )
        self.admin = User.objects.create_user(
            username="admin1", email="a@test.com",
            password="pass123", full_name="Admin", role="admin",
        )

    def auth_as(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def detail_url(self, pk):
        return reverse("admin-testimonial-detail", args=[pk])

    # ── Auth / Permission ──

    def test_requires_auth(self):
        self.assertEqual(self.client.get(self.list_url).status_code, status.HTTP_401_UNAUTHORIZED)

    def test_blocks_students(self):
        self.auth_as(self.student)
        self.assertEqual(self.client.get(self.list_url).status_code, status.HTTP_403_FORBIDDEN)

    # ── CRUD ──

    def test_create_testimonial(self):
        self.auth_as(self.admin)
        payload = {"student_name": "Alice", "message": "Awesome!", "rating": 5}
        resp = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["student_name"], "Alice")
        self.assertEqual(resp.data["rating"], 5)
        self.assertTrue(resp.data["is_active"])

    def test_create_invalid_rating(self):
        self.auth_as(self.admin)
        resp = self.client.post(self.list_url, {
            "student_name": "Bob", "message": "Bad", "rating": 0
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

        resp = self.client.post(self.list_url, {
            "student_name": "Bob", "message": "Bad", "rating": 6
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_all_testimonials(self):
        self.auth_as(self.admin)
        Testimonial.objects.create(student_name="A", message="m", rating=5, is_active=True)
        Testimonial.objects.create(student_name="B", message="m", rating=3, is_active=False)
        resp = self.client.get(self.list_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_results(resp)), 2)  # admin sees all

    def test_update_testimonial(self):
        self.auth_as(self.admin)
        t = Testimonial.objects.create(student_name="Old", message="m", rating=3)
        resp = self.client.patch(self.detail_url(t.pk), {"student_name": "New"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["student_name"], "New")

    def test_delete_testimonial(self):
        self.auth_as(self.admin)
        t = Testimonial.objects.create(student_name="Del", message="m", rating=4)
        resp = self.client.delete(self.detail_url(t.pk))
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Testimonial.objects.count(), 0)


class AdminFAQApiTests(APITestCase):
    """Test admin CRUD for FAQs."""

    def setUp(self):
        self.list_url = reverse("admin-faq-list")
        self.student = User.objects.create_user(
            username="student1", email="s@test.com",
            password="pass123", full_name="Student", role="student",
        )
        self.admin = User.objects.create_user(
            username="admin1", email="a@test.com",
            password="pass123", full_name="Admin", role="admin",
        )

    def auth_as(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def detail_url(self, pk):
        return reverse("admin-faq-detail", args=[pk])

    def test_requires_auth(self):
        self.assertEqual(self.client.get(self.list_url).status_code, status.HTTP_401_UNAUTHORIZED)

    def test_blocks_students(self):
        self.auth_as(self.student)
        self.assertEqual(self.client.get(self.list_url).status_code, status.HTTP_403_FORBIDDEN)

    def test_create_faq(self):
        self.auth_as(self.admin)
        resp = self.client.post(self.list_url, {
            "question": "How to enroll?", "answer": "Click enroll.", "order": 1
        }, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["question"], "How to enroll?")
        self.assertEqual(resp.data["order"], 1)

    def test_list_all_faqs(self):
        self.auth_as(self.admin)
        FAQ.objects.create(question="Q1", answer="A1", is_active=True)
        FAQ.objects.create(question="Q2", answer="A2", is_active=False)
        resp = self.client.get(self.list_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_results(resp)), 2)  # admin sees all

    def test_update_faq(self):
        self.auth_as(self.admin)
        faq = FAQ.objects.create(question="Old?", answer="Old.")
        resp = self.client.patch(self.detail_url(faq.pk), {"question": "New?"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["question"], "New?")

    def test_delete_faq(self):
        self.auth_as(self.admin)
        faq = FAQ.objects.create(question="Del?", answer="Del.")
        resp = self.client.delete(self.detail_url(faq.pk))
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(FAQ.objects.count(), 0)

    def test_faq_ordering(self):
        """FAQs should be returned ordered by 'order' ascending."""
        self.auth_as(self.admin)
        FAQ.objects.create(question="Second", answer="B", order=2)
        FAQ.objects.create(question="First", answer="A", order=1)
        resp = self.client.get(self.list_url)
        results = get_results(resp)
        self.assertEqual(results[0]["question"], "First")
        self.assertEqual(results[1]["question"], "Second")


class HomepageApiTests(APITestCase):
    """Test the public /api/v1/homepage/ endpoint."""

    def setUp(self):
        self.url = reverse("homepage")

    def test_homepage_is_public(self):
        """No auth required."""
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_homepage_returns_expected_keys(self):
        resp = self.client.get(self.url)
        self.assertIn("hero", resp.data)
        self.assertIn("about", resp.data)
        self.assertIn("site_settings", resp.data)
        self.assertIn("testimonials", resp.data)
        self.assertIn("faqs", resp.data)

    def test_homepage_only_active_testimonials(self):
        Testimonial.objects.create(student_name="Active", message="m", rating=5, is_active=True)
        Testimonial.objects.create(student_name="Hidden", message="m", rating=3, is_active=False)
        resp = self.client.get(self.url)
        self.assertEqual(len(resp.data["testimonials"]), 1)
        self.assertEqual(resp.data["testimonials"][0]["student_name"], "Active")

    def test_homepage_only_active_faqs(self):
        FAQ.objects.create(question="Visible", answer="Yes", is_active=True)
        FAQ.objects.create(question="Hidden", answer="No", is_active=False)
        resp = self.client.get(self.url)
        self.assertEqual(len(resp.data["faqs"]), 1)
        self.assertEqual(resp.data["faqs"][0]["question"], "Visible")

    def test_homepage_faq_ordering(self):
        FAQ.objects.create(question="Second", answer="B", order=2, is_active=True)
        FAQ.objects.create(question="First", answer="A", order=1, is_active=True)
        resp = self.client.get(self.url)
        self.assertEqual(resp.data["faqs"][0]["question"], "First")
        self.assertEqual(resp.data["faqs"][1]["question"], "Second")

    def test_homepage_empty_when_no_content(self):
        resp = self.client.get(self.url)
        self.assertEqual(len(resp.data["testimonials"]), 0)
        self.assertEqual(len(resp.data["faqs"]), 0)
