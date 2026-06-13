from django.db import models

# Create your models here.
class BankAccountDetail(models.Model):
    account_number = models.CharField(max_length=20)
    bank_name = models.CharField(max_length=100)
    account_holder_name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.bank_name} - {self.account_holder_name} - {self.account_number}"
    
