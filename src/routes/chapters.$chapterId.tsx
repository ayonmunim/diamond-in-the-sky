import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { SpaceScene } from "@/components/SpaceScene";
import { SceneTransition } from "@/components/SceneTransition";
import { Hud } from "@/components/HudBubble";
import {
  chapterById,
  missionsOfChapter,
  isChapterUnlocked,
  isMissionUnlocked,
  type Chapter,
  type Mission,
} from "@/data/universe";
import { useGame } from "@/lib/game-store";

export const Route = createFileRoute("/chapters/$chapterId")({
  loader: ({ params }) => {
    const chapter = chapterById(params.chapterId);
    if (!chapter) throw notFound();
    return { chapter, missions: missionsOfChapter(chapter) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Chapter not found — Diamond In The Sky" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.chapter.name} — Diamond In The Sky`;
    const description = loaderData.chapter.description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center text-white">Chapter not found.</div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-dvh items-center justify-center text-white">{error.message}</div>
  ),
  component: ChapterPage,
});

function ChapterPage() {
  const { chapter, missions } = Route.useLoaderData() as { chapter: Chapter; missions: Mission[] };
  const { state } = useGame();
  const chapterOpen = isChapterUnlocked(chapter, state.completedMissionLevels);

  return (
    <SceneTransition>
      <SpaceScene density={160} variant="nebula" />
      <Hud backTo="/missions" />

      <main className="relative mx-auto max-w-6xl px-4 pb-12 pt-24 sm:pt-28">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Chapter {chapter.index}
          </div>
          <div className="mt-1 text-6xl">{chapter.emoji}</div>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{chapter.name}</h1>
          <p className="mt-2 text-sm text-white/70">{chapter.description}</p>
        </motion.div>

        {!chapterOpen ? (
          <div className="mt-12 text-center text-white/70">
            <Lock className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-3 text-sm">Finish the previous chapter to unlock this one.</p>
            <Link
              to="/missions"
              className="mt-4 inline-block rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/20"
            >
              ← Back to Chapters
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map((m, i) => {
              const unlocked = isMissionUnlocked(m, state.completedMissionLevels);
              const completed = state.completedMissionLevels.filter((k) => k.startsWith(m.id + ":")).length;
              const total = m.levels.length;
              const isDone = completed === total;

              const card = (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 220, damping: 22 }}
                  whileHover={unlocked ? { y: -6, scale: 1.02 } : undefined}
                  className={`group relative overflow-hidden rounded-3xl p-5 ring-1 transition ${
                    unlocked
                      ? isDone
                        ? "bg-gold/10 ring-gold/40"
                        : "bg-white/8 ring-white/20"
                      : "bg-white/4 ring-white/10 saturate-50"
                  }`}
                >
                  {!unlocked && (
                    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/45 backdrop-blur-[2px]">
                      <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        className="grid h-16 w-16 place-items-center rounded-full bg-white/10 ring-1 ring-gold/40"
                      >
                        <Lock className="h-7 w-7 text-gold" />
                      </motion.div>
                      <div className="mt-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15">
                        Complete the previous mission to unlock
                      </div>
                    </div>
                  )}

                  <div className="absolute right-4 top-4 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/85 ring-1 ring-white/15">
                    Mission {i + 1}
                  </div>

                  <div className="relative mx-auto flex h-32 items-center justify-center">
                    <motion.div
                      animate={unlocked ? { y: [0, -6, 0] } : undefined}
                      transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                      className="grid h-28 w-28 place-items-center rounded-full text-5xl"
                      style={{
                        background: `radial-gradient(circle at 32% 28%, oklch(0.99 0.04 95 / 0.9), ${m.color} 50%, oklch(0.20 0.06 270) 100%)`,
                      }}
                    >
                      {m.emoji}
                    </motion.div>
                  </div>
                  <div className="mt-4">
                    <div className="font-display text-lg font-bold text-white">{m.name}</div>
                    <div className="text-xs text-white/60">{m.tagline}</div>
                    <p className="mt-2 line-clamp-3 text-sm text-white/75">{m.description}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-white/60">{completed} / {total} levels</span>
                    <span className="font-semibold text-gold">{isDone ? "★ Complete" : "Play →"}</span>
                  </div>
                </motion.div>
              );

              return unlocked ? (
                <Link key={m.id} to="/missions/$missionId" params={{ missionId: m.id }}>
                  {card}
                </Link>
              ) : (
                <div key={m.id} title="Complete the previous mission to unlock.">{card}</div>
              );
            })}
          </div>
        )}
      </main>
    </SceneTransition>
  );
}
