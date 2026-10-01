import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Star } from "lucide-react";
import { SpaceScene } from "@/components/SpaceScene";
import { SceneTransition } from "@/components/SceneTransition";
import { Hud } from "@/components/HudBubble";
import {
  chapters,
  missionsOfChapter,
  chapterProgress,
  isChapterUnlocked,
  isMissionUnlocked,
} from "@/data/universe";
import { useGame } from "@/lib/game-store";
import { CartoonIcon, kindFromEmoji } from "@/components/CartoonIcon";

export const Route = createFileRoute("/missions/")({
  head: () => ({
    meta: [
      { title: "Chapters & Missions — Diamond In The Sky" },
      {
        name: "description",
        content:
          "Pick a chapter — Planets & Stars, Constellations, Nebulas & Galaxies or Star Clusters — and jump straight into its missions and levels.",
      },
      { property: "og:title", content: "Chapters & Missions — Diamond In The Sky" },
      {
        property: "og:description",
        content: "Hop between space chapters and launch any mission from one colourful map.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChapterHub,
});

function ChapterHub() {
  const { state } = useGame();
  const done = state.completedMissionLevels;
  const firstOpen = chapters.find((c) => isChapterUnlocked(c, done)) ?? chapters[0];
  const [activeId, setActiveId] = useState(firstOpen.id);
  const active = chapters.find((c) => c.id === activeId) ?? firstOpen;
  const activeOpen = isChapterUnlocked(active, done);
  const missions = missionsOfChapter(active);

  return (
    <SceneTransition>
      <SpaceScene density={160} variant="nebula" />
      <Hud />

      <main className="relative mx-auto max-w-6xl px-4 pb-16 pt-24 sm:pt-28">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-display text-4xl font-bold text-white toon-text sm:text-5xl">
            Space Adventure Map
          </h1>
          <p className="mt-2 text-sm font-semibold text-white/70">
            Tap a chapter planet, then blast off into a mission!
          </p>
        </motion.div>

        {/* Chapter planet rail */}
        <div className="mt-8 -mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-end justify-center gap-5 sm:gap-8">
            {chapters.map((c, i) => {
              const unlocked = isChapterUnlocked(c, done);
              const { pct } = chapterProgress(c, done);
              const isActive = c.id === active.id;
              return (
                <motion.button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  initial={{ opacity: 0, y: 18, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 18 }}
                  whileHover={{ scale: 1.06, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex w-28 flex-col items-center focus:outline-none sm:w-32"
                  aria-label={`Chapter ${c.index}: ${c.name}`}
                >
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 3.4 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative grid h-24 w-24 place-items-center rounded-full sm:h-28 sm:w-28"
                    style={{
                      background: unlocked
                        ? `radial-gradient(circle at 32% 26%, oklch(0.99 0.05 95 / 0.95), ${c.color} 52%, oklch(0.22 0.08 285) 100%)`
                        : "radial-gradient(circle at 32% 26%, oklch(0.55 0.03 275), oklch(0.18 0.04 275))",
                      border: `5px solid ${isActive ? "oklch(0.94 0.16 95)" : "oklch(0.15 0.05 285)"}`,
                      boxShadow: isActive
                        ? `0 0 42px ${c.color}, inset -8px -12px 22px oklch(0.05 0.02 270 / 0.5)`
                        : "inset -8px -12px 22px oklch(0.05 0.02 270 / 0.5)",
                      opacity: unlocked ? 1 : 0.6,
                    }}
                  >
                    {unlocked ? (
                      <CartoonIcon kind={kindFromEmoji(c.emoji)} color={c.color} className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]" />
                    ) : (
                      <Lock className="h-8 w-8 text-gold" />
                    )}
                    {pct === 100 && (
                      <span className="absolute -right-1 -top-1 grid h-8 w-8 place-items-center rounded-full bg-gold text-sm shadow-lg">
                        <Star className="h-4 w-4 fill-current text-[oklch(0.25_0.08_285)]" />
                      </span>
                    )}
                  </motion.div>
                  <div
                    className={`mt-2 rounded-full px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wide sm:text-xs ${
                      isActive ? "bg-gold text-[oklch(0.22_0.08_285)]" : "bg-white/10 text-white/80"
                    }`}
                  >
                    Ch {c.index}
                  </div>
                  <div className="mt-1 text-center font-display text-xs font-bold leading-tight text-white/90 sm:text-sm">
                    {c.name}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected chapter panel */}
        <AnimatePresence mode="wait">
          <motion.section
            key={active.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="mt-8 rounded-[2rem] bg-white/8 p-5 ring-2 ring-white/15 backdrop-blur-sm sm:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-display text-2xl font-bold text-white">
                  <span className="inline-flex items-center gap-2">
                    <CartoonIcon kind={kindFromEmoji(active.emoji)} color={active.color} className="h-9 w-9" />
                    {active.name}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white/70">{active.tagline}</div>
              </div>
              <div className="min-w-[160px] flex-1 sm:max-w-xs">
                {(() => {
                  const p = chapterProgress(active, done);
                  return (
                    <>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-black/40 ring-1 ring-white/15">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.pct}%` }}
                          transition={{ duration: 0.7 }}
                          className="h-full rounded-full bg-gold"
                        />
                      </div>
                      <div className="mt-1 text-right text-xs font-bold text-white/70">
                        {p.done}/{p.total} levels
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {!activeOpen ? (
              <div className="py-12 text-center text-white/75">
                <Lock className="mx-auto h-9 w-9 text-gold" />
                <p className="mt-3 text-sm font-semibold">
                  Finish the previous chapter to open {active.name}!
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {missions.map((m, i) => {
                  const unlocked = isMissionUnlocked(m, done);
                  const completed = done.filter((k) => k.startsWith(m.id + ":")).length;
                  const total = m.levels.length;
                  const isDone = completed === total;

                  const card = (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 18 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 240, damping: 20 }}
                      whileHover={unlocked ? { y: -6, scale: 1.03 } : undefined}
                      className={`relative overflow-hidden rounded-[1.75rem] p-4 ring-2 transition ${
                        unlocked
                          ? isDone
                            ? "bg-gold/15 ring-gold/60"
                            : "bg-black/35 ring-white/25"
                          : "bg-black/40 ring-white/10 saturate-50"
                      }`}
                    >
                      {!unlocked && (
                        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-black/55 backdrop-blur-[2px]">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            className="grid h-16 w-16 place-items-center rounded-full bg-white/10 ring-2 ring-gold/50"
                          >
                            <Lock className="h-7 w-7 text-gold" />
                          </motion.div>
                        </div>
                      )}

                      <div className="absolute left-4 top-4 rounded-full bg-gold px-2.5 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-wide text-[oklch(0.22_0.08_285)]">
                        Mission {i + 1}
                      </div>

                      <div className="relative mx-auto mt-6 flex h-28 items-center justify-center">
                        <motion.div
                          animate={unlocked ? { y: [0, -6, 0] } : undefined}
                          transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                          className="grid h-24 w-24 place-items-center rounded-full"
                          style={{
                            background: `radial-gradient(circle at 32% 26%, oklch(0.99 0.05 95 / 0.9), ${m.color} 52%, oklch(0.20 0.06 270) 100%)`,
                            border: "5px solid oklch(0.15 0.05 285)",
                            boxShadow: `0 0 30px ${m.color}`,
                          }}
                        >
                          <CartoonIcon kind={kindFromEmoji(m.emoji)} color={m.color} className="h-[4.5rem] w-[4.5rem]" />
                        </motion.div>
                      </div>

                      <div className="mt-3 text-center">
                        <div className="font-display text-lg font-bold text-white">{m.name}</div>
                        <div className="text-xs font-semibold text-white/60">{m.tagline}</div>
                      </div>

                      <div className="mt-3 flex items-center justify-center gap-1.5">
                        {m.levels.map((l) => (
                          <span
                            key={l.id}
                            className={`h-2.5 w-2.5 rounded-full ${
                              done.includes(`${m.id}:${l.id}`) ? "bg-gold" : "bg-white/25"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs font-bold">
                        <span className="text-white/60">
                          {completed}/{total} levels
                        </span>
                        <span className="text-gold">{isDone ? "★ Complete" : "Play →"}</span>
                      </div>
                    </motion.div>
                  );

                  return unlocked ? (
                    <Link key={m.id} to="/missions/$missionId" params={{ missionId: m.id }}>
                      {card}
                    </Link>
                  ) : (
                    <div key={m.id} title="Complete the previous mission to unlock.">
                      {card}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </main>
    </SceneTransition>
  );
}
