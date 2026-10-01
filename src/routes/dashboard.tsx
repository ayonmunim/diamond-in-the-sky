import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SpaceScene } from "@/components/SpaceScene";
import { Nova } from "@/components/Nova";
import { Hud } from "@/components/HudBubble";
import { SceneTransition } from "@/components/SceneTransition";
import { useGame } from "@/lib/game-store";
import { allBadges as badges } from "@/data/badges";
import { celestialObjects, findObject, scaleLevels } from "@/data/celestialObjects";
import { Flame, Sparkles, Coins, Gem, Star } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Explorer Logbook — Diamond In The Sky" },
      { name: "description", content: "Your personal record of discoveries, achievements, missions, lessons and how far across the universe you have travelled." },
      { property: "og:title", content: "Explorer Logbook — Diamond In The Sky" },
      { property: "og:description", content: "Discoveries, achievements, missions and universe progress, all in one logbook." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Collection,
});

function Collection() {
  const { state, level, xpIntoLevel } = useGame();
  const xpPct = Math.min(100, (xpIntoLevel / 100) * 100);
  const discoveredIds = state.discoveredObjects ?? [];
  const scalesExplored = (state.maxScaleReached ?? 0) + 1;
  const furthest = scaleLevels[Math.min(state.maxScaleReached ?? 0, scaleLevels.length - 1)];

  return (
    <SceneTransition>
      <SpaceScene density={150} variant="deep" />
      <Hud />

      <main className="relative mx-auto max-w-5xl px-4 pb-12 pt-24 sm:pt-28">
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            <span className="text-gradient-gold">Explorer's Logbook</span>
          </h1>
          <p className="mt-2 text-sm text-white/75">Everything you've discovered with Nova.</p>
        </motion.header>

        {/* Avatar + level */}
        <section className="mt-8 flex flex-col items-center gap-4">
          <Nova size="lg" mood="happy" showBubble line={`Level ${level} Explorer!`} />
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-white/70">
              <span>Level {level}</span>
              <span>{xpIntoLevel} / 100 XP</span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPct}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-accent via-pink to-gold"
              />
            </div>
          </div>
        </section>

        {/* Counter bubbles */}
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={<Sparkles className="h-5 w-5 text-gold" />} label="Stars" value={state.stars} />
          <Stat icon={<Coins className="h-5 w-5 text-amber-300" />} label="Coins" value={state.coins} />
          <Stat icon={<Gem className="h-5 w-5 text-cyan-300" />} label="Diamonds" value={state.diamonds} />
          <Stat icon={<Flame className="h-5 w-5 text-orange-400" />} label="Streak" value={state.dailyStreak} suffix=" days" />
        </section>

        {/* Universe progress + discoveries + missions + knowledge */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="glass rounded-3xl p-5">
            <h2 className="font-display text-lg font-bold text-white">🌌 Universe Progress</h2>
            <p className="mt-1 text-xs text-white/60">
              Scales explored: {scalesExplored} of {scaleLevels.length} — furthest reach{" "}
              <span className="font-semibold text-white/85">{furthest.name}</span>
            </p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-gold"
                style={{ width: `${(scalesExplored / scaleLevels.length) * 100}%` }}
              />
            </div>
            <Link to="/explore" className="mt-3 inline-block text-xs font-bold text-gold underline">
              Continue exploring →
            </Link>
          </div>

          <div className="glass rounded-3xl p-5">
            <h2 className="font-display text-lg font-bold text-white">🔭 Discoveries</h2>
            <p className="mt-1 text-xs text-white/60">
              {discoveredIds.length} of {celestialObjects.length} celestial objects found
            </p>
            {discoveredIds.length === 0 ? (
              <p className="mt-3 text-sm text-white/60">
                Nothing logged yet. <Link to="/explore" className="text-gold underline">Open the Universe Explorer</Link> and tap an object.
              </p>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {discoveredIds.map((id) => {
                  const o = findObject(id);
                  if (!o) return null;
                  return (
                    <li key={id} className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-semibold text-white/85 ring-1 ring-white/12">
                      {o.emoji} {o.name}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="glass rounded-3xl p-5">
            <h2 className="font-display text-lg font-bold text-white">🚀 Missions</h2>
            <p className="mt-1 text-xs text-white/60">
              {state.completedMissionLevels.length} levels completed · {state.completedChapters.length} story chapters
            </p>
            <Link to="/missions" className="mt-3 inline-block text-xs font-bold text-gold underline">
              Back to the mission hub →
            </Link>
          </div>

          <div className="glass rounded-3xl p-5">
            <h2 className="font-display text-lg font-bold text-white">📚 Knowledge</h2>
            <p className="mt-1 text-xs text-white/60">
              {state.completedLessons.length} lessons finished
            </p>
            <Link to="/learn" className="mt-3 inline-block text-xs font-bold text-gold underline">
              Watch another lesson →
            </Link>
          </div>
        </section>

        {/* Badges */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-white">🏅 Achievements</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
            {badges.map((b, i) => {
              const earned = state.earnedBadges.includes(b.id);
              return (
                <motion.div
                  key={b.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.04 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="grid h-20 w-20 place-items-center rounded-full text-3xl transition"
                    style={{
                      background: earned
                        ? "radial-gradient(circle at 32% 28%, oklch(0.99 0.04 95 / 0.95), oklch(0.85 0.18 80), oklch(0.50 0.20 50))"
                        : "radial-gradient(circle at 30% 30%, oklch(0.35 0.04 270), oklch(0.15 0.04 270))",
                      boxShadow: earned
                        ? "0 0 30px oklch(0.85 0.18 80 / 0.6), inset -6px -8px 14px oklch(0.05 0.02 270 / 0.5)"
                        : "inset -4px -6px 12px oklch(0.05 0.02 270 / 0.6)",
                      border: "2px solid oklch(1 0 0 / 0.15)",
                      opacity: earned ? 1 : 0.5,
                      filter: earned ? "none" : "grayscale(1)",
                    }}
                  >
                    {b.emoji}
                  </div>
                  <div className="mt-2 line-clamp-2 text-center text-[11px] font-semibold text-white/85">{b.name}</div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Pet stars nursery */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-white">🌟 My Pet Stars</h2>
          {state.createdStars.length === 0 ? (
            <p className="mt-3 text-sm text-white/60">No pet stars yet. <Link to="/play" className="text-gold underline">Create one in Mission 3!</Link></p>
          ) : (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {state.createdStars.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, y: [0, -6, 0] }}
                  transition={{
                    scale: { type: "spring", stiffness: 260, damping: 16, delay: i * 0.05 },
                    y: { repeat: Infinity, duration: 2.6 + (i % 3) * 0.3, ease: "easeInOut", delay: 0.5 },
                  }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="h-16 w-16 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 32% 28%, white, ${s.color})`,
                      boxShadow: `0 0 26px ${s.color}, inset -4px -6px 12px oklch(0.05 0.02 270 / 0.45)`,
                    }}
                  />
                  <div className="mt-2 truncate text-center text-xs font-semibold text-white">{s.name}</div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Custom constellations */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-white">✨ My Constellations</h2>
          {state.customConstellations.length === 0 ? (
            <p className="mt-3 text-sm text-white/60">No constellations yet. <Link to="/play" className="text-gold underline">Try Mission 5!</Link></p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {state.customConstellations.map((c, i) => (
                <div key={i} className="glass relative aspect-video overflow-hidden rounded-3xl p-3">
                  <svg viewBox="0 0 100 56" className="absolute inset-0 h-full w-full">
                    {c.points.slice(1).map((p, k) => (
                      <line key={k} x1={c.points[k].x} y1={c.points[k].y * 0.56} x2={p.x} y2={p.y * 0.56} stroke="oklch(0.88 0.16 88 / 0.7)" strokeWidth="0.3" />
                    ))}
                    {c.points.map((p, k) => (
                      <circle key={k} cx={p.x} cy={p.y * 0.56} r="1.4" fill="white" />
                    ))}
                  </svg>
                  <div className="absolute bottom-2 left-3 right-3 text-xs font-bold text-white drop-shadow"><Star className="mr-1 inline h-3 w-3 text-gold" />{c.name}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </SceneTransition>
  );
}

function Stat({ icon, label, value, suffix = "" }: { icon: React.ReactNode; label: string; value: number; suffix?: string }) {
  return (
    <div className="bubble flex items-center gap-3 px-4 py-3">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">{icon}</div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/65">{label}</div>
        <div className="font-display text-xl font-bold text-white">{value}{suffix}</div>
      </div>
    </div>
  );
}
