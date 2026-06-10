from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from apps.courses.models import Category, Course
from apps.enrollments.models import Enrollment
from apps.enrollments.services import EnrollmentService

User = get_user_model()


class EnrollmentsTests(APITestCase):
    def setUp(self):
        # URLs
        self.create_url = reverse("enrollment-create")
        self.my_list_url = reverse("my-enrollments-list")

        # Setup Category & Courses
        self.category = Category.objects.create(name="Programming")

        self.published_course = Course.objects.create(
            title="Published Python",
            short_description="Short desc",
            description="Full description",
            category=self.category,
            price="49.99",
            is_active=True,
            is_published=True,
        )

        self.draft_course = Course.objects.create(
            title="Draft Python",
            short_description="Draft short",
            description="Draft description",
            category=self.category,
            price="29.99",
            is_active=True,
            is_published=False,
        )

        self.disabled_course = Course.objects.create(
            title="Disabled Python",
            short_description="Disabled short",
            description="Disabled description",
            category=self.category,
            price="19.99",
            is_active=False,
            is_published=True,
        )

        # Setup Users
        self.student1 = User.objects.create_user(
            username="student1",
            email="student1@test.com",
            password="password123",
            full_name="Student One",
        )

        self.student2 = User.objects.create_user(
            username="student2",
            email="student2@test.com",
            password="password123",
            full_name="Student Two",
        )

    def auth_as(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_enroll_success(self):
        """Test a student can enroll in an active & published course successfully."""
        self.auth_as(self.student1)
        payload = {"course": self.published_course.id}
        
        response = self.client.post(self.create_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], Enrollment.PENDING)
        self.assertEqual(response.data["course"]["id"], self.published_course.id)
        self.assertEqual(response.data["student"]["username"], self.student1.username)

        # Verify db entry
        self.assertTrue(
            Enrollment.objects.filter(
                student=self.student1,
                course=self.published_course,
                status=Enrollment.PENDING
            ).exists()
        )

    def test_enroll_duplicate_prevented(self):
        """Test that duplicate enrollment is prevented and returns 400 Bad Request."""
        self.auth_as(self.student1)
        
        # Initial enrollment
        payload = {"course": self.published_course.id}
        response = self.client.post(self.create_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Duplicate enrollment attempt
        response2 = self.client.post(self.create_url, payload)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("course", response2.data)

    def test_enroll_unpublished_or_inactive_course_prevented(self):
        """Test enrollment fails for draft or disabled courses."""
        self.auth_as(self.student1)

        # Enroll in draft course
        resp_draft = self.client.post(self.create_url, {"course": self.draft_course.id})
        self.assertEqual(resp_draft.status_code, status.HTTP_400_BAD_REQUEST)

        # Enroll in disabled course
        resp_disabled = self.client.post(self.create_url, {"course": self.disabled_course.id})
        self.assertEqual(resp_disabled.status_code, status.HTTP_400_BAD_REQUEST)

    def test_enroll_nonexistent_course_404(self):
        """Test enrollment returns 404 if the course does not exist."""
        self.auth_as(self.student1)
        resp = self.client.post(self.create_url, {"course": 9999})
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_my_enrollments_list_only_own(self):
        """Test that listing enrollments returns only the requesting student's own records."""
        # Create enrollment for student1
        Enrollment.objects.create(
            student=self.student1,
            course=self.published_course,
            status=Enrollment.PENDING
        )

        # Create another course and enroll student2
        another_course = Course.objects.create(
            title="Web Design",
            short_description="Short desc",
            description="Full description",
            category=self.category,
            price="39.99",
            is_active=True,
            is_published=True,
        )
        Enrollment.objects.create(
            student=self.student2,
            course=another_course,
            status=Enrollment.PENDING
        )

        # student1 lists
        self.auth_as(self.student1)
        resp1 = self.client.get(self.my_list_url)
        self.assertEqual(resp1.status_code, status.HTTP_200_OK)
        
        def get_results(resp):
            if isinstance(resp.data, dict) and 'results' in resp.data:
                return resp.data['results']
            return resp.data
            
        results1 = get_results(resp1)
        self.assertEqual(len(results1), 1)
        self.assertEqual(results1[0]["course"]["id"], self.published_course.id)

        # student2 lists
        self.auth_as(self.student2)
        resp2 = self.client.get(self.my_list_url)
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        results2 = get_results(resp2)
        self.assertEqual(len(results2), 1)
        self.assertEqual(results2[0]["course"]["id"], another_course.id)

    def test_unauthenticated_access_blocked(self):
        """Test that unauthenticated requests receive 401 Unauthorized."""
        # Create
        resp_create = self.client.post(self.create_url, {"course": self.published_course.id})
        self.assertEqual(resp_create.status_code, status.HTTP_401_UNAUTHORIZED)

        # List
        resp_list = self.client.get(self.my_list_url)
        self.assertEqual(resp_list.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_access_blocked(self):
        """Test that admin requests receive 403 Forbidden for student endpoints."""
        admin_user = User.objects.create_user(
            username="admin_test",
            email="admin_test@test.com",
            password="password123",
            full_name="Admin User",
            role=User.ADMIN,
        )
        self.auth_as(admin_user)
        
        # Try to enroll
        resp_create = self.client.post(self.create_url, {"course": self.published_course.id})
        self.assertEqual(resp_create.status_code, status.HTTP_403_FORBIDDEN)

        # Try to list
        resp_list = self.client.get(self.my_list_url)
        self.assertEqual(resp_list.status_code, status.HTTP_403_FORBIDDEN)

    def test_enrollment_service_status_update(self):
        """Test service method update_status transitions enrollment statuses correctly."""
        enrollment = Enrollment.objects.create(
            student=self.student1,
            course=self.published_course,
            status=Enrollment.PENDING
        )

        # Transition pending -> active
        EnrollmentService.update_status(enrollment.id, Enrollment.ACTIVE)
        enrollment.refresh_from_db()
        self.assertEqual(enrollment.status, Enrollment.ACTIVE)

        # Transition active -> cancelled
        EnrollmentService.update_status(enrollment.id, Enrollment.CANCELLED)
        enrollment.refresh_from_db()
        self.assertEqual(enrollment.status, Enrollment.CANCELLED)
