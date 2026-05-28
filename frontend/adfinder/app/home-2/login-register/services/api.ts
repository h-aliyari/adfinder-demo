// frontend\adfinder\app\home-2\login-register\services\api.ts
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const loginService = {
  // تابع موقت برای لاگین تستی
  async login(password: string): Promise<LoginResponse> {
    // شبیه‌سازی تاخیر شبکه
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // رمز عبور تستی
    const TEST_PASSWORD = "123456";
    
    if (password === TEST_PASSWORD) {
      // ذخیره توکن در localStorage (برای تست)
      const fakeToken = "fake_jwt_token_" + Date.now();
      if (typeof window !== 'undefined') {
        localStorage.setItem('dashboard_token', fakeToken);
      }
      
      return {
        success: true,
        message: "ورود موفقیت‌آمیز بود",
        token: fakeToken
      };
    } else {
      return {
        success: false,
        message: "رمز عبور اشتباه است"
      };
    }
  },
  
  // بررسی اینکه کاربر لاگین کرده یا نه
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('dashboard_token');
  },
  
  // خروج کاربر
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dashboard_token');
    }
  }
};