from .base import *
import os
import dj_database_url

DEBUG = False

SECRET_KEY = os.environ.get('SECRET_KEY')

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

# ── Database ──────────────────────────────────────────────
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True,
    )
}

# ── Static files — WhiteNoise ─────────────────────────────
MIDDLEWARE = ['whitenoise.middleware.WhiteNoiseMiddleware'] + MIDDLEWARE
STATIC_ROOT = BASE_DIR / 'staticfiles'

# ── Backblaze B2 — private bucket, eu-central-003 ─────────
AWS_ACCESS_KEY_ID = os.environ.get('B2_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('B2_APP_KEY')
AWS_STORAGE_BUCKET_NAME = 'elevate-lms-media'
AWS_S3_REGION_NAME = 'eu-central-003'
AWS_S3_ENDPOINT_URL = 'https://s3.eu-central-003.backblazeb2.com'
AWS_S3_SIGNATURE_VERSION = 's3v4'
AWS_DEFAULT_ACL = 'private'
AWS_S3_FILE_OVERWRITE = False
AWS_QUERYSTRING_AUTH = True       # auto pre-signed URLs
AWS_QUERYSTRING_EXPIRE = 3600     # valid for 1 hour
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=3600',
}

STORAGES = {
    'default': {
        'BACKEND': 'utils.storage.MediaStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

# ── CORS ──────────────────────────────────────────────────
CORS_ALLOW_ALL_ORIGINS = True     # lock down once frontend URL is known

# ── Security ──────────────────────────────────────────────
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_BROWSER_XSS_FILTER = True
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000

# ── Caching ───────────────────────────────────────────────
CACHE_BACKEND = os.environ.get('CACHE_BACKEND', 'locmem')

if CACHE_BACKEND == 'redis':
    CACHES = {
        'default': {
            'BACKEND': 'django_redis.cache.RedisCache',
            'LOCATION': os.environ.get('REDIS_URL'),
            'OPTIONS': {'CLIENT_CLASS': 'django_redis.client.DefaultClient'},
            'KEY_PREFIX': 'elevate',
            'TIMEOUT': 300,
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'elevate-lms-cache',
        }
    }