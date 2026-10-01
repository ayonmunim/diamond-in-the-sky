/**
 * Live SVG preview of an avatar made of swappable slot items.
 */
import { avatarItemById } from "@/data/avatarItems";

export function AvatarPreview({
  equipped,
  size = 220,
}: {
  equipped: { hair: string; eyes: string; helmet: string; suit: string; backpack: string; pet: string };
  size?: number;
}) {
  const hair = avatarItemById(equipped.hair);
  const eyes = avatarItemById(equipped.eyes);
  const helmet = avatarItemById(equipped.helmet);
  const suit = avatarItemById(equipped.suit);
  const backpack = avatarItemById(equipped.backpack);
  const pet = avatarItemById(equipped.pet);

  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <radialGradient id="av-bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="oklch(0.92 0.10 95 / 0.4)" />
          <stop offset="100%" stopColor="oklch(0.10 0.04 270 / 0)" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="95" fill="url(#av-bg)" />

      {/* backpack (behind body) */}
      {backpack && (
        <rect x="70" y="105" width="60" height="40" rx="12" fill={backpack.color} stroke="oklch(0 0 0 / 0.3)" strokeWidth="1.5" />
      )}

      {/* suit body */}
      <rect x="65" y="100" width="70" height="70" rx="18" fill={suit?.color ?? "white"} stroke="oklch(0 0 0 / 0.25)" strokeWidth="1.5" />
      {/* belt */}
      <rect x="63" y="130" width="74" height="8" rx="3" fill="oklch(0.30 0.04 270)" />
      {/* arms */}
      <rect x="48" y="105" width="20" height="50" rx="10" fill={suit?.color ?? "white"} stroke="oklch(0 0 0 / 0.25)" strokeWidth="1.5" />
      <rect x="132" y="105" width="20" height="50" rx="10" fill={suit?.color ?? "white"} stroke="oklch(0 0 0 / 0.25)" strokeWidth="1.5" />
      {/* gloves */}
      <circle cx="58" cy="160" r="11" fill="oklch(0.92 0.04 240)" />
      <circle cx="142" cy="160" r="11" fill="oklch(0.92 0.04 240)" />

      {/* head */}
      <circle cx="100" cy="75" r="30" fill="oklch(0.85 0.06 60)" />
      {/* hair (top) */}
      {hair && <path d="M 72 65 Q 75 38 100 38 Q 125 38 128 65 Q 110 50 100 55 Q 90 50 72 65 Z" fill={hair.color} />}
      {/* helmet visor */}
      {helmet && (
        <>
          <circle cx="100" cy="75" r="34" fill="none" stroke={helmet.color} strokeWidth="3" opacity="0.95" />
          <path d="M 76 75 Q 100 52 124 75" stroke={helmet.color} strokeWidth="3" fill="none" opacity="0.7" />
        </>
      )}
      {/* eyes */}
      {eyes && (
        <g>
          <circle cx="90" cy="76" r="4" fill={eyes.color} />
          <circle cx="110" cy="76" r="4" fill={eyes.color} />
          <circle cx="91" cy="75" r="1.2" fill="white" />
          <circle cx="111" cy="75" r="1.2" fill="white" />
        </g>
      )}
      {/* smile */}
      <path d="M 90 88 Q 100 96 110 88" stroke="oklch(0.30 0.08 30)" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* pet */}
      {pet && (
        <g transform="translate(155, 150)">
          <circle r="14" fill={pet.color} />
          <circle r="14" fill="none" stroke="oklch(1 0 0 / 0.4)" strokeWidth="1.5" />
          <text textAnchor="middle" y="5" fontSize="14">{pet.emoji}</text>
        </g>
      )}
    </svg>
  );
}
