'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckIcon,
  CloseIcon,
  ExpandIcon,
  PauseIcon,
  PlayIcon,
  ShareIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '@/components/icons';
import { toArabicDigits } from '@/lib/quran';
import { useMushafAudio } from './mushaf-audio';

type PageSurah = {
  number: number;
  name: string;
  fromAyah: number;
  toAyah: number;
};

type MushafViewerProps = {
  page: number;
  totalPages: number;
  imageUrl: string;
  prevImageUrl: string | null;
  nextImageUrl: string | null;
  meta: {
    juz: number;
    surahs: PageSurah[];
    firstAyah: { surah: number; ayah: number };
  };
  surahStarts: { number: number; name: string; page: number }[];
  juzStarts: { juz: number; page: number }[];
};

const ZOOM_LEVELS = [100, 125, 150, 175, 200];

const SELECT_CLASS =
  'h-9 max-w-full min-w-0 rounded-full border border-border bg-surface px-3 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent/50';

function PageNavLink({
  target,
  disabled,
  label,
  children,
}: {
  target: number;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  const className = 'btn btn-outline gap-1.5 !px-3 !py-2 text-xs';

  if (disabled) {
    return (
      <span className={`${className} pointer-events-none opacity-40`} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link href={`/mushaf/${target}`} className={className} aria-label={label} title={label} prefetch>
      {children}
    </Link>
  );
}

export function MushafViewer({
  page,
  totalPages,
  imageUrl,
  prevImageUrl,
  nextImageUrl,
  meta,
  surahStarts,
  juzStarts,
}: MushafViewerProps) {
  const router = useRouter();
  const {
    page: audioPage,
    isPlaying: audioPlaying,
    isLoading: audioLoading,
    playPage,
    toggle: toggleAudio,
    isVisible: audioVisible,
  } = useMushafAudio();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [jump, setJump] = useState(String(page));
  const [shared, setShared] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const zoom = ZOOM_LEVELS[zoomIndex];
  const readingHref = `/surah/${meta.firstAyah.surah}?ayah=${meta.firstAyah.ayah}`;
  const startingSurah = surahStarts.find((surah) => surah.page === page);
  const selectedSurah = String(startingSurah?.number ?? meta.surahs[0]?.number ?? '');
  const listeningThisPage = audioPage === page;
  const playingThisPage = listeningThisPage && audioPlaying;

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setZoomIndex(0);
    setExpanded(false);
    setJump(String(page));
    setShared(false);
  }, [page]);

  // Warm the neighbours so the next/previous page opens instantly.
  useEffect(() => {
    for (const url of [prevImageUrl, nextImageUrl]) {
      if (!url) continue;
      const image = new window.Image();
      image.src = url;
    }
  }, [prevImageUrl, nextImageUrl]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;

      if (event.key === 'Escape') {
        setExpanded(false);
        return;
      }

      // RTL reading: the next page is to the left.
      if (event.key === 'ArrowLeft' && page < totalPages) router.push(`/mushaf/${page + 1}`);
      if (event.key === 'ArrowRight' && page > 1) router.push(`/mushaf/${page - 1}`);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [page, totalPages, router]);

  useEffect(() => {
    if (!expanded) return;

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [expanded]);

  const goToPage = (value: number) => {
    const target = Math.min(totalPages, Math.max(1, Math.round(value)));
    if (target !== page) router.push(`/mushaf/${target}`);
  };

  const handleJump = (event: FormEvent) => {
    event.preventDefault();
    const value = Number(jump);
    if (Number.isFinite(value)) goToPage(value);
  };

  const handleListen = () => {
    if (listeningThisPage) {
      toggleAudio();
      return;
    }

    // The player moves to this page as soon as the last ayah ends; warming the
    // route makes that page turn instant.
    if (page < totalPages) router.prefetch(`/mushaf/${page + 1}`);
    playPage(page);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/mushaf/${page}`;
    const title = `صفحة ${toArabicDigits(page)} من المصحف الشريف`;
    const surahNames = meta.surahs.map((surah) => `سورة ${surah.name}`).join(' و');
    const text = `${surahNames} — صفحة ${toArabicDigits(page)}`;

    // Native share sheet on supported devices (mostly mobile).
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        // The user dismissing the sheet is not an error — stop quietly.
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    // Desktop fallback: copy the page link to the clipboard.
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    } catch {
      setShared(false);
    }
  };

  const handleTouchStart = (event: ReactTouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: ReactTouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;

    if (start === null || expanded || zoom > 100) return;

    const delta = (event.changedTouches[0]?.clientX ?? start) - start;
    if (Math.abs(delta) < 60) return;

    if (delta < 0 && page < totalPages) goToPage(page + 1);
    if (delta > 0 && page > 1) goToPage(page - 1);
  };

  return (
    <div
      className={`mx-auto w-full max-w-4xl px-3 pt-6 sm:px-6 ${
        audioVisible ? 'pb-44 sm:pb-36' : 'pb-16'
      }`}
    >
      <div className="surface-card p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PageNavLink target={page - 1} disabled={page <= 1} label="الصفحة السابقة">
              <ArrowRightIcon size={14} />
              <span className="hidden sm:inline">السابقة</span>
            </PageNavLink>

            <span className="chip !text-foreground">
              صفحة {toArabicDigits(page)}{' '}
              <span className="text-muted">/ {toArabicDigits(totalPages)}</span>
            </span>

            <PageNavLink target={page + 1} disabled={page >= totalPages} label="الصفحة التالية">
              <span className="hidden sm:inline">التالية</span>
              <ArrowLeftIcon size={14} />
            </PageNavLink>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoomIndex((index) => Math.max(0, index - 1))}
              disabled={zoomIndex === 0}
              className="icon-btn size-8 disabled:pointer-events-none disabled:opacity-35"
              aria-label="تصغير الصفحة"
              title="تصغير"
            >
              <ZoomOutIcon size={16} />
            </button>

            <span className="w-10 text-center text-[11px] font-medium text-muted">
              {toArabicDigits(zoom)}٪
            </span>

            <button
              type="button"
              onClick={() => setZoomIndex((index) => Math.min(ZOOM_LEVELS.length - 1, index + 1))}
              disabled={zoomIndex === ZOOM_LEVELS.length - 1}
              className="icon-btn size-8 disabled:pointer-events-none disabled:opacity-35"
              aria-label="تكبير الصفحة"
              title="تكبير"
            >
              <ZoomInIcon size={16} />
            </button>

            <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="icon-btn size-8"
              aria-label="عرض الصفحة بحجم كبير"
              title="عرض كبير"
            >
              <ExpandIcon size={16} />
            </button>

            <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

            <button
              type="button"
              onClick={() => void handleShare()}
              className="icon-btn size-8"
              aria-label={shared ? 'تم نسخ رابط الصفحة' : 'مشاركة الصفحة'}
              title={shared ? 'تم نسخ الرابط' : 'مشاركة الصفحة'}
            >
              {shared ? (
                <CheckIcon size={16} className="text-primary" />
              ) : (
                <ShareIcon size={16} />
              )}
            </button>
            <span className="sr-only" role="status">
              {shared ? 'تم نسخ رابط الصفحة' : ''}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <select
            value={selectedSurah}
            onChange={(event) => {
              const surah = surahStarts.find((item) => String(item.number) === event.target.value);
              if (surah) goToPage(surah.page);
            }}
            className={SELECT_CLASS}
            aria-label="الانتقال إلى سورة"
          >
            {surahStarts.map((surah) => (
              <option key={surah.number} value={String(surah.number)}>
                سورة {surah.name} — ص {toArabicDigits(surah.page)}
              </option>
            ))}
          </select>

          <select
            value={String(meta.juz)}
            onChange={(event) => {
              const juz = juzStarts.find((item) => String(item.juz) === event.target.value);
              if (juz) goToPage(juz.page);
            }}
            className={SELECT_CLASS}
            aria-label="الانتقال إلى جزء"
          >
            {juzStarts.map((juz) => (
              <option key={juz.juz} value={String(juz.juz)}>
                الجزء {toArabicDigits(juz.juz)} — ص {toArabicDigits(juz.page)}
              </option>
            ))}
          </select>

          <form onSubmit={handleJump} className="flex items-center gap-1">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={totalPages}
              value={jump}
              onChange={(event) => setJump(event.target.value)}
              className="h-9 w-20 rounded-full border border-border bg-surface px-3 text-center text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              aria-label="رقم الصفحة"
              title="رقم الصفحة"
            />
            <button type="submit" className="btn btn-outline !px-3 !py-2 text-xs">
              انتقال
            </button>
          </form>

          <button
            type="button"
            onClick={handleListen}
            className="btn btn-outline ms-auto !px-4 !py-2 text-xs"
            aria-label={
              playingThisPage
                ? 'إيقاف الاستماع للصفحة'
                : listeningThisPage
                  ? 'متابعة الاستماع للصفحة'
                  : 'الاستماع إلى الصفحة'
            }
          >
            {audioLoading && listeningThisPage ? (
              <span className="size-3.5 animate-spin rounded-full border-2 border-foreground/25 border-t-foreground" />
            ) : playingThisPage ? (
              <PauseIcon size={14} />
            ) : (
              <PlayIcon size={14} />
            )}
            {playingThisPage
              ? 'إيقاف الاستماع'
              : listeningThisPage
                ? 'متابعة الاستماع'
                : 'استمع للصفحة'}
          </button>

          <Link href={readingHref} className="btn btn-primary !px-4 !py-2 text-xs">
            <BookOpenIcon size={15} />
            اقرأ واستمع
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="chip">الجزء {toArabicDigits(meta.juz)}</span>
          {meta.surahs.map((surah) => (
            <span key={surah.number} className="chip">
              سورة {surah.name} · {toArabicDigits(surah.fromAyah)}–{toArabicDigits(surah.toAyah)}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-4 w-full max-w-3xl overflow-hidden rounded-[1.5rem] border border-border bg-white p-2 shadow-2xl shadow-black/10 sm:p-3">
        {!loaded && !failed ? (
          <div
            className="pointer-events-none absolute inset-2 z-10 animate-pulse rounded-[1.1rem] bg-foreground/[0.06]"
            aria-hidden="true"
          />
        ) : null}

        {failed ? (
          <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="max-w-sm text-sm text-foreground/70">
              تعذّر تحميل صورة الصفحة. تحقق من اتصالك بالإنترنت ثم أعد المحاولة، أو افتح وضع
              القراءة النصية.
            </p>
            <Link href={readingHref} className="btn btn-primary text-sm">
              افتح وضع القراءة
            </Link>
          </div>
        ) : (
          <div
            className="overflow-x-auto"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: zoom > 100 ? 'auto' : 'pan-y' }}
          >
            <img
              key={imageUrl}
              src={imageUrl}
              alt={`صفحة ${toArabicDigits(page)} من المصحف الشريف`}
              width={700}
              height={1055}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={`block h-auto max-w-none select-none rounded-[1.1rem] transition-opacity duration-300 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ width: `${zoom}%` }}
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <PageNavLink target={page - 1} disabled={page <= 1} label="الصفحة السابقة">
          <ArrowRightIcon size={15} />
          الصفحة السابقة
        </PageNavLink>

        <span className="text-[11px] text-muted">
          {toArabicDigits(page)} / {toArabicDigits(totalPages)}
        </span>

        <PageNavLink target={page + 1} disabled={page >= totalPages} label="الصفحة التالية">
          الصفحة التالية
          <ArrowLeftIcon size={15} />
        </PageNavLink>
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-muted/80">
        صور صفحات المصحف من مشروع Quran SVG (رخصة MIT)، مشتقة من صفحات مجمع الملك فهد لطباعة
        المصحف الشريف — ترقيم المصحف المدني ٦٠٤ صفحة.
      </p>

      {expanded ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`صفحة ${toArabicDigits(page)} مكبّرة`}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="إغلاق العرض المكبّر"
            onClick={() => setExpanded(false)}
          />

          <img
            src={imageUrl}
            alt={`صفحة ${toArabicDigits(page)} من المصحف الشريف`}
            className="relative max-h-[92vh] w-auto max-w-[92vw] rounded-lg bg-white object-contain shadow-2xl"
          />

          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="icon-btn absolute end-3 top-3 bg-black/55 text-white hover:bg-black/75 hover:text-white"
            aria-label="إغلاق"
            title="إغلاق (Esc)"
          >
            <CloseIcon size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
