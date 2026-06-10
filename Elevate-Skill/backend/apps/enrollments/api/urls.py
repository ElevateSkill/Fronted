from django.urls import re_path
from apps.enrollments.api.views import (
    EnrollmentCreateView,
    MyEnrollmentListView,
)

urlpatterns = [
    re_path(r"^enrollments/?$", EnrollmentCreateView.as_view(), name="enrollment-create"),
    re_path(r"^my-enrollments/?$", MyEnrollmentListView.as_view(), name="my-enrollments-list"),
]
