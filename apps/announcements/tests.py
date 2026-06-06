from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from apps.announcements.models import Announcement, NewsPost

User = get_user_model()


class AnnouncementsModelTests(APITestCase):
    """
    Test Announcements model features and ordering.
    """
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin1",
            email="admin1@test.com",
            password="adminpassword",
            full_name="Admin One",
            role="admin",
        )

    def test_announcement_creation(self):
        announcement = Announcement.objects.create(
            title="Important Announcement",
            content="This is the content.",
            is_published=True,
            created_by=self.admin
        )
        self.assertEqual(announcement.title, "Important Announcement")
        self.assertEqual(announcement.content, "This is the content.")
        self.assertTrue(announcement.is_published)
        self.assertEqual(announcement.created_by, self.admin)
        self.assertEqual(str(announcement), "Important Announcement")


class AnnouncementsApiTests(APITestCase):
    """
    Test permissions, CRUD, and visibility rules for Announcements endpoints.
    """
    def setUp(self):
        # URLs
        self.admin_list_create_url = reverse("admin-announcement-list-create")
        self.student_list_url = reverse("student-announcement-list")

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

        # Create sample announcements
        self.pub_announcement = Announcement.objects.create(
            title="Published Announcement",
            content="Content for all students.",
            is_published=True,
            created_by=self.admin
        )
        self.draft_announcement = Announcement.objects.create(
            title="Draft Announcement",
            content="Internal admin content.",
            is_published=False,
            created_by=self.admin
        )

    def auth_as(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_admin_list_announcements(self):
        self.auth_as(self.admin)
        response = self.client.get(self.admin_list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Admins should see both published and unpublished
        self.assertEqual(len(response.data), 2)

    def test_admin_create_announcement(self):
        self.auth_as(self.admin)
        payload = {
            "title": "New Alert",
            "content": "This is a new alert content.",
            "is_published": True
        }
        response = self.client.post(self.admin_list_create_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Alert")
        # Ensure it assigns created_by automatically
        self.assertEqual(response.data["created_by"]["id"], self.admin.id)

    def test_admin_detail_update_delete(self):
        self.auth_as(self.admin)
        url = reverse("admin-announcement-detail", kwargs={"pk": self.pub_announcement.pk})

        # Retrieve
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Update
        payload = {
            "title": "Updated Title",
            "content": "Updated content.",
            "is_published": False
        }
        resp = self.client.put(url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "Updated Title")
        self.assertFalse(resp.data["is_published"])

        # Delete
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Announcement.objects.filter(pk=self.pub_announcement.pk).exists())

    def test_admin_endpoints_restrict_unauthorized(self):
        # Anonymous user (no auth)
        self.assertEqual(self.client.get(self.admin_list_create_url).status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(self.client.post(self.admin_list_create_url, {}).status_code, status.HTTP_401_UNAUTHORIZED)

        # Student user (forbidden role)
        self.auth_as(self.student)
        self.assertEqual(self.client.get(self.admin_list_create_url).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.post(self.admin_list_create_url, {}).status_code, status.HTTP_403_FORBIDDEN)

    def test_student_list_announcements(self):
        self.auth_as(self.student)
        response = self.client.get(self.student_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Students should only see published announcements
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.pub_announcement.id)

    def test_student_list_requires_jwt(self):
        response = self.client.get(self.student_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class NewsPostModelTests(APITestCase):
    """
    Test NewsPost model features.
    """
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin1",
            email="admin1@test.com",
            password="adminpassword",
            full_name="Admin One",
            role="admin",
        )

    def test_newspost_creation(self):
        news = NewsPost.objects.create(
            title="LMS Launching Soon",
            excerpt="Short description",
            content="This is the full news post body.",
            status=NewsPost.PUBLISHED,
            author=self.admin
        )
        self.assertEqual(news.title, "LMS Launching Soon")
        self.assertEqual(news.excerpt, "Short description")
        self.assertEqual(news.content, "This is the full news post body.")
        self.assertEqual(news.status, NewsPost.PUBLISHED)
        self.assertEqual(news.author, self.admin)
        self.assertEqual(str(news), "LMS Launching Soon")


class NewsPostApiTests(APITestCase):
    """
    Test permissions, CRUD, and public visibility rules for NewsPost endpoints.
    """
    def setUp(self):
        # URLs
        self.admin_list_create_url = reverse("admin-news-list-create")
        self.public_list_url = reverse("public-news-list")

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

        # Create sample news posts
        self.pub_news = NewsPost.objects.create(
            title="Published News",
            excerpt="Short excerpt.",
            content="Full body text.",
            status=NewsPost.PUBLISHED,
            author=self.admin
        )
        self.draft_news = NewsPost.objects.create(
            title="Draft News",
            excerpt="Short draft excerpt.",
            content="Internal admin draft content.",
            status=NewsPost.DRAFT,
            author=self.admin
        )

    def auth_as(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_admin_list_news(self):
        self.auth_as(self.admin)
        response = self.client.get(self.admin_list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Admins should see both draft and published posts
        self.assertEqual(len(response.data), 2)

    def test_admin_create_news(self):
        self.auth_as(self.admin)
        payload = {
            "title": "New Post Title",
            "excerpt": "New excerpt",
            "content": "New post full content.",
            "status": "published"
        }
        response = self.client.post(self.admin_list_create_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Post Title")
        # Ensure it assigns author automatically
        self.assertEqual(response.data["author"]["id"], self.admin.id)

    def test_admin_detail_update_delete(self):
        self.auth_as(self.admin)
        url = reverse("admin-news-detail", kwargs={"pk": self.pub_news.pk})

        # Retrieve
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Update
        payload = {
            "title": "Updated Title",
            "excerpt": "Updated excerpt",
            "content": "Updated content.",
            "status": "draft"
        }
        resp = self.client.put(url, payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "Updated Title")
        self.assertEqual(resp.data["status"], "draft")

        # Delete
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(NewsPost.objects.filter(pk=self.pub_news.pk).exists())

    def test_admin_endpoints_restrict_unauthorized(self):
        # Anonymous user (no auth)
        self.assertEqual(self.client.get(self.admin_list_create_url).status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(self.client.post(self.admin_list_create_url, {}).status_code, status.HTTP_401_UNAUTHORIZED)

        # Student user (forbidden role)
        self.auth_as(self.student)
        self.assertEqual(self.client.get(self.admin_list_create_url).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.post(self.admin_list_create_url, {}).status_code, status.HTTP_403_FORBIDDEN)

    def test_public_list_news(self):
        # Public feed should not require authentication
        response = self.client.get(self.public_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see published news posts
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.pub_news.id)
