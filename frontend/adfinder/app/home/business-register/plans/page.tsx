// frontend/adfinder/app/home/business-register/plans/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkFullPlusAvailability } from '../services/api-client';
import { periods, initialProServices, plans, basePrices, type ProService } from './data';
import PlanCard from './components/PlanCard';
import PeriodSelector from './components/PeriodSelector';
import CartSummary from './components/CartSummary';

export default function PlansPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const isPreview = searchParams.get('preview') === 'true';

  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [expandedPlan, setExpandedPlan] = useState<'normal' | 'pro' | null>(null);
  const [proServices, setProServices] = useState<ProService[]>(initialProServices);
  const [homepageAdRemaining, setHomepageAdRemaining] = useState<number | null>(null);

  // دریافت تعداد باقی‌مانده تبلیغات صفحه اصلی
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const availability = await checkFullPlusAvailability();
        setHomepageAdRemaining(availability.remaining);

        // به‌روزرسانی سرویس تبلیغ صفحه اصلی
        setProServices(prev => prev.map(service =>
          service.id === 'homepage-ad'
            ? { ...service, remaining: availability.remaining, limit: availability.limit }
            : service
        ));
      } catch (error) {
        console.error('خطا در دریافت وضعیت:', error);
      }
    };

    fetchAvailability();
  }, []);

  // تابع‌های کمکی
  const toggleProService = (serviceId: string) => {
    const service = proServices.find(s => s.id === serviceId);
    if (!service || (service.isLimited && service.remaining !== undefined && service.remaining <= 0)) return;

    setProServices(prev => prev.map(service =>
      service.id === serviceId ? { ...service, isSelected: !service.isSelected } : service
    ));
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  // محاسبه قیمت نهایی
  const totalPrice = useMemo(() => {
    // فقط قیمت طرح پرو + خدمات انتخابی آن
    if (expandedPlan === 'pro') {
      const proBase = basePrices.pro[selectedPeriod as keyof typeof basePrices.pro];
      const servicesTotal = proServices
        .filter(s => s.isSelected)
        .reduce((sum, s) => sum + (s.prices[selectedPeriod] || s.prices.monthly), 0);

      const period = periods.find(p => p.id === selectedPeriod);
      const discount = period?.discount || 0;

      return (proBase + servicesTotal) * (1 - discount / 100);
    }

    // قیمت طرح نرمال
    const normalBase = basePrices.normal[selectedPeriod as keyof typeof basePrices.normal];
    const period = periods.find(p => p.id === selectedPeriod);
    const discount = period?.discount || 0;

    return normalBase * (1 - discount / 100);
  }, [selectedPeriod, expandedPlan, proServices]);

  const handlePlanClick = (planId: 'normal' | 'pro') => {
    const plan = plans.find(p => p.id === planId);
    if (plan?.disabled) return;
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  const handleContinue = () => {
    if (expandedPlan === 'pro') return;
    
    if (isPreview) {
      router.push('/home/business-register/register');
    } else if (code) {
      // در اینجا پرداخت را انجام دهید
      router.push('/home/business-register/dashboard');
    } else {
      router.push('/home/business-register/register');
    }
  };

  const selectedServicesCount = proServices.filter(s => s.isSelected).length;
  const selectedServicesTotal = proServices
    .filter(s => s.isSelected)
    .reduce((sum, s) => sum + (s.prices[selectedPeriod] || s.prices.monthly), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* انتخاب دوره */}
      <PeriodSelector
        periods={periods}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
      />

      {/* طرح‌ها */}
      <div className="space-y-4">
        {plans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPeriod={selectedPeriod}
            isExpanded={expandedPlan === plan.id}
            onToggle={() => handlePlanClick(plan.id)}
          >
            {plan.id === 'pro' && (
              <CartSummary
                proServices={proServices}
                currentPeriod={selectedPeriod}
                onServiceToggle={toggleProService}
              />
            )}
          </PlanCard>
        ))}
      </div>

      {/* خلاصه قیمت */}
      <div className="bg-linear-to-r from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">خلاصه قیمت</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-700">
            <span className="text-slate-300">دوره انتخاب شده:</span>
            <span className="font-bold text-white">
              {periods.find(p => p.id === selectedPeriod)?.name}
            </span>
          </div>

          {expandedPlan && (
            <>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-300">طرح {expandedPlan === 'normal' ? 'نرمال' : 'پرو'}:</span>
                <span className="font-bold text-white">
                  {formatPrice(basePrices[expandedPlan][selectedPeriod as keyof typeof basePrices.normal])}
                </span>
              </div>

              {expandedPlan === 'pro' && selectedServicesCount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-300">خدمات پرو اضافه‌شده:</span>
                  <span className="font-bold text-emerald-400">
                    +{formatPrice(selectedServicesTotal)}
                  </span>
                </div>
              )}

              {periods.find(p => p.id === selectedPeriod)?.discount! > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-700">
                  <span className="text-slate-300">تخفیف دوره:</span>
                  <span className="font-bold text-green-400">
                    {periods.find(p => p.id === selectedPeriod)?.discount}%
                  </span>
                </div>
              )}
            </>
          )}

          <div className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg text-slate-300">قیمت نهایی</div>
                {expandedPlan === 'pro' && (
                  <div className="text-xs text-slate-500 mt-1">
                    (پرو غیرفعال است.)
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                {formatPrice(Math.round(totalPrice))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={expandedPlan === 'pro'}
          className={`w-full mt-6 py-3 text-white font-bold rounded-lg transition-all ${expandedPlan === 'pro'
            ? 'bg-slate-700 cursor-not-allowed opacity-50'
            : 'bg-linear-to-r from-blue-600 to-indigo-700 hover:opacity-90'
            }`}
        >
          {isPreview 
            ? 'شروع ثبت نام' 
            : expandedPlan === 'pro' 
              ? 'پرو غیرفعال است' 
              : code 
                ? 'پرداخت و فعالسازی' 
                : 'ادامه ثبت نام'
          }
        </button>

        <p className="text-center text-slate-500 text-sm mt-3">
          {isPreview 
            ? 'در حال حاضر فقط پلن نرمال ماهانه فعال است.'
            : 'در حال حاضر فقط پلن نرمال ماهانه فعال است.'
          }
        </p>
      </div>
    </div>
  );
}