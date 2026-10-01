import { useCallback, useEffect, useRef, useState } from "react";

/** Frame-rate independent easing; event handlers always accumulate against the target. */
export function useExplorerTravel(max: number, reduced: boolean, initial = 0) {
  const [value, setValue] = useState(initial);
  const current = useRef(initial);
  const target = useRef(initial);
  const frame = useRef(0);
  const previous = useRef(0);
  const go = useCallback(
    (next: number | ((v: number) => number)) => {
      target.current = Math.max(
        0,
        Math.min(max, typeof next === "function" ? next(target.current) : next),
      );
      cancelAnimationFrame(frame.current);
      if (reduced) {
        current.current = target.current;
        setValue(current.current);
        return;
      }
      previous.current = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(64, now - previous.current);
        previous.current = now;
        current.current += (target.current - current.current) * (1 - Math.exp(-dt / 115));
        if (Math.abs(target.current - current.current) < 0.0005) current.current = target.current;
        setValue(current.current);
        if (current.current !== target.current) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [max, reduced],
  );
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  return [value, go] as const;
}
