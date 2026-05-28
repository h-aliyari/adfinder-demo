// D:\adfinder\frontend\adfinder\app\business\[businessId]\components\Header.tsx
'use client';

import { Share2, Heart, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  saved: boolean;
  onSave: () => void;
  onShare: () => void;
}

export default function Header({ saved, onSave, onShare }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm sticky top-18 z-10"> {/* تغییر: top-[64px] */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>بازگشت</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onShare}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              title="اشتراک‌گذاری"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}