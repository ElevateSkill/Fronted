from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema

from apps.announcements.permissions import IsAdmin
from apps.announcements.services import AnnouncementsService
from apps.announcements.api.serializers import AnnouncementSerializer, NewsPostSerializer
from apps.announcements.models import Announcement, NewsPost


# --- ANNOUNCEMENTS ---

@extend_schema(tags=["Announcements"])
class StudentAnnouncementListView(generics.ListAPIView):
    """
    GET /api/v1/announcements/ - List published announcements (public, no auth required).
    """
    permission_classes = [AllowAny]
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        return AnnouncementsService.get_published_announcements()


@extend_schema(tags=["Announcements"])
class StudentAnnouncementDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/announcements/{id}/ - Retrieve detail of a published announcement (public, no auth required).
    """
    permission_classes = [AllowAny]
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        return AnnouncementsService.get_published_announcements()


@extend_schema(tags=["Announcements Admin"])
class AdminAnnouncementListCreateView(generics.ListCreateAPIView):
    """
    GET /api/v1/admin/announcements/ - List all announcements (admin only).
    POST /api/v1/admin/announcements/ - Create a new announcement (admin only).
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        return AnnouncementsService.get_all_announcements()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


@extend_schema(tags=["Announcements Admin"])
class AdminAnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/v1/admin/announcements/{id}/ - Retrieve an announcement.
    PUT /api/v1/admin/announcements/{id}/ - Update an announcement.
    PATCH /api/v1/admin/announcements/{id}/ - Partially update an announcement.
    DELETE /api/v1/admin/announcements/{id}/ - Delete an announcement.
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = AnnouncementSerializer
    queryset = Announcement.objects.all()


# --- NEWS ---

@extend_schema(tags=["News"])
class PublicNewsListView(generics.ListAPIView):
    """
    GET /api/v1/news/ - List published news posts (public feed, no auth required).
    """
    permission_classes = [AllowAny]
    serializer_class = NewsPostSerializer

    def get_queryset(self):
        return AnnouncementsService.get_published_news()


@extend_schema(tags=["News"])
class PublicNewsDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/news/{id}/ - Retrieve a published news post (public feed, no auth required).
    """
    permission_classes = [AllowAny]
    serializer_class = NewsPostSerializer

    def get_queryset(self):
        return AnnouncementsService.get_published_news()


@extend_schema(tags=["News Admin"])
class AdminNewsPostListCreateView(generics.ListCreateAPIView):
    """
    GET /api/v1/admin/news/ - List all news posts (admin only).
    POST /api/v1/admin/news/ - Create a new news post (admin only).
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = NewsPostSerializer

    def get_queryset(self):
        return AnnouncementsService.get_all_news()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


@extend_schema(tags=["News Admin"])
class AdminNewsPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/v1/admin/news/{id}/ - Retrieve a news post.
    PUT /api/v1/admin/news/{id}/ - Update a news post.
    PATCH /api/v1/admin/news/{id}/ - Partially update a news post.
    DELETE /api/v1/admin/news/{id}/ - Delete a news post.
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = NewsPostSerializer
    queryset = NewsPost.objects.all()
