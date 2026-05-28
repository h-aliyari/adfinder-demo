'use client';

import { Heart, User } from 'lucide-react';
import { Business, LikeResponse, CheckLikeResponse } from '../../services/types';
import { CustomPageData } from '../types';
import { toggleLike, checkLikeStatus } from '../../services/api';
import { useState, useEffect } from 'react';

interface BusinessHeaderProps {
  business: Business;
  customPageData: CustomPageData | null;
}

export default function BusinessHeader({ business, customPageData }: BusinessHeaderProps) {
  const [likes, setLikes] = useState(business.likes ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const result: CheckLikeResponse = await checkLikeStatus(business.id);
      
      if (result.success) {
        setLikes(result.likes);
        setIsLiked(result.is_liked);
      } else {
        console.warn('خطا در بررسی لایک:', result.error);
      }
    };
    
    checkStatus();
  }, [business.id]);

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result: LikeResponse = await toggleLike(business.id);
      
      if (result.success) {
        setLikes(result.likes);
        setIsLiked(result.is_liked);
      } else {
        console.error('خطا در لایک:', result.error);
      }
    } catch (error) {
      console.error('خطا در ارتباط:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const profileImage = business.profile_image;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* بخش عکس پروفایل */}
        <div className="shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={business.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-secondary">{business.name}</h1>

            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              کد: {business.business_code}
            </span>

            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {business.business_type}
            </span>
          </div>

          {/* توضیحات */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {customPageData?.customDescription || business.description || 'توضیحاتی ثبت نشده است.'}
            </p>
          </div>

          {/* آمار */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{business.views || 0} بازدید</span>
            </div>
            
            {/* بخش لایک */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handleLike}
                disabled={isLoading}
                className={`flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80 transition-opacity'}`}
              >
                <Heart 
                  className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                />
                <span className="font-medium">
                  {likes}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}