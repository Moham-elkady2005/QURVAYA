import type { MetadataRoute } from 'next';
import { MUSHAF_PAGE_COUNT } from '@/lib/mushaf';
import { surahs } from '@/lib/quran';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/reciters`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...surahs.map((surah) => ({
      url: `${siteUrl}/surah/${surah.number}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...Array.from({ length: MUSHAF_PAGE_COUNT }, (_, index) => ({
      url: `${siteUrl}/mushaf/${index + 1}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
