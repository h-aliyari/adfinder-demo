// app/home/search-results/components/BusinessCard.tsx
'use client';

import Link from 'next/link';
import { Business } from '../services/types';

interface BusinessCardProps {
  business: Business;
  index: number;
}

export default function BusinessCard({ business, index }: BusinessCardProps) {
  // رنگ‌های پس‌زمینه
  const isEven = index % 2 === 0;
  const backgroundColor = isEven ? 'bg-blue-200/20' : 'bg-amber-500/20';

  // رنگ‌های متن متناسب با پس‌زمینه
  const textColor = isEven ? 'text-blue-900' : 'text-amber-900';
  const secondaryTextColor = isEven ? 'text-blue-200/80' : 'text-amber-200/80';
  const borderColor = isEven ? 'border-blue-200' : 'border-amber-200';

  // رنگ تگ type متناسب با پس‌زمینه
  const typeTagBg = isEven ? 'bg-blue-100' : 'bg-amber-100';
  const typeTagText = isEven ? 'text-blue-800' : 'text-amber-800';

  console.log(`🃏 [BusinessCard ${index}] Rendering: ${business.name}`, {
    id: business.id,
    code: business.business_code,
    hasId: !!business.id,
    hasCode: !!business.business_code
  });

  // **اصلاح شده: چک کن id واقعاً معتبر باشه**
  const getBusinessId = () => {
    // اول business_code رو چک کن
    if (business.business_code && business.business_code !== 'undefined') {
      console.log(`📌 [BusinessCard ${index}] Using business_code: ${business.business_code}`);
      return business.business_code;
    }

    // بعد id رو چک کن (باید عدد معتبر باشه)
    if (business.id !== undefined && business.id !== null && business.id !== 0) {
      console.log(`📌 [BusinessCard ${index}] Using id: ${business.id}`);
      return String(business.id);
    }

    console.warn(`⚠️ [BusinessCard ${index}] No valid ID found, using 'unknown'`);
    return 'unknown';
  };

  const businessId = getBusinessId();

  // **اصلاح شده: چک کن واقعاً معتبر باشه**
  const hasValidId = businessId !== 'unknown' && businessId !== 'undefined';

  return (
    <div className={`${backgroundColor} ${textColor} rounded-xl p-6 shadow-lg border ${borderColor} hover:shadow-xl transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-xl font-bold bg-linear-to-r ${isEven ? 'from-blue-300 to-purple-300' : 'from-amber-300 to-orange-300'} bg-clip-text text-transparent`}>
            {business.name}
          </h3>
          <div className="flex items-center mt-1 gap-2">
            <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
              کد: {business.business_code}
            </span>
            {business.business_type && (
              <span className={`${typeTagBg} ${typeTagText} px-3 py-1 rounded-full text-sm font-medium`}>
                {business.business_type}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className={`${secondaryTextColor} mb-4 line-clamp-2`}>{business.description || ''}</p>

      
      <div className={`space-y-2 text-sm ${secondaryTextColor}`}>
        <div className="flex items-center">
          <span className="ml-2">📍</span>
          <span>{business.address || 'آدرس ثبت نشده'}</span>
        </div>
        
        {/* نمایش استان */}
        {business.province && (
          <div className="flex items-center">
            <span className="ml-2">🏙️</span>
            <span>استان: {business.province}</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        {hasValidId ? (
          <Link
            href={`/home/business/${businessId}`}
            className="inline-flex items-center justify-center bg-(--color-accent-3) text-(--color-accent) w-full py-2 rounded-lg hover:opacity-90 transition"
            onClick={() => console.log(`🔗 [BusinessCard ${index}] Navigating to: /business/${businessId}`, {
              name: business.name,
              originalId: business.id,
              originalCode: business.business_code
            })}
          >
            مشاهده صفحه کسب‌وکار
            <span className="mr-2">→</span>
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center bg-gray-300 text-gray-500 w-full py-2 rounded-lg cursor-not-allowed"
            onClick={() => console.warn(`🚫 [BusinessCard ${index}] Cannot navigate:`, {
              id: business.id,
              code: business.business_code,
              businessId
            })}
          >
            اطلاعات ناقص (بدون ID)
            <span className="mr-2">⚠️</span>
          </button>
        )}
      </div>
    </div>
  );
}