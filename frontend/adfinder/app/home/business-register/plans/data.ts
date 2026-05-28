// frontend/adfinder/app/business-register/plans/data.ts
export interface Period {
  id: string;
  name: string;
  discount: number;
  disabled: boolean;
}

export interface ProService {
  id: string;
  name: string;
  description: string;
  prices: Record<string, number>;
  isSelected: boolean;
  icon: string;
  isLimited?: boolean;
  remaining?: number;
  limit?: number;
}

export interface Plan {
  id: 'normal' | 'pro';
  name: string;
  tagline: string;
  description: string;
  basePrices: Record<string, number>;
  gradient: string;
  icon: string;
  features: string[];
  disabled?: boolean;
  disabledMessage?: string;
}

// دوره‌های اشتراک
export const periods: Period[] = [
  { id: 'monthly', name: 'ماهانه', discount: 0, disabled: false },
  { id: 'quarterly', name: 'سه‌ماهه', discount: 10, disabled: true },
  { id: 'semiannual', name: 'شش‌ماهه', discount: 20, disabled: true },
  { id: 'annual', name: 'سالانه', discount: 30, disabled: true },
];

// قیمت‌های پایه
export const basePrices = {
  normal: {
    monthly: 99000,    // 99,000 تومان
    quarterly: 267300, // 3 ماه با 10% تخفیف
    semiannual: 475200, // 6 ماه با 20% تخفیف
    annual: 831600,    // 12 ماه با 30% تخفیف
  },
  pro: {
    monthly: 99000,    // 99,000 تومان
    quarterly: 267300, // 3 ماه با 10% تخفیف
    semiannual: 475200, // 6 ماه با 20% تخفیف
    annual: 831600,    // 12 ماه با 30% تخفیف
  }
};

// سرویس‌های پرو اولیه
export const initialProServices: ProService[] = [
  {
    id: 'consulting',
    name: 'مشاوره تبلیغات',
    description: 'جلسه یک ساعته',
    prices: { monthly: 200000, quarterly: 405000, semiannual: 720000, annual: 1260000 },
    isSelected: false,
    icon: 'Megaphone'
  },
  {
    id: 'banner-design',
    name: 'طراحی بنر',
    description: 'طراحی 2 بنر حرفه‌ای ماهانه',
    prices: { monthly: 200000, quarterly: 540000, semiannual: 960000, annual: 1680000 },
    isSelected: false,
    icon: 'Palette'
  },
  {
    id: 'campaign-design',
    name: 'طراحی کمپین',
    description: 'طراحی استراتژی و اجرای کمپین',
    prices: { monthly: 400000, quarterly: 945000, semiannual: 1680000, annual: 2940000 },
    isSelected: false,
    icon: 'Target'
  },
  {
    id: 'homepage-ad',
    name: 'تبلیغ در صفحه اصلی',
    description: 'نمایش بنر در صفحه اصلی سایت',
    prices: { monthly: 500000, quarterly: 1350000, semiannual: 2400000, annual: 4200000 },
    isSelected: false,
    icon: 'Home',
    isLimited: true
  },
  {
    id: 'monthly-report',
    name: 'گزارش ماهانه',
    description: 'گزارش تحلیلی پیشرفت کسب‌وکار',
    prices: { monthly: 100000, quarterly: 216000, semiannual: 384000, annual: 672000 },
    isSelected: false,
    icon: 'BarChart'
  },
  {
    id: 'content-page',
    name: 'صفحه اختصاصی',
    description: 'صفحه ویژه محتوا و مقالات',
    prices: { monthly: 400000, quarterly: 324000, semiannual: 576000, annual: 1008000 },
    isSelected: false,
    icon: 'FileText'
  },
];

// طرح‌ها
export const plans: Plan[] = [
  {
    id: 'normal',
    name: 'نرمال',
    tagline: 'حضور پایه در تبلیغ یاب',
    description: 'امکانات اصلی برای معرفی کسب‌وکار',
    basePrices: basePrices.normal,
    gradient: 'from-blue-600 to-indigo-700',
    icon: 'Sparkles',
    features: [
      'کد اختصاصی منحصر به فرد',
      'نمایش در نتایج جستجو',
      'لینک به محتوای وبسایت',
      'نمایش آدرس روی نقشه',
      'پشتیبانی پایه',
    ],
    disabled: false,
  },
  {
    id: 'pro',
    name: 'پرو',
    tagline: 'تبلیغات حرفه‌ای با ماژولهای سفارشی',
    description: 'تمام خدمات نرمال + انتخاب ماژول‌های اضافی',
    basePrices: basePrices.pro,
    gradient: 'from-purple-600 to-pink-700',
    icon: 'Zap',
    features: [
      'تمامی خدمات طرح نرمال',
      'انتخاب ماژول‌های اضافی',
      'پشتیبانی ویژه',
      'برچسب ویژه "پرو"'
    ],
    disabled: false,
    disabledMessage: 'به زودی'
  }
];