// D:\adfinder\frontend\adfinder\app\home-2\ads\services\api.ts

const testAds = {
  home1: [
    {
      id: 1,
      title: "آماده سازی سفارش شما",
      subtitle: "در حال پردازش سفارش شما هستیم",
      description: "سفارش شما در حال آماده‌سازی است",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      features: ["پردازش سریع", "کیفیت بالا", "پشتیبانی 24/7"],
      icon: "Clock"
    },
    {
      id: 2,
      title: "تخفیف ویژه",
      subtitle: "برای سفارش‌های بعدی",
      description: "20% تخفیف برای سفارش بعدی",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      features: ["تخفیف 20%", "اعتبار 30 روزه", "قابل استفاده در همه سرویس‌ها"],
      icon: "Gift"
    },
    {
      id: 3,
      title: "پشتیبانی آنلاین",
      subtitle: "همراه شما هستیم",
      description: "پشتیبانی 24 ساعته",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      features: ["پاسخگویی سریع", "راهنمایی کامل", "حل مشکل در کمترین زمان"],
      icon: "MessageCircle"
    }
  ],
  home2: [
    {
      id: 1,
      title: "---",
      desc: "-------",
      url: "#",
      img: ""
    },
    {
      id: 2,
      title: "---",
      desc: "-------",
      url: "#",
      img: ""
    },
    {
      id: 3,
      title: "---",
      desc: "-------",
      url: "#",
      img: ""
    },
    {
      id: 4,
      title: "---",
      desc: "-------",
      url: "#",
      img: ""
    },
    {
      id: 5,
      title: "---",
      desc: "-------",
      url: "#",
      img: ""
    },
    {
      id: 6,
      title: "---",
      desc: "-------",
      url: "#",
      img: ""
    }
  ],

  // تبلیغات Popup
  home3: [
    {
      id: 1,
      title: "تخفیف ۲۰٪",
      description: "برای سفارش بعدی شما",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      is_active: true
    },
    {
      id: 2,
      title: "پشتیبانی",
      description: "۲۴ ساعته در خدمت شما",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      is_active: true
    },
    {
      id: 3,
      title: "سرعت بالا",
      description: "پردازش سریع سفارش",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      is_active: true
    },
    {
      id: 4,
      title: "کیفیت",
      description: "ضمانت بهترین کیفیت",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      is_active: true
    },
    {
      id: 5,
      title: "اشتراک",
      description: "ارتقاء به نسخه حرفه‌ای",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      is_active: true
    }
  ]
};

// تابع دریافت تبلیغات (تست)
export async function getAds() {
  // شبیه‌سازی تاخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 100));

  return testAds;
}

// تابع ردیابی بازدید (تست)
export async function trackImpression(adId: number): Promise<string> {
  console.log(`[Ad ${adId}] نمایش تبلیغ`);
  return `impression-${adId}-${Date.now()}`;
}

// تابع ردیابی کلیک (تست)
export async function trackClick(adId: number, impressionId?: string): Promise<boolean> {
  console.log(`[Ad ${adId}] کلیک روی تبلیغ`, impressionId ? `(impression: ${impressionId})` : '');
  return true;
}

// تابع ردیابی بستن تبلیغ (تست)
export async function trackClose(adId: number, impressionId?: string): Promise<boolean> {
  console.log(`[Ad ${adId}] بستن تبلیغ`, impressionId ? `(impression: ${impressionId})` : '');
  return true;
}

// تبلیغات مانیتور - داده‌های منتقل شده از MonitorAds.tsx
const monitorAdsData = [
  {
    id: 1,
    title: "پیشنهاد شگفت‌انگیز",
    description: "برای سفارش‌های بالای ۳۰۰ هزار تومان",
    color: "from-blue-500 to-purple-600",
    discount: "۲۰٪ تخفیف"
  },
  {
    id: 2,
    title: "منوی فصل",
    description: "غذاهای ویژه پاییزی با مواد اولیه تازه",
    color: "from-green-500 to-teal-600",
    discount: "دسر رایگان"
  },
  {
    id: 3,
    title: "اعتبار هدیه",
    description: "برای دوستان خود اعتبار هدیه بفرستید",
    color: "from-orange-500 to-red-600",
    discount: "+۱۰٪ هدیه"
  },
  {
    id: 4,
    title: "اشتراک ماهانه",
    description: "هر روز یک غذای متفاوت درب منزل",
    color: "from-pink-500 to-rose-600",
    discount: "۳۰٪ صرفه‌جویی"
  }
];

// تابع دریافت تبلیغات مانیتور
export async function getMonitorAds() {
  // شبیه‌سازی تاخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 100));

  return monitorAdsData;
}

// تابع دریافت تبلیغ مانیتور بر اساس ID
export async function getMonitorAdById(id: number) {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const ad = monitorAdsData.find(ad => ad.id === id);
  if (!ad) {
    throw new Error(`تبلیغ با ID ${id} یافت نشد`);
  }
  
  return ad;
}

// تابع افزودن تبلیغ جدید (برای مدیریت)
export async function addMonitorAd(ad: Omit<typeof monitorAdsData[0], 'id'>) {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const newId = Math.max(...monitorAdsData.map(a => a.id)) + 1;
  const newAd = { id: newId, ...ad };
  
  // در حالت واقعی اینجا به سرور ارسال می‌شود
  console.log('تبلیغ جدید اضافه شد:', newAd);
  
  return newAd;
}