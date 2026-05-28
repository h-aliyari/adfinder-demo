const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// تولید یا دریافت session_id
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('ad_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('ad_session_id', sessionId);
  }
  return sessionId;
}

// ثبت بازدید
export async function trackImpression(adId: number): Promise<string | null> {
  try {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch(`${API_BASE_URL}/ads/track/impression/${adId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        page_url: window.location.href
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.impression_id || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error tracking impression:', error);
    return null;
  }
}

// ثبت کلیک
export async function trackClick(adId: number, impressionId?: string): Promise<boolean> {
  try {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch(`${API_BASE_URL}/ads/track/click/${adId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        impression_id: impressionId
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error tracking click:', error);
    return false;
  }
}

// دریافت آمار
export async function getAdStats(adId?: number) {
  try {
    const url = adId 
      ? `${API_BASE_URL}/ads/stats/${adId}/`
      : `${API_BASE_URL}/ads/stats/`;
    
    const response = await fetch(url);
    
    if (response.ok) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}