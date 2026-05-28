'use client';

import { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, icon: Package, description: 'سفارش شما ثبت شد' },
  { id: 2, icon: Clock, description: 'در حال آماده‌سازی' },
  { id: 3, icon: Truck, description: 'بسته‌بندی شده' },
  { id: 4, icon: CheckCircle, description: 'تحویل نهایی' },
];

export default function OrderProgress() {
  const [orderNumber, setOrderNumber] = useState('');

  // فقط در کلاینت اجرا شود
  useEffect(() => {
    setOrderNumber(`#ORD-${Date.now().toString().slice(-6)}`);
  }, []);

  // وضعیت ثابت
  const currentStep = 2;
  const estimatedTime = "۳۰-۴۵ دقیقه";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border">
      {/* نوار پیشرفت */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-(--color-text-secondary)">
            مراحل آماده‌سازی سفارش
          </h2>
          <div className="text-sm text-(--color-accent-3) font-medium">
            زمان تقریبی: {estimatedTime}
          </div>
        </div>

        <div className="relative">
          {/* خط پیشرفت */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0" />
          <div
            className="absolute top-5 left-0 h-1 bg-(--color-accent) z-10"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {/* نقاط مراحل */}
          <div className="relative flex justify-between z-20">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep - 1;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 border-4 ${isCompleted
                    ? 'bg-(--color-accent-3) border-(--color-primary) text-white'
                    : isCurrent
                      ? 'bg-white border-(--color-accent) text-(--color-accent)'
                      : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-700 mt-1">
                    {step.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <hr /> <hr />

      {/* جزئیات سفارش */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-(--color-text-secondary) mb-2">
            جزئیات سفارش :
          </h3>
          <ul className="space-y-1 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">شماره سفارش:</span>
              <span className="font-medium">
                {orderNumber || 'در حال بارگذاری...'}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">تاریخ سفارش:</span>
              <span className="font-medium">۱۴۰۳/۰۲/۱۵</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
