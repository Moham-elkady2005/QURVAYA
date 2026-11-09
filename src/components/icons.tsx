import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <path d="M8 5.5c0-1.2 1.3-1.9 2.3-1.2l9 6.1c.9.6.9 1.9 0 2.5l-9 6.1c-1 .7-2.3 0-2.3-1.2V5.5Z" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <rect x="6.5" y="4.5" width="3.6" height="15" rx="1.2" />
      <rect x="13.9" y="4.5" width="3.6" height="15" rx="1.2" />
    </svg>
  );
}

export function PrevIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 5v14" />
      <path d="M18.5 5.7 9.5 12l9 6.3V5.7Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function NextIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M17 5v14" />
      <path d="M5.5 5.7 14.5 12l-9 6.3V5.7Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

export function MuteIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </svg>
  );
}

export function RepeatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.7 6.7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function BookmarkIcon(props: IconProps & { filled?: boolean }) {
  const { filled, ...rest } = props;
  return (
    <svg {...base(rest)} fill={filled ? 'currentColor' : 'none'}>
      <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6.5A2.5 2.5 0 0 0 4 5.5v6A2.5 2.5 0 0 0 6.5 14" />
    </svg>
  );
}

export function SlidersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h9M17 18h3" />
      <circle cx="15" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="15" cy="18" r="2" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function HeadphonesIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 14h2.5A1.5 1.5 0 0 1 8 15.5v3A1.5 1.5 0 0 1 6.5 20H5a1 1 0 0 1-1-1v-5ZM20 14h-2.5a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5H19a1 1 0 0 0 1-1v-5Z" />
    </svg>
  );
}

export function BookOpenIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 6.5C10.3 5 8 4.2 4 4.2v13.6c4 0 6.3.8 8 2.4 1.7-1.6 4-2.4 8-2.4V4.2c-4 0-6.3.8-8 2.4Z" />
      <path d="M12 6.5v13.7" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5c.6 3.7 1.8 4.9 5.5 5.5-3.7.6-4.9 1.8-5.5 5.5-.6-3.7-1.8-4.9-5.5-5.5 3.7-.6 4.9-1.8 5.5-5.5Z" />
      <path d="M18 15c.3 1.9.9 2.4 2.8 2.8-1.9.3-2.5.9-2.8 2.7-.3-1.8-.9-2.4-2.8-2.7 1.9-.4 2.5-.9 2.8-2.8Z" />
      <path d="M5.5 14.5c.2 1.4.7 1.9 2.1 2.1-1.4.2-1.9.7-2.1 2.1-.2-1.4-.7-1.9-2.1-2.1 1.4-.2 1.9-.7 2.1-2.1Z" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s6.5-5.4 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  );
}

export function ScrollIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 4h12a2 2 0 0 1 2 2v13a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2V4Z" />
      <path d="M6 4a2 2 0 0 0-2 2v2h2M10 9h6M10 13h6M10 17h4" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.3 10.8 7.4-4.2M8.3 13.2l7.4 4.2" />
    </svg>
  );
}

export function ZoomInIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8M8 11h6M11 8v6" />
    </svg>
  );
}

export function ZoomOutIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8M8 11h6" />
    </svg>
  );
}

export function ExpandIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}
