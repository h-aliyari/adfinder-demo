from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Ad
import uuid

class AdsPublicView(APIView):
    def get(self, request):
        default_data = {
            "popup": {
                "id": 1,
                "text": "🎉 به تبلیغ آنلاین خوش اومدی",
                "url": "https://example.com/special-offer",
                "textColor": "#FFFFFF",
                "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "is_active": True
            },
            "bottom": [
                {
                    "id": 1,
                    "text": "میتونی با سرچ پیشرفته کسب و کار مورد نظرتو توی شهر خودت پیدا کنی",
                    "url": "https://example.com/download-app",
                    "textColor": "#FFFFFF",
                    "background": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    "is_active": True
                },
                {
                    "id": 2,
                    "text": "تبلیغ آنلاین \n اکوسیستمی برای رشد و بهتر دیده شدن",
                    "url": "https://example.com/test",
                    "textColor": "#FFFFFF",
                    "background": "linear-gradient(135deg, #00dbde 0%, #fc00ff 100%)",
                    "is_active": True
                },
                {
                    "id": 3,
                    "text": "اینجا میتونی صفحه اختصاصی تولید محتوای کسب وکارت رو داشته باشی",
                    "url": "https://example.com/another",
                    "textColor": "#FFFFFF",
                    "background": "linear-gradient(135deg, #fad961 0%, #f76b1c 100%)",
                    "is_active": True
                }
            ],
            "home": [
                {
                    "id": 1,
                    "text": "🔥 محل تبلیغات شما",
                    "background": "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)"
                },
                {
                    "id": 2,
                    "text": "🚀 برای دیده شدن کسب و کارت ثبت نام کن",
                    "background": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
                },
            ],
            "home1": [
                {
                    "id": 1,
                    "title": 'در مرکز توجه مشتریان خود باشید',
                    "subtitle": 'صفحه اختصاصی کسب‌وکار با کد منحصر به فرد',
                    "description": 'کسب‌وکار شما به راحتی در نتایج جستجو دیده می‌شود',
                    "gradient": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
                    "features": ['نمایش در نتایج جستجو', 'صفحه اختصاصی', 'کد اختصاصی'],
                    "icon": "Target"
                },
                {
                    "id": 2,
                    "title": "🌟 خدمات اختصاصی",
                    "subtitle": "برای کسب‌وکار شما",
                    "description": "راه‌حل‌های تخصصی برای رشد کسب‌وکارتان",
                    "gradient": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    "features": ["مشاوره", "پشتیبانی 24/7"],
                    "icon": "Shield"  
                },
                {
                    "id": 3,
                    "title": 'حضور آنلاین قدرتمند',
                    "subtitle": 'مدیریت کامل اطلاعات کسب‌وکار',
                    "description": 'آدرس، عکس‌ها و اطلاعات را به روز نگه دارید',
                    "gradient": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    "features": ['مدیریت اطلاعات', 'آدرس روی نقشه', 'بروزرسانی آسان'],
                     "icon": "Globe" 
                },
                {
                    "id": 4, 
                    "title": "📈 رشد سریع کسب‌وکار",
                    "subtitle": "با ابزارهای تحلیلی پیشرفته",
                    "description": "آمار بازدید و تعامل مشتریان را رصد کنید",
                    "gradient": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                    "features": ["آمار دقیق", "تحلیل رفتار کاربران", "گزارش‌گیری"],
                    "icon": "TrendingUp"
                },
            ],
            "home2": [
                {
                    "id": 1,
                    "title": "---",
                    "desc": "------",
                    "url": "https://example.com/cafe",
                    "img": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop"
                },
                {
                    "id": 2,
                    "title": "---",
                    "desc": "------",
                    "url": "https://example.com/bookstore",
                    "img": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop"
                },
                {
                    "id": 3,
                    "title": "---",
                    "desc": "------",
                    "url": "https://example.com/photography",
                    "img": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop"
                },
                {
                    "id": 4,
                    "title": "---",
                    "desc": "------",
                    "url": "https://example.com/beauty",
                    "img": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop"
                },
                {
                    "id": 5,
                    "title": "---",
                    "desc": "------",
                    "url": "https://example.com/education",
                    "img": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop"
                },
                {
                    "id": 6,
                    "title": "---",
                    "desc": "------",
                    "url": "https://example.com/restaurant",
                    "img": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop"
                }
            ]
        }
        
        ads_data = {}
        
        try:
            for ad_type in ['popup', 'bottom', 'home', 'home1', 'home2']:
                try:
                    db_ads = Ad.objects.filter(ad_type=ad_type, is_active=True)
                    
                    if db_ads.exists():
                        if ad_type == 'popup':
                            ad = db_ads.first()
                            if ad:
                                ads_data['popup'] = {
                                    'id': ad.id,
                                    'text': ad.text,
                                    'url': ad.url,
                                    'textColor': ad.text_color,
                                    'background': ad.background,
                                    'is_active': ad.is_active
                                }
                        else:
                            ads_list = []
                            for ad in db_ads:
                                ad_data = {
                                    'id': ad.id,
                                    'text': ad.text,
                                    'url': ad.url,
                                    'textColor': ad.text_color,
                                    'background': ad.background,
                                    'is_active': ad.is_active
                                }
                                
                                if ad_type == 'home1':
                                    ad_data.update({
                                        'title': ad.title or default_data['home1'][0]['title'],
                                        'subtitle': ad.text or default_data['home1'][0]['subtitle'],
                                        'description': ad.text or default_data['home1'][0]['description'],
                                        'gradient': ad.background,
                                        'features': [],
                                        'icon': 'Target'
                                    })
                                elif ad_type == 'home2':
                                    ad_data.update({
                                        'title': ad.title or default_data['home2'][0]['title'],
                                        'desc': ad.text or default_data['home2'][0]['desc'],
                                        'url': ad.url,
                                        'img': ad.image_url or default_data['home2'][0]['img']
                                    })
                                elif ad_type == 'home':
                                    ad_data.update({
                                        'text': ad.text,
                                        'background': ad.background
                                    })
                                
                                ads_list.append(ad_data)
                            
                            ads_data[ad_type] = ads_list
                    else:
                        if ad_type in default_data:
                            ads_data[ad_type] = default_data[ad_type]
                            
                except:
                    if ad_type in default_data:
                        ads_data[ad_type] = default_data[ad_type]
        
        except:
            ads_data = default_data
        
        return Response(ads_data)


class AdsAdminView(APIView):
    def get(self, request):
        return Response({"message": "Admin endpoint"})


class TrackImpressionView(APIView):
    def post(self, request, ad_id):
        session_id = request.data.get('session_id') or str(uuid.uuid4())
        
        return Response({
            'status': 'success',
            'impression_id': f"imp_{ad_id}_{int(timezone.now().timestamp())}",
            'session_id': session_id
        }, status=status.HTTP_200_OK)


class TrackClickView(APIView):
    def post(self, request, ad_id):
        session_id = request.data.get('session_id') or str(uuid.uuid4())
        
        return Response({
            'status': 'success',
            'click_id': f"click_{ad_id}_{int(timezone.now().timestamp())}",
            'session_id': session_id
        }, status=status.HTTP_200_OK)


class AdStatsView(APIView):
    def get(self, request, ad_id=None):
        if ad_id:
            return Response({
                'ad_id': ad_id,
                'total_impressions': 100,
                'total_clicks': 10,
                'ctr': 10.0,
            })
        else:
            return Response({
                'ads': [
                    {'ad_id': 1, 'impressions': 100, 'clicks': 10},
                    {'ad_id': 2, 'impressions': 150, 'clicks': 15},
                ]
            })