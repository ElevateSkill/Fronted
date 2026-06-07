from django.db import models
from django.conf import settings


class Announcement(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="announcements"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return self.title


class NewsPost(models.Model):
    DRAFT = "draft"
    PUBLISHED = "published"
    STATUS_CHOICES = (
        (DRAFT, "Draft"),
        (PUBLISHED, "Published"),
    )

    title = models.CharField(max_length=255)
    excerpt = models.TextField(blank=True, default="")
    content = models.TextField()
    image = models.ImageField(upload_to="news/images/", null=True, blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="news_posts"
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
