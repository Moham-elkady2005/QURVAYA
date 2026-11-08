import surahsData from '@/data/surahs.json';

export type RevelationType = 'Meccan' | 'Medinan';

export type SurahMeta = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
};

export type Ayah = {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  sajda: boolean | Record<string, unknown>;
};

export type Surah = SurahMeta & {
  ayahs: Ayah[];
};

export const surahs = surahsData as SurahMeta[];

export function getSurahMeta(number: number): SurahMeta | undefined {
  return surahs.find((surah) => surah.number === number);
}

export function getSurahPath(number: number): string {
  return `/surah/${number}`;
}

const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u08D3-\u08FF]/g;

/** Normalizes Arabic text for forgiving search (hamza, alef, ya, ta marbuta, diacritics). */
export function normalizeArabic(value: string): string {
  return value
    .replace(ARABIC_DIACRITICS, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, 'ا')
    .replace(/\u0649/g, 'ي')
    .replace(/\u0629/g, 'ه')
    .replace(/\u0640/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const BASMALA_WORDS = ['بسم', 'الله', 'الرحمن', 'الرحيم'];

/** Removes the basmala that the API prepends to the first ayah of every surah. */
export function stripBasmala(text: string, surahNumber: number, ayahNumber: number): string {
  let value = text.replace(/^\uFEFF/, '').trim();

  if (surahNumber === 1 || surahNumber === 9 || ayahNumber !== 1) return value;

  const words = value.split(/\s+/);
  const opening = words.slice(0, BASMALA_WORDS.length).map(normalizeArabic).join(' ');

  if (opening === BASMALA_WORDS.join(' ')) {
    value = words.slice(BASMALA_WORDS.length).join(' ').trim();
  }

  return value;
}

export function hasBasmala(surahNumber: number): boolean {
  return surahNumber !== 1 && surahNumber !== 9;
}

export function revelationLabel(type: RevelationType): string {
  return type === 'Meccan' ? 'مكية' : 'مدنية';
}

export function toArabicDigits(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);
}

export function toLatinDigits(value: string): string {
  return value.replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '٠:٠٠';
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${toArabicDigits(minutes)}:${toArabicDigits(rest.toString().padStart(2, '0'))}`;
}
