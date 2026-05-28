// app/ads/services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function getAds() {
  try {
    console.log('🔍 Fetching ads from:', `${API_BASE_URL}/ads/`);
    
    const res = await fetch(`${API_BASE_URL}/ads/`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`Failed to fetch ads: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('✅ Ads data received');
    
    return data;
  } catch (error) {
    console.error('❌ getAds error:', error);
    throw error; // خطا رو به بالا پاس بده
  }
}