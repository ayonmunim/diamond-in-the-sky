export const distanceLessons = [
  {
    title: "THE COSMIC RULER",
    instruction: "Measure both journeys. Choose a useful unit, then drag the light to the end.",
    lines: [
      "Hi explorer! I'm Nova. Imagine two towns on Earth, one hundred kilometers apart. Kilometers are handy for this trip!",
      "Between stars, the numbers get enormous. A light-year is a distance: about 9.46 trillion kilometers. It is not a unit of time.",
      "Move the light along both rulers. Use kilometers for our town trip and light-years for Proxima Centauri, about 4.25 light-years away.",
    ],
  },
  {
    title: "BRIGHT VS FAR",
    instruction: "Drag the same star from 10 to 1,000 light-years. Visit 10, 100 and 1,000.",
    lines: [
      "This is the same star, shining with the same power. Let's move it away from Earth!",
      "At ten times the distance, we receive just one hundredth as much light. Farther away looks dimmer, even though the star has not switched off.",
      "Slide from ten to one thousand light-years. Our picture keeps a little glow so you can find the star. The light meter shows the real comparison.",
    ],
  },
  {
    title: "GROW A GIANT",
    instruction:
      "Slide through small, medium and giant sizes. Keep temperature and distance fixed.",
    lines: [
      "A pointed star is a drawing symbol. Real stars are round balls of hot gas. Watch our little symbol reveal a round star!",
      "Compare stars at the same surface temperature and distance. A bigger star has more glowing surface and gives off more light.",
      "Drag the size ruler through small, medium and giant. This is a comparison model, not a movie of a real star growing instantly.",
    ],
  },
  {
    title: "NOVA'S DISTANCE SPHERE",
    instruction: "Drag each object to its distance band. Milky Way width has its own size dock.",
    lines: [
      "Earth is our starting point. The Moon and Sun are so near that light needs seconds or minutes, not whole years, to reach us.",
      "Other stars are light-years away. Galaxies can be millions of light-years away! Our sphere squeezes those huge distances into labeled bands.",
      "Match each object's distance card. The Milky Way is our home: its one hundred thousand light-years describes its width, not how far away it is.",
    ],
  },
  {
    title: "MESSAGES ACROSS SPACE",
    instruction: "Aim four waving fact notes at True or False, then launch your arrow.",
    lines: [
      "Four space messages are ready! Read the note hanging under your arrow and aim at True or False.",
      "Remember: light-years measure distance. The same star looks dimmer farther away, and starlight takes time to travel.",
      "Send each message to its destination. I'll cheer for you when it arrives! A wrong shot is a chance to learn and try again.",
    ],
  },
];
export const distanceFacts = [
  {
    text: "A light-year measures distance.",
    truth: true,
    why: "It is how far light travels in one year.",
  },
  {
    text: "The same star looks brighter when moved farther away.",
    truth: false,
    why: "The same star looks dimmer as its distance increases.",
  },
  {
    text: "Andromeda's light takes about 2.5 million years to reach us.",
    truth: true,
    why: "Andromeda is about 2.5 million light-years away.",
  },
  {
    text: "The Milky Way is 100,000 light-years away from Earth.",
    truth: false,
    why: "Earth is inside the Milky Way! About 100,000 light-years is its width.",
  },
];
export const distanceBands = [
  { id: "solar", label: "Less than 0.001 ly", hint: "Solar neighborhood" },
  { id: "near", label: "1–10 ly", hint: "Nearby stars" },
  { id: "stars", label: "100–1,000 ly", hint: "Distant stars" },
  { id: "center", label: "10,000–100,000 ly", hint: "Galactic center" },
  { id: "galaxy", label: "1–3 million ly", hint: "Other galaxies" },
  { id: "width", label: "100,000 ly ACROSS", hint: "Size, not distance" },
];
// Approximate educational distances; sources and conversion notes in DISTANCE-PHASE.md.
export const distanceObjects = [
  {
    id: "moon",
    name: "Moon",
    icon: "🌕",
    distance: "0.0000000406 ly",
    detail: "384,400 km on average · 1.28 light-seconds",
    band: "solar",
  },
  {
    id: "sun",
    name: "Sun",
    icon: "☀️",
    distance: "0.0000158 ly",
    detail: "149.6 million km on average · 8.3 light-minutes",
    band: "solar",
  },
  {
    id: "mars",
    name: "Mars",
    icon: "🔴",
    distance: "0.0000058–0.0000423 ly",
    detail: "54.6–400.2 million km · changes with orbits",
    band: "solar",
  },
  {
    id: "sirius",
    name: "Sirius",
    icon: "⭐",
    distance: "8.6 ly",
    detail: "A nearby star system",
    band: "near",
  },
  {
    id: "polaris",
    name: "Polaris",
    icon: "✨",
    distance: "about 430 ly",
    detail: "Our North Star · approximate estimate",
    band: "stars",
  },
  {
    id: "andromeda",
    name: "Andromeda",
    icon: "🌌",
    distance: "2.5 million ly",
    detail: "Our neighboring large galaxy",
    band: "galaxy",
  },
  {
    id: "proxima",
    name: "Proxima Centauri",
    icon: "✴️",
    distance: "about 4.25 ly",
    detail: "Nearest star beyond our Sun",
    band: "near",
  },
  {
    id: "planet",
    name: "Proxima b",
    icon: "🪐",
    distance: "about 4.25 ly",
    detail: "An exoplanet orbiting Proxima Centauri",
    band: "near",
  },
  {
    id: "blackhole",
    name: "Sagittarius A*",
    icon: "⚫",
    distance: "about 26,000 ly",
    detail: "Supermassive black hole at our galaxy's center",
    band: "center",
  },
  {
    id: "milkyway",
    name: "Milky Way width",
    icon: "🌌",
    distance: "about 100,000 ly across",
    detail: "Earth is INSIDE it · this is a size!",
    band: "width",
  },
];
