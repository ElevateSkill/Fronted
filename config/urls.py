from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    # API Version 1 Namespace
    path("api/v1/", include([
        # Auth and Profile endpoints
        path("", include("apps.accounts.api.urls")),
        
        # Courses endpoints
        path("", include("apps.courses.api.urls")),
        
        # Enrollments endpoints
        path("", include("apps.enrollments.api.urls")),

        # Payments endpoints
        path("", include("apps.payments.api.urls")),
        
        # CMS endpoints
        path("", include("apps.cms.api.urls")),
        
        # OpenAPI Schema and API Documentation endpoints
        path("schema/", SpectacularAPIView.as_view(), name="schema"),
        path("schema/swagger-ui/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
        path("schema/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    ])),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
