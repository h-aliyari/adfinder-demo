// frontend\adfinder\app\home\business-dashboard\components\OverviewTab.tsx
'use client';

import { Eye, Shield, Calendar, CreditCard, Lock, Wallet } from 'lucide-react';
import { BusinessInfo, Stats } from '../types';
import { useEffect, useState } from 'react';
import { getBusinessStats } from '../services/api';

interface OverviewTabProps {
  businessInfo: BusinessInfo;
  stats: Stats;
  onRenewSubscription: () => void;
  onUpgradeSubscription: () => void;
  businessCode: string; // اضافه کردن businessCode
}

interface WalletData {
  balance: number;
  lastRecharge: string;
  pendingAmount: number;
}

export default function OverviewTab({
  businessInfo,
  stats,
  onRenewSubscription,
  onUpgradeSubscription,
  businessCode
}: OverviewTabProps) {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  const VIEWS_TO_MONEY_RATE = 20000 / 10000; // 2 تومان به ازای هر بازدید

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR');
    } catch {
      return dateString;
    }
  };

  const getPlanLabel = (plan: string) => {
    const plans: Record<string, string> = {
      normal: 'نرمال',
      pro: 'پرو',
    };
    return plans[plan] || plan;
  };

  const getRemainingColor = (days: number) => {
    if (days > 20) return 'text-green-400';
    if (days > 10) return 'text-yellow-400';
    if (days > 5) return 'text-orange-400';
    return 'text-red-400';
  };

  const fetchWalletData = async () => {
    try {
      // 1. گرفتن آمار بازدید از API
      const stats = await getBusinessStats();
      const totalViews = stats.views || 0;
      
      // 2. خواندن اطلاعات کیف پول از localStorage
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
      
      // محاسبه مقدار شارژ قابل دریافت
      const rechargeableViews = Math.floor(viewsSinceLastRecharge / 10000) * 10000;
      const pendingAmount = rechargeableViews * VIEWS_TO_MONEY_RATE;
      
      setWalletData({
        balance: walletInfo.totalCharged || 0,
        lastRecharge: walletInfo.lastRechargeDate || 'هنوز شارژی انجام نشده',
        pendingAmount
      });

    } catch (err: any) {
      console.error('Error fetching wallet data:', err);
      // در صورت خطا، داده‌های پیش‌فرض قرار می‌دهیم
      setWalletData({
        balance: 0,
        lastRecharge: 'هنوز شارژی انجام نشده',
        pendingAmount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessCode) {
      fetchWalletData();
    }
  }, [businessCode]);

  // اگر در حال لودینگ هستیم، نمایش اسکلتون
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* اسکلتون برای بخش اشتراک */}
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 h-full w-full animate-pulse">
            <div className="h-6 bg-slate-700 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <div className="h-4 bg-slate-700 rounded w-20"></div>
                  <div className="h-4 bg-slate-700 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* اسکلتون برای بخش کیف پول */}
          <div className="p-5 rounded-xl border bg-blue-500/10 border-slate-700/50 h-full w-full animate-pulse">
            <div className="h-6 bg-slate-700 rounded w-24 mb-6"></div>
            <div className="h-8 bg-slate-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

        {/* اطلاعات اشتراک */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 h-full w-full">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            وضعیت اشتراک
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-300">طرح فعلی:</span>
              <span className={`font-bold ${businessInfo.plan === 'pro' ? 'text-purple-400' : 'text-blue-400'}`}>
                {getPlanLabel(businessInfo.plan)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-300">تاریخ ثبت:</span>
              <span className="font-bold text-white">{formatDate(businessInfo.created_at)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-300">تاریخ انقضا:</span>
              <span className="font-bold text-white">{formatDate(businessInfo.expires_date)}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-slate-300">روزهای باقی‌مانده:</span>
              <span className={`font-bold ${getRemainingColor(businessInfo.days_remaining)}`}>
                {businessInfo.days_remaining} روز
              </span>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={onRenewSubscription}
                className="w-full px-4 py-3 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                تمدید اشتراک
              </button>

              <button
                onClick={onUpgradeSubscription}
                className="w-full px-4 py-3 bg-linear-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-300 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                disabled
              >
                <CreditCard className="w-5 h-5" />
                ارتقا اشتراک
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* آمار بازدید و کیف پول */}
        <div className="p-5 rounded-xl border bg-blue-500/10 border-slate-700/50 h-full w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          
          {/* آمار بازدید */}
          <div className="mb-6">
            <div className="text-2xl font-bold text-white mb-1">
              {stats.views.toLocaleString('fa-IR')}
            </div>
            <div className="text-sm text-slate-400">بازدید کل</div>
          </div>
          
          {/* اطلاعات کیف پول */}
          <div className="pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-900 p-3 rounded-lg">
                <Wallet className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">موجودی فعلی</p>
                <p className="text-3xl font-bold text-white">
                  {walletData?.balance.toLocaleString('fa-IR') || '0'} <span className="text-lg">تومان</span>
                </p>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-2">
              آخرین شارژ: {walletData?.lastRecharge || 'هنوز شارژی انجام نشده'}
            </p>
            
            {/* مبلغ قابل شارژ */}
            {walletData?.pendingAmount && walletData.pendingAmount > 0 ? (
              <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-800/30">
                <div className="text-right">
                  <p className="text-green-400 text-sm">مبلغ قابل شارژ:</p>
                  <p className="text-xl font-bold text-green-300">
                    {walletData.pendingAmount.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                <div className="text-right">
                  <p className="text-slate-400 text-sm">مبلغ قابل شارژ:</p>
                  <p className="text-xl font-bold text-slate-300">
                    ۰ تومان
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}