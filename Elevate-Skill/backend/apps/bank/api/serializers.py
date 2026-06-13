from rest_framework import serializers

from ..models import BankAccountDetail


class BankAccountDetailListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccountDetail
        fields = [
            "id",
            "bank_name",
            "account_holder_name",
            "account_number",
        ]


class BankAccountDetailDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccountDetail
        fields = [
            "id",
            "bank_name",
            "account_holder_name",
            "account_number",
            "is_active",
        ]


class BankAccountDetailCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccountDetail
        fields = [
            "bank_name",
            "account_holder_name",
            "account_number",
            "is_active",
        ]

    def validate_account_number(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Account number cannot be empty."
            )
        return value