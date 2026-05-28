# D:\adfinder\backend\businesses\models.py
from django.db import models
from datetime import timedelta
# from django.utils import timezone
import hashlib

class Business(models.Model):
    name = models.CharField(max_length=255)
    owner = models.CharField(max_length=255)
    phone = models.CharField(max_length=11, unique=True)
    email = models.EmailField(blank=True, null=True)
    business_code = models.CharField(max_length=3, unique=True)
    business_type = models.CharField(max_length=50)
    address = models.TextField(blank=True, null=True)
    province = models.CharField(max_length=50, blank=True, null=True)  # فیلد جدید برای استان
    description = models.TextField(blank=True, null=True)
    plan = models.CharField(max_length=20, default='normal')
    password = models.CharField(max_length=255)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    views = models.IntegerField(default=0)
    searches = models.IntegerField(default=0)
    saves = models.IntegerField(default=0)
    profile_image = models.ImageField(upload_to='business_profiles/', blank=True, null=True)
    social_links = models.JSONField(blank=True, null=True)
    custom_page_data = models.JSONField(blank=True, null=True)
    expires_date = models.DateField(blank=True, null=True)
    
    price = models.IntegerField(default=0, verbose_name='قیمت (ریال)')
    payment_id = models.CharField(max_length=100, unique=True, blank=True, null=True, verbose_name='شناسه پرداخت')
    payment_authority = models.CharField(max_length=255, blank=True, null=True, verbose_name='Authority پرداخت')
    payment_ref_id = models.CharField(max_length=100, blank=True, null=True, verbose_name='RefID پرداخت')
    payment_status = models.CharField(max_length=50, default='pending', choices=[
        ('pending', 'در انتظار پرداخت'),
        ('success', 'پرداخت موفق'),
        ('failed', 'پرداخت ناموفق'),
        ('canceled', 'لغو شده'),
    ], verbose_name='وضعیت پرداخت')
    
    code_type = models.CharField(
        max_length=20, 
        choices=[('normal', 'عادی'), ('special', 'ویژه')],
        default='normal'
    )
    
    # اضافه کردن فیلدهای کیف پول
    wallet_balance = models.IntegerField(default=0, verbose_name='موجودی کیف پول (ریال)')
    total_withdrawn = models.IntegerField(default=0, verbose_name='مجموع برداشت‌ها (ریال)')
    last_withdrawal_date = models.DateTimeField(null=True, blank=True, verbose_name='تاریخ آخرین برداشت')
    
    likes = models.IntegerField(default=0)

    def __str__(self):
        return self.name
    
    # متد save رو override می‌کنیم تا expires_date رو محاسبه کنیم
    def save(self, *args, **kwargs):
        # اگر expires_date نداره و created_at داره، محاسبه کن
        if not self.expires_date and self.created_at:
            self.expires_date = self.created_at + timedelta(days=30)
        super().save(*args, **kwargs)
    
    def get_days_remaining(self):
        if self.expires_date:
            from datetime import date
            remaining = (self.expires_date - date.today()).days
            return max(0, remaining)
        return 0
    
    

class PendingRegistration(models.Model):
    name = models.CharField(max_length=255)
    owner = models.CharField(max_length=255)
    phone = models.CharField(max_length=11)
    email = models.EmailField(blank=True, null=True)
    business_type = models.CharField(max_length=50)
    address = models.TextField(blank=True, null=True)
    province = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    plan = models.CharField(max_length=20, default='normal')
    password = models.CharField(max_length=255)
    code_type = models.CharField(
        max_length=20, 
        choices=[('normal', 'عادی'), ('special', 'ویژه')],
        default='normal'
    )
    business_code = models.CharField(max_length=20, unique=True)
    price = models.IntegerField(default=0)
    status = models.CharField(
        max_length=50,
        choices=[
            ('pending_payment', 'در انتظار پرداخت'),
            ('paid', 'پرداخت شده'),
            ('expired', 'منقضی شده'),
            ('cancelled', 'لغو شده')
        ],
        default='pending_payment'
    )
    
    # اطلاعات پرداخت
    payment_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    payment_authority = models.CharField(max_length=255, blank=True, null=True)
    payment_ref_id = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "ثبت موقت"
        verbose_name_plural = "ثبت‌های موقت"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.business_code})"


class WalletTransaction(models.Model):
    """مدل تراکنش‌های کیف پول"""
    TRANSACTION_TYPES = [
        ('deposit', 'واریز'),
        ('withdrawal', 'برداشت'),
        ('payment', 'پرداخت'),
        ('reward', 'پاداش'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'در انتظار'),
        ('completed', 'تکمیل شده'),
        ('failed', 'ناموفق'),
        ('cancelled', 'لغو شده'),
    ]
    
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='wallet_transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.IntegerField(verbose_name='مبلغ (ریال)')
    description = models.TextField(blank=True, null=True)
    
    # برای برداشت بر اساس بازدید
    views_before = models.IntegerField(default=0, verbose_name='تعداد بازدید قبل از برداشت')
    views_used = models.IntegerField(default=0, verbose_name='بازدیدهای استفاده شده')
    views_remaining = models.IntegerField(default=0, verbose_name='بازدیدهای باقیمانده')
    
    # برای پرداخت‌ها
    payment_for = models.CharField(max_length=100, blank=True, null=True, verbose_name='برای')
    payment_details = models.JSONField(blank=True, null=True, verbose_name='جزئیات پرداخت')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'تراکنش کیف پول'
        verbose_name_plural = 'تراکنش‌های کیف پول'
    
    def __str__(self):
        return f"{self.business.name} - {self.get_transaction_type_display()} - {self.amount} ریال"


class WithdrawalRequest(models.Model):
    """مدل درخواست برداشت"""
    WITHDRAWAL_METHODS = [
        ('bank_transfer', 'حواله بانکی'),
        ('wallet', 'کیف پول درون‌برنامه‌ای'),
    ]
    
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='withdrawal_requests')
    amount = models.IntegerField(verbose_name='مبلغ درخواستی (ریال)')
    method = models.CharField(max_length=20, choices=WITHDRAWAL_METHODS, default='wallet')
    
    # برای برداشت بر اساس بازدید
    views_before = models.IntegerField(default=0, verbose_name='تعداد بازدید قبل از درخواست')
    views_to_use = models.IntegerField(default=0, verbose_name='تعداد بازدید برای استفاده')
    
    # اطلاعات بانکی (اگر روش حواله بانکی باشد)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    account_number = models.CharField(max_length=50, blank=True, null=True)
    card_number = models.CharField(max_length=20, blank=True, null=True)
    sheba_number = models.CharField(max_length=26, blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=[
        ('pending', 'در انتظار بررسی'),
        ('approved', 'تایید شده'),
        ('rejected', 'رد شده'),
        ('completed', 'تکمیل شده'),
    ], default='pending')
    
    admin_notes = models.TextField(blank=True, null=True, verbose_name='یادداشت ادمین')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'درخواست برداشت'
        verbose_name_plural = 'درخواست‌های برداشت'
    
    def __str__(self):
        return f"{self.business.name} - {self.amount} ریال - {self.get_status_display()}"
    
    
class BusinessLike(models.Model):
    """برای track کردن لایک‌ها بر اساس IP"""
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='likes_tracking')
    ip_hash = models.CharField(max_length=64)  # هش IP کاربر
    user_agent = models.TextField(blank=True, null=True)  # اطلاعات مرورگر
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['business', 'ip_hash']  # هر IP یک بار می‌تواند لایک کند
        indexes = [
            models.Index(fields=['business', 'ip_hash']),
            models.Index(fields=['ip_hash']),
        ]
    
    @staticmethod
    def hash_ip(ip_address):
        """هش کردن IP برای حفظ حریم خصوصی"""
        return hashlib.sha256(ip_address.encode()).hexdigest()