from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    اجازه دسترسی فقط به کاربرانی که is_staff=True دارند (ادمین جنگو).
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class IsBusinessOwner(permissions.BasePermission):
    """
    اجازه دسترسی به صاحبان کسب و کار.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'owner'

class IsRestaurantOperator(permissions.BasePermission):
    """
    اجازه دسترسی به اپراتورهای رستوران (operator1 و operator2).
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ('operator1', 'operator2')

class IsCustomer(permissions.BasePermission):
    """
    این پرمیشن برای مشتریان نهایی که از طریق QR Code دسترسی دارند، در نظر گرفته شده است.
    اینها معمولا احراز هویت نمی‌شوند، بلکه دسترسی آنها از طریق URL (با پارامتر ID کسب و کار) کنترل می‌شود.
    اگر نیاز به احراز هویت برای مشتریان دارید، باید مکانیزم آن را جداگانه پیاده‌سازی کنید.
    """
    def has_permission(self, request, view):
        # برای مشتریان، احراز هویت لازم نیست، دسترسی از طریق پارامترهای URL کنترل می‌شود.
        # این پرمیشن بیشتر برای اطمینان از اینکه کاربر ناشناس یا ناخواسته به این بخش دسترسی پیدا نکند، استفاده می‌شود.
        # اگر view شما نیاز به پارامتر خاصی دارد (مثلا Business ID)، باید در متدهای view (get, post و ...) آن را بررسی کنید.
        return True # یا منطق دلخواه دیگر
