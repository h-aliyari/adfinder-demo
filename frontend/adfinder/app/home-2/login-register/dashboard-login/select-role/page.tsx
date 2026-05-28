// frontend\adfinder\app\home-2\login-register\dashboard-login\select-role\page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginService } from '../../services/api';
import Link from 'next/link';

export default function SelectRolePage() {
  const router = useRouter();

  // بررسی اینکه کاربر لاگین کرده یا نه
  useEffect(() => {
    if (!loginService.isLoggedIn()) {
      router.push('/home-2/login-register/dashboard-login');
    }
  }, [router]);

  const handleLogout = () => {
    loginService.logout();
    router.push('/home-2/login-register/dashboard-login');
  };

  return (
    <div className="w-full min-h-[50vh] bg-primary text-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        {/* هدر */}
        <div className="text-center mb-9 mt-6">
          <p className="text-foreground/80 text-sm">
            نقش مورد نظر خود را انتخاب کنید :
          </p>
        </div>

        {/* کارت اصلی */}
        <div className="bg-secondary/10 p-6 shadow-lg">
          {/* دکمه Operator 1 */}
          <Link href="/home-2/login-register/dashboard-login/operator1" className="block mb-4">
            <div className="bg-accent hover:bg-accent/90 p-5 rounded-xl border border-accent transition-all duration-300 cursor-pointer text-center hover:scale-[1.02] active:scale-[0.98]">
              <div className="flex flex-col items-center gap-3">
                <div className="text-3xl">👨‍💼</div>
                <div>
                  <h3 className="text-lg font-bold text-primary">Operator 1</h3>
                </div>
              </div>
            </div>
          </Link>

          {/* دکمه Operator 2 */}
          <Link href="/home-2/login-register/dashboard-login/operator2" className="block mb-4">
            <div className="bg-accent-2 hover:bg-accent-2/90 p-5 rounded-xl border border-accent-2 transition-all duration-300 cursor-pointer text-center hover:scale-[1.02] active:scale-[0.98]">
              <div className="flex flex-col items-center gap-3">
                <div className="text-3xl">👩‍💼</div>
                <div>
                  <h3 className="text-lg font-bold text-primary">Operator 2</h3>
                </div>
              </div>
            </div>
          </Link>

          {/* دکمه Monitor */}
          <Link href="/home-2/login-register/dashboard-login/monitor" className="block">
            <div className="bg-accent-3 hover:bg-accent-3/90 p-5 rounded-xl border border-accent-3 transition-all duration-300 cursor-pointer text-center hover:scale-[1.02] active:scale-[0.98]">
              <div className="flex flex-col items-center gap-3">
                <div className="text-3xl">📺</div>
                <div>
                  <h3 className="text-lg font-bold text-primary">Monitor</h3>
                </div>
              </div>
            </div>
          </Link>

          {/* دکمه خروج */}
          <div className="mt-6 pt-5 border-t border-foreground/20 text-center">
            <button
              onClick={handleLogout}
              className="text-primary hover:text-red-400 text-sm inline-flex items-center gap-2 transition-colors"
            >
              <span>🚪</span>
              خروج از حساب
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}