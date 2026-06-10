from django.contrib.auth import get_user_model

from apps.courses.models import Course
from apps.enrollments.models import Enrollment
from apps.payments.models import Payment

User = get_user_model()


class DashboardService:

    @staticmethod
    def get_dashboard_metrics():
        """
        Compute and return all admin dashboard metrics in a single dict.
        All metrics are computed fresh on each request — no caching in MVP.
        """

        # Counts
        total_students = User.objects.filter(role='student').count()
        total_courses = Course.objects.count()
        active_courses = Course.objects.filter(is_active=True, is_published=True).count()
        total_enrollments = Enrollment.objects.count()

        # Payment status counts
        pending_payments = Payment.objects.filter(status=Payment.STATUS_PENDING).count()
        approved_payments = Payment.objects.filter(status=Payment.STATUS_APPROVED).count()
        rejected_payments = Payment.objects.filter(status=Payment.STATUS_REJECTED).count()

        # Recent enrollments (latest 10)
        recent_enrollments = (
            Enrollment.objects
            .select_related('student', 'course')
            .order_by('-created_at')[:10]
        )

        recent_enrollments_data = [
            {
                'id': e.id,
                'student_username': e.student.username,
                'student_full_name': e.student.full_name,
                'course_title': e.course.title,
                'status': e.status,
                'enrolled_at': e.created_at.isoformat(),
            }
            for e in recent_enrollments
        ]

        return {
            'total_students': total_students,
            'total_courses': total_courses,
            'active_courses': active_courses,
            'total_enrollments': total_enrollments,
            'payments': {
                'pending': pending_payments,
                'approved': approved_payments,
                'rejected': rejected_payments,
            },
            'recent_enrollments': recent_enrollments_data,
        }
