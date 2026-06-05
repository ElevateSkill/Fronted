import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.courses.models import Category, Course
from apps.enrollments.models import Enrollment
from apps.payments.models import Payment
from apps.payments.services import PaymentService

User = get_user_model()
class PaymentsTests(APITestCase):
    @classmethod
    def setUpClass(cls):
        cls._media_root = tempfile.mkdtemp()
        cls._media_override = override_settings(MEDIA_ROOT=cls._media_root)
        cls._media_override.enable()
        super().setUpClass()

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls._media_override.disable()
        shutil.rmtree(cls._media_root, ignore_errors=True)

    def setUp(self):
        self.student_payments_url = reverse("student-payments")
        self.admin_payment_list_url = reverse("admin-payment-list")

        self.category = Category.objects.create(name="Programming")
        self.course = Course.objects.create(
            title="Django Bootcamp",
            short_description="Learn Django",
            description="Full Django course",
            category=self.category,
            price="99.99",
            is_active=True,
            is_published=True,
        )

        self.student = User.objects.create_user(
            username="student1",
            email="student1@test.com",
            password="password123",
            full_name="Student One",
        )
        self.other_student = User.objects.create_user(
            username="student2",
            email="student2@test.com",
            password="password123",
            full_name="Student Two",
        )
        self.admin = User.objects.create_user(
            username="admin1",
            email="admin1@test.com",
            password="password123",
            full_name="Admin One",
            role="admin",
        )

        self.student_enrollment = Enrollment.objects.create(
            student=self.student,
            course=self.course,
            status=Enrollment.PENDING,
        )
        self.other_enrollment = Enrollment.objects.create(
            student=self.other_student,
            course=self.course,
            status=Enrollment.PENDING,
        )

    def auth_as(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def build_proof_file(self, name="proof.pdf", content=b"%PDF-1.4 test content", content_type="application/pdf"):
        return SimpleUploadedFile(name, content, content_type=content_type)

    def test_student_can_submit_payment(self):
        self.auth_as(self.student)
        payload = {
            "enrollment_id": self.student_enrollment.id,
            "full_name": "Student One",
            "email": "student1@test.com",
            "phone": "1234567890",
            "proof_file": self.build_proof_file(),
        }

        response = self.client.post(self.student_payments_url, payload, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], Payment.STATUS_PENDING)
        self.assertEqual(response.data["full_name"], "Student One")
        self.assertTrue(Payment.objects.filter(student=self.student, enrollment=self.student_enrollment).exists())

    def test_payment_submission_requires_valid_file_type(self):
        self.auth_as(self.student)
        payload = {
            "enrollment_id": self.student_enrollment.id,
            "full_name": "Student One",
            "email": "student1@test.com",
            "phone": "1234567890",
            "proof_file": self.build_proof_file(name="proof.txt", content=b"bad", content_type="text/plain"),
        }

        response = self.client.post(self.student_payments_url, payload, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsInstance(response.data, list)
        self.assertIn("Only PDF, JPG, and PNG files are accepted.", str(response.data[0]))
        self.assertFalse(Payment.objects.exists())

    def test_payment_submission_requires_file_size_limit(self):
        self.auth_as(self.student)
        payload = {
            "enrollment_id": self.student_enrollment.id,
            "full_name": "Student One",
            "email": "student1@test.com",
            "phone": "1234567890",
            "proof_file": self.build_proof_file(content=b"x" * (5 * 1024 * 1024 + 1)),
        }

        response = self.client.post(self.student_payments_url, payload, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsInstance(response.data, list)
        self.assertIn("File size must not exceed 5MB.", str(response.data[0]))

    def test_student_payment_list_returns_only_own_payments(self):
        own_payment = Payment.objects.create(
            student=self.student,
            course=self.course,
            enrollment=self.student_enrollment,
            full_name="Student One",
            email="student1@test.com",
            phone="1234567890",
            proof_file=self.build_proof_file(),
        )
        Payment.objects.create(
            student=self.other_student,
            course=self.course,
            enrollment=self.other_enrollment,
            full_name="Student Two",
            email="student2@test.com",
            phone="1234567891",
            proof_file=self.build_proof_file(name="other.pdf"),
        )

        self.auth_as(self.student)
        response = self.client.get(self.student_payments_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], own_payment.id)

    def test_admin_can_list_all_payments(self):
        Payment.objects.create(
            student=self.student,
            course=self.course,
            enrollment=self.student_enrollment,
            full_name="Student One",
            email="student1@test.com",
            phone="1234567890",
            proof_file=self.build_proof_file(),
        )
        Payment.objects.create(
            student=self.other_student,
            course=self.course,
            enrollment=self.other_enrollment,
            full_name="Student Two",
            email="student2@test.com",
            phone="1234567891",
            proof_file=self.build_proof_file(name="other.pdf"),
        )

        self.auth_as(self.admin)
        response = self.client.get(self.admin_payment_list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_only_admin_can_access_admin_payment_list(self):
        self.auth_as(self.student)
        response = self.client.get(self.admin_payment_list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_approve_payment_and_activate_enrollment(self):
        payment = Payment.objects.create(
            student=self.student,
            course=self.course,
            enrollment=self.student_enrollment,
            full_name="Student One",
            email="student1@test.com",
            phone="1234567890",
            proof_file=self.build_proof_file(),
        )
        approve_url = reverse("admin-payment-approve", kwargs={"pk": payment.id})

        self.auth_as(self.admin)
        response = self.client.put(approve_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payment.refresh_from_db()
        self.student_enrollment.refresh_from_db()
        self.assertEqual(payment.status, Payment.STATUS_APPROVED)
        self.assertEqual(self.student_enrollment.status, Enrollment.ACTIVE)

    def test_admin_can_reject_payment_and_cancel_enrollment(self):
        payment = Payment.objects.create(
            student=self.student,
            course=self.course,
            enrollment=self.student_enrollment,
            full_name="Student One",
            email="student1@test.com",
            phone="1234567890",
            proof_file=self.build_proof_file(),
        )
        reject_url = reverse("admin-payment-reject", kwargs={"pk": payment.id})

        self.auth_as(self.admin)
        response = self.client.put(reject_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payment.refresh_from_db()
        self.student_enrollment.refresh_from_db()
        self.assertEqual(payment.status, Payment.STATUS_REJECTED)
        self.assertEqual(self.student_enrollment.status, Enrollment.CANCELLED)

    def test_non_pending_payment_cannot_be_reapproved(self):
        payment = Payment.objects.create(
            student=self.student,
            course=self.course,
            enrollment=self.student_enrollment,
            full_name="Student One",
            email="student1@test.com",
            phone="1234567890",
            proof_file=self.build_proof_file(),
            status=Payment.STATUS_APPROVED,
        )

        with self.assertRaisesMessage(ValidationError, "Only pending payments can be approved."):
            PaymentService.approve_payment(payment.id)
