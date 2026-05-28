// frontend\adfinder\app\home-2\login-register\dashboard-login\page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginService } from '../services/api';
import Link from 'next/link';

export default function DashboardLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginService.login(password);
      
      if (result.success) {
        // هدایت به صفحه انتخاب نقش
        router.push('/home-2/login-register/dashboard-login/select-role');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('خطایی در ارتباط با سرور رخ داد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[50vh] bg-primary text-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-accent mb-2">
            ورود به داشبورد
          </h1>
        </div>

        {/* کارت اصلی */}
        <div className="bg-secondary/10 border border-accent/30 rounded-2xl p-6 shadow-lg">
          <form onSubmit={handleLogin}>
            {/* فیلد رمز عبور */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                رمز عبور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-accent/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all"
                placeholder="رمز عبور را وارد کنید"
                required
                disabled={loading}
              />

            </div>

            {/* پیام خطا */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* دکمه ورود */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-secondary font-medium py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-accent-2)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  در حال ورود...
                </span>
              ) : (
                'ورود به داشبورد'
              )}
            </button>
          </form>

          {/* لینک بازگشت */}
          <div className="mt-6 pt-5 border-t border-foreground/20 text-center">
            <Link 
              href="/home-2/login-register" 
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