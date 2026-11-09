'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  BookmarkIcon,
  CheckIcon,
  CopyIcon,
  PauseIcon,
  PlayIcon,
  ShareIcon,
} from '@/components/icons';
import { AyahStar } from '@/components/ornaments';
import { useSettings } from '@/components/providers';
import { stripBasmala, toArabicDigits, type Ayah, type Surah } from '@/lib/quran';
import {
  isBookmarked,
  toggleBookmark,
  useBookmarksSnapshot,
} from '@/lib/storage';
import { useAudio } from './audio-provider';

type AyahListProps = {
  surah: Surah;
};

export function AyahList({ surah }: AyahListProps) {
  const { settings } = useSettings();
  const { currentAyah, isPlaying, playAyah, toggle } = useAudio();
  const bookmarks = useBookmarksSnapshot();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [sharedKey, setSharedKey] = useState<string | null>(null);
  const mushafRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const rawAyah = hash.startsWith('#ayah-')
      ? hash.slice('#ayah-'.length)
      : params.get('ayah');

    if (!rawAyah || !/^\d+$/.test(rawAyah)) return;

    const findTarget = () =>
      mushafRef.current?.querySelector<HTMLElement>(`[data-ayah-number="${rawAyah}"]`);

    if (!findTarget()) return;

    let cancelled = false;
    let interacted = false;

    const markInteracted = () => {
      interacted = true;
    };

    const align = (behavior: ScrollBehavior) => {
      if (cancelled || interacted) return;

      const target = findTarget();
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - 170;
      window.scrollTo({ top, behavior });
    };

    const frame = window.requestAnimationFrame(() => align('smooth'));

    // The Arabic webfont swaps after the first paint and shifts the whole mushaf,
    // so realign once fonts are ready — but never after the reader starts moving.
    document.fonts?.ready
      .then(() => {
        if (cancelled || interacted) return;

        const target = findTarget();
        if (!target) return;
        if (Math.abs(target.getBoundingClientRect().top - 170) > 60) align('auto');
      })
      .catch(() => {});

    window.addEventListener('wheel', markInteracted, { passive: true, once: true });
    window.addEventListener('touchstart', markInteracted, { passive: true, once: true });
    window.addEventListener('keydown', markInteracted, { once: true });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('wheel', markInteracted);
      window.removeEventListener('touchstart', markInteracted);
      window.removeEventListener('keydown', markInteracted);
    };
  }, []);

  useEffect(() => {
    if (!settings.autoScroll || !currentAyah || !isPlaying) return;

    const target = mushafRef.current?.querySelector<HTMLElement>(
      `[data-ayah-number="${currentAyah.numberInSurah}"]`,
    );
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const topLimit = 150;
    const bottomLimit = window.innerHeight - 170;

    if (rect.top < topLimit || rect.bottom > bottomLimit) {
      const comfortableTop = window.innerHeight * 0.38;
      window.scrollTo({
        top: rect.top + window.scrollY - comfortableTop,
        behavior: 'smooth',
      });
    }
  }, [currentAyah, isPlaying, settings.autoScroll]);

  const handleCopy = async (ayah: Ayah, text: string) => {
    const key = `${surah.number}:${ayah.numberInSurah}`;

    try {
      await navigator.clipboard.writeText(
        `${text} ﴿سورة ${surah.name} — الآية ${toArabicDigits(ayah.numberInSurah)}﴾`,
      );
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((value) => (value === key ? null : value)), 1600);
    } catch {
      setCopiedKey(null);
    }
  };

  const handleShare = async (ayah: Ayah, text: string) => {
    const key = `${surah.number}:${ayah.numberInSurah}`;
    const url = `${window.location.origin}/surah/${surah.number}#ayah-${ayah.numberInSurah}`;
    const title = `سورة ${surah.name} — الآية ${toArabicDigits(ayah.numberInSurah)}`;

    // Native share sheet on supported devices (mostly mobile).
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: `${text}\n${url}`, url });
        return;
      } catch (error) {
        // The user dismissing the sheet is not an error — stop quietly.
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    // Desktop fallback: copy the deep link to the clipboard.
    try {
      await navigator.clipboard.writeText(url);
      setSharedKey(key);
      window.setTimeout(() => setSharedKey((value) => (value === key ? null : value)), 1600);
    } catch {
      setSharedKey(null);
    }
  };

  const handleBookmark = (ayah: Ayah, text: string) => {
    toggleBookmark({
      surah: surah.number,
      surahName: surah.name,
      ayah: ayah.numberInSurah,
      text,
    });
  };

  return (
    <div
      className="surface-card relative mt-4 px-4 py-7 sm:px-9 sm:py-9"
      style={{ '--quran-size': `${settings.fontSize}px` } as CSSProperties}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/[0.06] to-transparent" />
        <div className="absolute inset-x-8 top-3 h-px bg-gradient-to-l from-transparent via-accent/25 to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-2 rounded-[1.35rem] border border-accent/10 sm:inset-3" />

      <div ref={mushafRef} className="mushaf-text quran-text relative text-foreground">
        {surah.ayahs.map((ayah) => {
          const text = stripBasmala(ayah.text, surah.number, ayah.numberInSurah);
          const active = currentAyah?.numberInSurah === ayah.numberInSurah;
          const playingThisAyah = active && isPlaying;
          const key = `${surah.number}:${ayah.numberInSurah}`;
          const bookmarked = isBookmarked(bookmarks, surah.number, ayah.numberInSurah);
          const copied = copiedKey === key;
          const shared = sharedKey === key;

          return (
            <span
              key={key}
              id={`ayah-${ayah.numberInSurah}`}
              data-ayah-number={ayah.numberInSurah}
              aria-current={active ? 'true' : undefined}
              className={`ayah-inline group relative scroll-mt-40 rounded-[0.4em] px-[0.06em] transition-colors ${
                active ? 'bg-accent/[0.13]' : 'hover:bg-foreground/[0.04]'
              }`}
            >
              {text}
              <span className="relative mx-[0.14em] inline-flex translate-y-[0.14em] items-center align-middle">
                <button
                  type="button"
                  onClick={() => (active ? toggle() : playAyah(ayah))}
                  className={`inline-flex items-center rounded-full text-accent transition-all hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                    playingThisAyah ? 'scale-110 text-primary' : ''
                  }`}
                  aria-label={
                    playingThisAyah
                      ? `إيقاف تلاوة الآية ${toArabicDigits(ayah.numberInSurah)}`
                      : `تشغيل الآية ${toArabicDigits(ayah.numberInSurah)}`
                  }
                  title={playingThisAyah ? 'إيقاف' : 'استماع'}
                >
                  <AyahStar value={ayah.numberInSurah} className="size-[1.25em]" />
                </button>

                <span className="invisible pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 opacity-0 transition-all group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  <AyahActions
                    playing={playingThisAyah}
                    bookmarked={bookmarked}
                    copied={copied}
                    shared={shared}
                    onPlay={() => (active ? toggle() : playAyah(ayah))}
                    onBookmark={() => handleBookmark(ayah, text)}
                    onCopy={() => void handleCopy(ayah, text)}
                    onShare={() => void handleShare(ayah, text)}
                  />
                </span>
              </span>
              {ayah.sajda ? (
                <span className="mx-1 inline-flex translate-y-[-0.1em] rounded-full border border-accent/40 bg-accent/10 px-1.5 py-0.5 align-middle font-sans text-[9px] font-medium text-accent">
                  سجدة
                </span>
              ) : null}{' '}
            </span>
          );
        })}
      </div>
    </div>
  );
}

type AyahActionsProps = {
  playing: boolean;
  bookmarked: boolean;
  copied: boolean;
  shared: boolean;
  onPlay: () => void;
  onBookmark: () => void;
  onCopy: () => void;
  onShare: () => void;
};

function AyahActions({
  playing,
  bookmarked,
  copied,
  shared,
  onPlay,
  onBookmark,
  onCopy,
  onShare,
}: AyahActionsProps) {
  return (
    <span className="flex items-center gap-0.5 rounded-full border border-border bg-surface/95 p-1 shadow-lift backdrop-blur">
      <button
        type="button"
        onClick={onPlay}
        className="icon-btn size-8 text-primary"
        aria-label={playing ? 'إيقاف التلاوة' : 'تشغيل الآية'}
        title={playing ? 'إيقاف' : 'استماع'}
      >
        {playing ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
      </button>

      <button
        type="button"
        onClick={onBookmark}
        className={`icon-btn size-8 ${bookmarked ? 'text-accent' : ''}`}
        aria-label={bookmarked ? 'إزالة من المحفوظات' : 'حفظ الآية'}
        aria-pressed={bookmarked}
        title={bookmarked ? 'إزالة من المحفوظات' : 'حفظ الآية'}
      >
        <BookmarkIcon size={15} filled={bookmarked} />
      </button>

      <button
        type="button"
        onClick={onCopy}
        className="icon-btn size-8"
        aria-label="نسخ الآية"
        title="نسخ الآية"
      >
        {copied ? <CheckIcon size={15} className="text-primary" /> : <CopyIcon size={15} />}
      </button>

      <button
        type="button"
        onClick={onShare}
        className={`icon-btn size-8 ${shared ? 'text-primary' : ''}`}
        aria-label={shared ? 'تم نسخ رابط الآية' : 'مشاركة الآية'}
        title={shared ? 'تم نسخ الرابط' : 'مشاركة الآية'}
      >
        {shared ? <CheckIcon size={15} /> : <ShareIcon size={15} />}
      </button>
    </span>
  );
}
