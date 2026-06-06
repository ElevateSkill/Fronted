from rest_framework import serializers
from apps.cms.models import HeroSection, About, SiteSettings


class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = [
            "title",
            "subtitle",
            "background_image",
            "cta_text",
            "cta_link",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = [
            "title",
            "content",
            "image",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            "site_name",
            "contact_info",
            "bank_details",
            "payment_instructions",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]
