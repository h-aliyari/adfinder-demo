// D:\adfinder\frontend\adfinder\app\home-2\login-register\business-register\page.tsx

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
      <div className="w-full max-w-lg bg-[var(--color-primary)] border border-[var(--color-secondary)] p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">
          ثبت‌نام بیزنس جدید
        </h1>
        
        <form className="space-y-4">
          {/* نام صاحب بیزنس */}
          <InputField label="نام صاحب بیزنس" type="text" placeholder="نام و نام خانوادگی" />
          
          {/* اسم بیزنس و نوع بیزنس */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="نام بیزنس" type="text" placeholder=" " />
            <div className="flex flex-col">
              <label className="text-[var(--color-text-primary)] mb-1 text-sm">نوع بیزنس</label>
              <select className="p-3 rounded-lg bg-[var(--foreground)] text-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                <option>کافه</option>
                <option>رستوران</option>
                <option>کلینیک</option>
                <option>سایر</option>
              </select>
            </div>
          </div>

          <InputField label="شماره تماس" type="tel" placeholder="09........." />
          <InputField label="ایمیل" type="email" placeholder="example@gmail.com" />
          <InputField label="آدرس" type="text" placeholder=" " />
          
          <div className="grid grid-cols-2 gap-4">
            <InputField label="رمز عبور" type="password" placeholder="******" />
            <InputField label="تکرار رمز عبور" type="password" placeholder="******" />
          </div>

          <button className="w-full mt-6 p-3 bg-[var(--color-accent)] text-[var(--color-primary)] font-bold rounded-lg hover:bg-[var(--color-accent-4)] transition-colors">
            ثبت بیزنس
          </button>
        </form>
      </div>
    </div>
  );
}

// کامپوننت کمکی برای فیلدها
function InputField({ label, type, placeholder }: { label: string; type: string; placeholder: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-[var(--color-text-primary)] mb-1 text-sm">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="p-3 rounded-lg bg-[var(--foreground)] text-[var(--background)] placeholder-[var(--background)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      />
    </div>
  );
}
