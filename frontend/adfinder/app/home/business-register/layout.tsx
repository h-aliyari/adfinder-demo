import React from 'react';
import RegisterClientWrapper from './components/RegisterClientWrapper';

export default function BusinessRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* اینجا کامپوننت Client که searchParams را مدیریت می‌کند، رندر می‌شود */}
        <RegisterClientWrapper>
          {children}
        </RegisterClientWrapper>
      </div>
    </div>
  );
}
