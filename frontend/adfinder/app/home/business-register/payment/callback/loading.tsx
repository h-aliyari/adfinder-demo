// frontend/adfinder/app/business-register/payment/callback/loading.tsx
export default function Loading() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-white mb-4">در حال بررسی...</h2>
        <p className="text-slate-400">لطفاً صبر کنید</p>
      </div>
    </div>
  );
}