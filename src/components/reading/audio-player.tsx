'use client';

import { useState, type CSSProperties } from 'react';
import {
  BookmarkIcon,
  CheckIcon,
  CloseIcon,
  CopyIcon,
  MuteIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  VolumeIcon,
} from '@/components/icons';
import { formatTime, stripBasmala, toArabicDigits } from '@/lib/quran';
import {
  isBookmarked,
  toggleBookmark,
  useBookmarksSnapshot,
} from '@/lib/storage';
import { useAudio } from './audio-provider';

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export function AudioPlayer() {
  const {
    surah,
    reciter,
    currentAyah,
    isPlaying,
    isLoading,
    isVisible,
    repeat,
    speed,
    volume,
    muted,
    currentTime,
    duration,
    error,
    toggle,
    next,
    previous,
    seek,
    setRepeat,
    setSpeed,
    setVolume,
    toggleMute,
    stop,
    clearError,
  } = useAudio();
  const bookmarks = useBookmarksSnapshot();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isVisible || !currentAyah) return null;

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const volumeProgress = muted ? 0 : volume * 100;
  const ayahKey = `${surah.number}:${currentAyah.numberInSurah}`;
  const bookmarked = isBookmarked(bookmarks, surah.number, currentAyah.numberInSurah);
  const copied = copiedKey === ayahKey;
  const ayahText = stripBasmala(
    currentAyah.text,
    surah.number,
    currentAyah.numberInSurah,
  );

  const handleBookmark = () => {
    toggleBookmark({
      surah: surah.number,
      surahName: surah.name,
      ayah: currentAyah.numberInSurah,
      text: ayahText,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${ayahText} ﴿سورة ${surah.name} — الآية ${toArabicDigits(currentAyah.numberInSurah)}﴾`,
      );
      setCopiedKey(ayahKey);
      window.setTimeout(
        () => setCopiedKey((value) => (value === ayahKey ? null : value)),
        1600,
      );
    } catch {
      setCopiedKey(null);
    }
  };

  const cycleSpeed = () => {
    const index = SPEEDS.indexOf(speed);
    setSpeed(SPEEDS[(index + 1) % SPEEDS.length] ?? 1);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-2 pb-2 sm:px-4 sm:pb-4">
      <p className="sr-only" aria-live="polite">
        {isPlaying
          ? `يُتلى الآن بصوت ${reciter.name}: سورة ${surah.name}، الآية ${toArabicDigits(currentAyah.numberInSurah)}`
          : ''}
      </p>

      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface/95 shadow-[0_-18px_60px_-28px_rgba(0,0,0,0.55)] backdrop-blur-xl">
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
                سورة {surah.name} · الآية {toArabicDigits(currentAyah.numberInSurah)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={handleBookmark}
                className={`icon-btn size-8 ${
                  bookmarked ? 'text-accent' : 'opacity-60 hover:opacity-100'
                }`}
                aria-label={bookmarked ? 'إزالة من المحفوظات' : 'حفظ الآية'}
                aria-pressed={bookmarked}
                title={bookmarked ? 'إزالة من المحفوظات' : 'حفظ الآية'}
              >
                <BookmarkIcon size={14} filled={bookmarked} />
              </button>
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="icon-btn size-8 opacity-60 hover:opacity-100"
                aria-label="نسخ الآية"
                title="نسخ الآية"
              >
                {copied ? (
                  <CheckIcon size={14} className="text-primary" />
                ) : (
                  <CopyIcon size={14} />
                )}
              </button>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
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

            <button
              type="button"
              onClick={() => setRepeat(!repeat)}
              className={`icon-btn ${
                repeat ? 'bg-accent/12 text-accent' : ''
              }`}
              aria-label={repeat ? 'إيقاف تكرار الآية' : 'تكرار الآية'}
              aria-pressed={repeat}
              title={repeat ? 'إيقاف التكرار' : 'تكرار الآية'}
            >
              <RepeatIcon size={17} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-end gap-1">
            <button
              type="button"
              onClick={cycleSpeed}
              className="rounded-full border border-border px-2 py-1 text-[10px] font-semibold text-muted transition-colors hover:border-accent/60 hover:text-foreground"
              aria-label={`سرعة التلاوة ${speed}×، اضغط للتغيير`}
              title="سرعة التلاوة"
            >
              {speed}×
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="icon-btn hidden sm:inline-flex"
              aria-label={muted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
              title={muted ? 'إلغاء الكتم' : 'كتم الصوت'}
            >
              {muted ? <MuteIcon size={17} /> : <VolumeIcon size={17} />}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(event) => {
                setVolume(Number(event.target.value));
                if (muted) toggleMute();
              }}
              className="player-range hidden w-20 lg:block"
              style={{ '--progress': `${volumeProgress}%` } as CSSProperties}
              aria-label="مستوى الصوت"
            />

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
