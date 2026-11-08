import Link from 'next/link';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  HeadphonesIcon,
  SparkleIcon,
} from '@/components/icons';
import { CornerOrnament, HeroArch } from '@/components/ornaments';
import { reciters } from '@/lib/reciters';
import { toArabicDigits } from '@/lib/quran';

const stats = [
  { value: 114, label: 'سورة' },
  { value: 6236, label: 'آية' },
  { value: reciters.length, label: 'قارئًا' },
];

export function HomeHero() {
  return (
    <section className="pattern-bg relative overflow-hidden border-b border-border/60">
      <CornerOrnament className="pointer-events-none absolute -left-6 top-6 hidden w-40 text-accent/30 lg:block" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:py-20">
          <div className="animate-fade-up">
            <span className="chip !border-accent/30 !bg-accent/5 !text-accent">
              <SparkleIcon size={14} />
              تجربة قراءة هادئة
            </span>

            <h1 className="mt-6 text-balance font-quran text-[2.2rem] font-normal leading-[1.65] tracking-tight text-foreground sm:text-[3rem] lg:text-[3.5rem]">
              وَرَتِّلِ{' '}
              <span className="relative whitespace-nowrap text-primary">
                ٱلْقُرْآنَ
                <svg
                  viewBox="0 0 220 12"
                  className="absolute -bottom-2 right-0 h-2.5 w-full text-accent/60"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8c40-5 76-5 108-2 34 3 70 3 108-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              تَرْتِيلًا
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
              اقرأ كتاب الله بالرسم العثماني في صفحة مصمّمة للتركيز، واستمع لتلاوات مختارة،
              وتابع موضعك بين الآيات. كل شيء يعمل بهدوء، ويُحفظ على جهازك.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/surah/1" className="btn btn-primary">
                ابدأ القراءة
                <ArrowLeftIcon size={18} />
              </Link>
              <Link href="/#surahs" className="btn btn-outline">
                <BookOpenIcon size={18} />
                تصفّح السور
              </Link>
            </div>

            <dl className="mt-11 grid max-w-md grid-cols-3 divide-x divide-x-reverse divide-border/80 rounded-2xl border border-border/70 bg-surface/60 px-2 py-4 backdrop-blur">
              {stats.map((stat) => (
                <div key={stat.label} className="px-3 text-center">
                  <dt className="order-2 mt-1 text-[11px] font-medium tracking-wide text-muted">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                    {toArabicDigits(stat.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-fade-in relative mx-auto w-full max-w-[430px] lg:max-w-none">
            <HeroArch className="mx-auto h-[400px] w-full drop-shadow-[0_30px_60px_rgba(12,74,59,0.12)] sm:h-[480px] lg:h-[520px]" />

            <Link
              href="/surah/18"
              className="absolute bottom-10 start-0 hidden items-center gap-3 rounded-2xl border border-border/80 bg-surface/90 px-4 py-3 shadow-lift backdrop-blur transition-transform hover:-translate-y-0.5 sm:flex"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HeadphonesIcon size={18} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[11px] text-muted">استماع مقترح</span>
                <span className="font-display text-sm font-semibold">سورة الكهف</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
