'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useSettings } from '@/components/providers';
import {
  CloseIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
} from '@/components/icons';
import { getAyahAudioSources } from '@/lib/audio';
import {
  MUSHAF_PAGE_COUNT,
  getMushafPageAyahs,
  type MushafPageAyah,
} from '@/lib/mushaf-pages';
import { formatTime, toArabicDigits } from '@/lib/quran';
import { getReciter, reciters, type Reciter } from '@/lib/reciters';

type Queue = {
  page: number;
  ayahs: MushafPageAyah[];
  index: number;
};

type MushafAudioContextValue = {
  page: number | null;
  currentAyah: MushafPageAyah | null;
  ayahIndex: number;
  ayahCount: number;
  reciter: Reciter;
  isVisible: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  autoAdvance: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
  playPage: (page: number) => void;
  toggle: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  stop: () => void;
  setAutoAdvance: (value: boolean) => void;
  setReciterId: (id: string) => void;
  clearError: () => void;
};

const MushafAudioContext = createContext<MushafAudioContextValue | null>(null);

export function useMushafAudio(): MushafAudioContextValue {
  const context = useContext(MushafAudioContext);
  if (!context) throw new Error('useMushafAudio must be used inside MushafAudioProvider');
  return context;
}

/**
 * Keeps one <audio> element alive across /mushaf/[page] navigations, so an
 * entire page (or many pages) can be recited without interruption while the
 * printed page turns automatically.
 */
export function MushafAudioProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const reciter = getReciter(settings.reciterId);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Queue | null>(null);
  const sourcesRef = useRef<string[]>([]);
  const sourceIndexRef = useRef(0);
  const playingRef = useRef(false);
  const autoAdvanceRef = useRef(true);
  const reciterRef = useRef(reciter);
  const routerRef = useRef(router);

  const [queue, setQueue] = useState<Queue | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoAdvance, setAutoAdvanceState] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reciterRef.current = reciter;
  }, [reciter]);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  const currentAyah = queue?.ayahs[queue.index] ?? null;
  const isVisible = Boolean(queue && currentAyah);
  const page = queue?.page ?? null;

  const loadIndex = useCallback(
    (sourceQueue: Queue, index: number, autoplay: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;

      const ayah = sourceQueue.ayahs[index];
      if (!ayah) return;

      const nextQueue: Queue = { ...sourceQueue, index };
      queueRef.current = nextQueue;
      setQueue(nextQueue);

      const sources = getAyahAudioSources(reciterRef.current, ayah.global);
      sourcesRef.current = sources;
      sourceIndexRef.current = 0;

      setCurrentTime(0);
      setDuration(0);
      setError(null);
      setIsLoading(autoplay);

      audio.src = sources[0];
      audio.load();

      if (autoplay) {
        const playPromise = audio.play();
        if (playPromise) {
          playPromise.catch(() => {
            setIsLoading(false);
            setIsPlaying(false);
          });
        }
      }
    },
    [],
  );

  const playPage = useCallback(
    (targetPage: number) => {
      const ayahs = getMushafPageAyahs(targetPage);
      if (!ayahs.length) return;

      loadIndex({ page: targetPage, ayahs, index: 0 }, 0, true);
    },
    [loadIndex],
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !queueRef.current) return;

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise) playPromise.catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const next = useCallback(() => {
    const current = queueRef.current;
    if (!current) return;

    if (current.index + 1 < current.ayahs.length) {
      loadIndex(current, current.index + 1, true);
      return;
    }

    if (current.page < MUSHAF_PAGE_COUNT) {
      const nextPage = current.page + 1;
      const ayahs = getMushafPageAyahs(nextPage);
      if (!ayahs.length) return;

      loadIndex({ page: nextPage, ayahs, index: 0 }, 0, true);
      routerRef.current.push(`/mushaf/${nextPage}`);
    }
  }, [loadIndex]);

  const previous = useCallback(() => {
    const current = queueRef.current;
    if (!current) return;

    if (current.index > 0) {
      loadIndex(current, current.index - 1, true);
      return;
    }

    if (current.page > 1) {
      const previousPage = current.page - 1;
      const ayahs = getMushafPageAyahs(previousPage);
      if (!ayahs.length) return;

      loadIndex(
        { page: previousPage, ayahs, index: 0 },
        ayahs.length - 1,
        true,
      );
      routerRef.current.push(`/mushaf/${previousPage}`);
    }
  }, [loadIndex]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }

    queueRef.current = null;
    setQueue(null);
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, []);

  const setAutoAdvance = useCallback((value: boolean) => {
    autoAdvanceRef.current = value;
    setAutoAdvanceState(value);
  }, []);

  const setReciterId = useCallback(
    (id: string) => {
      updateSettings({ reciterId: id });
    },
    [updateSettings],
  );

  const clearError = useCallback(() => setError(null), []);

  // Reload the current ayah when the reciter changes, preserving playback.
  const previousReciterRef = useRef(reciter.id);
  useEffect(() => {
    if (previousReciterRef.current === reciter.id) return;
    previousReciterRef.current = reciter.id;

    const current = queueRef.current;
    if (current) loadIndex(current, current.index, playingRef.current);
  }, [loadIndex, reciter.id]);

  // Preload the following ayah so transitions are instant.
  useEffect(() => {
    if (!queue || !currentAyah) return;

    const following = queue.ayahs[queue.index + 1];
    if (!following) return;

    const preloader = new Audio(getAyahAudioSources(reciter, following.global)[0]);
    preloader.preload = 'auto';
    preloader.load();

    return () => {
      preloader.removeAttribute('src');
      preloader.load();
    };
  }, [currentAyah, queue, reciter]);

  // Lock-screen / hardware media controls.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    if (!currentAyah || !queue) return;

    if (typeof MediaMetadata !== 'undefined') {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `سورة ${currentAyah.surahName} — الآية ${toArabicDigits(currentAyah.ayah)}`,
        artist: reciter.name,
        album: `مشكاة — صفحة ${toArabicDigits(queue.page)}`,
      });
    }
  }, [currentAyah, queue, reciter.name]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    const audio = audioRef.current;
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => void audio?.play()],
      ['pause', () => audio?.pause()],
      ['previoustrack', () => previous()],
      ['nexttrack', () => next()],
    ];

    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Some actions are not supported by every browser.
      }
    }

    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // Ignore.
        }
      }
    };
  }, [next, previous]);

  // Stop the element when leaving the mushaf section.
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
  }, []);

  const handleEnded = useCallback(() => {
    const current = queueRef.current;
    if (!current) return;

    if (current.index + 1 < current.ayahs.length) {
      loadIndex(current, current.index + 1, true);
      return;
    }

    // End of the page: keep reciting and turn the printed page with the audio.
    if (autoAdvanceRef.current && current.page < MUSHAF_PAGE_COUNT) {
      const nextPage = current.page + 1;
      const ayahs = getMushafPageAyahs(nextPage);

      if (ayahs.length) {
        loadIndex({ page: nextPage, ayahs, index: 0 }, 0, true);
        routerRef.current.push(`/mushaf/${nextPage}`);
        return;
      }
    }

    setIsPlaying(false);
    setIsLoading(false);
  }, [loadIndex]);

  const handleAudioError = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextSourceIndex = sourceIndexRef.current + 1;

    if (nextSourceIndex < sourcesRef.current.length) {
      sourceIndexRef.current = nextSourceIndex;
      audio.src = sourcesRef.current[nextSourceIndex];
      audio.load();
      if (playingRef.current) {
        const playPromise = audio.play();
        if (playPromise) playPromise.catch(() => setIsPlaying(false));
      }
      return;
    }

    setError('تعذّر تشغيل هذه التلاوة. جرّب قارئًا آخر أو أعد المحاولة.');
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const value = useMemo<MushafAudioContextValue>(
    () => ({
      page,
      currentAyah,
      ayahIndex: queue?.index ?? 0,
      ayahCount: queue?.ayahs.length ?? 0,
      reciter,
      isVisible,
      isPlaying,
      isLoading,
      autoAdvance,
      currentTime,
      duration,
      error,
      playPage,
      toggle,
      pause,
      next,
      previous,
      seek,
      stop,
      setAutoAdvance,
      setReciterId,
      clearError,
    }),
    [
      page,
      currentAyah,
      queue?.index,
      queue?.ayahs.length,
      reciter,
      isVisible,
      isPlaying,
      isLoading,
      autoAdvance,
      currentTime,
      duration,
      error,
      playPage,
      toggle,
      pause,
      next,
      previous,
      seek,
      stop,
      setAutoAdvance,
      setReciterId,
      clearError,
    ],
  );

  return (
    <MushafAudioContext.Provider value={value}>
      {children}
      <MushafAudioBar />
      <audio
        ref={audioRef}
        preload="auto"
        className="hidden"
        onPlay={() => {
          setIsPlaying(true);
          setIsLoading(false);
        }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onEnded={handleEnded}
        onError={handleAudioError}
      />
    </MushafAudioContext.Provider>
  );
}

function MushafAudioBar() {
  const {
    page,
    currentAyah,
    ayahIndex,
    ayahCount,
    reciter,
    isVisible,
    isPlaying,
    isLoading,
    autoAdvance,
    currentTime,
    duration,
    error,
    toggle,
    next,
    previous,
    seek,
    stop,
    setAutoAdvance,
    setReciterId,
    clearError,
  } = useMushafAudio();

  if (!isVisible || !currentAyah || page === null) return null;

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-2 pb-2 sm:px-4 sm:pb-4">
      <p className="sr-only" aria-live="polite">
        {isPlaying
          ? `يُتلى الآن بصوت ${reciter.name}: سورة ${currentAyah.surahName}، الآية ${toArabicDigits(
              currentAyah.ayah,
            )}، صفحة ${toArabicDigits(page)}`
          : ''}
      </p>

      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface/95 shadow-[0_-18px_60px_-28px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        {error ? (
          <div className="flex items-center justify-between gap-3 border-b border-border bg-red-500/10 px-4 py-2 text-[11px] text-red-600 dark:text-red-400">
            <span>{error}</span>
            <button
              type="button"
              onClick={clearError}
              className="rounded-full p-1 hover:bg-red-500/10"
              aria-label="إغلاق التنبيه"
            >
              <CloseIcon size={13} />
            </button>
          </div>
        ) : null}

        <div className="px-3 pt-2.5 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="w-11 text-center text-[10px] tabular-nums text-muted">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={Number.isFinite(duration) && duration > 0 ? duration : 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => seek(Number(event.target.value))}
              className="player-range flex-1"
              style={{ '--progress': `${progress}%` } as CSSProperties}
              aria-label="موضع التلاوة"
              disabled={!duration}
            />
            <span className="w-11 text-center text-[10px] tabular-nums text-muted">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-3 pb-3 pt-1.5 sm:flex-nowrap sm:gap-4 sm:px-5 sm:pb-4">
          <div className="flex min-w-0 basis-full flex-1 items-center gap-2.5 sm:basis-auto">
            <span className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/20 font-display text-sm font-semibold text-primary ring-1 ring-border sm:flex">
              {reciter.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">{reciter.name}</p>
              <p className="mt-0.5 truncate text-[10px] text-muted">
                صفحة {toArabicDigits(page)} · سورة {currentAyah.surahName} · الآية{' '}
                {toArabicDigits(currentAyah.ayah)}
                <span className="tabular-nums">
                  {' '}
                  ({toArabicDigits(ayahIndex + 1)}/{toArabicDigits(ayahCount)})
                </span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={previous}
              className="icon-btn"
              aria-label="الآية السابقة"
              title="الآية السابقة"
            >
              <PrevIcon size={18} />
            </button>

            <button
              type="button"
              onClick={toggle}
              className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_rgba(12,74,59,0.9)] transition-transform hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'إيقاف التلاوة مؤقتًا' : 'تشغيل التلاوة'}
            >
              {isLoading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : isPlaying ? (
                <PauseIcon size={19} />
              ) : (
                <PlayIcon size={19} />
              )}
            </button>

            <button
              type="button"
              onClick={next}
              className="icon-btn"
              aria-label="الآية التالية"
              title="الآية التالية"
            >
              <NextIcon size={18} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setAutoAdvance(!autoAdvance)}
              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                autoAdvance
                  ? 'border-accent/60 bg-accent/12 text-accent'
                  : 'border-border text-muted hover:text-foreground'
              }`}
              aria-pressed={autoAdvance}
              title="تقليب الصفحة تلقائيًا بعد انتهاء تلاوة الصفحة"
            >
              تقليب تلقائي
            </button>

            <select
              value={reciter.id}
              onChange={(event) => setReciterId(event.target.value)}
              aria-label="اختيار القارئ"
              className="h-8 max-w-[9.5rem] cursor-pointer rounded-full border border-border bg-surface px-2 text-[10px] font-medium text-foreground outline-none transition-colors hover:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              {reciters.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={stop}
              className="icon-btn"
              aria-label="إغلاق المشغل"
              title="إغلاق المشغل"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
