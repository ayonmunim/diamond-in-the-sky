export type Badge = {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  source?: "story" | "play" | "learn" | "system";
};

export const allBadges: Badge[] = [
  { id: "first-light",            name: "First Light",            emoji: "🌠", desc: "Started your journey",                source: "system" },
  { id: "stargazer",              name: "Stargazer",              emoji: "👁️", desc: "Found the twinkling star",            source: "play" },
  { id: "pathfinder",             name: "Pathfinder",             emoji: "🧭", desc: "Connected your first constellation",  source: "play" },
  { id: "spectrum",               name: "Spectrum Master",        emoji: "🌈", desc: "Mastered star colors",                source: "play" },
  { id: "scholar",                name: "Sky Scholar",            emoji: "📚", desc: "Completed all lessons",               source: "learn" },
  { id: "creator",                name: "Sky Creator",            emoji: "🎨", desc: "Created your own constellation",      source: "play" },
  { id: "constellation-explorer", name: "Constellation Explorer", emoji: "🌟", desc: "Finished Chapter 1",                  source: "story" },
  { id: "stellar-scientist",      name: "Stellar Scientist",      emoji: "🔬", desc: "Finished Chapter 2",                  source: "story" },
  { id: "star-creator",           name: "Star Creator",           emoji: "✨", desc: "Finished Chapter 3",                  source: "story" },
  { id: "motion-explorer",        name: "Motion Explorer",        emoji: "💫", desc: "Finished Chapter 4",                  source: "story" },
  { id: "galaxy-historian",       name: "Galaxy Historian",       emoji: "🕰️", desc: "Finished Chapter 5",                  source: "story" },
  { id: "sky-storyteller",        name: "Sky Storyteller",        emoji: "📖", desc: "Finished Chapter 6",                  source: "story" },
  // Lesson movie badges
  { id: "star-knowledge",         name: "Star Knowledge",         emoji: "⭐", desc: "Watched: What is a Star?",            source: "learn" },
  { id: "twinkle-explorer",       name: "Twinkle Explorer",       emoji: "✨", desc: "Watched: Why Stars Twinkle",          source: "learn" },
  { id: "constellation-watcher",  name: "Constellation Watcher",  emoji: "🌌", desc: "Watched: Constellations",             source: "learn" },
  { id: "color-master",           name: "Color Master",           emoji: "🎨", desc: "Watched: Star Colors",                source: "learn" },
  { id: "brightness-explorer",    name: "Brightness Explorer",    emoji: "🔭", desc: "Watched: Distance & Brightness",      source: "learn" },
  { id: "solar-scientist",        name: "Solar Scientist",        emoji: "☀️", desc: "Watched: The Sun is a Star",          source: "learn" },
  { id: "variable-star-explorer", name: "Variable Star Explorer", emoji: "💡", desc: "Watched: Variable Stars",             source: "learn" },
  { id: "classification-master",  name: "Classification Master",  emoji: "🔤", desc: "Watched: Star Classes OBAFGKM",       source: "learn" },
];
