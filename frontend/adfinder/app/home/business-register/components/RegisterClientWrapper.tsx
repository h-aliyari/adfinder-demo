'use client';

import React, { ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Header from './Header';

interface RegisterClientWrapperProps {
  children: ReactNode;
}

export default function RegisterClientWrapper({ children }: RegisterClientWrapperProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // تعیین step از مسیر فعلی
  const getCurrentStep = (): 'choose' | 'register' | 'login' | 'dashboard' | 'plans' => {
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

  const handleBackToChoose = () => {
    window.location.href = '/home/business-register';
  };

  return (
    <>
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
    </>
  );
}
