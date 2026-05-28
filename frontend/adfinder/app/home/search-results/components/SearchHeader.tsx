// app/search-results/components/SearchHeader.tsx
'use client';

import SearchBox from '../../../home/search/SearchBox';

interface SearchHeaderProps {
  query?: string;
}

export default function SearchHeader({ query = '' }: SearchHeaderProps) {
  return (
    <header>
      {/* جعبه جستجو */}
      <div className="max-w-2xl mx-auto">
        <SearchBox />
      </div>

      {/* نمایش عبارت جستجو شده */}
      {query && (
        <p className="text-center text-primary">
          نتایج برای : <span className="font-semibold text-accent">{query}</span>
        </p>
      )}
    </header>
  );
}