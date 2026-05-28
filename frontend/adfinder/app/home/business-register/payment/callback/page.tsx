// frontend/adfinder/app/home/business-register/payment/callback/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, Copy, ExternalLink } from 'lucide-react';
import { verifyPayment } from '../../services/api-client';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [businessCode, setBusinessCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkPayment = async () => {
      const paymentId = searchParams.get('payment_id');
      const statusParam = searchParams.get('status');

      if (!paymentId) {
        setStatus('error');
        setMessage('شناسه پرداخت یافت نشد');
        return;
      }

      try {
        if (statusParam === 'success') {
          // تایید پرداخت از سرور
          const result = await verifyPayment(paymentId);
          
          if (result.success && result.business_code) {
            setStatus('success');
            setBusinessCode(result.business_code);
            setMessage('پرداخت با موفقیت انجام شد!');
            
            // پاک کردن اطلاعات موقت
            localStorage.removeItem('pending_registration');
          } else {
            setStatus('error');
            setMessage(result.error || 'خطا در تایید پرداخت');
          }
        } else {
          setStatus('error');
          setMessage('پرداخت ناموفق بود یا توسط کاربر لغو شد');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('خطا در بررسی وضعیت پرداخت');
      }
    };

    checkPayment();
  }, [searchParams]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(businessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToDashboard = () => {
    router.push('/business-dashboard');
  };

  const handleGoToLogin = () => {
    router.push('/home/business-register/login');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
        {status === 'loading' && (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">در حال بررسی پرداخت...</h2>
            <p className="text-slate-400">لطفاً چند لحظه صبر کنید</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-emerald-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">تبریک! ثبت نام شما تکمیل شد</h2>
            <p className="text-slate-300 mb-8">کد اختصاصی کسب‌وکار شما:</p>
            
            <div className="bg-slate-800/50 border-2 border-emerald-500/30 rounded-xl p-6 mb-8">
              <div className="text-5xl font-bold text-emerald-400 tracking-wider mb-2">
                {businessCode}
              </div>
              <p className="text-slate-400 text-sm">این کد یک بار برای شما تولید شده است</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCopyCode}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl flex items-center justify-center gap-3 transition-all"
              >
                <Copy className="w-5 h-5" />
                {copied ? 'کپی شد!' : 'کپی کد'}
              </button>

              <button
                onClick={handleGoToDashboard}
                className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                ورود به داشبورد
              </button>

              <button
                onClick={handleGoToLogin}
                className="w-full py-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600 rounded-xl transition-all"
              >
                صفحه ورود
              </button>
            </div>

            <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700">
              <h4 className="text-white font-semibold mb-2">نکات مهم:</h4>
              <ul className="text-slate-400 text-sm space-y-2 text-right">
                <li>• کد خود را در جای امنی نگه دارید</li>
                <li>• با این کد و رمز عبور می‌توانید وارد پنل شوید</li>
                <li>• رمز پیش‌فرض: <code className="bg-slate-700 px-2 py-1 rounded">123456</code></li>
              </ul>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-16 h-16 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">پرداخت ناموفق</h2>
            <p className="text-slate-300 mb-6">{message}</p>
            
            <div className="space-y-4">
              <button
                onClick={() => router.push('/business-register/register')}
                className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                بازگشت به صفحه ثبت نام
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}