/**
 * Cinematic per-level story scenes — animated cartoon cutscenes that play
 * before each mission level. Every entry is a list of synchronized
 * narration + visual beats. Levels without a bespoke entry fall back to a
 * generated cinematic that picks a richly animated scene template per beat
 * (galaxy fly-through, planet parade, atom lab, twinkle sky, telescope
 * iris, sun rays, constellation draw, etc.) so every level feels like a
 * short cartoon episode and never a static slide.
 */
import { motion } from "framer-motion";
import { Nova } from "@/components/Nova";
import level1Video from "@/assets/level1-cartoon.mp4?url";
import level2Video from "@/assets/level2-cartoon.mp4?url";
import level3Video from "@/assets/level3-cartoon.mp4?url";
import level4Video from "@/assets/level4-cartoon.mp4?url";
import level5Video from "@/assets/level5-cartoon.mp4?url";
import m2level1Video from "@/assets/m2-level1-cartoon.mp4?url";
import m2level2Video from "@/assets/m2-level2-cartoon.mp4?url";
import m2level3Video from "@/assets/m2-level3-cartoon.mp4?url";
import m2level4Video from "@/assets/m2-level4-cartoon.mp4?url";
import m2level5Video from "@/assets/m2-level5-cartoon.mp4?url";




export type CameraFx =
  | "still" | "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | "shake" | "swirl";

export type CinematicScene = {
  narration: string;
  durationMs?: number;
  cameraFx?: CameraFx;
  render: (progress: number) => React.ReactNode;
};

export type VideoCaption = { at: number; text: string };

export type Cinematic = {
  title: string;
  emoji: string;
  color: string;
  scenes: CinematicScene[];
  /** Optional pre-rendered cartoon MP4. When set, the player shows the video
   *  fullscreen with synced captions instead of the SVG scene sequence. */
  videoUrl?: string;
  videoCaptions?: VideoCaption[];
};


/* ============================================================
   Reusable animated visual building blocks
   ============================================================ */

function Starfield({ count = 80, twinkle = true }: { count?: number; twinkle?: boolean }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    x: (i * 97) % 100,
    y: (i * 53) % 100,
    s: 0.4 + ((i * 31) % 100) / 120,
    d: 1 + ((i * 17) % 30) / 10,
  }));
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      {stars.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x} cy={s.y} r={s.s * 0.18}
          fill="white"
          animate={twinkle ? { opacity: [0.3, 1, 0.3] } : undefined}
          transition={{ duration: s.d, repeat: Infinity, ease: "easeInOut", delay: (i % 7) * 0.2 }}
        />
      ))}
    </svg>
  );
}

function ParallaxSpace({ tint = "oklch(0.65 0.26 320 / 0.55)" }: { tint?: string }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.10 0.08 280), oklch(0.05 0.05 260))" }} />
      <motion.div className="absolute inset-0" animate={{ x: [-30, 30] }} transition={{ duration: 10, repeat: Infinity, ease: "linear", repeatType: "reverse" }}>
        <Starfield count={110} />
      </motion.div>
      <motion.div className="absolute inset-0" animate={{ x: [-60, 60] }} transition={{ duration: 14, repeat: Infinity, ease: "linear", repeatType: "reverse" }}>
        <Starfield count={40} twinkle={false} />
      </motion.div>
      <div className="absolute -left-32 top-1/4 h-[380px] w-[380px] rounded-full blur-3xl"
           style={{ background: `radial-gradient(circle, ${tint}, transparent 70%)` }} />
      <div className="absolute -right-24 bottom-1/4 h-[340px] w-[340px] rounded-full blur-3xl"
           style={{ background: "radial-gradient(circle, oklch(0.60 0.22 240 / 0.5), transparent 70%)" }} />
    </>
  );
}

function NovaFloat({ x = 0, y = 0, mood = "happy" as const, size = "md" as const }: { x?: number; y?: number; mood?: "happy"|"excited"|"surprised"|"wave"; size?: "sm"|"md"|"lg" }) {
  return (
    <motion.div
      className="absolute z-10"
      style={{ left: `${50 + x}%`, top: `${50 + y}%`, transform: "translate(-50%,-50%)" }}
      animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <Nova size={size} mood={mood} interactive={false} />
    </motion.div>
  );
}

function NovaFly({ from = "-15%", to = "70%", top = "55%", mood = "excited" as const }: { from?: string; to?: string; top?: string; mood?: "happy"|"excited"|"surprised"|"wave" }) {
  return (
    <motion.div
      className="absolute z-10"
      style={{ top }}
      animate={{ left: [from, to] }}
      transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    >
      <Nova size="lg" mood={mood} interactive={false} />
      <motion.div
        className="absolute right-[80%] top-1/2 h-1.5 w-32 -translate-y-1/2 rounded-full"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.86 0.16 85 / 0.8))", filter: "blur(2px)" }}
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
    </motion.div>
  );
}

function GlowingStar({
  size = 240,
  color = "oklch(0.88 0.18 90)",
  pulse = true,
}: { size?: number; color?: string; pulse?: boolean }) {
  return (
    <motion.div
      className="relative rounded-full"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        boxShadow: `0 0 120px 30px ${color}`,
      }}
      animate={pulse ? { scale: [1, 1.08, 1], filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"] } : undefined}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="absolute inset-[18%] rounded-full"
        style={{ background: `radial-gradient(circle, white, ${color} 60%, transparent 90%)` }}
      />
    </motion.div>
  );
}

function Comet({ delay = 0, top = "20%", duration = 2.4 }: { delay?: number; top?: string; duration?: number }) {
  return (
    <motion.div
      className="absolute z-[1]"
      style={{ top }}
      initial={{ left: "-10%", opacity: 0 }}
      animate={{ left: ["-10%", "110%"], opacity: [0, 1, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, repeatDelay: 1.5, ease: "easeIn" }}
    >
      <div className="relative">
        <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_18px_6px_white]" />
        <div className="absolute right-3 top-1/2 h-1 w-24 -translate-y-1/2 rounded-full"
             style={{ background: "linear-gradient(90deg, transparent, oklch(0.85 0.18 60 / 0.9))", filter: "blur(1px)" }} />
      </div>
    </motion.div>
  );
}

/* -------- Scene Templates -------- */

function S_FlyThroughGalaxy({ p, color, emoji }: { p: number; color: string; emoji: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <ParallaxSpace tint={color.replace(")", " / 0.55)")} />
      <Comet delay={0} top="18%" />
      <Comet delay={0.8} top="62%" duration={2.8} />
      <Comet delay={1.6} top="38%" duration={2.2} />
      <NovaFly mood="excited" />
      <div className="absolute right-6 top-6 text-3xl drop-shadow-[0_0_18px_rgba(255,220,150,0.7)]">{emoji}</div>
      <_Progress p={p} />
    </div>
  );
}

function S_DiscoveryStar({ p, color, emoji }: { p: number; color: string; emoji: string }) {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${color.replace(")", " / 0.45)")}, oklch(0.06 0.04 270) 75%)` }} />
      <Starfield count={70} />
      {/* gas wisps */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="absolute h-3 w-28 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${color.replace(")", " / 0.7)")}, transparent)`,
            filter: "blur(3px)",
            left: "50%", top: "50%",
            transformOrigin: "0 50%",
            transform: `rotate(${i * 60}deg)`,
          }}
          animate={{ scaleX: [0.6, 1.5, 0.6], opacity: [0.4, 0.95, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
        <GlowingStar size={260} color={color} />
        <div className="absolute inset-0 grid place-items-center text-5xl drop-shadow-[0_0_18px_rgba(255,255,255,0.9)]">{emoji}</div>
      </motion.div>
      <NovaFloat x={32} y={26} mood="surprised" />
      <_Progress p={p} />
    </div>
  );
}

function S_PlanetParade({ p, color, emoji }: { p: number; color: string; emoji: string }) {
  const planets = [
    { c: "oklch(0.70 0.18 30)",  r: 14, orbit: 140, dur: 8 },
    { c: "oklch(0.78 0.16 90)",  r: 20, orbit: 200, dur: 12 },
    { c: "oklch(0.62 0.18 220)", r: 16, orbit: 260, dur: 16 },
    { c: "oklch(0.75 0.20 320)", r: 12, orbit: 320, dur: 20 },
  ];
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden">
      <ParallaxSpace tint={color.replace(")", " / 0.4)")} />
      {/* Sun */}
      <GlowingStar size={120} color={color} />
      {/* Orbit rings + planets */}
      {planets.map((pl, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full ring-1 ring-white/10"
          style={{ width: pl.orbit * 2, height: pl.orbit * 2 }}
          animate={{ rotate: 360 }}
          transition={{ duration: pl.dur, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: pl.r * 2, height: pl.r * 2,
              left: `calc(50% - ${pl.r}px)`,
              top: `-${pl.r}px`,
              background: `radial-gradient(circle at 35% 35%, white, ${pl.c} 60%, oklch(0.20 0.10 260))`,
              boxShadow: `0 0 12px ${pl.c}`,
            }}
          />
        </motion.div>
      ))}
      <div className="absolute left-6 top-6 text-3xl">{emoji}</div>
      <NovaFloat x={-34} y={-30} mood="excited" />
      <_Progress p={p} />
    </div>
  );
}

function S_AtomLab({ p, color, emoji }: { p: number; color: string; emoji: string }) {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle, ${color.replace(")", " / 0.45)")}, oklch(0.10 0.08 30))` }} />
      {/* incoming atoms */}
      {[
        { fx: -260, fy: -160, d: 0.0 },
        { fx: 260, fy: -160, d: 0.15 },
        { fx: -260, fy: 160, d: 0.3 },
        { fx: 260, fy: 160, d: 0.45 },
      ].map((a, i) => (
        <motion.div
          key={i}
          className="absolute grid h-10 w-10 place-items-center rounded-full bg-sky-400 text-xs font-bold text-white shadow-lg"
          initial={{ x: a.fx, y: a.fy, opacity: 0 }}
          animate={{ x: [a.fx, 0, 0], y: [a.fy, 0, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: a.d, repeat: Infinity, repeatDelay: 1 }}
        >H</motion.div>
      ))}
      <motion.div
        className="absolute h-28 w-28 rounded-full"
        style={{ background: "radial-gradient(circle, white, oklch(0.85 0.20 60), transparent 70%)" }}
        animate={{ scale: [0.2, 2.4, 0.2], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.7 }}
      />
      {[0, 0.4, 0.8].map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full ring-2 ring-amber-300/70"
          style={{ width: 60, height: 60 }}
          animate={{ scale: [0.4, 6], opacity: [0.9, 0] }}
          transition={{ duration: 2.2, delay: d, repeat: Infinity }}
        />
      ))}
      <div className="absolute right-6 top-6 text-3xl">{emoji}</div>
      <NovaFloat x={36} y={-32} mood="surprised" />
      <_Progress p={p} />
    </div>
  );
}

function S_TwinkleSky({ p, color, emoji }: { p: number; color: string; emoji: string }) {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    x: 10 + (i * 67) % 80,
    y: 10 + (i * 41) % 70,
    d: 0.6 + (i % 5) * 0.2,
  }));
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.10 0.08 260), oklch(0.04 0.03 270))" }} />
      <Starfield count={60} />
      {/* big twinklers */}
      {dots.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          animate={{ scale: [0.6, 1.4, 0.6], rotate: [0, 90, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: s.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
        >
          <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_14px_4px_white]" />
        </motion.div>
      ))}
      {/* atmosphere wave line */}
      <motion.div
        className="absolute bottom-[24%] left-0 right-0 h-16"
        style={{ background: `linear-gradient(180deg, transparent, ${color.replace(")", " / 0.35)")})`, filter: "blur(8px)" }}
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute left-6 top-6 text-3xl">{emoji}</div>
      <NovaFloat x={0} y={28} mood="happy" />
      <_Progress p={p} />
    </div>
  );
}

function S_TelescopeIris({ p, color, emoji }: { p: number; color: string; emoji: string }) {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle, oklch(0.20 0.10 260), oklch(0.04 0.03 270))" }} />
      <Starfield count={90} />
      {/* iris */}
      <motion.div
        className="relative grid place-items-center rounded-full"
        style={{ width: 360, height: 360, boxShadow: "0 0 0 9999px oklch(0.04 0.03 270)", border: "4px solid oklch(0.85 0.16 70 / 0.7)" }}
        animate={{ scale: [0.6, 1, 0.95, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div animate={{ scale: [0.8, 1.1, 0.8] }} transition={{ duration: 2.4, repeat: Infinity }}>
          <GlowingStar size={180} color={color} />
        </motion.div>
        {/* crosshairs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/15" />
          <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white/15" />
        </div>
      </motion.div>
      <div className="absolute left-6 top-6 text-3xl">{emoji}</div>
      <NovaFloat x={-34} y={-30} mood="excited" />
      <_Progress p={p} />
    </div>
  );
}

function S_SunRays({ p, color, emoji }: { p: number; color: string; emoji: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.10 0.08 260), oklch(0.05 0.05 270))" }} />
      <Starfield count={60} />
      <div className="absolute left-[12%] top-1/2 -translate-y-1/2">
        <GlowingStar size={220} color={color} />
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="absolute h-1 rounded-full"
          style={{
            left: "20%",
            top: `${36 + i * 5}%`,
            background: `linear-gradient(90deg, ${color.replace(")", " / 0.95)")}, transparent)`,
            filter: "blur(1px)",
          }}
          animate={{ width: ["0%", "60%"], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <motion.div
        className="absolute right-[10%] top-1/2 h-28 w-28 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, oklch(0.75 0.18 220), oklch(0.40 0.18 240) 70%, oklch(0.20 0.10 260))",
          boxShadow: "0 0 40px oklch(0.55 0.20 230 / 0.6)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute left-3 top-6 h-3 w-6 rounded-full bg-emerald-500/80" />
        <div className="absolute right-4 top-12 h-4 w-8 rounded-full bg-emerald-500/80" />
      </motion.div>
      <div className="absolute right-6 top-6 text-3xl">{emoji}</div>
      <NovaFloat x={0} y={-36} mood="happy" />
      <_Progress p={p} />
    </div>
  );
}

function S_ConstellationDraw({ p, color, emoji }: { p: number; color: string; emoji: string }) {
  const pts = [
    [20, 70], [32, 50], [46, 60], [56, 35], [70, 45], [80, 25],
  ] as const;
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.10 0.10 270), oklch(0.05 0.05 260))" }} />
      <Starfield count={80} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {pts.slice(0, -1).map(([x1, y1], i) => {
          const [x2, y2] = pts[i + 1];
          return (
            <motion.line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color} strokeWidth={0.4} strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
            />
          );
        })}
        {pts.map(([x, y], i) => (
          <motion.circle
            key={i} cx={x} cy={y} r={1.1} fill="white"
            animate={{ r: [0.6, 1.6, 0.6], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </svg>
      <div className="absolute left-6 top-6 text-3xl">{emoji}</div>
      <NovaFloat x={-30} y={28} mood="wave" />
      <_Progress p={p} />
    </div>
  );
}

function S_MissionPrompt({ p, color, emoji }: { p: number; color: string; emoji: string }) {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden">
      <ParallaxSpace tint={color.replace(")", " / 0.5)")} />
      {/* portal ring */}
      <motion.div
        className="relative grid place-items-center rounded-full"
        style={{ width: 280, height: 280, border: `4px dashed ${color}`, boxShadow: `0 0 60px ${color.replace(")", " / 0.6)")}` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="text-[110px] drop-shadow-[0_0_30px_rgba(255,220,150,0.8)]"
          animate={{ scale: [1, 1.12, 1], rotate: [-6, 6, -6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >{emoji}</motion.div>
      </motion.div>
      {/* sparkles */}
      {["⭐","✨","💫","🌟","🪐"].map((g, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute text-2xl"
            style={{ left: `calc(50% + ${Math.cos(a) * 200}px)`, top: `calc(50% + ${Math.sin(a) * 200}px)`, transform: "translate(-50%,-50%)" }}
            animate={{ scale: [0.8, 1.3, 0.8], rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
          >{g}</motion.span>
        );
      })}
      <NovaFloat x={0} y={32} mood="wave" size="lg" />
      <_Progress p={p} />
    </div>
  );
}

/* -------- Template picker based on beat content -------- */

type Tpl = (args: { p: number; color: string; emoji: string }) => React.ReactNode;

function pickTemplate(beat: string, index: number, total: number): { tpl: Tpl; fx: CameraFx } {
  const t = beat.toLowerCase();
  // Final beat → mission prompt portal
  if (index === total - 1) return { tpl: S_MissionPrompt, fx: "zoom-in" };
  // Opening beat → fly-through
  if (index === 0) return { tpl: S_FlyThroughGalaxy, fx: "pan-right" };

  if (/(atom|hydrogen|helium|fusion|fuse|particle|crash|collide|energy burst)/.test(t))
    return { tpl: S_AtomLab, fx: "shake" };
  if (/(twinkle|wobble|atmosphere|air|night sky|sparkle)/.test(t))
    return { tpl: S_TwinkleSky, fx: "swirl" };
  if (/(planet|orbit|solar system|moon|earth|mars|jupiter|saturn)/.test(t))
    return { tpl: S_PlanetParade, fx: "pan-left" };
  if (/(telescope|zoom|closer|look|observe|peek|see)/.test(t))
    return { tpl: S_TelescopeIris, fx: "zoom-in" };
  if (/(shine|light|heat|ray|beam|warm|glow)/.test(t))
    return { tpl: S_SunRays, fx: "zoom-out" };
  if (/(constellation|connect|pattern|shape|draw|line)/.test(t))
    return { tpl: S_ConstellationDraw, fx: "pan-right" };
  if (/(galaxy|space|universe|journey|travel|fly|explore)/.test(t))
    return { tpl: S_FlyThroughGalaxy, fx: "pan-right" };
  // default → discovery glow
  return { tpl: S_DiscoveryStar, fx: "zoom-in" };
}

/* ============================================================
   Bespoke cinematic — Mission 1, Level 1 (Meet a Star)
   ============================================================ */

const meetAStar: Cinematic = {
  title: "Meet a Star",
  emoji: "✨",
  color: "oklch(0.86 0.16 85)",
  videoUrl: level1Video,
  videoCaptions: [
    { at: 0.0, text: "Hi Explorer! Today we're going to meet a real star!" },
    { at: 2.5, text: "Let's fly through the galaxy together!" },
    { at: 5.0, text: "Wow — a giant glowing ball of hot gas!" },
    { at: 7.2, text: "Stars send light and warmth all the way to Earth." },
    { at: 9.2, text: "Ready to play? Let's go!" },
  ],
  scenes: [

    {
      narration: "Hi Explorer! Today we're going to meet a real star!",
      durationMs: 5500, cameraFx: "pan-right",
      render: (p) => <S_FlyThroughGalaxy p={p} color="oklch(0.86 0.16 85)" emoji="🚀" />,
    },
    {
      narration: "Stars are giant glowing balls of hot gas!",
      durationMs: 5500, cameraFx: "zoom-in",
      render: (p) => <S_DiscoveryStar p={p} color="oklch(0.88 0.18 85)" emoji="⭐" />,
    },
    {
      narration: "Most stars are made of hydrogen and helium.",
      durationMs: 6000, cameraFx: "swirl",
      render: (p) => <S_TelescopeIris p={p} color="oklch(0.85 0.16 70)" emoji="🔭" />,
    },
    {
      narration: "Deep inside, hydrogen atoms crash together and create energy!",
      durationMs: 6500, cameraFx: "shake",
      render: (p) => <S_AtomLab p={p} color="oklch(0.78 0.22 35)" emoji="💥" />,
    },
    {
      narration: "That energy becomes the light and heat we feel on Earth.",
      durationMs: 6000, cameraFx: "zoom-out",
      render: (p) => <S_SunRays p={p} color="oklch(0.90 0.20 85)" emoji="🌞" />,
    },
    {
      narration: "Can you help me remember what stars are made of? Let's play!",
      durationMs: 5500, cameraFx: "zoom-in",
      render: (p) => <S_MissionPrompt p={p} color="oklch(0.86 0.16 85)" emoji="✨" />,
    },
  ],
};

/* ============================================================
   Default cinematic generator — every level gets a full cartoon
   ============================================================ */

function makeDefaultCinematic(
  title: string,
  emoji: string,
  color: string,
  beats: string[],
): Cinematic {
  // Ensure we have an opener and a mission-prompt closer so the structure
  // matches the required cartoon flow (Opening → Discovery → Explanation →
  // Fun Fact → Mission Setup) even when the source beats are sparse.
  const opener = `Hi Explorer! Let's blast off — today we're exploring ${title}!`;
  const closer = `Ready to play? Let's go, Explorer!`;
  const scripted = [opener, ...beats, closer];

  return {
    title, emoji, color,
    scenes: scripted.map((narration, i) => {
      const { tpl, fx } = pickTemplate(narration, i, scripted.length);
      const Tpl = tpl;
      return {
        narration,
        // Fast cartoon pacing — short beats, no awkward gaps
        durationMs: Math.min(7000, Math.max(4800, narration.length * 60)),
        cameraFx: fx,
        render: (p) => <Tpl p={p} color={color} emoji={emoji} />,
      };
    }),
  };
}

/* tiny per-scene progress micro-indicator (bottom edge, subtle) */
function _Progress({ p }: { p: number }) {
  return (
    <div className="pointer-events-none absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-white/5">
      <div className="h-full rounded-full bg-white/40" style={{ width: `${p * 100}%` }} />
    </div>
  );
}

/* ============================================================
   Registry + lookup
   ============================================================ */

const hydrogenHelium: Cinematic = {
  title: "Hydrogen + Helium",
  emoji: "🧪",
  color: "oklch(0.80 0.18 60)",
  videoUrl: level2Video,
  videoCaptions: [
    { at: 0.0, text: "Whoa! Look inside a star with me!" },
    { at: 3.0, text: "Tiny atoms zoom around super fast in here!" },
    { at: 6.5, text: "This little blue one is hydrogen — the smallest atom!" },
    { at: 10.0, text: "Watch — four hydrogens squish together…" },
    { at: 13.5, text: "…and POP! They make one helium atom!" },
    { at: 17.0, text: "Now you try it in the game!" },
  ],
  scenes: [],
};

const nuclearFusion: Cinematic = {
  title: "Nuclear Fusion",
  emoji: "💥",
  color: "oklch(0.78 0.22 35)",
  videoUrl: level3Video,
  videoCaptions: [
    { at: 0.0, text: "Squishing atoms together is called fusion!" },
    { at: 3.5, text: "It needs HUGE pressure — only a star's core has enough." },
    { at: 7.5, text: "Watch — SMASH! A burst of energy is born!" },
    { at: 11.0, text: "Gas gathers… the core heats up…" },
    { at: 14.0, text: "Atoms fuse… and sparkly energy bursts out!" },
    { at: 17.5, text: "Can you put the steps in order? Let's play!" },
  ],
  scenes: [],
};

const howStarsShine: Cinematic = {
  title: "How Stars Shine",
  emoji: "🌟",
  color: "oklch(0.88 0.14 95)",
  videoUrl: level4Video,
  videoCaptions: [
    { at: 0.0, text: "All that fusion energy turns into light and heat!" },
    { at: 3.5, text: "Watch it bounce around inside the star…" },
    { at: 7.0, text: "It takes a long, long time to escape!" },
    { at: 10.5, text: "Finally — whoosh! It zooms out into space!" },
    { at: 14.0, text: "And reaches all the way to Earth!" },
    { at: 17.5, text: "Let's sort what really comes from stars!" },
  ],
  scenes: [],
};

const starFinale: Cinematic = {
  title: "Star Finale",
  emoji: "🏆",
  color: "oklch(0.85 0.18 80)",
  videoUrl: level5Video,
  videoCaptions: [
    { at: 0.0, text: "You did it, Explorer! Look how far we've come!" },
    { at: 3.5, text: "Stars are giant balls of hydrogen and helium gas." },
    { at: 7.0, text: "They shine because of fusion deep in their core." },
    { at: 10.5, text: "Their light travels across space to twinkle for us!" },
    { at: 14.0, text: "You earned your very first star badge!" },
    { at: 17.5, text: "One last BIG challenge — tap every TRUE fact!" },
  ],
  scenes: [],
};

const theTwinkle: Cinematic = {
  title: "The Twinkle",
  emoji: "✨",
  color: "oklch(0.85 0.14 220)",
  videoUrl: m2level1Video,
  videoCaptions: [
    { at: 0.0, text: "Look up at night — those stars are wiggling!" },
    { at: 3.5, text: "But the stars themselves are perfectly still." },
    { at: 7.0, text: "Something between you and the stars makes them dance." },
    { at: 11.0, text: "Can you guess what it is? It's the air!" },
    { at: 15.0, text: "Earth's atmosphere bends the starlight as it passes through." },
    { at: 18.0, text: "Let's pick the right answer together!" },
  ],
  scenes: [],
};

const atmospherePath: Cinematic = {
  title: "The Light's Journey",
  emoji: "🌬️",
  color: "oklch(0.78 0.16 210)",
  videoUrl: m2level2Video,
  videoCaptions: [
    { at: 0.0, text: "Light from a star travels for years through empty space." },
    { at: 4.0, text: "Then it hits Earth's air — and bumps into wobbling pockets." },
    { at: 8.0, text: "Those wobbles bend the light a tiny bit, again and again." },
    { at: 12.0, text: "Star… space… atmosphere… your eye!" },
    { at: 16.0, text: "That's the whole journey of starlight." },
    { at: 18.5, text: "Put the steps in order to play!" },
  ],
  scenes: [],
};

const twinkleOrNot: Cinematic = {
  title: "Twinkle or Steady?",
  emoji: "🔭",
  color: "oklch(0.82 0.16 200)",
  videoUrl: m2level3Video,
  videoCaptions: [
    { at: 0.0, text: "Not everything in the sky twinkles!" },
    { at: 3.5, text: "Tiny points of light wobble — bigger disks stay calm." },
    { at: 7.5, text: "Planets are disks of light, so the wobbles average out." },
    { at: 12.0, text: "Stars twinkle. Planets and the Moon stay steady." },
    { at: 16.0, text: "Help me sort which is which!" },
    { at: 18.5, text: "Drop each one into the right bucket." },
  ],
  scenes: [],
};

const colorTwinkle: Cinematic = {
  title: "Twinkle Colors",
  emoji: "🌈",
  color: "oklch(0.84 0.18 320)",
  videoUrl: m2level4Video,
  videoCaptions: [
    { at: 0.0, text: "Sometimes stars twinkle in different colors!" },
    { at: 3.5, text: "Air bends each color a tiny bit differently." },
    { at: 7.0, text: "Sirius — the brightest star — flashes red, blue, and white!" },
    { at: 11.0, text: "Air pockets bend the light. Atmosphere makes the twinkle." },
    { at: 15.0, text: "In space, there's no twinkle at all." },
    { at: 18.0, text: "Match each idea to its partner!" },
  ],
  scenes: [],
};

const twinkleFinale: Cinematic = {
  title: "Twinkle Finale",
  emoji: "🏆",
  color: "oklch(0.85 0.18 240)",
  videoUrl: m2level5Video,
  videoCaptions: [
    { at: 0.0, text: "You're a real Twinkle Tracker now!" },
    { at: 3.5, text: "Atmosphere bends starlight — that's why stars dance." },
    { at: 7.0, text: "Planets look steadier than stars." },
    { at: 10.5, text: "Astronauts in space see no twinkle at all!" },
    { at: 14.0, text: "You earned the Twinkle Tracker badge!" },
    { at: 17.5, text: "One last challenge — tap every TRUE fact!" },
  ],
  scenes: [],
};

const registry: Record<string, Cinematic> = {
  "what-is-a-star:meet-a-star": meetAStar,
  "what-is-a-star:hydrogen-helium": hydrogenHelium,
  "what-is-a-star:nuclear-fusion": nuclearFusion,
  "what-is-a-star:how-stars-shine": howStarsShine,
  "what-is-a-star:star-finale": starFinale,
  "twinkle:the-twinkle": theTwinkle,
  "twinkle:atmosphere-path": atmospherePath,
  "twinkle:twinkle-or-not": twinkleOrNot,
  "twinkle:color-twinkle": colorTwinkle,
  "twinkle:twinkle-finale": twinkleFinale,
};

export function getCinematic(
  missionId: string,
  level: { id: string; name: string; emoji: string; color: string; storyBeats: string[] },
): Cinematic {
  const key = `${missionId}:${level.id}`;
  return (
    registry[key] ??
    makeDefaultCinematic(level.name, level.emoji, level.color, level.storyBeats)
  );
}
