from .base import *
import os

DEBUG = False

# Ideally set specific allowed hosts in production, defaulting to all for now
ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", "*")

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME", "elevate_lms"),
        "USER": os.environ.get("DB_USER", "postgres"),
        "PASSWORD": os.environ.get("DB_PASSWORD", "postgres"),
        "HOST": os.environ.get("DB_HOST", "localhost"),
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}

CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS", strip_trailing_slash=True)
if not CORS_ALLOWED_ORIGINS:
    CORS_ALLOW_ALL_ORIGINS = True  # Fallback if not specified
