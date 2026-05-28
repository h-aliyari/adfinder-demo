// app/search-results/components/SearchStates.tsx
'use client';

interface NoResultsStateProps {
  query?: string;
  type?: string;
  province?: string;
}

export function LoadingState() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        <span className="mr-3">در حال جستجو...</span>
      </div>
    </div>
  );
}

export function ErrorState({ error }: { error: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-2">⚠️</div>
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-accent text-white rounded-full hover:opacity-90 transition"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}

export function NoResultsState({ query = '', type = '', province = '' }: NoResultsStateProps) {
  // ساختن پیام بر اساس فیلترهای فعال
  const getFilterMessage = () => {
    const filters = [];
    
    if (query) filters.push(`"${query}"`);
    if (type) filters.push(`نوع: ${type}`);
    if (province) filters.push(`استان: ${province}`);
    
    if (filters.length === 0) {
      return "کسب و کاری پیدا نشد";
    }
    
    return `کسب و کاری پیدا نشد`;
  };

  // لیست فیلترهای فعال
  const activeFilters = [];
  if (query) activeFilters.push(`کلمه: "${query}"`);
  if (type) activeFilters.push(`نوع: ${type}`);
  if (province) activeFilters.push(`استان: ${province}`);

  return (
    <div className="bg-white/30 backdrop-blur-sm border border-gray/80 rounded-2xl p-6 shadow-lg">
      <div className="text-center py-12">
        <div className="text-5xl mb-6">🔍</div>
        <h3 className="text-xl font-semibold mb-4">{getFilterMessage()}</h3>
        
        {/* نمایش فیلترهای فعال */}
        {activeFilters.length > 0 && (
          <div className="mb-6">
            <p className="text-primary mb-2">فیلترهای اعمال شده:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {activeFilters.map((filter, index) => (
                <span 
                  key={index}
                  className="inline-block bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
        )}        
      </div>
    </div>
  );
}

// کامپوننت اصلی برای مدیریت همه وضعیت‌ها
interface SearchStatesProps {
  loading?: boolean;
  error?: string | null;
  noResults?: boolean;
  query?: string;
  type?: string;
  province?: string;
}

export default function SearchStates({
  loading = false,
  error = null,
  noResults = false,
  query = '',
  type = '',
  province = ''
}: SearchStatesProps) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (noResults) return <NoResultsState query={query} type={type} province={province} />;
  return null;
}