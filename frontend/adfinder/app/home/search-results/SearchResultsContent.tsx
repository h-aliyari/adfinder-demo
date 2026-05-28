// app/search-results/SearchResultsContent.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { searchBusinesses } from './services/api';
import { LoadingState, ErrorState, NoResultsState } from './components/SearchStates';
import BusinessCard from './components/BusinessCard';

// تعریف type برای Business
interface Business {
  id: number;
  name: string;
  owner: string;
  phone: string;
  email?: string;
  business_code: string;
  business_type: string;
  address?: string;
  description?: string;
  plan: string;
  status: string;
  created_at: string;
  views?: number;
  searches?: number;
  saves?: number;
  days_remaining?: number;
  expires_date?: string;
  profile_image?: string;
  social_links?: any[];
  custom_page_data?: Record<string, any>;
  province?: string;
}

export default function SearchResultsContent() {
  const searchParams = useSearchParams();

  const query = useMemo(() => searchParams.get('q') || '', [searchParams]);
  const type = useMemo(() => searchParams.get('type') || '', [searchParams]);
  const province = useMemo(() => searchParams.get('province') || '', [searchParams]);

  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchResults() {
      try {
        setLoading(true);
        setError(null);

        // اگر هیچ فیلتری نداریم، خالی برگردان
        if (!query && !type && !province) {
          setResults([]);
          setTotalCount(0);
          setLoading(false);
          return;
        }

        const response = await searchBusinesses({
          q: query,
          type: type || undefined,
          province: province || undefined,
        });

        if (ignore) return;
        setResults(response.results || []);
        setTotalCount(response.total || 0);
      } catch (err: any) {
        if (ignore) return;
        setError(err.message || 'خطا در دریافت نتایج جستجو');
      } finally {
        if (ignore) return;
        setLoading(false);
      }
    }

    fetchResults();
    return () => {
      ignore = true;
    };
  }, [query, type, province]);

  // نمایش فیلترهای فعال
  const activeFilters = useMemo(() => {
    const filters = [];
    if (query) filters.push(`کلمه: "${query}"`);
    if (type) filters.push(`نوع: ${type}`);
    if (province) filters.push(`استان: ${province}`);
    return filters;
  }, [query, type, province]);

  // اگر در حال بارگذاری هستیم
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  // اگر خطا داریم
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorState error={error} />
      </div>
    );
  }

  // اگر هیچ نتیجه‌ای نداریم
  if (results.length === 0) {
    // فقط زمانی که حداقل یک فیلتر داریم، NoResultsState رو نشون بدیم
    if (query || type || province) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <NoResultsState query={query} type={type} province={province} />
        </div>
      );
    }
    
    // اگر هیچ فیلتری نداریم، پیام پیش‌فرض
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white/30 backdrop-blur-sm border border-gray/80 rounded-2xl p-8 shadow-lg">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">برای جستجو، از صفحه اصلی شروع کنید</h3>
            <p className="mt-2 text-primary">
              می‌توانید نام، کد کسب‌وکار، نوع یا استان مورد نظر را جستجو کنید.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // نمایش نتایج
  return (
    <div className="space-y-6">
      {/* هدر نتایج */}
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-primary text-lg">
              <span className="font-semibold text-accent">{totalCount}</span> کسب‌وکار پیدا شد
            </p>
            {activeFilters.length > 0 && (
              <p className="text-sm text-primary mt-2">
                فیلترها: {activeFilters.join(' | ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* نتایج */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((business, index) => (
          <BusinessCard
            key={business.id || business.business_code || index}
            business={business}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}