import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReadingExperience } from '@/components/reading/reading-experience';
import { fetchSurah } from '@/lib/api';
import {
  getSurahMeta,
  revelationLabel,
  surahs,
  toArabicDigits,
} from '@/lib/quran';
import { DEFAULT_RECITER_ID } from '@/lib/reciters';

export function generateStaticParams() {
  return surahs.map((surah) => ({ number: String(surah.number) }));
}

export async function generateMetadata(props: PageProps<'/surah/[number]'>): Promise<Metadata> {
  const { number } = await props.params;
  const meta = getSurahMeta(Number(number));

  if (!meta) {
    notFound();
  }

  const title = `سورة ${meta.name}`;
  const description = `اقرأ سورة ${meta.name} بالرسم العثماني — ${toArabicDigits(
    meta.numberOfAyahs,
  )} آية، ${revelationLabel(meta.revelationType)} — واستمع لتلاوتها بصوت نخبة من القراء، مع حفظ موضعك ومحفوظاتك.`;

  return {
    title,
    description,
    alternates: { canonical: `/surah/${meta.number}` },
    keywords: [
      `سورة ${meta.name}`,
      meta.englishName,
      'القرآن الكريم',
      'قراءة سورة',
      'استماع سورة',
    ],
    openGraph: {
      type: 'article',
      title: `${title} | مشكاة`,
      description,
      url: `/surah/${meta.number}`,
      locale: 'ar_AR',
    },
    twitter: {
      card: 'summary',
      title: `${title} | مشكاة`,
      description,
    },
  };
}

export default async function SurahPage(props: PageProps<'/surah/[number]'>) {
  const { number } = await props.params;
  const surahNumber = Number(number);

  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    notFound();
  }

  const surah = await fetchSurah(surahNumber);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: `سورة ${surah.name}`,
    alternateName: surah.englishName,
    inLanguage: 'ar',
    position: surah.number,
    isPartOf: {
      '@type': 'Book',
      name: 'القرآن الكريم',
      inLanguage: 'ar',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingExperience
        key={surah.number}
        surah={surah}
        initialReciterId={DEFAULT_RECITER_ID}
      />
    </>
  );
}
