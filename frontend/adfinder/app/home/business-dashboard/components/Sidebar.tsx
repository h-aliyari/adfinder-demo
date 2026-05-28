'use client';
import { Sparkles, User, Globe, Wallet } from 'lucide-react';

interface SidebarProps {
  activeTab: 'overview' | 'profile' | 'custom-page' | 'wallet';
  onTabChange: (tab: 'overview' | 'profile' | 'custom-page' | 'wallet') => void;
  onLogout: () => void;
}

interface TabData {
  key: 'overview' | 'profile' | 'custom-page' | 'wallet';
  label: string;
  icon: React.ComponentType<any>; // استفاده از React.ComponentType برای آیکون‌ها
}

const tabs: TabData[] = [
  { key: 'overview', label: 'داشبورد', icon: Sparkles },
  { key: 'profile', label: 'پروفایل', icon: User },
  { key: 'custom-page', label: 'صفحه اختصاصی', icon: Globe },
  { key: 'wallet', label: 'کیف پول', icon: Wallet },
];

export default function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {

  // تابع کمکی برای رندر کردن هر دکمه تب
  const renderTabButton = (tab: TabData, className: string) => {
    const Icon = tab.icon; // دسترسی به کامپوننت آیکون
    return (
      <button
        key={tab.key}
        onClick={() => onTabChange(tab.key)}
        className={`${className} ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{tab.label}</span>
      </button>
    );
  };

  return (
    <div className="w-full mb-6">
      {/* برای دسکتاپ - 4 تب وسط‌چین */}
      <div className="hidden md:flex justify-center gap-3">
        {tabs.map(tab => renderTabButton(tab, 'px-5 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 min-w-35 justify-center'))}
      </div>

      {/* برای موبایل - اسکرول افقی */}
      <div className="flex md:hidden overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 min-w-max">
          {tabs.map(tab => renderTabButton(tab, 'px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap'))}
        </div>
      </div>
    </div>
  );
}
