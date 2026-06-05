from rest_framework import generics, status, permissions
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.enrollments.api.serializers import (
    EnrollmentSerializer,
    EnrollmentCreateSerializer,
)
from apps.enrollments.services import EnrollmentService


@extend_schema(tags=["Enrollments"])
class EnrollmentCreateView(generics.CreateAPIView):
    """
    Enroll the authenticated student in a course.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EnrollmentCreateSerializer

    @extend_schema(
        request=EnrollmentCreateSerializer,
        responses={201: EnrollmentSerializer},
        tags=["Enrollments"],
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        course_id = serializer.validated_data["course"]
        
        # Call the service layer to handle logic and duplicate check
        enrollment = EnrollmentService.create_enrollment(
            student=request.user,
            course_id=course_id
        )
        
        response_serializer = EnrollmentSerializer(enrollment)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@extend_schema(tags=["Enrollments"])
class MyEnrollmentListView(generics.ListAPIView):
    """
    Retrieve all enrollments for the authenticated student.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        # Call service to fetch student's enrollments
        return EnrollmentService.get_student_enrollments(student=self.request.user)
