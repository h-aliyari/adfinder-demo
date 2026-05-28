// frontend\adfinder\app\business-register\services\utils.ts

// ============ Validation Functions ============
export const validatePhoneNumber = (phone: string): boolean => {
  const normalized = persianToEnglish(phone);
  return /^09\d{9}$/.test(normalized);
};

export const validateEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateBusinessCode = (code: string): boolean => {
  const normalized = persianToEnglish(code).toUpperCase();
  return /^[A-Za-z][0-9]{2}$/.test(normalized);
};

// ============ Utility Functions ============
export const getCurrentBusiness = () => {
  if (typeof window === 'undefined') return null;

  return {
    code: localStorage.getItem('business_code'),
    name: localStorage.getItem('business_name'),
    plan: localStorage.getItem('business_plan'),
    isLoggedIn: localStorage.getItem('is_logged_in') === 'true'
  };
};

export const logoutBusiness = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('business_code');
  localStorage.removeItem('business_name');
  localStorage.removeItem('business_plan');
  localStorage.removeItem('is_logged_in');
};

// ============ Persian to English conversion ============
export const persianToEnglish = (str: string): string => {
  return str.replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
};

// ============ Code Generator Functions ============
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SPECIAL_NUMBERS = ['11', '22', '33', '44', '55', '66', '77', '88', '99'];

export function generateBusinessCode(codeType: 'normal' | 'special' = 'normal'): string {
  const randomLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];

  let randomNumber: string;

  if (codeType === 'special') {
    randomNumber = SPECIAL_NUMBERS[Math.floor(Math.random() * SPECIAL_NUMBERS.length)];
  } else {
    let num = Math.floor(Math.random() * 90) + 10;

    while (SPECIAL_NUMBERS.includes(num.toString())) {
      num = Math.floor(Math.random() * 90) + 10;
    }

    randomNumber = num.toString();
  }

  return `${randomLetter}${randomNumber}`;
}

export function isSpecialCode(code: string): boolean {
  if (code.length !== 3) return false;
  const numberPart = code.slice(1);
  return SPECIAL_NUMBERS.includes(numberPart);
}

export function calculatePrice(plan: 'normal' | 'pro', codeType: 'normal' | 'special'): number {
  const basePrices = {
    normal: 50000,
    pro: 100000
  };

  const specialCodePremium = 50000;

  let price = basePrices[plan];

  if (codeType === 'special') {
    price += specialCodePremium;
  }

  return price;
}

export async function generateUniqueCode(
  codeType: 'normal' | 'special' = 'normal',
  existingCodes: string[] = [],
  maxAttempts: number = 100
): Promise<string> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const code = generateBusinessCode(codeType);

    if (!existingCodes.includes(code)) {
      return code;
    }

    attempts++;
  }

  const baseCode = generateBusinessCode(codeType);
  return `${baseCode}-${Math.floor(Math.random() * 10)}`;
}