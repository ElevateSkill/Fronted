from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.courses.services import CourseService
from apps.courses.permissions import IsAdmin
from apps.courses.api.serializers import CourseListSerializer, CourseDetailSerializer
from apps.courses.api.serializers import CategorySerializer
from apps.courses.services import CategoryService



class PublicCourseListView(generics.ListAPIView):
    """GET /api/v1/courses/"""
    serializer_class = CourseListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['title', 'short_description', 'category__name']
    filterset_fields = ['category', 'category__slug']

    def get_queryset(self):
        return CourseService.get_published_courses()


class PublicCourseDetailView(generics.RetrieveAPIView):
    """GET /api/v1/courses/{id}/"""
    serializer_class = CourseDetailSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return CourseService.get_course_detail(self.kwargs['pk'])



class PublicCategoryListView(generics.ListAPIView):
    """GET /api/v1/categories/"""
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return CategoryService.get_all_categories()


class PublicCategoryDetailView(generics.RetrieveAPIView):
    """GET /api/v1/categories/{id}/"""
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return CategoryService.get_category_detail(self.kwargs['pk'])


class AdminCategoryListCreateView(generics.ListCreateAPIView):
    """GET + POST /api/v1/admin/categories/"""
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return CategoryService.get_all_categories()


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET + PUT + PATCH + DELETE /api/v1/admin/categories/{id}/"""
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return CategoryService.get_all_categories()

    def perform_destroy(self, instance):
        CategoryService.delete_category(instance)


class AdminCourseListCreateView(generics.ListCreateAPIView):
    """GET + POST /api/v1/admin/courses/"""
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = CourseDetailSerializer

    def get_queryset(self):
        return CourseService.get_all_courses()


class AdminCourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET + PUT + PATCH + DELETE /api/v1/admin/courses/{id}/"""
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = CourseDetailSerializer

    def get_queryset(self):
        return CourseService.get_all_courses()

    def perform_destroy(self, instance):
        CourseService.delete_course(instance)
