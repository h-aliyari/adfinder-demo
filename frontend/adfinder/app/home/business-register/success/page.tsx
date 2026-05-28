// در frontend/adfinder/app/home/business-register/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Home, LogIn } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const businessCode = searchParams.get('code');
  
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(businessCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mt-8 text-center"
        >
          {/* آیکون موفقیت */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-32 h-32 bg-linear-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-20 h-20 text-green-500" />
          </motion.div>
          
          {/* عنوان */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            ثبت نام با موفقیت انجام شد! 🎉
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            کسب‌وکار شما با موفقیت ثبت و فعال شد.
          </p>
          
          {/* کارت کد */}
          {businessCode && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">کد اختصاصی شما</h2>
              
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="bg-white px-6 py-3 rounded-lg border-2 border-blue-300 shadow-sm">
                  <span className="text-3xl font-bold text-blue-600 font-mono tracking-wider">
                    {businessCode}
                  </span>
                </div>
                
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition ${copied ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                >
                  <Copy size={20} />
                  <span>{copied ? 'کپی شد!' : 'کپی'}</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-600">
                این کد را در جایی امن نگه دارید. برای ورود به پنل از این کد استفاده کنید.
              </p>
            </div>
          )}
          
          {/* اطلاعات مهم */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-700 mb-3">📌 نکات مهم:</h3>
            <ul className="text-sm text-yellow-800 space-y-2 text-right list-disc list-inside">
              <li>کد شما ۳۰ روز اعتبار دارد</li>
              <li>می‌توانید از طریق پنل کاربری اطلاعات کسب‌وکار را ویرایش کنید</li>
              <li>برای ورود به پنل از شماره تلفن یا کد کسب‌وکار استفاده کنید</li>
              <li>در صورت نیاز به تمدید، از بخش تمدید اشتراک اقدام کنید</li>
            </ul>
          </div>
          
          {/* دکمه‌های اقدام */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/business/login')}
              className="flex items-center justify-center space-x-2 py-4 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition"
            >
              <LogIn size={20} />
              <span>ورود به پنل کاربری</span>
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center space-x-2 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition"
            >
              <Home size={20} />
              <span>بازگشت به خانه</span>
            </button>
          </div>
          
          {/* راهنمایی نهایی */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              در صورت بروز مشکل یا سوال، با پشتیبانی تماس بگیرید:
              <br />
              <a href="tel:02112345678" className="text-blue-600 hover:underline">
                ۰۲۱-۱۲۳۴۵۶۷۸
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}