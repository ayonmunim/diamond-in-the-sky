import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpaceScene } from "@/components/SpaceScene";
import { SceneTransition } from "@/components/SceneTransition";
import { Hud } from "@/components/HudBubble";
import { friendById, quickMessages } from "@/data/friends";
import { useGame } from "@/lib/game-store";
import { useSfx } from "@/lib/audio";

export const Route = createFileRoute("/friends/$friendId")({
  loader: ({ params }) => {
    const f = friendById(params.friendId);
    if (!f) throw notFound();
    return { friend: f };
  },
  notFoundComponent: () => <div className="flex min-h-dvh items-center justify-center text-white">Friend not found.</div>,
  errorComponent: ({ error }) => <div className="flex min-h-dvh items-center justify-center text-white">{error instanceof Error ? error.message : "Unable to load this page."}</div>,
  component: FriendGalaxy,
});

function FriendGalaxy() {
  const { friend } = Route.useLoaderData() as { friend: import("@/data/friends").Friend };
  const { state } = useGame();

  const sfx = useSfx();
  const [bubble, setBubble] = useState<string | null>(null);

  const sendMessage = (m: string) => {
    sfx("sparkle");
    setBubble(m);
    window.setTimeout(() => setBubble(null), 2400);
  };

  return (
    <SceneTransition>
      <SpaceScene density={140} variant="nebula" />
      <Hud backTo="/friends" />

      <main className="relative mx-auto max-w-4xl px-4 pb-16 pt-24 sm:pt-28">
        <div className="text-center">
          <div className="text-6xl">{friend.emoji}</div>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{friend.name}'s Galaxy</h1>
          <div className="mt-1 text-xs text-white/65">{friend.rank} · {friend.online ? "Online ✨" : "Sleeping 💤"}</div>
        </div>

        {/* Galaxy view */}
        <div className="relative mx-auto mt-8 aspect-video w-full max-w-2xl overflow-hidden rounded-3xl bg-black/50 ring-1 ring-white/10">
          {/* friend stars orbiting + the player's stars pulled in for "binary system" feel */}
          {friend.stars.map((s, i) => {
            const angle = (i / friend.stars.length) * Math.PI * 2;
            const r = 32 + (i % 2) * 8;
            const x = 50 + r * Math.cos(angle);
            const y = 50 + r * Math.sin(angle);
            return (
              <motion.div
                key={s.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
              >
                <div
                  className="grid place-items-center rounded-full text-xs font-bold text-white"
                  style={{
                    width: 28 + s.size * 18, height: 28 + s.size * 18,
                    background: `radial-gradient(circle at 35% 30%, white, ${s.color} 55%, oklch(0.45 0.22 35))`,
                    filter: `drop-shadow(0 0 10px ${s.color})`,
                  }}>★</div>
                <div className="mt-1 text-center text-[10px] text-white/75">{s.name}</div>
              </motion.div>
            );
          })}

          {/* User's own stars float on the right edge — pair-able UI hint */}
          {state.createdStars.slice(0, 2).map((s, i) => (
            <motion.div
              key={s.id}
              className="absolute"
              style={{ right: `${5 + i * 6}%`, bottom: `${8 + i * 12}%` }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-white"
                style={{ background: `radial-gradient(circle at 35% 30%, white, ${s.color} 60%, oklch(0.45 0.22 35))`, filter: `drop-shadow(0 0 10px ${s.color})` }}>★</div>
              <div className="text-center text-[10px] text-white/75">{s.name}</div>
            </motion.div>
          ))}

          {/* friend avatar + message */}
          <div className="absolute bottom-3 left-3 flex items-end gap-2">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-xl ring-1 ring-white/20">{friend.emoji}</div>
            <AnimatePresence>
              {bubble && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-[oklch(0.20_0.10_275)] shadow-lg"
                >
                  {bubble}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick messages */}
        <div className="mt-5">
          <div className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-white/70">Send a friendly message</div>
          <div className="flex flex-wrap justify-center gap-2">
            {quickMessages.map((m) => (
              <button key={m} onClick={() => sendMessage(m)}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15">
                {m}
              </button>
            ))}
          </div>
        </div>
      </main>
    </SceneTransition>
  );
}
