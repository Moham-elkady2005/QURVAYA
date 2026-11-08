'use client';

import { useSyncExternalStore } from 'react';
import { DEFAULT_RECITER_ID } from './reciters';

export type QuranFont = 'amiri' | 'scheherazade';

export type Settings = {
  reciterId: string;
  fontSize: number;
  quranFont: QuranFont;
  autoScroll: boolean;
};

export const FONT_SIZE_MIN = 24;
export const FONT_SIZE_MAX = 48;

export const defaultSettings: Settings = {
  reciterId: DEFAULT_RECITER_ID,
  fontSize: 32,
  quranFont: 'amiri',
  autoScroll: true,
};

const SETTINGS_KEY = 'mishkat:settings';
const LAST_READ_KEY = 'mishkat:last-read';
const BOOKMARKS_KEY = 'mishkat:bookmarks';
const THEME_KEY = 'mishkat:theme';

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or disabled; the app still works without persistence.
  }
}

type Store<T> = {
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  subscribe: (listener: () => void) => () => void;
  invalidate: () => void;
};

/**
 * A tiny external store around a localStorage key. Snapshots are cached so
 * useSyncExternalStore receives a stable reference between writes.
 */
function createStore<T>(key: string, parse: (raw: unknown) => T, serverValue: T): Store<T> {
  let cached: T;
  let hasCache = false;
  const eventName = `mishkat:store:${key}`;

  const getSnapshot = (): T => {
    if (!hasCache) {
      cached = parse(canUseStorage() ? readJson<unknown>(key, undefined) : undefined);
      hasCache = true;
    }

    return cached;
  };

  const subscribe = (listener: () => void) => {
    const onChange = (event: Event) => {
      if (event instanceof StorageEvent && event.key !== null && event.key !== key) return;
      hasCache = false;
      listener();
    };

    window.addEventListener(eventName, onChange);
    window.addEventListener('storage', onChange);

    return () => {
      window.removeEventListener(eventName, onChange);
      window.removeEventListener('storage', onChange);
    };
  };

  const invalidate = () => {
    hasCache = false;
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(eventName));
  };

  return {
    getSnapshot,
    getServerSnapshot: () => serverValue,
    subscribe,
    invalidate,
  };
}

function parseSettings(raw: unknown): Settings {
  const stored = (raw && typeof raw === 'object' ? raw : {}) as Partial<Settings>;
  const size = Number(stored.fontSize);

  return {
    reciterId:
      typeof stored.reciterId === 'string' && stored.reciterId
        ? stored.reciterId
        : defaultSettings.reciterId,
    fontSize: Number.isFinite(size)
      ? Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, size))
      : defaultSettings.fontSize,
    quranFont: stored.quranFont === 'scheherazade' ? 'scheherazade' : 'amiri',
    autoScroll: stored.autoScroll !== false,
  };
}

const EMPTY_BOOKMARKS: Bookmark[] = [];

const settingsStore = createStore<Settings>(SETTINGS_KEY, parseSettings, defaultSettings);

const bookmarksStore = createStore<Bookmark[]>(
  BOOKMARKS_KEY,
  (raw) =>
    Array.isArray(raw)
      ? raw.filter(
          (item): item is Bookmark =>
            Boolean(item) &&
            typeof item.surah === 'number' &&
            typeof item.ayah === 'number' &&
            typeof item.text === 'string',
        )
      : EMPTY_BOOKMARKS,
  EMPTY_BOOKMARKS,
);

const lastReadStore = createStore<LastRead | null>(
  LAST_READ_KEY,
  (raw) => {
    if (!raw || typeof raw !== 'object') return null;
    const value = raw as LastRead;
    return typeof value.surah === 'number' && typeof value.ayah === 'number' ? value : null;
  },
  null,
);

export function useSettingsSnapshot(): Settings {
  return useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getSnapshot,
    settingsStore.getServerSnapshot,
  );
}

export function updateSettings(patch: Partial<Settings>): void {
  const next = { ...settingsStore.getSnapshot(), ...patch };
  writeJson(SETTINGS_KEY, next);
  settingsStore.invalidate();
}

export function resetSettings(): void {
  writeJson(SETTINGS_KEY, defaultSettings);
  settingsStore.invalidate();
}

export type LastRead = {
  surah: number;
  surahName: string;
  ayah: number;
  at: number;
};

export function useLastReadSnapshot(): LastRead | null {
  return useSyncExternalStore(
    lastReadStore.subscribe,
    lastReadStore.getSnapshot,
    lastReadStore.getServerSnapshot,
  );
}

export function writeLastRead(value: LastRead): void {
  writeJson(LAST_READ_KEY, value);
  lastReadStore.invalidate();
}

export type Bookmark = {
  surah: number;
  surahName: string;
  ayah: number;
  text: string;
  createdAt: number;
};

export function useBookmarksSnapshot(): Bookmark[] {
  return useSyncExternalStore(
    bookmarksStore.subscribe,
    bookmarksStore.getSnapshot,
    bookmarksStore.getServerSnapshot,
  );
}

export function isBookmarked(bookmarks: Bookmark[], surah: number, ayah: number): boolean {
  return bookmarks.some((item) => item.surah === surah && item.ayah === ayah);
}

export function toggleBookmark(bookmark: Omit<Bookmark, 'createdAt'>): Bookmark[] {
  const current = bookmarksStore.getSnapshot();
  const exists = isBookmarked(current, bookmark.surah, bookmark.ayah);
  const next = exists
    ? current.filter((item) => !(item.surah === bookmark.surah && item.ayah === bookmark.ayah))
    : [{ ...bookmark, createdAt: Date.now() }, ...current];

  writeJson(BOOKMARKS_KEY, next);
  bookmarksStore.invalidate();
  return next;
}

export function removeBookmark(surah: number, ayah: number): Bookmark[] {
  const next = bookmarksStore
    .getSnapshot()
    .filter((item) => !(item.surah === surah && item.ayah === ayah));

  writeJson(BOOKMARKS_KEY, next);
  bookmarksStore.invalidate();
  return next;
}

export function clearBookmarks(): void {
  writeJson(BOOKMARKS_KEY, []);
  bookmarksStore.invalidate();
}

export type Theme = 'light' | 'dark';

let themeCache: Theme | null = null;
const THEME_EVENT = 'mishkat:theme-changed';

function resolveTheme(): Theme {
  if (!canUseStorage()) return 'light';

  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getThemeSnapshot(): Theme {
  if (!themeCache) themeCache = resolveTheme();
  return themeCache;
}

function getThemeServerSnapshot(): Theme {
  return 'light';
}

function subscribeTheme(listener: () => void): () => void {
  const onChange = () => {
    themeCache = null;
    listener();
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === THEME_KEY) onChange();
  };

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = () => {
    if (!window.localStorage.getItem(THEME_KEY)) onChange();
  };

  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  media.addEventListener('change', onSystemChange);

  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
    media.removeEventListener('change', onSystemChange);
  };
}

export function useThemeSnapshot(): Theme {
  return useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
}

export function setTheme(theme: Theme): void {
  if (canUseStorage()) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore storage errors.
    }
  }

  themeCache = theme;
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(THEME_EVENT));
}

export function toggleTheme(): void {
  setTheme(getThemeSnapshot() === 'dark' ? 'light' : 'dark');
}

const emptySubscribe = () => () => {};

/** False during SSR and hydration, true afterwards — without effects. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const subscribeToUrl = (listener: () => void) => {
  window.addEventListener('popstate', listener);
  return () => window.removeEventListener('popstate', listener);
};

/** Reads a URL search param without opting the whole page into CSR. */
export function useUrlParam(name: string): string | null {
  return useSyncExternalStore(
    subscribeToUrl,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}
