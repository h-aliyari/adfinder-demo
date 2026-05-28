// frontend/adfinder/app/admin/components/AdsTable.tsx
'use client';

import { type AdsResponse } from '../services/api';

interface AdsTableProps {
  ads: AdsResponse;
}

export default function AdsTable({ ads }: AdsTableProps) {
  // فعلاً فقط نمایش می‌دهیم. ویرایش بعداً اضافه می‌شود.
  // این یک نمایش ساده از داده‌ها است. می‌توانید جدول را بهبود ببخشید.
  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">لیست کامل تبلیغات</h2>
      
      {/* Popup Ad */}
      <div className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
        <h3 className="font-bold text-lg mb-3">تبلیغ Popup</h3>
        <p><span className="font-medium">متن:</span> {ads.popup.text}</p>
        <p><span className="font-medium">لینک:</span> {ads.popup.url}</p>
        <p><span className="font-medium">رنگ متن:</span> {ads.popup.textColor}</p>
        <p><span className="font-medium">پس‌زمینه:</span> {ads.popup.background}</p>
      </div>

      {/* Bottom Ad */}
      <div className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
        <h3 className="font-bold text-lg mb-3">تبلیغ Bottom</h3>
        <p><span className="font-medium">متن:</span> {ads.bottom.text}</p>
        <p><span className="font-medium">لینک:</span> {ads.bottom.url}</p>
        <p><span className="font-medium">رنگ متن:</span> {ads.bottom.textColor}</p>
        <p><span className="font-medium">پس‌زمینه:</span> {ads.bottom.background}</p>
      </div>

      {/* Home Ads */}
      <div className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
        <h3 className="font-bold text-lg mb-3">تبلیغات Home</h3>
        {ads.home.length > 0 ? (
          ads.home.map((ad, index) => (
            <div key={ad.id || index} className="mb-3 pb-2 border-b last:border-b-0">
              <p><span className="font-medium">متن:</span> {ad.text}</p>
              <p><span className="font-medium">پس‌زمینه:</span> {ad.background}</p>
            </div>
          ))
        ) : (
          <p>تبلیغ Home وجود ندارد.</p>
        )}
      </div>
      
      {/* Home1 Ads */}
      <div className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
        <h3 className="font-bold text-lg mb-3">تبلیغات Home1</h3>
        {ads.home1.length > 0 ? (
          ads.home1.map((ad, index) => (
            <div key={ad.id || index} className="mb-3 pb-2 border-b last:border-b-0">
              <p><span className="font-medium">عنوان:</span> {ad.title}</p>
              <p><span className="font-medium">عنوان فرعی:</span> {ad.subtitle}</p>
              <p><span className="font-medium">توضیحات:</span> {ad.description}</p>
              <p><span className="font-medium">گرادیانت:</span> {ad.gradient}</p>
            </div>
          ))
        ) : (
          <p>تبلیغ Home1 وجود ندارد.</p>
        )}
      </div>

      {/* Home2 Ads */}
      <div className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
        <h3 className="font-bold text-lg mb-3">تبلیغات Home2</h3>
        {ads.home2.length > 0 ? (
          ads.home2.map((ad, index) => (
            <div key={ad.id || index} className="mb-3 pb-2 border-b last:border-b-0">
              <p><span className="font-medium">عنوان:</span> {ad.title}</p>
              <p><span className="font-medium">توضیحات:</span> {ad.desc}</p>
              <p><span className="font-medium">لینک:</span> {ad.url}</p>
              <p><span className="font-medium">تصویر:</span> {ad.img}</p>
            </div>
          ))
        ) : (
          <p>تبلیغ Home2 وجود ندارد.</p>
        )}
      </div>

    </div>
  );
}
