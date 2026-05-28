# D:\adfinder\backend\users\models.py

from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    # فیلدهای custom
    phone = models.CharField(
        max_length=15,
        unique=True,
        null=True,
        blank=True,
        verbose_name=_('شماره تلفن')
    )
    
    # برای جلوگیری از conflict با auth.User
    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_('The groups this user belongs to.'),
        related_name='custom_user_set',  # مهم: این رو تغییر بده
        related_query_name='custom_user',
    )
    
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name='custom_user_set',  # مهم: این رو تغییر بده
        related_query_name='custom_user',
    )
    
    # اگر می‌خواهی با phone لاگین بشه:
    # USERNAME_FIELD = 'phone'
    # REQUIRED_FIELDS = ['username', 'email']
    
    class Meta:
        verbose_name = _('کاربر')
        verbose_name_plural = _('کاربران')
        db_table = 'users_user'  # اختیاری
    
    def __str__(self):
        return self.username or self.email