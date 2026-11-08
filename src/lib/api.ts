import quranData from '@/data/quran.json';
import { getSurahMeta, type Ayah, type Surah } from './quran';

/**
 * The Uthmani text is downloaded once from AlQuran Cloud
 * (https://alquran.cloud/api) via scripts/fetch-quran.mjs and committed to the
 * repo. Serving it locally keeps pages instant and avoids API rate limits.
 * Audio is still streamed from the Islamic Network CDN.
 */
type LocalAyah = {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  sajda: boolean | Record<string, unknown>;
};

type LocalSurah = {
  number: number;
  ayahs: LocalAyah[];
};

const quran = quranData as unknown as Record<string, LocalSurah>;

export class QuranApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'QuranApiError';
    this.status = status;
  }
}

export function isValidSurahNumber(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 114;
}

export async function fetchAyah(surahNumber: number, ayahNumber: number): Promise<Ayah> {
  const surah = quran[String(surahNumber)];
  const ayah = surah?.ayahs.find((item) => item.numberInSurah === ayahNumber);

  if (!ayah) {
    throw new QuranApiError('تعذر العثور على الآية');
  }

  return {
    number: ayah.number,
    text: ayah.text,
    numberInSurah: ayah.numberInSurah,
    juz: ayah.juz,
    page: ayah.page,
    sajda: ayah.sajda,
  };
}

export async function fetchSurah(surahNumber: number): Promise<Surah> {
  if (!isValidSurahNumber(surahNumber)) {
    throw new QuranApiError('رقم السورة غير صحيح');
  }

  const meta = getSurahMeta(surahNumber);
  const surah = quran[String(surahNumber)];

  if (!meta || !surah?.ayahs.length) {
    throw new QuranApiError('تعذر العثور على بيانات السورة');
  }

  const ayahs: Ayah[] = surah.ayahs.map((ayah) => ({
    number: ayah.number,
    text: ayah.text,
    numberInSurah: ayah.numberInSurah,
    juz: ayah.juz,
    page: ayah.page,
    sajda: ayah.sajda,
  }));

  return { ...meta, ayahs };
}
