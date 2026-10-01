/**
 * Spaceship part catalog. Players unlock new engines, wings, etc. by
 * completing missions. ShipPreview renders the current loadout.
 */
export type ShipSlot = "hull" | "engine" | "wings" | "trail";

export type ShipPart = {
  id: string;
  slot: ShipSlot;
  name: string;
  emoji: string;
  color: string;
  unlockedByLevel: number;
};

export const shipParts: ShipPart[] = [
  { id: "hull-classic",  slot: "hull",   name: "Classic Hull",  emoji: "🚀", color: "oklch(0.90 0.04 230)", unlockedByLevel: 0 },
  { id: "hull-gold",     slot: "hull",   name: "Gold Cruiser",  emoji: "🥇", color: "oklch(0.85 0.16 85)",  unlockedByLevel: 5 },
  { id: "hull-nebula",   slot: "hull",   name: "Nebula Hull",   emoji: "🌌", color: "oklch(0.55 0.22 310)", unlockedByLevel: 10 },
  { id: "hull-crystal",  slot: "hull",   name: "Crystal Hull",  emoji: "💎", color: "oklch(0.85 0.10 195)", unlockedByLevel: 12 },

  { id: "engine-blue",   slot: "engine", name: "Plasma Blue",   emoji: "💙", color: "oklch(0.78 0.18 230)", unlockedByLevel: 0 },
  { id: "engine-warp",   slot: "engine", name: "Warp Red",      emoji: "🔴", color: "oklch(0.65 0.25 25)",  unlockedByLevel: 3 },
  { id: "engine-green",  slot: "engine", name: "Antimatter",    emoji: "💚", color: "oklch(0.78 0.18 150)", unlockedByLevel: 8 },

  { id: "wings-short",   slot: "wings",  name: "Short Wings",   emoji: "🪶", color: "oklch(0.90 0.04 230)", unlockedByLevel: 0 },
  { id: "wings-swept",   slot: "wings",  name: "Swept Wings",   emoji: "✈️", color: "oklch(0.78 0.16 85)",  unlockedByLevel: 4 },
  { id: "wings-stellar", slot: "wings",  name: "Stellar Wings", emoji: "🌟", color: "oklch(0.85 0.16 195)", unlockedByLevel: 9 },

  { id: "trail-spark",   slot: "trail",  name: "Sparkle Trail", emoji: "✨", color: "oklch(0.92 0.10 90)",  unlockedByLevel: 0 },
  { id: "trail-rainbow", slot: "trail",  name: "Rainbow Trail", emoji: "🌈", color: "oklch(0.80 0.20 200)", unlockedByLevel: 6 },
  { id: "trail-cosmic",  slot: "trail",  name: "Cosmic Trail",  emoji: "💫", color: "oklch(0.55 0.22 310)", unlockedByLevel: 11 },
];

export const defaultShip: Record<ShipSlot, string> = {
  hull: "hull-classic",
  engine: "engine-blue",
  wings: "wings-short",
  trail: "trail-spark",
};

export function partsBySlot(slot: ShipSlot) {
  return shipParts.filter((p) => p.slot === slot);
}

export function shipPartById(id: string): ShipPart | undefined {
  return shipParts.find((p) => p.id === id);
}
