from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from apps.cms.permissions import IsAdmin
from apps.cms.services import CmsService
from apps.cms.api.serializers import (
    HeroSectionSerializer,
    AboutSerializer,
    SiteSettingsSerializer,
)


@extend_schema(tags=["CMS Admin"])
class AdminHeroSectionView(generics.RetrieveUpdateAPIView):
    """
    GET /api/v1/admin/hero/ - Retrieve hero section details.
    PUT /api/v1/admin/hero/ - Update hero section details.
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = HeroSectionSerializer

    def get_object(self):
        return CmsService.get_hero()


@extend_schema(tags=["CMS Admin"])
class AdminAboutView(generics.RetrieveUpdateAPIView):
    """
    GET /api/v1/admin/about/ - Retrieve about section details.
    PUT /api/v1/admin/about/ - Update about section details.
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = AboutSerializer

    def get_object(self):
        return CmsService.get_about()


@extend_schema(tags=["CMS Admin"])
class AdminSiteSettingsView(generics.RetrieveUpdateAPIView):
    """
    GET /api/v1/admin/site-settings/ - Retrieve site settings details.
    PUT /api/v1/admin/site-settings/ - Update site settings details.
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return CmsService.get_site_settings()
