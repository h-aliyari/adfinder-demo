// app/home/business-register/page.tsx
'use client';

// import React from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, LogIn } from 'lucide-react';

export default function BusinessRegisterPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card hover:border-blue-500/30 border-2 border-foreground/30 rounded-xl p-6">
          <div className="flex flex-col items-center text-center h-full">
            <div className="p-4 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl mb-6">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">ثبت کسب‌وکار جدید</h2>
            <p className="text-slate-300 mb-8 grow">
              برای اولین بار در پلتفرم ثبت‌نام کنید.
            </p>
            <button
              onClick={() => router.push('/home/business-register/register')}
              className="btn-primary w-full max-w-xs"
            >
              شروع ثبت‌نام
            </button>
          </div>
        </div>

        <div className="card hover:border-emerald-500/30 border-2 border-foreground/30 rounded-xl p-6">
          <div className="flex flex-col items-center text-center h-full">
            <div className="p-4 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">ورود به پنل</h2>
            <p className="text-slate-300 mb-8 grow">
              اگر قبلاً ثبت‌نام کرده‌اید، وارد شوید.
            </p>
            <button
              onClick={() => router.push('/home/business-register/login')}
              className="btn-secondary w-full max-w-xs"
            >
              ورود به داشبورد
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-12 pt-8 border-t border-slate-700">
        <p className="text-slate-400 mb-4">می‌خواهید ابتدا پلن‌ها را مشاهده کنید؟</p>
        <button
          onClick={() => router.push('/home/business-register/plans?preview=true')}
          className="btn-accent text-amber-100"
        >
          مشاهده پلن‌های اشتراک
        </button>
      </div>
    </div>
  );
}