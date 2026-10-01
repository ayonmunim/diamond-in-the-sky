/**
 * Nova's narration. Voice is cheerful, curious, age 8-14 friendly.
 */
export const introScript = [
  "Hello Explorer! I'm Nova — a baby star who loves adventures.",
  "Long ago, people looked up and saw thousands of shining diamonds above them.",
  "Every star had a story. Every constellation guided explorers across oceans and deserts.",
  "Today, you will begin your own journey among the stars. Are you ready?",
];

export type ChapterScript = {
  id: string;
  number: number;
  title: string;
  emoji: string;
  badgeId: string;
  reward: { stars: number; coins: number; xp: number };
  intro: string[];   // narration lines before mission
  outro: string;     // celebration line
  mission: string;
  objective: string;
  sourceIds: string[];
};

export const chapters: ChapterScript[] = [
  {
    id: "lost-constellation",
    number: 1,
    title: "The Lost Constellation",
    emoji: "🌟",
    badgeId: "constellation-explorer",
    reward: { stars: 10, coins: 20, xp: 50 },
    sourceIds: ["starchild_stars"],
    intro: [
      "Look! A constellation has gone missing from the night sky.",
      "Can you help me find it? Tap each star in order to draw the pattern.",
    ],
    outro: "Wow! You found it! The sky shines brighter because of you.",
    mission: "Connect the stars in the correct order to redraw the constellation.",
    objective: "Learn that constellations are patterns of stars connected by people.",
  },
  {
    id: "mystery-of-brightness",
    number: 2,
    title: "The Mystery of Brightness",
    emoji: "🔭",
    badgeId: "stellar-scientist",
    reward: { stars: 12, coins: 25, xp: 60 },
    sourceIds: ["starchild_cepheids", "imagine_timing"],
    intro: [
      "Every star has its own secret — its mass, temperature, and distance from us.",
      "Try the controls and watch how your star changes. Can you make it shine brighter?",
    ],
    outro: "Brilliant! You discovered how stars get their glow.",
    mission: "Adjust mass, temperature, and distance until the star matches the target.",
    objective: "Understand how a star's true brightness and its distance shape what we see.",
  },
  {
    id: "create-your-own-star",
    number: 3,
    title: "Create Your Own Star",
    emoji: "✨",
    badgeId: "star-creator",
    reward: { stars: 15, coins: 30, xp: 70 },
    sourceIds: ["starchild_stars"],
    intro: [
      "Now it's your turn to be a star-maker.",
      "Choose its size, color, and spin — then give it a name worthy of the cosmos.",
    ],
    outro: "Amazing! Your star will live forever in the explorer's logbook.",
    mission: "Design a star and save it to your profile.",
    objective: "Connect physical properties (mass, temperature) to a star's appearance.",
  },
  {
    id: "dancing-stars",
    number: 4,
    title: "The Dancing Stars",
    emoji: "💫",
    badgeId: "motion-explorer",
    reward: { stars: 12, coins: 25, xp: 60 },
    sourceIds: ["gcvs", "tess"],
    intro: [
      "Stars look still — but they are always moving.",
      "Press play and watch the secret dance hidden in the night sky!",
    ],
    outro: "You saw what the naked eye never can. Beautiful!",
    mission: "Run time forward and observe how stars drift across the sky.",
    objective: "Discover proper motion and that the sky changes over long timescales.",
  },
  {
    id: "time-traveler",
    number: 5,
    title: "Time Traveler",
    emoji: "🕰️",
    badgeId: "galaxy-historian",
    reward: { stars: 14, coins: 28, xp: 65 },
    sourceIds: ["gcvs"],
    intro: [
      "What will the sky look like in 1,000 years?",
      "Travel forward in time and see the constellations rearrange themselves.",
    ],
    outro: "You have walked through deep time itself. Galaxy historian!",
    mission: "Step through time and see the constellations slowly transform.",
    objective: "Build intuition for how slow-but-constant motion reshapes the sky.",
  },
  {
    id: "build-your-constellation",
    number: 6,
    title: "Build Your Own Constellation",
    emoji: "🎨",
    badgeId: "sky-storyteller",
    reward: { stars: 15, coins: 35, xp: 80 },
    sourceIds: ["starchild_stars"],
    intro: [
      "Every culture in history has drawn pictures in the stars.",
      "Now create yours. Place the stars, connect them, name your story.",
    ],
    outro: "Your constellation is alive in the sky. Sky storyteller!",
    mission: "Place stars on the canvas, connect them, name and save your creation.",
    objective: "Express creativity and ownership of the night sky.",
  },
];
