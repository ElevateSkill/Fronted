from apps.cms.models import HeroSection, About, SiteSettings


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
