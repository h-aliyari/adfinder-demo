// frontend/adfinder/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  getAdminAds,
  updateAdminAds,
  type AdsResponse,
} from './services/api';
import AdminSection from './components/AdminSection';

export default function AdminPage() {
  const [adsData, setAdsData] = useState<AdsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    async function loadAds() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminAds();
        setAdsData(data);
      } catch (err) {
        console.error('Failed to fetch ads:', err);
        setError('خطا در بارگذاری تبلیغات.');
      } finally {
        setLoading(false);
      }
    }
    loadAds();
  }, []);

  const handleOverallSave = async () => {
    if (!adsData) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await updateAdminAds(adsData);
      setAdsData(res); // آپدیت state با داده‌های بازگشتی از سرور
      setMessage('همه تغییرات با موفقیت ذخیره شد.');
    } catch (err) {
      console.error('Failed to save ads:', err);
      setError('خطا در ذخیره تبلیغات.');
      setMessage('خطا در ذخیره تبلیغات. لطفا دوباره تلاش کنید.');
    } finally {
      setSaving(false);
    }
  };

  // این تابع باید state `adsData` را از کامپوننت‌های فرزند (`AdminSection`) دریافت و آپدیت کند.
  const handleSectionDataChange = (updatedAdsData: AdsResponse) => {
    setAdsData(updatedAdsData);
  };

  if (loading) {
    return <div className="p-6 text-center">در حال بارگذاری تبلیغات...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!adsData) {
    return <div className="p-6 text-center">هیچ داده‌ای برای نمایش وجود ندارد.</div>;
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        مدیریت جامع تبلیغات
      </h1>

      {message && (
        <div className={`p-4 mb-6 rounded-lg ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <AdminSection
        title="تبلیغ Popup"
        type="popup"
        data={adsData.popup}
        onDataChange={handleSectionDataChange}
      />
      <AdminSection
        title="تبلیغ Bottom"
        type="bottom"
        data={adsData.bottom}
        onDataChange={handleSectionDataChange}
      />
      <AdminSection
        title="تبلیغات Home"
        type="home"
        data={adsData.home}
        onDataChange={handleSectionDataChange}
      />
      <AdminSection
        title="تبلیغات Home1"
        type="home1"
        data={adsData.home1}
        onDataChange={handleSectionDataChange}
      />
      <AdminSection
        title="تبلیغات Home2"
        type="home2"
        data={adsData.home2}
        onDataChange={handleSectionDataChange}
      />

      <div className="flex justify-center mt-10">
        <button
          onClick={handleOverallSave}
          disabled={saving}
          className="px-8 py-3 rounded-lg bg-green-600 text-white font-bold text-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {saving ? 'در حال ذخیره همه تغییرات...' : 'ذخیره همه تغییرات'}
        </button>
      </div>
    </main>
  );
}
