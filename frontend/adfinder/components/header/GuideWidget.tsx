// frontend/adfinder/components/header/GuideWidget.tsx
'use client';

import { useRef, useEffect } from 'react';

interface GuideWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideWidget({ isOpen, onClose }: GuideWidgetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // کلیک فقط روی overlay -> بسته شود
    if (overlayRef.current && overlayRef.current === e.target) onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // جلوگیری از اسکرول صفحه
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = prevOverflow || 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-70 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClick}
      role="dialog"
      aria-modal="true"
      aria-label="راهنمای سایت"
    >
      <div
        ref={widgetRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
      >
        {/* هدر */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-secondary">راهنمای سایت</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="بستن راهنما"
          >
            ✕
          </button>
        </div>

        {/* محتوا */}
        <div className="p-6">
          <div className="space-y-3">

            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 text-purple-600 font-semibold">
                  1
                </span>
                <p className="font-semibold text-gray-800">صفحه اختصاصی</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                صفحه اختصاصی خود را داشته باشید
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 font-semibold">
                  2
                </span>
                <p className="font-semibold text-gray-800">دسترسی و مدیریت</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                بخش‌های مربوط به پروفایل/اطلاعات را از منوی همبرگری انتخاب کنید.
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-semibold">
                  3
                </span>
                <p className="font-semibold text-gray-800">صفحه داشبورد</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                بعد از ثبت نام و لاگین از صفحه داشبورد می‌توانید وضعیت کلی کسب‌وکار، آمار و وضعیت اشتراک را ببینید. و محتوای صفحه خود را به روز کنید
              </p>
            </div>

          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 rounded-xl bg-secondary text-white font-medium hover:opacity-95 transition-opacity"
            >
              متوجه شدم
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
