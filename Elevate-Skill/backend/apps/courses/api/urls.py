from django.urls import path
from apps.courses.api import views

urlpatterns = [
    # Public
    path('courses/', views.PublicCourseListView.as_view(), name='public-course-list'),
    path('courses/<int:pk>/', views.PublicCourseDetailView.as_view(), name='public-course-detail'),
    path('categories/', views.PublicCategoryListView.as_view(), name='public-category-list'),
    path('categories/<int:pk>/', views.PublicCategoryDetailView.as_view(), name='public-category-detail'),

    # Admin
    path('admin/courses/', views.AdminCourseListCreateView.as_view(), name='admin-course-list-create'),
    path('admin/courses/<int:pk>/', views.AdminCourseDetailView.as_view(), name='admin-course-detail'),
    path('admin/categories/', views.AdminCategoryListCreateView.as_view(), name='admin-category-list-create'),
    path('admin/categories/<int:pk>/', views.AdminCategoryDetailView.as_view(), name='admin-category-detail'),
]
