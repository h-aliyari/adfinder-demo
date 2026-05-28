'use client';
import React from 'react';
import { Building2, Users, Camera, ArrowLeft } from 'lucide-react';
import { BusinessInfo } from '../types';

interface HeaderProps {
  businessInfo: BusinessInfo;
  profileImage: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack?: () => void;
}

export default function Header({ 
  businessInfo, 
  profileImage, 
  onImageUpload, 
  onBack 
}: HeaderProps) {
  const getPlanLabel = (plan: string) => {
    const plans: Record<string, string> = {
      'normal': 'نرمال',
      'pro': 'پرو'
    };
    return plans[plan] || plan;
  };

  return (
    <>
      {/* Header اصلی جدید */}
      <header className="text-center mb-10 md:mb-16 pt-8">
        <div className="inline-flex items-center justify-center p-4 bg-linear-to-br from-blue-500/20 to-purple-600/20 rounded-2xl mb-6">
          <Building2 className="w-12 h-12 text-blue-400" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          داشبورد مدیریت
        </h1>
        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
          کد اختصاصی: {businessInfo.code}
        </p>
        
        {/* دکمه بازگشت */}
        {onBack && (
          <button
            onClick={onBack}
            className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت
          </button>
        )}
      </header>

      {/* Header اطلاعات کسب‌وکار */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm rounded-xl mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-slate-700">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-6 h-6 text-white" />
                  )}
                </div>
                <label
                  htmlFor="profile-image-upload"
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors border-2 border-slate-900"
                >
                  <Camera className="w-3 h-3" />
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onImageUpload}
                  />
                </label>
              </div>
              <div>
                <h1 className="text-xl font-bold">{businessInfo.name}</h1>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className={`px-3 py-1 rounded-full text-xs ${businessInfo.plan === 'pro' ? 'bg-linear-to-r from-purple-600 to-pink-600' : 'bg-blue-600'}`}>
                    {getPlanLabel(businessInfo.plan)}
                  </span>
                  <span>کد: {businessInfo.code}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}