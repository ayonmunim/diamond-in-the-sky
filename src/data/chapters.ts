/**
 * Chapters — the top layer of the Play hierarchy:
 *   Chapter → Mission → Level
 *
 * Missions themselves live in `starMissions.ts`; a chapter simply groups them
 * in play order. Adding a new chapter is just another entry here.
 */
import { starMissions, type StarMission } from "./starMissions";
import { usesScienceLab } from "./specialMissions";

export type Chapter = {
  id: string;
  index: number;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  color: string;
  missionIds: string[];
};

export const chapters: Chapter[] = [
  {
    id: "planet-star",
    index: 1,
    name: "Planets & Stars",
    tagline: "Where every journey begins",
    description: "Meet our Sun, the worlds around it, and learn what stars are made of.",
    emoji: "🪐",
    color: "oklch(0.84 0.18 80)",
    missionIds: [
      "what-is-a-star",
      "twinkle",
      "planets",
      "star-colors",
      "distance-brightness",
      "the-sun",
      "variable-stars",
      "star-classes",
    ],
  },
  {
    id: "constellation",
    index: 2,
    name: "Constellations",
    tagline: "Star pictures in the sky",
    description: "Connect the stars and learn the patterns explorers have followed for centuries.",
    emoji: "🌠",
    color: "oklch(0.80 0.18 250)",
    missionIds: ["constellations"],
  },
  {
    id: "nebula-galaxy",
    index: 3,
    name: "Nebulas & Galaxies",
    tagline: "Star nurseries and star cities",
    description: "Fly through glowing clouds where stars are born, then out among the galaxies.",
    emoji: "🌌",
    color: "oklch(0.74 0.20 300)",
    missionIds: ["nebulas", "galaxies"],
  },
  {
    id: "cluster",
    index: 4,
    name: "Star Clusters",
    tagline: "Stars that grew up together",
    description: "Discover open and globular clusters — whole families of stars in one place.",
    emoji: "✳️",
    color: "oklch(0.84 0.16 200)",
    missionIds: ["star-clusters"],
  },
];

export function chapterById(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function missionsOfChapter(chapter: Chapter): StarMission[] {
  return chapter.missionIds
    .map((id) => starMissions.find((m) => m.id === id))
    .filter((m): m is StarMission => !!m);
}

export function chapterOfMission(missionId: string): Chapter | undefined {
  return chapters.find((c) => c.missionIds.includes(missionId));
}

function missionComplete(mission: StarMission, completed: string[]): boolean {
  return mission.levels.every((l) => completed.includes(`${mission.id}:${l.id}`));
}

export function chapterProgress(chapter: Chapter, completed: string[]) {
  const missions = missionsOfChapter(chapter);
  const total = missions.reduce((n, m) => n + m.levels.length, 0);
  const done = missions.reduce(
    (n, m) => n + m.levels.filter((l) => completed.includes(`${m.id}:${l.id}`)).length,
    0,
  );
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

/** Chapter 1 is always open; later chapters need the previous chapter finished. */
export function isChapterUnlocked(chapter: Chapter, completed: string[]): boolean {
  if (chapter.index === 1) return true;
  const prev = chapters[chapter.index - 2];
  if (!prev) return true;
  return missionsOfChapter(prev).every((m) => missionComplete(m, completed));
}

/**
 * Chapter-aware mission unlock: the first mission of an unlocked chapter is
 * open, and each later mission needs the previous mission in the same chapter.
 */
export function isMissionUnlocked(mission: StarMission, completed: string[]): boolean {
  if (usesScienceLab(mission.id)) return true;
  const chapter = chapterOfMission(mission.id);
  if (!chapter) return mission.index === 1;
  if (!isChapterUnlocked(chapter, completed)) return false;
  const pos = chapter.missionIds.indexOf(mission.id);
  if (pos <= 0) return true;
  const prev = starMissions.find((m) => m.id === chapter.missionIds[pos - 1]);
  return !prev || missionComplete(prev, completed);
}
