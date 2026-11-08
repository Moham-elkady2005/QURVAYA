import Link from 'next/link';
import { ArrowLeftIcon, SparkleIcon } from '@/components/icons';
import { CornerOrnament } from '@/components/ornaments';

export function CtaBanner() {
  return (
    <section className="pb-4">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0b3f33] px-6 py-12 text-center text-[#f4efdf] shadow-soft sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cpath d='M70 8 82 42 116 30 104 64 138 70 104 76 116 110 82 98 70 132 58 98 24 110 36 76 2 70 36 64 24 30 58 42Z' fill='none' stroke='%23e8d6a8' stroke-width='1'/%3E%3C/svg%3E\")",
            }}
            aria-hidden="true"
          />
          <CornerOrnament className="pointer-events-none absolute -right-4 -top-4 w-32 rotate-180 text-[#e8d6a8]/25" />
          <CornerOrnament className="pointer-events-none absolute -bottom-4 -left-4 w-32 text-[#e8d6a8]/25" />

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-[#e8d6a8]">
              <SparkleIcon size={13} />
              ابدأ اليوم
            </span>
            <h2 className="mt-5 text-balance font-display text-3xl leading-tight sm:text-4xl">
              اجعل للقرآن موعدًا في يومك
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              صفحة واحدة قد تغيّر يومك. افتح سورة الفاتحة، أو تابع من الموضع الذي تركت
              عنده، ودع الصوت يهدأ بك.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/surah/1"
                className="btn bg-[#e8d6a8] text-[#0b3f33] hover:bg-[#f0e2bd]"
              >
                ابدأ القراءة الآن
                <ArrowLeftIcon size={17} />
              </Link>
              <Link
                href="/reciters"
                className="btn border border-white/20 bg-transparent text-white/85 hover:border-[#e8d6a8]/60 hover:text-[#e8d6a8]"
              >
                استمع لقارئك المفضل
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
