import type { MetadataRoute } from 'next';
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
  ];
}
