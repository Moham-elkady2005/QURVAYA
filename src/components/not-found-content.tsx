import Link from 'next/link';
import { ArrowLeftIcon, SearchIcon } from '@/components/icons';
import { LogoMark } from '@/components/ornaments';

export function NotFoundContent() {
  return (
    <div className="pattern-bg flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl border border-border bg-surface text-primary shadow-soft">
          <LogoMark className="size-9" />
        </span>
        <p className="mt-6 font-display text-6xl font-semibold text-primary">٤٠٤</p>
        <h1 className="mt-3 font-display text-3xl font-semibold">الصفحة غير موجودة</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          يبدو أن الرابط الذي فتحته غير صحيح أو أن الصفحة قد نُقلت. يمكنك العودة إلى فهرس
          السور ومواصلة القراءة.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            العودة للرئيسية
            <ArrowLeftIcon size={16} />
          </Link>
          <Link href="/#surahs" className="btn btn-outline">
            <SearchIcon size={16} />
            فهرس السور
          </Link>
        </div>
      </div>
    </div>
  );
}
