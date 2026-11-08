'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { getAyahAudioSources } from '@/lib/audio';
import { toArabicDigits, type Ayah, type Surah } from '@/lib/quran';
import type { Reciter } from '@/lib/reciters';
import { writeLastRead } from '@/lib/storage';

type AudioContextValue = {
  surah: Surah;
  reciter: Reciter;
  currentAyah: Ayah | null;
  isPlaying: boolean;
  isLoading: boolean;
  isVisible: boolean;
  repeat: boolean;
  speed: number;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
  playAyah: (ayah: Ayah) => void;
  toggle: () => void;
  playSurah: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setRepeat: (value: boolean) => void;
  setSpeed: (value: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  stop: () => void;
  clearError: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used inside AudioProvider');
  return context;
}

export function AudioProvider({
  surah,
  reciter,
  children,
}: {
  surah: Surah;
  reciter: Reciter;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourcesRef = useRef<string[]>([]);
  const sourceIndexRef = useRef(0);
  const previousReciterRef = useRef(reciter.id);
  const playingRef = useRef(false);

  const [currentAyahNumber, setCurrentAyahNumber] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const currentAyah = useMemo(
    () => surah.ayahs.find((ayah) => ayah.numberInSurah === currentAyahNumber) ?? null,
    [surah.ayahs, currentAyahNumber],
  );

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  const loadAyah = useCallback(
    (ayah: Ayah, autoplay: boolean, activeReciter: Reciter) => {
      const audio = audioRef.current;
      if (!audio) return;

      const sources = getAyahAudioSources(activeReciter, ayah.number);
      sourcesRef.current = sources;
      sourceIndexRef.current = 0;

      setCurrentAyahNumber(ayah.numberInSurah);
      setIsVisible(true);
      setCurrentTime(0);
      setDuration(0);
      setError(null);
      setIsLoading(autoplay);

      audio.src = sources[0];
      audio.load();
      audio.playbackRate = speed;

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
    [speed],
  );

  const playAyah = useCallback(
    (ayah: Ayah) => {
      loadAyah(ayah, true, reciter);
    },
    [loadAyah, reciter],
  );

  const playSurah = useCallback(() => {
    const firstAyah = surah.ayahs[0];
    if (firstAyah) loadAyah(firstAyah, true, reciter);
  }, [loadAyah, reciter, surah.ayahs]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    const current = surah.ayahs.find((ayah) => ayah.numberInSurah === currentAyahNumber);

    if (!current) {
      playSurah();
      return;
    }

    if (!audio) return;

    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise) playPromise.catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentAyahNumber, playSurah, surah.ayahs]);

  const goToOffset = useCallback(
    (offset: number) => {
      const index = surah.ayahs.findIndex((ayah) => ayah.numberInSurah === currentAyahNumber);
      const target = surah.ayahs[index + offset];
      if (target) loadAyah(target, playingRef.current, reciter);
    },
    [currentAyahNumber, loadAyah, reciter, surah.ayahs],
  );

  const next = useCallback(() => goToOffset(1), [goToOffset]);
  const previous = useCallback(() => goToOffset(-1), [goToOffset]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
    setCurrentAyahNumber(null);
    setIsPlaying(false);
    setIsLoading(false);
    setIsVisible(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((value) => !value);
  }, []);

  // Persist the last listened ayah.
  useEffect(() => {
    if (!currentAyah) return;
    writeLastRead({
      surah: surah.number,
      surahName: surah.name,
      ayah: currentAyah.numberInSurah,
      at: Date.now(),
    });
  }, [currentAyah, surah.name, surah.number]);

  // Reload the current ayah when the reciter changes.
  useEffect(() => {
    if (previousReciterRef.current === reciter.id) return;
    previousReciterRef.current = reciter.id;

    if (currentAyah) {
      loadAyah(currentAyah, playingRef.current, reciter);
    }
  }, [currentAyah, loadAyah, reciter]);

  // Playback rate.
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  // Volume.
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = muted;
  }, [muted, volume]);

  // Preload the next ayah so transitions feel instant.
  useEffect(() => {
    if (!currentAyah) return;

    const index = surah.ayahs.findIndex((ayah) => ayah.numberInSurah === currentAyah.numberInSurah);
    const following = surah.ayahs[index + 1];
    if (!following) return;

    const preloader = new Audio(getAyahAudioSources(reciter, following.number)[0]);
    preloader.preload = 'auto';
    preloader.load();

    return () => {
      preloader.removeAttribute('src');
      preloader.load();
    };
  }, [currentAyah, reciter, surah.ayahs]);

  // Lock-screen / hardware media controls.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !currentAyah) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `سورة ${surah.name} — الآية ${toArabicDigits(currentAyah.numberInSurah)}`,
      artist: reciter.name,
      album: 'مشكاة — القرآن الكريم',
    });
  }, [currentAyah, reciter.name, surah.name]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    const audio = audioRef.current;

    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => void audio?.play()],
      ['pause', () => audio?.pause()],
      ['previoustrack', () => previous()],
      ['nexttrack', () => next()],
      ['seekbackward', () => seek(Math.max(0, (audio?.currentTime ?? 0) - 5))],
      ['seekforward', () => seek(Math.min(duration, (audio?.currentTime ?? 0) + 5))],
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
  }, [duration, next, previous, seek]);

  const handleEnded = useCallback(() => {
    if (repeat && currentAyah) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise) playPromise.catch(() => setIsPlaying(false));
      }
      return;
    }

    const index = surah.ayahs.findIndex((ayah) => ayah.numberInSurah === currentAyahNumber);
    const following = surah.ayahs[index + 1];

    if (following) {
      loadAyah(following, true, reciter);
    } else {
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [currentAyah, currentAyahNumber, loadAyah, reciter, repeat, surah.ayahs]);

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

  const value = useMemo<AudioContextValue>(
    () => ({
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
      playAyah,
      toggle,
      playSurah,
      pause,
      next,
      previous,
      seek,
      setRepeat,
      setSpeed,
      setVolume,
      toggleMute,
      stop,
      clearError: () => setError(null),
    }),
    [
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
      playAyah,
      toggle,
      playSurah,
      pause,
      next,
      previous,
      seek,
      toggleMute,
      stop,
    ],
  );

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="auto"
        className="hidden"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onEnded={handleEnded}
        onError={handleAudioError}
      />
    </AudioContext.Provider>
  );
}
