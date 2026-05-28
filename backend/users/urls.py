# backend\users\urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# ایجاد یک روتر برای ViewSet
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)), # مسیرهای مربوط به UserViewSet (مثل /api/users/)
    path('login/', views.LoginView.as_view(), name='login'), # /api/users/login/
    path('logout/', views.LogoutView.as_view(), name='logout'), # /api/users/logout/
    path('register/owner/', views.OwnerRegisterView.as_view(), name='register_owner'), # /api/users/register/owner/
    path('register/operator/', views.OperatorRegisterView.as_view(), name='register_operator'), # /api/users/register/operator/
    # path('register/admin/', views.AdminRegisterView.as_view(), name='register_admin'), # در صورت نیاز ساخته شود
    path('profile/', views.GetUserProfileView.as_view(), name='get_user_profile'), # /api/users/profile/
]
