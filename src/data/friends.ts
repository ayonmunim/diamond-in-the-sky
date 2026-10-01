/**
 * Local mock friends. A real friends backend would replace this — UI is
 * already structured around the same shape.
 */
export type MockStar = {
  id: string;
  name: string;
  color: string;
  size: number; // 0.5..1.5
};

export type Friend = {
  id: string;
  name: string;
  emoji: string;
  rank: string;
  online: boolean;
  galaxyTint: string;
  stars: MockStar[];
};

export const friends: Friend[] = [
  {
    id: "luna",
    name: "Luna",
    emoji: "🌙",
    rank: "Navigator",
    online: true,
    galaxyTint: "oklch(0.78 0.18 220)",
    stars: [
      { id: "ls1", name: "Moonbeam",   color: "oklch(0.88 0.10 90)",  size: 1.2 },
      { id: "ls2", name: "Silverfall", color: "oklch(0.85 0.06 230)", size: 0.9 },
      { id: "ls3", name: "Tidewish",   color: "oklch(0.78 0.16 200)", size: 1.0 },
    ],
  },
  {
    id: "atlas",
    name: "Atlas",
    emoji: "🗺️",
    rank: "Explorer",
    online: false,
    galaxyTint: "oklch(0.78 0.20 30)",
    stars: [
      { id: "as1", name: "Wayfinder",  color: "oklch(0.82 0.18 70)",  size: 1.4 },
      { id: "as2", name: "Compass",    color: "oklch(0.75 0.20 50)",  size: 0.7 },
    ],
  },
  {
    id: "vega",
    name: "Vega",
    emoji: "🎶",
    rank: "Astronomer",
    online: true,
    galaxyTint: "oklch(0.80 0.16 280)",
    stars: [
      { id: "vs1", name: "Harmony",   color: "oklch(0.85 0.16 305)", size: 1.1 },
      { id: "vs2", name: "Rhythm",    color: "oklch(0.78 0.18 260)", size: 0.9 },
      { id: "vs3", name: "Echo",      color: "oklch(0.88 0.10 200)", size: 1.0 },
      { id: "vs4", name: "Melody",    color: "oklch(0.80 0.14 320)", size: 0.8 },
    ],
  },
  {
    id: "orion-jr",
    name: "Orion Jr",
    emoji: "🏹",
    rank: "Cadet",
    online: true,
    galaxyTint: "oklch(0.75 0.20 25)",
    stars: [
      { id: "oj1", name: "Bowstring", color: "oklch(0.78 0.20 30)", size: 1.0 },
    ],
  },
];

export const quickMessages = [
  "Great job!",
  "Let's explore together!",
  "Awesome star!",
  "Congratulations!",
  "You're a true Sky Explorer!",
  "Wow — that constellation is beautiful!",
];

export function friendById(id: string): Friend | undefined {
  return friends.find((f) => f.id === id);
}
