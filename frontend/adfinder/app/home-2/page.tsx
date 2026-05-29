// D:\adfinder\frontend\adfinder\app\home-2\page.tsx
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function HomePage2() {
  const [scanResult, setScanResult] = useState<string>('');
  const [scanError, setScanError] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false); // ابتدا غیرفعال
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false); // دوربین فعال است؟
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // مجوز دوربین
  const scannerRef = useRef<any>(null);

  const handleScan = (result: any) => {
    if (result?.[0]?.rawValue) {
      const scannedValue = result[0].rawValue;
      setScanResult(scannedValue);
      setScanError('');
      setIsScanning(false);
      setIsCameraActive(false);
      
      // هدایت خودکار به لینک اسکن شده
      window.location.href = scannedValue;
    }
  };

  const handleError = (error: any) => {
    const errorMessage = error?.message || 'دسترسی به دوربین ممکن نیست';
    setScanError(`خطا در اسکن: ${errorMessage}`);
    console.error('QR Scanner Error:', error);
    setIsCameraActive(false);
    setHasPermission(false);
  };

  const startScanner = async () => {
    try {
      // درخواست مجوز دوربین
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // اگر مجوز داده شد
      setHasPermission(true);
      setIsScanning(true);
      setIsCameraActive(true);
      setScanError('');
      setScanResult('');
      
      // توقف استریم (اسکنر خودش مدیریت می‌کند)
      stream.getTracks().forEach(track => track.stop());
      
    } catch (err: any) {
      setHasPermission(false);
      setScanError(`خطا در دسترسی به دوربین: ${err.message || 'لطفا مجوز دوربین را بررسی کنید'}`);
      console.error('Camera Permission Error:', err);
    }
  };

  const stopScanner = () => {
    setIsScanning(false);
    setIsCameraActive(false);
    setScanError('');
  };

  const resetScanner = () => {
    setScanResult('');
    setScanError('');
    setIsScanning(true);
    setIsCameraActive(true);
  };

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
        <hr />

        {/* بخش اصلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* سمت راست: اسکنر */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm bg-secondary/20 p-5 rounded-xl">
              {/* دکمه شروع اسکن */}
              {!isCameraActive && (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="text-5xl mb-6 text-accent">📷</div>                  
                  <button
                    onClick={startScanner}
                    className="px-8 py-3 bg-accent text-accent text-lg font-semibold rounded-xl hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    شروع اسکن QR code
                  </button>
                  
                  {hasPermission === false && (
                    <p className="mt-4 text-sm text-red-500 text-center">
                      دسترسی به دوربین داده نشد. لطفا تنظیمات مرورگر را بررسی کنید.
                    </p>
                  )}
                </div>
              )}

              {/* اسکنر فعال */}
              {isCameraActive && (
                <>
                  {/* هدر اسکنر */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-accent">
                      در حال اسکن...
                    </h3>
                    <button
                      onClick={stopScanner}
                      className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                    >
                      توقف اسکن
                    </button>
                  </div>

                  {/* اسکنر QR */}
                  <div className="relative w-full aspect-square overflow-hidden rounded-lg border-4 border-accent/50 flex items-center justify-center bg-secondary/10">
                    {isScanning ? (
                      <div className="w-full h-full">
                        <Scanner
                          ref={scannerRef}
                          onScan={handleScan}
                          onError={handleError}
                          constraints={{
                            facingMode: 'environment',
                            aspectRatio: 1
                          }}
                          scanDelay={500}
                          components={{
                            torch: true,
                            finder: true,
                          }}
                          styles={{
                            container: {
                              borderRadius: '0.5rem',
                              position: 'relative' as const,
                              overflow: 'hidden',
                            },
                            video: {
                              borderRadius: '0.5rem',
                              objectFit: 'cover' as const,
                              width: '100%',
                              height: '100%',
                            },
                          }}
                        />
                        
                        {/* خطوط راهنمای سفارشی */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-accent"></div>
                          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-accent"></div>
                          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-accent"></div>
                          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-accent"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <div className="text-4xl mb-4">✅</div>
                        <p className="text-accent font-semibold text-center">
                          QR کد با موفقیت اسکن شد!
                        </p>
                        <p className="text-sm text-foreground/80 mt-2 text-center truncate w-full">
                          {scanResult}
                        </p>
                        <button
                          onClick={resetScanner}
                          className="mt-4 px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors"
                        >
                          اسکن مجدد
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* وضعیت اسکن */}
              <div className="mt-4 space-y-2">
                {scanError && (
                  <p className="text-sm text-red-500 text-center p-2 bg-red-500/10 rounded">
                    {scanError}
                  </p>
                )}
                
                {isScanning && !scanError && (
                  <div className="text-center">
                    <p className="text-sm text-foreground/80">
                      دوربین را روی QR کد نگه دارید
                    </p>
                    <div className="flex items-center justify-center mt-2">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse mx-1"></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse mx-1 delay-150"></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse mx-1 delay-300"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* راهنمای اسکن */}
          <div className="mt-8 p-4 bg-accent-4/20 rounded-lg">
            <h3 className="text-accent font-semibold mb-2 text-center">
              راهنمای اسکن QR
            </h3>
            <ul className="text-sm text-foreground/90 space-y-1 text-right">
              <li>• روی دکمه "شروع اسکن" کلیک کنید</li>
              <li>• به دوربین دستگاه اجازه دسترسی دهید</li>
              <li>• دوربین را مقابل QR کد نگه دارید</li>
              <li>• پس از اسکن، به صورت خودکار هدایت می‌شوید</li>
              <li>• برای توقف روی "توقف اسکن" کلیک کنید</li>
            </ul>
          </div>

          <hr />

          {/* سمت چپ: دکمه‌های ناوبری */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-accent mb-4 text-right">
              ورود به سیستم بیزنس ها :
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
          </div>
        </div>
      </main>
    </div>
  );
}