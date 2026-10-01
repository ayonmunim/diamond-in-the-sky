/**
 * Avatar customization catalog. Items unlock as the player completes
 * zodiac levels. Visuals are SVG paths drawn by AvatarPreview.
 */
export type AvatarSlot = "hair" | "eyes" | "helmet" | "suit" | "backpack" | "pet";

export type AvatarItem = {
  id: string;
  slot: AvatarSlot;
  name: string;
  emoji: string;
  /** Hex/oklch color used for the slot. */
  color: string;
  /** Level index (1..12) that unlocks this item (0 = unlocked by default). */
  unlockedByLevel: number;
};

export const avatarItems: AvatarItem[] = [
  // hair (top of head)
  { id: "hair-curly",  slot: "hair", name: "Curly Galaxy",  emoji: "🌀", color: "oklch(0.70 0.22 305)", unlockedByLevel: 0 },
  { id: "hair-spike",  slot: "hair", name: "Comet Spike",   emoji: "⚡", color: "oklch(0.85 0.16 80)",  unlockedByLevel: 3 },
  { id: "hair-braids", slot: "hair", name: "Twin Braids",   emoji: "👧", color: "oklch(0.65 0.16 30)",  unlockedByLevel: 6 },
  { id: "hair-flame",  slot: "hair", name: "Solar Flames",  emoji: "🔥", color: "oklch(0.78 0.20 40)",  unlockedByLevel: 9 },

  // eyes
  { id: "eyes-round",  slot: "eyes", name: "Round Sparkle", emoji: "👀", color: "oklch(0.18 0.06 275)", unlockedByLevel: 0 },
  { id: "eyes-star",   slot: "eyes", name: "Star Eyes",     emoji: "✨", color: "oklch(0.85 0.16 90)",  unlockedByLevel: 2 },
  { id: "eyes-laser",  slot: "eyes", name: "Laser Eyes",    emoji: "🔴", color: "oklch(0.65 0.25 20)",  unlockedByLevel: 5 },
  { id: "eyes-galaxy", slot: "eyes", name: "Galaxy Eyes",   emoji: "🌌", color: "oklch(0.55 0.22 280)", unlockedByLevel: 11 },

  // helmets
  { id: "helm-classic",  slot: "helmet", name: "Classic Dome", emoji: "👨‍🚀", color: "oklch(0.90 0.02 230)", unlockedByLevel: 0 },
  { id: "helm-gold",     slot: "helmet", name: "Gold Visor",   emoji: "🥇", color: "oklch(0.85 0.16 85)",  unlockedByLevel: 4 },
  { id: "helm-aurora",   slot: "helmet", name: "Aurora Helm",  emoji: "🌈", color: "oklch(0.75 0.20 200)", unlockedByLevel: 7 },
  { id: "helm-crystal",  slot: "helmet", name: "Crystal Helm", emoji: "💎", color: "oklch(0.85 0.10 195)", unlockedByLevel: 12 },

  // suits
  { id: "suit-white",   slot: "suit", name: "Explorer White",  emoji: "🤍", color: "oklch(0.93 0.02 240)", unlockedByLevel: 0 },
  { id: "suit-orange",  slot: "suit", name: "Mission Orange",  emoji: "🟠", color: "oklch(0.75 0.20 50)",  unlockedByLevel: 1 },
  { id: "suit-stealth", slot: "suit", name: "Stealth Black",   emoji: "⚫", color: "oklch(0.25 0.04 280)", unlockedByLevel: 8 },
  { id: "suit-nebula",  slot: "suit", name: "Nebula Plasma",   emoji: "💜", color: "oklch(0.55 0.22 310)", unlockedByLevel: 10 },

  // backpacks
  { id: "pack-basic",   slot: "backpack", name: "Cadet Pack",   emoji: "🎒", color: "oklch(0.50 0.06 240)", unlockedByLevel: 0 },
  { id: "pack-jet",     slot: "backpack", name: "Jet Booster",  emoji: "🚀", color: "oklch(0.65 0.20 30)",  unlockedByLevel: 2 },
  { id: "pack-wings",   slot: "backpack", name: "Star Wings",   emoji: "🦋", color: "oklch(0.80 0.16 200)", unlockedByLevel: 6 },

  // pets
  { id: "pet-rocket",   slot: "pet", name: "Mini Rocket",    emoji: "🚀", color: "oklch(0.75 0.20 30)",  unlockedByLevel: 0 },
  { id: "pet-alien",    slot: "pet", name: "Friendly Alien", emoji: "👽", color: "oklch(0.80 0.18 150)", unlockedByLevel: 4 },
  { id: "pet-moon",     slot: "pet", name: "Pocket Moon",    emoji: "🌝", color: "oklch(0.92 0.06 90)",  unlockedByLevel: 7 },
  { id: "pet-saturn",   slot: "pet", name: "Tiny Saturn",    emoji: "🪐", color: "oklch(0.78 0.16 70)",  unlockedByLevel: 11 },
];

export const defaultEquipped: Record<AvatarSlot, string> = {
  hair: "hair-curly",
  eyes: "eyes-round",
  helmet: "helm-classic",
  suit: "suit-white",
  backpack: "pack-basic",
  pet: "pet-rocket",
};

export function itemsBySlot(slot: AvatarSlot) {
  return avatarItems.filter((i) => i.slot === slot);
}

export function avatarItemById(id: string): AvatarItem | undefined {
  return avatarItems.find((i) => i.id === id);
}
