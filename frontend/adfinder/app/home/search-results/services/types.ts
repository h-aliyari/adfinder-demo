// app/search-results/services/types.ts
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
  province?: string; // اضافه کردن فیلد استان
}

export interface SearchParams {
  q?: string;
  type?: string;
  province?: string; // اضافه کردن
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  results: Business[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// بقیه کدها بدون تغییر...