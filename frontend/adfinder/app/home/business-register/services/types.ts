// frontend\adfinder\app\business-register\services\types.ts

// ============ Type Definitions ============
export interface BusinessRegistrationData {
  name: string;
  owner: string;
  phone: string;
  email: string;
  businessType: string;
  address: string;
  province: string;
  socialLinks: string[];
  description: string;
  plan: 'normal' | 'pro';
  password: string;
  codeType?: 'normal' | 'special';
  business_code?: string;
}

export interface FullPlusAvailability {
  available: boolean;
  remaining: number;
  limit: number;
}

export interface SearchResult {
  businesses: any[];
  count: number;
}

export interface LoginResponse {
  success: boolean;
  business_code?: string;
  business_name?: string;
  plan?: string;
  error?: string;
  message?: string;
}

export interface BusinessDashboardInfo {
  code: string;
  name: string;
  owner: string;
  phone: string;
  email: string;
  businessType: string;
  address: string;
  description?: string;
  plan: 'normal' | 'pro';
  created_at: string;
  expires_date: string;
  days_remaining: number;
  status: 'active' | 'expired' | 'pending';
  views: number;
  searches: number;
  saves: number;
  profile_image?: string;
}

export interface BusinessProfile {
  name: string;
  owner: string;
  phone: string;
  email: string;
  business_type: string;
  address: string;
  description: string;
  business_code: string;
  profile_image?: string;
}

// ============ Constants ============
export const BUSINESS_TYPES = [
  'غذا و رستوران',
  'خودرو',
  'فروشگاه',
  'خدمات',
  'سرگرمی',
  'آموزشی',
  'گردشگری',
  'سلامت',
  'فناوری',
  'سایر'
];

export const IRAN_PROVINCES = [
  'تهران', 'خراسان رضوی',
  'اصفهان', 'فارس',
  'آذربایجان شرقی',
  'مازندران',
  'خوزستان',
  'آذربایجان غربی',
  'کرمان',
  'گیلان',
  'سمنان',
  'قزوین',
  'قم',
  'البرز',
  'کردستان',
  'هرمزگان',
  'لرستان',
  'مرکزی',
  'همدان',
  'چهارمحال و بختیاری',
  'یزد',
  'بوشهر',
  'زنجان',
  'اردبیل',
  'ایلام',
  'کهگیلویه و بویراحمد',
  'گلستان',
  'سیستان و بلوچستان',
  'خراسان شمالی',
  'خراسان جنوبی'
];