from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from utils.sanitize import sanitize_dict
from apps.enrollments.models import Enrollment
from apps.enrollments.services import EnrollmentService
from apps.payments.models import Payment
from apps.payments.validators import validate_proof_file


class PaymentService:
    @staticmethod
    def submit_payment(student, data, proof_file):
        if not proof_file:
            raise ValidationError({"proof_file": "Proof file is required."})

        validate_proof_file(proof_file)

        data = sanitize_dict(data, ["full_name", "email", "phone"])

        enrollment_id = data.get("enrollment_id")
        if not enrollment_id:
            raise ValidationError({"enrollment_id": "This field is required."})

    
        enrollment = get_object_or_404(
            Enrollment,
            id=enrollment_id,
            student=student,
            status=Enrollment.PENDING,
        )

        return Payment.objects.create(
            student=student,
            course=enrollment.course,
            enrollment=enrollment,
            full_name=data["full_name"],
            email=data["email"],
            phone=data["phone"],
            proof_file=proof_file,
            payment_method=data["payment_method"],
            status=Payment.STATUS_PENDING,
        )

    @staticmethod
    def get_student_payments(student):
        return (
            Payment.objects.filter(student=student)
            .select_related("course", "enrollment", "payment_method")
            .order_by("-submitted_at")
        )

    @staticmethod
    def get_all_payments():
        return (
            Payment.objects.all()
            .select_related("student", "course", "enrollment", "payment_method")
            .order_by("-submitted_at")
        )

    @staticmethod
    def approve_payment(payment_id):
        payment = get_object_or_404(Payment, id=payment_id)

        if payment.status != Payment.STATUS_PENDING:
            raise ValidationError("Only pending payments can be approved.")

        payment.status = Payment.STATUS_APPROVED
        payment.save(update_fields=["status", "updated_at"])

        EnrollmentService.update_status(
            payment.enrollment.id,
            Enrollment.ACTIVE
        )

        return payment

    @staticmethod
    def reject_payment(payment_id):
        payment = get_object_or_404(Payment, id=payment_id)

        if payment.status != Payment.STATUS_PENDING:
            raise ValidationError("Only pending payments can be rejected.")

        payment.status = Payment.STATUS_REJECTED
        payment.save(update_fields=["status", "updated_at"])

        EnrollmentService.update_status(
            payment.enrollment.id,
            Enrollment.CANCELLED
        )

        return payment