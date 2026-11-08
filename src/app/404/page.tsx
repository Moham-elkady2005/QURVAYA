import type { Metadata } from 'next';
import { NotFoundContent } from '@/components/not-found-content';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة',
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return <NotFoundContent />;
}
