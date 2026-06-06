from django.db import models


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
