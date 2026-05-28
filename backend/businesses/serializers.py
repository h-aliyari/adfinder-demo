# D:\adfinder\backend\businesses\serializers.py
from rest_framework import serializers
from .models import Business
from .models import PendingRegistration
from django.contrib.auth.hashers import check_password
import re


class BusinessLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        identifier = data.get('identifier')
        password = data.get('password')
        
        # نرمالایز کردن identifier
        identifier = identifier.upper() if len(identifier) == 3 and identifier[0].isalpha() else identifier
        
        # پیدا کردن business
        try:
            # اول با business_code امتحان کن
            business = Business.objects.get(business_code=identifier)
        except Business.DoesNotExist:
            # اگر پیدا نشد، با phone امتحان کن
            try:
                business = Business.objects.get(phone=identifier)
            except Business.DoesNotExist:
                raise serializers.ValidationError({
                    'error': 'کد کسب‌وکار یا شماره تلفن یافت نشد'
                })
        
        # بررسی رمز عبور
        if not check_password(password, business.password):
            raise serializers.ValidationError({
                'error': 'رمز عبور اشتباه است'
            })
        
        # بررسی وضعیت
        if business.status != 'active':
            raise serializers.ValidationError({
                'error': 'حساب شما غیرفعال است'
            })
        
        data['business'] = business
        return data

class BusinessRegisterSerializer(serializers.ModelSerializer):
    business_type = serializers.CharField(source='business_type')
    social_links = serializers.ListField(child=serializers.CharField(), required=False)
    plan = serializers.ChoiceField(choices=['normal', 'pro', 'economy', 'full'])
    
    class Meta:
        model = Business
        fields = [
            'name', 'owner', 'phone', 'email', 'business_type',
            'social_links', 'description', 'plan', 'password',
            'province',  
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': False, 'allow_blank': True},
        }
    
    def validate_phone(self, value):
        if not re.match(r'^09\d{9}$', value):
            raise serializers.ValidationError("شماره تلفن معتبر نیست")
        return value
    
    def validate(self, data):
        # بررسی تکراری نبودن phone
        if Business.objects.filter(phone=data.get('phone')).exists():
            raise serializers.ValidationError({
                'phone': 'این شماره تلفن قبلاً ثبت شده است'
            })
        return data
    
    def create(self, validated_data):
        # ایجاد business_code منحصربه‌فرد
        from django.utils.crypto import get_random_string
        
        # تولید کد منحصربه‌فرد
        while True:
            business_code = get_random_string(3, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
            if not Business.objects.filter(business_code=business_code).exists():
                break
        
        # جدا کردن social_links
        social_links = validated_data.pop('social_links', [])
        
        # ایجاد business
        business = Business.objects.create(
            business_code=business_code,
            **validated_data
        )
        
        # ذخیره social_links (اگر فیلد جداگانه‌ای داری)
        # اگر نه، می‌تونی در description ذخیره کنی
        if social_links:
            business.description = f"{business.description}\n\nلینک‌های شبکه‌های اجتماعی:\n" + "\n".join(social_links)
            business.save()
        
        return business



class BusinessSerializer(serializers.ModelSerializer):
    days_remaining = serializers.SerializerMethodField()
    
    class Meta:
        model = Business
        fields = [
            'id', 'business_code', 'name', 'owner', 'phone', 'email',
            'business_type', 'address', 'description',
            'plan', 'created_at', 'expires_date',
            'status', 'views', 'searches', 'saves',
            'profile_image', 'social_links', 'custom_page_data',
            'days_remaining'
        ]
    
    def get_days_remaining(self, obj):
        if obj.expires_date:
            from datetime import date
            remaining = (obj.expires_date - date.today()).days
            return max(0, remaining)
        return 0
    

class PendingRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingRegistration
        fields = [
            'id',
            'name',
            'owner', 
            'phone',
            'email',
            'business_type',
            'address',
            'province',
            'social_links',
            'description',
            'plan',
            'password',
            'code_type',
            'business_code',  # 🚨 مطمئن شوید این فیلد وجود دارد
            'price',
            'status',
            'created_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def create(self, validated_data):
        # ایجاد رکورد
        instance = PendingRegistration.objects.create(**validated_data)
        return instance