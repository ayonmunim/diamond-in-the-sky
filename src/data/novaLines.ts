/**
 * Nova's cheerful, context-aware lines. Keep them short, kid-friendly,
 * and encouraging — Nova is a baby star, an enthusiastic best friend.
 */
export const novaLines = {
  greet: [
    "Hello Explorer!",
    "Hi there, stargazer!",
    "Ready for another adventure?",
  ],
  tap: [
    "Tee-hee! That tickles!",
    "Hee hee, again!",
    "I love sparkles!",
  ],
  doubleTap: [
    "Whoaaa — spinning star!",
    "Wheeee!",
  ],
  hold: [
    "Need a hint? Try tapping the brightest star!",
    "Tip: every star has a temperature. Color tells you which!",
    "Don't worry — explorers learn by trying!",
  ],
  hover: [
    "Pst — pick me!",
    "Pick a mission!",
  ],
  encourage: [
    "You can do it!",
    "Keep going, Explorer!",
    "Almost there!",
  ],
  celebrate: [
    "Wow! Great job!",
    "Stellar work, Explorer!",
    "Amazing! Let's unlock the next adventure!",
    "You did it!",
  ],
  fail: [
    "Oh no — let's try again together!",
    "Almost! One more try!",
  ],
  home: [
    "Where shall we go today?",
    "Pick an adventure, Explorer!",
  ],
  story: ["Can you help me solve this mystery?"],
  learn: ["Let's discover more stars!"],
  play: ["Time to play! Pick a mission!"],
  collection: ["Look at everything you've collected!"],
};

export type NovaMood =
  | "happy"
  | "excited"
  | "sleepy"
  | "sad"
  | "surprised"
  | "dance"
  | "wave";

export function pickLine(bucket: keyof typeof novaLines): string {
  const arr = novaLines[bucket];
  return arr[Math.floor(Math.random() * arr.length)];
}
