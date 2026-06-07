from django.urls import path
from apps.announcements.api import views


urlpatterns = [
    # Public & Student feeds
    path('announcements/', views.StudentAnnouncementListView.as_view(), name='student-announcement-list'),
    path('announcements/<int:pk>/', views.StudentAnnouncementDetailView.as_view(), name='student-announcement-detail'),
    path('news/', views.PublicNewsListView.as_view(), name='public-news-list'),
    path('news/<int:pk>/', views.PublicNewsDetailView.as_view(), name='public-news-detail'),

    # Admin endpoints
    path('admin/announcements/', views.AdminAnnouncementListCreateView.as_view(), name='admin-announcement-list-create'),
    path('admin/announcements/<int:pk>/', views.AdminAnnouncementDetailView.as_view(), name='admin-announcement-detail'),
    path('admin/news/', views.AdminNewsPostListCreateView.as_view(), name='admin-news-list-create'),
    path('admin/news/<int:pk>/', views.AdminNewsPostDetailView.as_view(), name='admin-news-detail'),
]
