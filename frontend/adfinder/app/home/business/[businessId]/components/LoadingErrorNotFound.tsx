// D:\adfinder\frontend\adfinder\app\business\[businessId]\components\LoadingErrorNotFound.tsx
'use client';

import { useRouter } from 'next/navigation';

interface StateProps {
  type: 'loading' | 'error' | 'not-found';
  error?: string;
}

export default function LoadingErrorNotFound({ type, error }: StateProps) {
  const router = useRouter();

  if (type === 'loading') {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-700">خطا</h2>
          <p className="mt-2 text-red-600">{error || 'خطایی رخ داده است'}</p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
            >
              تلاش مجدد
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              صفحه اصلی
            </button>
          </div>
        </div>
      </div>
    );
  }

  // not-found
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-gray-400 text-4xl mb-4">❓</div>
        <h2 className="text-xl font-bold text-gray-700">کسب‌وکار یافت نشد</h2>
        <p className="mt-2 text-gray-600">کد یا شناسه وارد شده معتبر نیست</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
}