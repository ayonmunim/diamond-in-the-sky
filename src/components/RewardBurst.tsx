import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { playSfx } from "@/lib/audio";
import { useGame } from "@/lib/game-store";

export function RewardBurst({
  title = "Mission Complete!",
  stars = 0,
  coins = 0,
  xp = 0,
  diamonds = 0,
  emoji = "🌟",
}: {
  title?: string;
  stars?: number;
  coins?: number;
  xp?: number;
  diamonds?: number;
  emoji?: string;
}) {
  const { state } = useGame();
  useEffect(() => {
    if (state.settings.sfxOn) {
      playSfx("win", state.settings.sfxVolume);
      setTimeout(() => playSfx("sparkle", state.settings.sfxVolume), 250);
    }
  }, [state.settings.sfxOn, state.settings.sfxVolume]);

  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      dx: (Math.random() - 0.5) * 360,
      dy: -120 - Math.random() * 220,
      rot: Math.random() * 360,
      delay: Math.random() * 0.25,
      hue: Math.floor(Math.random() * 360),
    })), []);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-1/2 top-10 -z-0">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: p.dx, y: p.dy, opacity: 0, rotate: p.rot }}
            transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
            className="absolute h-2 w-2 rounded-sm"
            style={{ background: `hsl(${p.hue} 85% 65%)` }}
          />
        ))}
      </div>
      <div className="relative text-center">
        <motion.div
          initial={{ scale: 0.5, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="text-7xl"
        >
          {emoji}
        </motion.div>
        <h2 className="mt-3 font-display text-3xl font-bold">{title}</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {stars > 0 && <Chip color="gold">+{stars} ✨ stars</Chip>}
          {coins > 0 && <Chip color="amber">+{coins} 🪙 coins</Chip>}
          {xp > 0 && <Chip color="purple">+{xp} XP</Chip>}
          {diamonds > 0 && <Chip color="cyan">+{diamonds} 💎</Chip>}
        </div>
      </div>
    </div>
  );
}

function Chip({ color, children }: { color: "gold" | "amber" | "purple" | "cyan"; children: React.ReactNode }) {
  const map = {
    gold: "bg-gold/15 text-gold ring-gold/40",
    amber: "bg-amber-400/15 text-amber-300 ring-amber-400/40",
    purple: "bg-primary/20 text-primary-foreground ring-primary/40",
    cyan: "bg-cyan-400/15 text-cyan-300 ring-cyan-400/40",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold ring-1 ${map[color]}`}>
      {children}
    </span>
  );
}
