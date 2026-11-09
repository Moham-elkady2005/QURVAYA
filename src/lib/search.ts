import quranData from '@/data/quran.json';
import {
  getSurahMeta,
  normalizeArabic,
  stripBasmala,
  surahs,
  type Ayah,
} from './quran';

export type SurahSearchResult = {
  type: 'surah';
  number: number;
  name: string;
  numberOfAyahs: number;
};

export type AyahSearchResult = {
  type: 'ayah';
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
};

export type SearchResult = SurahSearchResult | AyahSearchResult;

type IndexedAyah = {
  surahNumber: number;
  ayah: Ayah;
  normalized: string;
};

type QuranSurah = { number: number; ayahs: Ayah[] };

// The full Quran lives server-side only; this module is never shipped to the client.
const quranSurahs = quranData as unknown as Record<string, QuranSurah>;

let ayahIndex: IndexedAyah[] | null = null;

/** Builds (once) a normalized index over every ayah for forgiving Arabic search. */
function getAyahIndex(): IndexedAyah[] {
  if (ayahIndex) return ayahIndex;

  const index: IndexedAyah[] = [];

  for (const surah of Object.values(quranSurahs)) {
    for (const ayah of surah.ayahs) {
      index.push({
        surahNumber: surah.number,
        ayah,
        normalized: normalizeArabic(ayah.text),
      });
    }
  }

  ayahIndex = index;
  return ayahIndex;
}

/**
 * Searches surah names and ayah text.
 * The query and the text are both normalized, so diacritics and hamza/alef
 * variants are forgiven (e.g. "الرحمن" matches "الرَّحْمَـٰن").
 */
export function searchQuran(rawQuery: string, limit = 40): SearchResult[] {
  const query = normalizeArabic(rawQuery);
  if (query.length < 2) return [];

  const results: SearchResult[] = [];

  // 1) Surah names first — they are the most common intent.
  for (const meta of surahs) {
    if (normalizeArabic(meta.name).includes(query)) {
      results.push({
        type: 'surah',
        number: meta.number,
        name: meta.name,
        numberOfAyahs: meta.numberOfAyahs,
      });
    }
  }

  // 2) Ayah text across the whole mushaf.
  for (const entry of getAyahIndex()) {
    if (!entry.normalized.includes(query)) continue;

    results.push({
      type: 'ayah',
      surahNumber: entry.surahNumber,
      surahName: getSurahMeta(entry.surahNumber)?.name ?? '',
      ayahNumber: entry.ayah.numberInSurah,
      text: stripBasmala(entry.ayah.text, entry.surahNumber, entry.ayah.numberInSurah),
    });

    if (results.length >= limit) break;
  }

  return results;
}

/** Deep link for a result: surah page, or the exact ayah anchor. */
export function resultPath(result: SearchResult): string {
  if (result.type === 'surah') return `/surah/${result.number}`;
  return `/surah/${result.surahNumber}#ayah-${result.ayahNumber}`;
}
