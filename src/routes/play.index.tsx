import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SpaceScene } from "@/components/SpaceScene";
import { Nova } from "@/components/Nova";
import { PortalButton } from "@/components/PortalButton";
import { Hud } from "@/components/HudBubble";
import { SceneTransition } from "@/components/SceneTransition";
import { levels } from "@/lib/game-data";
import { useGame } from "@/lib/game-store";
import { Brain } from "lucide-react";

export const Route = createFileRoute("/play/")({
  head: () => ({ meta: [{ title: "Play — Diamond In The Sky" }] }),
  component: PlayScene,
});

const TINTS = ["aurora", "pink", "cyan", "gold", "violet"] as const;

function PlayScene() {
  const { state } = useGame();
  const navigate = useNavigate();

  return (
    <SceneTransition>
      <SpaceScene density={170} variant="warp" />
      <Hud />

      <main className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pb-12 pt-24 sm:pt-28">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold text-white drop-shadow-[0_3px_18px_oklch(0.05_0.02_270/0.8)] sm:text-5xl">
            <span className="text-gradient-candy">Pick a Mission</span>
          </h1>
          <p className="mt-2 text-sm text-white/75 sm:text-base">Five planet-portals. Each one unlocks the next.</p>
        </motion.header>

        {/* Orbit-style mission portals */}
        <div className="relative mx-auto mt-6 grid w-full max-w-4xl grid-cols-2 place-items-center gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {levels.map((lv, i) => {
            const done = state.completedLevels.includes(lv.id);
            const prevDone = lv.id === 1 || state.completedLevels.includes(lv.id - 1);
            const locked = !prevDone && !done;
            return (
              <PortalButton
                key={lv.id}
                tint={TINTS[i % TINTS.length]}
                size={130}
                delay={i * 0.07}
                icon={<span>{lv.emoji}</span>}
                label={`Mission ${lv.id}`}
                sub={lv.title}
                locked={locked}
                onClick={() => !locked && navigate({ to: "/play/$level", params: { level: lv.slug } })}
              />
            );
          })}
        </div>

        {/* Mini-games */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <PortalButton to="/quiz" tint="cyan" size={108} icon={<Brain />} label="Star Quiz" sub="Quick questions" delay={0.4} />
          <PortalButton to="/story" tint="aurora" size={108} icon={<span>📖</span>} label="Story" sub="6 chapters" delay={0.46} />
        </div>

        {/* Nova companion */}
        <div className="mt-10 flex flex-col items-center">
          <Nova size="lg" mood="excited" showBubble line="Tap a planet to play!" />
        </div>
      </main>
    </SceneTransition>
  );
}
