# ads/serializers.py - اصلاح شده
from rest_framework import serializers
from .models import PopupAd, BottomAd, HomeAd, Home1Ad, Home2Ad

class PopupAdSerializer(serializers.ModelSerializer):
    class Meta:
        model = PopupAd
        fields = ['id', 'text', 'url', 'text_color', 'background']  # text_color نه textColor

class BottomAdSerializer(serializers.ModelSerializer):
    class Meta:
        model = BottomAd
        fields = ['id', 'text', 'url', 'text_color', 'background']  # text_color نه textColor

class HomeAdSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeAd
        fields = ['id', 'text', 'background']

class Home1AdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Home1Ad
        fields = ['id', 'title', 'subtitle', 'description', 'gradient', 'features']

class Home2AdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Home2Ad
        fields = ['id', 'title', 'desc', 'url', 'img']

# AdsResponseSerializer هم اگر دارید باید اصلاح شود
class AdsResponseSerializer(serializers.Serializer):
    popup = PopupAdSerializer(required=False)
    bottom = BottomAdSerializer(required=False)
    home = HomeAdSerializer(many=True, required=False)
    home1 = Home1AdSerializer(many=True, required=False)
    home2 = Home2AdSerializer(many=True, required=False)