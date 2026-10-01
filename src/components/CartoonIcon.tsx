/**
 * Chunky cartoon SVG icon set (National Geographic Kids style):
 * thick dark outlines, bright flat fills, soft shine highlight.
 * Replaces emoji so planets/stars/avatars look hand-drawn and consistent.
 */

export type IconKind =
  | "star"
  | "sun"
  | "planet"
  | "ringed"
  | "earth"
  | "moon"
  | "galaxy"
  | "nebula"
  | "cluster"
  | "comet"
  | "telescope"
  | "trophy"
  | "rocket"
  | "astronaut";

const OUTLINE = "oklch(0.18 0.05 285)";

/** Map legacy emoji to a cartoon icon kind. */
export function kindFromEmoji(emoji: string, fallback: IconKind = "planet"): IconKind {
  const map: Record<string, IconKind> = {
    "⭐": "star", "✨": "star", "🌟": "star", "💫": "star", "🌠": "comet", "☄️": "comet",
    "☀️": "sun", "🌞": "sun", "🔆": "sun", "🧅": "sun", "⚡": "sun",
    "🪐": "ringed", "🌍": "earth", "🌎": "earth", "🌏": "earth", "🌕": "moon", "🌙": "moon",
    "🌌": "galaxy", "🌫️": "nebula", "☁️": "nebula", "✳️": "cluster", "❇️": "cluster",
    "🔭": "telescope", "🏆": "trophy", "🚀": "rocket", "👩‍🚀": "astronaut", "🧑‍🚀": "astronaut",
  };
  return map[emoji] ?? fallback;
}

export function CartoonIcon({
  kind,
  color = "oklch(0.84 0.18 80)",
  className = "h-16 w-16",
}: { kind: IconKind; color?: string; className?: string }) {
  const stroke = OUTLINE;
  const sw = 5;

  const shine = (
    <ellipse cx="38" cy="34" rx="13" ry="9" fill="oklch(1 0 0 / 0.45)" transform="rotate(-25 38 34)" />
  );

  const body = () => {
    switch (kind) {
      case "star":
        return (
          <>
            <path
              d="M50 8 62 36 92 40 70 60 76 90 50 75 24 90 30 60 8 40 38 36Z"
              fill={color}
              stroke={stroke}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <circle cx="41" cy="52" r="4" fill={stroke} />
            <circle cx="59" cy="52" r="4" fill={stroke} />
            <path d="M42 62c4 5 12 5 16 0" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        );
      case "sun":
        return (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x="47"
                y="2"
                width="6"
                height="16"
                rx="3"
                fill={color}
                stroke={stroke}
                strokeWidth="3"
                transform={`rotate(${i * 30} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="30" fill={color} stroke={stroke} strokeWidth={sw} />
            <circle cx="41" cy="46" r="3.5" fill={stroke} />
            <circle cx="59" cy="46" r="3.5" fill={stroke} />
            <path d="M42 58c4 6 12 6 16 0" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        );
      case "planet":
        return (
          <>
            <circle cx="50" cy="50" r="36" fill={color} stroke={stroke} strokeWidth={sw} />
            <circle cx="36" cy="40" r="7" fill="oklch(0.25 0.05 285 / 0.28)" />
            <circle cx="62" cy="58" r="10" fill="oklch(0.25 0.05 285 / 0.22)" />
            <circle cx="58" cy="30" r="5" fill="oklch(0.25 0.05 285 / 0.22)" />
            {shine}
          </>
        );
      case "ringed":
        return (
          <>
            <circle cx="50" cy="48" r="30" fill={color} stroke={stroke} strokeWidth={sw} />
            <path d="M44 38h22M38 50h30M44 62h22" stroke="oklch(0.25 0.05 285 / 0.25)" strokeWidth="6" strokeLinecap="round" />
            <ellipse
              cx="50"
              cy="52"
              rx="46"
              ry="13"
              fill="none"
              stroke={stroke}
              strokeWidth={sw}
              transform="rotate(-18 50 52)"
            />
            <ellipse
              cx="50"
              cy="52"
              rx="46"
              ry="13"
              fill="none"
              stroke="oklch(0.94 0.12 95)"
              strokeWidth="5"
              strokeDasharray="18 10"
              transform="rotate(-18 50 52)"
            />
            {shine}
          </>
        );
      case "earth":
        return (
          <>
            <circle cx="50" cy="50" r="36" fill="oklch(0.70 0.16 235)" stroke={stroke} strokeWidth={sw} />
            <path
              d="M24 44c10-6 14 4 22 2s10-10 18-6 12 2 14 8c-4 12-16 22-30 22S26 58 24 44Z"
              fill="oklch(0.72 0.17 150)"
              stroke={stroke}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {shine}
          </>
        );
      case "moon":
        return (
          <>
            <circle cx="50" cy="50" r="36" fill="oklch(0.88 0.03 90)" stroke={stroke} strokeWidth={sw} />
            <circle cx="38" cy="40" r="8" fill="oklch(0.25 0.05 285 / 0.18)" />
            <circle cx="62" cy="60" r="11" fill="oklch(0.25 0.05 285 / 0.15)" />
            <circle cx="64" cy="34" r="5" fill="oklch(0.25 0.05 285 / 0.15)" />
          </>
        );
      case "galaxy":
        return (
          <>
            <ellipse cx="50" cy="50" rx="44" ry="26" fill={color} stroke={stroke} strokeWidth={sw} transform="rotate(-20 50 50)" />
            <path
              d="M28 54c8-14 36-16 44-4"
              stroke="oklch(1 0 0 / 0.6)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              transform="rotate(-20 50 50)"
            />
            <circle cx="50" cy="50" r="10" fill="oklch(0.97 0.08 95)" stroke={stroke} strokeWidth="4" />
          </>
        );
      case "nebula":
        return (
          <>
            <path
              d="M22 62c-10-4-8-20 4-22 0-14 18-20 27-11 10-8 25-1 24 11 11 3 12 18 1 22Z"
              fill={color}
              stroke={stroke}
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <circle cx="40" cy="46" r="3.5" fill="oklch(0.99 0.05 95)" />
            <circle cx="60" cy="38" r="3" fill="oklch(0.99 0.05 95)" />
            <circle cx="56" cy="56" r="4" fill="oklch(0.99 0.05 95)" />
          </>
        );
      case "cluster":
        return (
          <>
            <circle cx="50" cy="50" r="38" fill={color} opacity="0.35" stroke={stroke} strokeWidth="4" />
            {[
              [50, 26, 9], [32, 46, 7], [68, 44, 8], [42, 66, 6], [62, 68, 7], [50, 48, 5],
            ].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="oklch(0.97 0.10 95)" stroke={stroke} strokeWidth="3.5" />
            ))}
          </>
        );
      case "comet":
        return (
          <>
            <path d="M8 82 44 46l14 14Z" fill={color} stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="64" cy="38" r="20" fill="oklch(0.94 0.14 92)" stroke={stroke} strokeWidth={sw} />
            <ellipse cx="58" cy="32" rx="6" ry="4" fill="oklch(1 0 0 / 0.5)" transform="rotate(-25 58 32)" />
          </>
        );
      case "telescope":
        return (
          <>
            <rect x="20" y="34" width="56" height="20" rx="10" fill={color} stroke={stroke} strokeWidth={sw} transform="rotate(-20 50 44)" />
            <circle cx="76" cy="30" r="11" fill="oklch(0.90 0.14 200)" stroke={stroke} strokeWidth="4" />
            <path d="M40 60 32 88M52 58l10 30" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
          </>
        );
      case "trophy":
        return (
          <>
            <path d="M30 18h40v22a20 20 0 0 1-40 0Z" fill={color} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
            <path d="M30 24H18c0 14 6 18 14 18M70 24h12c0 14-6 18-14 18" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
            <path d="M44 60h12v14H44z" fill={color} stroke={stroke} strokeWidth="4" />
            <rect x="30" y="74" width="40" height="12" rx="6" fill={color} stroke={stroke} strokeWidth={sw} />
          </>
        );
      case "rocket":
        return (
          <>
            <path d="M50 8c14 12 20 28 20 44l-8 12H38l-8-12C30 36 36 20 50 8Z" fill={color} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
            <circle cx="50" cy="40" r="9" fill="oklch(0.90 0.14 200)" stroke={stroke} strokeWidth="4" />
            <path d="M38 56 24 74l14-4M62 56l14 18-14-4" fill={color} stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
            <path d="M44 76c2 10 4 14 6 16 2-2 4-6 6-16Z" fill="oklch(0.86 0.18 60)" stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
          </>
        );
      case "astronaut":
      default:
        return (
          <>
            <rect x="26" y="58" width="48" height="32" rx="14" fill={color} stroke={stroke} strokeWidth={sw} />
            <circle cx="50" cy="40" r="28" fill="oklch(0.96 0.02 250)" stroke={stroke} strokeWidth={sw} />
            <path d="M30 40a20 20 0 0 1 40 0 20 20 0 0 1-40 0Z" fill="oklch(0.30 0.09 275)" stroke={stroke} strokeWidth="4" />
            <ellipse cx="42" cy="34" rx="7" ry="5" fill="oklch(1 0 0 / 0.55)" transform="rotate(-20 42 34)" />
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 100 100" className={className} role="presentation" aria-hidden overflow="visible">
      {body()}
    </svg>
  );
}
