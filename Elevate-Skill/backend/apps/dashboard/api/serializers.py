from rest_framework import serializers


class RecentEnrollmentSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    student_username = serializers.CharField()
    student_full_name = serializers.CharField()
    course_title = serializers.CharField()
    status = serializers.CharField()
    enrolled_at = serializers.CharField()


class PaymentStatsSerializer(serializers.Serializer):
    pending = serializers.IntegerField()
    approved = serializers.IntegerField()
    rejected = serializers.IntegerField()


class DashboardSerializer(serializers.Serializer):
    total_students = serializers.IntegerField()
    total_courses = serializers.IntegerField()
    active_courses = serializers.IntegerField()
    total_enrollments = serializers.IntegerField()
    payments = PaymentStatsSerializer()
    recent_enrollments = RecentEnrollmentSerializer(many=True)
