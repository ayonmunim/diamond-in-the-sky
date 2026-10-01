import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SpaceScene } from "@/components/SpaceScene";
import { SceneTransition } from "@/components/SceneTransition";
import { Hud } from "@/components/HudBubble";
import { ShipPreview } from "@/components/ShipPreview";
import { partsBySlot, type ShipSlot } from "@/data/shipParts";
import { useGame } from "@/lib/game-store";

export const Route = createFileRoute("/hangar")({
  head: () => ({
    meta: [
      { title: "Spaceship Hangar — Diamond In The Sky" },
      { name: "description", content: "Customize your spaceship — hull, engine, wings, and warp trail." },
    ],
  }),
  component: HangarScene,
});

const SLOTS: { slot: ShipSlot; label: string }[] = [
  { slot: "hull", label: "Hull" },
  { slot: "engine", label: "Engine" },
  { slot: "wings", label: "Wings" },
  { slot: "trail", label: "Warp Trail" },
];

function HangarScene() {
  const { state, equipShip } = useGame();
  return (
    <SceneTransition>
      <SpaceScene density={120} variant="warp" />
      <Hud />

      <main className="relative mx-auto max-w-5xl px-4 pb-16 pt-24 sm:pt-28">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">Spaceship Hangar</h1>
          <p className="mt-2 text-sm text-white/70">Tune your craft for the next mission.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="mx-auto mt-8 flex justify-center rounded-3xl bg-white/5 p-6 ring-1 ring-white/10"
        >
          <ShipPreview equipped={state.equippedShip} size={320} />
        </motion.div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {SLOTS.map(({ slot, label }) => (
            <div key={slot} className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-white/70">{label}</div>
              <div className="flex flex-wrap gap-2">
                {partsBySlot(slot).map((part) => {
                  const unlocked = state.unlockedShipParts.includes(part.id);
                  const equipped = state.equippedShip[slot] === part.id;
                  return (
                    <button
                      key={part.id}
                      disabled={!unlocked}
                      onClick={() => equipShip(slot, part.id)}
                      className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold ring-1 transition ${
                        equipped ? "bg-gold/20 ring-gold text-white"
                          : unlocked ? "bg-white/10 ring-white/15 text-white hover:bg-white/15"
                          : "bg-white/4 ring-white/8 text-white/40"
                      }`}
                    >
                      <span>{unlocked ? part.emoji : "🔒"}</span>
                      <span>{part.name}</span>
                      {!unlocked && <span className="text-[10px] text-white/50">Lv {part.unlockedByLevel}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </SceneTransition>
  );
}
