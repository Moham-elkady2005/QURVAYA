'use client';

import Link from 'next/link';
import { ArrowLeftIcon, BookmarkIcon, CloseIcon, SearchIcon } from '@/components/icons';
import { toArabicDigits } from '@/lib/quran';
import {
  clearBookmarks,
  removeBookmark,
  useBookmarksSnapshot,
  useHydrated,
} from '@/lib/storage';

export function BookmarksList() {
  const bookmarks = useBookmarksSnapshot();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="mt-8 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="surface-card animate-pulse-soft h-32" />
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="surface-card mt-8 flex flex-col items-center px-6 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/8 text-primary">
          <BookmarkIcon size={26} />
        </span>
        <h2 className="mt-5 font-display text-2xl">لا توجد آيات محفوظة بعد</h2>
        <p className="mt-2 max-w-sm text-sm leading-7 text-muted">
          أثناء القراءة، اضغط على أيقونة الحفظ بجانب أي آية لتجدها هنا لاحقًا.
        </p>
        <Link href="/surah/1" className="btn btn-primary mt-6">
          <SearchIcon size={16} />
          ابدأ القراءة
        </Link>
      </div>
    );
  }

  const clearAll = () => {
    if (!window.confirm('هل تريد إزالة كل المحفوظات؟')) return;
    clearBookmarks();
  };

  return (
    <>
      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-xs text-muted">
          {toArabicDigits(bookmarks.length)} آية محفوظة
        </p>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-full border border-border px-3 py-1.5 text-[11px] text-muted transition-colors hover:border-red-400/60 hover:text-red-500"
        >
          مسح الكل
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        {bookmarks.map((bookmark) => (
          <li key={`${bookmark.surah}:${bookmark.ayah}`}>
            <article className="surface-card group relative p-5">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/surah/${bookmark.surah}#ayah-${bookmark.ayah}`}
                  className="flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-accent"
                >
                  <BookmarkIcon size={14} filled />
                  سورة {bookmark.surahName} · الآية {toArabicDigits(bookmark.ayah)}
                </Link>

                <button
                  type="button"
                  onClick={() => removeBookmark(bookmark.surah, bookmark.ayah)}
                  className="icon-btn size-8 opacity-60 transition-opacity hover:opacity-100"
                  aria-label={`إزالة حفظ الآية ${bookmark.ayah} من سورة ${bookmark.surahName}`}
                  title="إزالة"
                >
                  <CloseIcon size={15} />
                </button>
              </div>

              <p className="quran-text mt-3 line-clamp-3 text-[1.15rem] leading-[2] text-foreground/90">
                {bookmark.text}
              </p>

              <Link
                href={`/surah/${bookmark.surah}#ayah-${bookmark.ayah}`}
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted transition-colors hover:text-accent"
              >
                اقرأ في سياقها
                <ArrowLeftIcon size={13} />
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
