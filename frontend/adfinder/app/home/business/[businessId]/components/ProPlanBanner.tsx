// D:\adfinder\frontend\adfinder\app\business\[businessId]\components\ProPlanBanner.tsx
interface ProPlanBannerProps {
  plan: string;
}

export default function ProPlanBanner({ plan }: ProPlanBannerProps) {
  if (plan !== 'full_plus') return null;

  return (
    <div className="mt-6 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-blue-800 mb-3">✨ صفحه اختصاصی Pro</h3>
      <p className="text-blue-700">
        این کسب‌وکار از پلن Pro استفاده می‌کند و صفحه اختصاصی کامل‌تری دارد.
      </p>
    </div>
  );
}