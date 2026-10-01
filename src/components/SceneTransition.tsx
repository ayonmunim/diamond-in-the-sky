import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Wrap a scene to give it a portal-zoom entrance. */
export function SceneTransition({ children, mode = "portal" }: { children: ReactNode; mode?: "portal" | "fade" }) {
  if (mode === "fade") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="contents"
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      className="contents"
    >
      {children}
    </motion.div>
  );
}
