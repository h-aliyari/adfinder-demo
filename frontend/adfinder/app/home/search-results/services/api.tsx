// app/search-results/services/api.ts
import { Business } from './types'; 

const API_BASE_URL = 'http://localhost:8000/api';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// تعریف interfaceهای خودت
export interface SearchParams {
  q?: string;
  type?: string;
  province?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  results: Business[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export const searchBusinesses = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append('q', params.q);
    if (params.type) queryParams.append('type', params.type);
    if (params.province) queryParams.append('province', params.province);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const url = `${API_BASE_URL}/businesses/search/?${queryParams.toString()}`;
    console.log(`🔍 [Search API] Fetching with filters: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error(`خطا در جستجو (کد: ${response.status})`);
    }

    const data = await response.json();
    console.log(`✅ [Search API] Found ${data.results?.length || 0} results with current filters`);
    
    return data;

  } catch (error) {
    console.error('❌ [Search API] Error:', error);
    throw error;
  }
};