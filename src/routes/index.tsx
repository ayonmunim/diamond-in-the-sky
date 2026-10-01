import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SpaceScene } from "@/components/SpaceScene";
import { Nova } from "@/components/Nova";
import { SceneTransition } from "@/components/SceneTransition";
import { useSfx } from "@/lib/audio";
import { useGame } from "@/lib/game-store";
import { seededRandom } from "@/lib/rand";
import {
  Home as HomeIcon,
  Award,
  Settings,
  User,
  BookOpen,
  Gamepad2,
  Sparkles,
  Coins,
  Gem,
} from "lucide-react";

const PORTAL_SPECKS = (() => {
  const rnd = seededRandom(20260831);
  return Array.from({ length: 8 }, () => ({
    left: +(20 + rnd() * 60).toFixed(3),
    top: +(20 + rnd() * 60).toFixed(3),
    duration: +(1.6 + rnd() * 2).toFixed(3),
    delay: +(rnd() * 2).toFixed(3),
  }));
})();

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diamond In The Sky — Space Adventure with Nova" },
      {
        name: "description",
        content:
          "Step into a living universe with Nova, your Team Diamonds astronaut guide. Animated stories and interactive space missions for young explorers.",
      },
    ],
  }),
  component: HomeScene,
});

function HomeScene() {
  const sfx = useSfx();
  const { state } = useGame();
  return (
    <SceneTransition>
      <SpaceScene density={220} variant="nebula" />

      {/* Extra living-universe layers */}
      <FloatingUniverse />

      {/* Main sidebar — Home + Settings only */}
      <nav
        aria-label="Primary"
        className="fixed left-2 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3 sm:left-4"
      >
        <EdgeIcon to="/" label="Home" icon={<HomeIcon className="h-5 w-5" />} />
        <EdgeIcon to="/settings" label="Settings" icon={<Settings className="h-5 w-5" />} />
      </nav>

      {/* Player nav — Profile + Explorer Logbook */}
      <nav
        aria-label="Player"
        className="fixed right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3 sm:right-4"
      >
        <EdgeIcon to="/profile" label="Profile" icon={<User className="h-5 w-5" />} />
        <EdgeIcon to="/dashboard" label="Logbook" icon={<Award className="h-5 w-5" />} />
      </nav>

      {/* Tiny resource ticker top-right (unobtrusive) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed right-3 top-3 z-30 flex items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-semibold text-white/85 backdrop-blur-sm ring-1 ring-white/15 sm:right-5 sm:top-5"
      >
        <Sparkles className="h-3 w-3 text-gold" />
        <span className="tabular-nums">{state.stars}</span>
        <span className="mx-1 opacity-30">·</span>
        <Gem className="h-3 w-3 text-cyan-300" />
        <span className="tabular-nums">{state.gems ?? 0}</span>
        <span className="mx-1 opacity-30">·</span>
        <Coins className="h-3 w-3 text-amber-300" />
        <span className="tabular-nums">{state.coins}</span>
      </motion.div>

      <main className="home-viewport relative mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-between px-4 pb-10 pt-16 sm:pt-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold leading-none tracking-tight sm:text-6xl">
            <span className="text-gradient-candy drop-shadow-[0_4px_24px_oklch(0.7_0.22_315/0.5)]">
              Diamond
            </span>
            <br />
            <span className="text-gradient-gold drop-shadow-[0_4px_24px_oklch(0.88_0.16_88/0.5)]">
              In The Sky
            </span>
          </h1>
          <p className="mt-2 text-xs font-medium text-white/75 sm:text-sm">
            A living universe with Nova
          </p>
        </motion.div>

        {/* Nova centerpiece */}
        <div className="relative flex flex-1 items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.3 }}
          >
            <Nova size="xl" mood="happy" showBubble line="Ready to explore the universe?" />
          </motion.div>
        </div>

        {/* Primary CTA */}
        <ExplorePortal onTap={() => sfx("click")} />

        {/* Secondary journeys */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-2 grid w-full max-w-md grid-cols-2 gap-3"
        >
          <JourneyButton
            to="/learn"
            label="Learn"
            desc="Animated lessons"
            icon={<BookOpen className="h-5 w-5" />}
            tint="oklch(0.72 0.18 265)"
            onTap={() => sfx("click")}
          />
          <JourneyButton
            to="/missions"
            label="Play"
            desc="Missions & games"
            icon={<Gamepad2 className="h-5 w-5" />}
            tint="oklch(0.80 0.18 88)"
            onTap={() => sfx("click")}
          />
        </motion.div>

        {/* Tiny footnote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[10px] text-white/45"
        >
          <Link to="/educators" className="rounded-full px-2 py-1 hover:text-white/80">
            For teachers
          </Link>
          <span className="opacity-40">•</span>
          <span>Built with NASA open educational resources</span>
        </motion.div>
      </main>
    </SceneTransition>
  );
}

/* -------------------------------- pieces -------------------------------- */

function JourneyButton({
  to,
  label,
  desc,
  icon,
  tint,
  onTap,
}: {
  to: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  tint: string;
  onTap: () => void;
}) {
  return (
    <Link
      to={to as "/"}
      onClick={onTap}
      className="group relative flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-left ring-1 ring-white/15 backdrop-blur-sm transition hover:scale-[1.03] hover:bg-white/14 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
    >
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
        style={{
          background: `radial-gradient(circle at 32% 28%, oklch(1 0 0 / 0.4), ${tint})`,
          boxShadow: `0 0 20px ${tint}`,
        }}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-base font-bold text-white">{label}</span>
        <span className="block truncate text-[11px] text-white/60">{desc}</span>
      </span>
    </Link>
  );
}

function EdgeIcon({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      to={to as "/"}
      aria-label={label}
      title={label}
      className="planet-nav group grid h-10 w-10 place-items-center rounded-full bg-white/8 text-white/80 ring-1 ring-white/15 backdrop-blur-sm transition hover:scale-110 hover:bg-white/15 hover:text-white active:scale-95 sm:h-11 sm:w-11"
    >
      {icon}
      <span className="planet-nav-label">{label}</span>
    </Link>
  );
}

function ExplorePortal({ onTap }: { onTap: () => void }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.5 }}
      className="relative mb-4"
    >
      <Link
        to="/explore"
        onClick={onTap}
        aria-label="Explore the Universe"
        className="group relative block focus:outline-none"
      >
        {/* outer aurora glow */}
        <motion.span
          className="pointer-events-none absolute -inset-10 rounded-full blur-3xl"
          animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.22 305 / 0.7), oklch(0.55 0.22 230 / 0.4) 50%, transparent 75%)",
          }}
          aria-hidden
        />

        {/* spinning sparkle ring */}
        <motion.span
          className="pointer-events-none absolute -inset-4 rounded-full"
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, oklch(0.95 0.16 90 / 0.85) 40deg, transparent 90deg, transparent 220deg, oklch(0.88 0.18 320 / 0.8) 270deg, transparent 320deg)",
            maskImage:
              "radial-gradient(circle, transparent 64%, black 66%, black 72%, transparent 74%)",
            WebkitMaskImage:
              "radial-gradient(circle, transparent 64%, black 66%, black 72%, transparent 74%)",
          }}
        />

        {/* planet/portal body */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" } }}
          className="relative grid h-44 w-44 place-items-center rounded-full sm:h-56 sm:w-56"
          style={{
            background:
              "radial-gradient(circle at 30% 26%, oklch(0.99 0.04 95 / 0.95), oklch(0.82 0.18 60) 28%, oklch(0.62 0.22 320) 65%, oklch(0.30 0.20 270) 100%)",
            boxShadow:
              "0 0 80px oklch(0.75 0.22 305 / 0.65), inset -14px -18px 36px oklch(0.05 0.02 270 / 0.55), inset 8px 10px 22px oklch(1 0 0 / 0.22)",
            border: "2px solid oklch(1 0 0 / 0.22)",
          }}
        >
          {/* inner swirling galaxy disc */}
          <motion.span
            className="absolute inset-6 rounded-full"
            aria-hidden
            animate={{ rotate: -360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "conic-gradient(from 0deg, oklch(0.95 0.16 90 / 0.25), transparent 35%, oklch(0.78 0.22 305 / 0.35) 55%, transparent 80%, oklch(0.95 0.16 90 / 0.25))",
              filter: "blur(2px)",
            }}
          />
          {/* twinkling specks inside the portal */}
          {PORTAL_SPECKS.map((s, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white"
              style={{ left: `${s.left}%`, top: `${s.top}%`, boxShadow: "0 0 6px white" }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1.2, 0.6] }}
              transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
            />
          ))}

          {/* label */}
          <div className="relative z-10 text-center">
            <div className="text-4xl drop-shadow-[0_2px_8px_oklch(0.05_0.02_270/0.8)] sm:text-5xl">
              🚀
            </div>
            <div className="mt-1 font-display text-lg font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_6px_oklch(0.05_0.02_270/0.9)] sm:text-xl">
              Explore
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-xs">
              the Universe
            </div>
          </div>
        </motion.div>

        {/* hint pulse below */}
        <motion.div
          aria-hidden
          animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70"
        >
          Tap to begin
        </motion.div>
      </Link>
    </motion.div>
  );
}

/** Slow drifting planets, satellite, asteroids — adds the "living universe" feel. */
function FloatingUniverse() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden" aria-hidden>
      {/* drifting ringed planet */}
      <motion.div
        className="absolute"
        style={{ top: "14%", left: "8%" }}
        animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="86" height="86" viewBox="0 0 100 100">
          <defs>
            <radialGradient id="p-ring" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="oklch(0.95 0.12 80)" />
              <stop offset="60%" stopColor="oklch(0.70 0.20 45)" />
              <stop offset="100%" stopColor="oklch(0.40 0.18 30)" />
            </radialGradient>
          </defs>
          <ellipse
            cx="50"
            cy="55"
            rx="46"
            ry="10"
            fill="none"
            stroke="oklch(0.85 0.14 80 / 0.55)"
            strokeWidth="3"
          />
          <circle cx="50" cy="50" r="26" fill="url(#p-ring)" />
          <ellipse
            cx="50"
            cy="55"
            rx="46"
            ry="10"
            fill="none"
            stroke="oklch(0.95 0.16 90 / 0.7)"
            strokeWidth="1.2"
            strokeDasharray="2 6"
          />
        </svg>
      </motion.div>

      {/* small cyan planet */}
      <motion.div
        className="absolute h-12 w-12 rounded-full"
        style={{
          right: "10%",
          top: "20%",
          background:
            "radial-gradient(circle at 30% 30%, oklch(0.92 0.12 195), oklch(0.35 0.18 230))",
          boxShadow:
            "0 0 30px oklch(0.65 0.20 220 / 0.6), inset -5px -6px 14px oklch(0.10 0.06 260 / 0.7)",
        }}
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* tiny moon bottom-left */}
      <motion.div
        className="absolute h-8 w-8 rounded-full"
        style={{
          left: "12%",
          bottom: "18%",
          background:
            "radial-gradient(circle at 30% 30%, oklch(0.95 0.02 90), oklch(0.55 0.04 80))",
          boxShadow: "0 0 20px oklch(0.85 0.05 90 / 0.5)",
        }}
        animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* satellite */}
      <motion.div
        className="absolute"
        style={{ right: "14%", bottom: "22%" }}
        animate={{ x: [0, -30, 0], y: [0, 8, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="58" height="36" viewBox="0 0 80 50">
          <rect x="32" y="18" width="16" height="14" rx="2" fill="oklch(0.85 0.04 240)" />
          <rect
            x="2"
            y="20"
            width="28"
            height="10"
            fill="oklch(0.55 0.18 240)"
            stroke="oklch(0.85 0.10 230)"
          />
          <rect
            x="50"
            y="20"
            width="28"
            height="10"
            fill="oklch(0.55 0.18 240)"
            stroke="oklch(0.85 0.10 230)"
          />
          <circle cx="40" cy="14" r="3" fill="oklch(0.95 0.16 90)" />
          <line x1="40" y1="14" x2="40" y2="18" stroke="oklch(0.85 0.04 240)" strokeWidth="1.5" />
        </svg>
      </motion.div>

      {/* asteroids */}
      {[
        { left: "70%", top: "70%", size: 14, dur: 9 },
        { left: "30%", top: "12%", size: 10, dur: 7 },
        { left: "82%", top: "44%", size: 8, dur: 11 },
      ].map((a, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: a.left,
            top: a.top,
            width: a.size,
            height: a.size,
            background:
              "radial-gradient(circle at 30% 30%, oklch(0.75 0.04 60), oklch(0.32 0.04 50))",
            boxShadow: "inset -2px -2px 4px oklch(0.10 0 0 / 0.7)",
          }}
          animate={{ y: [0, -12, 0], rotate: [0, 360] }}
          transition={{
            y: { duration: a.dur, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: a.dur * 3, repeat: Infinity, ease: "linear" },
          }}
        />
      ))}

      {/* shooting stars */}
      {[0, 4, 8].map((delay, i) => (
        <span
          key={i}
          className="absolute h-[2px] w-40 rounded-full"
          style={{
            top: `${10 + i * 22}%`,
            left: "-20%",
            background: "linear-gradient(90deg, transparent, white, transparent)",
            filter: "drop-shadow(0 0 6px white)",
            animation: `shoot 7s linear ${delay}s infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes shoot {
          0% { transform: translate(0,0) rotate(15deg); opacity: 0; }
          10% { opacity: 1; }
          60% { opacity: 1; }
          100% { transform: translate(140vw, 40vh) rotate(15deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
