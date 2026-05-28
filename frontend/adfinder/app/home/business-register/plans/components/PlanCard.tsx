// frontend/adfinder/app/business-register/plans/components/PlanCard.tsx
'use client';

import React from 'react';
import { ChevronDown, Check, Sparkles, Zap } from 'lucide-react';
import { Plan } from '../data';

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />
};

interface PlanCardProps {
  plan: Plan;
  currentPeriod: string;
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export default function PlanCard({ 
  plan, 
  currentPeriod, 
  isExpanded, 
  onToggle, 
  children 
}: PlanCardProps) {
  const currentPrice = plan.basePrices[currentPeriod] || plan.basePrices.monthly;

  return (
    <div className={`bg-slate-800/30 rounded-xl border overflow-hidden relative ${plan.disabled ? 'border-slate-800 opacity-80' : 'border-slate-700/50'}`}>
      {plan.disabled && (
        <div className="absolute top-4 left-4 z-10">
          <div className="px-3 py-1 bg-slate-900/90 border border-slate-700 rounded-full text-xs text-slate-400 flex items-center gap-1">
            <span className="text-xs">🔒</span>
            {plan.disabledMessage}
          </div>
        </div>
      )}
      
      {/* هدر طرح */}
      <div
        className={`bg-linear-to-r ${plan.gradient} p-5 ${plan.disabled ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
        onClick={() => !plan.disabled && onToggle()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${plan.disabled ? 'bg-white/5' : 'bg-white/10'}`}>
              {iconMap[plan.icon]}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${plan.disabled ? 'text-white/80' : 'text-white'}`}>
                {plan.name}
                {plan.disabled && (
                  <span className="text-sm font-normal text-white/60 mr-2">
                    (غیرفعال)
                  </span>
                )}
              </h3>
              <p className={`text-sm ${plan.disabled ? 'text-white/60' : 'text-white/80'}`}>{plan.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={`text-2xl font-bold ${plan.disabled ? 'text-white/80' : 'text-white'}`}>
                {currentPrice.toLocaleString('fa-IR')} تومان
              </div>
              <div className={`text-sm ${plan.disabled ? 'text-white/50' : 'text-white/60'}`}>
                {currentPeriod === 'monthly' ? 'ماهانه' : 
                 currentPeriod === 'quarterly' ? 'سه‌ماهه' :
                 currentPeriod === 'semiannual' ? 'شش‌ماهه' : 'سالانه'}
              </div>
            </div>
            {!plan.disabled && (
              <ChevronDown className={`w-5 h-5 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            )}
          </div>
        </div>
      </div>

      {/* محتوای بازشونده */}
      {isExpanded && !plan.disabled && (
        <div className="p-5">
          <p className="text-slate-300 mb-4">{plan.description}</p>

          {/* ویژگی‌ها */}
          <div className="mb-6">
            <h4 className="text-white font-bold mb-3">ویژگی‌های اصلی:</h4>
            <ul className="space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {children}
        </div>
      )}
    </div>
  );
}