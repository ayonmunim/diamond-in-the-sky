/**
 * Cinematic lesson movies. Each lesson is a sequence of fully-animated
 * scenes rendered with SVG + Framer Motion. The player handles narration,
 * captions, camera, pause/replay/skip.
 *
 * Visuals are intentionally cute, big-shape, cartoon — Pixar-ish, child-safe.
 */
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { spectralClasses } from "./starColors";

export type CameraFx = "still" | "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | "shake" | "swirl";

export type LessonScene = {
  /** Narration line spoken by Nova (also shown as caption). */
  narration: string;
  /** How long the scene lasts in ms. Defaults to ~7000. */
  durationMs?: number;
  /** Camera motion applied to the scene container. */
  cameraFx?: CameraFx;
  /** Scene visual. Receives 0..1 progress. */
  render: (progress: number) => ReactNode;
};

export type LessonMovie = {
  id: string; // matches lessons[].id
  title: string;
  emoji: string;
  scenes: LessonScene[];
  funFact: string;
  badgeId: string;
  sourceIds: string[]; // shown in end card
};

// ─────────────────────────────────────────────────────────────────────────
// Small reusable scene primitives
// ─────────────────────────────────────────────────────────────────────────

function CartoonStar({
  cx, cy, r, color = "oklch(0.92 0.14 90)", glow = true, face = true, eyes = "open", mouth = "smile",
}: {
  cx: number; cy: number; r: number; color?: string; glow?: boolean;
  face?: boolean; eyes?: "open" | "closed" | "wink"; mouth?: "smile" | "o" | "flat";
}) {
  const id = `s-${cx}-${cy}-${r}`;
  // 5-point puffy star path scaled to radius r centered at cx,cy
  const path = `M${cx} ${cy - r}
    C${cx + r * 0.12} ${cy - r * 0.35}, ${cx + r * 0.28} ${cy - r * 0.28}, ${cx + r} ${cy - r * 0.18}
    C${cx + r * 0.35} ${cy + r * 0.05}, ${cx + r * 0.22} ${cy + r * 0.30}, ${cx + r * 0.6} ${cy + r}
    C${cx + r * 0.05} ${cy + r * 0.4}, ${cx - r * 0.05} ${cy + r * 0.4}, ${cx - r * 0.6} ${cy + r}
    C${cx - r * 0.22} ${cy + r * 0.30}, ${cx - r * 0.35} ${cy + r * 0.05}, ${cx - r} ${cy - r * 0.18}
    C${cx - r * 0.28} ${cy - r * 0.28}, ${cx - r * 0.12} ${cy - r * 0.35}, ${cx} ${cy - r} Z`;
  return (
    <g style={glow ? { filter: `drop-shadow(0 0 ${r * 0.5}px ${color})` } : undefined}>
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="white" />
          <stop offset="60%" stopColor={color} />
          <stop offset="100%" stopColor="oklch(0.45 0.22 35)" />
        </radialGradient>
      </defs>
      <path d={path} fill={`url(#${id})`} stroke="oklch(0.55 0.22 35 / 0.5)" strokeWidth={r * 0.04} strokeLinejoin="round" />
      {face && (
        <g>
          {eyes === "closed" ? (
            <>
              <path d={`M${cx - r * 0.30} ${cy - r * 0.05} q ${r * 0.12} ${r * 0.10} ${r * 0.24} 0`} stroke="oklch(0.18 0.06 275)" strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
              <path d={`M${cx + r * 0.06} ${cy - r * 0.05} q ${r * 0.12} ${r * 0.10} ${r * 0.24} 0`} stroke="oklch(0.18 0.06 275)" strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx={cx - r * 0.18} cy={cy - r * 0.05} rx={r * 0.07} ry={r * 0.11} fill="oklch(0.18 0.06 275)" />
              <ellipse cx={cx + r * 0.18} cy={cy - r * 0.05} rx={r * 0.07} ry={r * 0.11} fill={eyes === "wink" ? "transparent" : "oklch(0.18 0.06 275)"} />
              {eyes === "wink" && (
                <path d={`M${cx + r * 0.1} ${cy - r * 0.05} q ${r * 0.18} ${r * 0.10} ${r * 0.26} 0`} stroke="oklch(0.18 0.06 275)" strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
              )}
            </>
          )}
          {/* cheeks */}
          <circle cx={cx - r * 0.30} cy={cy + r * 0.20} r={r * 0.10} fill="oklch(0.85 0.18 25 / 0.55)" />
          <circle cx={cx + r * 0.30} cy={cy + r * 0.20} r={r * 0.10} fill="oklch(0.85 0.18 25 / 0.55)" />
          {/* mouth */}
          {mouth === "smile" && (
            <path d={`M${cx - r * 0.25} ${cy + r * 0.18} Q${cx} ${cy + r * 0.45} ${cx + r * 0.25} ${cy + r * 0.18}`} fill="none" stroke="oklch(0.20 0.10 275)" strokeWidth={r * 0.07} strokeLinecap="round" />
          )}
          {mouth === "o" && (
            <ellipse cx={cx} cy={cy + r * 0.25} rx={r * 0.10} ry={r * 0.13} fill="oklch(0.20 0.10 275)" />
          )}
          {mouth === "flat" && (
            <path d={`M${cx - r * 0.20} ${cy + r * 0.25} L${cx + r * 0.20} ${cy + r * 0.25}`} stroke="oklch(0.20 0.10 275)" strokeWidth={r * 0.07} strokeLinecap="round" />
          )}
        </g>
      )}
    </g>
  );
}

function Sparkle({ x, y, size = 6, delay = 0 }: { x: number; y: number; size?: number; delay?: number }) {
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, delay, ease: "easeInOut" }}
      style={{ transformOrigin: `${x}px ${y}px`, transformBox: "fill-box" }}
    >
      <path d={`M${x} ${y - size} L${x + size * 0.3} ${y - size * 0.3} L${x + size} ${y} L${x + size * 0.3} ${y + size * 0.3} L${x} ${y + size} L${x - size * 0.3} ${y + size * 0.3} L${x - size} ${y} L${x - size * 0.3} ${y - size * 0.3} Z`}
        fill="white" opacity={0.9} />
    </motion.g>
  );
}

function FieldOfStars({ count = 90, seed = 1 }: { count?: number; seed?: number }) {
  const stars = Array.from({ length: count }, (_, i) => {
    const r = ((Math.sin(i * 9.91 + seed * 31) + 1) / 2);
    const r2 = ((Math.cos(i * 4.17 + seed * 17) + 1) / 2);
    return { x: r * 100, y: r2 * 100, s: 0.4 + ((r * r2 * 13) % 1) * 1.4, d: (i % 7) * 0.4 };
  });
  return (
    <>
      {stars.map((s, i) => (
        <motion.circle
          key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.s}
          fill="white"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4 + (i % 5) * 0.3, repeat: Infinity, delay: s.d, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Lesson 1 — What is a Star?
// ─────────────────────────────────────────────────────────────────────────
const lesson1: LessonMovie = {
  id: "what-is-a-star",
  title: "What is a Star?",
  emoji: "⭐",
  badgeId: "star-knowledge",
  sourceIds: ["starchild_stars"],
  funFact: "Our Sun turns 600 million tons of hydrogen into energy every second!",
  scenes: [
    {
      narration: "Hello Explorer! Have you ever wondered what stars really are? Let's go on a journey!",
      durationMs: 7000,
      cameraFx: "zoom-in",
      render: (p) => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={120} />
          {/* distant glowing star we zoom toward */}
          <motion.g animate={{ scale: 1 + p * 0.6 }} style={{ transformOrigin: "300px 180px" }}>
            <CartoonStar cx={300} cy={180} r={28 + p * 24} color="oklch(0.92 0.14 90)" eyes="wink" />
          </motion.g>
          {/* Nova companion floating */}
          <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <CartoonStar cx={120} cy={250} r={36} color="oklch(0.92 0.14 90)" />
          </motion.g>
          <Sparkle x={400} y={120} delay={0} />
          <Sparkle x={180} y={90} size={5} delay={0.6} />
          <Sparkle x={500} y={250} delay={1} />
        </svg>
      ),
    },
    {
      narration: "Stars are giant glowing balls of hot gas made mostly of hydrogen and helium.",
      durationMs: 8000,
      cameraFx: "still",
      render: (p) => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={60} seed={2} />
          {/* big star opens — outer shell pulls aside */}
          <motion.circle cx={300} cy={180} r={140}
            fill="url(#starbody)" opacity={0.95}
            animate={{ r: [140, 140, 140], opacity: [1, 1, 0.65] }}
            transition={{ duration: 4, times: [0, 0.5, 1] }} />
          <defs>
            <radialGradient id="starbody" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="white" />
              <stop offset="60%" stopColor="oklch(0.92 0.14 90)" />
              <stop offset="100%" stopColor="oklch(0.55 0.22 35)" />
            </radialGradient>
          </defs>
          {/* interior particles — H (yellow) and He (cyan) */}
          {Array.from({ length: 50 }).map((_, i) => {
            const angle = (i / 50) * Math.PI * 2;
            const rad = 30 + (i % 5) * 18;
            const cx = 300 + Math.cos(angle + p * 2) * rad;
            const cy = 180 + Math.sin(angle + p * 2) * rad;
            const isHe = i % 4 === 0;
            return (
              <motion.circle key={i} cx={cx} cy={cy} r={isHe ? 5 : 3.5}
                fill={isHe ? "oklch(0.82 0.14 195)" : "oklch(0.95 0.14 95)"}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.04 }} />
            );
          })}
        </svg>
      ),
    },
    {
      narration: "Deep inside every star, hydrogen atoms crash together and turn into helium. This is called nuclear fusion!",
      durationMs: 9000,
      cameraFx: "shake",
      render: (p) => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          {/* two H atoms colliding into He with cute explosion */}
          <motion.circle cx={200 + p * 80} cy={180} r={20} fill="oklch(0.95 0.14 95)" />
          <motion.circle cx={400 - p * 80} cy={180} r={20} fill="oklch(0.95 0.14 95)" />
          {/* burst when close */}
          {p > 0.5 && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 0.6 }}
              style={{ transformOrigin: "300px 180px" }}
            >
              <circle cx={300} cy={180} r={40} fill="white" opacity={0.7} />
              <circle cx={300} cy={180} r={26} fill="oklch(0.82 0.14 195)" />
              {Array.from({ length: 10 }).map((_, i) => {
                const a = (i / 10) * Math.PI * 2;
                return (
                  <motion.line
                    key={i}
                    x1={300} y1={180}
                    x2={300 + Math.cos(a) * 90}
                    y2={180 + Math.sin(a) * 90}
                    stroke="oklch(0.95 0.14 95)" strokeWidth={3} strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 1 }}
                    animate={{ pathLength: 1, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                );
              })}
            </motion.g>
          )}
          <text x={200} y={130} fill="white" fontSize={18} fontWeight="bold" textAnchor="middle">H</text>
          <text x={400} y={130} fill="white" fontSize={18} fontWeight="bold" textAnchor="middle">H</text>
          {p > 0.6 && <text x={300} y={260} fill="oklch(0.82 0.14 195)" fontSize={26} fontWeight="bold" textAnchor="middle">He + ENERGY ✨</text>}
        </svg>
      ),
    },
    {
      narration: "This amazing process releases huge amounts of light and heat. That's why stars shine for billions of years!",
      durationMs: 8000,
      cameraFx: "zoom-out",
      render: (p) => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={80} seed={4} />
          <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: "300px 180px" }}>
            <CartoonStar cx={300} cy={180} r={80} color="oklch(0.92 0.14 90)" eyes="open" mouth="smile" />
          </motion.g>
          {/* radiating rays */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r1 = 90, r2 = 90 + 40 + p * 80;
            return (
              <motion.line key={i}
                x1={300 + Math.cos(a) * r1} y1={180 + Math.sin(a) * r1}
                x2={300 + Math.cos(a) * r2} y2={180 + Math.sin(a) * r2}
                stroke="oklch(0.95 0.14 95)" strokeWidth={3} strokeLinecap="round"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.05 }} />
            );
          })}
        </svg>
      ),
    },
    {
      narration: "Meet our very own star — the Sun! It turns 600 million tons of hydrogen into energy every second.",
      durationMs: 8000,
      cameraFx: "swirl",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={60} seed={6} />
          <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "300px 180px" }}>
            {Array.from({ length: 20 }).map((_, i) => {
              const a = (i / 20) * Math.PI * 2;
              const len = 80 + (i % 3) * 10;
              return (
                <line key={i}
                  x1={300 + Math.cos(a) * 80} y1={180 + Math.sin(a) * 80}
                  x2={300 + Math.cos(a) * (80 + len * 0.4)} y2={180 + Math.sin(a) * (80 + len * 0.4)}
                  stroke="oklch(0.95 0.14 95)" strokeWidth={4} strokeLinecap="round" opacity={0.5} />
              );
            })}
          </motion.g>
          <CartoonStar cx={300} cy={180} r={70} color="oklch(0.88 0.18 75)" mouth="smile" eyes="open" />
          <text x={300} y={330} fill="white" fontSize={18} textAnchor="middle" fontWeight="bold">Our Sun ☀️</text>
        </svg>
      ),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Lesson 2 — Why Do Stars Twinkle?
// ─────────────────────────────────────────────────────────────────────────
const lesson2: LessonMovie = {
  id: "why-twinkle",
  title: "Why Do Stars Twinkle?",
  emoji: "✨",
  badgeId: "twinkle-explorer",
  sourceIds: ["starchild_stars"],
  funFact: "Astronauts in space see stars as steady points of light — no twinkle!",
  scenes: [
    {
      narration: "Look up at the night sky… Can you see the stars dancing and sparkling?",
      durationMs: 7000,
      cameraFx: "pan-left",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={130} />
          {/* Earth horizon */}
          <ellipse cx={300} cy={420} rx={420} ry={140} fill="oklch(0.30 0.12 240)" />
          <ellipse cx={300} cy={420} rx={420} ry={140} fill="url(#hg)" opacity={0.6} />
          <defs>
            <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.40 0.14 230 / 0.4)" />
              <stop offset="100%" stopColor="oklch(0.10 0.04 270 / 1)" />
            </linearGradient>
          </defs>
          {/* Nova looking up */}
          <CartoonStar cx={120} cy={310} r={28} color="oklch(0.92 0.14 90)" eyes="open" mouth="o" />
        </svg>
      ),
    },
    {
      narration: "Earth is wrapped in a blanket of air called the atmosphere. It's always moving!",
      durationMs: 8000,
      cameraFx: "still",
      render: (p) => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          {/* layered wavy atmosphere */}
          {[0, 1, 2, 3].map((i) => (
            <motion.path
              key={i}
              d={`M0 ${100 + i * 50} Q150 ${80 + i * 50 + Math.sin(p * Math.PI * 2 + i) * 18} 300 ${100 + i * 50} T600 ${100 + i * 50}`}
              fill="none" stroke={`oklch(0.70 0.14 ${200 + i * 20} / ${0.5 - i * 0.08})`} strokeWidth={3}
              animate={{ d: [
                `M0 ${100 + i * 50} Q150 ${80 + i * 50} 300 ${100 + i * 50} T600 ${100 + i * 50}`,
                `M0 ${100 + i * 50} Q150 ${120 + i * 50} 300 ${100 + i * 50} T600 ${100 + i * 50}`,
                `M0 ${100 + i * 50} Q150 ${80 + i * 50} 300 ${100 + i * 50} T600 ${100 + i * 50}`,
              ]}}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }} />
          ))}
          <text x={300} y={340} fill="white" fontSize={16} textAnchor="middle" opacity={0.8}>↑ Earth's atmosphere ↑</text>
        </svg>
      ),
    },
    {
      narration: "When starlight enters our wavy atmosphere, it bends and wobbles all the way down.",
      durationMs: 8000,
      cameraFx: "still",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <CartoonStar cx={300} cy={50} r={26} color="oklch(0.95 0.14 95)" face={false} />
          {/* zig-zag light beam */}
          <motion.path
            d="M300 80 Q280 130 320 180 Q260 230 310 280 Q280 320 300 340"
            fill="none" stroke="oklch(0.95 0.14 95 / 0.9)" strokeWidth={3} strokeDasharray="6 6"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity }} />
          <CartoonStar cx={300} cy={330} r={20} color="oklch(0.92 0.14 90)" mouth="smile" />
        </svg>
      ),
    },
    {
      narration: "That wobble makes stars look like they're twinkling. In space, stars don't twinkle at all!",
      durationMs: 8000,
      cameraFx: "still",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          {/* left: from Earth — wobbly */}
          <text x={150} y={30} fill="white" fontSize={14} textAnchor="middle" fontWeight="bold">From Earth 🌍</text>
          {[0, 1, 2].map((i) => (
            <motion.g key={i} animate={{ scale: [1, 1.3, 0.9, 1.2, 1], x: [0, 3, -3, 2, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
              style={{ transformOrigin: `${100 + i * 50}px ${180}px`, transformBox: "fill-box" }}>
              <circle cx={100 + i * 50} cy={180} r={8} fill="white" />
            </motion.g>
          ))}
          {/* divider */}
          <line x1={300} y1={60} x2={300} y2={320} stroke="white" strokeOpacity={0.3} strokeDasharray="4 4" />
          {/* right: from space — steady */}
          <text x={450} y={30} fill="white" fontSize={14} textAnchor="middle" fontWeight="bold">From Space 🚀</text>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={400 + i * 50} cy={180} r={8} fill="white" />
          ))}
        </svg>
      ),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Lesson 3 — Constellations
// ─────────────────────────────────────────────────────────────────────────
const lesson3: LessonMovie = {
  id: "constellations",
  title: "What Are Constellations?",
  emoji: "🌌",
  badgeId: "constellation-watcher",
  sourceIds: ["starchild_stars", "gcvs"],
  funFact: "There are 88 officially recognized constellations in the sky.",
  scenes: [
    {
      narration: "Long ago, sailors used the stars to find their way across vast dark oceans.",
      durationMs: 8000,
      cameraFx: "pan-right",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={100} />
          {/* sea */}
          <motion.path d="M0 270 Q150 250 300 270 T600 270 L600 360 L0 360 Z" fill="oklch(0.30 0.14 240)"
            animate={{ d: ["M0 270 Q150 250 300 270 T600 270 L600 360 L0 360 Z", "M0 270 Q150 285 300 270 T600 270 L600 360 L0 360 Z", "M0 270 Q150 250 300 270 T600 270 L600 360 L0 360 Z"] }}
            transition={{ duration: 4, repeat: Infinity }} />
          {/* boat */}
          <motion.g animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity }}
            style={{ transformOrigin: "300px 260px" }}>
            <path d="M260 270 L340 270 L320 295 L280 295 Z" fill="oklch(0.45 0.10 60)" />
            <rect x={298} y={210} width={4} height={60} fill="oklch(0.45 0.10 60)" />
            <path d="M302 215 L340 245 L302 250 Z" fill="white" />
          </motion.g>
        </svg>
      ),
    },
    {
      narration: "They imagined lines connecting the stars — and saw hunters, bears, and great dippers up in the sky!",
      durationMs: 9000,
      cameraFx: "still",
      render: (p) => {
        // Big Dipper coords
        const pts = [
          [120, 200], [180, 180], [240, 170], [300, 165],
          [340, 200], [400, 220], [460, 200],
        ];
        return (
          <svg viewBox="0 0 600 360" className="h-full w-full">
            <FieldOfStars count={50} seed={3} />
            {pts.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={6} fill="white" />
            ))}
            {pts.slice(0, -1).map(([x1, y1], i) => {
              const [x2, y2] = pts[i + 1];
              const visible = p > i / pts.length;
              return (
                <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="oklch(0.92 0.14 90)" strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
                  transition={{ duration: 0.5 }} />
              );
            })}
            <text x={300} y={320} fill="white" fontSize={18} textAnchor="middle" fontWeight="bold">Big Dipper</text>
          </svg>
        );
      },
    },
    {
      narration: "Stars connect to tell stories of mythical creatures and ancient heroes — like Orion the Hunter!",
      durationMs: 9000,
      cameraFx: "still",
      render: () => {
        // Orion approximation
        const orion: [number, number][] = [
          [200, 80], [400, 100],            // shoulders
          [280, 180], [310, 180], [340, 180], // belt
          [240, 280], [380, 290],            // legs
        ];
        return (
          <svg viewBox="0 0 600 360" className="h-full w-full">
            <FieldOfStars count={50} seed={5} />
            {/* faint hunter silhouette */}
            <motion.path
              d="M280 60 L320 60 L380 110 L420 200 L380 290 L340 230 L260 230 L220 290 L180 200 L220 110 Z"
              fill="oklch(0.78 0.18 350 / 0.18)"
              stroke="oklch(0.78 0.18 350 / 0.5)" strokeWidth={2}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} />
            {orion.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={6} fill="white" filter="url(#glow3)" />
            ))}
            <defs>
              <filter id="glow3"><feGaussianBlur stdDeviation="2" /></filter>
            </defs>
            <text x={300} y={340} fill="white" fontSize={16} textAnchor="middle" fontWeight="bold">Orion the Hunter</text>
          </svg>
        );
      },
    },
    {
      narration: "Today, astronomers recognize 88 official constellations that map every corner of the night sky.",
      durationMs: 8000,
      cameraFx: "zoom-out",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={150} seed={9} />
          <motion.text x={300} y={200} textAnchor="middle" fontSize={84} fontWeight="bold" fill="oklch(0.92 0.14 90)"
            initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 1 }}
            style={{ transformOrigin: "300px 200px" }}>88</motion.text>
          <text x={300} y={240} fill="white" fontSize={18} textAnchor="middle">official constellations</text>
        </svg>
      ),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Lesson 4 — Star Colors and Temperature
// ─────────────────────────────────────────────────────────────────────────
const lesson4: LessonMovie = {
  id: "star-colors",
  title: "Star Colors & Temperature",
  emoji: "🎨",
  badgeId: "color-master",
  sourceIds: ["imagine_timing"],
  funFact: "Blue stars can be hotter than 30,000°C — more than five times hotter than the Sun!",
  scenes: [
    {
      narration: "Stars come in many beautiful colors — blue, white, yellow, orange, and red.",
      durationMs: 8000,
      cameraFx: "still",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          {["oklch(0.72 0.18 245)", "oklch(0.95 0.02 230)", "oklch(0.88 0.14 95)", "oklch(0.78 0.16 60)", "oklch(0.62 0.22 25)"].map((c, i) => (
            <motion.g key={i}
              initial={{ scale: 0, y: 30 }} animate={{ scale: 1, y: 0 }}
              transition={{ delay: i * 0.4, type: "spring", stiffness: 200, damping: 14 }}>
              <CartoonStar cx={80 + i * 120} cy={180} r={38} color={c} />
            </motion.g>
          ))}
        </svg>
      ),
    },
    {
      narration: "A star's color tells us how hot it is. Blue stars are the hottest, and red stars are the coolest.",
      durationMs: 9000,
      cameraFx: "still",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          {/* thermometer */}
          <rect x={50} y={60} width={40} height={240} rx={20} fill="oklch(0.20 0.06 280)" stroke="white" strokeOpacity={0.4} />
          <motion.rect x={50} y={60} width={40} rx={20}
            initial={{ height: 0 }} animate={{ height: 240 }} transition={{ duration: 4 }}
            fill="url(#tg)" />
          <defs>
            <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.72 0.18 245)" />
              <stop offset="25%" stopColor="oklch(0.95 0.02 230)" />
              <stop offset="55%" stopColor="oklch(0.88 0.14 95)" />
              <stop offset="80%" stopColor="oklch(0.78 0.16 60)" />
              <stop offset="100%" stopColor="oklch(0.62 0.22 25)" />
            </linearGradient>
          </defs>
          {[
            { c: "oklch(0.72 0.18 245)", label: "Blue 30,000°C", y: 80 },
            { c: "oklch(0.95 0.02 230)", label: "White 10,000°C", y: 140 },
            { c: "oklch(0.88 0.14 95)", label: "Yellow 5,500°C ← Sun", y: 200 },
            { c: "oklch(0.78 0.16 60)", label: "Orange 4,000°C", y: 250 },
            { c: "oklch(0.62 0.22 25)", label: "Red 3,000°C", y: 300 },
          ].map((row, i) => (
            <motion.g key={i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.6 }}>
              <circle cx={180} cy={row.y} r={18} fill={row.c} />
              <text x={220} y={row.y + 5} fill="white" fontSize={16} fontWeight="bold">{row.label}</text>
            </motion.g>
          ))}
        </svg>
      ),
    },
    {
      narration: "Our Sun is a friendly yellow star — perfectly medium-hot, just right for life on Earth!",
      durationMs: 7000,
      cameraFx: "zoom-in",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={40} />
          <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: "300px 180px" }}>
            <CartoonStar cx={300} cy={180} r={90} color="oklch(0.88 0.14 95)" mouth="smile" />
          </motion.g>
        </svg>
      ),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Lesson 5 — Distance and Brightness
// ─────────────────────────────────────────────────────────────────────────
const lesson5: LessonMovie = {
  id: "distance-brightness",
  title: "Distance & Brightness",
  emoji: "🔭",
  badgeId: "brightness-explorer",
  sourceIds: ["starchild_cepheids"],
  funFact: "Some stars are thousands of times brighter than our Sun but look tiny because they are so far away.",
  scenes: [
    {
      narration: "Look at these two stars. They look the same brightness, right?",
      durationMs: 7000,
      cameraFx: "still",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={40} />
          <CartoonStar cx={200} cy={180} r={36} color="oklch(0.92 0.14 90)" />
          <CartoonStar cx={400} cy={180} r={36} color="oklch(0.92 0.14 90)" />
        </svg>
      ),
    },
    {
      narration: "Now watch — one star moves far, far away. See how it gets dimmer and tinier?",
      durationMs: 9000,
      cameraFx: "still",
      render: (p) => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={40} />
          <CartoonStar cx={200} cy={180} r={36} color="oklch(0.92 0.14 90)" />
          <motion.g style={{ transformOrigin: "400px 180px" }}>
            <CartoonStar cx={400} cy={180} r={36 - p * 26} color="oklch(0.92 0.14 90)" />
          </motion.g>
          {/* perspective line */}
          <line x1={400} y1={216} x2={400 + p * 80} y2={300} stroke="white" strokeOpacity={0.2} strokeDasharray="3 3" />
          <text x={300} y={340} fill="white" fontSize={14} textAnchor="middle" opacity={0.7}>same star, much farther</text>
        </svg>
      ),
    },
    {
      narration: "A star may look dim simply because it is very far away — even if it's actually huge and bright!",
      durationMs: 8000,
      cameraFx: "still",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          {/* near tiny vs far giant */}
          <CartoonStar cx={150} cy={180} r={48} color="oklch(0.92 0.14 90)" />
          <text x={150} y={300} fill="white" fontSize={14} textAnchor="middle">Small + Near</text>
          <CartoonStar cx={460} cy={180} r={22} color="oklch(0.78 0.20 60)" face={false} />
          <text x={460} y={300} fill="white" fontSize={14} textAnchor="middle">Giant + Far</text>
          <text x={300} y={50} fill="white" fontSize={16} textAnchor="middle" fontWeight="bold">Both look the same from Earth!</text>
        </svg>
      ),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Lesson 6 — The Sun is a Star
// ─────────────────────────────────────────────────────────────────────────
const lesson6: LessonMovie = {
  id: "the-sun",
  title: "The Sun is a Star",
  emoji: "☀️",
  badgeId: "solar-scientist",
  sourceIds: ["starchild_stars"],
  funFact: "Light from the Sun takes about 8 minutes to travel 150 million km to reach Earth.",
  scenes: [
    {
      narration: "Let's fly toward our nearest star — the Sun!",
      durationMs: 7000,
      cameraFx: "zoom-in",
      render: (p) => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={80} />
          <motion.g animate={{ scale: 1 + p * 1.6 }} style={{ transformOrigin: "300px 180px" }}>
            <CartoonStar cx={300} cy={180} r={50} color="oklch(0.88 0.18 75)" mouth="smile" />
          </motion.g>
        </svg>
      ),
    },
    {
      narration: "The Sun is so big and powerful that 8 planets all orbit around it — including our Earth!",
      durationMs: 9000,
      cameraFx: "swirl",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <CartoonStar cx={300} cy={180} r={50} color="oklch(0.88 0.18 75)" />
          {[80, 110, 140, 170].map((r, i) => (
            <g key={i}>
              <circle cx={300} cy={180} r={r} fill="none" stroke="white" strokeOpacity={0.15} />
              <motion.g animate={{ rotate: 360 }} transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "300px 180px" }}>
                <circle cx={300 + r} cy={180} r={6 + (i % 2) * 2}
                  fill={["oklch(0.7 0.14 30)", "oklch(0.85 0.05 230)", "oklch(0.6 0.18 140)", "oklch(0.55 0.20 25)"][i]} />
                {i === 1 && <text x={300 + r} y={170} fill="white" fontSize={10} textAnchor="middle">🌍</text>}
              </motion.g>
            </g>
          ))}
        </svg>
      ),
    },
    {
      narration: "Deep inside, the Sun makes light through fusion — and shoots out fiery flares of energy!",
      durationMs: 8000,
      cameraFx: "shake",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <CartoonStar cx={300} cy={180} r={110} color="oklch(0.88 0.18 75)" face={false} />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <motion.path key={i}
                d={`M${300 + Math.cos(a) * 100} ${180 + Math.sin(a) * 100} q ${Math.cos(a) * 30} ${Math.sin(a) * 30 - 20} ${Math.cos(a) * 80} ${Math.sin(a) * 80}`}
                stroke="oklch(0.95 0.18 60)" strokeWidth={5} fill="none" strokeLinecap="round"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
            );
          })}
          <text x={300} y={335} fill="white" fontSize={16} textAnchor="middle" fontWeight="bold">Solar flares 🔥</text>
        </svg>
      ),
    },
    {
      narration: "Without the Sun, there would be no light, no warmth, and no life on Earth. Our Sun is amazing!",
      durationMs: 7000,
      cameraFx: "zoom-out",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <CartoonStar cx={200} cy={180} r={90} color="oklch(0.88 0.18 75)" mouth="smile" />
          <text x={420} y={150} fill="white" fontSize={28} fontWeight="bold" textAnchor="middle">🌍</text>
          <text x={420} y={200} fill="white" fontSize={14} textAnchor="middle">8 min away</text>
          <motion.line x1={250} y1={180} x2={400} y2={150}
            stroke="oklch(0.95 0.14 95)" strokeWidth={3} strokeDasharray="6 6"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity }} />
        </svg>
      ),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Lesson 7 — Variable Stars
// ─────────────────────────────────────────────────────────────────────────
const lesson7: LessonMovie = {
  id: "variable-stars",
  title: "Variable Stars",
  emoji: "💡",
  badgeId: "variable-star-explorer",
  sourceIds: ["starchild_cepheids", "gcvs"],
  funFact: "Astronomers use variable stars as 'cosmic rulers' to measure distances across the universe.",
  scenes: [
    {
      narration: "Some stars have a special trick — they get brighter and dimmer over and over again!",
      durationMs: 8000,
      cameraFx: "still",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={40} />
          <motion.g animate={{ scale: [0.7, 1.2, 0.7] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "300px 180px" }}>
            <CartoonStar cx={300} cy={180} r={60} color="oklch(0.92 0.14 90)" />
          </motion.g>
        </svg>
      ),
    },
    {
      narration: "Some are binary stars — two stars dancing around each other, taking turns blocking the light.",
      durationMs: 9000,
      cameraFx: "swirl",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "300px 180px" }}>
            <CartoonStar cx={220} cy={180} r={35} color="oklch(0.95 0.14 95)" face={false} />
            <CartoonStar cx={380} cy={180} r={28} color="oklch(0.78 0.16 60)" face={false} />
          </motion.g>
        </svg>
      ),
    },
    {
      narration: "We can draw their brightness over time — these patterns are called light curves.",
      durationMs: 8000,
      cameraFx: "still",
      render: (p) => {
        const points = Array.from({ length: 60 }, (_, i) => {
          const x = 60 + i * 8;
          const y = 200 - Math.sin((i / 60) * Math.PI * 6) * 60;
          return `${x},${y}`;
        });
        const drawn = Math.floor(points.length * p);
        return (
          <svg viewBox="0 0 600 360" className="h-full w-full">
            <line x1={60} y1={300} x2={540} y2={300} stroke="white" strokeOpacity={0.4} />
            <line x1={60} y1={60} x2={60} y2={300} stroke="white" strokeOpacity={0.4} />
            <text x={300} y={335} fill="white" fontSize={12} textAnchor="middle">time →</text>
            <polyline points={points.slice(0, drawn).join(" ")}
              fill="none" stroke="oklch(0.92 0.14 90)" strokeWidth={3} strokeLinecap="round" />
            {drawn > 0 && (
              <circle
                cx={Number(points[drawn - 1].split(",")[0])}
                cy={Number(points[drawn - 1].split(",")[1])}
                r={8} fill="white" />
            )}
          </svg>
        );
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Lesson 8 — Spectral Classes
// ─────────────────────────────────────────────────────────────────────────
const lesson8: LessonMovie = {
  id: "spectral-classes",
  title: "Star Classes (O B A F G K M)",
  emoji: "🌈",
  badgeId: "classification-master",
  sourceIds: ["imagine_timing", "starchild_stars"],
  funFact: "Our Sun belongs to class G — a friendly, medium-temperature yellow star.",
  scenes: [
    {
      narration: "Meet the seven star classes — each one a different color and temperature!",
      durationMs: 9000,
      cameraFx: "still",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          {spectralClasses.map((c, i) => (
            <motion.g key={c.klass}
              initial={{ scale: 0, y: 30 }} animate={{ scale: 1, y: 0 }}
              transition={{ delay: i * 0.25, type: "spring", stiffness: 220, damping: 14 }}>
              <CartoonStar cx={55 + i * 82} cy={170} r={32} color={c.cssColor}
                eyes={i === 0 || i === 1 ? "open" : i === 4 ? "open" : "closed"}
                mouth={i < 2 ? "o" : i === 4 ? "smile" : "smile"} />
              <text x={55 + i * 82} y={240} fill="white" fontSize={22} fontWeight="bold" textAnchor="middle">{c.klass}</text>
              <text x={55 + i * 82} y={260} fill="white" fontSize={10} textAnchor="middle" opacity={0.7}>{c.color}</text>
            </motion.g>
          ))}
        </svg>
      ),
    },
    {
      narration: "Remember their order with this magic phrase: Oh Be A Fine Girl or Guy, Kiss Me!",
      durationMs: 9000,
      cameraFx: "still",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          {["Oh", "Be", "A", "Fine", "Girl/Guy,", "Kiss", "Me!"].map((w, i) => (
            <motion.text key={i}
              x={80 + i * 70} y={180} fill={spectralClasses[i].cssColor}
              fontSize={28} fontWeight="bold" textAnchor="middle"
              initial={{ opacity: 0, y: 200 }} animate={{ opacity: 1, y: 180 }}
              transition={{ delay: i * 0.4, type: "spring", stiffness: 200 }}>
              {w}
            </motion.text>
          ))}
          {spectralClasses.map((c, i) => (
            <motion.text key={c.klass}
              x={80 + i * 70} y={230} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.4 + 0.2 }}>
              {c.klass}
            </motion.text>
          ))}
        </svg>
      ),
    },
    {
      narration: "Our Sun is a Class G star. Friendly, warm, and just right for life on Earth!",
      durationMs: 7000,
      cameraFx: "zoom-in",
      render: () => (
        <svg viewBox="0 0 600 360" className="h-full w-full">
          <FieldOfStars count={40} />
          <motion.g animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: "300px 180px" }}>
            <CartoonStar cx={300} cy={180} r={90} color="oklch(0.88 0.14 95)" mouth="smile" />
          </motion.g>
          <text x={300} y={310} fill="white" fontSize={20} textAnchor="middle" fontWeight="bold">Sun = Class G ⭐</text>
        </svg>
      ),
    },
  ],
};

export const lessonMovies: LessonMovie[] = [
  lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8,
];

export function getMovie(id: string) {
  return lessonMovies.find((m) => m.id === id);
}
