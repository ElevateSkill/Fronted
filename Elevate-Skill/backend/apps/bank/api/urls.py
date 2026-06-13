from django.urls import path
from .views import (
    BankAccountListView,
    BankAccountDetailView,
    BankAccountCreateView,
    BankAccountUpdateView,
    BankAccountDeleteView,
    )

urlpatterns = [
    # Public endpoints  
    path('bank-accounts/', BankAccountListView.as_view(), name='bank-account-list'),
    path('bank-accounts/<int:pk>/', BankAccountDetailView.as_view (), name='bank-account-detail'),        
    
    # Admin endpoints
    path('admin/bank-accounts/create/', BankAccountCreateView.as_view(), name='bank-account-create'),
    path('admin/bank-accounts/<int:pk>/update/', BankAccountUpdateView.as_view(), name='bank-account-update'),
    path('admin/bank-accounts/<int:pk>/delete/', BankAccountDeleteView.as_view(), name='bank-account-delete'),
]