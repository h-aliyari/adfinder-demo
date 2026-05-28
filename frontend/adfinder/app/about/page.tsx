// frontend/adfinder/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* هدر صفحه */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
            درباره ما
          </h1>
          <div className="w-40 h-1 bg-(--color-secondary) mx-auto rounded-full"></div>
        </div>

        {/* کارت اصلی محتوا */}
        <div className="relative group">
          {/* افکت نور پشت کارت */}
          <div className="absolute -inset-1 bg-linear-to-br from-(--color-secondary) to-transparent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          
          <div className="relative bg-[#1a1a4a] border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
             ما با تمرکز بر داده‌محور بودن و سادگی، به شما کمک می‌کنیم تا نبض بازار را در دست بگیرید.
            </p>

            <div className="grid gap-6">
              <FeatureItem 
                title="ماموریت ما" 
                text="شفاف‌سازی و بهینه‌سازی مسیر رشد تبلیغاتی شما." 
              />
              {/* <FeatureItem 
                title="چرا ما؟" 
                text="طراحی کاربرپسند در کنار سرعت بالا، تجربه‌ای متفاوت از مدیریت تبلیغات را برایتان رقم می‌زند." 
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// کامپوننت داخلی برای زیبایی بیشتر
function FeatureItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-0">
      <div className="mt-1.5 w-2 h-2 rounded-full bg-(--color-secondary) shadow-[0_0_10px_var(--color-secondary)]"></div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
