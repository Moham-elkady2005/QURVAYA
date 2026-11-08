import type { Reciter } from './reciters';

const AUDIO_CDN = 'https://cdn.islamic.network/quran/audio';

export type AudioQuality = 64 | 128;

export function getAyahAudioUrl(
  reciterId: string,
  globalAyahNumber: number,
  bitrate: AudioQuality = 128,
): string {
  return `${AUDIO_CDN}/${bitrate}/${reciterId}/${globalAyahNumber}.mp3`;
}

/**
 * Returns the primary audio source followed by the lower-quality fallback,
 * when the reciter has one. The player tries them in order.
 */
export function getAyahAudioSources(reciter: Reciter, globalAyahNumber: number): string[] {
  const sources = [getAyahAudioUrl(reciter.id, globalAyahNumber, reciter.bitrate)];

  if (reciter.fallbackBitrate) {
    sources.push(getAyahAudioUrl(reciter.id, globalAyahNumber, reciter.fallbackBitrate));
  }

  return sources;
}
