// D:\adfinder\frontend\adfinder\app\home\business-dashboard\page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import OverviewTab from './components/OverviewTab';
import ProfileTab from './components/ProfileTab';
import CustomPageTab from './components/CustomPageTab';
import WalletTab from './components/WalletTab';

import {
  getBusinessDashboardInfo,
  getBusinessStats,
  updateBusinessProfile,
  logoutBusiness,
  BUSINESS_TYPES,
  getCustomPageInfo,
  saveCustomPageInfo,
  getBusinessCode
} from './services/api';
import { BusinessInfo, CustomPageInfo, SocialLink, Stats } from './types';

export default function BusinessDashboard() {
  const router = useRouter();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'custom-page' | 'wallet'>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<Stats>({ views: 0, searches: 0, saves: 0 });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [customPageInfo, setCustomPageInfo] = useState<CustomPageInfo>({
    socialLinks: [],
    address: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // بررسی اولیه لاگین
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('is_logged_in');
      const businessCode = localStorage.getItem('business_code');

      if (!isLoggedIn || !businessCode) {
        router.push('/home/business-register/login');
        return;
      }
    }

    loadDashboardData();
  }, []);


  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardInfo, statsData] = await Promise.all([
        getBusinessDashboardInfo(),
        getBusinessStats(),
        // getCustomPageInfo() // این خط جدید
      ]);

      setBusinessInfo(dashboardInfo);
      setStats(statsData);

      // عکس پروفایل
      if (dashboardInfo.profile_image) {
        setProfileImage(dashboardInfo.profile_image);
      }

      try {
        const customPageData = await getCustomPageInfo();
        setCustomPageInfo({
          socialLinks: customPageData.socialLinks || [],
          address: customPageData.address || '',
          workingHours: customPageData.workingHours || '',
          customDescription: customPageData.customDescription || '',
          specialOffers: customPageData.specialOffers || [],
          hasCustomPage: customPageData.hasCustomPage || false
        });
      } catch (error) {
        console.error('خطا در دریافت اطلاعات صفحه اختصاصی:', error);
        setCustomPageInfo({
          socialLinks: [],
          address: '',
          workingHours: '',
          customDescription: '',
          specialOffers: [],
          hasCustomPage: false
        });
      }

    } catch (error) {
      console.error('خطا در دریافت اطلاعات:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // و تابع handleSaveCustomPage را تغییر دهید:
  const handleSaveCustomPage = async () => {
    try {
      setSaving(true);

      const success = await saveCustomPageInfo(customPageInfo);

      if (success) {
        alert('اطلاعات صفحه اختصاصی ذخیره شد.');
        // رفرش اطلاعات صفحه اختصاصی
        try {
          const customPageData = await getCustomPageInfo();
          setCustomPageInfo({
            socialLinks: customPageData.socialLinks || [],
            address: customPageData.address || '',
            workingHours: customPageData.workingHours || '',
            customDescription: customPageData.customDescription || '',
            specialOffers: customPageData.specialOffers || [],
            hasCustomPage: customPageData.hasCustomPage || false
          });
        } catch (error) {
          console.error('خطا در رفرش اطلاعات:', error);
        }
      }
    } catch (error: any) {
      alert(`خطا: ${error.message || 'خطا در ذخیره اطلاعات'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: ارسال به سرور
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (fieldId: string, value: string) => {
    if (!businessInfo) return;

    try {
      setSaving(true);

      let valueToSave = value;
      if (fieldId === 'businessType') {
        const englishTypes: Record<string, string> = {
          'رستوران و فست‌فود': 'food',
          'خودرو': 'auto',
          'فروشگاه': 'shop',
          'خدمات': 'service',
          'تفریحی': 'entertainment',
          'آموزشی': 'education',
          'گردشگری': 'tourism',
          'سلامتی': 'health',
          'فناوری': 'tech',
          'سایر': 'other'
        };
        valueToSave = englishTypes[value] || value;
      }

      const updateData = { [fieldId]: valueToSave };
      const success = await updateBusinessProfile(updateData);

      if (success) {
        setBusinessInfo(prev => prev ? { ...prev, [fieldId]: valueToSave } : null);
        alert('تغییرات ذخیره شد.');
      }
    } catch (error: any) {
      alert(`خطا: ${error.message || 'خطای ناشناخته'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSocialLinkAdd = (link: Omit<SocialLink, 'id'>) => {
    const newLink = {
      ...link,
      id: Date.now().toString()
    };

    setCustomPageInfo(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink]
    }));
  };

  const handleSocialLinkRemove = (id: string) => {
    setCustomPageInfo(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  };

  const handleSocialLinkUpdate = (id: string, updates: Partial<SocialLink>) => {
    setCustomPageInfo(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link =>
        link.id === id ? { ...link, ...updates } : link
      )
    }));
  };

  const handleAddressChange = (address: string) => {
    setCustomPageInfo(prev => ({
      ...prev,
      address
    }));
  };

  const handleRenewSubscription = () => {
    alert('صفحه تمدید اشتراک به زودی فعال خواهد شد');
  };

  const handleUpgradeSubscription = () => {
    alert('صفحه ارتقا اشتراک به زودی فعال خواهد شد');
  };

  const handleBackToMain = () => {
    localStorage.removeItem('business_code');
    localStorage.removeItem('is_logged_in');
    router.push('/home/business-register');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!businessInfo) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-slate-400">خطا در دریافت اطلاعات</p>
          <button
            onClick={() => router.push('/business-register/login')}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            بازگشت به صفحه ورود
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-950 text-white">
      <Header
        businessInfo={businessInfo}
        profileImage={profileImage}
        onImageUpload={handleImageUpload}
        onBack={handleBackToMain}
      />

      <div className="container mx-auto px-4 py-4">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={() => { }} // خالی می‌ذاریم چون دکمه خروج حذف شده
        />

        <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <OverviewTab
                businessInfo={businessInfo}
                stats={stats}
                onRenewSubscription={handleRenewSubscription}
                onUpgradeSubscription={handleUpgradeSubscription}
                businessCode={businessInfo.code} // یا هر property که کد کسب‌وکار را دارد
              />
            </div>
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              businessInfo={businessInfo}
              profileImage={profileImage}
              onImageUpload={handleImageUpload}
              onSaveProfile={handleSaveProfile}
              saving={saving}
            />
          )}

          {activeTab === 'custom-page' && (
            <CustomPageTab
              customPageInfo={customPageInfo}
              onSaveCustomPage={handleSaveCustomPage}
              onSocialLinkAdd={handleSocialLinkAdd}
              onSocialLinkRemove={handleSocialLinkRemove}
              onSocialLinkUpdate={handleSocialLinkUpdate}
              onAddressChange={handleAddressChange}
              saving={saving}
              businessCode={businessInfo.code}
            />
          )}

          {activeTab === 'wallet' && (
            <WalletTab businessCode={businessInfo.code} />
          )}
        </div>
      </div>
    </div>
  );
}