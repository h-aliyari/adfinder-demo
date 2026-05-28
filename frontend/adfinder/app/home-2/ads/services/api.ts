// داده‌های تستی برای تبلیغات
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
      img: "/ads/cafe-bazaar.png"
    },
    {
      id: 2,
      title: "---",
      desc: "-------",
      url: "#",
      img: "/ads/digikala.png"
    },
    {
      id: 3,
      title: "---",
      desc: "-------",
      url: "#",
      img: "/ads/snapp.png"
    },
    {
      id: 4,
      title: "---",
      desc: "-------",
      url: "#",
      img: "/ads/aparat.png"
    },
    {
      id: 5,
      title: "---",
      desc: "-------",
      url: "#",
      img: "/ads/placeholder.png"
    },
    {
      id: 6,
      title: "---",
      desc: "-------",
      url: "#",
      img: "/ads/placeholder.png"
    }
  ]
};

// تابع دریافت تبلیغات (تست)
export async function getAds() {
  // شبیه‌سازی تاخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return testAds;
}

// تابع ردیابی بازدید (تست)
export async function trackImpression(adId: number): Promise<string> {
  console.log(`Impression tracked for ad ${adId}`);
  return `impression-${adId}-${Date.now()}`;
}

// تابع ردیابی کلیک (تست)
export async function trackClick(adId: number, impressionId?: string): Promise<boolean> {
  console.log(`Click tracked for ad ${adId}, impression: ${impressionId}`);
  return true;
}