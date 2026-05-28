// // frontend/adfinder/app/home/business-register/forgot-password/page.tsx
// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { ArrowRight, Mail } from 'lucide-react';

// export default function ForgotPasswordPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email.trim()) return;
    
//     setIsLoading(true);
    
//     try {
//       // TODO: API call for password reset
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('خطا در ارسال درخواست:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 p-4">
//       <div className="w-full max-w-md">
//         {/* لوگو */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">
//             تبلیغ‌یاب
//           </h1>
//           <p className="text-slate-400">بازاریابی هوشمند برای کسب‌وکارها</p>
//         </div>

//         {/* کارت فرم */}
//         <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-xl">
//           {!isSubmitted ? (
//             <>
//               {/* هدر */}
//               <div className="text-center mb-8">
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
//                   <Mail className="w-8 h-8 text-blue-400" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-white mb-2">
//                   فراموشی رمز عبور
//                 </h2>
//                 <p className="text-slate-400">
//                   ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود
//                 </p>
//               </div>

//               {/* فرم */}
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
//                     ایمیل
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="email"
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                       placeholder="example@domain.com"
//                       dir="ltr"
//                       required
//                     />
//                     <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isLoading || !email.trim()}
//                   className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       در حال ارسال...
//                     </>
//                   ) : (
//                     <>
//                       ارسال لینک بازیابی
//                       <ArrowRight className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>
//               </form>
//             </>
//           ) : (
//             /* پیام موفقیت */
//             <div className="text-center py-8">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full mb-4">
//                 <Mail className="w-8 h-8 text-emerald-400" />
//               </div>
//               <h2 className="text-2xl font-bold text-white mb-2">
//                 ایمیل ارسال شد!
//               </h2>
//               <p className="text-slate-300 mb-6">
//                 لینک بازیابی رمز عبور به آدرس{' '}
//                 <span className="text-blue-400 font-semibold">{email}</span> ارسال شد.
//               </p>
//               <p className="text-slate-400 text-sm mb-8">
//                 لطفاً صندوق ورودی ایمیل خود را بررسی کنید و روی لینک ارسال شده کلیک کنید.
//               </p>
              
//               <div className="space-y-4">
//                 <button
//                   onClick={() => setIsSubmitted(false)}
//                   className="w-full py-3 px-4 bg-slate-700/50 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all"
//                 >
//                   ارسال مجدد
//                 </button>
                
//                 <button
//                   onClick={() => router.push('/business-register/login')}
//                   className="w-full py-3 px-4 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-800/30 transition-all"
//                 >
//                   بازگشت به صفحه ورود
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* فوتر */}
//           <div className="mt-8 pt-6 border-t border-slate-700/50">
//             <div className="text-center">
//               <button
//                 onClick={() => router.push('/business-register/login')}
//                 className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
//               >
//                 ← بازگشت به صفحه ورود
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



export default function Page() {
  return <div>در حال توسعه...</div>;
}