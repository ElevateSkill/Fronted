from rest_framework import serializers
from apps.payments.models import Payment
from apps.bank.models import BankAccountDetail


class PaymentSubmitSerializer(serializers.ModelSerializer):
    enrollment_id = serializers.IntegerField(write_only=True)

    proof_file = serializers.FileField()

    payment_method = serializers.PrimaryKeyRelatedField(
        queryset=BankAccountDetail.objects.filter(is_active=True)
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "enrollment_id",
            "full_name",
            "email",
            "phone",
            "proof_file",
            "payment_method",
            "status",
            "submitted_at",
        ]
        read_only_fields = ["status", "submitted_at"]


class PaymentListSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    student_email = serializers.CharField(source="student.email", read_only=True)

    payment_method = serializers.CharField(
        source="payment_method.bank_name",
        read_only=True
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "student_email",
            "course_title",
            "full_name",
            "email",
            "phone",
            "proof_file",
            "payment_method",
            "status",
            "submitted_at",
            "updated_at",
        ]
        