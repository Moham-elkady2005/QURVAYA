import type { Metadata } from 'next';
import { BookmarksList } from '@/components/bookmarks-list';

export const metadata: Metadata = {
  title: 'المحفوظات',
  description: 'الآيات التي حفظتها على جهازك، للرجوع إليها بسرعة.',
  robots: { index: false, follow: true },
};

export default function BookmarksPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <span className="chip">مكتبتك</span>
      <h1 className="mt-4 font-display text-4xl font-semibold">المحفوظات</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
        الآيات التي حفظتها محفوظة على جهازك فقط، دون حساب أو مزامنة. يمكنك الرجوع إليها
        أو إزالتها في أي وقت.
      </p>

      <BookmarksList />
    </section>
  );
}
