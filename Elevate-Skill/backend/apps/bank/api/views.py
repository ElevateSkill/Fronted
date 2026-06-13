from rest_framework import generics
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema

from ..models import BankAccountDetail
from apps.accounts.permissions import IsAdmin

from .serializers import (
    BankAccountDetailListSerializer,
    BankAccountDetailDetailSerializer,
    BankAccountDetailCreateUpdateSerializer,
)

@extend_schema(tags=["Bank Accounts"])
class BankAccountListView(generics.ListAPIView):
    """
    Public list of active bank accounts.
    """

    serializer_class = BankAccountDetailListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            BankAccountDetail.objects
            .filter(is_active=True)
            .order_by("bank_name")
        )


@extend_schema(tags=["Bank Accounts"])
class BankAccountDetailView(generics.RetrieveAPIView):
    """
    Public bank account detail.
    """

    serializer_class = BankAccountDetailDetailSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            BankAccountDetail.objects
            .filter(is_active=True)
        )


@extend_schema(tags=["Bank Accounts"])
class BankAccountCreateView(generics.CreateAPIView):
    """
    Admin only create.
    """

    queryset = BankAccountDetail.objects.all()
    serializer_class = (
        BankAccountDetailCreateUpdateSerializer
    )
    permission_classes = [IsAdmin]


@extend_schema(tags=["Bank Accounts"])
class BankAccountUpdateView(generics.UpdateAPIView):
    """
    Admin only update.
    """

    queryset = BankAccountDetail.objects.all()
    serializer_class = (
        BankAccountDetailCreateUpdateSerializer
    )
    permission_classes = [IsAdmin]


@extend_schema(tags=["Bank Accounts"])
class BankAccountDeleteView(generics.DestroyAPIView):
    """
    Admin only delete.
    """

    queryset = BankAccountDetail.objects.all()
    permission_classes = [IsAdmin]