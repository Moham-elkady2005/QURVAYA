'use client';

import { MoonIcon, SunIcon } from '@/components/icons';
import { useTheme } from '@/components/providers';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`icon-btn relative ${className}`}
      aria-label={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
      title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
    >
      <span className="relative block size-5">
        <SunIcon
          size={20}
          className={`absolute inset-0 transition-all duration-300 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'
          }`}
        />
        <MoonIcon
          size={20}
          className={`absolute inset-0 transition-all duration-300 ${
            isDark ? '-rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </span>
    </button>
  );
}
