import Link from 'next/link';
import { ArrowLeftIcon, SparkleIcon } from '@/components/icons';
import { toArabicDigits } from '@/lib/quran';

type DailyVerseProps = {
  text: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
};

export function DailyVerse({ text, surahNumber, surahName, ayahNumber }: DailyVerseProps) {
  return (
    <article className="animate-fade-up delay-100 relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-3xl bg-[#0b3f33] p-6 text-[#f4efdf] shadow-soft sm:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath d='M60 6 70 36 100 26 90 56 120 60 90 64 100 94 70 84 60 114 50 84 20 94 30 64 0 60 30 56 20 26 50 36Z' fill='none' stroke='%23e8d6a8' stroke-width='1'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-10 size-52 rounded-full bg-[#e8d6a8]/10 blur-2xl"
        aria-hidden="true"
      />

      <header className="relative flex items-center justify-between gap-3">
        <span className="chip !border-white/15 !bg-white/5 !text-[#e8d6a8]">
          <SparkleIcon size={13} />
          آية اليوم
        </span>
        <span className="font-display text-[11px] tracking-[0.35em] text-white/35">مشكاة</span>
      </header>

      <p className="quran-text relative my-6 text-[1.4rem] leading-[2.15] text-[#fbf7ea] sm:text-[1.65rem]">
        {text}
      </p>

      <footer className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="text-sm text-[#e8d6a8]">
          سورة {surahName} · الآية {toArabicDigits(ayahNumber)}
        </span>
        <Link
          href={`/surah/${surahNumber}#ayah-${ayahNumber}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-[#e8d6a8]"
        >
          اقرأ في سياقها
          <ArrowLeftIcon size={15} />
        </Link>
      </footer>
    </article>
  );
}
