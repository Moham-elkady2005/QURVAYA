'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  PauseIcon,
  PlayIcon,
} from '@/components/icons';
import { Bismillah, CornerOrnament } from '@/components/ornaments';
import { useSettings } from '@/components/providers';
import {
  getSurahMeta,
  hasBasmala,
  revelationLabel,
  toArabicDigits,
  type Surah,
} from '@/lib/quran';
import { getReciter, reciters } from '@/lib/reciters';
import { useHydrated, useUrlParam, writeLastRead } from '@/lib/storage';
import { AudioPlayer } from './audio-player';
import { AudioProvider, useAudio } from './audio-provider';
import { AyahList } from './ayah-list';
import { ReciterSelect } from './reciter-select';
import { SettingsMenu } from './settings-menu';

type ReadingExperienceProps = {
  surah: Surah;
  initialReciterId: string;
};

export function ReadingExperience({ surah, initialReciterId }: ReadingExperienceProps) {
  const { settings, updateSettings } = useSettings();
  const hydrated = useHydrated();
  const urlReciter = useUrlParam('reciter');
  const [overrideReciterId, setOverrideReciterId] = useState<string | null>(null);

  const validUrlReciter =
    urlReciter && reciters.some((reciter) => reciter.id === urlReciter) ? urlReciter : null;

  const reciterId =
    overrideReciterId ??
    validUrlReciter ??
    (hydrated ? settings.reciterId : initialReciterId);

  const handleReciterChange = (id: string) => {
    setOverrideReciterId(id);
    updateSettings({ reciterId: id });

    const url = new URL(window.location.href);
    url.searchParams.set('reciter', id);
    window.history.replaceState(null, '', url);
  };

  const reciter = getReciter(reciterId);

  return (
    <AudioProvider surah={surah} reciter={reciter}>
      <ReadingLayout
        surah={surah}
        reciterId={reciterId}
        onReciterChange={handleReciterChange}
      />
    </AudioProvider>
  );
}

function ReadingLayout({
  surah,
  reciterId,
  onReciterChange,
}: {
  surah: Surah;
  reciterId: string;
  onReciterChange: (id: string) => void;
}) {
  const { isPlaying, toggle, next, previous } = useAudio();
  const readingRef = useRef<HTMLDivElement>(null);
  const previousSurah = surah.number > 1 ? getSurahMeta(surah.number - 1) : undefined;
  const nextSurah = surah.number < 114 ? getSurahMeta(surah.number + 1) : undefined;

  // Keyboard shortcuts: space toggles playback, arrows move between ayahs.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)) return;

      if (event.code === 'Space') {
        event.preventDefault();
        toggle();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        next();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        previous();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, previous, toggle]);

  // Track the ayah closest to the reading position for "continue reading".
  useEffect(() => {
    let timeout = 0;

    const savePosition = () => {
      if (timeout) window.clearTimeout(timeout);

      timeout = window.setTimeout(() => {
        timeout = 0;
        const container = readingRef.current;
        if (!container || container.getClientRects().length === 0) return;

        const elements = container.querySelectorAll<HTMLElement>('[data-ayah-number]');
        let currentAyah = 1;

        for (const element of elements) {
          if (element.getBoundingClientRect().top < window.innerHeight * 0.55) {
            currentAyah = Number(element.dataset.ayahNumber) || currentAyah;
          } else {
            break;
          }
        }

        writeLastRead({
          surah: surah.number,
          surahName: surah.name,
          ayah: currentAyah,
          at: Date.now(),
        });
      }, 400);
    };

    savePosition();
    window.addEventListener('scroll', savePosition, { passive: true });
    return () => {
      window.removeEventListener('scroll', savePosition);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [surah.name, surah.number]);

  return (
    <div ref={readingRef} className="pb-36 sm:pb-32">
      <div className="sticky top-[74px] z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6">
          <Link
            href="/#surahs"
            className="icon-btn shrink-0"
            aria-label="العودة إلى فهرس السور"
            title="فهرس السور"
          >
            <ArrowRightIcon size={19} />
          </Link>

          <div className="me-auto min-w-0">
            <p className="truncate font-display text-sm font-semibold text-foreground">
              سورة {surah.name}
            </p>
            <p className="mt-0.5 text-[10px] text-muted">
              {revelationLabel(surah.revelationType)} · {toArabicDigits(surah.numberOfAyahs)} آية
            </p>
          </div>

          <ReciterSelect
            value={reciterId}
            onChange={onReciterChange}
            className="order-last w-full sm:order-none sm:w-56"
          />
          <SettingsMenu />

          <Link
            href={`/mushaf/${surah.ayahs[0]?.page ?? 1}`}
            className="icon-btn shrink-0"
            aria-label="فتح صفحة المصحف"
            title="وضع المصحف"
          >
            <BookOpenIcon size={18} />
          </Link>

          <button
            type="button"
            onClick={toggle}
            className="btn btn-primary !px-4 !py-2.5 text-xs"
            aria-label={isPlaying ? 'إيقاف تلاوة السورة' : 'تشغيل السورة'}
          >
            {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            <span className="hidden sm:inline">{isPlaying ? 'إيقاف' : 'تشغيل السورة'}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-3 pt-5 sm:px-6 sm:pt-8">
        <header className="relative overflow-hidden rounded-[1.75rem] border border-border bg-surface px-5 py-9 text-center shadow-soft sm:px-8 sm:py-12">
          <div className="pattern-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <CornerOrnament className="pointer-events-none absolute -right-3 -top-3 w-28 text-accent/30" />
          <CornerOrnament className="pointer-events-none absolute -bottom-3 -left-3 w-28 rotate-180 text-accent/30" />

          <div className="relative">
            <span className="chip">
              {revelationLabel(surah.revelationType)} · ترتيبها {toArabicDigits(surah.number)}
            </span>

            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              سورة {surah.name}
            </h1>

            <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-muted">
              {surah.englishName}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="chip">{toArabicDigits(surah.numberOfAyahs)} آية</span>
              <span className="chip">الجزء {toArabicDigits(surah.ayahs[0]?.juz ?? 1)}</span>
              <span className="chip">رواية حفص عن عاصم</span>
            </div>

            {hasBasmala(surah.number) ? <Bismillah className="mt-8" /> : null}
          </div>
        </header>

        <AyahList surah={surah} />

        <nav className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="التنقل بين السور">
          {previousSurah ? (
            <Link
              href={`/surah/${previousSurah.number}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-all hover:border-accent/45 hover:shadow-lift"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/8 text-primary">
                <ArrowRightIcon size={17} />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] text-muted">السورة السابقة</span>
                <span className="mt-0.5 block truncate font-display text-sm font-semibold">
                  سورة {previousSurah.name}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}

          {nextSurah ? (
            <Link
              href={`/surah/${nextSurah.number}`}
              className="group flex items-center justify-end gap-3 rounded-2xl border border-border bg-surface p-4 text-end transition-all hover:border-accent/45 hover:shadow-lift"
            >
              <span className="min-w-0">
                <span className="block text-[10px] text-muted">السورة التالية</span>
                <span className="mt-0.5 block truncate font-display text-sm font-semibold">
                  سورة {nextSurah.name}
                </span>
              </span>
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/8 text-primary">
                <ArrowLeftIcon size={17} />
              </span>
            </Link>
          ) : null}
        </nav>

        <p className="mt-6 text-center text-[11px] text-muted/80">
          النص بالرسم العثماني · التلاوة بصوت {getReciter(reciterId).name}
        </p>
      </div>

      <AudioPlayer />
    </div>
  );
}
