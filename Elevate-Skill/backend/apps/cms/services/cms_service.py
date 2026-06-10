from apps.cms.models import HeroSection, About, SiteSettings, Testimonial, FAQ


class CmsService:
    """
    Business logic layer for CMS content.
    Handles retrieving and managing the singleton models.
    """

    @staticmethod
    def get_hero() -> HeroSection:
        return HeroSection.load()

    @staticmethod
    def get_about() -> About:
        return About.load()

    @staticmethod
    def get_site_settings() -> SiteSettings:
        return SiteSettings.load()


from utils.sanitize import sanitize_dict

# ─ Dynamic Content Services ──────────────────────

class TestimonialService:

    @staticmethod
    def get_active_testimonials():
        return Testimonial.objects.filter(is_active=True).order_by('-created_at')

    @staticmethod
    def get_all_testimonials():
        """Admin: all testimonials regardless of status."""
        return Testimonial.objects.all().order_by('-created_at')

    @staticmethod
    def create_testimonial(data):
        data = sanitize_dict(data, ['student_name', 'message'])
        return Testimonial.objects.create(**data)

    @staticmethod
    def delete_testimonial(instance):
        instance.delete()


class FAQService:

    @staticmethod
    def get_active_faqs():
        return FAQ.objects.filter(is_active=True).order_by('order', 'created_at')

    @staticmethod
    def get_all_faqs():
        """Admin: all FAQs regardless of status."""
        return FAQ.objects.all().order_by('order', 'created_at')

    @staticmethod
    def create_faq(data):
        data = sanitize_dict(data, ['question', 'answer'])
        return FAQ.objects.create(**data)

    @staticmethod
    def delete_faq(instance):
        instance.delete()


class HomepageService:

    @staticmethod
    def get_homepage_data():
        """
        Returns combined data for the public homepage endpoint.
        Aggregates hero, about, site-settings (Dev A) with
        testimonials and FAQs (Dev B).
        """
        return {
            'hero': CmsService.get_hero(),
            'about': CmsService.get_about(),
            'site_settings': CmsService.get_site_settings(),
            'testimonials': TestimonialService.get_active_testimonials(),
            'faqs': FAQService.get_active_faqs(),
        }
