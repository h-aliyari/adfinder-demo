// // D:\adfinder\frontend\adfinder\utils\mockData.ts

// export interface Business {
//   id: string;
//   name: string;
//   category: string;
//   address: string;
//   phone: string;
//   description: string;
//   rating: number;
//   image: string;
//   services: string[];
//   openingHours: {
//     days: string;
//     hours: string;
//   }[];
//   coordinates: {
//     lat: number;
//     lng: number;
//   };
// }

// export const mockBusinesses: Business[] = [
//   {
//     id: "1",
//     name: "کافه ستاره",
//     category: "کافه",
//     address: "تهران، میدان انقلاب، خیابان کارگر شمالی",
//     phone: "021-12345678",
//     description: "کافه‌ای دنج با بهترین قهوه‌های ایتالیایی و فضای آرام برای کار و مطالعه.",
//     rating: 4.7,
//     image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
//     services: ["وای‌فای رایگان", "پریز برق", "فضای کار", "قهوه تخصصی"],
//     openingHours: [
//       { days: "شنبه تا چهارشنبه", hours: "۸:۰۰ - ۲۳:۰۰" },
//       { days: "پنجشنبه", hours: "۸:۰۰ - ۰۰:۰۰" },
//       { days: "جمعه", hours: "۱۰:۰۰ - ۰۰:۰۰" }
//     ],
//     coordinates: { lat: 35.7000, lng: 51.4000 }
//   },
//   {
//     id: "2",
//     name: "رستوران آفتاب",
//     category: "رستوران",
//     address: "کرج، بلوار آزادی، پلاک ۱۲۳",
//     phone: "026-87654321",
//     description: "رستوران سنتی با غذاهای ایرانی اصیل و محیطی خانوادگی.",
//     rating: 4.5,
//     image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w-400",
//     services: ["پارکینگ", "تحویل در محل", "منوی گیاهی", "فضای کودک"],
//     openingHours: [
//       { days: "همه روزه", hours: "۱۲:۰۰ - ۲۳:۰۰" }
//     ],
//     coordinates: { lat: 35.8000, lng: 51.0000 }
//   },
//   {
//     id: "3",
//     name: "سالن زیبایی ماه",
//     category: "آرایشگاه",
//     address: "اصفهان، خیابان چهارباغ، کوچه هنر",
//     phone: "031-11223344",
//     description: "سالن زیبایی مدرن با جدیدترین متدهای روز دنیا.",
//     rating: 4.9,
//     image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
//     services: ["کوتاهی مو", "رنگ مو", "میکاپ", "ماساژ صورت"],
//     openingHours: [
//       { days: "شنبه تا چهارشنبه", hours: "۹:۰۰ - ۲۱:۰۰" },
//       { days: "پنجشنبه", hours: "۹:۰۰ - ۱۸:۰۰" }
//     ],
//     coordinates: { lat: 32.6000, lng: 51.6000 }
//   },
//   {
//     id: "4",
//     name: "فروشگاه الکترونیک نور",
//     category: "الکترونیک",
//     address: "مشهد، بلوار وکیل‌آباد، مجتمع تجاری الماس",
//     phone: "051-44332211",
//     description: "تجهیزات الکترونیکی اورجینال با گارانتی معتبر.",
//     rating: 4.3,
//     image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400",
//     services: ["گارانتی طلایی", "نصب رایگان", "تحویل فوری", "تعمیرات"],
//     openingHours: [
//       { days: "شنبه تا پنجشنبه", hours: "۹:۰۰ - ۲۱:۰۰" },
//       { days: "جمعه", hours: "۱۰:۰۰ - ۱۸:۰۰" }
//     ],
//     coordinates: { lat: 36.3000, lng: 59.6000 }
//   },
//   {
//     id: "5",
//     name: "کلینیک سلامت",
//     category: "درمانی",
//     address: "شیراز، خیابان زند، ساختمان پزشکان",
//     phone: "071-55667788",
//     description: "کلینیک تخصصی با پزشکان مجرب و تجهیزات پیشرفته.",
//     rating: 4.8,
//     image: "https://images.unsplash.com/photo-1516549655669-df6654e435f6?w=400",
//     services: ["نوبت‌دهی آنلاین", "بیمه طرف قرارداد", "آزمایشگاه", "فیزیوتراپی"],
//     openingHours: [
//       { days: "شنبه تا چهارشنبه", hours: "۸:۰۰ - ۲۰:۰۰" },
//       { days: "پنجشنبه", hours: "۸:۰۰ - ۱۴:۰۰" }
//     ],
//     coordinates: { lat: 29.6000, lng: 52.5000 }
//   }
// ];

// // تابع برای گرفتن بیزنس بر اساس ID
// export const getBusinessById = (id: string): Business | undefined => {
//   return mockBusinesses.find(business => business.id === id);
// };

// // تابع برای جستجو
// export const searchBusinesses = (query: string): Business[] => {
//   const lowerQuery = query.toLowerCase();
//   return mockBusinesses.filter(business =>
//     business.name.toLowerCase().includes(lowerQuery) ||
//     business.category.toLowerCase().includes(lowerQuery) ||
//     business.address.toLowerCase().includes(lowerQuery)
//   );
// };

// // تابع برای گرفتن بیزنس‌های یک دسته
// export const getBusinessesByCategory = (category: string): Business[] => {
//   return mockBusinesses.filter(business =>
//     business.category.toLowerCase() === category.toLowerCase()
//   );
// };