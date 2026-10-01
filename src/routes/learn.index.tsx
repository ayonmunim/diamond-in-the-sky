import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SpaceScene } from "@/components/SpaceScene";
import { Nova } from "@/components/Nova";
import { Hud } from "@/components/HudBubble";
import { SceneTransition } from "@/components/SceneTransition";
import { lessons } from "@/lib/game-data";
import { spectralClasses } from "@/data/starColors";
import { useGame } from "@/lib/game-store";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/learn/")({
  head: () => ({ meta: [{ title: "Learn — Diamond In The Sky" }] }),
  component: LearnScene,
});

const ORB_TINTS = [
  ["oklch(0.92 0.14 95)", "oklch(0.70 0.22 50)"],   // gold
  ["oklch(0.88 0.16 195)", "oklch(0.50 0.22 235)"], // cyan
  ["oklch(0.85 0.18 350)", "oklch(0.55 0.22 320)"], // pink
  ["oklch(0.78 0.22 305)", "oklch(0.40 0.22 275)"], // violet
  ["oklch(0.78 0.18 130)", "oklch(0.45 0.18 160)"], // green
  ["oklch(0.85 0.18 25)", "oklch(0.50 0.22 35)"],   // red
];

function LearnScene() {
  const { state } = useGame();
  return (
    <SceneTransition>
      <SpaceScene density={160} variant="dawn" />
      <Hud />

      <main className="relative mx-auto max-w-6xl px-4 pb-12 pt-24 sm:pt-28">
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            <span className="text-gradient-candy">Discover the Stars</span>
          </h1>
          <p className="mt-2 text-sm text-white/75">Tap a glowing orb. Nova will tell you all about it.</p>
        </motion.header>

        {/* Topic orbs */}
        <section className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {lessons.map((l, i) => {
            const done = state.completedLessons.includes(l.id);
            const [from, to] = ORB_TINTS[i % ORB_TINTS.length];
            return (
              <motion.div
                key={l.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
                transition={{
                  scale: { type: "spring", stiffness: 300, damping: 18, delay: i * 0.06 },
                  opacity: { duration: 0.4, delay: i * 0.06 },
                  y: { repeat: Infinity, duration: 3 + (i % 3) * 0.4, ease: "easeInOut", delay: 0.6 + i * 0.05 },
                }}
                className="flex flex-col items-center"
              >
                <Link to="/learn/$lesson" params={{ lesson: l.id }} className="group relative grid h-36 w-36 place-items-center focus:outline-none">
                  <span
                    className="absolute inset-0 rounded-full transition group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle at 32% 28%, oklch(0.99 0.04 95 / 0.95), ${from} 35%, ${to} 95%)`,
                      boxShadow: `0 0 50px ${from}88, inset -10px -14px 26px oklch(0.05 0.02 270 / 0.5)`,
                      border: "2px solid oklch(1 0 0 / 0.18)",
                    }}
                  />
                  <span className="relative text-5xl drop-shadow-[0_2px_6px_oklch(0.05_0.02_270/0.7)]">{l.emoji}</span>
                  {done && <CheckCircle2 className="absolute right-0 top-0 h-7 w-7 rounded-full bg-background text-gold" />}
                </Link>
                <div className="mt-3 text-center font-display text-sm font-semibold text-white sm:text-base">{l.title}</div>
              </motion.div>
            );
          })}
        </section>

        {/* Spectral classes — cartoon star row */}
        <section className="mt-14">
          <h2 className="text-center font-display text-2xl font-bold text-white">🌈 Star Colors</h2>
          <p className="mx-auto mt-1 max-w-xl text-center text-xs text-white/65">From hot blue O-stars to cool red M dwarfs.</p>
          <div className="mt-6 flex flex-wrap items-end justify-center gap-4">
            {spectralClasses.map((c, i) => (
              <motion.div
                key={c.klass}
                initial={{ scale: 0 }}
                animate={{ scale: 1, y: [0, -6, 0] }}
                transition={{
                  scale: { type: "spring", stiffness: 260, damping: 16, delay: i * 0.06 },
                  y: { repeat: Infinity, duration: 2.4 + i * 0.2, ease: "easeInOut", delay: 0.6 },
                }}
                className="flex flex-col items-center"
              >
                <div
                  className="rounded-full"
                  style={{
                    width: 56 + i * 4,
                    height: 56 + i * 4,
                    background: `radial-gradient(circle at 32% 28%, white, ${c.cssColor})`,
                    boxShadow: `0 0 28px ${c.cssColor}, inset -4px -6px 12px oklch(0.05 0.02 270 / 0.5)`,
                  }}
                />
                <div className="mt-2 font-display text-lg font-bold text-white">{c.klass}</div>
                <div className="text-[10px] text-white/65">{c.color}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Nova companion */}
        <div className="mt-12 flex justify-center">
          <Nova size="lg" mood="happy" showBubble line="What do you want to learn first?" />
        </div>
      </main>
    </SceneTransition>
  );
}
