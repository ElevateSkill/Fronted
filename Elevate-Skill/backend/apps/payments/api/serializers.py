from rest_framework import serializers

from apps.payments.models import Payment


class PaymentSubmitSerializer(serializers.ModelSerializer):
    enrollment_id = serializers.IntegerField(write_only=True)
    proof_file = serializers.FileField()

    class Meta:
        model = Payment
        fields = [
            "id",
            "enrollment_id",
            "full_name",
            "email",
            "phone",
            "proof_file",
            "status",
            "submitted_at",
        ]
        read_only_fields = ["status", "submitted_at"]


class PaymentListSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    student_username = serializers.CharField(source="student.username", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "student_username",
            "course_title",
            "full_name",
            "email",
            "phone",
            "proof_file",
            "status",
            "submitted_at",
            "updated_at",
        ]
