// app/home/business/[businessId]/ClientBusinessPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { Business } from '../services/types';
import { CustomPageData } from './types';
import { incrementViews } from '../services/api';

// کامپوننت‌ها
// import LoadingErrorNotFound from './components/LoadingErrorNotFound';
import Header from './components/Header';
import BusinessHeader from './components/BusinessHeader';
import TabsSection from './components/TabsSection';
import ProPlanBanner from './components/ProPlanBanner';

interface ClientBusinessPageProps {
  initialBusiness: Business;
  initialCustomPageData: CustomPageData;
}

export default function ClientBusinessPage({
  initialBusiness,
  initialCustomPageData,
}: ClientBusinessPageProps) {
  const [business, setBusiness] = useState<Business>(initialBusiness);
  const [customPageData, setCustomPageData] = useState<CustomPageData>(initialCustomPageData);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'custom'>('info');
  const [loading, setLoading] = useState(false);

  const handleSaveBusiness = () => {
    setSaved(!saved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business?.name || 'کسب‌وکار',
        text: `مشاهده ${business?.name} در AdFinder`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('لینک کپی شد!');
    }
  };

  const handleOpenMap = () => {
    const address = customPageData?.address || business?.address;
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-300 to-background">
      <Header saved={saved} onSave={handleSaveBusiness} onShare={handleShare} />

      <main className="container mx-auto px-4 py-8">
        <BusinessHeader business={business} customPageData={customPageData} />

        {customPageData && (
          <TabsSection
            business={business}
            customPageData={customPageData}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenMap={handleOpenMap}
          />
        )}

        <ProPlanBanner plan={business.plan} />
      </main>
    </div>
  );
}