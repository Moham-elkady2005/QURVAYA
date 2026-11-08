import Link from 'next/link';
import { ArrowLeftIcon, HeadphonesIcon } from '@/components/icons';
import { reciters } from '@/lib/reciters';

const featured = reciters.slice(0, 8);

export function RecitersShowcase() {
  return (
    <section className="border-y border-border/70 bg-surface/50 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="chip">
              <HeadphonesIcon size={13} />
              الاستماع
            </span>
            <h2 className="mt-4 text-balance font-display text-3xl leading-tight sm:text-4xl">
              أصوات تُطمئن القلب
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              نخبة من القرّاء برواية حفص عن عاصم، بتلاوة متصلة آية بآية مع تحكم كامل في
              السرعة والتكرار.
            </p>
          </div>

          <Link href="/reciters" className="btn btn-outline !py-2.5 text-sm">
            كل القرّاء
            <ArrowLeftIcon size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((reciter) => (
            <Link
              key={reciter.id}
              href={`/surah/1?reciter=${reciter.id}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-lift"
            >
              <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/20 font-display text-lg font-semibold text-primary ring-1 ring-border transition-colors group-hover:from-primary group-hover:to-primary group-hover:text-primary-foreground">
                {reciter.name.charAt(0)}
                <span className="absolute -bottom-0.5 -end-0.5 flex size-4 items-center justify-center rounded-full bg-surface text-accent ring-1 ring-border">
                  <HeadphonesIcon size={9} />
                </span>
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {reciter.name}
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
                  <span>{reciter.style}</span>
                  <span className="size-1 rounded-full bg-accent/50" />
                  <span>{reciter.bitrate === 128 ? 'جودة عالية' : 'جودة متوسطة'}</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
