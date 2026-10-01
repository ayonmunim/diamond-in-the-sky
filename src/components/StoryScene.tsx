import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";
import { Nova } from "@/components/Nova";
import { useGame } from "@/lib/game-store";

/**
 * Cinematic story scene used at the start of every mission level.
 * Plays a 1-min-style narrated sequence of caption beats with Nova on-screen,
 * a glowing themed backdrop, music-bar visuals, and a Start Mission button.
 */
export function StoryScene({
  title,
  emoji,
  color,
  beats,
  onStart,
}: {
  title: string;
  emoji: string;
  color: string;
  beats: string[];
  onStart: () => void;
}) {
  const { state } = useGame();
  const [i, setI] = useState(0);
  const [readyToStart, setReadyToStart] = useState(false);
  const current = beats[i];
  const isLast = i === beats.length - 1;

  // Narrate each beat
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!state.settings.voiceOn) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(current);
      u.pitch = 1.45;
      u.rate = 1.0;
      u.volume = state.settings.voiceVolume;
      window.speechSynthesis.speak(u);
    } catch { /* */ }
    return () => { try { window.speechSynthesis.cancel(); } catch {} };
  }, [i, current, state.settings.voiceOn, state.settings.voiceVolume]);

  // Auto-advance pacing scaled by text length
  useEffect(() => {
    const ms = Math.max(3500, current.length * 75);
    const t = window.setTimeout(() => {
      if (!isLast) setI(i + 1);
      else setReadyToStart(true);
    }, ms);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative flex flex-1 flex-col items-center justify-center pb-4 pt-2"
    >
      {/* Cinematic backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${color.replace(")", " / 0.45)").replace("oklch(", "oklch(")}, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Title card */}
      <motion.div
        initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="mb-4 text-center"
      >
        <div className="text-5xl">{emoji}</div>
        <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      </motion.div>

      {/* Floating orbiting glyphs around Nova */}
      <div className="relative grid h-44 w-44 place-items-center sm:h-56 sm:w-56">
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {["⭐", "✨", "🪐", "🌙"].map((g, k) => {
            const angle = (k / 4) * Math.PI * 2;
            const r = 90;
            return (
              <span
                key={k}
                className="absolute text-xl"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * r}px)`,
                  top: `calc(50% + ${Math.sin(angle) * r}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {g}
              </span>
            );
          })}
        </motion.div>
        <Nova size="lg" mood="happy" interactive={false} />
      </div>

      {/* Captions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mt-6 max-w-2xl rounded-3xl bg-black/55 px-5 py-3 text-center text-base font-medium text-white ring-1 ring-white/15 sm:text-lg"
        >
          {current}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="mt-4 flex items-center gap-1.5">
        {beats.map((_, k) => (
          <span
            key={k}
            className={`h-1.5 w-6 rounded-full transition-all ${
              k <= i ? "bg-gold" : "bg-white/15"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {!isLast && (
          <button
            onClick={() => setI(i + 1)}
            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
        {(isLast || readyToStart) && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground glow-pink"
          >
            <Play className="h-4 w-4" /> Start Mission
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
