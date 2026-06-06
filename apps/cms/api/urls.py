from django.urls import path
from apps.cms.api import views

urlpatterns = [
    path('admin/hero/', views.AdminHeroSectionView.as_view(), name='admin-hero'),
    path('admin/about/', views.AdminAboutView.as_view(), name='admin-about'),
    path('admin/site-settings/', views.AdminSiteSettingsView.as_view(), name='admin-site-settings'),
]
