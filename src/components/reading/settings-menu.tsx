'use client';

import { useRef, type CSSProperties } from 'react';
import { CheckIcon, SlidersIcon } from '@/components/icons';
import { useSettings } from '@/components/providers';
import { FONT_SIZE_MAX, FONT_SIZE_MIN, type QuranFont } from '@/lib/storage';
import { toArabicDigits } from '@/lib/quran';

const fonts: { value: QuranFont; label: string; sample: string }[] = [
  { value: 'amiri', label: 'أميري', sample: 'بِسْمِ ٱللَّه' },
  { value: 'scheherazade', label: 'شهرزاد', sample: 'بِسْمِ ٱللَّه' },
];

export function SettingsMenu() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const close = () => detailsRef.current?.removeAttribute('open');

  return (
    <details ref={detailsRef} className="relative">
      <summary
        className="icon-btn list-none [&::-webkit-details-marker]:hidden"
        aria-label="إعدادات القراءة"
        title="إعدادات القراءة"
      >
        <SlidersIcon size={19} />
      </summary>

      <div className="absolute end-0 top-full z-50 mt-2 w-[19rem] rounded-2xl border border-border bg-surface p-4 shadow-lift">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">إعدادات القراءة</p>
          <button
            type="button"
            onClick={close}
            className="rounded-full px-2 py-1 text-[11px] text-muted hover:text-foreground"
          >
            إغلاق
          </button>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted">حجم الخط</span>
            <span className="font-semibold text-foreground">
              {toArabicDigits(settings.fontSize)}px
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                updateSettings({ fontSize: Math.max(FONT_SIZE_MIN, settings.fontSize - 2) })
              }
              className="icon-btn size-8 border border-border text-sm"
              aria-label="تصغير الخط"
            >
              −
            </button>
            <input
              type="range"
              min={FONT_SIZE_MIN}
              max={FONT_SIZE_MAX}
              step={2}
              value={settings.fontSize}
              onChange={(event) => updateSettings({ fontSize: Number(event.target.value) })}
              className="player-range flex-1"
              style={{ '--progress': `${((settings.fontSize - FONT_SIZE_MIN) / (FONT_SIZE_MAX - FONT_SIZE_MIN)) * 100}%` } as CSSProperties}
              aria-label="حجم خط القرآن"
            />
            <button
              type="button"
              onClick={() =>
                updateSettings({ fontSize: Math.min(FONT_SIZE_MAX, settings.fontSize + 2) })
              }
              className="icon-btn size-8 border border-border text-sm"
              aria-label="تكبير الخط"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium text-muted">نوع الخط</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {fonts.map((font) => {
              const active = settings.quranFont === font.value;
              return (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => updateSettings({ quranFont: font.value })}
                  className={`relative rounded-xl border px-2 py-3 text-center transition-colors ${
                    active
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <span
                    className={`block text-base leading-loose ${
                      font.value === 'amiri' ? 'quran-text' : 'quran-text quran-text-alt'
                    }`}
                    style={{ '--quran-size': '1rem' } as CSSProperties}
                  >
                    {font.sample}
                  </span>
                  <span className="mt-1 block text-[10px] text-muted">{font.label}</span>
                  {active ? (
                    <span className="absolute end-1.5 top-1.5 text-primary">
                      <CheckIcon size={12} />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-2/60 px-3 py-2.5">
          <div>
            <p className="text-xs font-semibold">التمرير التلقائي</p>
            <p className="mt-0.5 text-[10px] text-muted">تابع الآية أثناء التشغيل</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.autoScroll}
            onClick={() => updateSettings({ autoScroll: !settings.autoScroll })}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              settings.autoScroll ? 'bg-primary' : 'bg-foreground/15'
            }`}
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-surface shadow transition-all ${
                settings.autoScroll ? 'start-[1.375rem]' : 'start-0.5'
              }`}
            />
            <span className="sr-only">التمرير التلقائي</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            resetSettings();
            close();
          }}
          className="mt-4 w-full rounded-xl border border-border py-2 text-[11px] font-medium text-muted transition-colors hover:border-accent/50 hover:text-foreground"
        >
          استعادة الإعدادات الافتراضية
        </button>
      </div>
    </details>
  );
}
