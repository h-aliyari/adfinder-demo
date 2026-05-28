// D:\adfinder\frontend\adfinder\app\business\services\api.ts
import { Business, BusinessResponse, BusinessStats,  LikeResponse, CheckLikeResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') ||
      localStorage.getItem('business_token');
  }
  return null;
};

export const getBusinessById = async (businessId: string | number): Promise<Business> => {
  try {
    console.log(`📤 [Business API] Fetching business with ID: ${businessId}`);

    // URL رو درست بسازیم
    const url = `${API_BASE_URL}/businesses/${businessId}/`;
    console.log(`🌐 [Business API] Request URL: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Business API] Fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      if (response.status === 404) {
        throw new Error('کسب‌وکار مورد نظر یافت نشد');
      }

      if (response.status === 500) {
        throw new Error('خطای سرور. لطفاً بعداً تلاش کنید');
      }

      throw new Error(`خطا در دریافت اطلاعات (کد: ${response.status})`);
    }

    const data = await response.json();
    console.log('✅ [Business API] Business data received:', {
      id: data.id,
      code: data.business_code,
      name: data.name,
      type: data.business_type
    });

    return data;

  } catch (error) {
    console.error('❌ [Business API] Error fetching business:', error);

    // اگر خطای شبکه بود
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('خطای اتصال به سرور. لطفاً اتصال اینترنت را بررسی کنید');
    }

    throw error;
  }
};

/**
 * گرفتن آمار یک کسب‌وکار
 */
export const getBusinessStats = async (businessId: string | number): Promise<BusinessStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/stats/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`خطا در دریافت آمار (کد: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching business stats:', error);
    throw error;
  }
};

/**
 * افزایش تعداد بازدید
 */
export const incrementViews = async (businessId: string | number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/increment-views/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Failed to increment views:', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error incrementing views:', error);
    return false;
  }
};

/**
 * ذخیره کردن کسب‌وکار
 */
export const saveBusiness = async (businessId: string | number, userId?: string): Promise<boolean> => {
  try {
    const body: any = {};
    if (userId) {
      body.user_id = userId;
    }

    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/save/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`خطا در ذخیره کردن (کد: ${response.status})`);
    }

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Error saving business:', error);
    throw error;
  }
};

/**
 * جستجوی کسب‌وکارها
 */
export const searchBusinesses = async (query: string, type?: string): Promise<Business[]> => {
  try {
    const params = new URLSearchParams();
    params.append('q', query);
    if (type) {
      params.append('type', type);
    }

    const response = await fetch(`${API_BASE_URL}/businesses/search/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`خطا در جستجو (کد: ${response.status})`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching businesses:', error);
    throw error;
  }
};

/**
 * گرفتن کسب‌وکارهای مشابه
 */
export const getSimilarBusinesses = async (businessId: string | number, limit: number = 5): Promise<Business[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/similar/?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`خطا در دریافت کسب‌وکارهای مشابه (کد: ${response.status})`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching similar businesses:', error);
    return [];
  }
};

/**
 * تست اتصال به API
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // timeout: 5000,
    });

    return response.ok;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

/**
 * گرفتن همه نوع‌های کسب‌وکار
 */
export const getBusinessTypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/business-types/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return ['food', 'auto', 'shop', 'service', 'entertainment', 'education', 'tourism', 'health', 'tech', 'other'];
    }

    const data = await response.json();
    return data.types || [];
  } catch (error) {
    console.error('Error fetching business types:', error);
    return ['food', 'auto', 'shop', 'service', 'entertainment', 'education', 'tourism', 'health', 'tech', 'other'];
  }
};

// D:\adfinder\frontend\adfinder\app\business\services\api.ts

/**
 * دریافت اطلاعات صفحه اختصاصی کسب‌وکار
 */
export const getCustomPageData = async (businessId: string | number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/custom-page/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Custom page data not available or business not found');
      return null; // برگرداندن null به جای خطا
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching custom page data:', error);
    return null;
  }
};


export const updateCustomPageData = async (businessCode: string, data: any): Promise<boolean> => {
  try {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/businesses/${businessCode}/custom-page/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`خطا در ذخیره اطلاعات (کد: ${response.status})`);
    }

    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error('Error updating custom page:', error);
    throw error;
  }
};


/**
 * لایک/آنلایک کردن کسب‌وکار
 */
export const toggleLike = async (businessId: string | number): Promise<LikeResponse> => {
  try {
    const url = `${API_BASE_URL}/businesses/${businessId}/toggle-like/`;
    console.log('📡 درخواست لایک به:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('📡 پاسخ سرور:', response.status, response.statusText);
    
    // اول متن پاسخ را ببین
    const responseText = await response.text();
    console.log('📡 متن پاسخ:', responseText.substring(0, 200));
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('❌ خطا در پارس JSON:', jsonError);
      return {
        success: false,
        likes: 0,
        is_liked: false,
        error: `سرور پاسخ غیرمعتبر داد: ${responseText.substring(0, 100)}`
      };
    }
    
    if (!response.ok) {
      return {
        success: false,
        likes: 0,
        is_liked: false,
        error: data.error || `خطا در لایک (کد: ${response.status})`
      };
    }

    return {
      success: true,
      likes: data.likes || 0,
      is_liked: data.is_liked || false,
      message: data.message
    };
  } catch (error) {
    console.error('❌ خطا در لایک:', error);
    return {
      success: false,
      likes: 0,
      is_liked: false,
      error: 'خطا در ارتباط با سرور'
    };
  }
};

/**
 * بررسی وضعیت لایک
 */
export const checkLikeStatus = async (businessId: string | number): Promise<CheckLikeResponse> => {
  try {
    const url = `${API_BASE_URL}/businesses/${businessId}/check-like/`;
    console.log('📡 درخواست بررسی لایک به:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('📡 پاسخ سرور:', response.status, response.statusText);
    
    // اگر 404 یا 500 باشد، JSON برنمی‌گرداند
    if (response.status === 404) {
      console.log('⚠️  endpoint پیدا نشد (404)');
      return {
        success: false,
        likes: 0,
        is_liked: false,
        error: 'endpoint یافت نشد'
      };
    }
    
    if (response.status === 500) {
      console.log('⚠️  خطای سرور (500)');
      return {
        success: false,
        likes: 0,
        is_liked: false,
        error: 'خطای سرور'
      };
    }
    
    // اول متن را بخوان
    const responseText = await response.text();
    console.log('📡 متن پاسخ:', responseText.substring(0, 200));
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('❌ خطا در پارس JSON:', jsonError);
      return {
        success: false,
        likes: 0,
        is_liked: false,
        error: 'پاسخ سرور معتبر نیست'
      };
    }
    
    if (!response.ok) {
      return {
        success: false,
        likes: 0,
        is_liked: false,
        error: data.error || `خطا در بررسی (کد: ${response.status})`
      };
    }

    return {
      success: true,
      likes: data.likes || 0,
      is_liked: data.is_liked || false
    };
  } catch (error) {
    console.error('❌ خطا در بررسی وضعیت لایک:', error);
    return {
      success: false,
      likes: 0,
      is_liked: false,
      error: 'خطا در ارتباط با سرور'
    };
  }
};