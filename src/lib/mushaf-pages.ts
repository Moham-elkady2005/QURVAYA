import pageData from '@/data/mushaf-pages.json';
import { getSurahMeta } from './quran';

/** The Madani mushaf used by this project has exactly 604 pages. */
export const MUSHAF_PAGE_COUNT = 604;

/**
 * One ayah on a printed mushaf page. `global` is the 1..6236 number used by
 * the verse-by-verse audio CDN.
 */
export type MushafPageAyah = {
  global: number;
  surah: number;
  surahName: string;
  ayah: number;
};

type PageRow = [global: number, surah: number, ayah: number];

const pages = pageData as unknown as Record<string, PageRow[]>;

/**
 * Ayahs of one printed page, in mushaf order. This compact index is safe to
 * import from client components (it carries no Quran text), which lets the
 * audio player queue the next page without a round-trip.
 */
export function getMushafPageAyahs(page: number): MushafPageAyah[] {
  const rows = pages[String(page)];
  if (!rows) return [];

  return rows.map(([global, surah, ayah]) => ({
    global,
    surah,
    surahName: getSurahMeta(surah)?.name ?? '',
    ayah,
  }));
}
