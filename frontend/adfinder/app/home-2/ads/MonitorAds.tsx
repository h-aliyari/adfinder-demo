// D:\adfinder\frontend\adfinder\app\home-2\ads\MonitorAds.tsx
"use client";

import { useState, useEffect } from "react";
import { getMonitorAds } from "./services/api";

type AdType = {
  id: number;
  title: string;
  description: string;
  color: string;
  discount?: string;
};

export default function MonitorAds() {
  const [ads, setAds] = useState<AdType[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // دریافت داده‌ها از API
  useEffect(() => {
    async function fetchAds() {
      try {
        setLoading(true);
        const adsData = await getMonitorAds();
        setAds(adsData);
        setError(null);
      } catch (err) {
        console.error("خطا در دریافت تبلیغات:", err);
        setError("دریافت تبلیغات با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    }

    fetchAds();
  }, []);

  // تنظیم تایمر برای تغییر خودکار تبلیغات
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 10000); // تغییر هر 10 ثانیه

    return () => clearInterval(interval);
  }, [ads.length]);

  // نمایش لودینگ
  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-linear-to-r from-gray-200 to-gray-300 animate-pulse h-48"></div>
        <div className="flex justify-center mt-6 space-x-2 space-x-reverse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-2 rounded-full bg-gray-300"></div>
          ))}
        </div>
      </div>
    );
  }

  // نمایش خطا
  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 border border-red-200 p-8 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  // اگر تبلیغی وجود ندارد
  if (ads.length === 0) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-gray-100 p-8 text-center">
          <p className="text-gray-600">از سفارش خود لذت ببرید</p>
        </div>
      </div>
    );
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className="p-6">
      {/* تبلیغ اصلی */}
      <div className={`rounded-xl bg-linear-to-r ${currentAd.color} text-white overflow-hidden shadow-lg transition-all duration-500`}>
        <div className="p-8">
          {currentAd.discount && (
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-4 animate-pulse">
              {currentAd.discount}
            </div>
          )}
          <h3 className="text-2xl font-bold mb-3">{currentAd.title}</h3>
          <p className="text-white/90 mb-6 leading-relaxed">{currentAd.description}</p>
        </div>
      </div>

      {/* دکمه‌های ناوبری */}
      <div className="flex justify-center mt-6 space-x-2 space-x-reverse">
        {ads.map((ad, index) => (
          <button
            key={ad.id}
            onClick={() => setCurrentAdIndex(index)}
            className={`w-8 h-2 rounded-full transition-all duration-300 ${
              index === currentAdIndex 
                ? `bg-linear-to-r ${ad.color} w-12` 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`تبلیغ ${index + 1}: ${ad.title}`}
            title={ad.title}
          />
        ))}
      </div>
    </div>
  );
}