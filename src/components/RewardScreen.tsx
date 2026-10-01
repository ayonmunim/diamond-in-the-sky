import { useEffect } from "react";
import { motion } from "framer-motion";
import { RewardBurst } from "./RewardBurst";
import { useGame } from "@/lib/game-store";
import { rankFor, nextRank } from "@/data/ranks";

export function RewardScreen({
  title,
  emoji,
  stars,
  gems,
  xp,
  badgeId,
  badgeName,
  badgeEmoji,
  unlockedItemName,
  onContinue,
  continueLabel = "Next Level",
  secondaryLabel,
  onSecondary,
}: {
  title: string;
  emoji: string;
  stars: number;
  gems: number;
  xp: number;
  badgeId?: string;
  badgeName?: string;
  badgeEmoji?: string;
  unlockedItemName?: string;
  onContinue: () => void;
  continueLabel?: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  const { state } = useGame();
  const rank = rankFor(state.xp);
  const next = nextRank(state.xp);
  const xpToNext = next ? Math.max(0, next.minXp - state.xp) : 0;

  useEffect(() => {
    // pre-cache by simply mounting — RewardBurst handles win sound.
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center"
    >
      <RewardBurst title={title} stars={stars} xp={xp} emoji={emoji} />

      {gems > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-cyan-400/15 px-4 py-1.5 text-sm font-bold text-cyan-200 ring-1 ring-cyan-300/40"
        >
          +{gems} 💎 gems
        </motion.div>
      )}

      {badgeName && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" }}
          className="mt-5 flex items-center gap-3 rounded-full bg-gold/15 px-4 py-2 ring-1 ring-gold/50"
        >
          <span className="text-2xl">{badgeEmoji ?? "🏅"}</span>
          <div className="text-left">
            <div className="text-xs uppercase tracking-wider text-gold">Badge earned</div>
            <div className="text-sm font-bold text-white">{badgeName}</div>
          </div>
        </motion.div>
      )}

      {unlockedItemName && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="mt-3 rounded-full bg-accent/20 px-4 py-2 text-sm font-bold text-white ring-1 ring-accent/40"
        >
          🎁 New unlock: {unlockedItemName}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
        className="mt-5 w-full max-w-xs rounded-2xl bg-white/5 p-3 ring-1 ring-white/10"
      >
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>{rank.emoji} {rank.name}</span>
          {next ? <span>{xpToNext} XP to {next.name}</span> : <span>Max rank!</span>}
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: next ? `${Math.min(100, ((state.xp - rank.minXp) / (next.minXp - rank.minXp)) * 100)}%` : "100%" }}
            transition={{ duration: 0.9, delay: 1 }}
            className="h-full bg-gradient-to-r from-gold via-accent to-primary"
          />
        </div>
      </motion.div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {secondaryLabel && onSecondary && (
          <button
            onClick={onSecondary}
            className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
          >
            {secondaryLabel}
          </button>
        )}
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground glow-pink"
        >
          {continueLabel} →
        </button>
      </div>
    </motion.div>
  );
}
