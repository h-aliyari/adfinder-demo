// D:\adfinder\frontend\adfinder\app\home\ads\PopupAd.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { getAds } from "./services/api";

type PopupAdType = {
  text: string;
  url: string;
  textColor: string;
  background: string;
};

export default function PopupAd() {
  const [ad, setAd] = useState<PopupAdType | null>(null);
  const [visible, setVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAds().then((data) => setAd(data.popup));
  }, []);

  // نمایش با تاخیر
  useEffect(() => {
    if (!ad) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [ad]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (popupRef.current && popupRef.current.contains(e.target as Node)) {
      return;
    }
    setVisible(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisible(false);
      }
    };

    if (visible) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [visible]);

  if (!ad) return null;

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: visible ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: visible ? 9999 : -1,
        cursor: "pointer",
        transition: "background 0.4s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        ref={popupRef}
        style={{
          position: "relative",
          minWidth: "360px",
          maxWidth: "92vw",
          padding: "28px 34px",
          borderRadius: "20px",
          background: ad.background,
          boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
          cursor: "default",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.92)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <button
          onClick={() => setVisible(false)}
          style={{
            position: "absolute",
            top: "1px",
            right: "1px",
            background: "transparent",
            border: "none",
            color: "#000",
            fontSize: "24px",
            fontWeight: 700,
            cursor: "pointer",
            padding: "8px 12px",
            zIndex: 1,
          }}
          aria-label="بستن پاپ‌آپ"
        >
          ×
        </button>

        <a
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            display: "block",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              textAlign: "center",
              color: "#000",
            }}
          >
            {ad.text}
          </div>
        </a>
      </div>
    </div>
  );
}
