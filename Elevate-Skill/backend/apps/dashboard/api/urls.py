from django.urls import path
from apps.dashboard.api import views

urlpatterns = [
    path('admin/dashboard/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
]
