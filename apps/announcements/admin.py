from django.contrib import admin
from apps.announcements.models import Announcement, NewsPost


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ["title", "date", "is_published", "created_by"]
    list_filter = ["is_published", "date", "created_by"]
    search_fields = ["title", "content"]
    readonly_fields = ["date", "created_at", "updated_at"]


@admin.register(NewsPost)
class NewsPostAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "status", "created_at"]
    list_filter = ["status", "created_at", "author"]
    search_fields = ["title", "excerpt", "content"]
    readonly_fields = ["created_at", "updated_at"]
