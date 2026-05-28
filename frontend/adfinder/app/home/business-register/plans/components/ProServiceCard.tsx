// frontend/adfinder/app/business-register/plans/components/ProServiceCard.tsx
'use client';

import React from 'react';
import { Check, Megaphone, Palette, Target, Home, BarChart, FileText } from 'lucide-react';
import { ProService } from '../data';

const iconMap: Record<string, React.ReactNode> = {
  Megaphone: <Megaphone className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Target: <Target className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  BarChart: <BarChart className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />
};

interface ProServiceCardProps {
  service: ProService;
  currentPeriod: string;
  onClick: () => void;
}

export default function ProServiceCard({ service, currentPeriod, onClick }: ProServiceCardProps) {
  const isAvailable = !service.isLimited || (service.remaining !== undefined && service.remaining > 0);
  const currentPrice = service.prices[currentPeriod] || service.prices.monthly;

  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-all relative ${service.isSelected
        ? 'border-purple-500 bg-purple-500/10'
        : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
        } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => isAvailable && onClick()}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded border flex items-center justify-center ${service.isSelected
            ? 'bg-purple-500 border-purple-500'
            : 'border-slate-600'
            }`}>
            {service.isSelected && <Check className="w-2.5 h-2.5 text-white" />}
          </div>
          <span className={`font-medium ${service.isSelected ? 'text-white' : 'text-slate-300'}`}>
            {service.name}
          </span>
        </div>
        <div className="p-1.5 bg-slate-700/50 rounded">
          {iconMap[service.icon]}
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-2 pr-6">{service.description}</p>

      <div className="flex justify-between items-center">
        <div>
          {service.isLimited && service.remaining !== undefined && (
            <span className="text-xs text-amber-400 bg-amber-900/20 px-2 py-0.5 rounded">
              {service.remaining} جایگاه باقی مانده
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-emerald-400">
          {currentPrice.toLocaleString('fa-IR')} تومان
        </span>
      </div>
    </div>
  );
}