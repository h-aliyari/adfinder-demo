// frontend/adfinder/app/home/page.tsx
'use client';

import SearchBox from './search/SearchBox';

import HomeAds0 from './ads/HomeAds-0';
import HomeAds1 from './ads/HomeAds-1';
import HomeAds2 from './ads/HomeAds-2';
import PopupAd from "./ads/PopupAd";
import BottomAd from "./ads/BottomAd";

export default function HomePage() {
  return (
    <div className="w-full">
      <HomeAds0 />

      <main className="mx-auto max-w-6xl px-4 py-2">
        {/* Search + HomeAds1 */}
        <div className="flex flex-col lg:flex-row gap-15">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-lg font-semibold animate-bounce text-(--color-secondary)">
              اینجا سرچ کن 👇🏻
            </p>
            <div className="w-full max-w-md mt-4">
              <SearchBox />
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center overflow-hidden">
            <div className="w-full max-w-full lg:max-w-130">
              <HomeAds1 />
            </div>
          </div>
        </div>

        <HomeAds2 />

        <PopupAd />

        <BottomAd
          autoInterval={15000}
          closeDelay={10000}
        />
      </main>
    </div>
  );
}
