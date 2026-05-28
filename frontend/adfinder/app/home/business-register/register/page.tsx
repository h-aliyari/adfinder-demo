// frontend/adfinder/app/home/business-register/register/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPendingRegistration, checkPhoneExists } from '../services/api-client';
import { validateEmail, validatePhoneNumber } from '../services/utils';
import type { BusinessRegistrationData } from '../services/types';

import RegisterFormFields from './components/RegisterFormFields';
import SubscriptionSelector from './components/SubscriptionSelector';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<BusinessRegistrationData>({
    name: '',
    owner: '',
    phone: '',
    email: '',
    businessType: '',
    address: '',
    province: '',
    socialLinks: [''],
    description: '',
    plan: 'normal',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);
  const [phoneChecking, setPhoneChecking] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeType, setCodeType] = useState<'normal' | 'special'>('normal');

  useEffect(() => {
    const checkPhone = async () => {
      if (form.phone.length === 11 && validatePhoneNumber(form.phone)) {
        setPhoneChecking(true);
        try {
          const exists = await checkPhoneExists(form.phone);
          setPhoneAvailable(!exists);
        } catch (error) {
          setPhoneAvailable(null);
        } finally {
          setPhoneChecking(false);
        }
      } else {
        setPhoneAvailable(null);
      }
    };

    const timeoutId = setTimeout(checkPhone, 500);
    return () => clearTimeout(timeoutId);
  }, [form.phone]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlanChange = (plan: 'normal' | 'pro') => {
    setForm(prev => ({ ...prev, plan }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = 'نام کسب‌وکار الزامی است';
    }

    if (!form.owner.trim()) {
      newErrors.owner = 'نام مالک الزامی است';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'شماره تماس الزامی است';
    } else if (!validatePhoneNumber(form.phone)) {
      newErrors.phone = 'شماره تلفن معتبر نیست';
    }

    if (!form.email.trim()) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    if (!form.businessType) {
      newErrors.businessType = 'لطفاً نوع کسب‌وکار را انتخاب کنید';
    }

    if (!form.province) {
      newErrors.province = 'لطفاً استان را انتخاب کنید';
    }

    if (phoneAvailable === false) {
      newErrors.phone = 'این شماره تلفن قبلاً ثبت شده است';
    }

    if (!form.password.trim()) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (form.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'تکرار رمز عبور الزامی است';
    } else if (form.password !== confirmPassword) {
      newErrors.confirmPassword = 'رمز عبور و تکرار آن مطابقت ندارند';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// در تابع handleSubmit، بعد از دریافت نتیجه:
const handleSubmit = async (type: 'normal' | 'special' = 'normal') => {
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  setErrors({});
  setCodeType(type);

  try {
    const cleanSocialLinks = form.socialLinks.filter(link => link.trim() !== '');
    const cleanForm = {
      ...form,
      socialLinks: cleanSocialLinks
    };

    console.log('📤 ارسال درخواست...');
    console.log('📊 داده‌های فرم:', cleanForm);
    console.log('🏷️ کد نوع:', type);
    
    // 🚨 **اصلاح ۱: استفاده از URL کامل**
    // از localhost:8000 مستقیماً استفاده کنیم
    const API_URL = 'http://localhost:8000';
    const endpoint = '/api/businesses/pending-registration/';
    const fullUrl = `${API_URL}${endpoint}`;
    
    console.log('🔗 URL کامل:', fullUrl);
    
    // 🚨 **اصلاح ۲: اضافه کردن دیباگ بیشتر**
    const requestBody = {
      name: cleanForm.name,
      owner: cleanForm.owner,
      phone: cleanForm.phone,
      email: cleanForm.email,
      business_type: cleanForm.businessType,
      address: cleanForm.address,
      province: cleanForm.province,
      social_links: cleanForm.socialLinks,
      description: cleanForm.description,
      plan: cleanForm.plan,
      password: cleanForm.password,
      code_type: type,
      
      price: type === 'special' ? 100000 : 50000,
      status: 'pending_payment' // این ممکن است در مدل نیاز باشد
    };
    
    console.log('📦 بدنه درخواست:', requestBody);
    
    // 🚨 **اصلاح ۳: تست OPTIONS قبل از POST**
    console.log('🧪 تست OPTIONS...');
    try {
      const optionsRes = await fetch(fullUrl, {
        method: 'OPTIONS',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('✅ تست OPTIONS:', optionsRes.status, optionsRes.statusText);
    } catch (optionsError) {
      console.error('❌ تست OPTIONS شکست خورد:', optionsError);
    }
    
    // 🚨 **اصلاح ۴: ارسال درخواست اصلی**
    console.log('🚀 ارسال POST...');
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📨 وضعیت پاسخ:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });

    // 🚨 **اصلاح ۵: خواندن متن پاسخ**
    const responseText = await response.text();
    console.log('📄 متن پاسخ (اولین 500 کاراکتر):', responseText.substring(0, 500));
    
    // بررسی اگر HTML باشد (صفحه خطا)
    if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
      console.error('❌ سرور HTML برگرداند! احتمالاً URL اشتباه یا خطای سرور');
      setErrors({ 
        submit: 'خطای سرور: سرور صفحه HTML برگرداند. لطفاً با پشتیبانی تماس بگیرید.' 
      });
      return;
    }
    
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('✅ JSON پارس شد:', result);
    } catch (jsonError) {
      console.error('❌ خطای JSON:', jsonError);
      console.error('📄 متن کامل پاسخ:', responseText);
      setErrors({ 
        submit: 'پاسخ سرور معتبر نیست. لطفاً لاگ‌ها را بررسی کنید.' 
      });
      return;
    }

    // 🚨 **اصلاح ۶: بررسی دقیق‌تر پاسخ**
    if (response.ok) {
      console.log('✅ پاسخ موفق از سرور:', result);
      
      // از لاگ‌های قبلی می‌دانیم سرور این فیلدها را برمی‌گرداند:
      // ✅ کسب‌وکار ایجاد شد: F15
      // پس باید business_code داشته باشیم
      
      const payment_id = result.id || result.payment_id || result.paymentId || `pay_${Date.now()}`;
      const business_code = result.business_code || result.businessCode || 'UNKNOWN';
      
      console.log('🎯 اطلاعات پرداخت:', { payment_id, business_code });
      
      // ذخیره اطلاعات
      if (typeof window !== 'undefined') {
        localStorage.setItem('pending_registration', JSON.stringify({
          ...cleanForm,
          codeType: type,
          paymentId: payment_id,
          businessCode: business_code,
          price: type === 'special' ? 100000 : 50000
        }));
      }
      
      // انتقال به صفحه پرداخت
      router.push(`/business-register/payment/${payment_id}`);
      
    } else {
      // خطای واقعی از سرور
      console.error('❌ خطای HTTP:', result);
      
      // بررسی انواع خطاهای ممکن
      let errorMessage = 'خطای ناشناخته';
      
      if (result.error) {
        errorMessage = result.error;
      } else if (result.detail) {
        errorMessage = result.detail;
      } else if (result.message) {
        errorMessage = result.message;
      } else if (response.status === 500) {
        errorMessage = 'خطای داخلی سرور (500)';
      } else if (response.status === 404) {
        errorMessage = 'آدرس API یافت نشد (404)';
      } else {
        errorMessage = `خطا: ${response.status} - ${response.statusText}`;
      }
      
      setErrors({ submit: errorMessage });
    }

  } catch (error: any) {
    console.error('❌ خطا در ارسال:', error);
    
    let errorMessage = 'خطا در ارتباط با سرور';
    if (error.message) {
      errorMessage = error.message;
    }
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      errorMessage = 'اتصال به سرور برقرار نشد. لطفاً مطمئن شوید سرور Django در حال اجراست.';
    }
    
    setErrors({ submit: errorMessage });
  } finally {
    setLoading(false);
  }
};

  const handleSubmitNormal = () => handleSubmit('normal');
  const handleSubmitSpecial = () => handleSubmit('special');

  return (
    <>
      <div className="lg:grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RegisterFormFields
            form={form}
            errors={errors}
            phoneAvailable={phoneAvailable}
            phoneChecking={phoneChecking}
            confirmPassword={confirmPassword}
            handleChange={handleChange}
            setConfirmPassword={setConfirmPassword}
          />
        </div>

        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <SubscriptionSelector
            plan={form.plan}
            onPlanChange={handlePlanChange}
            loading={loading}
            codeType={codeType}
            onSubmitNormal={handleSubmitNormal}
            onSubmitSpecial={handleSubmitSpecial}
          />
        </div>
      </div>
    </>
  );
}