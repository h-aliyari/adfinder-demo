// D:\adfinder\frontend\adfinder\app\home-2\login-register\dashboard-login\monitor\page.tsx
import OrdersTable from "./components/OrdersTable";
import MonitorAds from "../../../ads/MonitorAds";

export default function MonitorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* هدر */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">مانیتور</h1>
              <p className="text-sm text-gray-500 mt-1">نمایش زنده وضعیت سفارش‌ها</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></span>
                آنلاین
              </div>
              <div className="text-sm">
                <span className="font-medium">{new Date().toLocaleTimeString('fa-IR')}</span>
                <span className="text-gray-500 mr-2"> - </span>
                <span className="text-gray-500">{new Date().toLocaleDateString('fa-IR')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* محتوای اصلی */}
      <main className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* بخش تبلیغات عمودی */}
          <div className="w-80 shrink-0">
            <div className="sticky top-6">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">تبلیغات :</h2>
                </div>
                <MonitorAds />
              </div>
            </div>
          </div>

          {/* بخش اصلی - جدول سفارشات */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
              
              <div className="px-6 py-4 border-b bg-linear-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">سفارش‌های فعال</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      تعداد: 
                    </span>
                    <button className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                      رفرش
                    </button>
                  </div>
                </div>
              </div>

              <OrdersTable />
            </div>
          </div>          
        </div>
      </main>
    </div>
  );
}