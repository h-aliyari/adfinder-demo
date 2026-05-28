// frontend\adfinder\app\home\search-results\page.tsx
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import SearchResultsContent from './SearchResultsContent';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">در حال بارگذاری...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
