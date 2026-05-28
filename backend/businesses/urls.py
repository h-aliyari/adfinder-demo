# D:\adfinder\backend\businesses\urls.py
from django.urls import path
from .views import (
    BusinessLoginView,
    BusinessRegisterView,
    CheckBusinessCodeView,
    CheckPhoneView,
    FullPlusAvailabilityView,
    SearchBusinessesView,
    create_pending_registration,
    verify_payment,
    initiate_payment,
    make_payment_from_wallet,

)
from . import views

urlpatterns = [
    # 1. API endpoints عمومی (ثابت)
    path('login/', BusinessLoginView.as_view(), name='business-login'),
    path('register/', BusinessRegisterView.as_view(), name='business-register'),
    path('check-code/<str:code>/', CheckBusinessCodeView.as_view(), name='check-code'),
    path('check-phone/<str:phone>/', CheckPhoneView.as_view(), name='check-phone'),
    path('full-plus-availability/', FullPlusAvailabilityView.as_view(), name='full-plus-availability'),
    path('search/', SearchBusinessesView.as_view(), name='search-businesses'),
    
    # 2. **مسیرهای جدید برای پرداخت** - اضافه کنید
    path('pending-registration/', create_pending_registration, name='pending-registration'),
    path('payment/<str:payment_id>/initiate/', initiate_payment, name='initiate-payment'),
    path('payment/<str:payment_id>/verify/', verify_payment, name='verify-payment'),
    # path('success/', SuccessPage, name='success'), 
    
    # 3. مسیرهای dashboard (با business_code) - باید قبل از business_id باشند
    path('<str:business_code>/dashboard/', views.business_dashboard, name='business_dashboard'),
    path('<str:business_code>/profile/', views.business_profile, name='business_profile'),
    path('<str:business_code>/stats/', views.business_stats, name='business_stats'),
    path('<str:business_code>/update-profile/', views.update_business_profile, name='update_business_profile'),
    
    # 4. مسیرهای خاص business (با business_id)
    path('<str:business_id>/', views.get_business_by_id, name='get_business_by_id'),
    path('<str:business_id>/increment-views/', views.increment_views, name='increment_views'),
    path('<str:business_id>/save/', views.save_business, name='save_business'),
    path('<str:business_id>/custom-page/', views.custom_page_api, name='custom_page_api'),
    
    path('<str:business_code>/wallet/', views.wallet_info, name='wallet_info'),
    path('<str:business_code>/wallet/withdraw/', views.request_withdrawal, name='request_withdrawal'),
    path('<str:business_code>/wallet/pay/', views.make_payment_from_wallet, name='make_payment'),
    path('<str:business_code>/wallet/transactions/', views.wallet_transactions, name='wallet_transactions'),

    path('<business_id>/toggle-like/', views.toggle_like, name='toggle_like'),
    path('<business_id>/check-like/', views.check_like_status, name='check_like_status'),
    
]