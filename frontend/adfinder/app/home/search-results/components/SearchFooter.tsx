// app/search-results/layout/SearchFooter.tsx
'use client';

import Link from 'next/link';

export default function SearchFooter() {
  return (
    <footer className="mt-1 border-border text-center text-primary text-sm">
      <p>پلتفرم تبلیغ‌ آنلاین </p>
      <p className="mt-1">
        <Link href="/" className="text-accent hover:underline">
          بازگشت به صفحه اصلی
        </Link>
      </p>
    </footer>
  );
}