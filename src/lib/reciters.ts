export type Reciter = {
  id: string;
  name: string;
  englishName: string;
  /** Bitrate available on the Islamic Network CDN. */
  bitrate: 64 | 128;
  /** Lower quality used automatically when the primary file fails. */
  fallbackBitrate?: 64;
  style: 'مرتّل' | 'مجوّد';
};

/**
 * Curated reciters, verified to have complete verse-by-verse audio
 * (1 → 6236) on cdn.islamic.network.
 */
export const reciters: Reciter[] = [
  { id: 'ar.alafasy', name: 'مشاري راشد العفاسي', englishName: 'Mishary Alafasy', bitrate: 128, fallbackBitrate: 64, style: 'مرتّل' },
  { id: 'ar.abdurrahmaansudais', name: 'عبد الرحمن السديس', englishName: 'Abdurrahman As-Sudais', bitrate: 64, style: 'مرتّل' },
  { id: 'ar.abdulbasitmurattal', name: 'عبد الباسط عبد الصمد', englishName: 'Abdul Basit', bitrate: 64, style: 'مرتّل' },
  { id: 'ar.husary', name: 'محمود خليل الحصري', englishName: 'Mahmoud Al-Husary', bitrate: 128, fallbackBitrate: 64, style: 'مرتّل' },
  { id: 'ar.minshawi', name: 'محمد صديق المنشاوي', englishName: 'Mohamed Al-Minshawi', bitrate: 128, style: 'مرتّل' },
  { id: 'ar.mahermuaiqly', name: 'ماهر المعيقلي', englishName: 'Maher Al-Muaiqly', bitrate: 128, fallbackBitrate: 64, style: 'مرتّل' },
  { id: 'ar.saoodshuraym', name: 'سعود الشريم', englishName: 'Saud Ash-Shuraym', bitrate: 64, style: 'مرتّل' },
  { id: 'ar.shaatree', name: 'أبو بكر الشاطري', englishName: 'Abu Bakr Ash-Shaatree', bitrate: 128, fallbackBitrate: 64, style: 'مرتّل' },
  { id: 'ar.ahmedajamy', name: 'أحمد بن علي العجمي', englishName: 'Ahmed Al-Ajamy', bitrate: 128, fallbackBitrate: 64, style: 'مرتّل' },
  { id: 'ar.hudhaify', name: 'علي الحذيفي', englishName: 'Ali Al-Hudhaify', bitrate: 128, fallbackBitrate: 64, style: 'مرتّل' },
  { id: 'ar.muhammadayyoub', name: 'محمد أيوب', englishName: 'Muhammad Ayyoub', bitrate: 128, style: 'مرتّل' },
  { id: 'ar.muhammadjibreel', name: 'محمد جبريل', englishName: 'Muhammad Jibreel', bitrate: 128, style: 'مرتّل' },
  { id: 'ar.hanirifai', name: 'هاني الرفاعي', englishName: 'Hani Ar-Rifai', bitrate: 64, style: 'مرتّل' },
  { id: 'ar.abdullahbasfar', name: 'عبد الله بصفر', englishName: 'Abdullah Basfar', bitrate: 64, style: 'مرتّل' },
  { id: 'ar.abdulsamad', name: 'عبد الصمد', englishName: 'Abdul Samad', bitrate: 64, style: 'مرتّل' },
  { id: 'ar.husarymujawwad', name: 'محمود خليل الحصري', englishName: 'Mahmoud Al-Husary', bitrate: 128, fallbackBitrate: 64, style: 'مجوّد' },
  { id: 'ar.minshawimujawwad', name: 'محمد صديق المنشاوي', englishName: 'Mohamed Al-Minshawi', bitrate: 64, style: 'مجوّد' },
];

export const DEFAULT_RECITER_ID = reciters[0].id;

export function getReciter(id?: string | null): Reciter {
  return reciters.find((reciter) => reciter.id === id) ?? reciters[0];
}
