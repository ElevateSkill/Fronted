from django.urls import path
from apps.cms.api import views

urlpatterns = [
    # Singleton Admin endpoints
    path('admin/hero/', views.AdminHeroSectionView.as_view(), name='admin-hero'),
    path('admin/about/', views.AdminAboutView.as_view(), name='admin-about'),
    path('admin/site-settings/', views.AdminSiteSettingsView.as_view(), name='admin-site-settings'),

    # Public Homepage
    path('homepage/', views.HomepageView.as_view(), name='homepage'),

    # Admin Testimonials
    path('admin/testimonials/', views.AdminTestimonialListCreateView.as_view(), name='admin-testimonial-list'),
    path('admin/testimonials/<int:pk>/', views.AdminTestimonialDetailView.as_view(), name='admin-testimonial-detail'),

    # Admin FAQs
    path('admin/faqs/', views.AdminFAQListCreateView.as_view(), name='admin-faq-list'),
    path('admin/faqs/<int:pk>/', views.AdminFAQDetailView.as_view(), name='admin-faq-detail'),
]

