// app/home/business-register/layout.tsx
'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Header from './components/Header';

type Step = 'choose' | 'register' | 'login' | 'dashboard' | 'plans';

export default function BusinessRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // تعیین step از مسیر فعلی
  const getCurrentStep = (): Step => {
    if (pathname.includes('/register')) return 'register';
    if (pathname.includes('/login')) return 'login';
    if (pathname.includes('/plans')) return 'plans';
    if (pathname.includes('/dashboard')) return 'dashboard';
    return 'choose'; // پیش‌فرض
  };
  
  // دریافت businessCode از query parameters
  const businessCode = searchParams.get('code') || 
                       (searchParams.get('preview') === 'true' ? 'PREVIEW' : null);
  
  const step = getCurrentStep();
  
  // تابع بازگشت
  const handleBackToChoose = () => {
    window.location.href = '/home/business-register';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Header
          step={step}
          businessCode={businessCode}
          onBack={step !== 'choose' ? handleBackToChoose : undefined}
        />
        <main className="max-w-6xl mx-auto">
          <div className="card">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}