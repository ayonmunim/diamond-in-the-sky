/** These are navigation puzzles, not physical rules about fusion or gas ratios. */
export const cloudOrder = [0, 2, 1, 3];
export const coreOrder = [2, 0, 3, 1];
export const signalColors = ["#79d8ff", "#ffd47d", "#cc9dff", "#97efc1"];
export function nextThinkingTarget(level: number, count: number, light: boolean) {
  if (light) return count;
  if (level === 1 || level === 5) return cloudOrder[count];
  if (level === 3) return coreOrder[count];
  return null;
}
export function acceptsThinkingTarget(
  level: number,
  collected: number[],
  id: number,
  light: boolean,
) {
  if (collected.includes(id)) return false;
  const target = nextThinkingTarget(level, collected.length, light);
  if (target !== null) return id === target;
  // Mostly hydrogen with some helium. A game pattern, not an abundance measurement.
  return (id % 4 === 2) === (collected.length % 4 === 3);
}
