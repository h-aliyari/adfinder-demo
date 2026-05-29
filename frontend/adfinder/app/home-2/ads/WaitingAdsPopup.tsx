// D:\adfinder\frontend\adfinder\app\home-2\ads\WaitingAdsPopup.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getAds, trackImpression, trackClick, trackClose } from "./services/api";

type WaitingAdType = {
  id: number;
  title: string;
  description: string;
  gradient: string;
  is_active?: boolean;
};

type WaitingAdProps = {
  autoInterval?: number;
  closeDelay?: number;
  maxVisible?: number;
};

export default function WaitingAdsPopup({
  autoInterval = 30000, // 30 ثانیه بین تبلیغات جدید
  closeDelay = 10000, // 10 ثانیه تاخیر بعد از بستن
  maxVisible = 3,
}: WaitingAdProps) {
  const [ads, setAds] = useState<WaitingAdType[]>([]);
  const [visibleAds, setVisibleAds] = useState<number[]>([]);
  const [impressionIds, setImpressionIds] = useState<Record<number, string>>({});
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [closedAds, setClosedAds] = useState<Record<number, number>>({}); // زمان بستن هر تبلیغ

  const progressTimersRef = useRef<Record<number, NodeJS.Timeout>>({});
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const clearTimers = useCallback(() => {
    Object.values(progressTimersRef.current).forEach(timer => {
      clearInterval(timer);
    });
    progressTimersRef.current = {};

    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  // Start progress timer for an ad (10 ثانیه)
  const startProgressTimer = useCallback((adId: number) => {
    if (!mountedRef.current) return;

    if (progressTimersRef.current[adId]) {
      clearInterval(progressTimersRef.current[adId]);
    }

    let progressValue = 100;
    setProgress(prev => ({ ...prev, [adId]: progressValue }));

    progressTimersRef.current[adId] = setInterval(() => {
      if (!mountedRef.current) return;
      
      progressValue -= 2; // 10 ثانیه = 100% / 2% هر 0.2 ثانیه
      setProgress(prev => ({ ...prev, [adId]: progressValue }));

      if (progressValue <= 0) {
        clearInterval(progressTimersRef.current[adId]);
        delete progressTimersRef.current[adId];
        closeAd(adId, true); // بستن خودکار
      }
    }, 200); // هر 0.2 ثانیه
  }, []);

  // Close specific ad
  const closeAd = useCallback((adId: number, autoClose = false) => {
    if (!mountedRef.current) return;

    // Track close
    const impressionId = impressionIds[adId];
    trackClose(adId, impressionId);

    // Remove from visible ads
    setVisibleAds(prev => prev.filter(id => id !== adId));
    
    // Clear progress timer
    if (progressTimersRef.current[adId]) {
      clearInterval(progressTimersRef.current[adId]);
      delete progressTimersRef.current[adId];
    }

    // Record close time
    if (!autoClose) {
      setClosedAds(prev => ({ ...prev, [adId]: Date.now() }));
    }
  }, [impressionIds]);

  // Handle ad click
  const handleAdClick = useCallback(async (adId: number) => {
    const impressionId = impressionIds[adId];
    
    await trackClick(adId, impressionId);
    closeAd(adId);
  }, [impressionIds, closeAd]);

  // Check if ad can be shown again (after 10 seconds)
  const canShowAdAgain = useCallback((adId: number) => {
    const closeTime = closedAds[adId];
    if (!closeTime) return true;
    
    const timeSinceClose = Date.now() - closeTime;
    return timeSinceClose >= closeDelay;
  }, [closedAds, closeDelay]);

  // Load new ad
  const loadNewAd = useCallback(() => {
    if (!mountedRef.current || ads.length === 0) return;

    // Find available ads (not visible AND can be shown again)
    const availableAds = ads.filter(ad => 
      !visibleAds.includes(ad.id) && canShowAdAgain(ad.id)
    );
    
    if (availableAds.length === 0) {
      // No ads available, check again later
      autoTimerRef.current = setTimeout(() => {
        loadNewAd();
      }, 5000); // 5 ثانیه بعد دوباره چک کن
      return;
    }

    // Show new ad at the bottom
    const newAd = availableAds[0];
    const newVisibleAds = [...visibleAds, newAd.id].slice(-maxVisible);
    setVisibleAds(newVisibleAds);
    
    // Start progress timer
    startProgressTimer(newAd.id);

    // Track impression
    trackImpression(newAd.id).then(impressionId => {
      if (impressionId && mountedRef.current) {
        setImpressionIds(prev => ({
          ...prev,
          [newAd.id]: impressionId
        }));
      }
    });

    // Schedule next ad load
    autoTimerRef.current = setTimeout(() => {
      loadNewAd();
    }, autoInterval);
  }, [ads, visibleAds, canShowAdAgain, maxVisible, startProgressTimer, autoInterval]);

  // Initialize ads
  useEffect(() => {
    mountedRef.current = true;

    getAds().then((data) => {
      if (!mountedRef.current) return;

      // استفاده از دیتای home3 از api.ts
      const waitingAds = data.home3 || [];
      
      // فقط تبلیغات فعال
      const activeAds = waitingAds.filter(ad => ad.is_active !== false);
      
      setAds(activeAds);
      
      // Show first ads initially
      const initialAds = activeAds.slice(0, maxVisible).map(ad => ad.id);
      setVisibleAds(initialAds);
      initialAds.forEach(adId => startProgressTimer(adId));
    });

    return () => {
      mountedRef.current = false;
      clearTimers();
    };
  }, [clearTimers, startProgressTimer, maxVisible]);

  // Start auto loading
  useEffect(() => {
    if (ads.length > 0 && visibleAds.length < maxVisible) {
      loadNewAd();
    }

    return () => {
      if (autoTimerRef.current) {
        clearTimeout(autoTimerRef.current);
      }
    };
  }, [ads, visibleAds.length, maxVisible, loadNewAd]);

  // Get visible ad objects in correct order (برای نمایش از پایین)
  const visibleAdObjects = visibleAds
    .map(adId => ads.find(ad => ad.id === adId))
    .filter((ad): ad is WaitingAdType => ad !== undefined)
    .reverse(); // معکوس کردن برای نمایش از پایین

  if (visibleAdObjects.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "flex-end",
      }}
    >
      {visibleAdObjects.map((ad, index) => (
        <div
          key={ad.id}
          style={{
            width: "280px",
            padding: "15px 20px",
            borderRadius: "12px",
            background: ad.gradient,
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            animation: "slideUp 0.3s ease-out",
            animationDelay: `${index * 0.05}s`,
            animationFillMode: "both",
            position: "relative",
            overflow: "hidden",
            transform: `translateY(${index * 5}px)`,
          }}
        >
          <style jsx>{`
            @keyframes slideUp {
              from { 
                opacity: 0; 
                transform: translateY(10px) scale(0.98); 
              }
              to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
              }
            }
            
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; transform: translateY(-5px); }
            }
          `}</style>

          {/* Close button */}
          <button
            onClick={() => closeAd(ad.id)}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 300,
              cursor: "pointer",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "all 0.2s",
              zIndex: 2,
            }}
            aria-label="بستن تبلیغ"
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.25)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ×
          </button>

          {/* Ad content */}
          <div
            onClick={() => handleAdClick(ad.id)}
            style={{
              cursor: "pointer",
              color: "#fff",
              textDecoration: "none",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h3 style={{
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "4px",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              paddingRight: "20px",
            }}>
              {ad.title}
            </h3>
            
            <p style={{
              fontSize: "12px",
              opacity: 0.9,
              lineHeight: "1.3",
            }}>
              {ad.description}
            </p>
          </div>

          {/* Progress bar */}
          <div style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "3px",
            background: "rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}>
            <div
              style={{
                height: "100%",
                width: `${progress[ad.id] || 100}%`,
                background: "rgba(255,255,255,0.7)",
                transition: "width 0.2s linear",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}