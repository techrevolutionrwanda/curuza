/**
 * Icons used by the AI screens.
 *
 * Paths and stroke widths are the ones used by the hi-fi template, so the
 * page keeps the same visual language instead of pulling in a new icon set.
 */

type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
};

function iconProps({ size = 18, strokeWidth = 2, className }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className,
  };
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...iconProps({ strokeWidth: 2.4, ...props })}>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 12h15M14 7l5 5-5 5" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 3.5l9.5 17h-19z" />
      <path d="M12 10v4.5M12 17.5v.01" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
    </svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

export function SpeakerIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 9v6h4l5 4V5L8 9z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

export function KeyboardIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 10h1M11 10h1M15 10h2M7 14h10" />
    </svg>
  );
}

export function GalleryIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-9 9" />
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 15V3M7 8l5-5 5 5" />
      <path d="M4 17v3h16v-3" />
    </svg>
  );
}

export function LightningIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 3l1.9 4.6 4.6 1.9-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
    </svg>
  );
}
