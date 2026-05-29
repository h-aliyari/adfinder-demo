// frontend/adfinder/app/home/business-register/register/components/SubscriptionSelector.tsx
'use client';

import React from 'react';
import { CreditCard, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface SubscriptionSelectorProps {
  plan: 'normal' | 'pro';
  onPlanChange: (plan: 'normal' | 'pro') => void;
  loading: boolean;
  codeType: 'normal' | 'special';
  onSubmitNormal: () => void;
  onSubmitSpecial: () => void;
}

export default function SubscriptionSelector({
  plan,
  onPlanChange,
  loading,
  codeType,
  onSubmitNormal,
  onSubmitSpecial
}: SubscriptionSelectorProps) {
  return (
    <div className="sticky top-6">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-linear-to-r from-blue-600 to-indigo-700 rounded-lg">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">انتخاب اشتراک</h3>
          <Link
            href="/home/business-register/plans?preview=true"
            className="text-accent flex items-center gap-1 text-sm hover:text-accent/80 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            راهنمای اشتراک ها
          </Link>
        </div>

        {/* کارت‌های اشتراک */}
        <div className="space-y-4">
          {/* اشتراک نرمال */}
          <div
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all relative overflow-hidden ${plan === 'normal'
                ? 'border-gradient-to-r from-blue-500 to-indigo-600 bg-linear-to-br from-blue-400/20 to-indigo-900/10'
                : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
              }`}
            onClick={() => onPlanChange('normal')}
          >
            <div className="absolute top-2 right-2">
              <div className={`w-5 h-5 rounded-full border-2 ${plan === 'normal' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'}`}>
                {plan === 'normal' && (
                  <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                )}
              </div>
            </div>

            <h4 className="text-lg font-bold text-white mb-2">اشتراک نرمال</h4>
            <div className="mb-3">
              <span className="text-2xl font-bold text-white">۹۹,۰۰۰</span>
              <span className="text-slate-300 text-sm mr-2">تومان / ماه</span>
            </div>
          </div>

          {/* اشتراک پرو */}
          <div
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all relative overflow-hidden ${plan === 'pro'
                ? 'border-gradient-to-r from-purple-500 to-pink-600 bg-linear-to-br from-purple-400/20 to-pink-600/10'
                : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
              }`}
            onClick={() => onPlanChange('pro')}
          >
            <div className="absolute top-2 right-2">
              <div className={`w-5 h-5 rounded-full border-2 ${plan === 'pro' ? 'border-purple-500 bg-purple-500' : 'border-slate-600'}`}>
                {plan === 'pro' && (
                  <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-bold text-white">اشتراک پرو</h4>
              <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full">
                غیرفعال
              </span>
            </div>
          </div>
        </div>

        {/* دکمه‌های ثبت نام */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onSubmitNormal}
            disabled={loading || plan === 'pro'}
            className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && codeType === 'normal' ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                در حال پردازش...
              </span>
            ) : (
              'پرداخت و ثبت نام با کد معمولی'
            )}
          </button>

          <button
            type="button"
            onClick={onSubmitSpecial}
            disabled={loading || plan === 'pro'}
            className="w-full py-3 bg-linear-to-r from-amber-600 to-orange-700 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && codeType === 'special' ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                در حال پردازش...
              </span>
            ) : (
              'پرداخت و ثبت نام با کد ویژه'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}