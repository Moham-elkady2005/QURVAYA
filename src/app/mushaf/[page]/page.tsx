import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MushafViewer } from '@/components/mushaf/mushaf-viewer';
import {
  MUSHAF_PAGE_COUNT,
  getJuzStartPages,
  getMushafPageMeta,
  getSurahStartPages,
  isMushafPage,
  mushafPageImageUrl,
} from '@/lib/mushaf';
import { toArabicDigits } from '@/lib/quran';

type MushafPageProps = {
  params: Promise<{ page: string }>;
};

export function generateStaticParams() {
  return Array.from({ length: MUSHAF_PAGE_COUNT }, (_, index) => ({
    page: String(index + 1),
  }));
}

function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const page = Number(raw);
  return isMushafPage(page) ? page : null;
}

export async function generateMetadata({ params }: MushafPageProps): Promise<Metadata> {
  const { page: rawPage } = await params;
  const page = parsePage(rawPage);

  if (!page) notFound();

  const meta = getMushafPageMeta(page);

  if (!meta) notFound();

  const surahNames = meta.surahs.map((surah) => `سورة ${surah.name}`).join(' و');
  const title = `صفحة ${toArabicDigits(page)} — ${surahNames}`;
  const description = `صفحة ${toArabicDigits(page)} من المصحف الشريف بالرسم العثماني — ${surahNames}، الجزء ${toArabicDigits(
    meta.juz,
  )}. اقرأها كما في المصحف المطبوع، أو افتح وضع القراءة والاستماع.`;

  return {
    title,
    description,
    alternates: { canonical: `/mushaf/${page}` },
    openGraph: {
      title,
      description,
      url: `/mushaf/${page}`,
      type: 'article',
    },
  };
}

export default async function MushafPage({ params }: MushafPageProps) {
  const { page: rawPage } = await params;
  const page = parsePage(rawPage);

  if (!page) notFound();

  const meta = getMushafPageMeta(page);

  if (!meta) notFound();

  return (
    <MushafViewer
      page={page}
      totalPages={MUSHAF_PAGE_COUNT}
      imageUrl={mushafPageImageUrl(page)}
      prevImageUrl={page > 1 ? mushafPageImageUrl(page - 1) : null}
      nextImageUrl={page < MUSHAF_PAGE_COUNT ? mushafPageImageUrl(page + 1) : null}
      meta={meta}
      surahStarts={getSurahStartPages()}
      juzStarts={getJuzStartPages()}
    />
  );
}
