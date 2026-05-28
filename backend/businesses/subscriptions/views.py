# subscriptions/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser # یا IsBusinessOwner اگر بخواهید
from .models import Subscription
from .serializers import SubscriptionSerializer
from businesses.models import Business
from django.shortcuts import get_object_or_404
from datetime import date
from . import serializers

class SubscriptionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows subscriptions to be viewed or edited.
    """
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    # فعلا فقط ادمین‌ها می‌توانند به همه اشتراک‌ها دسترسی داشته باشند.
    # برای پیاده‌سازی دسترسی بیزینس‌ها به اشتراک خودشان، نیاز به منطق بیشتری است.
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        """
        Filter subscriptions based on user permissions.
        Admins see all, users see their own (if implemented).
        """
        user = self.request.user
        if user.is_staff or user.is_superuser:
            # ادمین‌ها همه اشتراک‌ها را می‌بینند
            return Subscription.objects.all()
        else:
            # اگر بخواهید کاربران عادی (مثلا owner یک بیزینس) بتوانند اشتراک خود را ببینند:
            try:
                business = Business.objects.get(owner=user) # فرض می‌کنیم Business یک foreign key به User به نام owner دارد
                return Subscription.objects.filter(business=business)
            except Business.DoesNotExist:
                return Subscription.objects.none() # اگر بیزینس نداشته باشد، اشتراک هم ندارد
            except Exception as e:
                # در صورت بروز خطای دیگر، به ادمین‌ها اطلاع داده شود یا لاگ شود
                print(f"Error retrieving user-specific subscriptions: {e}")
                return Subscription.objects.none()

    def perform_create(self, serializer):
        """
        Ensure the business exists and the user has permission to create a subscription for it.
        Also, set is_active based on dates.
        """
        business_id = self.request.data.get('business')
        if not business_id:
            raise serializers.ValidationError({"business": "Business ID is required."})

        try:
            business = Business.objects.get(id=business_id)
        except Business.DoesNotExist:
            raise serializers.ValidationError({"business": "Business not found."})

        # بررسی دسترسی کاربر (مثلا آیا این کاربر owner این بیزینس است؟)
        # این بخش نیاز به پیاده‌سازی دقیق‌تر permission ها دارد.
        # فعلا فرض می‌کنیم ادمین ها می‌توانند برای هر بیزینسی اشتراک ایجاد کنند.
        # اگر کاربر عادی باشد، باید چک شود که آیا owner این بیزینس است.
        # if not self.request.user.is_staff and business.owner != self.request.user:
        #     raise serializers.PermissionDenied("You do not have permission to create a subscription for this business.")

        # قبل از ذخیره، اطمینان حاصل می‌کنیم که serializer business را به درستی دریافت کرده
        serializer.save(business=business)

    def perform_update(self, serializer):
        """
        Handle updates, especially for dates and the is_active status.
        """
        instance = serializer.instance
        data = serializer.validated_data

        # منطق به‌روزرسانی is_active بر اساس تاریخ‌ها
        start_date = data.get('start_date', instance.start_date)
        end_date = data.get('end_date', instance.end_date)
        today = date.today()

        if start_date and end_date:
            if start_date <= today <= end_date:
                data['is_active'] = True
            else:
                data['is_active'] = False
        elif start_date and start_date > today:
             data['is_active'] = False
        elif end_date and end_date < today:
             data['is_active'] = False
        # اگر فقط یکی از تاریخ‌ها باشد یا امروز باشد، وضعیت فعلی را حفظ می‌کنیم یا بر اساس منطق دیگری تنظیم می‌کنیم

        # اگر 'is_active' در validated_data بود، از آن استفاده می‌کنیم، در غیر این صورت منطق بالا اجرا می‌شود.
        if 'is_active' in data:
            instance.is_active = data['is_active']
        else:
            # اگر is_active به صورت دستی در درخواست نباشد، وضعیت جدید را بر اساس تاریخ‌ها تعیین می‌کنیم.
            # اگر کاربر بخواهد دستی is_active را تغییر دهد، باید آن را از read_only_fields در serializer حذف کرد.
            if start_date and end_date and start_date <= today <= end_date:
                instance.is_active = True
            elif start_date and end_date and end_date < today: # اگر تمام شده باشد
                instance.is_active = False
            elif start_date and end_date and start_date > today: # اگر هنوز شروع نشده
                instance.is_active = False
            # در حالات دیگر (مثلا فقط start_date داریم یا فقط end_date) وضعیت فعلی را حفظ می‌کنیم یا منطق دقیق‌تری لازم است.

        # ذخیره تغییرات
        serializer.save()
