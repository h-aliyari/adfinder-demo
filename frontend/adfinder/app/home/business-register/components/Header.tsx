// D:\adfinder\frontend\adfinder\app\home\business-register\components\Header.tsx
'use client';

import { Building2, ArrowLeft, UserPlus, LogIn } from 'lucide-react';

interface HeaderProps {
  step: 'choose' | 'register' | 'login' | 'dashboard' | 'plans';
  businessCode?: string | null;
  onBack?: () => void;
}

export default function Header({ step, businessCode, onBack }: HeaderProps) {
  // محتوای هدر پویا
  const getHeaderContent = () => {
    const content = {
      choose: {
        title: 'به تبلیغ‌آنلاین خوش آمدید',
        subtitle: 'مدیریت هوشمند تبلیغات',
        icon: <Building2 className="w-12 h-12 text-blue-400" />
      },
      register: {
        title: 'ثبت کسب‌وکار جدید',
        subtitle: 'فرم زیر را برای ثبت‌نام تکمیل کنید',
        icon: <UserPlus className="w-12 h-12 text-blue-400" />
      },
      login: {
        title: 'ورود به پنل کسب و کار',
        subtitle: 'کد اختصاصی کسب‌وکار خود را وارد کنید',
        icon: <LogIn className="w-12 h-12 text-blue-400" />
      },
      plans: {
        title: 'انتخاب پلن اشتراک',
        subtitle: 'پلن مناسب کسب‌وکار خود را انتخاب کنید',
        icon: <Building2 className="w-12 h-12 text-blue-400" />
      },
      dashboard: {
        title: 'داشبورد مدیریت',
        subtitle: businessCode ? `کد اختصاصی: ${businessCode}` : 'مدیریت کسب‌وکار',
        icon: <Building2 className="w-12 h-12 text-blue-400" />
      }
    };

    return content[step];
  };

  const { title, subtitle, icon } = getHeaderContent();

  return (
    <header className="text-center mb-10 md:mb-16">
      <div className="inline-flex items-center justify-center p-4 bg-linear-to-br from-blue-500/20 to-purple-600/20 rounded-2xl mb-6">
        {icon}
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
        {title}
      </h1>
      <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
        {subtitle}
      </p>
      
      {/* Navigation */}
      {step !== 'choose' && onBack && (
        <button
          onClick={onBack}
          className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          بازگشت
        </button>
      )}
    </header>
  );
}