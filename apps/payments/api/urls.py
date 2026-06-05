from django.urls import path

from apps.payments.api import views

urlpatterns = [
    path("payments/", views.StudentPaymentView.as_view(), name="student-payments"),
    path("admin/payments/", views.AdminPaymentListView.as_view(), name="admin-payment-list"),
    path("admin/payments/<int:pk>/approve/", views.AdminApprovePaymentView.as_view(), name="admin-payment-approve"),
    path("admin/payments/<int:pk>/reject/", views.AdminRejectPaymentView.as_view(), name="admin-payment-reject"),
]
