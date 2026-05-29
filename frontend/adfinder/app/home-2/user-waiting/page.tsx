// D:\adfinder\frontend\adfinder\app\home-2\user-waiting\page.tsx

// این فایل برای تست است
// اصلی در frontend\adfinder\app\home-2\user-waiting\[ResId]\page.tsx

'use client';

import HomeAdsTop from '../ads/HomeAdsTop';
import HomeAdsBottom from '../ads/HomeAdsBottom';
import OrderProgress from './components/OrderProgress';
import WaitingAdsPopup from '../ads/WaitingAdsPopup';

export default function UserWaitingPage() {
  return (
    <div className="min-h-screen bg-(--color-primary)  py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* بخش ۱: تبلیغات بالای صفحه */}
        <HomeAdsTop />
        
        {/* بخش ۲: وضعیت سفارش (استاتیک) */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-(--color-text-primary) mb-3">
            وضعیت سفارش شما :
          </h1>
          <OrderProgress />
        </div>
        
        {/* بخش ۳: تبلیغات پایین صفحه */}
        <HomeAdsBottom />
      </div>

      
      {/* بخش ۴: تبلیغات Popup */}
      <WaitingAdsPopup autoInterval={10000} closeDelay={10000} />

    </div>
  );
}


// export default function Page() {
//   return <div>در حال توسعه...</div>;
// }