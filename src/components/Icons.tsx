interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

const Icon = ({ size = 20, className = '', strokeWidth = 1.5, style, children }: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    {children}
  </svg>
);

export const BedIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 9V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3" />
    <path d="M2 9h20v9H2z" />
    <path d="M7 9V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
  </Icon>
);

export const BathIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z" />
    <path d="M6 12V6a2 2 0 0 1 2-2h1" />
    <circle cx="9" cy="4" r="1" />
  </Icon>
);

export const OceanIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
    <path d="M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
    <path d="M2 7c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
  </Icon>
);

export const MountainIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 20l5-10 4 6 3-4 6 8H3z" />
  </Icon>
);

export const DiningIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 2v7c0 2.2 1.8 4 4 4h0" />
    <path d="M7 2v20" />
    <path d="M21 2v20" />
    <path d="M21 2c0 4-2 7-5 8" />
    <path d="M16 10c-3-1-5-4-5-8" />
  </Icon>
);

export const SpaIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 22C7 22 2 17.5 2 12c0-1.5.3-3 .9-4.3" />
    <path d="M12 22c5 0 10-4.5 10-10 0-1.5-.3-3-.9-4.3" />
    <path d="M12 2c-3 3-5 6-5 10" />
    <path d="M12 2c3 3 5 6 5 10" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const PoolIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 16c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0" />
    <path d="M6 8h12" />
    <path d="M9 4v4" />
    <path d="M15 4v4" />
    <path d="M6 8l3-4" />
    <path d="M18 8l-3-4" />
  </Icon>
);

export const WellnessIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21.6C6 17 2 13.2 2 9a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 4.2-4 8-10 12.6z" />
  </Icon>
);

export const CalendarIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Icon>
);

export const GuestsIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="7" r="4" />
    <path d="M2 21v-2a6 6 0 0 1 12 0v2" />
    <path d="M19 11v6M16 14h6" />
  </Icon>
);

export const LocationIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2C8.7 2 6 4.7 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.3-2.7-6-6-6z" />
    <circle cx="12" cy="8" r="2" />
  </Icon>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </Icon>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 12h18M3 6h18M3 18h18" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </Icon>
);

export const HeartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </Icon>
);

export const CompareIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
    <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
    <path d="M12 20V4" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);

export const ChevronUpIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 15l-6-6-6 6" />
  </Icon>
);

export const FitnessIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 4v16M18 4v16M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />
  </Icon>
);

export const ConciergeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z" />
    <path d="M2 12h20M12 12v8M8 20h8" />
  </Icon>
);

export const StarIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={1}>
    <path d="M12 2l3.1 6.3L22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1 3.1-6.3z" />
  </Icon>
);

export const InfoIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </Icon>
);

export const AccessibilityIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="4" r="2" />
    <path d="M7 22l1-8H5l2-7h10l2 7h-3l1 8H7z" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MinusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);
