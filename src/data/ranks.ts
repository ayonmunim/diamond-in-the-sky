export type Rank = {
  id: string;
  name: string;
  emoji: string;
  minXp: number;
};

export const ranks: Rank[] = [
  { id: "cadet",      name: "Cadet",      emoji: "🚀", minXp: 0 },
  { id: "explorer",   name: "Explorer",   emoji: "🛰️", minXp: 100 },
  { id: "navigator",  name: "Navigator",  emoji: "🧭", minXp: 300 },
  { id: "astronomer", name: "Astronomer", emoji: "🔭", minXp: 700 },
  { id: "starborn",   name: "Starborn",   emoji: "🌟", minXp: 1500 },
];

export function rankFor(xp: number): Rank {
  let current = ranks[0];
  for (const r of ranks) if (xp >= r.minXp) current = r;
  return current;
}

export function nextRank(xp: number): Rank | null {
  return ranks.find((r) => r.minXp > xp) ?? null;
}
