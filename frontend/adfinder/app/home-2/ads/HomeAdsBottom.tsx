'use client';

import { useEffect, useState, useCallback } from 'react';
import { getAds, trackImpression, trackClick } from './services/api';

const PLACEHOLDER_AD_IMAGE = '/placeholder-ad.png';

type Home2Ad = {
  id: number;
  title: string;
  desc: string;
  url: string;
  img: string;
};

export default function HomeAdsBottom() {
  const [otherAds, setOtherAds] = useState<Home2Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [impressionIds, setImpressionIds] = useState<Record<number, string>>({});

  useEffect(() => {
    let mounted = true;

    async function fetchAds() {
      try {
        const data = await getAds();
        const ads = Array.isArray(data.home2) ? data.home2 : [];

        if (mounted) {
          setOtherAds(
            ads.map((ad: any) => ({
              id: ad.id,
              title: ad.title ?? 'تبلیغ',
              desc: ad.desc ?? '---',
              url: ad.url ?? '#',
              img: ad.img ?? PLACEHOLDER_AD_IMAGE,
            }))
          );
        }
      } catch (error) {
        if (mounted) {
          setOtherAds([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAds();

    return () => {
      mounted = false;
    };
  }, []);

  // ردیابی بازدید
  useEffect(() => {
    otherAds.forEach(ad => {
      if (!impressionIds[ad.id]) {
        trackImpression(ad.id).then(impressionId => {
          if (impressionId) {
            setImpressionIds(prev => ({
              ...prev,
              [ad.id]: impressionId
            }));
          }
        });
      }
    });
  }, [otherAds, impressionIds]);

  // ردیابی کلیک
  const handleAdClick = useCallback(async (ad: Home2Ad, e: React.MouseEvent) => {
    e.preventDefault();
    
    const impressionId = impressionIds[ad.id];
    const clicked = await trackClick(ad.id, impressionId);
    
    if (clicked) {
      window.open(ad.url, '_blank', 'noopener,noreferrer');
    }
  }, [impressionIds]);

  if (loading) {
    return (
      <section>
        <h3 className="text-(--color-text-primary) font-bold text-xl mb-4">
          تبلیغ بیزنس‌ها :
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border h-32 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-10">
        {otherAds.map((ad) => (
          <article
            key={ad.id}
            className="bg-white rounded-xl border border-[#00000010] overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <a 
              href={ad.url} 
              className="block"
              onClick={(e) => handleAdClick(ad, e)}
            >
              <div className="h-20 bg-(--color-secondary)/30 flex items-center justify-center">
                <img
                  src={ad.img || PLACEHOLDER_AD_IMAGE}
                  alt={ad.title}
                  className="w-10 h-10 object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h4
                  className="text-(--color-text-secondary) font-semibold text-sm leading-tight"
                  title={ad.title}
                >
                  {ad.title}
                </h4>
                <p className="text-(--color-text-secondary)/80 text-xs mt-1 line-clamp-2">
                  {ad.desc}
                </p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}