'use client';

import { ChevronDownIcon, HeadphonesIcon } from '@/components/icons';
import { reciters } from '@/lib/reciters';

type ReciterSelectProps = {
  value: string;
  onChange: (id: string) => void;
  className?: string;
};

export function ReciterSelect({ value, onChange, className = '' }: ReciterSelectProps) {
  const mutarattil = reciters.filter((reciter) => reciter.style === 'مرتّل');
  const mujawwad = reciters.filter((reciter) => reciter.style === 'مجوّد');

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <HeadphonesIcon
        size={15}
        className="pointer-events-none absolute start-3 z-10 text-accent"
      />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="اختيار القارئ"
        className="h-10 w-full cursor-pointer appearance-none rounded-full border border-border bg-surface pe-9 ps-9 text-xs font-medium text-foreground shadow-sm transition-colors hover:border-accent/50 focus:border-accent focus:outline-none"
      >
        <optgroup label="مرتّل">
          {mutarattil.map((reciter) => (
            <option key={reciter.id} value={reciter.id}>
              {reciter.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="مجوّد">
          {mujawwad.map((reciter) => (
            <option key={reciter.id} value={reciter.id}>
              {reciter.name}
            </option>
          ))}
        </optgroup>
      </select>
      <ChevronDownIcon
        size={15}
        className="pointer-events-none absolute end-3 text-muted"
      />
    </label>
  );
}
