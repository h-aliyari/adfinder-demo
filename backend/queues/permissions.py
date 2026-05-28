from rest_framework import permissions

class IsRestaurantOperator(permissions.BasePermission):
    """
    اجازه دسترسی به اپراتورهای رستوران (operator1 و operator2).
    """
    def has_permission(self, request, view):
        # شرط اول: کاربر باید احراز هویت شده باشد
        if not request.user or not request.user.is_authenticated:
            return False

        # شرط دوم: نقش کاربر باید یکی از اپراتورهای رستوران باشد
        return request.user.role in ('operator1', 'operator2')

# شما می‌توانید پرمیشن‌های دقیق‌تری برای operator1 و operator2 جداگانه بنویسید
# اگر نیاز به تفکیک دسترسی بین این دو اپراتور دارید.
# مثال:
# class IsOperator1(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user and request.user.is_authenticated and request.user.role == 'operator1'
#
# class IsOperator2(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user and request.user.is_authenticated and request.user.role == 'operator2'
