'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CloseIcon, MenuIcon, SearchIcon, SparkleIcon } from '@/components/icons';
import { LogoMark } from '@/components/ornaments';
import { SearchDialog } from '@/components/search-dialog';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { href: '/', label: 'الرئيسية' },
  { href: '/#surahs', label: 'فهرس السور' },
  { href: '/reciters', label: 'القرّاء' },
  { href: '/bookmarks', label: 'المحفوظات' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  if (href.startsWith('/#')) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Global shortcut: Ctrl/Cmd + K opens search from anywhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="h-0.5 w-full bg-gradient-to-l from-transparent via-accent/70 to-transparent" />
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="مشكاة — الصفحة الرئيسية">
          <span className="relative flex size-11 items-center justify-center rounded-2xl border border-border/80 bg-surface text-primary shadow-sm transition-colors group-hover:border-accent/60">
            <LogoMark className="size-7" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-tight text-foreground">
              مشكاة
            </span>
            <span className="mt-1 text-[10px] font-medium tracking-[0.28em] text-muted">
              القرآن الكريم
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل الرئيسي">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:bg-foreground/5 hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="icon-btn"
            aria-label="البحث في القرآن"
            title="بحث (Ctrl + K)"
          >
            <SearchIcon size={18} />
          </button>

          <ThemeToggle />

          <Link href="/surah/1" className="btn btn-primary hidden !px-5 !py-2.5 text-sm sm:inline-flex">
            <SparkleIcon size={16} />
            ابدأ القراءة
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="icon-btn md:hidden"
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={open}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-x-0 top-[74px] z-50 border-t border-border bg-background/98 px-4 pb-8 pt-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1" aria-label="قائمة الجوال">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3.5 text-base font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:bg-foreground/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link href="/surah/1" className="btn btn-primary mt-4 w-full" onClick={() => setOpen(false)}>
            <SparkleIcon size={16} />
            ابدأ القراءة
          </Link>
        </div>
      ) : null}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
