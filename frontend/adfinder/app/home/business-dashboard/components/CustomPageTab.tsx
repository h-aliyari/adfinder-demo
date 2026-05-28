// D:\adfinder\frontend\adfinder\app\home\business-dashboard\components\CustomPageTab.tsx
'use client';
import React, { useState } from 'react';
import { ExternalLink, Link, MapPin, Map, Plus, X } from 'lucide-react';
import { CustomPageInfo, SocialLink } from '../types';
import { useRouter } from 'next/navigation';

interface CustomPageTabProps {
  customPageInfo: CustomPageInfo;
  onSaveCustomPage: () => Promise<void>;
  onSocialLinkAdd: (link: Omit<SocialLink, 'id'>) => void;
  onSocialLinkRemove: (id: string) => void;
  onSocialLinkUpdate: (id: string, updates: Partial<SocialLink>) => void;
  onAddressChange: (address: string) => void;
  saving: boolean;
  businessCode: string;

}

export default function CustomPageTab({
  customPageInfo,
  onSaveCustomPage,
  onSocialLinkAdd,
  onSocialLinkRemove,
  onSocialLinkUpdate,
  onAddressChange,
  saving,
  businessCode
}: CustomPageTabProps) {
  const router = useRouter(); 
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });

  const handleViewPage = () => {
    if (businessCode) {
      router.push(`/home/business/${businessCode}`);
    } else {
      alert('کد کسب‌وکار یافت نشد');
    }
  };

  const handleAddLink = () => {
    if (!newSocialLink.platform.trim() || !newSocialLink.url.trim()) {
      alert('لطفاً پلتفرم و آدرس را وارد کنید');
      return;
    }

    onSocialLinkAdd({
      platform: newSocialLink.platform.trim(),
      url: newSocialLink.url.trim()
    });

    setNewSocialLink({ platform: '', url: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">صفحه اختصاصی</h3>
        <button
          onClick={handleViewPage}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          مشاهده صفحه
        </button>
      </div>

      {/* لینک‌های اجتماعی */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Link className="w-5 h-5" />
          لینک‌های ارتباطی
        </h4>

        <div className="space-y-4">
          {/* اضافه کردن لینک جدید */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newSocialLink.platform}
              onChange={(e) => setNewSocialLink(prev => ({ ...prev, platform: e.target.value }))}
              placeholder="نام پلتفرم (مثلاً: وبسایت، تلگرام، اینستاگرام)"
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newSocialLink.url}
                onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder="آدرس لینک"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddLink}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* لیست لینک‌ها */}
          <div className="space-y-3">
            {customPageInfo.socialLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-white">{link.platform}</div>
                  <div className="text-sm text-slate-400 truncate">{link.url}</div>
                </div>
                <button
                  onClick={() => onSocialLinkRemove(link.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {customPageInfo.socialLinks.length === 0 && (
              <div className="text-center py-6 text-slate-500">
                هنوز لینکی اضافه نکرده‌اید
              </div>
            )}
          </div>
        </div>
      </div>

      {/* آدرس و نقشه */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-400" />
          آدرس و موقعیت
        </h4>

        <textarea
          value={customPageInfo.address || ''}
          onChange={(e) => onAddressChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 mb-4"
          rows={3}
          placeholder="آدرس کامل کسب‌وکار"
        />

        <div className="h-48 bg-slate-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Map className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400">نقشه به زودی فعال خواهد شد</p>
          </div>
        </div>
      </div>

      {/* دکمه ذخیره */}
      <div className="flex justify-end">
        <button
          onClick={onSaveCustomPage}
          disabled={saving}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          {saving ? 'در حال ذخیره...' : 'ذخیره اطلاعات صفحه'}
        </button>
      </div>
    </div>
  );
}