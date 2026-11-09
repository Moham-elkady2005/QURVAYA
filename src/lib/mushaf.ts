import 'server-only';

import quranData from '@/data/quran.json';
import { getSurahMeta, type Ayah } from './quran';

/** The Madani mushaf used by this project has exactly 604 pages. */
export const MUSHAF_PAGE_COUNT = 604;

/**
 * Page images come from the quran-svg project (MIT), derived from the official
 * King Fahd Complex vector pages. The commit is pinned so a page can never
 * change under a link that was already shared.
 */
const MUSHAF_IMAGE_BASE =
  'https://cdn.jsdelivr.net/gh/taulujas-png/quran-mushaf@2dfb14315b103c3d5ebea1de1079bfb2d828352a';

export type MushafPageSurah = {
  number: number;
  name: string;
  fromAyah: number;
  toAyah: number;
};

export type MushafPageMeta = {
  page: number;
  juz: number;
  surahs: MushafPageSurah[];
  firstAyah: { surah: number; ayah: number };
};

type QuranSurah = { number: number; ayahs: Ayah[] };

const quran = quranData as unknown as Record<string, QuranSurah>;

type PageBuild = {
  juz: number;
  surahs: Map<number, MushafPageSurah>;
  firstAyah: { surah: number; ayah: number };
};

let pageIndex: Map<number, MushafPageMeta> | null = null;
let surahStartPages: { number: number; name: string; page: number }[] | null = null;
let juzStartPages: { juz: number; page: number }[] | null = null;

function buildIndexes() {
  if (pageIndex) return;

  const pages = new Map<number, PageBuild>();
  const surahStarts: { number: number; name: string; page: number }[] = [];
  const juzStarts = new Map<number, number>();

  const surahList = Object.values(quran).sort((a, b) => a.number - b.number);

  for (const surah of surahList) {
    const meta = getSurahMeta(surah.number);

    for (const ayah of surah.ayahs) {
      if (!juzStarts.has(ayah.juz)) juzStarts.set(ayah.juz, ayah.page);

      let entry = pages.get(ayah.page);
      if (!entry) {
        entry = {
          juz: ayah.juz,
          surahs: new Map(),
          firstAyah: { surah: surah.number, ayah: ayah.numberInSurah },
        };
        pages.set(ayah.page, entry);
      } else if (ayah.juz < entry.juz) {
        entry.juz = ayah.juz;
      }

      let pageSurah = entry.surahs.get(surah.number);
      if (!pageSurah) {
        pageSurah = {
          number: surah.number,
          name: meta?.name ?? '',
          fromAyah: ayah.numberInSurah,
          toAyah: ayah.numberInSurah,
        };
        entry.surahs.set(surah.number, pageSurah);
      } else {
        pageSurah.toAyah = ayah.numberInSurah;
      }

      if (ayah.numberInSurah === 1) {
        surahStarts.push({
          number: surah.number,
          name: meta?.name ?? '',
          page: ayah.page,
        });
      }
    }
  }

  pageIndex = new Map(
    [...pages.entries()]
      .sort(([a], [b]) => a - b)
      .map(([page, entry]) => [
        page,
        {
          page,
          juz: entry.juz,
          surahs: [...entry.surahs.values()],
          firstAyah: entry.firstAyah,
        },
      ]),
  );

  surahStartPages = surahStarts.sort((a, b) => a.number - b.number);
  juzStartPages = [...juzStarts.entries()]
    .sort(([a], [b]) => a - b)
    .map(([juz, page]) => ({ juz, page }));
}

export function isMushafPage(page: number): boolean {
  return Number.isInteger(page) && page >= 1 && page <= MUSHAF_PAGE_COUNT;
}

export function mushafPageImageUrl(page: number): string {
  return `${MUSHAF_IMAGE_BASE}/${String(page).padStart(3, '0')}.png`;
}

export function getMushafPageMeta(page: number): MushafPageMeta | undefined {
  buildIndexes();
  return pageIndex?.get(page);
}

export function getSurahStartPages(): { number: number; name: string; page: number }[] {
  buildIndexes();
  return surahStartPages ?? [];
}

export function getJuzStartPages(): { juz: number; page: number }[] {
  buildIndexes();
  return juzStartPages ?? [];
}

/** Page that contains the first ayah of a surah — used by the reading toolbar. */
export function getSurahStartPage(surahNumber: number): number | undefined {
  buildIndexes();
  return surahStartPages?.find((surah) => surah.number === surahNumber)?.page;
}
