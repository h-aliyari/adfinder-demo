// D:\adfinder\frontend\adfinder\app\business\[businessId]\types.ts

export interface CustomPageData {
  socialLinks: Array<{
    platform: string;
    url: string;
    icon?: string;
  }>;
  address: string;
  workingHours?: string;
  customDescription?: string;
  specialOffers?: Array<{
    title: string;
    description: string;
  }>;
  hasCustomPage: boolean;
}

export interface BusinessPageProps {
  businessId: string;
}