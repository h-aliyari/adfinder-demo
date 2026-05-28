//  frontend\adfinder\app\home\business-register\components\CodeDisplayWidget.tsx

'use client';
import React from 'react';
import { Copy, CheckCircle2, X } from 'lucide-react';

interface CodeDisplayWidgetProps {
  code: string;
  // ❌ onProceedToPayment را حذف یا optional کنید
  onProceedToPayment?: () => void;
  onClose?: () => void;
  // ✅ حالت جدید برای صفحه پرداخت
  variant?: 'pre-payment' | 'post-payment';
  onContinue?: () => void; // برای حالت post-payment
}

export default function CodeDisplayWidget({ 
  code, 
  onProceedToPayment,
  onClose,
  variant = 'pre-payment',
  onContinue
}: CodeDisplayWidgetProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // محتوای متفاوت بر اساس variant
  const getContent = () => {
    if (variant === 'post-payment') {
      return {
        title: 'ثبت‌نام تکمیل شد!',
        description: 'کسب‌وکار شما با موفقیت ثبت و فعال شد.',
        buttonText: 'ورود به داشبورد',
        buttonAction: onContinue
      };
    }
    
    // حالت پیش‌فرض (pre-payment)
    return {
      title: 'کد شما تولید شد!',
      description: 'کد اختصاصی کسب‌وکار شما آماده است.',
      buttonText: 'ادامه به پرداخت',
      buttonAction: onProceedToPayment
    };
  };

  const content = getContent();

  return (
    <div className={`${variant === 'pre-payment' ? 'fixed inset-0 bg-black/70 backdrop-blur-sm' : ''} flex items-center justify-center p-4 ${variant === 'pre-payment' ? 'z-50 animate-in fade-in duration-300' : ''}`}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-300">
        {/* هدر */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">{content.title}</h3>
          {onClose && variant === 'pre-payment' && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>

        {/* محتوا */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">
              {variant === 'post-payment' ? '✅ پرداخت موفق' : 'کد شما تولید شد!'}
            </h2>
            
            <p className="text-slate-300 text-sm">
              {content.description}
            </p>
          </div>

          {/* نمایش کد */}
          <div className="mb-6">
            <div className="text-center mb-3">
              <span className="text-slate-300 text-sm">کد اختصاصی شما:</span>
            </div>
            
            <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 relative">
              <div className="text-center">
                <span className="text-3xl font-bold text-white tracking-wider font-mono">
                  {code}
                </span>
              </div>
              
              <button
                onClick={handleCopy}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="کپی کد"
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-400" />
                )}
              </button>
            </div>
            
            {copied && (
              <p className="text-green-500 text-sm text-center mt-2 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 ml-1" />
                کد با موفقیت کپی شد
              </p>
            )}
          </div>

          {/* دکمه‌ها */}
          <div className="space-y-3">
            {content.buttonAction && (
              <button
                onClick={content.buttonAction}
                className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
              >
                {content.buttonText}
              </button>
            )}
            
            {variant === 'post-payment' && (
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 bg-slate-800 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 transition-all"
              >
                بازگشت به صفحه اصلی
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}