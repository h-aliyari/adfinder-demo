// D:\adfinder\frontend\adfinder\app\home-2\user-waiting\components\OrderProgress.tsx
'use client';

import { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';
import { orderApi } from '../services/api';
import { OrderDetails } from '../types/order';

// نگاشت آیکون‌ها
const iconMap: Record<string, React.ComponentType<any>> = {
  Package,
  Clock,
  Truck,
  CheckCircle
};

export default function OrderProgress() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const orderData = await orderApi.getOrderDetails();
        setOrder(orderData);
        setError(null);
      } catch (err) {
        setError('خطا در دریافت اطلاعات سفارش');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  // محاسبه زمان تخمینی باقی‌مانده
  const calculateEstimatedTime = (orderData: OrderDetails | null): string => {
    if (!orderData) return '- دقیقه';
    
    const remainingTime = orderApi.calculateRemainingTime(orderData);
    return remainingTime > 0 ? `${remainingTime} دقیقه` : 'کمتر از 1 دقیقه';
  };

  // نمایش لودینگ
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border">
        <div className="animate-pulse space-y-4">
          {/* هدر لودینگ */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>

          {/* نوار پیشرفت لودینگ */}
          <div className="relative mb-6">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0"></div>
            <div className="relative flex justify-between z-20">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>

          {/* جزئیات لودینگ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // نمایش خطا
  if (error || !order) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4">{error || 'خطا در بارگذاری اطلاعات'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-(--color-accent) text-white rounded-lg hover:bg-(--color-accent)/90 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  const estimatedTime = calculateEstimatedTime(order);
  const currentStep = order.currentStep;

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
            className="absolute top-5 left-0 h-1 bg-(--color-accent) z-10 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (order.steps.length - 1)) * 100}%` }}
          />

          {/* نقاط مراحل */}
          <div className="relative flex justify-between z-20">
            {order.steps.map((step, index) => {
              const Icon = iconMap[step.icon] || Package;
              const isCompleted = step.isCompleted;
              const isCurrent = step.isCurrent;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 border-4 ${
                    isCompleted
                      ? 'bg-(--color-accent-3) border-(--color-primary) text-white'
                      : isCurrent
                        ? 'bg-white border-(--color-accent) text-(--color-accent)'
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-700 mt-1 text-center">
                    {step.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <hr className="my-4" />

      {/* جزئیات سفارش */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-(--color-text-secondary) mb-2">
            جزئیات سفارش :
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">شماره سفارش:</span>
              <span className="font-medium text-gray-800">{order.orderNumber}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">تاریخ سفارش:</span>
              <span className="font-medium text-gray-800">{order.orderDate}</span>
            </li>
          </ul>
        </div>

        {/* آیتم‌های سفارش */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-(--color-text-secondary) mb-2">
            اقلام سفارش :
          </h3>
          <div className="space-y-2 text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-1">
                <div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-xs text-gray-500 mr-2"> × {item.quantity}</span>
                </div>
                <span className="text-gray-800">
                  {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-300 mt-2">
              <div className="flex justify-between font-bold text-gray-800">
                <span>مجموع:</span>
                <span>
                  {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}