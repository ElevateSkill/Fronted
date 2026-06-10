from django.shortcuts import get_object_or_404
from apps.courses.models import Course


class CourseService:

    @staticmethod
    def get_published_courses():
        """Return only courses visible to the public."""
        return Course.objects.filter(is_active=True, is_published=True).select_related('category')

    @staticmethod
    def get_course_detail(course_id):
        """Return a single published course or raise 404."""
        return get_object_or_404(Course, id=course_id, is_active=True, is_published=True)

    @staticmethod
    def get_all_courses():
        """Admin: return all courses regardless of status."""
        return Course.objects.all().select_related('category').order_by('-created_at')

    @staticmethod
    def delete_course(instance):
        instance.delete()
