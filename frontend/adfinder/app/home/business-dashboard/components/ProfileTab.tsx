'use client';
import React, { useState } from 'react';
import { 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  Edit, 
  Camera, 
  Users 
} from 'lucide-react';
import { BusinessInfo, ProfileField } from '../types';

interface ProfileTabProps {
  businessInfo: BusinessInfo;
  profileImage: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveProfile: (fieldId: string, value: string) => Promise<void>;
  saving: boolean;
}

export default function ProfileTab({ 
  businessInfo, 
  profileImage, 
  onImageUpload, 
  onSaveProfile,
  saving 
}: ProfileTabProps) {
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const getBusinessTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'food': 'رستوران و فست‌فود',
      'auto': 'خودرو',
      'shop': 'فروشگاه',
      'service': 'خدمات',
      'entertainment': 'تفریحی',
      'education': 'آموزشی',
      'tourism': 'گردشگری',
      'health': 'سلامتی',
      'tech': 'فناوری',
      'other': 'سایر'
    };
    return types[type] || type;
  };

  const profileFields: ProfileField[] = [
    {
      id: 'name',
      label: 'نام کسب‌وکار',
      value: businessInfo.name,
      icon: <Building className="w-4 h-4" />,
      editable: true,
      type: 'text'
    },
    {
      id: 'owner',
      label: 'نام صاحب',
      value: businessInfo.owner,
      icon: <User className="w-4 h-4" />,
      editable: true,
      type: 'text'
    },
    {
      id: 'phone',
      label: 'تلفن',
      value: businessInfo.phone,
      icon: <Phone className="w-4 h-4" />,
      editable: true,
      type: 'phone'
    },
    {
      id: 'email',
      label: 'ایمیل',
      value: businessInfo.email || 'ثبت نشده',
      icon: <Mail className="w-4 h-4" />,
      editable: true,
      type: 'email'
    },
    {
      id: 'businessType',
      label: 'نوع کسب‌وکار',
      value: getBusinessTypeLabel(businessInfo.businessType),
      icon: <Package className="w-4 h-4" />,
      editable: true,
      type: 'select',
      options: [
        'رستوران و فست‌فود',
        'خودرو',
        'فروشگاه',
        'خدمات',
        'تفریحی',
        'آموزشی',
        'گردشگری',
        'سلامتی',
        'فناوری',
        'سایر'
      ]
    },
    {
      id: 'address',
      label: 'آدرس',
      value: businessInfo.address || 'ثبت نشده',
      icon: <MapPin className="w-4 h-4" />,
      editable: true,
      type: 'textarea'
    }
  ];

  const handleStartEdit = (field: ProfileField) => {
    setEditingField(field.id);
    setEditValue(field.value);
  };

  const handleSave = async () => {
    if (editingField) {
      await onSaveProfile(editingField, editValue);
      setEditingField(null);
      setEditValue('');
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-6">ویرایش اطلاعات</h3>

      {/* آپلود عکس */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-slate-700">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Users className="w-12 h-12 text-white" />
              )}
            </div>
            <label
              htmlFor="profile-image-upload-main"
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors border-2 border-slate-900"
            >
              <Camera className="w-4 h-4" />
              <input
                id="profile-image-upload-main"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageUpload}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileFields.map((field) => (
          <div key={field.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              {field.icon}
              <label className="text-sm text-slate-400">{field.label}</label>
            </div>

            {editingField === field.id ? (
              <div className="space-y-3">
                {field.type === 'textarea' ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                    rows={3}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">انتخاب کنید...</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                  />
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                  >
                    {saving ? 'در حال ذخیره...' : 'ذخیره'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm"
                  >
                    لغو
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className={`font-medium ${field.value === 'ثبت نشده' ? 'text-slate-500' : 'text-white'}`}>
                  {field.value}
                </div>
                {field.editable && (
                  <button
                    onClick={() => handleStartEdit(field)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}