import { NovaSprite } from "./NovaSprite";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { NovaMood } from "@/data/novaLines";
import { pickLine } from "@/data/novaLines";
import { useGame } from "@/lib/game-store";
import { useSfx } from "@/lib/audio";

type Size = "sm" | "md" | "lg" | "xl";
const SIZES: Record<Size, number> = { sm: 64, md: 100, lg: 160, xl: 240 };

export interface NovaProps {
  size?: Size;
  mood?: NovaMood;
  line?: string;
  /** Speak the supplied line aloud (and show subtitle). */
  speakOnMount?: boolean;
  className?: string;
  /** Visible speech bubble even when not auto-speaking. */
  showBubble?: boolean;
  interactive?: boolean;
}

/**
 * Nova — a cute glowing baby star companion.
 * Pure SVG + Framer Motion. Always animated.
 */
export function Nova({
  size = "md",
  mood = "happy",
  line,
  speakOnMount = false,
  className = "",
  showBubble = false,
  interactive = true,
}: NovaProps) {
  const px = SIZES[size];
  const { state } = useGame();
  const sfx = useSfx();
  const [activeMood, setActiveMood] = useState<NovaMood>(mood);
  const [bubble, setBubble] = useState<string | null>(showBubble && line ? line : null);
  const tapsRef = useRef<{ count: number; timer: number | null }>({ count: 0, timer: null });
  const holdRef = useRef<number | null>(null);

  useEffect(() => setActiveMood(mood), [mood]);
  useEffect(() => {
    if (showBubble && line) setBubble(line);
  }, [showBubble, line]);

  // Speak helper (Web Speech). Cheerful kid voice preset.
  const speak = (text: string) => {
    if (!state.settings.voiceOn) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.pitch = 1.6;
      u.rate = 1.05;
      u.volume = state.settings.voiceVolume;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  };

  const say = (text: string, nextMood: NovaMood = "excited", ms = 2600) => {
    setBubble(text);
    setActiveMood(nextMood);
    speak(text);
    window.setTimeout(() => {
      setBubble((b) => (b === text ? null : b));
      setActiveMood(mood);
    }, ms);
  };

  useEffect(() => {
    if (speakOnMount && line) say(line, mood, Math.max(2400, line.length * 60));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speakOnMount, line]);

  // --- interactions ---
  const onTap = () => {
    if (!interactive) return;
    sfx("sparkle");
    const t = tapsRef.current;
    t.count += 1;
    if (t.timer) window.clearTimeout(t.timer);
    t.timer = window.setTimeout(() => {
      if (t.count >= 2) say(pickLine("doubleTap"), "dance");
      else say(pickLine("tap"), "excited");
      t.count = 0;
    }, 260);
  };

  const onHoldStart = () => {
    if (!interactive) return;
    holdRef.current = window.setTimeout(() => say(pickLine("hold"), "happy", 4200), 600);
  };
  const onHoldEnd = () => {
    if (holdRef.current) {
      window.clearTimeout(holdRef.current);
      holdRef.current = null;
    }
  };

  // mood-based motion
  const moodAnim =
    activeMood === "dance"
      ? { rotate: [0, 14, -14, 12, -10, 0], scale: [1, 1.12, 0.95, 1.08, 1] }
      : activeMood === "excited"
        ? { y: [0, -10, 0, -8, 0], scale: [1, 1.06, 1, 1.04, 1] }
        : activeMood === "surprised"
          ? { scale: [1, 1.2, 1], rotate: [0, -6, 6, 0] }
          : activeMood === "sad"
            ? { y: [0, 4, 0], rotate: [-3, 3, -3] }
            : activeMood === "sleepy"
              ? { y: [0, -3, 0], rotate: [-2, 2, -2] }
              : activeMood === "wave"
                ? { rotate: [-8, 8, -8] }
                : { y: [0, -6, 0] };
  const moodDur = activeMood === "dance" ? 0.9 : activeMood === "excited" ? 0.7 : 3;

  return (
    <div className={`relative inline-block ${className}`} style={{ width: px, height: px }}>
      {/* Speech bubble */}
      <AnimatePresence>
        {bubble && state.settings.captionsOn && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-[oklch(0.20_0.10_275)] shadow-bubble"
            style={{
              bottom: `calc(100% + 14px)`,
              boxShadow: "0 12px 32px oklch(0.05 0.02 270 / 0.5)",
            }}
          >
            {bubble}
            <span
              className="absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 bg-white"
              aria-hidden
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label="Nova your astronaut helper"
        onPointerDown={onHoldStart}
        onPointerUp={onHoldEnd}
        onPointerLeave={onHoldEnd}
        onClick={onTap}
        className="block h-full w-full focus:outline-none"
        whileTap={interactive ? { scale: 0.92 } : undefined}
        animate={{
          ...moodAnim,
          transition: { duration: moodDur, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <NovaSprite />
      </motion.button>
    </div>
  );
}
