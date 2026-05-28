# subscriptions/serializers.py
from rest_framework import serializers
from .models import Subscription
from businesses.models import Business # برای اعتبارسنجی business_id

class SubscriptionSerializer(serializers.ModelSerializer):
    # اگر می‌خواهید هنگام دریافت اطلاعات، نام بیزینس هم نمایش داده شود
    # business_name = serializers.CharField(source='business.name', read_only=True)

    class Meta:
        model = Subscription
        fields = [
            'id',
            'business', # هنگام ایجاد، باید business_id ارسال شود
            'plan_type',
            'start_date',
            'end_date',
            'is_active',
        ]
        read_only_fields = ['id', 'is_active'] # id همیشه read-only است، is_active را معمولا سرور تعیین می‌کند
        extra_kwargs = {
            # Business ID را برای ایجاد اشتراک الزامی می‌کنیم
            'business': {'required': True},
            'plan_type': {'required': True},
            'start_date': {'required': True},
            'end_date': {'required': True},
        }

    def validate_business(self, value):
        """
        Custom validation to ensure the business exists and does not already have a subscription.
        """
        if not Business.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("The selected business does not exist.")

        # بررسی می‌کنیم که آیا این بیزینس قبلاً اشتراک دارد یا خیر
        # چون رابطه OneToOne است، اگر اشتراک وجود داشته باشد، value (یعنی Business) باید null باشد
        # اما در اینجا value خود آبجکت Business است، پس باید بررسی کنیم آیا این Business قبلا اشتراکی داشته است.
        if Subscription.objects.filter(business=value).exists():
            raise serializers.ValidationError("This business already has a subscription.")
        return value

    def validate(self, data):
        """
        Validate dates and ensure start_date is not after end_date.
        Also, handle the automatic setting of is_active based on dates if not provided.
        """
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        is_active = data.get('is_active', True) # پیش‌فرض True است مگر اینکه override شود

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError("End date cannot be before start date.")

        # اگر تاریخ‌ها مشخص شده‌اند و is_active هم مشخص شده، آن را بر اساس تاریخ تنظیم می‌کنیم
        # این منطق را می‌توان در view ها هم پیاده‌سازی کرد، اما اینجا هم می‌تواند باشد
        today = serializers.DateField().get_value(data, 'today') # دریافت تاریخ امروز
        if start_date and end_date and today:
            if start_date <= today <= end_date:
                data['is_active'] = True
            else:
                data['is_active'] = False
        elif start_date and today and start_date > today: # اگر هنوز شروع نشده
             data['is_active'] = False
        elif end_date and today and end_date < today: # اگر تمام شده
             data['is_active'] = False

        # اگر is_active به طور صریح در داده‌ها باشد، آن را نگه می‌داریم
        # در غیر این صورت، منطق بالا اجرا می‌شود

        return data

    # اگر بخواهید بتوانید is_active را از طریق API به صورت دستی مدیریت کنید،
    # باید آن را از read_only_fields حذف کنید و منطق is_active را در update مدیریت کنید.
    # فعلا فرض می‌کنیم is_active توسط سیستم بر اساس تاریخ‌ها تعیین می‌شود.
