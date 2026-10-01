import { useMemo } from "react";
import { seededRandom } from "@/lib/rand";

type Variant = "deep" | "nebula" | "dawn" | "warp";

/**
 * Full-screen cinematic space background.
 * Multi-layer twinkling stars + drifting nebula blobs + slow-rotating planets.
 * Cheap CSS-only (no canvas) — 60fps friendly on mobile.
 */
export function SpaceScene({
  density = 160,
  variant = "deep",
  showPlanets = true,
  className = "",
}: { density?: number; variant?: Variant; showPlanets?: boolean; className?: string }) {
  const layers = useMemo(
    () => {
      const rnd = seededRandom(density * 2654435761 + 101);
      return [0.5, 1, 1.6].map((scale, layerIdx) =>
        Array.from({ length: Math.round(density / 2) }, (_, i) => ({
          id: `${layerIdx}-${i}`,
          x: rnd() * 100,
          y: rnd() * 100,
          size: (rnd() * 1.6 + 0.5) * scale,
          delay: rnd() * 5,
          duration: 2 + rnd() * 5,
          opacity: 0.4 + rnd() * 0.55,
        })),
      );
    },
    [density],
  );

  const palette =
    variant === "nebula"
      ? ["oklch(0.65 0.26 320 / 0.55)", "oklch(0.60 0.22 280 / 0.45)"]
      : variant === "dawn"
      ? ["oklch(0.82 0.18 30 / 0.45)", "oklch(0.70 0.22 320 / 0.4)"]
      : variant === "warp"
      ? ["oklch(0.72 0.22 240 / 0.55)", "oklch(0.50 0.22 280 / 0.45)"]
      : ["oklch(0.55 0.25 310 / 0.55)", "oklch(0.55 0.22 230 / 0.45)"];

  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`} aria-hidden>
      {/* base gradient already on body; add aurora veils */}
      <div
        className="absolute -top-32 left-[12%] h-[680px] w-[680px] rounded-full blur-3xl animate-float-deep"
        style={{ background: `radial-gradient(circle, ${palette[0]}, transparent 70%)` }}
      />
      <div
        className="absolute top-[40%] -right-32 h-[560px] w-[560px] rounded-full blur-3xl animate-float-slow"
        style={{ background: `radial-gradient(circle, ${palette[1]}, transparent 70%)`, animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-[-12%] left-[35%] h-[460px] w-[460px] rounded-full blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.18 350 / 0.35), transparent 70%)", animationDelay: "4s" }}
      />

      {layers.map((layer, li) => (
        <div key={li} className="absolute inset-0" style={{ transform: `translateZ(0)` }}>
          {layer.map((s) => (
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
                boxShadow: s.size > 1.5 ? "0 0 6px oklch(0.95 0.05 90 / 0.9)" : undefined,
              }}
            />
          ))}
        </div>
      ))}

      {showPlanets && (
        <>
          <div
            className="absolute left-[6%] top-[16%] h-20 w-20 rounded-full animate-float-deep opacity-80"
            style={{
              background: "radial-gradient(circle at 30% 30%, oklch(0.92 0.14 90), oklch(0.45 0.18 40))",
              boxShadow: "0 0 50px oklch(0.85 0.14 85 / 0.5), inset -8px -10px 20px oklch(0.20 0.10 30 / 0.6)",
            }}
          />
          <div
            className="absolute right-[8%] top-[58%] h-14 w-14 rounded-full animate-float-slow opacity-80"
            style={{
              animationDelay: "2.5s",
              background: "radial-gradient(circle at 30% 30%, oklch(0.82 0.16 220), oklch(0.30 0.18 260))",
              boxShadow: "0 0 40px oklch(0.65 0.22 240 / 0.55), inset -6px -8px 16px oklch(0.10 0.08 270 / 0.6)",
            }}
          />
          <div
            className="absolute left-[78%] top-[22%] h-10 w-10 rounded-full animate-float-deep opacity-85"
            style={{
              animationDelay: "1.2s",
              background: "radial-gradient(circle at 30% 30%, oklch(0.82 0.14 195), oklch(0.40 0.16 220))",
              boxShadow: "0 0 30px oklch(0.82 0.14 195 / 0.5)",
            }}
          />
          {/* shooting star */}
          <span
            className="absolute h-[2px] w-32 rounded-full opacity-0"
            style={{
              top: "12%",
              background: "linear-gradient(90deg, transparent, white, transparent)",
              animation: "drift-x 9s linear infinite",
              animationDelay: "5s",
              opacity: 0.85,
            }}
          />
        </>
      )}
    </div>
  );
}
