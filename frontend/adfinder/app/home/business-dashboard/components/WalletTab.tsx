// D:\adfinder\frontend\adfinder\app\business-dashboard\components\WalletTab.tsx
'use client';
import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { getBusinessStats } from '../services/api';

interface WalletTabProps {
  businessCode: string;
}

interface WalletData {
  balance: number;
  lastRecharge: string;
  totalViews: number;
  viewsSinceLastRecharge: number;
  nextRechargeAt: number;
  pendingAmount: number;
}

export default function WalletTab({ businessCode }: WalletTabProps) {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recharging, setRecharging] = useState(false);

  // نرخ تبدیل: هر 10000 بازدید = 20000 تومان
  const VIEWS_TO_MONEY_RATE = 20000 / 10000; // 2 تومان به ازای هر بازدید

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. گرفتن آمار بازدید از API داشبورد
      const stats = await getBusinessStats();
      
      // 2. اصلاح: استفاده از stats.views به جای stats.total_views
      const totalViews = stats.views || 0; // تغییر اینجا
      
      // 3. خواندن اطلاعات کیف پول از localStorage (موقت)
      const walletKey = `wallet_${businessCode}`;
      const walletStorage = localStorage.getItem(walletKey);
      
      let walletInfo = {
        balance: 0,
        lastRechargeViews: 0,
        lastRechargeDate: null as string | null,
        totalCharged: 0
      };
      
      if (walletStorage) {
        walletInfo = JSON.parse(walletStorage);
      }

      const viewsSinceLastRecharge = totalViews - walletInfo.lastRechargeViews;
      const balance = walletInfo.totalCharged || 0;

      // محاسبه مقدار شارژ قابل دریافت
      const rechargeableViews = Math.floor(viewsSinceLastRecharge / 10000) * 10000;
      const pendingAmount = rechargeableViews * VIEWS_TO_MONEY_RATE;
      
      // محاسبه بازدیدهای باقی‌مانده تا شارژ بعدی
      const viewsRemaining = 10000 - (viewsSinceLastRecharge % 10000);
      const nextRechargeAt = viewsRemaining === 10000 ? 0 : viewsRemaining;

      setWalletData({
        balance,
        lastRecharge: walletInfo.lastRechargeDate || 'Not yet',
        totalViews,
        viewsSinceLastRecharge,
        nextRechargeAt,
        pendingAmount
      });

    } catch (err: any) {
      console.error('Error fetching wallet data:', err);
      
      // اگر خطای احراز هویت بود
      if (err.message.includes('لطفاً ابتدا وارد شوید') || err.message.includes('401')) {
        setError('لطفاً ابتدا وارد حساب کاربری شوید');
      } else {
        setError('خطا در دریافت اطلاعات کیف پول');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!walletData || walletData.pendingAmount <= 0) {
      return;
    }

    try {
      setRecharging(true);
      
      // در واقعیت این باید یک API call به سرور باشد
      // فعلاً شبیه‌سازی می‌کنیم
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 1. آمار جدید بگیریم
      const stats = await getBusinessStats();
      const totalViews = stats.views || 0; // تغییر اینجا
      
      // 2. محاسبه شارژ قابل دریافت
      const walletKey = `wallet_${businessCode}`;
      const walletStorage = localStorage.getItem(walletKey);
      
      let walletInfo = {
        balance: 0,
        lastRechargeViews: 0,
        lastRechargeDate: null as string | null,
        totalCharged: 0
      };
      
      if (walletStorage) {
        walletInfo = JSON.parse(walletStorage);
      }

      const viewsSinceLastRecharge = totalViews - walletInfo.lastRechargeViews;
      const rechargeableViews = Math.floor(viewsSinceLastRecharge / 10000) * 10000;
      const rechargeAmount = rechargeableViews * VIEWS_TO_MONEY_RATE;

      if (rechargeAmount <= 0) {
        alert('مبلغ قابل شارژ صفر است!');
        return;
      }

      // 3. ذخیره اطلاعات جدید
      const newWalletInfo = {
        balance: walletInfo.balance + rechargeAmount,
        lastRechargeViews: walletInfo.lastRechargeViews + rechargeableViews,
        lastRechargeDate: new Date().toLocaleDateString('fa-IR'),
        totalCharged: walletInfo.totalCharged + rechargeAmount
      };

      localStorage.setItem(walletKey, JSON.stringify(newWalletInfo));

      // 4. به‌روزرسانی UI
      const newViewsSinceLastRecharge = totalViews - newWalletInfo.lastRechargeViews;
      const newPendingAmount = Math.floor(newViewsSinceLastRecharge / 10000) * 10000 * VIEWS_TO_MONEY_RATE;
      const newNextRechargeAt = 10000 - (newViewsSinceLastRecharge % 10000);

      setWalletData({
        balance: newWalletInfo.totalCharged,
        lastRecharge: newWalletInfo.lastRechargeDate,
        totalViews,
        viewsSinceLastRecharge: newViewsSinceLastRecharge,
        nextRechargeAt: newNextRechargeAt === 10000 ? 0 : newNextRechargeAt,
        pendingAmount: newPendingAmount
      });

      // 5. نمایش پیام موفقیت
      alert(`✅ ${rechargeAmount.toLocaleString('fa-IR')} تومان به کیف پول شما اضافه شد!\nتعداد بازدیدهای شارژ شده: ${rechargeableViews.toLocaleString('fa-IR')}`);

    } catch (err) {
      console.error('Error recharging wallet:', err);
      alert('خطا در شارژ کیف پول. لطفاً دوباره تلاش کنید');
    } finally {
      setRecharging(false);
    }
  };

  useEffect(() => {
    if (businessCode) {
      fetchWalletData();
    }
  }, [businessCode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-400">در حال دریافت اطلاعات کیف پول...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 p-4">
        <div className="text-red-500 mb-4">
          <AlertCircle className="w-16 h-16" />
        </div>
        <p className="text-red-400 mb-4 text-center">{error}</p>
        <button
          onClick={fetchWalletData}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <p className="text-slate-400">اطلاعاتی یافت نشد</p>
      </div>
    );
  }

  const canRecharge = walletData.pendingAmount > 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
          <Wallet className="w-8 h-8" />
          کیف پول کسب‌وکار
        </h1>
        <p className="text-slate-400">
          کیف پول شما بر اساس بازدیدهای صفحه اختصاصی شارژ می‌شود
        </p>
      </div>

      {/* کارت اصلی کیف پول */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6 border border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-900 p-3 rounded-lg">
                <Wallet className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">موجودی فعلی</p>
                <p className="text-3xl font-bold text-white">
                  {walletData.balance.toLocaleString('fa-IR')} <span className="text-lg">تومان</span>
                </p>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-2">
              آخرین شارژ: {walletData.lastRecharge}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            {walletData.pendingAmount > 0 && (
              <div className="text-right">
                <p className="text-green-400 text-sm">مبلغ قابل شارژ:</p>
                <p className="text-xl font-bold text-green-300">
                  {walletData.pendingAmount.toLocaleString('fa-IR')} تومان
                </p>
              </div>
            )}
            
            <button
              onClick={handleRecharge}
              disabled={!canRecharge || recharging}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${canRecharge 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {recharging ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  در حال شارژ...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  {canRecharge ? 'دریافت شارژ' : 'شارژ غیرفعال'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* کل بازدیدها */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-slate-400">کل بازدیدها</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {walletData.totalViews.toLocaleString('fa-IR')}
          </p>
          <div className="mt-2">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min(100, (walletData.totalViews % 10000) / 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {walletData.totalViews % 10000}/10000
            </p>
          </div>
        </div>

        {/* تا شارژ بعدی */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-xs text-slate-400">تا شارژ بعدی</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {walletData.nextRechargeAt.toLocaleString('fa-IR')}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            بازدید باقی‌مانده
          </p>
        </div>
      </div>

      {/* توضیحات سیستم */}
      <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-3">📊 نحوه محاسبه شارژ کیف پول</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-900 text-blue-300 rounded-full w-8 h-6 flex items-center justify-center text-sm mt-0.5">
              1
            </div>
            <div>
              <p className="text-white">هر بازدید از صفحه اختصاصی شما محاسبه می‌شود</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-900 text-green-300 rounded-full w-6 h-6 flex items-center justify-center text-sm mt-0.5">
              2
            </div>
            <div>
              <p className="text-white">هر ۱۰,۰۰۰ بازدید = ۲۰,۰۰۰ تومان شارژ</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-amber-900 text-amber-300 rounded-full w-10 h-6 flex items-center justify-center text-sm mt-0.5">
              3
            </div>
            <div>
              <p className="text-white">
                وقتی به ۱۰,۰۰۰ بازدید رسیدید، دکمه "دریافت شارژ" فعال می‌شود
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}