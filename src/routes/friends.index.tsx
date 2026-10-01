import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SpaceScene } from "@/components/SpaceScene";
import { SceneTransition } from "@/components/SceneTransition";
import { Hud } from "@/components/HudBubble";
import { friends } from "@/data/friends";

export const Route = createFileRoute("/friends/")({
  head: () => ({
    meta: [
      { title: "Friends — Diamond In The Sky" },
      { name: "description", content: "Visit your friends' galaxies and celebrate their stars." },
    ],
  }),
  component: FriendsScene,
});

function FriendsScene() {
  return (
    <SceneTransition>
      <SpaceScene density={120} variant="dawn" />
      <Hud />

      <main className="relative mx-auto max-w-5xl px-4 pb-16 pt-24 sm:pt-28">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">Friends</h1>
          <p className="mt-2 text-sm text-white/70">Visit a friend's galaxy and pair stars together.</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((f, i) => (
            <Link key={f.id} to="/friends/$friendId" params={{ friendId: f.id }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="flex items-center gap-3 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 hover:bg-white/8"
              >
                <div
                  className="grid h-16 w-16 place-items-center rounded-full text-2xl"
                  style={{ background: `radial-gradient(circle at 32% 28%, oklch(0.99 0.04 95 / 0.9), ${f.galaxyTint} 55%, oklch(0.20 0.06 270))`, boxShadow: `0 0 24px ${f.galaxyTint.replace(")", " / 0.5)")}` }}
                >
                  {f.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-display text-lg font-bold text-white">{f.name}</div>
                  <div className="text-xs text-white/55">{f.rank} · {f.stars.length} stars</div>
                </div>
                <span className={`h-2.5 w-2.5 rounded-full ${f.online ? "bg-green-400" : "bg-white/20"}`} />
              </motion.div>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-white/45">Demo friends — backend coming soon.</p>
      </main>
    </SceneTransition>
  );
}
