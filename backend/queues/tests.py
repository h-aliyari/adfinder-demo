from django.test import TestCase
from .models import Order

class OrderTest(TestCase):
    def test_create_order(self):
        order = Order.objects.create(status="pending")
        self.assertEqual(order.status, "pending")
