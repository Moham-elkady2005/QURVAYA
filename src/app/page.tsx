import { cacheLife } from 'next/cache';
import { ContinueReading } from '@/components/continue-reading';
import { CtaBanner } from '@/components/cta-banner';
import { DailyVerse } from '@/components/daily-verse';
import { Features } from '@/components/features';
import { HomeHero } from '@/components/home-hero';
import { RecitersShowcase } from '@/components/reciters-showcase';
import { SurahIndex } from '@/components/surah-index';
import { fetchAyah } from '@/lib/api';
import { getSurahMeta, stripBasmala, surahs } from '@/lib/quran';

const dailyVerseRefs = [
  { surah: 2, ayah: 152 },
  { surah: 65, ayah: 3 },
  { surah: 94, ayah: 5 },
  { surah: 13, ayah: 28 },
  { surah: 3, ayah: 139 },
  { surah: 40, ayah: 60 },
  { surah: 93, ayah: 5 },
  { surah: 55, ayah: 13 },
  { surah: 29, ayah: 69 },
  { surah: 2, ayah: 186 },
  { surah: 39, ayah: 53 },
  { surah: 57, ayah: 4 },
];

async function getDailyVerse() {
  'use cache';
  cacheLife('hours');

  const dayIndex = Math.floor(Date.now() / 86_400_000) % dailyVerseRefs.length;
  const reference = dailyVerseRefs[dayIndex];
  const meta = getSurahMeta(reference.surah);

  if (!meta) return null;

  try {
    const ayah = await fetchAyah(reference.surah, reference.ayah);
    return {
      text: stripBasmala(ayah.text, reference.surah, reference.ayah),
      surahNumber: reference.surah,
      surahName: meta.name,
      ayahNumber: reference.ayah,
    };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const dailyVerse = await getDailyVerse();

  return (
    <>
      <HomeHero />

      <section className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <ContinueReading />
          {dailyVerse ? (
            <div className="lg:col-span-2">
              <DailyVerse {...dailyVerse} />
            </div>
          ) : (
            <div className="surface-card flex flex-col justify-center p-7 lg:col-span-2">
              <p className="text-sm leading-7 text-muted">
                ﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾
              </p>
              <p className="mt-3 text-xs text-muted/80">سورة الإسراء · الآية ٩</p>
            </div>
          )}
        </div>
      </section>

      <SurahIndex surahs={surahs} />
      <RecitersShowcase />
      <Features />
      <CtaBanner />
    </>
  );
}
