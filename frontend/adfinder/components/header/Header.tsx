// frontend/adfinder/components/header/Header.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MenuIcon, SideWidget } from './SideWidget';
import GuideWidget from './GuideWidget';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const pathname = usePathname();

  const isHomeActive = pathname === '/home' || pathname === '/home/';
  const isQueueActive = pathname === '/home-2' || pathname === '/home-2/';

  const toggleMenu = () => setIsMenuOpen(v => !v);
  const closeMenu = () => setIsMenuOpen(false);
  const openGuide = () => setIsGuideOpen(true);
  const closeGuide = () => setIsGuideOpen(false);

  useEffect(() => closeMenu(), [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 py-2 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* منوی همبرگر - سمت راست */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md bg-(--color-accent) text-(--color-text-secondary)"
            aria-label="Open menu"
          >
            <MenuIcon isOpen={isMenuOpen} />
          </button>

          {/* سوییچر وسط */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <nav>
              {isHomeActive ? (
                <Link
                  href="/home-2"
                  className="inline-flex items-center px-17 py-3 rounded-3xl text-lg font-semibold tracking-wide transition-all duration-300 hover:opacity-90 whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(to right, var(--color-accent-3), var(--color-secondary))',
                    color: 'white'
                  }}
                >
                  نوبت آنلاین &gt;
                </Link>
              ) : isQueueActive ? (
                <Link
                  href="/home"
                  className="inline-flex items-center px-17 py-3 rounded-3xl text-lg font-semibold tracking-wide transition-all duration-300 hover:opacity-90 whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(to right, var(--color-secondary), var(--color-accent-3))',
                    color: 'white'
                  }}
                >
                  تبلیغ آنلاین &gt;
                </Link>
              ) : (
                <Link
                  href="/home"
                  className="inline-flex items-center px-17 py-3 rounded-3xl text-lg font-semibold tracking-wide transition-all duration-300 hover:opacity-90 whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(to right, var(--color-accent-3), var(--color-secondary))',
                    color: 'white'
                  }}
                >
                  نوبت آنلاین &gt;
                </Link>
              )}
            </nav>
          </div>

          {/* آیکون راهنما - سمت چپ */}
          <button
            onClick={openGuide}
            className="hover:opacity-80 transition-opacity"
            aria-label="باز کردن راهنمای سایت"
          >
            <div className="h-12 w-12 rounded-full bg-(--color-accent-2) flex items-center justify-center text-white font-bold text-lg">
              👋🏻
            </div>
          </button>
        </div>
      </header>

      <div className="h-19"></div>

      <SideWidget isOpen={isMenuOpen} onClose={closeMenu} />
      <GuideWidget isOpen={isGuideOpen} onClose={closeGuide} />

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={closeMenu}></div>
      )}
    </>
  );
}