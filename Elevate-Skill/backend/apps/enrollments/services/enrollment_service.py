from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from apps.courses.models import Course
from apps.enrollments.models import Enrollment


class EnrollmentService:

    @staticmethod
    def get_student_enrollments(student):
        """Retrieve all enrollment records for the given student."""
        return Enrollment.objects.filter(student=student).select_related(
            "course", "course__category"
        )

    @staticmethod
    def create_enrollment(student, course_id):
        """
        Create a pending enrollment for a student in a course.
        Guards against duplicate enrollment and unpublished/inactive courses.
        """
        if not course_id:
            raise ValidationError({"course": "Course ID is required."})

        # Check course existence (raises 404 if not found)
        course = get_object_or_404(Course, id=course_id)

        # Guard: Course must be active and published
        if not (course.is_active and course.is_published):
            raise ValidationError({"course": "Cannot enroll in an inactive or unpublished course."})

        # Guard: Duplicate enrollment check
        if Enrollment.objects.filter(student=student, course=course).exists():
            raise ValidationError({"course": "You are already enrolled in this course."})

        # Create the pending enrollment
        return Enrollment.objects.create(
            student=student,
            course=course,
            status=Enrollment.PENDING
        )

    @staticmethod
    def update_status(enrollment_id, new_status):
        """
        Update the status of an enrollment.
        Valid status transitions: pending -> active or cancelled, etc.
        """
        enrollment = get_object_or_404(Enrollment, id=enrollment_id)
        valid_statuses = [choice[0] for choice in Enrollment.STATUS_CHOICES]

        if new_status not in valid_statuses:
            raise ValidationError({"status": f"Invalid status: {new_status}."})

        enrollment.status = new_status
        enrollment.save()
        return enrollment
