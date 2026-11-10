import type { ReactNode } from 'react';
import { MushafAudioProvider } from '@/components/mushaf/mushaf-audio';

/**
 * The audio provider lives in the section layout so its <audio> element
 * survives page turns inside /mushaf/[page].
 */
export default function MushafLayout({ children }: { children: ReactNode }) {
  return <MushafAudioProvider>{children}</MushafAudioProvider>;
}
