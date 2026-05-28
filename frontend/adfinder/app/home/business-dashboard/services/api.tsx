// D:\adfinder\frontend\adfinder\app\business-dashboard\services\api.tsx
import { BusinessInfo, Stats } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Helper functions
export const getBusinessCode = (): string => {
  if (typeof window !== 'undefined') {
    // اول سعی کن از business_code بگیر (API قدیمی)
    const oldCode = localStorage.getItem('business_code');
    if (oldCode) {
      localStorage.setItem('last_business_code', oldCode); // برای سازگاری
      return oldCode;
    }

    // اگر نداشت از last_business_code بگیر (API جدید)
    const newCode = localStorage.getItem('last_business_code');
    return newCode || '';
  }
  return '';
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('business_token') ||
      localStorage.getItem('token');
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('business_token', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('business_token');
    localStorage.removeItem('last_business_code');
    localStorage.removeItem('business_code');
    localStorage.removeItem('business_name');
    localStorage.removeItem('business_plan');
    localStorage.removeItem('is_logged_in');
  }
};

// API calls
export const getBusinessDashboardInfo = async (): Promise<BusinessInfo> => {
  try {
    const businessCode = getBusinessCode();

    if (!businessCode) {
      throw new Error('لطفاً ابتدا وارد شوید');
    }

    const response = await fetch(`${API_BASE_URL}/businesses/${businessCode}/dashboard/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        throw new Error('لطفاً دوباره وارد شوید');
      }
      throw new Error(`خطا در دریافت اطلاعات (کد: ${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard info:', error);
    throw error;
  }
};

export const getBusinessStats = async (): Promise<Stats> => {
  try {
    const businessCode = getBusinessCode();

    if (!businessCode) {
      throw new Error('لطفاً ابتدا وارد شوید');
    }

    const response = await fetch(`${API_BASE_URL}/businesses/${businessCode}/stats/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`خطا در دریافت آمار (کد: ${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};


export const updateBusinessProfile = async (data: Record<string, any>): Promise<boolean> => {
  try {
    const businessCode = getBusinessCode();

    if (!businessCode) {
      throw new Error('لطفاً ابتدا وارد شوید');
    }

    console.log('📤 [Frontend] Sending update for:', businessCode);
    console.log('📤 [Frontend] Data:', data);

    const response = await fetch(`${API_BASE_URL}/businesses/${businessCode}/update-profile/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Frontend] Update failed:', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || 'خطا در بروزرسانی پروفایل');
      } catch {
        throw new Error(`خطا در بروزرسانی پروفایل (کد: ${response.status})`);
      }
    }

    const result = await response.json();
    console.log('✅ [Frontend] Update successful:', result);
    return result.success || true;
    
  } catch (error) {
    console.error('❌ [Frontend] Error updating profile:', error);
    throw error;
  }
};

export const logoutBusiness = async (): Promise<boolean> => {
  try {
    removeAuthToken();
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};

// Business types
export const BUSINESS_TYPES = [
  'food', 'auto', 'shop', 'service', 'entertainment',
  'education', 'tourism', 'health', 'tech', 'other'
];

// D:\adfinder\frontend\adfinder\app\business-dashboard\services\api.ts

/**
 * دریافت اطلاعات صفحه اختصاصی برای داشبورد
 */
export const getCustomPageInfo = async (): Promise<any> => {
  try {
    const businessCode = getBusinessCode();
    
    if (!businessCode) {
      throw new Error('لطفاً ابتدا وارد شوید');
    }

    const response = await fetch(`${API_BASE_URL}/businesses/${businessCode}/custom-page/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` }),
      },
    });

    if (!response.ok) {
      // اگر 404 بود، یعنی صفحه اختصاصی ندارد
      if (response.status === 404) {
        return {
          socialLinks: [],
          address: '',
          workingHours: '',
          customDescription: '',
          specialOffers: [],
          hasCustomPage: false
        };
      }
      throw new Error(`خطا در دریافت اطلاعات صفحه اختصاصی (کد: ${response.status})`);
    }

    const data = await response.json();
    
    // تبدیل به فرمت مورد نیاز فرانت‌اند
    return {
      socialLinks: data.social_links || [],
      address: data.custom_address || '',
      workingHours: data.working_hours || '',
      customDescription: data.custom_description || '',
      specialOffers: data.special_offers || [],
      hasCustomPage: data.has_custom_page || false
    };
    
  } catch (error) {
    console.error('Error fetching custom page info:', error);
    throw error;
  }
};

/**
 * ذخیره اطلاعات صفحه اختصاصی
 */
export const saveCustomPageInfo = async (data: any): Promise<boolean> => {
  try {
    const businessCode = getBusinessCode();
    
    if (!businessCode) {
      throw new Error('لطفاً ابتدا وارد شوید');
    }

    // تبدیل به فرمت بک‌اند
    const backendData = {
      social_links: data.socialLinks || [],
      custom_address: data.address || '',
      working_hours: data.workingHours || '',
      custom_description: data.customDescription || '',
      special_offers: data.specialOffers || []
    };

    const response = await fetch(`${API_BASE_URL}/businesses/${businessCode}/custom-page/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` }),
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Frontend] Save custom page failed:', errorText);
      throw new Error('خطا در ذخیره اطلاعات صفحه اختصاصی');
    }

    const result = await response.json();
    return result.success || true;
    
  } catch (error) {
    console.error('Error saving custom page info:', error);
    throw error;
  }
};


// اضافه کردن API کیف پول
export interface WalletInfo {
  balance: number;
  total_withdrawn: number;
  total_views: number;
  used_views: number;
  available_views: number;
  withdrawable_amount: number;
  last_withdrawal_date: string | null;
}

export interface Transaction {
  id: number;
  transaction_type: string;
  amount: number;
  description: string;
  views_used: number;
  payment_for: string | null;
  status: string;
  created_at: string;
}

export interface WithdrawalRate {
  views_per_1000: number;
  amount_per_1000_views: number; // ریال
  min_withdrawal: number; // ریال
}

/**
 * دریافت اطلاعات کیف پول
 */
export const getWalletInfo = async (businessCode: string): Promise<{
  wallet: WalletInfo;
  recent_transactions: Transaction[];
  withdrawal_rate: WithdrawalRate;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessCode}/wallet/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`خطا در دریافت اطلاعات کیف پول (کد: ${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching wallet info:', error);
    throw error;
  }
};

/**
 * درخواست برداشت از کیف پول
 */
export const requestWithdrawal = async (
  businessCode: string,
  amount: number,
  method: string = 'wallet',
  bankInfo?: {
    bank_name?: string;
    account_number?: string;
    card_number?: string;
    sheba_number?: string;
  }
): Promise<{
  withdrawal_id: number;
  transaction_id: number;
  amount: number;
  views_used: number;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessCode}/wallet/withdraw/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        amount,
        method,
        ...bankInfo
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `خطا در ثبت درخواست برداشت (کد: ${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error requesting withdrawal:', error);
    throw error;
  }
};

/**
 * پرداخت از کیف پول
 */
export const makePaymentFromWallet = async (
  businessCode: string,
  amount: number,
  paymentFor: string,
  description: string,
  useViews: boolean = false,
  paymentDetails?: any
): Promise<{
  transaction_id: number;
  amount: number;
  wallet_balance: number;
  used_views: number;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessCode}/wallet/pay/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        amount,
        payment_for: paymentFor,
        description,
        use_views: useViews,
        payment_details: paymentDetails || {}
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `خطا در پرداخت (کد: ${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error making payment:', error);
    throw error;
  }
};

/**
 * دریافت تاریخچه تراکنش‌ها
 */
export const getWalletTransactions = async (
  businessCode: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/businesses/${businessCode}/wallet/transactions/?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`خطا در دریافت تراکنش‌ها (کد: ${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};