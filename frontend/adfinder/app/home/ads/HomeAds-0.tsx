// frontend\adfinder\app\ads\HomeAds-0.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { getAds } from "./services/api";
import { trackImpression, trackClick } from "./services/tracking";

type HomeAd = {
  id: number;
  text: string;
  background: string;
  url?: string;
};

export default function HomeAds0() {
  const [ads, setAds] = useState<HomeAd[]>([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [impressionIds, setImpressionIds] = useState<Record<number, string>>({});

  useEffect(() => {
    getAds().then((data) => {
      if (data.home && Array.isArray(data.home)) {
        setAds(data.home);
      }
    });
  }, []);

  // ردیابی بازدید برای تبلیغ فعلی
  useEffect(() => {
    if (ads.length > 0) {
      const currentAd = ads[index];
      if (currentAd && !impressionIds[currentAd.id]) {
        trackImpression(currentAd.id).then(impressionId => {
          if (impressionId) {
            setImpressionIds(prev => ({
              ...prev,
              [currentAd.id]: impressionId
            }));
          }
        });
      }
    }
  }, [index, ads, impressionIds]);

  // ردیابی کلیک
  const handleAdClick = useCallback(async (ad: HomeAd) => {
    if (!ad.url) return;
    
    const impressionId = impressionIds[ad.id];
    await trackClick(ad.id, impressionId);
    
    window.open(ad.url, '_blank', 'noopener,noreferrer');
  }, [impressionIds]);

  useEffect(() => {
    if (ads.length === 0) return;

    const t = setInterval(() => {
      setDirection("right");
      setIndex((i) => (i + 1) % ads.length);
    }, 4000);

    return () => clearInterval(t);
  }, [ads.length]);

  const next = () => {
    setDirection("right");
    setIndex((i) => (i + 1) % ads.length);
  };

  const prev = () => {
    setDirection("left");
    setIndex((i) => (i - 1 + ads.length) % ads.length);
  };

  if (ads.length === 0) {
    return (
      <div className="w-full h-20 mb-6 mt-3 rounded-lg animate-pulse bg-gray-300" />
    );
  }

  const currentAd = ads[index];

  return (
    <div className="relative w-full h-20 mb-6 mt-3 overflow-hidden rounded-lg">
      <div
        key={currentAd.id}
        className="absolute inset-0 transition-all duration-500 ease-in-out"
        style={{
          background: currentAd.background,
        }}
        onClick={() => handleAdClick(currentAd)}
      >
        <div className="w-full h-full flex items-center justify-center text-black text-sm font-semibold cursor-pointer">
          {currentAd.text}
        </div>
      </div>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-black px-2 py-1 rounded hover:bg-black/10 z-10"
        aria-label="next ad"
      >
        ‹
      </button>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-black px-2 py-1 rounded hover:bg-black/10 z-10"
        aria-label="previous ad"
      >
        ›
      </button>
    </div>
  );
}