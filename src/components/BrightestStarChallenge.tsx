/**
 * Brightest-star bonus challenge — multiple-choice over the constellation's stars.
 */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSfx } from "@/lib/audio";
import type { ZodiacLevel } from "@/data/zodiac";

export function BrightestStarChallenge({
  level,
  onAnswered,
}: {
  level: ZodiacLevel;
  onAnswered: (correct: boolean) => void;
}) {
  const sfx = useSfx();
  const [picked, setPicked] = useState<string | null>(null);

  // shuffle stars stably per level
  const options = useMemo(() => {
    const arr = [...level.stars];
    // simple deterministic shuffle by id hash
    arr.sort((a, b) => (a.id + level.id).localeCompare(b.id + level.id));
    return arr.slice(0, Math.min(4, arr.length));
  }, [level]);

  // ensure brightest is in options
  const opts = useMemo(() => {
    if (options.find((s) => s.id === level.brightestId)) return options;
    return [level.stars.find((s) => s.id === level.brightestId)!, ...options.slice(0, 3)];
  }, [options, level]);

  const choose = (id: string) => {
    if (picked) return;
    setPicked(id);
    const ok = id === level.brightestId;
    if (ok) sfx("success"); else sfx("wrong");
    window.setTimeout(() => onAnswered(ok), 1100);
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <h3 className="text-center font-display text-2xl font-bold text-white">
        Which star is the brightest in {level.name}?
      </h3>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {opts.map((s) => {
          const isCorrect = picked && s.id === level.brightestId;
          const isWrong = picked === s.id && s.id !== level.brightestId;
          return (
            <motion.button
              key={s.id}
              onClick={() => choose(s.id)}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: picked ? 1 : 1.03 }}
              className={`relative rounded-3xl px-5 py-4 text-left font-semibold text-white ring-2 transition ${
                isCorrect
                  ? "bg-gold/30 ring-gold"
                  : isWrong
                  ? "bg-red-500/20 ring-red-400"
                  : picked
                  ? "bg-white/5 ring-white/10 opacity-50"
                  : "bg-white/10 ring-white/20 hover:bg-white/15"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-xs font-bold text-black">
                  ★
                </span>
                <div>
                  <div className="text-base">{s.name}</div>
                  <div className="text-xs text-white/60">magnitude {s.mag.toFixed(2)}</div>
                </div>
              </div>
              {isCorrect && <span className="absolute right-3 top-3 text-xl">✨</span>}
            </motion.button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-white/55">
        Lower magnitude = brighter star.
      </p>
    </div>
  );
}
