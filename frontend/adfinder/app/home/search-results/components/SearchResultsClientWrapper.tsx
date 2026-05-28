'use client';

import { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchHeader from './SearchHeader';
import SearchFooter from './SearchFooter';

interface SearchResultsClientWrapperProps {
  children: ReactNode;
}

export default function SearchResultsClientWrapper({ children }: SearchResultsClientWrapperProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <>
      {/* هدر نتایج جستجو - زیر هدر اصلی */}
      <header className="sticky top-17 z-40 bg-background border-b border-border shadow-sm px-4 md:px-8 py-4">
        <SearchHeader query={query} />
      </header>

      {/* محتوای اصلی - بین دو هدر و دو فوتر */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-6">
          {children}
        </div>
      </main>

      {/* فوتر نتایج جستجو - بالای فوتر اصلی */}
      <footer className="sticky bottom-10 bg-background border-t border-border shadow-sm px-4 md:px-8 py-4">
        <SearchFooter />
      </footer>
    </>
  );
}
