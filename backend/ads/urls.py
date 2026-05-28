# D:\adfinder\backend\ads\urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdsPublicView, AdsAdminView,
    TrackImpressionView, TrackClickView, AdStatsView
)

router = DefaultRouter()

urlpatterns = [
    # مسیرهای مبتنی بر router
    path('api/', include(router.urls)),
    
    # مسیرهای custom شما
    path('', AdsPublicView.as_view(), name='ads-public'),
    path('admin/', AdsAdminView.as_view(), name='ads-admin'),
    
    path('track/impression/<int:ad_id>/', TrackImpressionView.as_view(), name='track-impression'),
    path('track/click/<int:ad_id>/', TrackClickView.as_view(), name='track-click'),
    path('stats/', AdStatsView.as_view(), name='ad-stats'),
    path('stats/<int:ad_id>/', AdStatsView.as_view(), name='ad-stats-detail'),
]