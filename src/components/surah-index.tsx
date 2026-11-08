'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeftIcon, SearchIcon } from '@/components/icons';
import { AyahStar } from '@/components/ornaments';
import {
  normalizeArabic,
  revelationLabel,
  toArabicDigits,
  toLatinDigits,
  type SurahMeta,
} from '@/lib/quran';

type Filter = 'all' | 'Meccan' | 'Medinan';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'كل السور' },
  { value: 'Meccan', label: 'مكية' },
  { value: 'Medinan', label: 'مدنية' },
];

export function SurahIndex({ surahs }: { surahs: SurahMeta[] }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const results = useMemo(() => {
    const normalizedQuery = normalizeArabic(query);
    const numberQuery = toLatinDigits(query.trim());

    return surahs.filter((surah) => {
      if (filter !== 'all' && surah.revelationType !== filter) return false;
      if (!normalizedQuery) return true;

      const haystack = normalizeArabic(
        `${surah.name} ${surah.englishName} ${surah.englishNameTranslation} ${surah.number}`,
      );

      return haystack.includes(normalizedQuery) || String(surah.number) === numberQuery;
    });
  }, [surahs, query, filter]);

  return (
    <section id="surahs" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="chip">فهرس القرآن</span>
            <h2 className="mt-4 text-balance font-display text-3xl leading-tight sm:text-4xl">
              مئة وأربع عشرة سورة بين يديك
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              ابحث بالاسم أو الرقم، واختر ما تشاء من السور المكية والمدنية. كل سورة تحمل
              قراءتها وتلاوتها.
            </p>
          </div>

          <div className="w-full max-w-md">
            <label className="relative block">
              <span className="sr-only">البحث في السور</span>
              <SearchIcon
                size={18}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث باسم السورة أو رقمها…"
                className="h-12 w-full rounded-full border border-border bg-surface pe-11 ps-11 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted/70 focus:border-accent/60 focus:outline-none"
                type="search"
                inputMode="search"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs text-muted hover:text-foreground"
                >
                  مسح
                </button>
              ) : null}
            </label>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                filter === item.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface text-muted hover:border-accent/50 hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
          <span className="ms-auto text-xs text-muted">
            {toArabicDigits(results.length)} سورة
          </span>
        </div>

        {results.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((surah) => (
              <SurahCard key={surah.number} surah={surah} />
            ))}
          </div>
        ) : (
          <div className="surface-card mt-6 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/8 text-primary">
              <SearchIcon size={24} />
            </span>
            <p className="font-display text-xl">لا توجد نتائج مطابقة</p>
            <p className="max-w-sm text-sm text-muted">
              جرّب كتابة اسم السورة بدون تشكيل، أو ابحث برقمها من ١ إلى ١١٤.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFilter('all');
              }}
              className="btn btn-outline mt-2 !py-2.5 text-sm"
            >
              إعادة ضبط البحث
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function SurahCard({ surah }: { surah: SurahMeta }) {
  return (
    <Link
      href={`/surah/${surah.number}`}
      className="group relative flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-lift"
    >
      <AyahStar
        value={surah.number}
        muted
        className="size-12 shrink-0 text-primary transition-colors group-hover:text-accent"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="truncate font-display text-xl font-semibold text-foreground">
            {surah.name}
          </h3>
          <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted/70">
            {surah.englishName}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted">
          <span>{toArabicDigits(surah.numberOfAyahs)} آية</span>
          <span className="size-1 rounded-full bg-accent/50" />
          <span>{revelationLabel(surah.revelationType)}</span>
        </div>
      </div>

      <ArrowLeftIcon
        size={18}
        className="-translate-x-1 text-accent opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
      />
    </Link>
  );
}
