from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Order
from .serializers import OrderSerializer
from .permissions import IsRestaurantOperator


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsRestaurantOperator]

    # ✅ فقط سفارش‌های مربوط به بیزنس اپراتور
    def get_queryset(self):
        user = self.request.user

        # فرض: هر اپراتور به یک business متصل است
        if hasattr(user, "business") and user.business:
            return Order.objects.filter(business=user.business).order_by("-created_at")

        return Order.objects.none()

    # ✅ هنگام ایجاد سفارش، business خودکار ست شود
    def perform_create(self, serializer):
        user = self.request.user
        business = user.business

        order = serializer.save(business=business)

        # ارسال نوتیفیکیشن WebSocket
        self.notify_queue_update(order)

    # ✅ هنگام آپدیت وضعیت سفارش
    def perform_update(self, serializer):
        order = serializer.save()

        # ارسال نوتیفیکیشن WebSocket
        self.notify_queue_update(order)

    # ✅ تابع ارسال پیام به WebSocket
    def notify_queue_update(self, order):
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f'queue_{order.business.id}',
            {
                'type': 'queue_update',
                'message': {
                    'order_id': order.id,
                    'status': order.status,
                    'estimated_time': order.estimated_time,
                }
            }
        )
