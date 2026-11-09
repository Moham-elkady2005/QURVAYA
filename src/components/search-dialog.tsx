'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BookOpenIcon, CloseIcon, SearchIcon } from '@/components/icons';
import { toArabicDigits } from '@/lib/quran';
import { resultPath, type SearchResult } from '@/lib/search';

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

const DEBOUNCE_MS = 250;

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Reset on open, focus the input, and lock background scrolling.
  useEffect(() => {
    if (!open) return;

    setQuery('');
    setResults([]);
    const focusId = window.setTimeout(() => inputRef.current?.focus(), 60);
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(focusId);
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape closes the dialog (a11y).
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Debounced search against the server so the 1.8MB mushaf never reaches the client.
  useEffect(() => {
    if (!open) return;

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data = (await response.json()) as { results: SearchResult[] };
        setResults(data.results);
        setLoading(false);
      } catch {
        // Aborted or network error — a newer keystroke will retry.
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, open]);

  const openResult = (result: SearchResult) => {
    onClose();
    router.push(resultPath(result));
  };

  if (!open) return null;

  const showHint = query.trim().length < 2;
  const showEmpty = !showHint && !loading && results.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="البحث في القرآن الكريم"
    >
      <button
        type="button"
        aria-label="إغلاق البحث"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-foreground/40 backdrop-blur-sm"
      />

      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <SearchIcon size={18} className="shrink-0 text-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && results.length > 0) {
                event.preventDefault();
                openResult(results[0]);
              }
            }}
            placeholder="ابحث في القرآن الكريم…"
            aria-label="نص البحث"
            className="h-14 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            title="إغلاق (Esc)"
            className="icon-btn size-9"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {showHint ? (
            <p className="px-3 py-6 text-center text-sm text-muted">
              اكتب حرفين على الأقل للبحث في أسماء السور ونصوص الآيات — بدون حاجة للتشكيل.
            </p>
          ) : null}

          {loading ? (
            <p className="px-3 py-6 text-center text-sm text-muted" role="status">
              جارٍ البحث…
            </p>
          ) : null}

          {showEmpty ? (
            <p className="px-3 py-6 text-center text-sm text-muted">
              لا توجد نتائج مطابقة لـ «{query.trim()}».
            </p>
          ) : null}

          {results.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {results.map((result) => (
                <li key={resultPath(result)}>
                  <button
                    type="button"
                    onClick={() => openResult(result)}
                    className="w-full rounded-2xl px-3 py-3 text-right transition-colors hover:bg-foreground/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                  >
                    {result.type === 'surah' ? (
                      <span className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-sm font-medium text-primary">
                          <BookOpenIcon size={16} />
                          سورة {result.name}
                        </span>
                        <span className="text-xs text-muted">
                          {toArabicDigits(result.numberOfAyahs)} آية
                        </span>
                      </span>
                    ) : (
                      <span className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-accent">
                          سورة {result.surahName} — الآية{' '}
                          {toArabicDigits(result.ayahNumber)}
                        </span>
                        <span className="quran-text line-clamp-2 text-base leading-relaxed text-foreground">
                          {result.text}
                        </span>
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-[11px] text-muted">
          <span>
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5">Enter</kbd>{' '}
            فتح أول نتيجة
          </span>
          <span>
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5">Esc</kbd>{' '}
            إغلاق
          </span>
        </div>
      </div>
    </div>
  );
}
