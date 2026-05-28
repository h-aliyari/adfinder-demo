// app/home/business-register/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Phone, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { loginBusiness, loginWithPhone } from '../services/api-client';
import { validatePhoneNumber, validateBusinessCode, persianToEnglish } from '../services/utils';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'code' | 'phone'>('code');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [identifierValid, setIdentifierValid] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!identifier.trim()) {
      setIdentifierValid(null);
      return;
    }

    const normalized = persianToEnglish(identifier);

    setIdentifierValid(loginType === 'code'
      ? validateBusinessCode(normalized)
      : validatePhoneNumber(normalized)
    );
  }, [identifier, loginType]);

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      setError('لطفاً همه فیلدها را پر کنید');
      return;
    }

    let normalized = persianToEnglish(identifier);

    if (loginType === 'code') {
      normalized = normalized.toUpperCase();
      if (!validateBusinessCode(normalized)) {
        setError('کد معتبر نیست. مثال: A12');
        return;
      }
    } else if (!validatePhoneNumber(normalized)) {
      setError('شماره تلفن معتبر نیست. مثال: 09123456789');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = loginType === 'code'
        ? await loginBusiness(normalized, password)
        : await loginWithPhone(normalized, password);

      if (success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('last_business_code', normalized);
        }
        // بعد از لاگین موفق، به داشبورد اصلی هدایت می‌شود
        setTimeout(() => {
          router.push('/home/business-dashboard');
        }, 1000);
      } else {
        setError('نام کاربری یا رمز عبور نامعتبر است.');
      }
    } catch (err: any) {
      // نمایش خطای دقیق از سرور
      if (err.message) {
        setError(err.message);
      } else {
        setError('خطا در ورود. لطفاً دوباره امتحان کنید.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchLoginType = (type: 'code' | 'phone') => {
    setLoginType(type);
    setIdentifier('');
    setPassword('');
    setError('');
    setIdentifierValid(null);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header with login type buttons */}
      <div className="flex gap-4 mb-8">
        {(['code', 'phone'] as const).map((type) => (
          <button
            key={type}
            onClick={() => switchLoginType(type)}
            className={`flex-1 py-3 rounded-xl border-2 transition-all ${loginType === type
              ? 'border-accent bg-accent/10'
              : 'border-slate-700 hover:border-slate-600'
              }`}
          >
            <div className="flex flex-col items-center gap-2">
              {type === 'code' ? <Key /> : <Phone />}
              <span className={`font-medium ${loginType === type ? 'text-secondary' : 'text-slate-300'
                }`}>
                {type === 'code' ? 'ورود با کد' : 'ورود با شماره'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Login form */}
      <div className="space-y-6">
        {/* Identifier field */}
        <div>
          <label className="label flex items-center gap-2 mb-2">
            {loginType === 'code' ? (
              <>
                <Key className="w-4 h-4" />
                کد اختصاصی کسب‌وکار
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                شماره موبایل
              </>
            )}
          </label>
          <div className="relative">
            <input
              type="text"
              value={identifier}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              onChange={(e) => setIdentifier(e.target.value)}
              maxLength={loginType === 'code' ? 3 : 11}
              className={`input ${error && !identifierValid
                ? 'border-red-500'
                : identifierValid
                  ? 'border-emerald-500'
                  : ''
                }`}
              placeholder={loginType === 'code' ? 'مثال: A12' : 'مثال: 09123456789'}
            />
            {identifierValid && (
              <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
            )}
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {loginType === 'code'
              ? 'کد شما شامل یک حرف انگلیسی و دو عدد است (مانند A12)'
              : 'شماره موبایل خود را با ۰۹ وارد کنید'
            }
          </p>
        </div>

        {/* Password field */}
        <div>
          <label className="label flex items-center gap-2 mb-2">
            <Key className="w-4 h-4" />
            رمز عبور
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-10"
              placeholder="رمز عبور خود را وارد کنید"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </p>
          </div>
        )}

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading || !identifierValid || !password.trim()}
          className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              در حال ورود...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              ورود به پنل
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </button>

        {/* Forgot password */}
        <div className="text-center pt-4 border-t border-slate-700">
          <button
            onClick={() => router.push('/home/business-register/forgot-password')}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            فراموشی رمز عبور؟
          </button>
        </div>

        {/* Test information */}
        <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700">
          <ul className="text-slate-400 text-sm space-y-1">
            <li>
              • رمز پیش‌فرض برای همه حساب‌ها:{' '}
              <code className="bg-slate-700 px-2 py-1 rounded">123456</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}