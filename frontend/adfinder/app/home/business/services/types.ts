// D:\adfinder\frontend\adfinder\app\business\services\types.ts

export interface Business {
  id: number;
  name: string;
  owner: string;
  phone: string;
  email?: string;
  business_code: string;
  business_type: string;
  address?: string;
  description?: string;
  plan: string;
  status: string;
  created_at: string;
  views?: number;
  searches?: number;
  saves?: number;
  days_remaining?: number;
  expires_date?: string;
  profile_image?: string;
  social_links?: any[];
  custom_page_data?: Record<string, any>;
  likes: number;
  rating?: number;
}

export interface BusinessStats {
  views: number;
  searches: number;
  saves: number;
  daily_views: number[];
  daily_searches: number[];
  daily_saves: number[];
}

export interface BusinessUpdateData {
  name?: string;
  owner?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  business_type?: string;
}

export interface BusinessResponse {
  success: boolean;
  message?: string;
  data?: Business;
  error?: string;
}

export interface LikeResponse {
  success: boolean;
  likes: number;
  is_liked: boolean;
  message?: string;
  error?: string;
}

export interface CheckLikeResponse {
  success: boolean;
  likes: number;
  is_liked: boolean;
  error?: string;
}