'use client';

import Link from 'next/link';
import { ArrowLeftIcon, BookOpenIcon, BookmarkIcon, ClockIcon } from '@/components/icons';
import { useBookmarksSnapshot, useHydrated, useLastReadSnapshot } from '@/lib/storage';
import { getSurahMeta, toArabicDigits } from '@/lib/quran';

export function ContinueReading({ delayClass = '' }: { delayClass?: string }) {
  const lastRead = useLastReadSnapshot();
  const bookmarks = useBookmarksSnapshot();
  const hydrated = useHydrated();
  const bookmarkCount = bookmarks.length;

  if (!hydrated) {
    return (
      <div
        className={`surface-card flex min-h-[15rem] animate-pulse-soft flex-col justify-between p-6 ${delayClass}`}
        aria-hidden="true"
      >
        <div className="h-5 w-24 rounded-full bg-foreground/5" />
        <div className="space-y-3">
          <div className="h-9 w-40 rounded-xl bg-foreground/5" />
          <div className="h-4 w-28 rounded-full bg-foreground/5" />
        </div>
        <div className="h-11 w-full rounded-full bg-foreground/5" />
      </div>
    );
  }

  const meta = lastRead ? getSurahMeta(lastRead.surah) : undefined;
  const progress =
    lastRead && meta ? Math.max(4, Math.round((lastRead.ayah / meta.numberOfAyahs) * 100)) : 0;

  return (
    <div
      className={`surface-card animate-fade-up relative flex min-h-[15rem] flex-col justify-between overflow-hidden p-6 ${delayClass}`}
    >
      <div
        className="pointer-events-none absolute -left-10 -top-10 size-36 rounded-full bg-primary/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between">
        <span className="chip !border-primary/20 !bg-primary/5 !text-primary">
          <ClockIcon size={13} />
          آخر قراءة
        </span>
        {bookmarkCount > 0 ? (
          <Link
            href="/bookmarks"
            className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent"
          >
            <BookmarkIcon size={14} />
            {toArabicDigits(bookmarkCount)} محفوظة
          </Link>
        ) : null}
      </div>

      {lastRead && meta ? (
        <>
          <div className="relative mt-5">
            <p className="text-[11px] font-medium tracking-wide text-muted">تابع من حيث توقفت</p>
            <h2 className="mt-1.5 font-display text-3xl font-semibold text-foreground">
              سورة {meta.name}
            </h2>
            <p className="mt-2 text-sm text-muted">
              الآية {toArabicDigits(lastRead.ayah)} من {toArabicDigits(meta.numberOfAyahs)}
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-foreground/8">
              <div
                className="h-full rounded-full bg-gradient-to-l from-accent to-primary transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Link
            href={`/surah/${lastRead.surah}?ayah=${lastRead.ayah}`}
            className="btn btn-primary relative mt-6 w-full !py-3 text-sm"
          >
            متابعة القراءة
            <ArrowLeftIcon size={16} />
          </Link>
        </>
      ) : (
        <>
          <div className="relative mt-5">
            <p className="text-[11px] font-medium tracking-wide text-muted">بداية الرحلة</p>
            <h2 className="mt-1.5 font-display text-3xl font-semibold text-foreground">
              لم تبدأ بعد
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              افتح المصحف وابدأ بسورة الفاتحة، وسنحفظ موضعك تلقائيًا.
            </p>
          </div>
          <Link href="/surah/1" className="btn btn-primary relative mt-6 w-full !py-3 text-sm">
            <BookOpenIcon size={16} />
            ابدأ بالفاتحة
          </Link>
        </>
      )}
    </div>
  );
}
