from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from apps.courses.models import Category, Course
from apps.enrollments.models import Enrollment
from apps.payments.models import Payment

User = get_user_model()


class DashboardPermissionTests(APITestCase):
    """Test that the dashboard endpoint enforces admin-only access."""

    def setUp(self):
        self.url = reverse("admin-dashboard")
        self.student = User.objects.create_user(
            username="student1", email="s@test.com",
            password="pass123", full_name="Student One", role="student",
        )
        self.admin = User.objects.create_user(
            username="admin1", email="a@test.com",
            password="pass123", full_name="Admin One", role="admin",
        )

    def auth_as(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_requires_auth(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_blocks_students(self):
        self.auth_as(self.student)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_allows_admin(self):
        self.auth_as(self.admin)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)


class DashboardMetricsTests(APITestCase):
    """Test that dashboard metrics are computed correctly."""

    def setUp(self):
        self.url = reverse("admin-dashboard")
        self.admin = User.objects.create_user(
            username="admin1", email="a@test.com",
            password="pass123", full_name="Admin One", role="admin",
        )
        refresh = RefreshToken.for_user(self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        # Create some students
        self.s1 = User.objects.create_user(
            username="stu1", email="stu1@test.com",
            password="pass123", full_name="Stu One", role="student",
        )
        self.s2 = User.objects.create_user(
            username="stu2", email="stu2@test.com",
            password="pass123", full_name="Stu Two", role="student",
        )

        # Create category and courses
        self.cat = Category.objects.create(name="Programming")
        self.c1 = Course.objects.create(
            title="Python 101", short_description="Intro",
            description="Full desc", category=self.cat,
            price="29.99", is_active=True, is_published=True,
        )
        self.c2 = Course.objects.create(
            title="Draft Course", short_description="Draft",
            description="Not published", category=self.cat,
            price="19.99", is_active=True, is_published=False,
        )

    def test_response_contains_all_keys(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        for key in ["total_students", "total_courses", "active_courses",
                     "total_enrollments", "payments", "recent_enrollments"]:
            self.assertIn(key, resp.data)
        for key in ["pending", "approved", "rejected"]:
            self.assertIn(key, resp.data["payments"])

    def test_student_count(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.data["total_students"], 2)

    def test_course_counts(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.data["total_courses"], 2)
        self.assertEqual(resp.data["active_courses"], 1)  # only published + active

    def test_enrollment_count(self):
        Enrollment.objects.create(student=self.s1, course=self.c1, status="pending")
        Enrollment.objects.create(student=self.s2, course=self.c1, status="active")
        resp = self.client.get(self.url)
        self.assertEqual(resp.data["total_enrollments"], 2)

    def test_payment_status_counts(self):
        e1 = Enrollment.objects.create(student=self.s1, course=self.c1, status="pending")
        e2 = Enrollment.objects.create(student=self.s2, course=self.c1, status="active")
        Payment.objects.create(
            student=self.s1, course=self.c1, enrollment=e1,
            full_name="S1", email="s1@t.com", phone="123",
            proof_file="payments/proofs/test.pdf", status="pending",
        )
        Payment.objects.create(
            student=self.s2, course=self.c1, enrollment=e2,
            full_name="S2", email="s2@t.com", phone="456",
            proof_file="payments/proofs/test2.pdf", status="approved",
        )
        resp = self.client.get(self.url)
        self.assertEqual(resp.data["payments"]["pending"], 1)
        self.assertEqual(resp.data["payments"]["approved"], 1)
        self.assertEqual(resp.data["payments"]["rejected"], 0)

    def test_recent_enrollments_limit_and_order(self):
        """Should return at most 10 enrollments, newest first."""
        # Create 12 enrollments via different students/courses
        students = []
        for i in range(12):
            s = User.objects.create_user(
                username=f"bulk{i}", email=f"bulk{i}@t.com",
                password="pass123", full_name=f"Bulk {i}", role="student",
            )
            students.append(s)

        for i, s in enumerate(students):
            Enrollment.objects.create(student=s, course=self.c1, status="pending")

        resp = self.client.get(self.url)
        self.assertEqual(len(resp.data["recent_enrollments"]), 10)

    def test_recent_enrollment_data_shape(self):
        Enrollment.objects.create(student=self.s1, course=self.c1, status="pending")
        resp = self.client.get(self.url)
        entry = resp.data["recent_enrollments"][0]
        self.assertEqual(entry["student_username"], "stu1")
        self.assertEqual(entry["student_full_name"], "Stu One")
        self.assertEqual(entry["course_title"], "Python 101")
        self.assertEqual(entry["status"], "pending")
        self.assertIn("enrolled_at", entry)

    def test_empty_state(self):
        """Dashboard works with zero enrollments/payments."""
        resp = self.client.get(self.url)
        self.assertEqual(resp.data["total_enrollments"], 0)
        self.assertEqual(resp.data["payments"]["pending"], 0)
        self.assertEqual(resp.data["payments"]["approved"], 0)
        self.assertEqual(resp.data["payments"]["rejected"], 0)
        self.assertEqual(len(resp.data["recent_enrollments"]), 0)
