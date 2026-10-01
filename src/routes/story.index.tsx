import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpaceScene } from "@/components/SpaceScene";
import { Nova } from "@/components/Nova";
import { Hud } from "@/components/HudBubble";
import { SceneTransition } from "@/components/SceneTransition";
import { NarrationBar } from "@/components/NarrationBar";
import { introScript, chapters } from "@/data/storyScripts";
import { useGame } from "@/lib/game-store";
import { ChevronRight, SkipForward, Lock, CheckCircle2, Play } from "lucide-react";

export const Route = createFileRoute("/story/")({
  head: () => ({
    meta: [
      { title: "Story Mode — Diamond In The Sky" },
      { name: "description", content: "Six narrated chapters with Nova your baby star companion." },
    ],
  }),
  component: StoryHub,
});

function StoryHub() {
  const [scene, setScene] = useState<"intro" | "hub">("intro");
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const { state } = useGame();

  if (scene === "intro") {
    const line = introScript[i];
    const last = i === introScript.length - 1;
    const next = () => (last ? setScene("hub") : setI(i + 1));
    return (
      <SceneTransition>
        <SpaceScene density={220} variant="nebula" />
        <Hud />
        <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col px-5 pb-6 pt-24">
          <div className="flex justify-end">
            <button
              onClick={() => setScene("hub")}
              className="bubble inline-flex items-center gap-1.5 px-4 py-2 text-xs text-white hover:text-white"
            >
              <SkipForward className="h-3.5 w-3.5" /> Skip intro
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8">
            <Nova size="xl" mood="excited" line={line} speakOnMount />
            <AnimatePresence mode="wait">
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl text-balance text-center font-display text-2xl leading-snug text-white drop-shadow-[0_3px_12px_oklch(0.05_0.02_270/0.7)] sm:text-3xl"
              >
                {line}
              </motion.p>
            </AnimatePresence>

            <div className="flex items-center gap-2">
              {introScript.map((_, idx) => (
                <span key={idx} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-gold" : "w-2 bg-white/25"}`} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <NarrationBar text={line} />
            <button
              onClick={next}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent via-primary to-cosmos px-6 py-4 text-base font-semibold text-white glow-primary transition active:scale-[0.98]"
            >
              {last ? "Open the storybook" : "Continue"} <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </SceneTransition>
    );
  }

  return (
    <SceneTransition>
      <SpaceScene density={150} variant="deep" />
      <Hud />
      <main className="relative mx-auto max-w-5xl px-4 pb-12 pt-24 sm:pt-28">
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            <span className="text-gradient-candy">Nova's Storybook</span>
          </h1>
          <p className="mt-2 text-sm text-white/75">Follow the trail. Each planet hides a chapter.</p>
        </motion.header>

        {/* Chapter trail */}
        <div className="relative mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3">
          {chapters.map((c, idx) => {
            const done = state.completedChapters.includes(c.id);
            const prevDone = idx === 0 || state.completedChapters.includes(chapters[idx - 1].id);
            const locked = !prevDone && !done;
            const offset = idx % 2 === 0 ? "translate-y-0" : "sm:translate-y-8";
            return (
              <motion.button
                key={c.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 18, delay: idx * 0.08 }}
                whileHover={!locked ? { scale: 1.05 } : undefined}
                whileTap={!locked ? { scale: 0.93 } : undefined}
                onClick={() => !locked && navigate({ to: "/story/$chapter", params: { chapter: c.id } })}
                className={`group relative mx-auto flex w-full max-w-[200px] flex-col items-center text-center ${offset}`}
                disabled={locked}
              >
                <div
                  className="grid h-32 w-32 place-items-center rounded-full transition"
                  style={{
                    background: locked
                      ? "radial-gradient(circle at 30% 30%, oklch(0.40 0.04 270), oklch(0.15 0.04 270))"
                      : done
                      ? "radial-gradient(circle at 32% 28%, oklch(0.98 0.16 95 / 0.95), oklch(0.85 0.18 80), oklch(0.55 0.20 50))"
                      : "radial-gradient(circle at 32% 28%, oklch(0.95 0.04 95 / 0.9), oklch(0.74 0.22 305), oklch(0.40 0.22 275))",
                    boxShadow: locked
                      ? "inset -6px -8px 20px oklch(0.05 0.02 270 / 0.6)"
                      : done
                      ? "0 0 50px oklch(0.88 0.16 88 / 0.55), inset -10px -14px 26px oklch(0.05 0.02 270 / 0.5)"
                      : "0 0 50px oklch(0.74 0.22 305 / 0.55), inset -10px -14px 26px oklch(0.05 0.02 270 / 0.5)",
                    border: "2px solid oklch(1 0 0 / 0.18)",
                    opacity: locked ? 0.55 : 1,
                  }}
                >
                  <div className="text-5xl drop-shadow-[0_2px_6px_oklch(0.05_0.02_270/0.7)]">
                    {locked ? <Lock className="h-8 w-8 text-white/70" /> : c.emoji}
                  </div>
                  {done && (
                    <CheckCircle2 className="absolute -right-1 -top-1 h-7 w-7 rounded-full bg-background text-gold" />
                  )}
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-widest text-white/60">Ch. {c.number}</div>
                <div className="mt-0.5 font-display text-base font-semibold text-white">{c.title}</div>
                {!locked && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white/90">
                    <Play className="h-3 w-3" /> {done ? "Replay" : "Begin"}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Nova in corner */}
        <div className="mt-12 flex justify-center">
          <Nova size="lg" mood="happy" showBubble line="Which mystery shall we solve?" />
        </div>

        <div className="mt-8 text-center text-[11px] text-white/45">
          <Link to="/" className="hover:text-white">← Home</Link>
        </div>
      </main>
    </SceneTransition>
  );
}
