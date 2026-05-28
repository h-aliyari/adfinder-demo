# D:\adfinder\backend\ads\models.py
from django.db import models
from django.conf import settings

class PopupAd(models.Model):
    text = models.CharField(max_length=255)
    url = models.URLField()
    text_color = models.CharField(max_length=7, default='#000000')  # HEX color
    background = models.TextField()  # برای gradient یا رنگ ساده
    
    class Meta:
        verbose_name = "Popup Ad"
        verbose_name_plural = "Popup Ads"

class BottomAd(models.Model):
    text = models.CharField(max_length=255)
    url = models.URLField()
    text_color = models.CharField(max_length=7, default='#000000')
    background = models.TextField()
    
    class Meta:
        verbose_name = "Bottom Ad"
        verbose_name_plural = "Bottom Ads"

class HomeAd(models.Model):
    text = models.CharField(max_length=255)
    background = models.TextField()
    
    class Meta:
        verbose_name = "Home Ad"
        verbose_name_plural = "Home Ads"

class Home1Ad(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255)
    description = models.TextField()
    gradient = models.TextField()
    # features را به صورت JSON ذخیره می‌کنیم
    features = models.JSONField(default=list)
    
    class Meta:
        verbose_name = "Home1 Ad"
        verbose_name_plural = "Home1 Ads"

class Home2Ad(models.Model):
    title = models.CharField(max_length=255)
    desc = models.CharField(max_length=255, blank=True)
    url = models.URLField(blank=True)
    img = models.ImageField(upload_to='ads/home2/', blank=True)  # یا URLField
    
    class Meta:
        verbose_name = "Home2 Ad"
        verbose_name_plural = "Home2 Ads"
        

class Ad(models.Model):
    AD_TYPES = [
        ('popup', 'پاپ‌آپ'),
        ('bottom', 'تبلیغ پایین'),
        ('home', 'تبلیغ اصلی صفحه اول'),
        ('home1', 'تبلیغ کارت‌های صفحه اول'),
        ('home2', 'تبلیغ بیزنس‌ها'),
    ]
    
    ad_type = models.CharField(max_length=20, choices=AD_TYPES)
    title = models.CharField(max_length=200, blank=True)
    text = models.TextField(blank=True)
    url = models.URLField()
    text_color = models.CharField(max_length=20, default='#FFFFFF')
    background = models.CharField(max_length=200, blank=True)
    image_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_ad_type_display()} - {self.title or self.text[:50]}"

class AdImpression(models.Model):
    """ذخیره هر بار نمایش تبلیغ"""
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='impressions')
    session_id = models.CharField(max_length=100, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    page_url = models.URLField(blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['ad', 'timestamp']),
            models.Index(fields=['session_id']),
        ]

class AdClick(models.Model):
    """ذخیره هر کلیک روی تبلیغ"""
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='clicks')
    impression = models.ForeignKey(AdImpression, on_delete=models.SET_NULL, null=True, blank=True, related_name='clicks')
    session_id = models.CharField(max_length=100, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['ad', 'timestamp']),
        ]