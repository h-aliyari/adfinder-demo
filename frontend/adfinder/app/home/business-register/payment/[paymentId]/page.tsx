// // در frontend/adfinder/app/home/business-register/payment/[paymentId]/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';

// export default function PaymentPage() {
//   const params = useParams();
//   const router = useRouter();
//   const paymentId = params.paymentId as string;
  
//   const [data, setData] = useState<any>(null);
//   const [error, setError] = useState<string>('');

//   useEffect(() => {
//     console.log('🎯 صفحه پرداخت لود شد');
//     console.log('📌 paymentId:', paymentId);
//     console.log('📌 params:', params);
    
//     // خواندن از localStorage
//     try {
//       const storedData = localStorage.getItem('pending_registration');
//       console.log('📦 داده localStorage:', storedData);
      
//       if (storedData) {
//         const parsed = JSON.parse(storedData);
//         setData(parsed);
//         console.log('✅ داده‌ها بارگذاری شد:', parsed);
//       } else {
//         setError('داده‌ای یافت نشد');
//         console.warn('⚠️ داده‌ای در localStorage نیست');
//       }
//     } catch (err) {
//       console.error('❌ خطا در خواندن localStorage:', err);
//       setError('خطا در خواندن داده‌ها');
//     }
//   }, [paymentId]);

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-red-50">
//         <div className="text-center p-8 bg-white rounded-xl shadow-lg">
//           <div className="text-6xl mb-4">❌</div>
//           <h1 className="text-2xl font-bold text-red-600 mb-4">خطا</h1>
//           <p className="text-gray-700 mb-6">{error}</p>
//           <button
//             onClick={() => router.push('/home/business-register/register')}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             بازگشت به ثبت نام
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
//           <div className="text-center mb-8">
//             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <span className="text-4xl">💰</span>
//             </div>
            
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">
//               صفحه پرداخت تست
//             </h1>
//             <p className="text-gray-600 mb-6">
//               این یک صفحه تست است. اگر این را می‌بینید، مسیر‌یابی کار می‌کند!
//             </p>
//           </div>
          
//           <div className="bg-gray-50 rounded-xl p-6 mb-8">
//             <h2 className="text-xl font-semibold text-gray-700 mb-4">اطلاعات</h2>
            
//             <div className="space-y-4">
//               <div className="flex justify-between items-center border-b pb-3">
//                 <span className="text-gray-600">شناسه پرداخت:</span>
//                 <span className="font-mono font-bold text-blue-600">{paymentId}</span>
//               </div>
              
//               {data && (
//                 <>
//                   <div className="flex justify-between items-center border-b pb-3">
//                     <span className="text-gray-600">نام کسب‌وکار:</span>
//                     <span className="font-bold text-gray-800">{data.name}</span>
//                   </div>
                  
//                   <div className="flex justify-between items-center border-b pb-3">
//                     <span className="text-gray-600">کد کسب‌وکار:</span>
//                     <span className="font-mono font-bold text-green-600 text-xl">
//                       {data.businessCode}
//                     </span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">شماره تماس:</span>
//                     <span className="font-bold text-gray-800">{data.phone}</span>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
          
//           <div className="space-y-4">
//             <button
//               onClick={() => {
//                 alert('پرداخت شبیه‌سازی شد!');
//                 router.push('/dashboard');
//               }}
//               className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:opacity-90 transition"
//             >
//               شبیه‌سازی پرداخت موفق
//             </button>
            
//             <button
//               onClick={() => router.push('/home/business-register/register')}
//               className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition"
//             >
//               بازگشت
//             </button>
//           </div>
          
//           <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
//             <h3 className="font-semibold text-blue-700 mb-2">اطلاعات دیباگ:</h3>
//             <pre className="text-xs text-gray-600 overflow-auto">
//               {JSON.stringify({ paymentId, data, params }, null, 2)}
//             </pre>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// در frontend/adfinder/app/home/business-register/payment/[paymentId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.paymentId as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    console.log('🎯 صفحه پرداخت لود شد');
    console.log('📌 paymentId:', paymentId);
    
    // خواندن از localStorage
    try {
      const storedData = localStorage.getItem('pending_registration');
      
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setData(parsed);
        console.log('✅ داده‌ها بارگذاری شد:', parsed);
        
        // درخواست اطلاعات پرداخت از سرور
        fetchPaymentInfo(parsed);
      } else {
        setError('داده‌ای یافت نشد. لطفاً مجدداً ثبت نام کنید.');
        console.warn('⚠️ داده‌ای در localStorage نیست');
      }
    } catch (err) {
      console.error('❌ خطا در خواندن localStorage:', err);
      setError('خطا در خواندن داده‌ها');
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  const fetchPaymentInfo = async (businessData: any) => {
    try {
      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/businesses/payment/${paymentId}/initiate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setPaymentInfo(result);
        console.log('✅ اطلاعات پرداخت دریافت شد:', result);
      } else {
        setError(result.error || 'خطا در دریافت اطلاعات پرداخت');
      }
    } catch (err) {
      console.error('❌ خطا در دریافت اطلاعات پرداخت:', err);
      setError('خطا در ارتباط با سرور');
    }
  };

  const handlePayment = async () => {
    if (!paymentInfo) return;
    
    setPaymentLoading(true);
    
    try {
      if (paymentInfo.is_test) {
        // حالت تست - مستقیماً به تایید برو
        console.log('🧪 پرداخت تستی شروع شد');
        
        // شبیه‌سازی تاخیر پرداخت
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // تایید پرداخت تستی
        const verifyResponse = await fetch(
          `http://localhost:8000/api/businesses/payment/${paymentId}/verify/`
        );
        
        const verifyResult = await verifyResponse.json();
        
        if (verifyResponse.ok && verifyResult.success) {
          // حذف داده‌های موقت
          localStorage.removeItem('pending_registration');
          
          // انتقال به صفحه موفقیت
          router.push(`/home/business-register/success?code=${data.businessCode}`);
        } else {
          setError(verifyResult.error || 'خطا در تایید پرداخت');
        }
      } else {
        // حالت واقعی - باز کردن درگاه
        console.log('🔗 باز کردن درگاه پرداخت واقعی');
        window.location.href = paymentInfo.payment_url;
      }
    } catch (err) {
      console.error('❌ خطا در پرداخت:', err);
      setError('خطا در فرآیند پرداخت');
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' ریال';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-red-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-red-600">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطا</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/home/business-register/register')}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              بازگشت به ثبت نام
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mt-8"
        >
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-linear-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">💰</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {paymentInfo?.is_test ? 'پرداخت تستی' : 'پرداخت'}
            </h1>
            <p className="text-gray-600 mb-6">
              {paymentInfo?.is_test 
                ? 'این یک پرداخت تستی است. برای تکمیل ثبت نام، دکمه زیر را کلیک کنید.' 
                : 'برای تکمیل ثبت نام، لطفاً مبلغ زیر را پرداخت کنید.'}
            </p>
          </div>
          
          <div className="space-y-6">
            {/* کارت اطلاعات کسب‌وکار */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">📋 اطلاعات ثبت نام</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">نام کسب‌وکار:</span>
                  <span className="font-bold text-gray-800">{data?.name}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">کد اختصاصی:</span>
                  <span className="font-mono font-bold text-green-600 text-xl">
                    {data?.businessCode}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">نوع کد:</span>
                  <span className={`font-bold px-3 py-1 rounded-full ${data?.codeType === 'special' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {data?.codeType === 'special' ? 'ویژه' : 'عادی'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* کارت جزئیات پرداخت */}
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h2 className="text-xl font-semibold text-green-700 mb-4">💳 جزئیات پرداخت</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-700">مبلغ قابل پرداخت:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(data?.price || 0)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700">شناسه پرداخت:</span>
                  <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                    {paymentId}
                  </span>
                </div>
                
                {paymentInfo?.is_test && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center text-yellow-700">
                      <span className="text-lg mr-2">⚠️</span>
                      <span className="text-sm">این یک پرداخت تستی است. بعداً با مرچنت کد واقعی جایگزین خواهد شد.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* دکمه‌های اقدام */}
            <div className="space-y-4 pt-4">
              <button
                onClick={handlePayment}
                disabled={paymentLoading || !paymentInfo}
                className={`w-full py-4 text-white font-bold rounded-xl transition-all duration-300 ${paymentLoading || !paymentInfo
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg'
                }`}
              >
                {paymentLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    در حال پردازش...
                  </div>
                ) : paymentInfo?.is_test ? (
                  'تکمیل پرداخت تستی'
                ) : (
                  'ورود به درگاه پرداخت'
                )}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => router.push('/home/business-register/register')}
                  className="py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition"
                >
                  بازگشت به ثبت نام
                </button>
                
                <button
                  onClick={() => router.push('/')}
                  className="py-3 bg-blue-100 text-blue-600 font-semibold rounded-xl hover:bg-blue-200 transition"
                >
                  بازگشت به خانه
                </button>
              </div>
            </div>
            
            {/* راهنمایی */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">📝 راهنمایی:</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>پس از پرداخت موفق، کد کسب‌وکار شما فعال خواهد شد</li>
                <li>کد شما ۳۰ روز اعتبار دارد</li>
                <li>می‌توانید از طریق پنل کاربری، اطلاعات کسب‌وکار را ویرایش کنید</li>
                <li>در صورت بروز مشکل با پشتیبانی تماس بگیرید</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}