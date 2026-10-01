/**
 * Universe registry — Chapter → Mission → Level.
 * Re-exports the Star Missions, the chapter grouping, and unlock helpers.
 */
export {
  starMissions as missions,
  missionById,
  levelInMission,
  isLevelUnlocked,
} from "./starMissions";
export type { StarMission as Mission, StarLevel, GameConfig } from "./starMissions";

export {
  chapters,
  chapterById,
  chapterOfMission,
  missionsOfChapter,
  chapterProgress,
  isChapterUnlocked,
  isMissionUnlocked,
} from "./chapters";
export type { Chapter } from "./chapters";

export function missionLevelKey(missionId: string, levelId: string): string {
  return `${missionId}:${levelId}`;
}
