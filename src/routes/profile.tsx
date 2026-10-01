import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SpaceScene } from "@/components/SpaceScene";
import { SceneTransition } from "@/components/SceneTransition";
import { Hud } from "@/components/HudBubble";
import { AvatarPreview } from "@/components/AvatarPreview";
import { itemsBySlot, type AvatarSlot } from "@/data/avatarItems";
import { useGame } from "@/lib/game-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Explorer Profile — Diamond In The Sky" },
      { name: "description", content: "Customize your sky-explorer avatar, view your stars, and see your rank." },
    ],
  }),
  component: ProfileScene,
});

const SLOTS: { slot: AvatarSlot; label: string }[] = [
  { slot: "hair", label: "Hair" },
  { slot: "eyes", label: "Eyes" },
  { slot: "helmet", label: "Helmet" },
  { slot: "suit", label: "Suit" },
  { slot: "backpack", label: "Backpack" },
  { slot: "pet", label: "Pet" },
];

function ProfileScene() {
  const { state, equipAvatar, rank, setExplorerName } = useGame();

  return (
    <SceneTransition>
      <SpaceScene density={120} variant="nebula" />
      <Hud />

      <main className="relative mx-auto grid max-w-6xl gap-6 px-4 pb-16 pt-24 sm:pt-28 lg:grid-cols-[1fr_1fr]">
        {/* Avatar + identity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 text-center">
          <div className="mx-auto inline-block">
            <AvatarPreview equipped={state.equippedAvatar} size={240} />
          </div>
          <input
            value={state.explorerName}
            onChange={(e) => setExplorerName(e.target.value.slice(0, 18))}
            className="mt-2 w-full rounded-xl bg-white/10 px-3 py-2 text-center font-display text-2xl font-bold text-white outline-none ring-1 ring-white/15 focus:ring-accent"
          />
          <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold ring-1 ring-gold/40">
            {rank.emoji} {rank.name}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat label="Stars" value={state.stars} />
            <Stat label="Gems" value={state.gems} />
            <Stat label="XP" value={state.xp} />
          </div>
        </motion.div>

        {/* Wardrobe */}
        <div className="space-y-4">
          {SLOTS.map(({ slot, label }) => (
            <div key={slot} className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-white/70">{label}</div>
              <div className="flex flex-wrap gap-2">
                {itemsBySlot(slot).map((item) => {
                  const unlocked = state.unlockedAvatarItems.includes(item.id);
                  const equipped = state.equippedAvatar[slot] === item.id;
                  return (
                    <button
                      key={item.id}
                      disabled={!unlocked}
                      onClick={() => equipAvatar(slot, item.id)}
                      className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold ring-1 transition ${
                        equipped
                          ? "bg-gold/20 ring-gold text-white"
                          : unlocked
                          ? "bg-white/10 ring-white/15 text-white hover:bg-white/15"
                          : "bg-white/4 ring-white/8 text-white/40"
                      }`}
                    >
                      <span className="text-base">{unlocked ? item.emoji : "🔒"}</span>
                      <span>{item.name}</span>
                      {!unlocked && <span className="text-[10px] text-white/50">Lv {item.unlockedByLevel}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Star nursery */}
          <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-white/70">Your star nursery</div>
            {state.createdStars.length === 0 ? (
              <p className="text-sm text-white/60">Forge your first star in the Create Star scene.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {state.createdStars.map((s) => (
                  <div key={s.id} className="flex w-28 flex-col items-center rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
                    <div className="grid h-16 w-16 place-items-center rounded-full"
                      style={{ background: `radial-gradient(circle at 35% 30%, white, ${s.color} 60%, oklch(0.45 0.22 35))`, filter: `drop-shadow(0 0 8px ${s.color})` }}>
                      ★
                    </div>
                    <div className="mt-1 text-center text-xs font-bold text-white">{s.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </SceneTransition>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
      <div className="text-xs uppercase text-white/55">{label}</div>
      <div className="font-display text-lg font-bold text-white">{value}</div>
    </div>
  );
}
