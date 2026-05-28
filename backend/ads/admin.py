from django.contrib import admin
from .models import PopupAd, BottomAd, HomeAd, Home1Ad, Home2Ad

@admin.register(PopupAd)
class PopupAdAdmin(admin.ModelAdmin):
    list_display = ['id', 'text', 'url']

@admin.register(BottomAd)
class BottomAdAdmin(admin.ModelAdmin):
    list_display = ['id', 'text', 'url']

@admin.register(HomeAd)
class HomeAdAdmin(admin.ModelAdmin):
    list_display = ['id', 'text']

@admin.register(Home1Ad)
class Home1AdAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'subtitle']

@admin.register(Home2Ad)
class Home2AdAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'url']