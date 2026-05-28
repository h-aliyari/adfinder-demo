import React from 'react';
import SearchResultsClientWrapper from './components/SearchResultsClientWrapper';

export default function SearchResultsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-primary flex flex-col">
      {/* اینجا کامپوننت Client که searchParams را مدیریت می‌کند، رندر می‌شود */}
      <SearchResultsClientWrapper>
        {children}
      </SearchResultsClientWrapper>
    </div>
  );
}
