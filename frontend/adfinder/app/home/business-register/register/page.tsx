// frontend/adfinder/app/home/business-register/register/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRegistrationForm } from './hooks/useRegistrationForm';
import { checkPhoneExists } from '../services/api-client';

import RegisterFormFields from './components/RegisterFormFields';
import SubscriptionSelector from './components/SubscriptionSelector';
import { ErrorDisplay } from './components/ErrorDisplay';

export default function RegisterPage() {
  const {
    form,
    loading,
    errors,
    phoneAvailable,
    phoneChecking,
    confirmPassword,
    codeType,
    handleChange,
    handlePlanChange,
    handleSubmitNormal,
    handleSubmitSpecial,
    setConfirmPassword,
    setPhoneAvailable,
    setPhoneChecking
  } = useRegistrationForm();

  // منطق بررسی شماره تلفن
  useEffect(() => {
    const checkPhone = async () => {
      if (form.phone.length === 11 && /^09\d{9}$/.test(form.phone)) {
        setPhoneChecking(true);
        try {
          const exists = await checkPhoneExists(form.phone);
          setPhoneAvailable(!exists);
        } catch (error) {
          console.error('خطا در بررسی شماره تلفن:', error);
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
  }, [form.phone, setPhoneAvailable, setPhoneChecking]);

  return (
    <div className="space-y-6">
      {/* نمایش خطاها */}
      <ErrorDisplay
        errors={errors}
        phoneAvailable={phoneAvailable}
        phoneChecking={phoneChecking}
      />

      {/* فرم ثبت نام */}
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
    </div>
  );
}