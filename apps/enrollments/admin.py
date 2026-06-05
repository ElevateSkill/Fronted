from django.contrib import admin
from apps.enrollments.models import Enrollment


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ["student", "course", "status", "created_at", "updated_at"]
    list_filter = ["status", "created_at", "course"]
    search_fields = ["student__username", "student__email", "course__title"]
    readonly_fields = ["created_at", "updated_at"]
