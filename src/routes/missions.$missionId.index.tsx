import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { SpaceScene } from "@/components/SpaceScene";
import { SceneTransition } from "@/components/SceneTransition";
import { Hud } from "@/components/HudBubble";
import { missionById, isLevelUnlocked, isMissionUnlocked, chapterOfMission, type Mission } from "@/data/universe";
import { useGame } from "@/lib/game-store";

export const Route = createFileRoute("/missions/$missionId/")({
  loader: ({ params }) => {
    const m = missionById(params.missionId);
    if (!m) throw notFound();
    return { mission: m };
  },
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center text-white">Mission not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-dvh items-center justify-center text-white">{error.message}</div>
  ),
  component: MissionDetail,
});

function MissionDetail() {
  const { mission } = Route.useLoaderData() as { mission: Mission };
  const { state } = useGame();
  const missionUnlocked = isMissionUnlocked(mission, state.completedMissionLevels);
  const chapter = chapterOfMission(mission.id);

  return (
    <SceneTransition>
      <SpaceScene density={140} variant="nebula" />
      <Hud backTo="/missions" />

      <main className="relative mx-auto max-w-3xl px-4 pb-16 pt-24 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {chapter && (
            <Link
              to="/chapters/$chapterId"
              params={{ chapterId: chapter.id }}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 hover:text-white"
            >
              ← Chapter {chapter.index}: {chapter.name}
            </Link>
          )}
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-gold">Mission {mission.index}</div>
          <div className="mt-1 text-6xl">{mission.emoji}</div>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{mission.name}</h1>
          <p className="mt-2 text-sm text-white/70">{mission.description}</p>
        </motion.div>

        {!missionUnlocked ? (
          <div className="mt-10 text-center text-white/70">
            <Lock className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-3 text-sm">Finish the previous mission to unlock this one.</p>
            <Link to="/missions" className="mt-4 inline-block rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/20">
              ← Back to Chapters
            </Link>
          </div>
        ) : (
          <LevelPath mission={mission} />
        )}
      </main>
    </SceneTransition>
  );
}

function LevelPath({ mission }: { mission: Mission }) {
  const { state } = useGame();

  return (
    <div className="relative mt-10">
      {/* connecting path (vertical zigzag) */}
      <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 500">
        <path
          d="M 20 30 Q 80 110, 20 190 Q 80 270, 20 350 Q 80 430, 50 490"
          fill="none"
          stroke={mission.color}
          strokeWidth="0.6"
          strokeDasharray="2 3"
          opacity="0.6"
        />
      </svg>

      <ol className="relative space-y-6">
        {mission.levels.map((lvl, i) => {
          const key = `${mission.id}:${lvl.id}`;
          const done = state.completedMissionLevels.includes(key);
          const unlocked = isLevelUnlocked(mission, i, state.completedMissionLevels);
          const isCurrent = unlocked && !done;
          const stars = state.missionLevelStars[key] ?? 0;

          const isLeft = i % 2 === 0;

          const node = (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: isLeft ? -30 : 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 220, damping: 22 }}
              whileHover={unlocked ? { y: -3, scale: 1.04 } : undefined}
              className={`relative flex flex-col items-center justify-center rounded-3xl p-4 ring-1 ${
                done       ? "bg-gold/10 ring-gold/40" :
                isCurrent  ? "bg-white/10 ring-white/30" :
                             "bg-white/4 ring-white/10 saturate-50"
              }`}
              style={{ width: 160 }}
            >
              {/* glow ring for current */}
              {isCurrent && (
                <motion.div
                  className="pointer-events-none absolute -inset-2 rounded-3xl"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ boxShadow: `0 0 25px ${lvl.color.replace(")", " / 0.7)").replace("oklch(", "oklch(")}` }}
                />
              )}

              <motion.div
                animate={isCurrent ? { scale: [1, 1.08, 1] } : undefined}
                transition={{ duration: 2, repeat: Infinity }}
                className="grid h-20 w-20 place-items-center rounded-full text-3xl"
                style={{
                  background: unlocked
                    ? `radial-gradient(circle at 32% 28%, oklch(0.99 0.04 95 / 0.9), ${lvl.color} 55%, oklch(0.20 0.06 270))`
                    : "radial-gradient(circle, oklch(0.35 0.04 270), oklch(0.15 0.04 270))",
                  boxShadow: unlocked ? `0 0 22px ${lvl.color.replace(")", " / 0.55)").replace("oklch(", "oklch(")}` : undefined,
                }}
              >
                {!unlocked ? (
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Lock className="h-7 w-7 text-gold" />
                  </motion.div>
                ) : done ? (
                  <Check className="h-7 w-7 text-emerald-300" />
                ) : (
                  lvl.emoji
                )}
              </motion.div>

              <div className="mt-2 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/55">Level {lvl.index}</div>
                <div className="font-display text-sm font-bold text-white">{lvl.name}</div>
                <div className="mt-1 flex items-center justify-center gap-0.5 text-xs">
                  {[1, 2, 3].map((n) => (
                    <span key={n} className={n <= stars ? "text-gold" : "text-white/20"}>★</span>
                  ))}
                </div>
              </div>

              {!unlocked && (
                <div className="pointer-events-none absolute inset-x-2 -bottom-2 translate-y-full rounded-full bg-black/70 px-3 py-1 text-center text-[10px] font-semibold text-white/90 opacity-0 ring-1 ring-white/15 transition group-hover:opacity-100">
                  Complete the previous level
                </div>
              )}
            </motion.div>
          );

          return (
            <li key={lvl.id} className={`group flex ${isLeft ? "justify-start" : "justify-end"}`}>
              {unlocked ? (
                <Link
                  to="/missions/$missionId/$levelId"
                  params={{ missionId: mission.id, levelId: lvl.id }}
                  className="group"
                >
                  {node}
                </Link>
              ) : (
                <div className="group cursor-not-allowed" title="Complete the previous mission to unlock.">
                  {node}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
