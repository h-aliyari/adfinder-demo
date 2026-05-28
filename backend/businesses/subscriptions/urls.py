# subscriptions/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# ایجاد یک روتر برای ViewSet
router = DefaultRouter()
router.register(r'subscriptions', views.SubscriptionViewSet, basename='subscription')

urlpatterns = [
    path('', include(router.urls)),
]
