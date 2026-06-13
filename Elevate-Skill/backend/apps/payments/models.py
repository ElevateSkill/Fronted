from django.conf import settings
from django.db import models

from apps.courses.models import Course
from apps.enrollments.models import Enrollment
from apps.bank.models import BankAccountDetail

class Payment(models.Model):
    STATUS_PENDING = "pending"
    STATUS_APPROVED = "approved"
    STATUS_REJECTED = "rejected"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_APPROVED, "Approved"),
        (STATUS_REJECTED, "Rejected"),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments",
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="payments",
    )
    enrollment = models.ForeignKey(
        Enrollment,
        on_delete=models.CASCADE,
        related_name="payments",
    )
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    proof_file = models.FileField(upload_to="payments/proofs/")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    payment_method = models.ForeignKey(
        BankAccountDetail,
        on_delete=models.PROTECT,
        related_name="payments"
    )
    
    class Meta:
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['status']),
            models.Index(fields=['-submitted_at']),
        ]

    def __str__(self):
        return f"Payment by {self.student.username} for {self.course.title} ({self.status})"
