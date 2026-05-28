# D:\adfinder\backend\businesses\utils.py
from django.utils import timezone
from datetime import timedelta
import hashlib
import json
from django.utils.crypto import get_random_string
import string
import uuid

def get_client_ip(request):
    """گرفتن IP واقعی کاربر"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def calculate_days_remaining(business):
    """محاسبه روزهای باقی‌مانده"""
    if business.expires_date:
        remaining = (business.expires_date - timezone.now().date()).days
        return max(0, remaining)
    return 0

def generate_business_code(code_type):
    """تولید کد منحصربه‌فرد کسب‌وکار"""
    prefix = 'S' if code_type == 'special' else 'F'
    
    while True:
        random_part = get_random_string(2, string.digits)
        business_code = f"{prefix}{random_part}"
        
        from .models import Business  # Import در اینجا
        if not Business.objects.filter(business_code=business_code).exists():
            return business_code

def create_payment_id():
    """ایجاد شناسه پرداخت منحصربه‌فرد"""
    return str(uuid.uuid4())

def hash_ip(ip_address):
    """هش کردن IP برای ذخیره امن"""
    return hashlib.sha256(ip_address.encode()).hexdigest()

def validate_business_data(data, is_update=False):
    """اعتبارسنجی داده‌های کسب‌وکار"""
    errors = []
    
    if not is_update:
        required_fields = ['name', 'owner', 'phone', 'business_type', 'password', 'code_type']
        for field in required_fields:
            if field not in data or not data[field]:
                errors.append(f"فیلد '{field}' الزامی است")
    
    # اعتبارسنجی شماره تلفن
    if 'phone' in data:
        phone = str(data['phone'])
        if not phone.startswith('09') or len(phone) != 11:
            errors.append("شماره تلفن معتبر نیست (باید با 09 شروع شود و 11 رقمی باشد)")
    
    # اعتبارسنجی کد کسب‌وکار
    if 'business_code' in data and data['business_code']:
        code = data['business_code']
        if len(code) != 3:
            errors.append("کد کسب‌وکار باید ۳ کاراکتر باشد")
    
    return errors

def prepare_business_response(business):
    """آماده‌سازی پاسخ کسب‌وکار"""
    from .models import Business  # Import در اینجا
    
    response_data = {
        'id': business.id,
        'name': business.name,
        'owner': business.owner,
        'phone': business.phone,
        'email': business.email or '',
        'business_code': business.business_code,
        'business_type': business.business_type,
        'address': business.address or '',
        'description': business.description or '',
        'plan': business.plan,
        'status': business.status,
        'created_at': business.created_at,
        'views': business.views or 0,
        'searches': business.searches or 0,
        'saves': business.saves or 0,
        'likes': business.likes or 0,
    }
    
    # اضافه کردن فیلدهای optional
    optional_fields = [
        ('profile_image', str(business.profile_image) if business.profile_image else None),
        ('social_links', business.social_links if hasattr(business, 'social_links') else []),
        ('custom_page_data', business.custom_page_data if hasattr(business, 'custom_page_data') else {}),
        ('expires_date', business.expires_date),
        ('days_remaining', calculate_days_remaining(business)),
        ('code_type', business.code_type if hasattr(business, 'code_type') else ''),
        ('price', business.price if hasattr(business, 'price') else 0),
    ]
    
    for field_name, field_value in optional_fields:
        if field_value is not None:
            response_data[field_name] = field_value
    
    return response_data

def calculate_withdrawable_amount(business):
    """محاسبه مبلغ قابل برداشت"""
    from .models import WalletTransaction  # Import در اینجا
    from django.db.models import Sum
    
    total_views = business.views or 0
    
    # محاسبه بازدیدهای استفاده شده
    used_views = WalletTransaction.objects.filter(
        business=business,
        transaction_type__in=['withdrawal', 'payment'],
        status='completed'
    ).aggregate(Sum('views_used'))['views_used__sum'] or 0
    
    available_views = max(0, total_views - used_views)
    
    # هر 1000 بازدید = 20000 ریال
    withdrawable_amount = (available_views // 1000) * 20000
    
    return {
        'total_views': total_views,
        'used_views': used_views,
        'available_views': available_views,
        'withdrawable_amount': withdrawable_amount
    }