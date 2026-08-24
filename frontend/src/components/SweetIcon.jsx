// Illustrated stand-in for vendor photography: a colored tile (per category)
// holding a small shape (per sweet type) so the catalog reads as a designed
// menu rather than placeholder photos.
const FILLS = {
  golden: { base: "#F0A93B", light: "#FBD589", dark: "#C9781E" },
  brown: { base: "#8A5A2B", light: "#C08849", dark: "#5E3A1A" },
  white: { base: "#FFFBF2", light: "#FFFFFF", dark: "#F0E4C8" },
  orange: { base: "#F0762B", light: "#FBAA6B", dark: "#C4531A" },
  red: { base: "#D6432F", light: "#F17A5E", dark: "#A32C1D" },
  silver: { base: "#E4E7EC", light: "#FFFFFF", dark: "#B9C0CC" },
  green: { base: "#DDEFD8", light: "#F3FBEF", dark: "#B7D9AC" },
  cream: { base: "#FBF3E3", light: "#FFFDF7", dark: "#EBDCB8" },
};

function useFill(fill) {
  return FILLS[fill] || FILLS.golden;
}

export default function SweetIcon({ shape, fill, tone, className = "" }) {
  const c = useFill(fill);

  return (
    <div
      className={`relative aspect-square w-full grid place-items-center overflow-hidden rounded-card bg-gradient-to-br ${tone} ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
      <svg viewBox="0 0 100 100" className="relative w-2/3 h-2/3 drop-shadow-md">
        <Shape shape={shape} c={c} />
      </svg>
    </div>
  );
}

function Shape({ shape, c }) {
  switch (shape) {
    case "ball":
    case "whiteBall":
      return (
        <g>
          <ellipse cx="50" cy="80" rx="26" ry="6" fill="#000" opacity="0.08" />
          <circle cx="50" cy="52" r="30" fill={c.base} />
          <circle cx="41" cy="42" r="9" fill={c.light} opacity="0.7" />
          <circle cx="50" cy="52" r="30" fill="none" stroke={c.dark} strokeOpacity="0.25" strokeWidth="1.5" />
        </g>
      );
    case "disc":
      return (
        <g>
          <ellipse cx="50" cy="80" rx="28" ry="5" fill="#000" opacity="0.08" />
          <ellipse cx="50" cy="55" rx="32" ry="18" fill={c.base} />
          <ellipse cx="50" cy="50" rx="32" ry="18" fill={c.light} opacity="0.55" />
          <circle cx="50" cy="50" r="5" fill={c.dark} opacity="0.5" />
        </g>
      );
    case "square":
      return (
        <g>
          <rect x="22" y="26" width="56" height="48" rx="4" fill={c.base} />
          <rect x="22" y="26" width="56" height="48" rx="4" fill={c.light} opacity="0.35" />
          <line x1="22" y1="50" x2="78" y2="50" stroke={c.dark} strokeOpacity="0.3" strokeWidth="1.5" />
          <circle cx="68" cy="34" r="3.5" fill={c.dark} opacity="0.6" />
        </g>
      );
    case "diamond":
      return (
        <g transform="rotate(45 50 50)">
          <rect x="26" y="26" width="48" height="48" rx="4" fill={c.base} />
          <rect x="26" y="26" width="48" height="16" fill={c.light} opacity="0.7" />
          <line x1="26" y1="50" x2="74" y2="50" stroke={c.dark} strokeOpacity="0.3" strokeWidth="1.2" />
          <line x1="50" y1="26" x2="50" y2="74" stroke={c.dark} strokeOpacity="0.3" strokeWidth="1.2" />
        </g>
      );
    case "spiral":
      return (
        <g fill="none" stroke={c.base} strokeWidth="6" strokeLinecap="round">
          <path d="M50 30 a20 14 0 1 1 -14 24 a13 9 0 1 1 9 -16 a7 5 0 1 1 -5 9" />
          <path d="M50 30 a20 14 0 1 1 -14 24 a13 9 0 1 1 9 -16 a7 5 0 1 1 -5 9" stroke={c.light} strokeWidth="2" opacity="0.6" />
        </g>
      );
    case "bowl":
      return (
        <g>
          <path d="M20 52 Q50 78 80 52 L74 68 Q50 84 26 68 Z" fill={c.dark} opacity="0.9" />
          <ellipse cx="50" cy="50" rx="30" ry="12" fill={c.base} />
          <path d="M32 46 q6 -8 12 0 q6 -8 12 0 q6 -8 12 0" fill="none" stroke={c.light} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </g>
      );
    case "cone":
      return (
        <g>
          <ellipse cx="50" cy="76" rx="22" ry="5" fill="#000" opacity="0.08" />
          <path d="M50 24 C66 40 70 60 62 76 L38 76 C30 60 34 40 50 24 Z" fill={c.base} />
          <path d="M50 24 C58 32 60 40 58 48 M50 24 C42 32 40 40 42 48" stroke={c.dark} strokeOpacity="0.35" strokeWidth="2" fill="none" />
        </g>
      );
    case "crescent":
      return (
        <g>
          <ellipse cx="50" cy="78" rx="26" ry="5" fill="#000" opacity="0.08" />
          <path d="M28 60 Q30 28 62 26 Q46 34 46 55 Q46 68 62 74 Q34 82 28 60 Z" fill={c.base} />
          <path d="M30 58 Q40 46 34 32" stroke={c.dark} strokeOpacity="0.3" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "lattice":
      return (
        <g>
          <circle cx="50" cy="50" r="30" fill={c.base} />
          <circle cx="50" cy="50" r="30" fill="none" stroke={c.dark} strokeOpacity="0.3" strokeWidth="1.2" />
          <path d="M22 50h56M50 22v56M30 30l40 40M70 30 30 70" stroke={c.dark} strokeOpacity="0.25" strokeWidth="1.5" />
          <circle cx="50" cy="42" r="8" fill={c.light} opacity="0.85" />
        </g>
      );
    case "bar":
      return (
        <g>
          <rect x="18" y="38" width="64" height="24" rx="4" fill={c.base} />
          <circle cx="30" cy="46" r="3" fill={c.dark} opacity="0.6" />
          <circle cx="44" cy="54" r="3" fill={c.dark} opacity="0.6" />
          <circle cx="58" cy="46" r="3" fill={c.dark} opacity="0.6" />
          <circle cx="70" cy="54" r="3" fill={c.dark} opacity="0.6" />
          <rect x="18" y="38" width="64" height="8" fill={c.light} opacity="0.5" />
        </g>
      );
    case "jar":
      return (
        <g>
          <ellipse cx="50" cy="82" rx="24" ry="5" fill="#000" opacity="0.1" />
          <rect x="40" y="14" width="20" height="10" rx="3" fill={c.dark} />
          <rect x="43" y="10" width="14" height="7" rx="2" fill={c.dark} opacity="0.8" />
          <path d="M30 26 h40 v46 a20 12 0 0 1 -40 0 Z" fill={c.light} opacity="0.35" stroke={c.dark} strokeOpacity="0.3" strokeWidth="1.2" />
          <path d="M32 40 h36 v30 a18 10 0 0 1 -36 0 Z" fill={c.base} />
          <path d="M32 40 h36 v6 h-36 Z" fill={c.light} opacity="0.8" />
          <ellipse cx="42" cy="48" rx="4" ry="7" fill={c.light} opacity="0.6" />
        </g>
      );
    case "flatbread":
      return (
        <g>
          <ellipse cx="50" cy="78" rx="28" ry="5" fill="#000" opacity="0.08" />
          <circle cx="50" cy="52" r="30" fill={c.base} />
          <circle cx="50" cy="52" r="30" fill={c.light} opacity="0.25" />
          <circle cx="40" cy="44" r="2" fill={c.dark} opacity="0.5" />
          <circle cx="58" cy="50" r="2" fill={c.dark} opacity="0.5" />
          <circle cx="48" cy="62" r="2" fill={c.dark} opacity="0.5" />
          <circle cx="64" cy="60" r="2" fill={c.dark} opacity="0.5" />
        </g>
      );
    default:
      return <circle cx="50" cy="50" r="30" fill={c.base} />;
  }
}
