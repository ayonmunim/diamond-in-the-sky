export type DailyMission = {
  id: string;
  title: string;
  desc: string;
  reward: { stars: number; coins: number };
  target: { kind: "lesson" | "level" | "chapter" | "quiz"; n: number };
};

export const dailyMissions: DailyMission[] = [
  { id: "daily-1", title: "Stargaze!",            desc: "Complete 1 lesson today.",          reward: { stars: 3, coins: 5 },  target: { kind: "lesson",  n: 1 } },
  { id: "daily-2", title: "Mission ready",        desc: "Finish 1 mission in Play Mode.",    reward: { stars: 5, coins: 8 },  target: { kind: "level",   n: 1 } },
  { id: "daily-3", title: "Story explorer",       desc: "Play any story chapter.",            reward: { stars: 5, coins: 10 }, target: { kind: "chapter", n: 1 } },
  { id: "daily-4", title: "Quiz lightning round", desc: "Score 3 correct in the Star Quiz.",  reward: { stars: 4, coins: 6 },  target: { kind: "quiz",    n: 3 } },
];
