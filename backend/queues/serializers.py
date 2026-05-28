# queues/serializers.py
from rest_framework import serializers
from .models import Order
from businesses.models import Business # فرض می‌کنیم Business در جای دیگری تعریف شده است

class OrderSerializer(serializers.ModelSerializer):
    # می‌توانید فیلدهای دلخواه را اینجا اضافه یا حذف کنید.
    # مثلاً اگر می‌خواهید نام بیزینس به جای ID آن نمایش داده شود:
    # business_name = serializers.CharField(source='business.name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', # Django به طور خودکار یک ID برای هر مدل اضافه می‌کند
            'business',
            'order_number',
            'status',
            'estimated_time',
            'created_at',
        ]
        read_only_fields = ['created_at'] # این فیلد نباید توسط کاربر تغییر کند

    # اگر business_name را اضافه کردید، باید این خط را در fields حذف کنید
    # و در صورت نیاز، extra_kwargs را برای تنظیمات بیشتر اضافه کنید.
    # def create(self, validated_data):
    #     # اینجا می‌توانید منطق خاصی برای ایجاد سفارش اضافه کنید
    #     return Order.objects.create(**validated_data)

    # def update(self, instance, validated_data):
    #     # اینجا می‌توانید منطق خاصی برای به‌روزرسانی سفارش اضافه کنید
    #     instance.status = validated_data.get('status', instance.status)
    #     instance.estimated_time = validated_data.get('estimated_time', instance.estimated_time)
    #     instance.save()
    #     return instance
