// D:\adfinder\frontend\adfinder\app\home\ads\BottomAd.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getAds } from "./services/api";
import { trackImpression, trackClick } from "./services/tracking";

type BottomAdType = {
  id: number;
  text: string;
  url: string;
  textColor: string;
  background: string;
  is_active?: boolean;
};

type BottomAdProps = {
  autoInterval?: number;
  closeDelay?: number;
};

export default function BottomAd({
  autoInterval = 15000,
  closeDelay = 10000,
}: BottomAdProps) {
  const [ads, setAds] = useState<BottomAdType[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [impressionIds, setImpressionIds] = useState<Record<number, string>>({});

  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const setupAutoTimer = useCallback(() => {
    clearTimers();
    
    if (ads.length > 1 && visible) {
      autoTimerRef.current = setTimeout(() => {
        setCurrentAdIndex(prev => (prev + 1) % ads.length);
      }, autoInterval);
    }
  }, [ads.length, autoInterval, visible, clearTimers]);

  const handleClose = useCallback(() => {
    setVisible(false);
    clearTimers();

    closeTimerRef.current = setTimeout(() => {
      if (ads.length > 0) {
        setCurrentAdIndex(prev => (prev + 1) % ads.length);
        setVisible(true);
      }
    }, closeDelay);
  }, [ads.length, closeDelay, clearTimers]);

  // ردیابی بازدید وقتی تبلیغ نمایش داده می‌شه
  useEffect(() => {
    if (visible && ads.length > 0) {
      const currentAd = ads[currentAdIndex];
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
  }, [visible, currentAdIndex, ads, impressionIds]);

  // ردیابی کلیک
  const handleAdClick = useCallback(async (adId: number, url: string) => {
    const impressionId = impressionIds[adId];
    
    // ابتدا کلیک رو ثبت کن
    await trackClick(adId, impressionId);
    
    // سپس کاربر رو به لینک هدایت کن
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [impressionIds]);

  useEffect(() => {
    getAds().then((data) => {
      let bottomAds: BottomAdType[] = [];
      
      if (Array.isArray(data.bottom)) {
        bottomAds = data.bottom.filter(ad => ad.is_active !== false);
      } else if (data.bottom && data.bottom.is_active !== false) {
        bottomAds = [data.bottom];
      }
      
      setAds(bottomAds);
    });

    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (visible && ads.length > 0) {
      setupAutoTimer();
    }
  }, [currentAdIndex, visible, ads.length, setupAutoTimer]);

  const currentAd = ads[currentAdIndex];

  if (!currentAd || !visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9998,
        minWidth: "380px",
        maxWidth: "92vw",
        padding: "22px 30px",
        borderRadius: "18px",
        background: currentAd.background,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "8px",
          right: "12px",
          background: "transparent",
          border: "none",
          color: "rgba(0,0,0,0.7)",
          fontSize: "20px",
          fontWeight: 400,
          cursor: "pointer",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          transition: "all 0.2s",
        }}
        aria-label="بستن تبلیغ"
        onMouseOver={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.1)";
          e.currentTarget.style.color = "#000";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(0,0,0,0.7)";
        }}
      >
        ×
      </button>

      <div
        onClick={() => handleAdClick(currentAd.id, currentAd.url)}
        style={{
          textDecoration: "none",
          display: "block",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            textAlign: "center",
            color: currentAd.textColor || "#000",
            paddingRight: "10px",
            whiteSpace: "pre-line",
            lineHeight: "1.4", 
          }}
        >
          {currentAd.text}
        </div>
      </div>
    </div>
  );
}