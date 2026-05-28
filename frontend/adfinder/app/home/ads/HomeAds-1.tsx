// frontend\adfinder\app\ads\HomeAds-1.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  Sparkles, Target, Globe, Zap, Star, Trophy, 
  TrendingUp, Users, Shield, Heart, Gift, 
  Clock, Award, Rocket, DollarSign, Bell,
  MessageCircle, BarChart, ShoppingBag, Camera,
  Phone, MapPin, Mail, CreditCard, Cloud,
  Database, FileText, Settings, HelpCircle,
  CheckCircle, XCircle, AlertCircle, Info
} from 'lucide-react';
import { getAds } from './services/api';

type HomeSpecialAd = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  features: string[];
  icon: string; // <-- فیلد جدید برای نام آیکون
};

// مپ آیکون‌ها
const iconComponents: Record<string, React.ElementType> = {
  Sparkles, Target, Globe, Zap,
  Star, Trophy, TrendingUp, Users,
  Shield, Heart, Gift, Clock,
  Award, Rocket, DollarSign, Bell,
  MessageCircle, BarChart, ShoppingBag, Camera,
  Phone, MapPin, Mail, CreditCard,
  Cloud, Database, FileText, Settings,
  HelpCircle, CheckCircle, XCircle, AlertCircle,
  Info
};

export default function HomeAds1() {
  const [specialAds, setSpecialAds] = useState<HomeSpecialAd[]>([]);
  const [specialIndex, setSpecialIndex] = useState(0);

  // دریافت داده‌ها از API
  useEffect(() => {
    getAds().then((data) => {
      if (data.home1 && Array.isArray(data.home1)) {
        setSpecialAds(data.home1);
      }
    });
  }, []);

  // اسلاید خودکار
  useEffect(() => {
    if (specialAds.length === 0) return;

    const t = setInterval(() => {
      setSpecialIndex((prev) => (prev + 1) % specialAds.length);
    }, 3500);

    return () => clearInterval(t);
  }, [specialAds.length]);

  // تابع برای رفتن به اسلاید خاص
  const goToSlide = (index: number) => {
    setSpecialIndex(index);
  };

  // تابع برای دریافت آیکون بر اساس نام
  const getIcon = (iconName: string) => {
    const IconComponent = iconComponents[iconName];
    
    // اگر آیکون پیدا نشد، آیکون پیش‌فرض نمایش داده شود
    if (!IconComponent) {
      console.warn(`آیکون "${iconName}" پیدا نشد. از آیکون پیش‌فرض استفاده می‌شود.`);
      return <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />;
    }
    
    return <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />;
  };

  // حالت لودینگ
  if (specialAds.length === 0) {
    return (
      <section className="mb-8 lg:mx-auto">
        <div className="overflow-hidden rounded-2xl border h-40 animate-pulse bg-gray-300" />
      </section>
    );
  }

  return (
    <section className="mb-8 lg:mx-auto">
      <div className="overflow-hidden rounded-2xl border">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(${specialIndex * (100 / specialAds.length)}%)`,
            width: `${specialAds.length * 100}%`
          }}
        >
          {specialAds.map((ad) => (
            <div key={ad.id} className="shrink-0" style={{ width: `${100 / specialAds.length}%` }}>
              <div className={`p-6`} style={{ background: ad.gradient }}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl">
                      {getIcon(ad.icon || "Sparkles")} {/* مقدار پیش‌فرض */}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
                    <div
                      className="font-bold text-xl sm:text-2xl text-white truncate"
                      style={{ whiteSpace: 'normal' }}
                    >
                      {ad.title}
                    </div>
                    <div
                      className="text-white/90 text-sm sm:text-base truncate"
                      style={{ whiteSpace: 'normal' }}
                    >
                      {ad.subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <br />

        {/* بخش نقاط ناوبری */}
        <div className="flex justify-center gap-2 pb-4">
          {specialAds.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 rounded-full transition-colors ${i === specialIndex ? 'bg-(--color-accent)' : 'bg-white/50'
                }`}
              aria-label={`تبلیغ ویژه ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}