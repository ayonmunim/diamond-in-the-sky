/**
 * Connect-the-stars constellation puzzle.
 * - Renders the constellation's stars on a 0..100 viewBox.
 * - Player taps a star, then taps another to draw an edge.
 * - Correct edges (from level.edges) light gold; incorrect edges shake red.
 * - When all required edges are placed, fires onSolved().
 */
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSfx } from "@/lib/audio";
import type { ZodiacLevel } from "@/data/zodiac";

type Edge = { a: string; b: string };

function edgeKey(a: string, b: string) {
  return [a, b].sort().join("-");
}

export function ConstellationDraw({
  level,
  onSolved,
}: {
  level: ZodiacLevel;
  onSolved: (mistakes: number) => void;
}) {
  const sfx = useSfx();
  const required = useMemo<Set<string>>(
    () => new Set(level.edges.map(([a, b]) => edgeKey(a, b))),
    [level],
  );
  const [picked, setPicked] = useState<string | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [wrongPulse, setWrongPulse] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState(false);

  const placedKeys = new Set(edges.map((e) => edgeKey(e.a, e.b)));

  const onTapStar = (id: string) => {
    if (solved) return;
    if (!picked) { sfx("click"); setPicked(id); return; }
    if (picked === id) { setPicked(null); return; }
    const key = edgeKey(picked, id);
    if (placedKeys.has(key)) { setPicked(null); return; }
    if (required.has(key)) {
      sfx("sparkle");
      const next = [...edges, { a: picked, b: id }];
      setEdges(next);
      setPicked(null);
      if (next.length === required.size) {
        setSolved(true);
        setTimeout(() => { sfx("win"); onSolved(mistakes); }, 350);
      }
    } else {
      sfx("wrong");
      setMistakes((m) => m + 1);
      setWrongPulse(key);
      setPicked(null);
      window.setTimeout(() => setWrongPulse(null), 500);
    }
  };

  const starById = (id: string) => level.stars.find((s) => s.id === id)!;

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <svg viewBox="0 0 100 100" className="aspect-square w-full">
        <defs>
          <radialGradient id="cd-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={level.color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={level.color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* faint preview of required edges */}
        {!solved && Array.from(required).map((k) => {
          if (placedKeys.has(k)) return null;
          const [a, b] = k.split("-");
          const A = starById(a); const B = starById(b);
          return <line key={"hint-" + k} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="white" strokeOpacity={0.06} strokeWidth={0.6} strokeDasharray="1 2" />;
        })}

        {/* placed edges */}
        {edges.map((e, i) => {
          const A = starById(e.a); const B = starById(e.b);
          return (
            <motion.line
              key={"e-" + i}
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke={level.color}
              strokeWidth={solved ? 1.0 : 0.7}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{ filter: `drop-shadow(0 0 2px ${level.color})` }}
            />
          );
        })}

        {/* wrong attempt flash */}
        <AnimatePresence>
          {wrongPulse && (() => {
            const [a, b] = wrongPulse.split("-");
            const A = starById(a); const B = starById(b);
            return (
              <motion.line
                key="wrong" x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke="oklch(0.65 0.25 25)"
                strokeWidth={0.8}
                initial={{ opacity: 1 }} animate={{ opacity: [1, 0.3, 1, 0] }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            );
          })()}
        </AnimatePresence>

        {/* in-progress line from picked star to (interactive — handled via stars) */}

        {/* stars */}
        {level.stars.map((s) => {
          // size inversely proportional to magnitude
          const size = Math.max(0.8, 2.6 - s.mag * 0.35);
          const isPicked = picked === s.id;
          const isBrightest = s.id === level.brightestId && solved;
          return (
            <g key={s.id} onClick={() => onTapStar(s.id)} style={{ cursor: "pointer" }}>
              <circle cx={s.x} cy={s.y} r={size * 2.4} fill="url(#cd-glow)" />
              <motion.circle
                cx={s.x} cy={s.y} r={size}
                fill={isBrightest ? "oklch(0.95 0.16 90)" : "white"}
                stroke={isPicked ? level.color : "white"}
                strokeWidth={isPicked ? 0.6 : 0.15}
                animate={isPicked ? { scale: [1, 1.4, 1] } : { scale: [1, 1.05, 1] }}
                transition={{ duration: isPicked ? 0.8 : 2.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: `${s.x}px ${s.y}px`, filter: isBrightest ? "drop-shadow(0 0 3px oklch(0.95 0.16 90))" : undefined }}
              />
              {/* invisible larger hit target for touch */}
              <circle cx={s.x} cy={s.y} r={5} fill="transparent" />
            </g>
          );
        })}
      </svg>

      {/* helper */}
      <div className="mt-3 text-center text-xs font-semibold text-white/70">
        {solved
          ? <span className="text-gold">✨ Constellation complete!</span>
          : picked
            ? <>Now tap another star to draw a line.</>
            : <>Tap two stars to connect them. {edges.length} / {required.size} lines drawn.</>}
      </div>
    </div>
  );
}
