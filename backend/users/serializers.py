# backend\users\serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
from django.core.exceptions import ValidationError

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff'] # فیلدهای مورد نیاز را اضافه کنید

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[password_validation.validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")
    role = serializers.CharField(read_only=True) # نقش در اینجا تنظیم نمی شود، بلکه توسط ویوی ثبت نام تعیین می شود

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        # نقش کاربر اینجا به صورت پیش فرض تعیین نمی شود، بلکه توسط ویو اصلی انجام می شود
        # user.role = validated_data.get('role', 'customer') # مثال
        # user.save()
        return user

# فرض کنید سریالایزر owner و operator فقط فیلدهای لازم را دارند و به RegisterSerializer ارث نمی برند
# یا اینکه نقش را درون آنها ست می کنید.
class OwnerRegisterSerializer(RegisterSerializer):
        class Meta(RegisterSerializer.Meta):
            fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2']

        def create(self, validated_data):
            user = super().create(validated_data)
            user.role = 'owner' # اختصاص نقش owner
            user.save()
            return user

class OperatorRegisterSerializer(RegisterSerializer):
        class Meta(RegisterSerializer.Meta):
            fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2']

        def create(self, validated_data):
            user = super().create(validated_data)
            user.role = 'operator1' # یا operator2
            user.save()
            return user
