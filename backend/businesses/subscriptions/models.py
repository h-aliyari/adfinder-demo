from django.db import models
from businesses.models import Business

class Subscription(models.Model):
    PLAN_CHOICES = (
        ('اقتصادی', 'Economy'),
        ('کامل', 'Full'),
    )

    business = models.OneToOneField(Business, on_delete=models.CASCADE)
    plan_type = models.CharField(max_length=20, choices=PLAN_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
