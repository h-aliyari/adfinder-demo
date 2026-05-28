// frontend/adfinder/app/admin/services/api.tsx
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('access_token') || localStorage.getItem('token')
      : null;

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'API request failed');
  }

  return res.json();
}

export type PopupAd = {
  id: number;
  text: string;
  url: string;
  textColor: string;
  background: string;
};

export type BottomAd = {
  id: number;
  text: string;
  url: string;
  textColor: string;
  background: string;
};

export type HomeAd = {
  id: number;
  text: string;
  background: string;
};

export type Home1Ad = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  features: string[];
};

export type Home2Ad = {
  id: number;
  title: string;
  desc: string;
  url: string;
  img: string;
};

export type AdsResponse = {
  popup: PopupAd;
  bottom: BottomAd;
  home: HomeAd[];
  home1: Home1Ad[];
  home2: Home2Ad[];
};

export async function getAdminAds() {
  return request<AdsResponse>('/ads/admin');
}

export async function updateAdminAds(payload: AdsResponse) {
  return request<AdsResponse>('/ads/admin', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
