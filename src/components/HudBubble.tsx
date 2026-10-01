import { Link } from "@tanstack/react-router";
import { ChevronLeft, Sparkles, Coins, Gem } from "lucide-react";
import { motion } from "framer-motion";
import { useGame } from "@/lib/game-store";

/** Floating round HUD bubbles. Replaces the website-style header. */
export function Hud({ backTo = "/", hideBack = false }: { backTo?: string; hideBack?: boolean }) {
  const { state, level } = useGame();
  return (
    <>
      {!hideBack && (
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed left-3 top-3 z-40 sm:left-5 sm:top-5"
        >
          <Link
            to={backTo as "/"}
            aria-label="Back"
            className="bubble flex h-12 w-12 items-center justify-center text-white transition active:scale-90 sm:h-14 sm:w-14"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed right-3 top-3 z-40 flex items-center gap-2 sm:right-5 sm:top-5"
      >
        <Counter icon={<Sparkles className="h-4 w-4 text-gold" />} value={state.stars} tint="gold" />
        <Counter icon={<Coins className="h-4 w-4 text-amber-300" />} value={state.coins} tint="amber" />
        <Counter icon={<Gem className="h-4 w-4 text-cyan-300" />} value={state.diamonds} tint="cyan" />
        <div className="bubble hidden h-12 items-center gap-1.5 px-3 text-xs font-bold uppercase tracking-wider text-white sm:flex">
          <span className="text-[10px] opacity-70">Lvl</span> {level}
        </div>
      </motion.div>
    </>
  );
}

function Counter({ icon, value, tint }: { icon: React.ReactNode; value: number; tint: "gold" | "amber" | "cyan" }) {
  const ring =
    tint === "gold" ? "ring-gold/50" : tint === "amber" ? "ring-amber-400/50" : "ring-cyan-300/50";
  return (
    <div className={`bubble flex h-12 items-center gap-1.5 px-3 ring-1 ${ring} text-sm font-bold text-white sm:h-14`}>
      {icon}
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
