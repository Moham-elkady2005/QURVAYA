import { toArabicDigits } from '@/lib/quran';

const STAR_POINTS = Array.from({ length: 16 }, (_, index) => {
  const radius = index % 2 === 0 ? 47 : 34;
  const angle = (Math.PI / 8) * index - Math.PI / 2;
  const x = 50 + radius * Math.cos(angle);
  const y = 50 + radius * Math.sin(angle);
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}).join(' ');

type AyahStarProps = {
  value: number | string;
  className?: string;
  muted?: boolean;
};

/** Eight-pointed Islamic star carrying an ayah number. */
export function AyahStar({ value, className = '', muted = false }: AyahStarProps) {
  const label = toArabicDigits(value);
  const fontSize = label.length > 2 ? 24 : 30;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={`الآية ${label}`}
    >
      <polygon
        points={STAR_POINTS}
        fill={muted ? 'currentColor' : 'var(--accent-soft)'}
        opacity={muted ? 0.08 : 0.55}
      />
      <polygon
        points={STAR_POINTS}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        opacity={muted ? 0.55 : 0.9}
      />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize={fontSize}
        fontWeight="600"
        fontFamily="var(--font-plex), sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}

export function Bismillah({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 text-center ${className}`} dir="rtl">
      <div className="flex items-center gap-3 text-accent/70">
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent/60 sm:w-16" />
        <svg viewBox="0 0 24 24" className="size-3" aria-hidden="true">
          <path
            d="M12 2 14.4 9.6 22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z"
            fill="currentColor"
          />
        </svg>
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent/60 sm:w-16" />
      </div>
      <p className="quran-text text-[1.45rem] leading-loose text-foreground/90 sm:text-[1.7rem]">
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
    </div>
  );
}

export function LogoMark({ className = 'size-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M8 43V23.5C8 14.4 15.2 7 24 7s16 7.4 16 16.5V43"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M13.5 43V24.2c0-6 4.7-10.7 10.5-10.7s10.5 4.7 10.5 10.7V43"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.45"
      />
      <path
        d="M24 16.5 26.6 22l6 .9-4.3 4.4 1 6-5.3-3-5.3 3 1-6L15.4 23l6-1L24 16.5Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="24" cy="40" r="1.6" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function HeroArch({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 540"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="archGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="archGreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id="archGlow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="260" rx="185" ry="235" fill="url(#archGlow)" />

      <path
        d="M34 512V238C34 148 108 74 200 24c92 50 166 124 166 214v274Z"
        fill="url(#archGreen)"
        stroke="url(#archGold)"
        strokeWidth="2.5"
      />
      <path
        d="M58 512V240c0-76 64-142 142-187 78 45 142 111 142 187v272"
        fill="none"
        stroke="var(--accent)"
        strokeOpacity="0.28"
        strokeWidth="1.2"
      />
      <path
        d="M84 512V244c0-64 53-120 116-160 63 40 116 96 116 160v268"
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.18"
        strokeWidth="1"
        strokeDasharray="2 7"
      />

      <g fill="var(--accent)" opacity="0.55">
        <circle cx="200" cy="72" r="3" />
        <circle cx="200" cy="72" r="8" fill="none" stroke="var(--accent)" strokeWidth="1" />
        <circle cx="126" cy="152" r="1.8" />
        <circle cx="274" cy="152" r="1.8" />
      </g>

      <g transform="translate(200 104)">
        <path
          d="M0 -26 7.6 -7.6 26 0 7.6 7.6 0 26 -7.6 7.6 -26 0 -7.6 -7.6Z"
          fill="var(--accent)"
          opacity="0.35"
        />
      </g>

      <text
        x="200"
        y="288"
        textAnchor="middle"
        fill="var(--foreground)"
        fontFamily="var(--font-quran), serif"
        fontSize="96"
        opacity="0.92"
      >
        ٱقْرَأْ
      </text>
      <text
        x="200"
        y="338"
        textAnchor="middle"
        fill="var(--muted)"
        fontFamily="var(--font-quran), serif"
        fontSize="21"
        opacity="0.85"
      >
        بِسْمِ رَبِّكَ ٱلَّذِى خَلَقَ
      </text>

      <path d="M136 370h128" stroke="var(--gold-line)" strokeWidth="1" />
      <path
        d="M194 366 200 360l6 6-6 6-6-6Z"
        fill="none"
        stroke="var(--accent)"
        strokeOpacity="0.6"
      />

      <text
        x="200"
        y="430"
        textAnchor="middle"
        fill="var(--muted)"
        fontFamily="var(--font-plex), sans-serif"
        fontSize="13"
        letterSpacing="4"
        opacity="0.7"
      >
        مُشكَاة
      </text>
    </svg>
  );
}

export function CornerOrnament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true" fill="none">
      <path
        d="M2 78V34C2 16.3 16.3 2 34 2h44"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.4"
      />
      <path
        d="M10 78V36c0-14.4 11.6-26 26-26h42"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeOpacity="0.22"
      />
      <path
        d="M22 22 25 16l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}
