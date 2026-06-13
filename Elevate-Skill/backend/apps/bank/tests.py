from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.bank.models import BankAccountDetail


class BankAccountViewTests(APITestCase):

    def setUp(self):
        self.admin_user = User.objects.create_user(
            email="admin@test.com",
            password="password123",
            is_staff=True,
        )

        self.normal_user = User.objects.create_user(
            email="user@test.com",
            password="password123",
        )

        self.active_bank = BankAccountDetail.objects.create(
            bank_name="CBE",
            account_holder_name="Light Institute",
            account_number="100001",
            is_active=True,
        )

        self.inactive_bank = BankAccountDetail.objects.create(
            bank_name="Awash",
            account_holder_name="Light Institute",
            account_number="100002",
            is_active=False,
        )


    def test_list_bank_accounts_returns_only_active(self):
        """
        Public list should return only active bank accounts.
        """
        url = reverse("bank-account-list")

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(
            response.data['results'][0]["bank_name"],
            "CBE"
        )

    def test_bank_account_detail_active_success(self):
        """
        Public detail should return active bank account.
        """
        url = reverse(
            "bank-account-detail",
            kwargs={"pk": self.active_bank.pk}
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data["bank_name"],
            "CBE"
        )

    def test_bank_account_detail_inactive_returns_404(self):
        """
        Inactive bank account should not be accessible.
        """
        url = reverse(
            "bank-account-detail",
            kwargs={"pk": self.inactive_bank.pk}
        )

        response = self.client.get(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )


    def test_admin_can_create_bank_account(self):
        """
        Admin can create bank account.
        """
        self.client.force_authenticate(
            user=self.admin_user
        )

        url = reverse("bank-account-create")

        payload = {
            "bank_name": "Telebirr",
            "account_holder_name": "Light Institute",
            "account_number": "0911000000",
            "is_active": True,
        }

        response = self.client.post(
            url,
            payload,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertTrue(
            BankAccountDetail.objects.filter(
                bank_name="Telebirr"
            ).exists()
        )

    def test_non_admin_cannot_create_bank_account(self):
        """
        Non-admin cannot create bank account.
        """
        self.client.force_authenticate(
            user=self.normal_user
        )

        url = reverse("bank-account-create")

        payload = {
            "bank_name": "Telebirr",
            "account_holder_name": "Light Institute",
            "account_number": "0911000000",
        }

        response = self.client.post(
            url,
            payload,
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    def test_admin_can_update_bank_account(self):
        """
        Admin can update bank account.
        """
        self.client.force_authenticate(
            user=self.admin_user
        )

        url = reverse(
            "bank-account-update",
            kwargs={"pk": self.active_bank.pk}
        )

        payload = {
            "bank_name": "Updated CBE",
            "account_holder_name": "Updated Holder",
            "account_number": "999999",
            "is_active": True,
        }

        response = self.client.patch(
            url,
            payload,
            format="json"
        )

        self.active_bank.refresh_from_db()

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            self.active_bank.bank_name,
            "Updated CBE"
        )

    def test_non_admin_cannot_update_bank_account(self):
        """
        Non-admin cannot update bank account.
        """
        self.client.force_authenticate(
            user=self.normal_user
        )

        url = reverse(
            "bank-account-update",
            kwargs={"pk": self.active_bank.pk}
        )

        response = self.client.patch(
            url,
            {"bank_name": "Hack"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )


    def test_admin_can_delete_bank_account(self):
        """
        Admin can delete bank account.
        """
        self.client.force_authenticate(
            user=self.admin_user
        )

        url = reverse(
            "bank-account-delete",
            kwargs={"pk": self.active_bank.pk}
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )

        self.assertFalse(
            BankAccountDetail.objects.filter(
                pk=self.active_bank.pk
            ).exists()
        )

    def test_non_admin_cannot_delete_bank_account(self):
        """
        Non-admin cannot delete bank account.
        """
        self.client.force_authenticate(
            user=self.normal_user
        )

        url = reverse(
            "bank-account-delete",
            kwargs={"pk": self.active_bank.pk}
        )

        response = self.client.delete(url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )


    def test_unauthenticated_user_cannot_create(self):
        """
        Anonymous users cannot create.
        """
        url = reverse("bank-account-create")

        response = self.client.post(
            url,
            {},
            format="json"
        )

        self.assertIn(
            response.status_code,
            [
                status.HTTP_401_UNAUTHORIZED,
                status.HTTP_403_FORBIDDEN
            ]
        )
