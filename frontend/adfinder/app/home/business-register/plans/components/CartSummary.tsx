// frontend/adfinder/app/business-register/plans/components/CartSummary.tsx
'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { ProService } from '../data';
import ProServiceCard from './ProServiceCard';

interface CartSummaryProps {
  proServices: ProService[];
  currentPeriod: string;
  onServiceToggle: (serviceId: string) => void;
}

export default function CartSummary({ 
  proServices, 
  currentPeriod, 
  onServiceToggle 
}: CartSummaryProps) {
  const selectedServicesCount = proServices.filter(s => s.isSelected).length;
  const selectedServicesTotal = proServices
    .filter(s => s.isSelected)
    .reduce((sum, s) => sum + (s.prices[currentPeriod] || s.prices.monthly), 0);

  return (
    <div className="mt-6 pt-6 border-t border-slate-700/50">
      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-purple-400" />
        سبد خرید خدمات پرو (اختیاری)
      </h4>

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        {proServices.map(service => (
          <ProServiceCard
            key={service.id}
            service={service}
            currentPeriod={currentPeriod}
            onClick={() => onServiceToggle(service.id)}
          />
        ))}
      </div>

      {/* خلاصه انتخاب‌ها */}
      {selectedServicesCount > 0 && (
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">
              {selectedServicesCount} خدمت انتخاب شده
            </span>
            <span className="font-bold text-white">
              +{selectedServicesTotal.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        </div>
      )}
    </div>
  );
}