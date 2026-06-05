from rest_framework import serializers
from apps.enrollments.models import Enrollment
from apps.courses.api.serializers import CourseListSerializer
from apps.accounts.api.serializers import UserSerializer


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    student = UserSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "student", "course", "status", "created_at", "updated_at"]
        read_only_fields = ["id", "student", "course", "status", "created_at", "updated_at"]


class EnrollmentCreateSerializer(serializers.Serializer):
    course = serializers.IntegerField(
        help_text="ID of the course to enroll in"
    )
