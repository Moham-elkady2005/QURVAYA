import Link from 'next/link';
import { cacheLife } from 'next/cache';
import { LogoMark } from '@/components/ornaments';
import { toArabicDigits } from '@/lib/quran';

const columns = [
  {
    title: 'القرآن الكريم',
    links: [
      { href: '/surah/1', label: 'سورة الفاتحة' },
      { href: '/surah/18', label: 'سورة الكهف' },
      { href: '/surah/36', label: 'سورة يس' },
      { href: '/surah/55', label: 'سورة الرحمن' },
      { href: '/surah/67', label: 'سورة الملك' },
    ],
  },
  {
    title: 'المكتبة',
    links: [
      { href: '/#surahs', label: 'فهرس السور' },
      { href: '/reciters', label: 'القرّاء' },
      { href: '/bookmarks', label: 'المحفوظات' },
      { href: '/#features', label: 'المزايا' },
    ],
  },
];

async function getCopyrightYear(): Promise<number> {
  'use cache';
  cacheLife('max');
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await getCopyrightYear();

  return (
    <footer className="relative mt-24 border-t border-border bg-surface/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl border border-border bg-surface text-primary">
                <LogoMark className="size-7" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-semibold">مشكاة</span>
                <span className="mt-1 text-[10px] tracking-[0.28em] text-muted">القرآن الكريم</span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-muted">
              تجربة قراءة واستماع هادئة لكتاب الله، برسم عثماني أصيل وتلاوات مختارة، مع حفظ
              موضعك ومحفوظاتك على جهازك.
            </p>
            <p className="mt-5 text-xs leading-6 text-muted">
              النص والصوت عبر{' '}
              <a
                href="https://alquran.cloud/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                AlQuran Cloud
              </a>{' '}
              و{' '}
              <a
                href="https://islamic.network"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                Islamic Network
              </a>
              .
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold text-foreground">{column.title}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="gold-divider my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-muted sm:flex-row sm:text-start">
          <p>﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾</p>
          <p>صُنع بمحبة لخدمة كتاب الله · {toArabicDigits(year)}</p>
        </div>
      </div>
    </footer>
  );
}
