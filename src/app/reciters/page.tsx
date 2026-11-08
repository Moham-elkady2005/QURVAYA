import type { Metadata } from 'next';
import Link from 'next/link';
import { HeadphonesIcon, PlayIcon } from '@/components/icons';
import { reciters } from '@/lib/reciters';

export const metadata: Metadata = {
  title: 'القرّاء',
  description:
    'استمع إلى القرآن الكريم بصوت نخبة من القرّاء برواية حفص عن عاصم، مع تلاوة متصلة آية بآية وتحكم كامل في السرعة والتكرار.',
  alternates: { canonical: '/reciters' },
};

export default function RecitersPage() {
  return (
    <>
      <section className="pattern-bg border-b border-border/70">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <span className="chip">
            <HeadphonesIcon size={13} />
            الاستماع
          </span>
          <h1 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">
            أصوات تُطمئن القلب
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            نخبة من القرّاء برواية حفص عن عاصم. اختر قارئك، وابدأ من الفاتحة أو الكهف، ثم
            تابع القراءة مع التلاوة آية بآية.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="chip">١٧ قارئًا</span>
            <span className="chip">رواية حفص عن عاصم</span>
            <span className="chip">تلاوة آية بآية</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reciters.map((reciter) => (
            <article
              key={reciter.id}
              className="surface-card flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lift"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/20 font-display text-xl font-semibold text-primary ring-1 ring-border">
                  {reciter.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-lg font-semibold">{reciter.name}</h2>
                  <p className="mt-0.5 truncate text-[11px] text-muted">{reciter.englishName}</p>
                </div>
                <span className="chip shrink-0">{reciter.style}</span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-muted">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">
                  {reciter.bitrate === 128 ? 'جودة عالية' : 'جودة متوسطة'}
                </span>
                <span className="size-1 rounded-full bg-border" />
                <span>رواية حفص</span>
              </div>

              <div className="mt-5 flex gap-2">
                <Link
                  href={`/surah/1?reciter=${reciter.id}`}
                  className="btn btn-primary flex-1 !px-3 !py-2.5 text-xs"
                >
                  <PlayIcon size={13} />
                  استمع للفاتحة
                </Link>
                <Link
                  href={`/surah/18?reciter=${reciter.id}`}
                  className="btn btn-outline !px-3 !py-2.5 text-xs"
                >
                  الكهف
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-[11px] leading-6 text-muted/80">
          الصوتيات مقدمة عبر Islamic Network — تُشغَّل الآيات من CDN مباشرة، وقد تختلف
          الجودة حسب القارئ.
        </p>
      </section>
    </>
  );
}
