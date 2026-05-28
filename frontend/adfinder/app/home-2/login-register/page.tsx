// D:\adfinder\frontend\adfinder\app\home-2\login-register\page.tsx
'use client';

import Link from 'next/link';

export default function LoginRegisterPage() {
  return (
      <div className="w-full py-20 bg-primary text-primary flex items-center justify-center p-4">      <div className="max-w-md w-full mx-auto">
        {/* هدر */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-priamry mb-3">
            ورود / ثبت نام
          </h1>
        </div>

        {/* کارت اصلی */}
        <div className="bg-secondary/10 border border-accent/30 rounded-2xl p-8 shadow-lg">
          {/* دکمه ورود به داشبورد */}
          <Link href="/home-2/login-register/dashboard-login" className="block mb-6">
            <div className="bg-accent hover:bg-accent/90 p-6 rounded-xl border border-accent transition-all duration-300 cursor-pointer text-center hover:scale-[1.02] active:scale-[0.98]">
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl">🚪</div>
                <div>
                  <h3 className="text-xl font-bold text-primary">ورود به داشبورد</h3>
                  <p className="text-primary/80 text-sm mt-2">
                    ورود به پنل مدیریت و کنترل پنل
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* دکمه ثبت نام بیزنس */}
          <Link href="/home-2/login-register/business-register" className="block">
            <div className="bg-accent-3 hover:bg-accent-3/90 p-6 rounded-xl border border-accent-3 transition-all duration-300 cursor-pointer text-center hover:scale-[1.02] active:scale-[0.98]">
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl">🏢</div>
                <div>
                  <h3 className="text-xl font-bold text-primary">ثبت نام بیزنس</h3>
                  <p className="text-primary/80 text-sm mt-2">
                    ثبت نام کسب‌وکار جدید در سیستم
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* لینک بازگشت */}
          <div className="mt-8 pt-6 border-t border-foreground/20 text-center">
            <Link 
              href="/home-2" 
              className="text-primary hover:text-accent/80 text-sm inline-flex items-center gap-2 transition-colors"
            >
              <span>←</span>
              بازگشت
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}