// frontend/adfinder/app/business-register/plans/components/PeriodSelector.tsx
'use client';

import React from 'react';
import { Calendar, Lock } from 'lucide-react';
import { Period } from '../data';

interface PeriodSelectorProps {
  periods: Period[];
  selectedPeriod: string;
  onSelectPeriod: (periodId: string) => void;
}

export default function PeriodSelector({ 
  periods, 
  selectedPeriod, 
  onSelectPeriod 
}: PeriodSelectorProps) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-400" />
        انتخاب دوره اشتراک
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {periods.map(period => (
          <button
            key={period.id}
            onClick={() => !period.disabled && onSelectPeriod(period.id)}
            disabled={period.disabled}
            className={`p-3 rounded-lg border transition-all relative ${selectedPeriod === period.id
              ? 'bg-linear-to-r from-blue-600 to-indigo-700 border-blue-500'
              : period.disabled
              ? 'bg-slate-800/30 border-slate-800 cursor-not-allowed opacity-60'
              : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
          >
            {period.disabled && (
              <div className="absolute top-1 right-1">
                <Lock className="w-3 h-3 text-slate-500" />
              </div>
            )}
            <div className="text-center">
              <div className={`font-bold ${selectedPeriod === period.id ? 'text-white' : period.disabled ? 'text-slate-500' : 'text-slate-200'}`}>
                {period.name}
              </div>
              {period.discount > 0 && (
                <div className={`text-xs mt-1 ${period.disabled ? 'text-slate-600' : 'text-green-400'}`}>
                  {period.discount}% تخفیف
                </div>
              )}
              {period.disabled && (
                <div className="text-xs text-slate-500 mt-1">
                  غیرفعال
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      <p className="text-slate-400 text-sm mt-3">
        در حال حاضر فقط اشتراک ماهانه فعال است.
      </p>
    </div>
  );
}