from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate, logout, get_user_model
from django.shortcuts import get_object_or_404

from .serializers import UserSerializer, RegisterSerializer, OwnerRegisterSerializer, OperatorRegisterSerializer # فرض می‌کنیم این سریالایزرها را دارید
# از permissions.py که قبلا ایجاد کردید، اگر لازم بود import کنید
# from .permissions import IsOwnerOrAdmin # مثال

User = get_user_model()

# ViewSet برای مدیریت کاربران (مناسب برای ادمین)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser] # فقط ادمین ها می توانند همه کاربران را ببینند و مدیریت کنند

    # برای دسترسی به یک کاربر خاص (مثلا برای نمایش پروفایل)
    def get_object(self):
        obj = get_object_or_404(self.queryset, pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

# ویوی ورود (Login)
class LoginView(APIView):
    # permission_classes = [~IsAuthenticated] # اجازه ورود فقط به کسانی که لاگین نیستند
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            # اگر نیاز به توکن دارید، اینجا باید از TokenObtainPairSerializer استفاده کنید
            # from rest_framework_simplejwt.tokens import RefreshToken
            # refresh = RefreshToken.for_user(user)
            # return Response({
            #     'refresh': str(refresh),
            #     'access': str(refresh.access_token),
            # })
            return Response({"detail": "Login successful. (Token generation not implemented yet)"}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# ویوی خروج (Logout)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated] # فقط کاربر لاگین شده می تواند خارج شود
    def post(self, request):
        logout(request)
        return Response({"detail": "Logout successful"}, status=status.HTTP_200_OK)

# ویوی ثبت نام مالک کسب و کار
class OwnerRegisterView(APIView):
    serializer_class = OwnerRegisterSerializer # فرض می‌کنیم این سریالایزر را دارید
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # اینجا می توانید کارهای بیشتری انجام دهید، مثلاً تنظیم نقش کاربر
            user.role = 'owner' # یا هر نقش دیگری که تعریف کرده اید
            user.save()
            # اگر نیاز به بازگرداندن توکن دارید:
            # refresh = RefreshToken.for_user(user)
            # return Response({
            #     'refresh': str(refresh),
            #     'access': str(refresh.access_token),
            # }, status=status.HTTP_201_CREATED)
            return Response({"detail": "Owner registered successfully. (Token generation not implemented yet)"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ویوی ثبت نام اپراتور
class OperatorRegisterView(APIView):
    serializer_class = OperatorRegisterSerializer # فرض می‌کنیم این سریالایزر را دارید
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.role = 'operator1' # یا operator2، بسته به نیاز
            user.save()
            # اگر نیاز به بازگرداندن توکن دارید:
            # refresh = RefreshToken.for_user(user)
            # return Response({
            #     'refresh': str(refresh),
            #     'access': str(refresh.access_token),
            # }, status=status.HTTP_201_CREATED)
            return Response({"detail": "Operator registered successfully. (Token generation not implemented yet)"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ویوی گرفتن پروفایل کاربر فعلی (نیاز به IsAuthenticated دارد)
class GetUserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer # از همین سریالایزر کاربر استفاده می کنیم

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
