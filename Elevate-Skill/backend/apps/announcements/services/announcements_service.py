from apps.announcements.models import Announcement, NewsPost


class AnnouncementsService:

    @staticmethod
    def get_published_announcements():
        """Retrieve only published announcements."""
        return Announcement.objects.filter(is_published=True).select_related("created_by")

    @staticmethod
    def get_all_announcements():
        """Retrieve all announcements (admin only)."""
        return Announcement.objects.all().select_related("created_by")

    @staticmethod
    def create_announcement(title, content, is_published, created_by):
        """Create an announcement."""
        return Announcement.objects.create(
            title=title,
            content=content,
            is_published=is_published,
            created_by=created_by
        )

    @staticmethod
    def get_published_news():
        """Retrieve only published news posts."""
        return NewsPost.objects.filter(status=NewsPost.PUBLISHED).select_related("author")

    @staticmethod
    def get_all_news():
        """Retrieve all news posts (admin only)."""
        return NewsPost.objects.all().select_related("author")

    @staticmethod
    def create_news_post(title, excerpt, content, image, author, status):
        """Create a news post."""
        return NewsPost.objects.create(
            title=title,
            excerpt=excerpt,
            content=content,
            image=image,
            author=author,
            status=status
        )
