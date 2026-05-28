// D:\adfinder\frontend\adfinder\app\business\[businessId]\components\TabsSection.tsx
'use client';

import { Business } from '../../services/types';
import { CustomPageData } from '../types';
import InfoTab from './InfoTab';
import CustomTab from './CustomTab';

interface TabsSectionProps {
  business: Business;
  customPageData: CustomPageData | null;
  activeTab: 'info' | 'custom';
  onTabChange: (tab: 'info' | 'custom') => void;
  onOpenMap: () => void;
}

export default function TabsSection({
  business,
  customPageData,
  activeTab,
  onTabChange,
  onOpenMap
}: TabsSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* تب‌بار */}
      <div className="border-b">
        <nav className="flex">
          <button
            onClick={() => onTabChange('info')}
            className={`flex-1 px-6 py-4 font-medium text-center ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            اطلاعات
          </button>

          {customPageData?.hasCustomPage && (
            <button
              onClick={() => onTabChange('custom')}
              className={`flex-1 px-6 py-4 font-medium text-center ${activeTab === 'custom' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              صفحه اختصاصی
            </button>
          )}
        </nav>
      </div>

      {/* محتوای تب‌ها */}
      <div className="p-6">
        {activeTab === 'info' && customPageData && (
          <InfoTab 
            business={business} 
            customPageData={customPageData} 
            onOpenMap={onOpenMap} 
          />
        )}

        {activeTab === 'custom' && customPageData?.hasCustomPage && (
          <CustomTab customPageData={customPageData} />
        )}
      </div>
    </div>
  );
}