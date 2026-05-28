// // frontend\adfinder\app\business-register\services\api.tsx
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// // ============ Type Definitions ============
// export interface BusinessRegistrationData {
//   name: string;
//   owner: string;
//   phone: string;
//   email: string;
//   businessType: string;
//   address: string;
//   province: string;
//   socialLinks: string[];
//   description: string;
//   plan: 'normal' | 'pro';
//   password: string;
//   codeType?: 'normal' | 'special';
//   business_code?: string;
// }

// export interface FullPlusAvailability {
//   available: boolean;
//   remaining: number;
//   limit: number;
// }

// export interface SearchResult {
//   businesses: any[];
//   count: number;
// }

// export interface LoginResponse {
//   success: boolean;
//   business_code?: string;
//   business_name?: string;
//   plan?: string;
//   error?: string;
//   message?: string;
// }

// export interface BusinessDashboardInfo {
//   code: string;
//   name: string;
//   owner: string;
//   phone: string;
//   email: string;
//   businessType: string;
//   address: string;
//   description?: string;
//   plan: 'normal' | 'pro';
//   created_at: string;
//   expires_date: string;
//   days_remaining: number;
//   status: 'active' | 'expired' | 'pending';
//   views: number;
//   searches: number;
//   saves: number;
//   profile_image?: string;
// }

// export interface BusinessProfile {
//   name: string;
//   owner: string;
//   phone: string;
//   email: string;
//   business_type: string;
//   address: string;
//   description: string;
//   business_code: string;
//   profile_image?: string;
// }

// // ============ Helper Functions ============
// const apiRequest = async <T = any>(
//   endpoint: string,
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
//   data?: any,
//   headers: Record<string, string> = {}
// ): Promise<T> => {
//   // حذف / اضافی از endpoint
//   const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
//   const url = `${API_BASE_URL}${cleanEndpoint}`;

//   console.log('🌐 API Request:', {
//     url,
//     method,
//     data,
//     timestamp: new Date().toISOString()
//   });

//   const defaultOptions: RequestInit = {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       ...headers,
//     },
//   };

//   if (data && method !== 'GET') {
//     defaultOptions.body = JSON.stringify(data);
//     console.log('📦 Request body:', data);
//   }

//   try {
//     const response = await fetch(url, defaultOptions);

//     console.log('✅ API Response:', {
//       status: response.status,
//       statusText: response.statusText,
//       url: response.url,
//       ok: response.ok
//     });

//     if (!response.ok) {
//       let errorText = '';
//       try {
//         errorText = await response.text();
//         console.error('❌ API Error Response:', errorText);
//       } catch {
//         errorText = `HTTP ${response.status}: ${response.statusText}`;
//       }

//       throw new Error(errorText);
//     }

//     try {
//       const responseData = await response.json();
//       console.log('📨 Response data:', responseData);
//       return responseData as T;
//     } catch (jsonError) {
//       console.error('❌ JSON parse error:', jsonError);
//       throw new Error('Invalid JSON response from server');
//     }

//   } catch (error) {
//     console.error('🔥 Fetch error:', error);
//     throw error;
//   }
// };

// // ============ Business Types ============
// export const BUSINESS_TYPES = [
//   'غذا و رستوران',
//   'خودرو',
//   'فروشگاه',
//   'خدمات',
//   'سرگرمی',
//   'آموزشی',
//   'گردشگری',
//   'سلامت',
//   'فناوری',
//   'سایر'
// ];

// export const IRAN_PROVINCES = [
//   'تهران', 'خراسان رضوی',
//   'اصفهان', 'فارس',
//   'آذربایجان شرقی',
//   'مازندران',
//   'خوزستان',
//   'آذربایجان غربی',
//   'کرمان',
//   'گیلان',
//   'سمنان',
//   'قزوین',
//   'قم',
//   'البرز',
//   'کردستان',
//   'هرمزگان',
//   'لرستان',
//   'مرکزی',
//   'همدان',
//   'چهارمحال و بختیاری',
//   'یزد',
//   'بوشهر',
//   'زنجان',
//   'اردبیل',
//   'ایلام',
//   'کهگیلویه و بویراحمد',
//   'گلستان',
//   'سیستان و بلوچستان',
//   'خراسان شمالی',
//   'خراسان جنوبی'
// ];

// // ============ Full Plus Plan Availability ============
// export const getFullPlusRemainingCount = async (): Promise<number> => {
//   try {
//     const data = await apiRequest<{ remaining: number }>(
//       '/api/businesses/full-plus-availability/',
//       'GET'
//     );
//     return data.remaining;
//   } catch (error) {
//     console.error('Error getting full plus count:', error);
//     return 4;
//   }
// };

// export const checkFullPlusAvailability = async (): Promise<FullPlusAvailability> => {
//   try {
//     const data = await apiRequest<FullPlusAvailability>(
//       '/api/businesses/full-plus-availability/',
//       'GET'
//     );
//     return {
//       available: data.available,
//       remaining: data.remaining,
//       limit: data.limit
//     };
//   } catch (error) {
//     console.error('Error checking availability:', error);
//     return {
//       available: true,
//       remaining: 4,
//       limit: 6
//     };
//   }
// };

// // ============ Registration and Login ============
// export const registerBusiness = async (
//   data: BusinessRegistrationData,
//   codeType: 'normal' | 'special' = 'normal'
// ): Promise<string> => {
//   // تولید کد بر اساس نوع
//   const businessCode = generateBusinessCode(codeType);

//   // محاسبه قیمت
//   const price = calculatePrice(data.plan, codeType);

//   const payload = {
//     name: data.name,
//     owner: data.owner,
//     phone: data.phone,
//     email: data.email || '',
//     business_type: data.businessType,
//     address: data.address || '',
//     province: data.province || '',
//     social_links: data.socialLinks || [],
//     description: data.description || '',
//     plan: data.plan,
//     password: data.password,
//     code_type: codeType,
//     generated_code: businessCode,
//     business_code: businessCode,
//     price: price
//   };

//   console.log('📝 Register payload:', payload);

//   const response = await apiRequest<{
//     success: boolean;
//     business_code?: string;
//     error?: string;
//     message?: string;
//   }>(
//     '/api/businesses/register/',
//     'POST',
//     payload
//   );

//   console.log('📝 Register response:', response);

//   if (response.success && response.business_code) {
//     return response.business_code;
//   } else {
//     throw new Error(response.error || response.message || 'خطا در ثبت نام');
//   }
// };

// export const loginBusiness = async (identifier: string, password: string): Promise<LoginResponse> => {
//   const payload = {
//     identifier,
//     password
//   };

//   console.log('🔐 Login payload:', payload);

//   try {
//     const response = await apiRequest<LoginResponse>(
//       '/api/businesses/login/',
//       'POST',
//       payload
//     );

//     console.log('🔐 Login response:', response);

//     if (response.success) {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('business_code', response.business_code || '');
//         localStorage.setItem('business_name', response.business_name || '');
//         localStorage.setItem('business_plan', response.plan || '');
//         localStorage.setItem('is_logged_in', 'true');
//       }
//     }

//     return response;

//   } catch (error) {
//     console.error('❌ Login error:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'خطا در ارتباط با سرور'
//     };
//   }
// };

// export const loginWithPhone = async (phone: string, password: string): Promise<LoginResponse> => {
//   return loginBusiness(phone, password);
// };

// // ============ Existence Checks ============
// export const checkBusinessCodeExists = async (code: string): Promise<boolean> => {
//   try {
//     const response = await apiRequest<{ exists: boolean }>(
//       `/api/businesses/check-code/${code}/`,
//       'GET'
//     );
//     return response.exists;
//   } catch (error) {
//     console.error('Error checking code:', error);
//     return false;
//   }
// };

// export const checkPhoneExists = async (phone: string): Promise<boolean> => {
//   try {
//     const response = await apiRequest<{ exists: boolean }>(
//       `/api/businesses/check-phone/${phone}/`,
//       'GET'
//     );
//     return response.exists;
//   } catch (error) {
//     console.error('Error checking phone:', error);
//     return false;
//   }
// };

// // ============ Validation Functions ============
// export const validatePhoneNumber = (phone: string): boolean => {
//   const normalized = phone.replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
//   return /^09\d{9}$/.test(normalized);
// };

// export const validateEmail = (email: string): boolean => {
//   if (!email || email.trim() === '') return true;
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// export const validateBusinessCode = (code: string): boolean => {
//   const normalized = code.replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
//   return /^[A-Za-z][0-9]{2}$/.test(normalized);
// };

// // ============ Utility Functions ============
// export const getCurrentBusiness = () => {
//   if (typeof window === 'undefined') return null;

//   return {
//     code: localStorage.getItem('business_code'),
//     name: localStorage.getItem('business_name'),
//     plan: localStorage.getItem('business_plan'),
//     isLoggedIn: localStorage.getItem('is_logged_in') === 'true'
//   };
// };

// export const logoutBusiness = () => {
//   if (typeof window === 'undefined') return;

//   localStorage.removeItem('business_code');
//   localStorage.removeItem('business_name');
//   localStorage.removeItem('business_plan');
//   localStorage.removeItem('is_logged_in');
// };

// // ============ Search ============
// export const searchBusinesses = async (query: string): Promise<SearchResult> => {
//   try {
//     const response = await apiRequest<SearchResult>(
//       `/api/businesses/search/?q=${encodeURIComponent(query)}`,
//       'GET'
//     );
//     return response;
//   } catch (error) {
//     console.error('Error searching businesses:', error);
//     return { businesses: [], count: 0 };
//   }
// };

// // ============ Dashboard Functions ============
// export const getBusinessDashboardInfo = async (): Promise<BusinessDashboardInfo> => {
//   try {
//     const businessCode = localStorage.getItem('business_code');
//     if (!businessCode) {
//       throw new Error('کد کسب‌وکار یافت نشد');
//     }

//     const response = await apiRequest<BusinessDashboardInfo>(
//       `/api/businesses/${businessCode}/dashboard/`,
//       'GET'
//     );
//     return response;
//   } catch (error) {
//     console.error('Error getting dashboard info:', error);
//     throw error;
//   }
// };

// export const getBusinessProfile = async (): Promise<BusinessProfile> => {
//   try {
//     const businessCode = localStorage.getItem('business_code');
//     if (!businessCode) {
//       throw new Error('کد کسب‌وکار یافت نشد');
//     }

//     const response = await apiRequest<BusinessProfile>(
//       `/api/businesses/${businessCode}/profile/`,
//       'GET'
//     );
//     return response;
//   } catch (error) {
//     console.error('Error getting business profile:', error);
//     throw error;
//   }
// };

// export const updateBusinessProfile = async (data: Partial<BusinessProfile>): Promise<boolean> => {
//   try {
//     const businessCode = localStorage.getItem('business_code');
//     if (!businessCode) {
//       throw new Error('کد کسب‌وکار یافت نشد');
//     }

//     const response = await apiRequest<{ success: boolean }>(
//       `/api/businesses/${businessCode}/update-profile/`,
//       'PUT',
//       data
//     );
//     return response.success;
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     throw error;
//   }
// };

// export const getBusinessStats = async (): Promise<{ views: number, searches: number, saves: number }> => {
//   try {
//     const businessCode = localStorage.getItem('business_code');
//     if (!businessCode) {
//       throw new Error('کد کسب‌وکار یافت نشد');
//     }

//     const response = await apiRequest<{ views: number, searches: number, saves: number }>(
//       `/api/businesses/${businessCode}/stats/`,
//       'GET'
//     );
//     return response;
//   } catch (error) {
//     console.error('Error getting business stats:', error);
//     return { views: 0, searches: 0, saves: 0 };
//   }
// };

// // ============ Persian to English conversion ============
// export const persianToEnglish = (str: string): string => {
//   return str.replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
// };

// // ============ Code Generator Functions ============
// const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const SPECIAL_NUMBERS = ['11', '22', '33', '44', '55', '66', '77', '88', '99'];

// /**
//  * تولید کد کسب‌وکار
//  */
// export function generateBusinessCode(codeType: 'normal' | 'special' = 'normal'): string {
//   // انتخاب تصادفی یک حرف
//   const randomLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];

//   let randomNumber: string;

//   if (codeType === 'special') {
//     // انتخاب تصادفی از اعداد جفت
//     randomNumber = SPECIAL_NUMBERS[Math.floor(Math.random() * SPECIAL_NUMBERS.length)];
//   } else {
//     // تولید عدد دو رقمی عادی (10 تا 99) که جفت نباشد
//     let num = Math.floor(Math.random() * 90) + 10; // 10-99

//     // مطمئن شویم عدد جفت نباشد
//     while (SPECIAL_NUMBERS.includes(num.toString())) {
//       num = Math.floor(Math.random() * 90) + 10;
//     }

//     randomNumber = num.toString();
//   }

//   return `${randomLetter}${randomNumber}`;
// }

// /**
//  * بررسی اینکه آیا کد ویژه است یا خیر
//  */
// export function isSpecialCode(code: string): boolean {
//   if (code.length !== 3) return false;

//   const numberPart = code.slice(1);
//   return SPECIAL_NUMBERS.includes(numberPart);
// }

// /**
//  * محاسبه هزینه بر اساس نوع اشتراک و نوع کد
//  */
// export function calculatePrice(plan: 'normal' | 'pro', codeType: 'normal' | 'special'): number {
//   const basePrices = {
//     normal: 50000,  // اشتراک نرمال
//     pro: 100000     // اشتراک پرو
//   };

//   const specialCodePremium = 50000; // اضافه قیمت برای کد جفت

//   let price = basePrices[plan];

//   if (codeType === 'special') {
//     price += specialCodePremium;
//   }

//   return price;
// }

// /**
//  * تولید کد منحصربه‌فرد (بررسی تکراری نبودن)
//  */
// export async function generateUniqueCode(
//   codeType: 'normal' | 'special' = 'normal',
//   existingCodes: string[] = [],
//   maxAttempts: number = 100
// ): Promise<string> {
//   let attempts = 0;

//   while (attempts < maxAttempts) {
//     const code = generateBusinessCode(codeType);

//     if (!existingCodes.includes(code)) {
//       return code;
//     }

//     attempts++;
//   }

//   // اگر بعد از 100 بار پیدا نشد، یک کد با پسوند اضافه تولید کن
//   const baseCode = generateBusinessCode(codeType);
//   return `${baseCode}-${Math.floor(Math.random() * 10)}`;
// }

// // ============ API Connection Test ============
// export const testApiConnection = async (): Promise<{
//   djangoServer: boolean;
//   loginEndpoint: boolean;
//   message: string;
// }> => {
//   try {
//     console.log('🧪 Testing API connection...');

//     // تست ۱: بررسی وجود سرور Django
//     let djangoServer = false;
//     try {
//       const testResponse = await fetch('http://localhost:8000/', {
//         method: 'GET',
//         mode: 'no-cors' // برای جلوگیری از CORS error
//       });
//       console.log('Django server test: Server is running');
//       djangoServer = true;
//     } catch {
//       console.log('Django server test: Cannot reach server');
//     }

//     // تست ۲: بررسی endpoint login
//     let loginEndpoint = false;
//     try {
//       const loginTest = await fetch('http://localhost:8000/api/businesses/login/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           identifier: 'test',
//           password: 'test123'
//         })
//       });
//       console.log('Login endpoint test:', loginTest.status);
//       loginEndpoint = loginTest.ok;
//     } catch (error) {
//       console.log('Login endpoint test error:', error);
//     }

//     return {
//       djangoServer,
//       loginEndpoint,
//       message: djangoServer ?
//         (loginEndpoint ? 'API connection successful' : 'Server running but login endpoint error') :
//         'Cannot connect to Django server'
//     };
//   } catch (error) {
//     console.error('❌ API connection test failed:', error);
//     return {
//       djangoServer: false,
//       loginEndpoint: false,
//       message: 'Test failed: ' + (error instanceof Error ? error.message : 'Unknown error')
//     };
//   }
// };

// // ============ Direct Fetch Test (برای دیباگ) ============
// export const directLoginTest = async (identifier: string, password: string): Promise<any> => {
//   try {
//     console.log('🧪 Direct login test...');

//     const response = await fetch('http://localhost:8000/api/businesses/login/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         identifier,
//         password
//       }),
//     });

//     console.log('Direct test response:', {
//       status: response.status,
//       statusText: response.statusText,
//       ok: response.ok,
//       url: response.url
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log('Direct test success:', data);
//       return data;
//     } else {
//       const errorText = await response.text();
//       console.error('Direct test failed:', errorText);
//       throw new Error(errorText);
//     }
//   } catch (error) {
//     console.error('🔥 Direct test error:', error);
//     throw error;
//   }
// };