import type { Metadata, Viewport } from 'next';
import {
  Amiri_Quran,
  IBM_Plex_Sans_Arabic,
  Reem_Kufi,
  Scheherazade_New,
} from 'next/font/google';
import Script from 'next/script';
import { AppProviders } from '@/components/providers';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { siteUrl } from '@/lib/site';
import './globals.css';

const plex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plex',
  display: 'swap',
});

const reem = Reem_Kufi({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-reem',
  display: 'swap',
});

const amiri = Amiri_Quran({
  subsets: ['arabic'],
  weight: '400',
  variable: '--font-amiri',
  display: 'swap',
});

const scheherazade = Scheherazade_New({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-scheherazade',
  display: 'swap',
});

const description =
  'اقرأ القرآن الكريم بالرسم العثماني واستمع لتلاوات مختارة، مع حفظ موضعك ومحفوظاتك وتحكم كامل في الخط والصوت. تجربة قراءة هادئة من مشكاة.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'مشكاة | القرآن الكريم — قراءة واستماع',
    template: '%s | مشكاة',
  },
  description,
  applicationName: 'مشكاة',
  keywords: [
    'القرآن الكريم',
    'قرآن',
    'المصحف',
    'تلاوة',
    'استماع',
    'سور القرآن',
    'الرسم العثماني',
    'مشكاة',
  ],
  authors: [{ name: 'مشكاة' }],
  creator: 'مشكاة',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    url: '/',
    siteName: 'مشكاة',
    title: 'مشكاة | القرآن الكريم — قراءة واستماع',
    description,
  },
  twitter: {
    card: 'summary',
    title: 'مشكاة | القرآن الكريم',
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f3e9' },
    { media: '(prefers-color-scheme: dark)', color: '#060f0c' },
  ],
};

const themeScript = `(function(){try{var stored=localStorage.getItem('mishkat:theme');var dark=stored==='dark'||(stored!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(dark){document.documentElement.classList.add('dark');}document.documentElement.style.colorScheme=dark?'dark':'light';}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${plex.variable} ${reem.variable} ${amiri.variable} ${scheherazade.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>

        <AppProviders>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:text-primary-foreground"
          >
            تخطَّ إلى المحتوى
          </a>

          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
