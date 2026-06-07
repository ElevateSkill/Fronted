from rest_framework import serializers
from apps.announcements.models import Announcement, NewsPost
from apps.accounts.api.serializers import UserSerializer


class AnnouncementSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Announcement
        fields = [
            "id",
            "title",
            "content",
            "date",
            "is_published",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "date", "created_by", "created_at", "updated_at"]


class NewsPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = NewsPost
        fields = [
            "id",
            "title",
            "excerpt",
            "content",
            "image",
            "author",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "author", "created_at", "updated_at"]
