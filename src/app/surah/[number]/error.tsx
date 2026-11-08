'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowRightIcon, BookOpenIcon } from '@/components/icons';

export default function SurahError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/8 text-primary">
        <BookOpenIcon size={28} />
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold">تعذّر تحميل السورة</h1>
      <p className="mt-3 text-sm leading-7 text-muted">
        حدثت مشكلة أثناء جلب النص من خادم القرآن الكريم. تأكد من اتصالك بالإنترنت ثم أعد
        المحاولة.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          إعادة المحاولة
        </button>
        <Link href="/#surahs" className="btn btn-outline">
          العودة للفهرس
          <ArrowRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
