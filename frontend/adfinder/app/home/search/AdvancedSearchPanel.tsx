// frontend\adfinder\app\home\search\AdvancedSearchPanel.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchIcon, ChevronDownIcon, CloseIcon } from './SearchIcons';

// لیست استان‌های ایران
const PROVINCES = [
    'تهران', 'خراسان رضوی', 'اصفهان', 'فارس', 'خوزستان',
    'آذربایجان شرقی', 'مازندران', 'البرز', 'گیلان', 'کرمان',
    'آذربایجان غربی', 'قم', 'کردستان', 'هرمزگان', 'سیستان و بلوچستان',
    'لرستان', 'مرکزی', 'همدان', 'یزد', 'اردبیل',
    'زنجان', 'چهارمحال و بختیاری', 'کهگیلویه و بویراحمد', 'سمنان', 'ایلام',
    'گلستان', 'بوشهر', 'خراسان شمالی', 'خراسان جنوبی'
];

// لیست نوع‌های کسب‌وکار
const BUSINESS_TYPES = [
    'رستوران', 'فروشگاه', 'آرایشگاه', 'کلینیک', 'آموزشگاه',
    'تعمیرگاه', 'هتل', 'کافی‌شاپ', 'سوپرمارکت', 'داروخانه',
    'مطب', 'فروشگاه اینترنتی', 'خدماتی', 'تولیدی', 'پیمانکاری'
];

interface AdvancedSearchPanelProps {
    query: string;
    selectedType: string;
    selectedProvince: string;
    onQueryChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onProvinceChange: (value: string) => void;
    onClearType: () => void;
    onClearProvince: () => void;
    onSearch: () => void;
    onClose: () => void;
    showPanel: boolean;
    panelRef: React.RefObject<HTMLDivElement>;
    buttonRef?: React.RefObject<HTMLButtonElement>;
}

export default function AdvancedSearchPanel({
    query,
    selectedType,
    selectedProvince,
    onQueryChange,
    onTypeChange,
    onProvinceChange,
    onClearType,
    onClearProvince,
    onSearch,
    onClose,
    showPanel,
    panelRef,
    buttonRef
}: AdvancedSearchPanelProps) {
    const [localQuery, setLocalQuery] = useState(query);

    // همگام‌سازی query محلی با query اصلی
    useEffect(() => {
        setLocalQuery(query);
    }, [query]);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalQuery(value);
        onQueryChange(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    const hasActiveFilters = selectedType || selectedProvince;

    if (!showPanel) return null;

    return (
        <div
            ref={panelRef}
            className="bg-secondary rounded-2xl shadow-lg border border-(--color-accent) p-4 animate-fadeIn"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-primary">
                    فیلترهای پیشرفته
                </h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-secondary hover:text-primary transition-colors"
                >
                    <CloseIcon />
                </button>
            </div>

            {/* فیلد جستجو در پنل */}
            <div className="mb-4">
                <label className="text-xs font-medium text-secondary mb-2 block">
                    جستجوی متن
                </label>
                <input
                    value={localQuery}
                    onChange={handleQueryChange}
                    onKeyDown={handleKeyDown}
                    placeholder="نام یا کد کسب وکار ...."
                    className="w-full h-10 bg-primary border border-(--color-accent) rounded-xl px-3 outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-accent) transition-all text-sm text-primary"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* فیلتر نوع کسب‌وکار */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-secondary">
                        نوع کسب‌وکار
                    </label>
                    <div className="relative">
                        <select
                            value={selectedType}
                            onChange={(e) => onTypeChange(e.target.value)}
                            className="w-full h-10 bg-primary border border-(--color-accent) rounded-xl px-3 pr-8 outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-accent) transition-all text-sm text-primary appearance-none"
                        >
                            <option value="">همه نوع‌ها</option>
                            {BUSINESS_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-(--color-accent)">
                            <ChevronDownIcon />
                        </div>
                    </div>
                </div>

                {/* فیلتر استان */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-secondary">
                        استان
                    </label>
                    <div className="relative">
                        <select
                            value={selectedProvince}
                            onChange={(e) => onProvinceChange(e.target.value)}
                            className="w-full h-10 bg-primary border border-(--color-accent) rounded-xl px-3 pr-8 outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-accent) transition-all text-sm text-primary appearance-none"
                        >
                            <option value="">همه استان‌ها</option>
                            {PROVINCES.map((province) => (
                                <option key={province} value={province}>
                                    {province}
                                </option>
                            ))}
                        </select>
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-(--color-accent)">
                            <ChevronDownIcon />
                        </div>
                    </div>
                </div>
            </div>

            {/* دکمه جستجو در پنل */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onSearch}
                    disabled={!query.trim() && !selectedType && !selectedProvince}
                    className="h-10 px-4 text-black rounded-xl hover:opacity-90 transition flex items-center gap-2 disabled:cursor-not-allowed"
                >
                    <SearchIcon size={18} className="text-(--color-primary)" />
                    <span className="text-sm font-medium">جستجو</span>
                </button>
            </div>

            {/* نمایش فیلترهای فعال */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-(--color-accent)/30">
                    <div className="flex flex-wrap gap-2">
                        {selectedType && (
                            <span className="inline-flex items-center gap-1.5 bg-(--color-accent)/20 text-(--color-accent) px-3 py-1.5 rounded-xl text-xs">
                                نوع: {selectedType}
                                <button
                                    type="button"
                                    onClick={onClearType}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    <CloseIcon />
                                </button>
                            </span>
                        )}
                        {selectedProvince && (
                            <span className="inline-flex items-center gap-1.5 bg-(--color-accent)/10 text-(--color-accent) px-3 py-1.5 rounded-xl text-xs">
                                استان: {selectedProvince}
                                <button
                                    type="button"
                                    onClick={onClearProvince}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    <CloseIcon />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        select option {
          max-width: 280px;
          white-space: normal;
          word-wrap: break-word;
          padding: 8px 12px;
        }
      `}</style>
        </div>
    );
}