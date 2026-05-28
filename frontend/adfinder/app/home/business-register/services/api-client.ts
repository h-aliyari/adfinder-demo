// frontend\adfinder\app\business-register\services\api-client.ts
import {
  BusinessRegistrationData,
  FullPlusAvailability,
  SearchResult,
  LoginResponse,
  BusinessDashboardInfo,
  BusinessProfile
} from './types';
import { generateBusinessCode, calculatePrice } from './utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============ Core API Request Function ============
const apiRequest = async <T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  headers: Record<string, string> = {}
): Promise<T> => {
  const cleanBaseUrl = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;
  
  const cleanEndpoint = endpoint.startsWith('/') 
    ? endpoint 
    : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  console.log('🌐 API Request:', {
    url,
    method,
    data,
    timestamp: new Date().toISOString()
  });

  const defaultOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers,
    },
  };

  if (data && method !== 'GET') {
    defaultOptions.body = JSON.stringify(data);
    console.log('📦 Request body:', data);
  }

  try {
    const response = await fetch(url, defaultOptions);

    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      ok: response.ok
    });

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
      } catch {
        errorText = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorText);
    }

    try {
      const responseData = await response.json();
      console.log('📨 Response data:', responseData);
      return responseData as T;
    } catch (jsonError) {
      console.error('❌ JSON parse error:', jsonError);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('🔥 Fetch error:', error);
    throw error;
  }
};

// ============ Full Plus Plan Availability ============
export const getFullPlusRemainingCount = async (): Promise<number> => {
  try {
    const data = await apiRequest<{ remaining: number }>(
      '/api/businesses/full-plus-availability/',
      'GET'
    );
    return data.remaining;
  } catch (error) {
    console.error('Error getting full plus count:', error);
    return 4;
  }
};

export const checkFullPlusAvailability = async (): Promise<FullPlusAvailability> => {
  try {
    const data = await apiRequest<FullPlusAvailability>(
      '/api/businesses/full-plus-availability/',
      'GET'
    );
    return {
      available: data.available,
      remaining: data.remaining,
      limit: data.limit
    };
  } catch (error) {
    console.error('Error checking availability:', error);
    return {
      available: true,
      remaining: 4,
      limit: 6
    };
  }
};

// ============ Registration and Login ============
export const registerBusiness = async (
  data: BusinessRegistrationData,
  codeType: 'normal' | 'special' = 'normal'
): Promise<string> => {
  const businessCode = generateBusinessCode(codeType);
  const price = calculatePrice(data.plan, codeType);

  const payload = {
    name: data.name,
    owner: data.owner,
    phone: data.phone,
    email: data.email || '',
    business_type: data.businessType,
    address: data.address || '',
    province: data.province || '',
    social_links: data.socialLinks || [],
    description: data.description || '',
    plan: data.plan,
    password: data.password,
    code_type: codeType,
    business_code: businessCode,
    price: price
  };

  console.log('📝 Register payload:', payload);

  const response = await apiRequest<{
    success: boolean;
    business_code?: string;
    error?: string;
    message?: string;
  }>(
    '/api/businesses/register/',
    'POST',
    payload
  );

  console.log('📝 Register response:', response);

  if (response.success && response.business_code) {
    return response.business_code;
  } else {
    throw new Error(response.error || response.message || 'خطا در ثبت نام');
  }
};

export const loginBusiness = async (identifier: string, password: string): Promise<LoginResponse> => {
  const payload = {
    identifier,
    password
  };

  console.log('🔐 Login payload:', payload);

  try {
    const response = await apiRequest<LoginResponse>(
      '/api/businesses/login/',
      'POST',
      payload
    );

    console.log('🔐 Login response:', response);

    if (response.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('business_code', response.business_code || '');
        localStorage.setItem('business_name', response.business_name || '');
        localStorage.setItem('business_plan', response.plan || '');
        localStorage.setItem('is_logged_in', 'true');
      }
    }

    return response;
  } catch (error) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطا در ارتباط با سرور'
    };
  }
};

export const loginWithPhone = async (phone: string, password: string): Promise<LoginResponse> => {
  return loginBusiness(phone, password);
};

// ============ Existence Checks ============
export const checkBusinessCodeExists = async (code: string): Promise<boolean> => {
  try {
    const response = await apiRequest<{ exists: boolean }>(
      `/api/businesses/check-code/${code}/`,
      'GET'
    );
    return response.exists;
  } catch (error) {
    console.error('Error checking code:', error);
    return false;
  }
};

export const checkPhoneExists = async (phone: string): Promise<boolean> => {
  try {
    const response = await apiRequest<{ exists: boolean }>(
      `/api/businesses/check-phone/${phone}/`,
      'GET'
    );
    return response.exists;
  } catch (error) {
    console.error('Error checking phone:', error);
    return false;
  }
};

// ============ Search ============
export const searchBusinesses = async (query: string): Promise<SearchResult> => {
  try {
    const response = await apiRequest<SearchResult>(
      `/api/businesses/search/?q=${encodeURIComponent(query)}`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error searching businesses:', error);
    return { businesses: [], count: 0 };
  }
};

// ============ Dashboard Functions ============
export const getBusinessDashboardInfo = async (): Promise<BusinessDashboardInfo> => {
  try {
    const businessCode = localStorage.getItem('business_code');
    if (!businessCode) {
      throw new Error('کد کسب‌وکار یافت نشد');
    }

    const response = await apiRequest<BusinessDashboardInfo>(
      `/api/businesses/${businessCode}/dashboard/`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error getting dashboard info:', error);
    throw error;
  }
};

export const getBusinessProfile = async (): Promise<BusinessProfile> => {
  try {
    const businessCode = localStorage.getItem('business_code');
    if (!businessCode) {
      throw new Error('کد کسب‌وکار یافت نشد');
    }

    const response = await apiRequest<BusinessProfile>(
      `/api/businesses/${businessCode}/profile/`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error getting business profile:', error);
    throw error;
  }
};

export const updateBusinessProfile = async (data: Partial<BusinessProfile>): Promise<boolean> => {
  try {
    const businessCode = localStorage.getItem('business_code');
    if (!businessCode) {
      throw new Error('کد کسب‌وکار یافت نشد');
    }

    const response = await apiRequest<{ success: boolean }>(
      `/api/businesses/${businessCode}/update-profile/`,
      'PUT',
      data
    );
    return response.success;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const getBusinessStats = async (): Promise<{ views: number, searches: number, saves: number }> => {
  try {
    const businessCode = localStorage.getItem('business_code');
    if (!businessCode) {
      throw new Error('کد کسب‌وکار یافت نشد');
    }

    const response = await apiRequest<{ views: number, searches: number, saves: number }>(
      `/api/businesses/${businessCode}/stats/`,
      'GET'
    );
    return response;
  } catch (error) {
    console.error('Error getting business stats:', error);
    return { views: 0, searches: 0, saves: 0 };
  }
};

// ============ API Connection Test ============
export const testApiConnection = async (): Promise<{
  djangoServer: boolean;
  loginEndpoint: boolean;
  message: string;
}> => {
  try {
    console.log('🧪 Testing API connection...');

    // تست ۱: بررسی وجود سرور Django
    let djangoServer = false;
    try {
      const testResponse = await fetch('http://localhost:8000/', {
        method: 'GET',
        mode: 'no-cors'
      });
      console.log('Django server test: Server is running');
      djangoServer = true;
    } catch {
      console.log('Django server test: Cannot reach server');
    }

    // تست ۲: بررسی endpoint login
    let loginEndpoint = false;
    try {
      const loginTest = await fetch('http://localhost:8000/api/businesses/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: 'test',
          password: 'test123'
        })
      });
      console.log('Login endpoint test:', loginTest.status);
      loginEndpoint = loginTest.ok;
    } catch (error) {
      console.log('Login endpoint test error:', error);
    }

    return {
      djangoServer,
      loginEndpoint,
      message: djangoServer ?
        (loginEndpoint ? 'API connection successful' : 'Server running but login endpoint error') :
        'Cannot connect to Django server'
    };
  } catch (error) {
    console.error('❌ API connection test failed:', error);
    return {
      djangoServer: false,
      loginEndpoint: false,
      message: 'Test failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    };
  }
};

// ============ Direct Fetch Test ============
export const directLoginTest = async (identifier: string, password: string): Promise<any> => {
  try {
    console.log('🧪 Direct login test...');

    const response = await fetch('http://localhost:8000/api/businesses/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password
      }),
    });

    console.log('Direct test response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Direct test success:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.error('Direct test failed:', errorText);
      throw new Error(errorText);
    }
  } catch (error) {
    console.error('🔥 Direct test error:', error);
    throw error;
  }
};

// ============ Registration with Payment ============
export const createPendingRegistration = async (
  data: BusinessRegistrationData,
  codeType: 'normal' | 'special' = 'normal'
): Promise<{ 
  success: boolean; 
  payment_url?: string; 
  payment_id?: string;
  business_code?: string;
  error?: string;
  message?: string;
}> => {
  const businessCode = generateBusinessCode(codeType);
  const price = calculatePrice(data.plan, codeType);

  const payload = {
    name: data.name,
    owner: data.owner,
    phone: data.phone,
    email: data.email || '',
    business_type: data.businessType,
    address: data.address || '',
    province: data.province || '',
    social_links: data.socialLinks || [],
    description: data.description || '',
    plan: data.plan,
    password: data.password,
    code_type: codeType,
    business_code: businessCode,
    price: price,
    status: 'pending_payment'
  };

  console.log('📝 Pending registration payload:', payload);

  try {
    // 🚨 تست مستقیم بدون استفاده از apiRequest
    console.log('🧪 تست مستقیم fetch...');
    
    const url = 'http://localhost:8000/api/businesses/pending-registration/';
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('📊 پاسخ مستقیم:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });

    // اول متن پاسخ را بگیریم
    const responseText = await response.text();
    console.log('📄 متن پاسخ:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
      console.log('📦 داده JSON:', result);
    } catch (jsonError) {
      console.error('❌ خطای JSON:', jsonError);
      console.error('📄 متن کامل پاسخ:', responseText);
      
      // اگر HTML دریافت کردیم (صفحه خطا)
      if (responseText.includes('<!DOCTYPE')) {
        return {
          success: false,
          error: 'سرور خطای HTML برگرداند. احتمالاً URL اشتباه است.'
        };
      }
      
      return {
        success: false,
        error: 'پاسخ سرور معتبر نیست: ' + responseText.substring(0, 100)
      };
    }

    if (response.ok) {
      // بررسی ساختار پاسخ
      console.log('✅ پاسخ موفق از سرور. ساختار:', Object.keys(result));
      
      // از لاگ قبلی می‌دانیم سرور business_code برمی‌گرداند
      return {
        success: true,
        payment_url: result.payment_url || result.paymentUrl,
        payment_id: result.payment_id || result.paymentId || result.id,
        business_code: result.business_code || result.businessCode,
        message: result.message || 'ثبت نام موقت موفق'
      };
    } else {
      return {
        success: false,
        error: result.error || result.detail || result.message || `خطا: ${response.status}`
      };
    }
  } catch (error) {
    console.error('❌ خطا در createPendingRegistration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطا در ارتباط با سرور'
    };
  }
};

// ============ Verify Payment ============
export const verifyPayment = async (
  paymentId: string
): Promise<{
  success: boolean;
  business_code?: string;
  error?: string;
}> => {
  try {
    const response = await apiRequest<{
      success: boolean;
      business_code?: string;
      error?: string;
    }>(
      `/api/businesses/verify-payment/${paymentId}/`,
      'GET'
    );
    
    return response;
  } catch (error) {
    console.error('❌ Verify payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطا در تایید پرداخت'
    };
  }
};