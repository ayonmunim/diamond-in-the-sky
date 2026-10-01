export type Lesson = {
  id: string;
  title: string;
  emoji: string;
  intro: string;
  body: string;
  fact: string;
  sourceId?: string;
  quiz: { question: string; options: string[]; answer: number; explain: string };
};

export const lessons: Lesson[] = [
  {
    id: "what-is-a-star",
    title: "What is a Star?",
    emoji: "⭐",
    intro: "Stars are giant glowing balls of hot gas — mostly hydrogen and helium — held together by their own gravity.",
    body: "Deep inside every star, hydrogen atoms crash together and turn into helium. This process is called nuclear fusion, and it releases enormous amounts of light and heat. That's why stars shine for billions of years.",
    sourceId: "starchild_stars",
    fact: "Our Sun fuses 600 million tons of hydrogen every second!",
    quiz: {
      question: "What are stars mostly made of?",
      options: ["Rock and ice", "Hydrogen and helium", "Water", "Iron"],
      answer: 1,
      explain: "Stars are huge balls of hydrogen and helium gas.",
    },
  },
  {
    id: "why-twinkle",
    title: "Why Do Stars Twinkle?",
    emoji: "✨",
    intro: "Stars don't actually twinkle in space — they twinkle because of Earth's atmosphere.",
    body: "Light from a star travels trillions of kilometers in a straight line, but when it enters our atmosphere, it bends through layers of moving air. This bending makes the starlight wobble and appear to flicker.",
    sourceId: "starchild_stars",
    fact: "Astronauts in space see stars as steady points of light — no twinkle!",
    quiz: {
      question: "Why do stars appear to twinkle?",
      options: ["They blink on and off", "Earth's atmosphere bends their light", "They are moving fast", "Clouds cover them"],
      answer: 1,
      explain: "Moving air in our atmosphere bends starlight, making it shimmer.",
    },
  },
  {
    id: "constellations",
    title: "What Are Constellations?",
    emoji: "🌌",
    intro: "Constellations are patterns of stars that ancient people connected to tell stories and find directions.",
    body: "There are 88 official constellations recognized today. Sailors used them to navigate the oceans, farmers used them to track seasons, and storytellers used them to share legends across generations.",
    sourceId: "starchild_stars",
    fact: "Orion the Hunter is visible from almost everywhere on Earth.",
    quiz: {
      question: "How many official constellations are there?",
      options: ["12", "50", "88", "200"],
      answer: 2,
      explain: "The International Astronomical Union recognizes 88 constellations.",
    },
  },
  {
    id: "star-colors",
    title: "Star Colors & Temperature",
    emoji: "🎨",
    intro: "A star's color tells us how hot it is. Red stars are coolest, blue stars are hottest.",
    body: "Red stars burn around 3,000°C. Yellow stars like our Sun shine at about 5,500°C. Blue stars are scorching hot — over 25,000°C! Color is one of the first clues astronomers use to study a star.",
    sourceId: "imagine_timing",
    fact: "Our Sun is a yellow dwarf star — perfectly medium-hot.",
    quiz: {
      question: "Which color star is the hottest?",
      options: ["Red", "Yellow", "White", "Blue"],
      answer: 3,
      explain: "Blue stars are the hottest, burning above 25,000°C.",
    },
  },
  {
    id: "distance-brightness",
    title: "Distance & Brightness",
    emoji: "🔭",
    intro: "A bright star isn't always close — and a faint star isn't always far away.",
    body: "Two things decide how bright a star looks from Earth: how much light it gives off, and how far away it is. A small nearby star can outshine a giant one far across the galaxy.",
    sourceId: "starchild_stars",
    fact: "The nearest star to the Sun, Proxima Centauri, is 4.24 light-years away.",
    quiz: {
      question: "Why do some stars look brighter than others?",
      options: ["Only their size", "Their distance and their true brightness", "The time of day", "Their color"],
      answer: 1,
      explain: "Brightness we see depends on both real brightness and distance.",
    },
  },
  {
    id: "the-sun",
    title: "The Sun is a Star",
    emoji: "☀️",
    intro: "Our Sun is the closest star to Earth — about 150 million kilometers away.",
    body: "Without the Sun, life on Earth couldn't exist. It gives us light, warmth, and energy. The Sun is 4.6 billion years old and will keep shining for another 5 billion years.",
    sourceId: "starchild_stars",
    fact: "1.3 million Earths could fit inside the Sun!",
    quiz: {
      question: "How old is the Sun?",
      options: ["1,000 years", "1 million years", "4.6 billion years", "100 billion years"],
      answer: 2,
      explain: "The Sun formed about 4.6 billion years ago.",
    },
  },
  {
    id: "variable-stars",
    title: "Variable Stars",
    emoji: "💡",
    intro: "Some stars change brightness over hours, days, or years — they are called variable stars.",
    body: "Cepheid variables pulse like cosmic lighthouses. Eclipsing binaries dim when one star passes in front of another. Cataclysmic variables can erupt suddenly. Astronomers use these patterns to measure distance and study how stars live and die.",
    sourceId: "starchild_cepheids",
    fact: "Edwin Hubble used Cepheid variables to prove other galaxies existed beyond the Milky Way.",
    quiz: {
      question: "Cepheid variable stars are useful because…",
      options: ["They never change", "Their pulsation period reveals distance", "They are the closest stars", "They are invisible"],
      answer: 1,
      explain: "A Cepheid's pulse period tells us its true brightness — and from that, its distance.",
    },
  },
  {
    id: "spectral-classes",
    title: "Star Classes (O B A F G K M)",
    emoji: "🌈",
    intro: "Astronomers group stars into seven classes by their color and temperature: O, B, A, F, G, K, M.",
    body: "O stars are blue and scorching. M stars are red and cool. The Sun is a G class — a steady yellow star. The phrase 'Oh Be A Fine Girl/Guy, Kiss Me' helps remember the order.",
    sourceId: "imagine_timing",
    fact: "Most stars in our galaxy are red M-class dwarfs — they live for trillions of years.",
    quiz: {
      question: "Which class is our Sun?",
      options: ["O", "G", "K", "M"],
      answer: 1,
      explain: "The Sun is a G-class yellow dwarf.",
    },
  },
];

export type LevelMeta = {
  id: number;
  slug: string;
  title: string;
  story: string;
  objective: string;
  mission: string;
  emoji: string;
};

export const levels: LevelMeta[] = [
  {
    id: 1, slug: "twinkling-star", title: "Find the Twinkling Star", emoji: "✨",
    story: "Explorer, somewhere in this patch of sky, one star is twinkling more than the others. Long ago, navigators noticed these wobbles too — and learned that twinkling means a star's light is dancing through our atmosphere.",
    objective: "Identify the star twinkling differently from the rest.",
    mission: "Tap the star that shimmers brightest.",
  },
  {
    id: 2, slug: "connect-constellation", title: "Connect the Constellation", emoji: "🌟",
    story: "Ancient travelers used constellations to find their way home. Your mission is to connect the stars in order and reveal the hidden shape.",
    objective: "Learn how patterns in the sky form constellations.",
    mission: "Tap the stars in order from 1 to 7.",
  },
  {
    id: 3, slug: "color-temperature", title: "Star Color Challenge", emoji: "🎨",
    story: "Color is a star's whisper of its temperature. Match each star to the right heat level and you'll see the universe through an astronomer's eyes.",
    objective: "Match star colors to their temperatures.",
    mission: "Drag each star onto the correct temperature card.",
  },
  {
    id: 4, slug: "brightness-explorer", title: "Brightness Explorer", emoji: "🔭",
    story: "A faint star may be a giant hiding in the distance. Move the sliders and see how distance and true brightness change what we see from Earth.",
    objective: "Understand how distance affects apparent brightness.",
    mission: "Match the target brightness using the sliders.",
  },
  {
    id: 5, slug: "create-your-sky", title: "Create Your Own Sky", emoji: "🌌",
    story: "Every culture has drawn its own pictures in the stars. Now it's your turn — place stars in the sky and give your constellation a name to add to the explorer's logbook.",
    objective: "Express creativity and ownership of the night sky.",
    mission: "Tap the canvas to place stars, then name your constellation.",
  },
];

export const badges = [
  { id: "first-light", name: "First Light", emoji: "🌠", desc: "Started your journey" },
  { id: "stargazer", name: "Stargazer", emoji: "👁️", desc: "Completed Level 1" },
  { id: "pathfinder", name: "Pathfinder", emoji: "🧭", desc: "Connected your first constellation" },
  { id: "spectrum", name: "Spectrum Master", emoji: "🌈", desc: "Mastered star colors" },
  { id: "scholar", name: "Sky Scholar", emoji: "📚", desc: "Completed all lessons" },
  { id: "creator", name: "Sky Creator", emoji: "🎨", desc: "Created your own constellation" },
];

export const introStory = [
  "Long ago, people looked at the night sky and saw shining diamonds above them.",
  "Every star had a story. Every pattern had a meaning. Every explorer had a mission.",
  "Today, your journey begins.",
  "You are now a sky explorer — ready to discover why stars shine, why they twinkle, and how constellations guide us through the universe.",
];
