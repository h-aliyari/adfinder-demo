// frontend/adfinder/components/header/SideWidget.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// کامپوننت آیکون همبرگر
function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {isOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
      )}
    </svg>
  );
}

function SideWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  if (!isOpen) return null;
  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-(--color-accent-3) text-white p-4 shadow-lg transform transition-transform duration-300 translate-x-0 z-50">
      <div className="flex justify-end">
        <button onClick={onClose} className="text-black focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <nav className="mt-4 flex flex-col space-y-4">
        <Link href="/home/business-register" className="transition duration-300" onClick={onClose}>
          ورود / ثبت نام کسب و کار
        </Link>
        <Link href="/home-2/login-register" className="transition duration-300" onClick={onClose}>
          ورود / ثبت نام مدیریت صف
        </Link>
        <Link href="/about" className="transition duration-300" onClick={onClose}>
          درباره ما
        </Link>
      </nav>
    </div>
  );
}

export { MenuIcon, SideWidget };
// export default SideWidget;