// frontend\adfinder\app\home\search\SearchBox.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdvancedSearchPanel from './AdvancedSearchPanel';
import { SearchIcon, ChevronDownIcon, CloseIcon } from './SearchIcons';

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtersPanelRef = useRef<HTMLDivElement>(null);
  const filtersButtonRef = useRef<HTMLButtonElement>(null);

  // هندلر کلیک خارج از پنل
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showFilters &&
        filtersPanelRef.current &&
        !filtersPanelRef.current.contains(event.target as Node) &&
        filtersButtonRef.current &&
        !filtersButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && showFilters) {
        setShowFilters(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showFilters]);

  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    performSearch();
  }

  function performSearch() {
    const trimmedQuery = query.trim();
    const searchParams = new URLSearchParams();

    if (trimmedQuery) {
      searchParams.append('q', trimmedQuery);
    }
    if (selectedType) {
      searchParams.append('type', selectedType);
    }
    if (selectedProvince) {
      searchParams.append('province', selectedProvince);
    }

    const queryString = searchParams.toString();
    if (queryString) {
      router.push(`/home/search-results?${queryString}`);
    } else {
      router.push('/home/search-results');
    }

    setShowFilters(false);
  }

  const hasActiveFilters = selectedType || selectedProvince;

  return (
    <section className="mb-6 max-w-2xl mx-auto">
      <form onSubmit={onSubmitSearch} className="space-y-3">
        {/* بخش اصلی سرچ */}
        <div className="flex items-center gap-2 bg-primary border-4 border-(--color-accent) rounded-4xl p-1">
          {/* فیلد جستجو */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="نام یا کد کسب و کار ...."
            className="flex-1 h-10 bg-transparent outline-none text-primary placeholder:text-secondary text-sm px-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                performSearch();
              }
            }}
          />

          {/* دکمه‌های اکشن */}
          <div className="flex items-center gap-1">
            {/* دکمه جستجو */}
            <button
              type="submit"
              disabled={!query.trim() && !selectedType && !selectedProvince}
              className="h-13 w-13 text-(color-accent) rounded-xl hover:opacity-90 transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              title="جستجو"
            >
              <SearchIcon size={28} className="text-white" />
            </button>

            {/* دکمه نمایش فیلترها */}
            <button
              ref={filtersButtonRef}
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-8 px-3 rounded-xl flex items-center gap-1.5 text-sm font-medium transition-colors ${showFilters || hasActiveFilters
                ? 'bg-(--color-accent)/20'
                : 'hover:bg-(--color-accent)/10'
                }`}
            >
              <span
                className={`${showFilters || hasActiveFilters
                  ? 'text-secondary'
                  : 'text-primary'
                  }`}
              >
                سرچ پیشرفته
              </span>
              <ChevronDownIcon
                className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''
                  } ${showFilters || hasActiveFilters ? 'text-secondary' : 'text-primary'
                  }`}
              />
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-(--color-accent) rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* پنل فیلترهای کشویی */}
        <AdvancedSearchPanel
          query={query}
          selectedType={selectedType}
          selectedProvince={selectedProvince}
          onQueryChange={setQuery}
          onTypeChange={setSelectedType}
          onProvinceChange={setSelectedProvince}
          onClearType={() => setSelectedType('')}
          onClearProvince={() => setSelectedProvince('')}
          onSearch={performSearch}
          onClose={() => setShowFilters(false)}
          showPanel={showFilters}
          panelRef={filtersPanelRef}
          buttonRef={filtersButtonRef}
        />

        {/* نمایش فیلترهای فعال (زمانی که پنل بسته است) */}
        {!showFilters && hasActiveFilters && (
          <div className="flex flex-wrap gap-2 animate-fadeIn">
            {selectedType && (
              <span className="inline-flex items-center gap-1.5 bg-(--color-accent)/20 text-(--color-accent) px-3 py-1.5 rounded-xl text-xs">
                نوع: {selectedType}
                <button
                  type="button"
                  onClick={() => setSelectedType('')}
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
                  onClick={() => setSelectedProvince('')}
                  className="hover:text-red-500 transition-colors"
                >
                  <CloseIcon />
                </button>
              </span>
            )}
          </div>
        )}
      </form>

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
      `}</style>
    </section>
  );
}