import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useSfx } from "@/lib/audio";

type Tint = "aurora" | "gold" | "pink" | "cyan" | "violet";

const TINTS: Record<Tint, { from: string; to: string; ring: string; glow: string }> = {
  aurora: {
    from: "oklch(0.74 0.22 305)",
    to: "oklch(0.55 0.22 260)",
    ring: "oklch(0.92 0.16 310 / 0.7)",
    glow: "oklch(0.74 0.22 305 / 0.55)",
  },
  gold: {
    from: "oklch(0.92 0.14 95)",
    to: "oklch(0.70 0.20 55)",
    ring: "oklch(0.95 0.15 90 / 0.8)",
    glow: "oklch(0.85 0.18 80 / 0.55)",
  },
  pink: {
    from: "oklch(0.85 0.18 350)",
    to: "oklch(0.55 0.22 320)",
    ring: "oklch(0.92 0.14 350 / 0.7)",
    glow: "oklch(0.78 0.18 350 / 0.55)",
  },
  cyan: {
    from: "oklch(0.86 0.14 195)",
    to: "oklch(0.50 0.18 230)",
    ring: "oklch(0.92 0.12 195 / 0.7)",
    glow: "oklch(0.78 0.16 195 / 0.55)",
  },
  violet: {
    from: "oklch(0.78 0.18 285)",
    to: "oklch(0.40 0.20 275)",
    ring: "oklch(0.92 0.14 285 / 0.7)",
    glow: "oklch(0.65 0.22 280 / 0.55)",
  },
};

export interface PortalButtonProps {
  to?: string;
  onClick?: () => void;
  icon?: ReactNode;
  label: string;
  sub?: string;
  tint?: Tint;
  size?: number; // px
  delay?: number;
  locked?: boolean;
  glow?: boolean;
}

/** Big round planet-style button. Bounces idle, pops on hover. */
export function PortalButton({
  to,
  onClick,
  icon,
  label,
  sub,
  tint = "aurora",
  size = 132,
  delay = 0,
  locked = false,
  glow = true,
}: PortalButtonProps) {
  const sfx = useSfx();
  const t = TINTS[tint];
  const handleClick = () => { sfx("click"); onClick?.(); };

  const inner = (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 18, delay },
        opacity: { duration: 0.4, delay },
        y: { repeat: Infinity, duration: 3 + delay, ease: "easeInOut", delay: delay + 0.5 },
      }}
      whileHover={{ scale: locked ? 1 : 1.08 }}
      whileTap={{ scale: locked ? 1 : 0.92 }}
      className="group relative flex flex-col items-center"
      style={{ width: size }}
    >
      <div
        className="relative grid place-items-center rounded-full"
        style={{
          width: size,
          height: size,
          background: locked
            ? "radial-gradient(circle at 30% 30%, oklch(0.45 0.04 270), oklch(0.18 0.04 270))"
            : `radial-gradient(circle at 32% 28%, oklch(0.99 0.04 95 / 0.95), ${t.from} 35%, ${t.to} 95%)`,
          boxShadow: locked
            ? "inset -10px -14px 24px oklch(0.05 0.02 270 / 0.7)"
            : `0 0 60px ${t.glow}, inset -10px -14px 26px oklch(0.05 0.02 270 / 0.55), inset 6px 8px 16px oklch(1 0 0 / 0.18)`,
          border: `2px solid ${locked ? "oklch(1 0 0 / 0.1)" : t.ring}`,
          opacity: locked ? 0.55 : 1,
        }}
      >
        {/* rotating sparkle ring */}
        {glow && !locked && (
          <span
            className="pointer-events-none absolute inset-[-10px] rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, ${t.ring} 50deg, transparent 90deg, transparent 270deg, ${t.ring} 320deg, transparent 360deg)`,
              maskImage: "radial-gradient(circle, transparent 58%, black 60%, black 70%, transparent 72%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 58%, black 60%, black 70%, transparent 72%)",
              animation: "ring-rotate 14s linear infinite",
              opacity: 0.6,
            }}
            aria-hidden
          />
        )}
        <div className="relative grid place-items-center text-white drop-shadow-[0_2px_6px_oklch(0.05_0.02_270/0.6)]" style={{ fontSize: size * 0.36 }}>
          {locked ? "🔒" : icon}
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="font-display text-base font-semibold text-white drop-shadow-[0_2px_6px_oklch(0.05_0.02_270/0.7)] sm:text-lg">
          {label}
        </div>
        {sub && <div className="mt-0.5 text-[11px] text-white/70">{sub}</div>}
      </div>
    </motion.div>
  );

  if (locked) return inner;
  if (to) {
    return (
      <Link to={to} onClick={handleClick} className="focus:outline-none">
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={handleClick} className="focus:outline-none">
      {inner}
    </button>
  );
}
