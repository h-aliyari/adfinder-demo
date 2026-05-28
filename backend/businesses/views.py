# D:\adfinder\backend\businesses\views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from django.db import transaction
from django.db.models import Sum, Q

from .models import Business, WalletTransaction, WithdrawalRequest, BusinessLike
from .serializers import BusinessSerializer
from .payment_utils import create_zarinpal_payment, verify_zarinpal_payment
from .utils import (
    get_client_ip, hash_ip, calculate_days_remaining,
    generate_business_code, create_payment_id, validate_business_data,
    prepare_business_response, calculate_withdrawable_amount
)
from django.conf import settings
import json
from datetime import timedelta

# ============ Basic CRUD Views ============
@csrf_exempt
def business_profile(request, business_code):
    """مدیریت پروفایل کسب‌وکار"""
    try:
        business = Business.objects.get(business_code=business_code)
        
        if request.method == 'GET':
            profile = prepare_business_response(business)
            return JsonResponse(profile)
        
        elif request.method == 'PUT':
            data = json.loads(request.body)
            
            # آپدیت فیلدهای مجاز
            allowed_fields = ['name', 'owner', 'email', 'business_type', 'address', 'description']
            for field in allowed_fields:
                if field in data:
                    setattr(business, field, data[field])
            
            business.save()
            return JsonResponse({'success': True})
        
    except Business.DoesNotExist:
        return JsonResponse({'error': 'کسب‌وکار یافت نشد'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'داده‌های نامعتبر'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def business_stats(request, business_code):
    """آمار کسب‌وکار"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        business = Business.objects.get(business_code=business_code)
        return JsonResponse({
            'views': business.views or 0,
            'searches': business.searches or 0,
            'saves': business.saves or 0
        })
    except Business.DoesNotExist:
        return JsonResponse({'error': 'کسب‌وکار یافت نشد'}, status=404)

@csrf_exempt
def business_dashboard(request, business_code):
    """داشبورد کسب‌وکار"""
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        business = Business.objects.get(business_code=business_code)
        expires_date = business.created_at + timedelta(days=30)
        
        dashboard_info = {
            'code': business.business_code,
            'name': business.name,
            'owner': business.owner,
            'phone': business.phone,
            'email': business.email or '',
            'businessType': business.business_type,
            'address': business.address or '',
            'description': business.description or '',
            'plan': business.plan,
            'created_at': business.created_at.isoformat(),
            'expires_date': expires_date.isoformat(),
            'days_remaining': calculate_days_remaining(business),
            'status': business.status,
            'views': business.views or 0,
            'searches': business.searches or 0,
            'saves': business.saves or 0
        }
        
        return JsonResponse(dashboard_info)
    except Business.DoesNotExist:
        return JsonResponse({'error': 'کسب‌وکار یافت نشد'}, status=404)

# ============ Authentication Views ============
class BusinessLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            identifier = request.data.get('identifier')
            password = request.data.get('password')
            
            # پیدا کردن کسب‌وکار
            if identifier.startswith('09'):
                business = Business.objects.get(phone=identifier)
            else:
                business = Business.objects.get(business_code=identifier)
            
            # بررسی پسورد
            if check_password(password, business.password):
                return Response({
                    'success': True,
                    'business_code': business.business_code,
                    'business_name': business.name,
                    'plan': business.plan
                })
            
            return Response({
                'success': False,
                'error': 'اطلاعات ورود نادرست'
            }, status=status.HTTP_401_UNAUTHORIZED)
                
        except Business.DoesNotExist:
            return Response({
                'success': False,
                'error': 'کسب‌وکار یافت نشد'
            }, status=status.HTTP_401_UNAUTHORIZED)

class BusinessRegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            data = request.data
            
            # بررسی تکراری نبودن
            if Business.objects.filter(business_code=data.get('business_code')).exists():
                return Response({
                    'success': False,
                    'error': 'کد کسب‌وکار تکراری است'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if Business.objects.filter(phone=data.get('phone')).exists():
                return Response({
                    'success': False,
                    'error': 'شماره تلفن تکراری است'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # ایجاد کسب‌وکار
            business = Business(
                name=data.get('name'),
                owner=data.get('owner'),
                phone=data.get('phone'),
                email=data.get('email', ''),
                business_code=data.get('business_code'),
                business_type=data.get('business_type'),
                address=data.get('address', ''),
                description=data.get('description', ''),
                plan=data.get('plan', 'normal'),
                password=data.get('password'),
                status='active'
            )
            business.save()
            
            return Response({
                'success': True,
                'business_code': business.business_code,
                'message': 'ثبت‌نام موفقیت‌آمیز'
            })
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ============ Search & Check Views ============
class SearchBusinessesView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        query = request.GET.get('q', '')
        business_type = request.GET.get('type', '')
        province = request.GET.get('province', '')
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 20))
        
        businesses = Business.objects.filter(status='active')
        
        if query:
            businesses = businesses.filter(
                Q(name__icontains=query) |
                Q(business_code__icontains=query) |
                Q(owner__icontains=query)
            )
        
        if business_type:
            businesses = businesses.filter(business_type=business_type)
        
        if province:
            businesses = businesses.filter(province=province)
        
        total_count = businesses.count()
        start = (page - 1) * limit
        
        results = businesses.values(
            'id', 'name', 'business_code', 'business_type', 'plan',
            'phone', 'address', 'province', 'description', 'owner',
            'email', 'status', 'created_at', 'views', 'searches', 'saves'
        )[start:start + limit]
        
        return Response({
            'results': list(results),
            'total': total_count,
            'page': page,
            'limit': limit,
            'has_more': total_count > start + limit
        })

class CheckBusinessCodeView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, code):
        exists = Business.objects.filter(business_code=code).exists()
        return Response({'exists': exists, 'code': code})

class CheckPhoneView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, phone):
        exists = Business.objects.filter(phone=phone).exists()
        return Response({'exists': exists, 'phone': phone})

class FullPlusAvailabilityView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        full_plus_count = Business.objects.filter(plan='full_plus').count()
        max_limit = 10
        available = full_plus_count < max_limit
        
        return Response({
            'available': available,
            'remaining_slots': max_limit - full_plus_count,
            'total_slots': max_limit,
            'current_count': full_plus_count
        })

# ============ Business Detail Views ============
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_business_by_id(request, business_id):
    """دریافت اطلاعات کسب‌وکار"""
    try:
        # پیدا کردن کسب‌وکار
        try:
            business_id_int = int(business_id)
            business = Business.objects.get(id=business_id_int)
        except (ValueError, Business.DoesNotExist):
            business = Business.objects.get(business_code__iexact=business_id)
        
        # افزایش بازدید
        business.views = (business.views or 0) + 1
        business.save()
        
        # آماده‌سازی پاسخ
        response_data = prepare_business_response(business)
        return Response(response_data)
        
    except Business.DoesNotExist:
        return Response(
            {'error': 'کسب‌وکار یافت نشد'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'خطا: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def increment_views(request, business_id):
    """افزایش تعداد بازدید"""
    try:
        try:
            business_id_int = int(business_id)
            business = Business.objects.get(id=business_id_int)
        except (ValueError, Business.DoesNotExist):
            business = Business.objects.get(business_code=business_id)
        
        business.views += 1
        business.save()
        return Response({'success': True, 'views': business.views})
    except Business.DoesNotExist:
        return Response(
            {'error': 'کسب‌وکار یافت نشد'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def save_business(request, business_id):
    """ذخیره کسب‌وکار"""
    try:
        try:
            business_id_int = int(business_id)
            business = Business.objects.get(id=business_id_int)
        except (ValueError, Business.DoesNotExist):
            business = Business.objects.get(business_code=business_id)
        
        business.saves += 1
        business.save()
        return Response({'success': True, 'saves': business.saves})
    except Business.DoesNotExist:
        return Response(
            {'error': 'کسب‌وکار یافت نشد'},
            status=status.HTTP_404_NOT_FOUND
        )

# ============ Custom Page Views ============
@api_view(['GET', 'PUT'])
@permission_classes([permissions.AllowAny])
def custom_page_api(request, business_id):
    """مدیریت صفحه اختصاصی"""
    try:
        # پیدا کردن کسب‌وکار
        try:
            business_id_int = int(business_id)
            business = Business.objects.get(id=business_id_int)
        except (ValueError, Business.DoesNotExist):
            business = Business.objects.get(business_code=business_id)
        
        if request.method == 'GET':
            custom_data = {
                'social_links': getattr(business, 'social_links', []),
                'custom_address': getattr(business, 'custom_address', ''),
                'working_hours': getattr(business, 'working_hours', ''),
                'custom_description': getattr(business, 'custom_description', ''),
                'special_offers': getattr(business, 'special_offers', []),
                'has_custom_page': business.plan in ['full_plus', 'pro']
            }
            return Response(custom_data)
            
        elif request.method == 'PUT':
            data = request.data
            
            # آپدیت فیلدها
            update_fields = [
                'social_links', 'custom_address', 'working_hours',
                'custom_description', 'special_offers'
            ]
            
            for field in update_fields:
                if field in data:
                    setattr(business, field, data[field])
            
            business.save()
            return Response({
                'success': True,
                'message': 'صفحه اختصاصی بروزرسانی شد'
            })
    
    except Business.DoesNotExist:
        return Response(
            {'error': 'کسب‌وکار یافت نشد'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'خطا: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ============ Payment Registration Views ============
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_pending_registration(request):
    """ثبت موقت قبل از پرداخت"""
    try:
        data = request.data
        
        # اعتبارسنجی
        errors = validate_business_data(data)
        if errors:
            return Response({
                'success': False,
                'error': '، '.join(errors)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # بررسی تکراری بودن
        if Business.objects.filter(phone=data['phone']).exists():
            return Response({
                'success': False,
                'error': 'شماره تلفن تکراری'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # تولید کد و شناسه پرداخت
        business_code = generate_business_code(data['code_type'])
        price = 100000 if data['code_type'] == 'special' else 50000
        payment_id = create_payment_id()
        
        # ایجاد کسب‌وکار
        business = Business.objects.create(
            name=data['name'],
            owner=data['owner'],
            phone=data['phone'],
            email=data.get('email', ''),
            business_type=data['business_type'],
            address=data.get('address', ''),
            province=data.get('province', ''),
            description=data.get('description', ''),
            plan=data['plan'],
            password=data['password'],
            business_code=business_code,
            code_type=data['code_type'],
            price=price,
            status='pending_payment',
            payment_id=payment_id
        )
        
        return Response({
            'success': True,
            'payment_id': payment_id,
            'business_code': business_code,
            'price': price,
            'message': 'ثبت موقت ایجاد شد'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': f'خطا: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def initiate_payment(request, payment_id):
    """شروع پرداخت"""
    try:
        business = Business.objects.get(payment_id=payment_id)
        
        if business.status != 'pending_payment':
            return Response({
                'success': False,
                'error': 'وضعیت حساب نامعتبر'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # ایجاد لینک پرداخت
        payment_result = create_zarinpal_payment(
            amount=business.price,
            description=f"پرداخت برای {business.name}",
            callback_url=f"{settings.FRONTEND_URL}/business-register/payment/{payment_id}/verify/"
        )
        
        if payment_result['success']:
            business.payment_authority = payment_result['authority']
            business.save()
            
            return Response({
                'success': True,
                'payment_url': payment_result['payment_url'],
                'authority': payment_result['authority']
            })
        
        return Response({
            'success': False,
            'error': payment_result.get('error', 'خطای ناشناخته')
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Business.DoesNotExist:
        return Response({
            'success': False,
            'error': 'شناسه پرداخت نامعتبر'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': f'خطا: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def verify_payment(request, payment_id):
    """تایید پرداخت"""
    try:
        business = Business.objects.get(payment_id=payment_id)
        
        if business.status == 'active':
            return Response({
                'success': True,
                'business_code': business.business_code,
                'message': 'حساب قبلاً فعال شده'
            })
        
        if business.status == 'pending_payment':
            # بررسی پرداخت
            if business.payment_authority:
                verify_result = verify_zarinpal_payment(
                    authority=business.payment_authority,
                    amount=business.price
                )
                
                if verify_result['success']:
                    business.status = 'active'
                    business.payment_ref_id = verify_result.get('ref_id')
                    business.payment_status = 'success'
                    business.save()
                    
                    return Response({
                        'success': True,
                        'business_code': business.business_code,
                        'ref_id': verify_result.get('ref_id'),
                        'message': 'پرداخت تایید شد'
                    })
                
                return Response({
                    'success': False,
                    'error': verify_result.get('error', 'خطای پرداخت')
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # حالت تست
            business.status = 'active'
            business.payment_status = 'success'
            business.save()
            
            return Response({
                'success': True,
                'business_code': business.business_code,
                'message': 'پرداخت تست تایید شد'
            })
        
        return Response({
            'success': False,
            'error': f'وضعیت نامعتبر: {business.status}'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Business.DoesNotExist:
        return Response({
            'success': False,
            'error': 'شناسه پرداخت نامعتبر'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': f'خطا: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ============ Like System Views ============
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def toggle_like(request, business_id):
    """لایک/آنلایک"""
    try:
        # پیدا کردن کسب‌وکار
        try:
            business_id_int = int(business_id)
            business = Business.objects.get(id=business_id_int)
        except (ValueError, Business.DoesNotExist):
            business = Business.objects.get(business_code=business_id)
        
        client_ip = get_client_ip(request)
        ip_hash = hash_ip(client_ip)
        
        # بررسی لایک قبلی
        like_exists = BusinessLike.objects.filter(
            business=business, 
            ip_hash=ip_hash
        ).exists()
        
        if like_exists:
            # آنلایک
            BusinessLike.objects.filter(business=business, ip_hash=ip_hash).delete()
            business.likes = max(0, business.likes - 1)
            is_liked = False
            message = 'آنلایک شد'
        else:
            # لایک
            BusinessLike.objects.create(
                business=business,
                ip_hash=ip_hash,
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
            )
            business.likes += 1
            is_liked = True
            message = 'لایک شد'
        
        business.save()
        
        return Response({
            'success': True,
            'likes': business.likes,
            'is_liked': is_liked,
            'message': message
        })
        
    except Business.DoesNotExist:
        return Response({
            'success': False,
            'error': 'کسب‌وکار یافت نشد'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': f'خطا: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_like_status(request, business_id):
    """بررسی وضعیت لایک"""
    try:
        # پیدا کردن کسب‌وکار
        try:
            business_id_int = int(business_id)
            business = Business.objects.get(id=business_id_int)
        except (ValueError, Business.DoesNotExist):
            business = Business.objects.get(business_code=business_id)
        
        client_ip = get_client_ip(request)
        ip_hash = hash_ip(client_ip)
        
        is_liked = BusinessLike.objects.filter(
            business=business, 
            ip_hash=ip_hash
        ).exists()
        
        return Response({
            'success': True,
            'likes': business.likes,
            'is_liked': is_liked
        })
        
    except Business.DoesNotExist:
        return Response({
            'success': False,
            'error': 'کسب‌وکار یافت نشد'
        }, status=status.HTTP_404_NOT_FOUND)

# ============ Wallet Views ============
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def wallet_info(request, business_code):
    """اطلاعات کیف پول"""
    try:
        business = Business.objects.get(business_code=business_code)
        
        # محاسبات
        calc_result = calculate_withdrawable_amount(business)
        
        # تراکنش‌های اخیر
        recent_transactions = WalletTransaction.objects.filter(
            business=business
        ).order_by('-created_at')[:10].values(
            'id', 'transaction_type', 'amount', 'description',
            'status', 'created_at', 'views_used'
        )
        
        return Response({
            'success': True,
            'wallet': {
                'balance': business.wallet_balance,
                'total_withdrawn': business.total_withdrawn,
                'total_views': calc_result['total_views'],
                'used_views': calc_result['used_views'],
                'available_views': calc_result['available_views'],
                'withdrawable_amount': calc_result['withdrawable_amount'],
                'last_withdrawal_date': business.last_withdrawal_date,
            },
            'recent_transactions': list(recent_transactions)
        })
        
    except Business.DoesNotExist:
        return Response({'success': False, 'error': 'کسب‌وکار یافت نشد'}, status=404)
    except Exception as e:
        return Response({'success': False, 'error': f'خطا: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def request_withdrawal(request, business_code):
    """درخواست برداشت"""
    try:
        business = Business.objects.get(business_code=business_code)
        data = request.data
        
        # محاسبه موجودی قابل برداشت
        calc_result = calculate_withdrawable_amount(business)
        max_withdrawable = calc_result['withdrawable_amount']
        
        requested_amount = int(data.get('amount', 0))
        
        # اعتبارسنجی
        if requested_amount < 10000:
            return Response({
                'success': False,
                'error': 'حداقل مبلغ ۱۰۰۰ تومان'
            }, status=400)
        
        if requested_amount > max_withdrawable:
            return Response({
                'success': False,
                'error': f'موجودی کافی نیست. حداکثر: {max_withdrawable // 10} تومان'
            }, status=400)
        
        # محاسبه بازدید مورد نیاز
        views_needed = (requested_amount // 20000) * 1000
        
        with transaction.atomic():
            # ایجاد تراکنش
            WalletTransaction.objects.create(
                business=business,
                transaction_type='withdrawal',
                amount=requested_amount,
                description=f'برداشت نقدی',
                views_before=calc_result['total_views'],
                views_used=views_needed,
                views_remaining=calc_result['available_views'] - views_needed,
                status='pending'
            )
            
            # ایجاد درخواست
            WithdrawalRequest.objects.create(
                business=business,
                amount=requested_amount,
                method=data.get('method', 'wallet'),
                views_before=calc_result['total_views'],
                views_to_use=views_needed,
                bank_name=data.get('bank_name'),
                account_number=data.get('account_number'),
                status='pending'
            )
        
        return Response({
            'success': True,
            'message': 'درخواست ثبت شد',
            'amount': requested_amount,
            'views_used': views_needed
        })
        
    except Business.DoesNotExist:
        return Response({'success': False, 'error': 'کسب‌وکار یافت نشد'}, status=404)
    except Exception as e:
        return Response({'success': False, 'error': f'خطا: {str(e)}'}, status=500)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def wallet_transactions(request, business_code):
    """تاریخچه تراکنش‌ها"""
    try:
        business = Business.objects.get(business_code=business_code)
        
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 20))
        
        transactions = WalletTransaction.objects.filter(business=business)
        total_count = transactions.count()
        start = (page - 1) * limit
        
        results = transactions.order_by('-created_at')[start:start + limit].values(
            'id', 'transaction_type', 'amount', 'description',
            'views_used', 'payment_for', 'status', 'created_at'
        )
        
        return Response({
            'success': True,
            'transactions': list(results),
            'total': total_count,
            'page': page,
            'limit': limit,
            'has_more': total_count > start + limit
        })
        
    except Business.DoesNotExist:
        return Response({'success': False, 'error': 'کسب‌وکار یافت نشد'}, status=404)
    except Exception as e:
        return Response({'success': False, 'error': f'خطا: {str(e)}'}, status=500)
    
    
@csrf_exempt
def update_business_profile(request, business_code):
    """آپدیت پروفایل کسب‌وکار"""
    if request.method == 'PUT':
        try:
            business = Business.objects.get(business_code=business_code)
            data = json.loads(request.body)
            
            allowed_fields = ['name', 'owner', 'email', 'businessType', 'address', 'description']
            updated_fields = []
            
            for field in allowed_fields:
                if field in data:
                    model_field = 'business_type' if field == 'businessType' else field
                    setattr(business, model_field, data[field])
                    updated_fields.append(field)
            
            if updated_fields:
                business.save()
                return JsonResponse({
                    'success': True,
                    'message': 'پروفایل بروزرسانی شد',
                    'updated_fields': updated_fields
                })
            
            return JsonResponse({
                'success': False,
                'error': 'هیچ فیلد معتبری ارسال نشده'
            }, status=400)
                
        except Business.DoesNotExist:
            return JsonResponse({'error': 'کسب‌وکار یافت نشد'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


# به views.py اضافه کن (قسمت Wallet Views):
@csrf_exempt
def make_payment_from_wallet(request, business_code):
    """پرداخت از کیف پول"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            amount = data.get('amount')
            description = data.get('description', 'پرداخت از کیف پول')
            
            if not amount or amount <= 0:
                return JsonResponse({'error': 'مبلغ معتبر وارد کنید'}, status=400)
            
            business = Business.objects.get(business_code=business_code)
            
            # محاسبه موجودی قابل برداشت
            wallet_info = calculate_withdrawable_amount(business)
            available_amount = wallet_info['withdrawable_amount']
            
            if amount > available_amount:
                return JsonResponse({
                    'error': f'موجودی کافی نیست. موجودی قابل برداشت: {available_amount} ریال'
                }, status=400)
            
            # ایجاد تراکنش
            transaction = WalletTransaction.objects.create(
                business=business,
                amount=amount,
                description=description,
                transaction_type='payment',
                status='completed',
                views_used=int(amount / 20000) * 1000  # هر 20000 ریال = 1000 بازدید
            )
            
            return JsonResponse({
                'success': True,
                'message': 'پرداخت با موفقیت انجام شد',
                'transaction_id': transaction.id,
                'amount': amount,
                'remaining_balance': available_amount - amount,
                'transaction_date': transaction.created_at
            })
            
        except Business.DoesNotExist:
            return JsonResponse({'error': 'کسب‌وکار یافت نشد'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'داده‌های نامعتبر'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)