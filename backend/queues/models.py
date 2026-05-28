from django.db import models
from businesses.models import Business

class Order(models.Model):
    STATUS_CHOICES = (
        ('waiting', 'Waiting'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered'),
    )

    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    order_number = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    estimated_time = models.IntegerField(help_text="زمان تخمینی به دقیقه")
    created_at = models.DateTimeField(auto_now_add=True)
