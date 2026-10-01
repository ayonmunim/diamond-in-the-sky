import { useMemo } from "react";
import { seededRandom } from "@/lib/rand";

export function StarField({ density = 80, showPlanets = true }: { density?: number; showPlanets?: boolean }) {
  const stars = useMemo(
    () => {
      const rnd = seededRandom(density * 7919 + 13);
      return Array.from({ length: density }, (_, i) => ({
        id: i,
        x: rnd() * 100,
        y: rnd() * 100,
        size: rnd() * 2.2 + 0.5,
        delay: rnd() * 4,
        duration: 2 + rnd() * 4,
        opacity: 0.4 + rnd() * 0.6,
      }));
    },
    [density]
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* nebula glow */}
      <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.25 310 / 0.6), transparent 70%)" }} />
      <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.22 230 / 0.6), transparent 70%)" }} />

      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: s.size > 1.5 ? "0 0 6px oklch(0.95 0.05 90 / 0.8)" : undefined,
          }}
        />
      ))}

      {showPlanets && (
        <>
          <div className="absolute left-[8%] top-[18%] h-16 w-16 rounded-full animate-float-slow opacity-70"
            style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.85 0.14 85), oklch(0.45 0.18 40))",
              boxShadow: "0 0 40px oklch(0.85 0.14 85 / 0.4)" }} />
          <div className="absolute right-[10%] top-[60%] h-10 w-10 rounded-full animate-float-slow opacity-60"
            style={{ animationDelay: "2s", background: "radial-gradient(circle at 30% 30%, oklch(0.75 0.18 220), oklch(0.30 0.15 260))",
              boxShadow: "0 0 30px oklch(0.65 0.20 240 / 0.5)" }} />
        </>
      )}
    </div>
  );
}
