'use client';

import React from 'react';
import { Building2, User, Phone, Mail, FileText, AlertCircle, CheckCircle2, MapPin, Lock } from 'lucide-react';
import { BUSINESS_TYPES, IRAN_PROVINCES } from '../../services/types';

interface RegisterFormFieldsProps {
  form: {
    name: string;
    owner: string;
    phone: string;
    email: string;
    businessType: string;
    address: string;
    province: string;
    description: string;
    password: string;
  };
  errors: Record<string, string>;
  phoneAvailable: boolean | null;
  phoneChecking: boolean;
  confirmPassword: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setConfirmPassword: (value: string) => void;
}

export default function RegisterFormFields({
  form,
  errors,
  phoneAvailable,
  phoneChecking,
  confirmPassword,
  handleChange,
  setConfirmPassword
}: RegisterFormFieldsProps) {
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="label">
            <Building2 className="w-4 h-4 inline mr-2" />
            نام کسب‌وکار *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="label">
            <User className="w-4 h-4 inline mr-2" />
            نام مالک *
          </label>
          <input
            name="owner"
            value={form.owner}
            onChange={handleChange}
            className={`input ${errors.owner ? 'border-red-500' : ''}`}
          />
          {errors.owner && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.owner}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="label">
            <Phone className="w-4 h-4 inline mr-2" />
            شماره تماس *
          </label>
          <div className="relative">
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`input ${errors.phone ? 'border-red-500' : phoneAvailable === false ? 'border-red-500' : phoneAvailable === true ? 'border-emerald-500' : ''}`}
              maxLength={11}
            />
            {phoneChecking && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {phoneAvailable === true && !phoneChecking && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            )}
            {phoneAvailable === false && !phoneChecking && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.phone}
            </p>
          )}
          {phoneAvailable === true && !errors.phone && (
            <p className="text-emerald-500 text-sm mt-1 flex items-center">
              <CheckCircle2 className="w-4 h-4 ml-1" />
              شماره تماس معتبر است
            </p>
          )}
        </div>

        <div>
          <label className="label">
            <Mail className="w-4 h-4 inline mr-2" />
            ایمیل *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`input ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="label">
            <Building2 className="w-4 h-4 inline mr-2" />
            نوع کسب‌وکار *
          </label>
          <select
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            className={`input ${errors.businessType ? 'border-red-500' : ''}`}
          >
            <option value="">-- انتخاب کنید --</option>
            {BUSINESS_TYPES.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.businessType}
            </p>
          )}
        </div>

        <div>
          <label className="label">
            <MapPin className="w-4 h-4 inline mr-2" />
            استان *
          </label>
          <select
            name="province"
            value={form.province}
            onChange={handleChange}
            className={`input ${errors.province ? 'border-red-500' : ''}`}
          >
            <option value="">-- انتخاب استان --</option>
            {IRAN_PROVINCES.map((province, index) => (
              <option key={index} value={province}>
                {province}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.province}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="label">
          <MapPin className="w-4 h-4 inline mr-2" />
          آدرس کامل (اختیاری)
        </label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          className="textarea"
          rows={2}
        />
      </div>

      <div>
        <label className="label">
          <FileText className="w-4 h-4 inline mr-2" />
          توضیحات (اختیاری)
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="textarea"
          rows={3}
        />
        <p className="text-gray-500 text-sm mt-1">
          {form.description.length}/500 کاراکتر
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="label">
            <Lock className="w-4 h-4 inline mr-2" />
            رمز عبور *
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="حداقل ۶ کاراکتر"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label className="label">
            <Lock className="w-4 h-4 inline mr-2" />
            تکرار رمز عبور *
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="تکرار رمز عبور"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 ml-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}