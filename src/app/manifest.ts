import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'مشكاة — القرآن الكريم',
    short_name: 'مشكاة',
    description:
      'اقرأ القرآن الكريم بالرسم العثماني واستمع لتلاوات مختارة، مع حفظ موضعك ومحفوظاتك.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f3e9',
    theme_color: '#0c4a3b',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
