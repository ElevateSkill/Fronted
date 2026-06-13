from django.contrib import admin
from .models import BankAccountDetail
# Register your models here.

@admin.register(BankAccountDetail)
class BankAccountDetailAdmin(admin.ModelAdmin):
    list_display = ["bank_name", "account_holder_name", "account_number", "is_active"]
    list_filter = ["is_active", "bank_name"]
    search_fields = ["bank_name", "account_holder_name", "account_number"]
    readonly_fields = []
    