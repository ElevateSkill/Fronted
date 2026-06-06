from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.cms.permissions import IsAdmin
from apps.cms.services import CmsService, TestimonialService, FAQService, HomepageService
from apps.cms.api.serializers import (
    HeroSectionSerializer,
    AboutSerializer,
    SiteSettingsSerializer,
    TestimonialSerializer,
    FAQSerializer,
    HomepageSerializer,
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


# ─ Public Homepage ────────────────────────────────

@extend_schema(tags=["CMS Public"])
class HomepageView(APIView):
    """GET /api/v1/homepage/"""
    permission_classes = [AllowAny]

    def get(self, request):
        data = HomepageService.get_homepage_data()
        serializer = HomepageSerializer(data)
        return Response(serializer.data)


# ─ Admin Testimonials ─────────────────────────────

@extend_schema(tags=["CMS Admin"])
class AdminTestimonialListCreateView(generics.ListCreateAPIView):
    """GET + POST /api/v1/admin/testimonials/"""
    serializer_class = TestimonialSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return TestimonialService.get_all_testimonials()


@extend_schema(tags=["CMS Admin"])
class AdminTestimonialDetailView(generics.RetrieveUpdateDestroyAPIView):
    """PUT + DELETE /api/v1/admin/testimonials/{id}/"""
    serializer_class = TestimonialSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return TestimonialService.get_all_testimonials()

    def perform_destroy(self, instance):
        TestimonialService.delete_testimonial(instance)


# ─ Admin FAQs ─────────────────────────────────────

@extend_schema(tags=["CMS Admin"])
class AdminFAQListCreateView(generics.ListCreateAPIView):
    """GET + POST /api/v1/admin/faqs/"""
    serializer_class = FAQSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return FAQService.get_all_faqs()


@extend_schema(tags=["CMS Admin"])
class AdminFAQDetailView(generics.RetrieveUpdateDestroyAPIView):
    """PUT + DELETE /api/v1/admin/faqs/{id}/"""
    serializer_class = FAQSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return FAQService.get_all_faqs()

    def perform_destroy(self, instance):
        FAQService.delete_faq(instance)

