from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Course(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    short_description = models.CharField(max_length=500)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='courses/thumbnails/', null=True, blank=True)
    course_url = models.URLField(max_length=500, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    duration = models.CharField(max_length=100, blank=True)
    requirements = models.TextField(blank=True)
    learning_outcomes = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    instructor = models.CharField(max_length=255, blank=True)
    lessons = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_active', 'is_published']),
            models.Index(fields=['category']),
            models.Index(fields=['-created_at']),
        ]
