'use client';

import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import AdForm from './AdForm';
import type {
  PopupAd,
  BottomAd,
  HomeAd,
  Home1Ad,
  Home2Ad,
  AdsResponse,
} from '../services/api';

type AdType = 'popup' | 'bottom' | 'home' | 'home1' | 'home2';

type SectionData =
  | PopupAd
  | BottomAd
  | HomeAd[]
  | Home1Ad[]
  | Home2Ad[];

interface AdminSectionProps {
  title: string;
  type: AdType;
  data: SectionData;
  onDataChange: Dispatch<SetStateAction<AdsResponse>>;
}

const AdminSection = ({ title, type, data, onDataChange }: AdminSectionProps) => {
  const [saving, setSaving] = useState(false);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const handleFieldChange = (
    index: number | null,
    field: string,
    value: string
  ) => {
    onDataChange((prevAdsResponse) => {
      const newAdsResponse = structuredClone(prevAdsResponse);

      if (type === 'popup') {
        (newAdsResponse.popup as any)[field] = value;
      } else if (type === 'bottom') {
        (newAdsResponse.bottom as any)[field] = value;
      } else if (Array.isArray(newAdsResponse[type])) {
        const list = newAdsResponse[type] as any[];
        if (index !== null && list[index]) {
          list[index][field] = value;
        }
      }

      return newAdsResponse;
    });
  };

  const handleSaveSection = async () => {
    setSaving(true);
    try {
      console.log(`Saving section ${title}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveItem = async (index: number) => {
    setSavingIndex(index);
    try {
      console.log(`Saving item ${index} in ${title}`);
    } finally {
      setSavingIndex(null);
    }
  };

  return (
    <section className="bg-white rounded-xl p-6 shadow-lg border mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">{title}</h2>

      {type === 'popup' || type === 'bottom' ? (
        <AdForm
          ad={data as PopupAd | BottomAd}
          type={type}
          onChange={(field, value) => handleFieldChange(null, field, value)}
          onSave={handleSaveSection}
          isSaving={saving}
        />
      ) : (
        (data as HomeAd[] | Home1Ad[] | Home2Ad[]).map((item, index) => (
          <AdForm
            key={item.id}
            ad={item}
            type={type}
            onChange={(field, value) => handleFieldChange(index, field, value)}
            onSave={() => handleSaveItem(index)}
            isSaving={savingIndex === index}
          />
        ))
      )}
    </section>
  );
};

export default AdminSection;
