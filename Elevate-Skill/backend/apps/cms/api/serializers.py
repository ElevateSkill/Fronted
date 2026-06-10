from rest_framework import serializers
from apps.cms.models import HeroSection, About, SiteSettings, Testimonial, FAQ


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


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'student_name', 'student_image', 'message', 'rating', 'is_active', 'created_at']
        read_only_fields = ['created_at']


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'order', 'is_active', 'created_at']
        read_only_fields = ['created_at']


class HomepageSerializer(serializers.Serializer):
    """
    Assembles the full homepage response.
    Combines Dev A's singleton sections with Dev B's dynamic content.
    """
    hero = HeroSectionSerializer()
    about = AboutSerializer()
    site_settings = SiteSettingsSerializer()
    testimonials = TestimonialSerializer(many=True)
    faqs = FAQSerializer(many=True)

