export interface BusinessInfo {
  code: string;
  name: string;
  owner: string;
  phone: string;
  email: string;
  businessType: string;
  address?: string;
  description?: string;
  plan: 'normal' | 'pro';
  created_at: string;
  expires_date: string;
  days_remaining: number;
  status: 'active' | 'expired' | 'pending';
  views: number;
  searches: number;
  saves: number;
  profile_image?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface CustomPageInfo {
  socialLinks: SocialLink[];
  address?: string;
  mapLocation?: string;
  workingHours?: string;
  customDescription?: string;
  specialOffers?: Array<{ title: string; description: string }>;
  hasCustomPage?: boolean; 
}

export interface Stats {
  views: number;
  searches: number;
  saves: number;
}

export interface ProfileField {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  editable: boolean;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select';
  options?: string[];
}