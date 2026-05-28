# queues/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# ایجاد یک روتر برای ViewSet هایمان
router = DefaultRouter()
router.register(r'orders', views.OrderViewSet, basename='order')

# ثبت URL های پیش‌فرض ModelViewSet و همچنین URL های سفارشی
urlpatterns = [
    path('', include(router.urls)),
    # URL های سفارشی که در views.py تعریف کردیم، به طور خودکار توسط router.urls اضافه می‌شوند
    # اما اگر بخواهیم نام URLها را مشخص کنیم یا ساختار متفاوتی داشته باشیم، می‌توانیم دستی هم اضافه کنیم:
    # path('orders/<int:pk>/update_status/', views.OrderViewSet.as_view({'patch': 'update_status'}), name='order-update-status'),
    # path('orders/by_business/', views.OrderViewSet.as_view({'get': 'by_business'}), name='order-by-business'),
    # path('orders/by_status/', views.OrderViewSet.as_view({'get': 'by_status'}), name='order-by-status'),
]
