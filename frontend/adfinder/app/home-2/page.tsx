// D:\adfinder\frontend\adfinder\app\home-2\page.tsx
'use client';

import Link from 'next/link';

export default function HomePage2() {
  return (
    <div className="w-full min-h-screen bg-primary text-primary">
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* هدر */}
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-accent mb-2">
            اسکنر QR code
          </h1>
          <p className="text-base text-foreground text-center max-w-lg">
            QR code را اسکن کنید تا به صفحه مربوطه هدایت شوید.
          </p>
        </div>

        {/* بخش اصلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* سمت راست: جایگاه اسکنر */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm bg-secondary/20 p-5">

              {/* جایگاه خالی اسکنر */}
              <div className="relative w-full aspect-square overflow-hidden rounded-lg border-4 border-accent/50 flex items-center justify-center bg-secondary/10">
                <div className="text-6xl text-accent/70">📷</div>
                <div className="absolute inset-0 border-2 border-dashed border-accent/30 m-4"></div>
              </div>

              <p className="text-sm text-foreground/80 mt-4 text-center">
                (در این نسخه اسکنر فعال نیست)
              </p>

            </div>
          </div>

          {/* سمت چپ: دکمه‌های ناوبری */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-accent mb-4 text-right">
              ورود به سیستم بیزنس ها
            </h2>

            {/* دکمه‌های اصلی */}
            <div className="space-y-4">

              {/* دکمه ثبت نام */}
              <Link href="/home-2/login-register" className="block">
                <div className="bg-accent hover:bg-accent/90 p-4 rounded-xl border border-accent transition-all duration-300 cursor-pointer text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-right">
                      <h3 className="text-lg font-bold text-primary">ورود / ثبت نام</h3>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/home-2/user-waiting" className="block">
                <div className="bg-accent-3 hover:bg-accent-3/90 p-4 rounded-xl border border-accent-3 transition-all duration-300 cursor-pointer text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-right">
                      <h3 className="text-lg font-bold text-primary">user-waiting</h3>
                      <p className="text-primary/90 text-sm mt-1">
                        (موقتی)
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* توضیح کوچک */}
            <div className="mt-8 p-4 bg-accent-4/20">
              <p className="text-sm text-foreground/90 text-center">
                QR Scanner در نسخه‌های بعدی فعال خواهد شد.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}