from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class SingletonModel(models.Model):
    """
    An abstract base class that enforces a singleton pattern by ensuring 
    only one record exists in the database.
    """
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Prevent deletion of singleton settings
        pass

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class HeroSection(SingletonModel):
    title = models.CharField(max_length=255, blank=True, default="")
    subtitle = models.CharField(max_length=500, blank=True, default="")
    background_image = models.ImageField(upload_to="cms/hero/", null=True, blank=True)
    cta_text = models.CharField(max_length=100, blank=True, default="")
    cta_link = models.CharField(max_length=255, blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Hero Section"


class About(SingletonModel):
    title = models.CharField(max_length=255, blank=True, default="")
    content = models.TextField(blank=True, default="")
    image = models.ImageField(upload_to="cms/about/", null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "About Section"


class SiteSettings(SingletonModel):
    site_name = models.CharField(max_length=255, blank=True, default="")
    contact_info = models.TextField(blank=True, default="")
    bank_details = models.TextField(blank=True, default="")
    payment_instructions = models.TextField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Site Settings"


class Testimonial(models.Model):
    student_name = models.CharField(max_length=255)
    student_image = models.ImageField(upload_to='cms/testimonials/', null=True, blank=True)
    message = models.TextField()
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.student_name} ({self.rating}★)"


class FAQ(models.Model):
    question = models.CharField(max_length=500)
    answer = models.TextField()
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']
        indexes = [
            models.Index(fields=['is_active', 'order']),
        ]

    def __str__(self):
        return self.question
