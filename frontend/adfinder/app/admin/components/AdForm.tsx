// frontend/adfinder/app/admin/components/AdForm.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import {
  type PopupAd,
  type BottomAd,
  type HomeAd,
  type Home1Ad,
  type Home2Ad,
  type AdsResponse,
} from '../services/api';

type AdType = 'popup' | 'bottom' | 'home' | 'home1' | 'home2';

interface AdFormProps {
  ad: PopupAd | BottomAd | HomeAd | Home1Ad | Home2Ad;
  type: AdType;
  onChange: (field: string, value: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

const AdForm = ({ ad, type, onChange, onSave, isSaving }: AdFormProps) => {
  const [localAd, setLocalAd] = useState(ad);

  useEffect(() => {
    setLocalAd(ad);
  }, [ad]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalAd((prev) => ({ ...prev, [name]: value }));
    onChange(name, value);
  };

  const renderFormFields = () => {
    switch (type) {
      case 'popup':
      case 'bottom':
        return (
          <>
            <input
              name="text"
              placeholder="متن"
              value={(localAd as PopupAd).text}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              name="url"
              placeholder="لینک"
              value={(localAd as PopupAd).url}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              name="textColor"
              placeholder="رنگ متن (مثال: #FFFFFF)"
              value={(localAd as PopupAd).textColor}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              name="background"
              placeholder="پس‌زمینه (مثال: linear-gradient(...))"
              value={(localAd as PopupAd).background}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
          </>
        );
      case 'home':
        return (
          <>
            <input
              name="text"
              placeholder="متن"
              value={(localAd as HomeAd).text}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              name="background"
              placeholder="پس‌زمینه"
              value={(localAd as HomeAd).background}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
          </>
        );
      case 'home1':
        return (
          <>
            <input
              name="title"
              placeholder="عنوان"
              value={(localAd as Home1Ad).title}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              name="subtitle"
              placeholder="عنوان فرعی"
              value={(localAd as Home1Ad).subtitle}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <textarea
              name="description"
              placeholder="توضیحات"
              value={(localAd as Home1Ad).description}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
              rows={3}
            />
            <input
              name="gradient"
              placeholder="گرادیانت"
              value={(localAd as Home1Ad).gradient}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
          </>
        );
      case 'home2':
        return (
          <>
            <input
              name="title"
              placeholder="عنوان"
              value={(localAd as Home2Ad).title}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <textarea
              name="desc"
              placeholder="توضیحات"
              value={(localAd as Home2Ad).desc}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
              rows={3}
            />
            <input
              name="url"
              placeholder="لینک"
              value={(localAd as Home2Ad).url}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              name="img"
              placeholder="آدرس تصویر"
              value={(localAd as Home2Ad).img}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-gray-50 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderFormFields()}
      <div className="md:col-span-2 flex justify-end">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold disabled:opacity-50"
        >
          {isSaving ? 'ذخیره...' : 'ذخیره این مورد'}
        </button>
      </div>
    </div>
  );
};

export default AdForm;
