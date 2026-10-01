/**
 * Live SVG preview of a spaceship with swappable parts.
 */
import { motion } from "framer-motion";
import { shipPartById } from "@/data/shipParts";

export function ShipPreview({
  equipped,
  size = 260,
}: {
  equipped: { hull: string; engine: string; wings: string; trail: string };
  size?: number;
}) {
  const hull = shipPartById(equipped.hull);
  const engine = shipPartById(equipped.engine);
  const wings = shipPartById(equipped.wings);
  const trail = shipPartById(equipped.trail);

  return (
    <svg viewBox="0 0 280 200" width={size} height={(size * 200) / 280}>
      <defs>
        <linearGradient id="ship-hull" x1="0" x2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor={hull?.color ?? "white"} />
        </linearGradient>
      </defs>

      {/* trail */}
      {trail && (
        <motion.g
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <ellipse cx="40" cy="100" rx="35" ry="6" fill={trail.color} opacity="0.5" />
          <ellipse cx="20" cy="100" rx="20" ry="3" fill={trail.color} opacity="0.3" />
        </motion.g>
      )}

      {/* wings */}
      {wings && (
        <>
          <path d="M 130 80 L 100 50 L 170 70 Z" fill={wings.color} stroke="oklch(0 0 0 / 0.3)" strokeWidth="1.5" />
          <path d="M 130 120 L 100 150 L 170 130 Z" fill={wings.color} stroke="oklch(0 0 0 / 0.3)" strokeWidth="1.5" />
        </>
      )}

      {/* hull body */}
      <path
        d="M 80 100 Q 90 60 200 70 Q 240 80 250 100 Q 240 120 200 130 Q 90 140 80 100 Z"
        fill="url(#ship-hull)"
        stroke="oklch(0 0 0 / 0.3)"
        strokeWidth="1.5"
      />
      {/* cockpit */}
      <ellipse cx="200" cy="100" rx="22" ry="14" fill="oklch(0.78 0.18 230 / 0.7)" stroke="oklch(0 0 0 / 0.3)" strokeWidth="1.2" />
      <ellipse cx="198" cy="96" rx="10" ry="5" fill="white" opacity="0.5" />

      {/* engine flame */}
      {engine && (
        <motion.g
          animate={{ scaleX: [1, 1.2, 1] }}
          transition={{ duration: 0.25, repeat: Infinity }}
          style={{ transformOrigin: "80px 100px" }}
        >
          <ellipse cx="70" cy="100" rx="18" ry="9" fill={engine.color} />
          <ellipse cx="62" cy="100" rx="10" ry="5" fill="white" opacity="0.7" />
        </motion.g>
      )}
    </svg>
  );
}
