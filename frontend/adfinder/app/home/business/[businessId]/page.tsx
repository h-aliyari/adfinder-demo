// D:\adfinder\frontend\adfinder\app\home\business\[businessId]\page.tsx
import ClientBusinessPage from './ClientBusinessPage';
import { getBusinessById, getCustomPageData } from '../services/api';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ businessId: string }>;
}

export default async function BusinessPage({ params }: PageProps) {
  const { businessId } = await params;

  console.log('🔄 [BusinessPage] Loading business ID:', businessId);

  try {
    // ۱. اول کسب‌وکار را بگیر
    const business = await getBusinessById(businessId);
    console.log('✅ [BusinessPage] Business data:', business);

    if (!business) {
      console.error('❌ [BusinessPage] Business is null or undefined');
      throw new Error('کسب‌وکار یافت نشد');
    }

    if (!business.id) {
      console.error('❌ [BusinessPage] Business has no ID:', business);
      throw new Error('اطلاعات کسب‌وکار ناقص است');
    }

    // ۲. سپس صفحه سفارشی را بگیر (اختیاری)
    let customPageData = null;
    try {
      customPageData = await getCustomPageData(businessId);
      console.log('✅ [BusinessPage] Custom page data:', customPageData ? 'exists' : 'null');
    } catch (customError) {
      console.warn('⚠️ [BusinessPage] No custom page:', customError);
      // ادامه دهید، صفحه سفارشی ضروری نیست
    }

    console.log('✅ [BusinessPage] Rendering ClientBusinessPage');

    return (
      <ClientBusinessPage
        initialBusiness={business}
        initialCustomPageData={customPageData}
      />
    );

  } catch (error) {
    console.error('❌ [BusinessPage] Error:', error);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {error instanceof Error && error.message.includes('یافت نشد')
              ? 'کسب‌وکار یافت نشد'
              : 'خطا در بارگذاری'}
          </h1>
          <p className="text-gray-600 mb-2">
            {error instanceof Error ? error.message : 'مشکلی پیش آمده است'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            ID: {businessId}
          </p>
          <div className="space-y-3">
            <a
              href="/"
              className="inline-block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition"
            >
              بازگشت به صفحه اصلی
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }
}
