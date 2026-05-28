# D:\adfinder\backend\adfinder_core\urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from ads.urls import router as ads_router
# from businesses.urls import router as businesses_router
from queues.urls import router as queues_router
from users.urls import router as users_router 
# from subscriptions.urls import router as subscriptions_router

# یک روتر اصلی
from rest_framework.routers import DefaultRouter
main_router = DefaultRouter()

main_router.registry.extend(ads_router.registry)
# main_router.registry.extend(businesses_router.registry)
main_router.registry.extend(queues_router.registry)
main_router.registry.extend(users_router.registry)
# main_router.registry.extend(subscriptions_router.registry)

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT authentication endpoints
    path('api/auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # include app APIs
    path('api/', include(main_router.urls)),
    
    path('api/businesses/', include('businesses.urls')),
    
    path('ads/', include('ads.urls')), 
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)