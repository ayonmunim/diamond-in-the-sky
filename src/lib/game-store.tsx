import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultEquipped, type AvatarSlot } from "@/data/avatarItems";
import { defaultShip, type ShipSlot } from "@/data/shipParts";
import { rankFor, type Rank } from "@/data/ranks";

export type CreatedStar = {
  id: string;
  name: string;
  mass: number;
  temperature: number;
  size: number;
  color: string;
  spin: number;
  brightness?: number;
  story?: string;
  createdAt: number;
};

export type SavedConstellation = {
  name: string;
  story?: string;
  points: { x: number; y: number }[];
};

export type GameState = {
  stars: number;
  coins: number;
  diamonds: number;
  gems: number;
  xp: number;
  completedLevels: number[];
  /** "missionId:levelId" keys for the Universe→Mission→Level system. */
  completedMissionLevels: string[];
  /** Stars (0..3) earned per mission level — same key shape. */
  missionLevelStars: Record<string, number>;
  completedLessons: string[];
  completedChapters: string[];
  earnedBadges: string[];
  unlockedAvatarItems: string[];
  unlockedShipParts: string[];
  equippedAvatar: Record<AvatarSlot, string>;
  equippedShip: Record<ShipSlot, string>;
  explorerName: string;
  customConstellations: SavedConstellation[];
  createdStars: CreatedStar[];
  /** Universe Explorer: ids of celestial objects the player has opened. */
  discoveredObjects: string[];
  /** Universe Explorer: highest scale level index reached. */
  maxScaleReached: number;
  dailyStreak: number;
  lastPlayedDate: string;
  settings: {
    voiceOn: boolean;
    musicOn: boolean;
    sfxOn: boolean;
    captionsOn: boolean;
    musicVolume: number;
    voiceVolume: number;
    sfxVolume: number;
  };
};

const DEFAULT: GameState = {
  stars: 0,
  coins: 0,
  diamonds: 0,
  gems: 20,
  xp: 0,
  completedLevels: [],
  completedMissionLevels: [],
  missionLevelStars: {},
  completedLessons: [],
  completedChapters: [],
  earnedBadges: ["first-light"],
  unlockedAvatarItems: ["hair-curly","eyes-round","helm-classic","suit-white","pack-basic","pet-rocket"],
  unlockedShipParts: ["hull-classic","engine-blue","wings-short","trail-spark"],
  equippedAvatar: { ...defaultEquipped },
  equippedShip: { ...defaultShip },
  explorerName: "Explorer",
  customConstellations: [],
  createdStars: [],
  discoveredObjects: [],
  maxScaleReached: 0,
  dailyStreak: 0,
  lastPlayedDate: "",
  settings: {
    voiceOn: true, musicOn: true, sfxOn: true, captionsOn: true,
    musicVolume: 0.35, voiceVolume: 0.8, sfxVolume: 0.6,
  },
};

const XP_PER_LEVEL = 100;

type LevelReward = { stars?: number; gems?: number; xp?: number; coins?: number; badgeId?: string; unlockAvatarItemId?: string; unlockShipPartId?: string };

type Ctx = {
  state: GameState;
  level: number;
  xpIntoLevel: number;
  rank: Rank;
  addStars: (n: number) => void;
  addCoins: (n: number) => void;
  addDiamonds: (n: number) => void;
  addGems: (n: number) => void;
  addXp: (n: number) => void;
  completeLevel: (id: number, stars: number) => void;
  completeMissionLevel: (missionId: string, levelId: string, starsEarned: number, reward: LevelReward) => void;
  completeLesson: (id: string) => void;
  completeChapter: (id: string, reward: { stars: number; coins: number; xp: number }) => void;
  earnBadge: (id: string) => void;
  unlockAvatarItem: (id: string) => void;
  unlockShipPart: (id: string) => void;
  equipAvatar: (slot: AvatarSlot, itemId: string) => void;
  equipShip: (slot: ShipSlot, partId: string) => void;
  setExplorerName: (n: string) => void;
  saveConstellation: (c: SavedConstellation) => void;
  saveStar: (s: CreatedStar) => void;
  discoverObject: (id: string) => void;
  reachScale: (levelIndex: number) => void;
  updateSettings: (s: Partial<GameState["settings"]>) => void;
  pingDaily: () => void;
  reset: () => void;
};

const GameCtx = createContext<Ctx | null>(null);
const KEY = "dits-game-state-v3";

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({
          ...DEFAULT,
          ...parsed,
          equippedAvatar: { ...DEFAULT.equippedAvatar, ...(parsed.equippedAvatar ?? {}) },
          equippedShip: { ...DEFAULT.equippedShip, ...(parsed.equippedShip ?? {}) },
          settings: { ...DEFAULT.settings, ...(parsed.settings ?? {}) },
        });
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, loaded]);

  const level = Math.floor(state.xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = state.xp % XP_PER_LEVEL;
  const rank = rankFor(state.xp);

  const ctx: Ctx = {
    state, level, xpIntoLevel, rank,
    addStars:    (n) => setState((s) => ({ ...s, stars: s.stars + n })),
    addCoins:    (n) => setState((s) => ({ ...s, coins: s.coins + n })),
    addDiamonds: (n) => setState((s) => ({ ...s, diamonds: s.diamonds + n })),
    addGems:     (n) => setState((s) => ({ ...s, gems: s.gems + n })),
    addXp:       (n) => setState((s) => ({ ...s, xp: s.xp + n })),
    completeLevel: (id, stars) =>
      setState((s) => ({
        ...s, stars: s.stars + stars, xp: s.xp + 20, coins: s.coins + 5,
        completedLevels: s.completedLevels.includes(id) ? s.completedLevels : [...s.completedLevels, id],
      })),
    completeMissionLevel: (missionId, levelId, starsEarned, reward) =>
      setState((s) => {
        const key = `${missionId}:${levelId}`;
        const already = s.completedMissionLevels.includes(key);
        const prevStars = s.missionLevelStars[key] ?? 0;
        const newStars = Math.max(prevStars, starsEarned);
        const next: GameState = {
          ...s,
          completedMissionLevels: already ? s.completedMissionLevels : [...s.completedMissionLevels, key],
          missionLevelStars: { ...s.missionLevelStars, [key]: newStars },
          stars: s.stars + (reward.stars ?? 0),
          gems:  s.gems  + (reward.gems  ?? 0),
          xp:    s.xp    + (reward.xp    ?? 0),
          coins: s.coins + (reward.coins ?? 0),
        };
        if (reward.badgeId && !next.earnedBadges.includes(reward.badgeId)) {
          next.earnedBadges = [...next.earnedBadges, reward.badgeId];
        }
        if (reward.unlockAvatarItemId && !next.unlockedAvatarItems.includes(reward.unlockAvatarItemId)) {
          next.unlockedAvatarItems = [...next.unlockedAvatarItems, reward.unlockAvatarItemId];
        }
        if (reward.unlockShipPartId && !next.unlockedShipParts.includes(reward.unlockShipPartId)) {
          next.unlockedShipParts = [...next.unlockedShipParts, reward.unlockShipPartId];
        }
        return next;
      }),
    completeLesson: (id) =>
      setState((s) => ({
        ...s, xp: s.xp + (s.completedLessons.includes(id) ? 0 : 15),
        coins: s.coins + (s.completedLessons.includes(id) ? 0 : 3),
        completedLessons: s.completedLessons.includes(id) ? s.completedLessons : [...s.completedLessons, id],
      })),
    completeChapter: (id, reward) =>
      setState((s) => {
        if (s.completedChapters.includes(id)) return s;
        return {
          ...s,
          stars: s.stars + reward.stars,
          coins: s.coins + reward.coins,
          xp: s.xp + reward.xp,
          diamonds: s.diamonds + 1,
          completedChapters: [...s.completedChapters, id],
        };
      }),
    earnBadge: (id) =>
      setState((s) => ({ ...s, earnedBadges: s.earnedBadges.includes(id) ? s.earnedBadges : [...s.earnedBadges, id] })),
    unlockAvatarItem: (id) =>
      setState((s) => ({ ...s, unlockedAvatarItems: s.unlockedAvatarItems.includes(id) ? s.unlockedAvatarItems : [...s.unlockedAvatarItems, id] })),
    unlockShipPart: (id) =>
      setState((s) => ({ ...s, unlockedShipParts: s.unlockedShipParts.includes(id) ? s.unlockedShipParts : [...s.unlockedShipParts, id] })),
    equipAvatar: (slot, itemId) =>
      setState((s) => ({ ...s, equippedAvatar: { ...s.equippedAvatar, [slot]: itemId } })),
    equipShip: (slot, partId) =>
      setState((s) => ({ ...s, equippedShip: { ...s.equippedShip, [slot]: partId } })),
    setExplorerName: (n) => setState((s) => ({ ...s, explorerName: n })),
    saveConstellation: (c) =>
      setState((s) => ({ ...s, customConstellations: [...s.customConstellations, c] })),
    saveStar: (st) =>
      setState((s) => ({ ...s, createdStars: [...s.createdStars, st] })),
    discoverObject: (id) =>
      setState((s) =>
        s.discoveredObjects.includes(id)
          ? s
          : { ...s, discoveredObjects: [...s.discoveredObjects, id], xp: s.xp + 5 },
      ),
    reachScale: (levelIndex) =>
      setState((s) => (levelIndex > s.maxScaleReached ? { ...s, maxScaleReached: levelIndex } : s)),
    updateSettings: (p) =>
      setState((s) => ({ ...s, settings: { ...s.settings, ...p } })),
    pingDaily: () => {
      const today = new Date().toISOString().slice(0, 10);
      setState((s) => {
        if (s.lastPlayedDate === today) return s;
        const yest = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
        const streak = s.lastPlayedDate === yest ? s.dailyStreak + 1 : 1;
        return { ...s, lastPlayedDate: today, dailyStreak: streak };
      });
    },
    reset: () => setState(DEFAULT),
  };

  return <GameCtx.Provider value={ctx}>{children}</GameCtx.Provider>;
}

export function useGame() {
  const c = useContext(GameCtx);
  if (!c) throw new Error("useGame must be used inside GameProvider");
  return c;
}
