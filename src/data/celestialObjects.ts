/**
 * Universe Explorer scientific data layer.
 *
 * Presentation-free: every measurement here is sourced from NASA / ESA /
 * IAU published values so the UI can be redesigned without touching science.
 * Figures are rounded for readability but never invented — where a value is
 * uncertain or model-dependent it is marked approximate in the text.
 *
 * Primary sources:
 *  - NASA Science Solar System        https://science.nasa.gov/solar-system/
 *  - NASA/IPAC NED                    https://ned.ipac.caltech.edu
 *  - ESA Hubble & Webb                https://esahubble.org , https://esawebb.org
 *  - NASA Universe / Imagine          https://imagine.gsfc.nasa.gov
 */

export type ObjectCategory =
  | "planet"
  | "dwarf-planet"
  | "moon"
  | "asteroid"
  | "comet"
  | "star"
  | "red-giant"
  | "white-dwarf"
  | "neutron-star"
  | "black-hole"
  | "nebula"
  | "supernova-remnant"
  | "star-cluster"
  | "galaxy"
  | "galaxy-group"
  | "galaxy-cluster"
  | "supercluster"
  | "cosmic-structure"
  | "region"
  | "theoretical";

export type DistanceUnit = "km" | "AU" | "ly" | "pc" | "kpc" | "Mpc" | "Gly";

export type CelestialObject = {
  id: string;
  name: string;
  category: ObjectCategory;
  /** id of the system / structure this belongs to, when meaningful. */
  parent?: string;
  /** Which scale level this object is revealed at. */
  scaleLevel: number;
  /** Short scientific description, 1-2 sentences. */
  description: string;
  /** Distance from Earth. Omitted for Earth itself. */
  distance?: number;
  distanceUnit?: DistanceUnit;
  /** Human-readable physical size (diameter / span). */
  physicalSize?: string;
  interestingFact: string;
  source: string;
  sourceURL: string;
  /** Links a discovery to an existing lesson id in src/data/lessonMovies. */
  learnContentId?: string;
  /** Links a discovery to an existing mission id in src/data/starMissions. */
  gameRelatedId?: string;
  /** Visual hints for the renderer — no imagery required. */
  color: string;
  accent?: string;
  ring?: boolean;
  /** Relative on-stage radius within its scale level (0-1 of stage). */
  r: number;
  /** Position on the stage, percentages. */
  x: number;
  y: number;
  emoji?: string;
};

export type ScaleLevel = {
  index: number;
  /** Short label shown in the scale rail. */
  name: string;
  /** The characteristic size of what you are looking at. */
  spanValue: number;
  spanUnit: DistanceUnit;
  /** One-line orientation text under the scale readout. */
  caption: string;
  /** Background mood reused from the game's existing palette. */
  hue: number;
  speculative?: boolean;
};

export const scaleLevels: ScaleLevel[] = [
  { index: 0,  name: "Earth",                spanValue: 12742,      spanUnit: "km",  caption: "Home. Everything you have ever touched is here.", hue: 220 },
  { index: 1,  name: "Earth–Moon System",    spanValue: 384400,     spanUnit: "km",  caption: "The Moon orbits at about 30 Earth-widths away.", hue: 235 },
  { index: 2,  name: "Inner Solar System",   spanValue: 3,          spanUnit: "AU",  caption: "The four rocky worlds and the asteroid belt.", hue: 40 },
  { index: 3,  name: "Solar System",         spanValue: 60,         spanUnit: "AU",  caption: "Out past the gas giants to Neptune and Pluto.", hue: 265 },
  { index: 4,  name: "Kuiper Belt",          spanValue: 100,        spanUnit: "AU",  caption: "An icy ring of leftovers from planet formation.", hue: 200 },
  { index: 5,  name: "Oort Cloud",           spanValue: 100000,     spanUnit: "AU",  caption: "A vast shell of comets surrounding the Sun.", hue: 250 },
  { index: 6,  name: "Nearby Stars",         spanValue: 15,         spanUnit: "ly",  caption: "Our closest stellar neighbours.", hue: 30 },
  { index: 7,  name: "Stellar Neighbourhood",spanValue: 250,        spanUnit: "ly",  caption: "Bright familiar stars of the night sky.", hue: 300 },
  { index: 8,  name: "Nebulae & Nurseries",  spanValue: 5000,       spanUnit: "ly",  caption: "Clouds of gas where new stars are born.", hue: 330 },
  { index: 9,  name: "Star Clusters",        spanValue: 30000,      spanUnit: "ly",  caption: "Families of stars bound by gravity.", hue: 55 },
  { index: 10, name: "The Milky Way",        spanValue: 100000,     spanUnit: "ly",  caption: "Our barred spiral galaxy, seen whole.", hue: 265 },
  { index: 11, name: "Local Group",          spanValue: 10,         spanUnit: "Mpc", caption: "The Milky Way's galactic family.", hue: 210 },
  { index: 12, name: "Galaxy Clusters",      spanValue: 100,        spanUnit: "Mpc", caption: "Thousands of galaxies held in one gravity well.", hue: 320 },
  { index: 13, name: "Superclusters",        spanValue: 160,        spanUnit: "Mpc", caption: "Clusters strung together across space.", hue: 285 },
  { index: 14, name: "The Cosmic Web",       spanValue: 1,          spanUnit: "Gly", caption: "Filaments and voids: the largest pattern known.", hue: 245 },
  { index: 15, name: "Observable Universe",  spanValue: 93,         spanUnit: "Gly", caption: "Everything whose light has had time to reach us.", hue: 270 },
  { index: 16, name: "Beyond (Theoretical)", spanValue: 93,         spanUnit: "Gly", caption: "Speculative ideas — not established observation.", hue: 315, speculative: true },
];

const NASA = "NASA Science";

export const celestialObjects: CelestialObject[] = [
  /* ---------------------------------------------------------- level 0 */
  {
    id: "earth", name: "Earth", category: "planet", scaleLevel: 0,
    description: "The only world known to host life, with liquid water oceans and a nitrogen–oxygen atmosphere.",
    physicalSize: "12,742 km across",
    interestingFact: "Earth's atmosphere bends and jostles starlight, which is why stars appear to twinkle.",
    source: NASA, sourceURL: "https://science.nasa.gov/earth/",
    learnContentId: "twinkle", color: "oklch(0.62 0.16 230)", accent: "oklch(0.78 0.16 150)", r: 0.34, x: 50, y: 52, emoji: "🌍",
  },
  /* ---------------------------------------------------------- level 1 */
  {
    id: "moon", name: "The Moon", category: "moon", parent: "earth", scaleLevel: 1,
    description: "Earth's only natural satellite, locked so the same face always points toward us.",
    distance: 384400, distanceUnit: "km", physicalSize: "3,475 km across",
    interestingFact: "The Moon drifts about 3.8 cm further from Earth every year.",
    source: NASA, sourceURL: "https://science.nasa.gov/moon/",
    color: "oklch(0.82 0.02 250)", r: 0.09, x: 74, y: 36, emoji: "🌕",
  },
  {
    id: "earth-l1", name: "Earth from Space", category: "region", parent: "earth", scaleLevel: 1,
    description: "At this scale Earth and Moon are two small spheres separated by mostly empty space.",
    distance: 384400, distanceUnit: "km", physicalSize: "System span ~770,000 km",
    interestingFact: "Every planet in the Solar System could fit in the gap between Earth and the Moon.",
    source: NASA, sourceURL: "https://science.nasa.gov/moon/",
    color: "oklch(0.60 0.14 230)", r: 0.14, x: 28, y: 58, emoji: "🌍",
  },
  /* ---------------------------------------------------------- level 2 */
  {
    id: "sun", name: "The Sun", category: "star", scaleLevel: 2,
    description: "A G-type main-sequence star fusing hydrogen into helium in its core, the source of nearly all energy on Earth.",
    distance: 1, distanceUnit: "AU", physicalSize: "1.39 million km across",
    interestingFact: "The Sun holds about 99.8% of all the mass in the Solar System.",
    source: NASA, sourceURL: "https://science.nasa.gov/sun/",
    learnContentId: "sun", gameRelatedId: "what-is-a-star",
    color: "oklch(0.90 0.18 85)", accent: "oklch(0.80 0.20 55)", r: 0.20, x: 16, y: 50, emoji: "☀️",
  },
  {
    id: "mercury", name: "Mercury", category: "planet", parent: "sun", scaleLevel: 2,
    description: "The smallest planet and the closest to the Sun, with no substantial atmosphere.",
    distance: 0.39, distanceUnit: "AU", physicalSize: "4,879 km across",
    interestingFact: "A single day on Mercury lasts about 59 Earth days.",
    source: NASA, sourceURL: "https://science.nasa.gov/mercury/",
    color: "oklch(0.65 0.03 60)", r: 0.05, x: 33, y: 40, emoji: "☿️",
  },
  {
    id: "venus", name: "Venus", category: "planet", parent: "sun", scaleLevel: 2,
    description: "A rocky world wrapped in thick carbon-dioxide clouds that trap heat.",
    distance: 0.72, distanceUnit: "AU", physicalSize: "12,104 km across",
    interestingFact: "Venus is the hottest planet, around 465 °C at the surface — hotter than Mercury.",
    source: NASA, sourceURL: "https://science.nasa.gov/venus/",
    color: "oklch(0.85 0.10 90)", r: 0.07, x: 47, y: 62, emoji: "♀️",
  },
  {
    id: "mars", name: "Mars", category: "planet", parent: "sun", scaleLevel: 2,
    description: "A cold desert world with polar ice caps, ancient river valleys and the tallest volcano known.",
    distance: 1.52, distanceUnit: "AU", physicalSize: "6,779 km across",
    interestingFact: "Olympus Mons on Mars rises about 22 km — roughly two and a half times Everest.",
    source: NASA, sourceURL: "https://science.nasa.gov/mars/",
    color: "oklch(0.62 0.15 40)", r: 0.06, x: 72, y: 42, emoji: "🔴",
  },
  {
    id: "asteroid-belt", name: "The Asteroid Belt", category: "asteroid", parent: "sun", scaleLevel: 2,
    description: "A ring of rocky bodies between Mars and Jupiter, left over from the Solar System's formation.",
    distance: 2.7, distanceUnit: "AU", physicalSize: "Ring roughly 1 AU wide",
    interestingFact: "Despite the movies, the belt is mostly empty — spacecraft cross it without danger.",
    source: NASA, sourceURL: "https://science.nasa.gov/solar-system/asteroids/",
    color: "oklch(0.60 0.04 70)", r: 0.05, x: 88, y: 66, emoji: "🪨",
  },
  /* ---------------------------------------------------------- level 3 */
  {
    id: "jupiter", name: "Jupiter", category: "planet", parent: "sun", scaleLevel: 3,
    description: "The largest planet, a gas giant with a storm — the Great Red Spot — wider than Earth.",
    distance: 5.2, distanceUnit: "AU", physicalSize: "139,820 km across",
    interestingFact: "Jupiter has 95 confirmed moons, including the ocean world Europa.",
    source: NASA, sourceURL: "https://science.nasa.gov/jupiter/",
    color: "oklch(0.75 0.10 65)", accent: "oklch(0.60 0.16 35)", r: 0.13, x: 30, y: 42, emoji: "🪐",
  },
  {
    id: "saturn", name: "Saturn", category: "planet", parent: "sun", scaleLevel: 3,
    description: "A gas giant famous for its bright ring system made of ice and rock particles.",
    distance: 9.6, distanceUnit: "AU", physicalSize: "116,460 km across",
    interestingFact: "Saturn's rings are only tens of metres thick in most places.",
    source: NASA, sourceURL: "https://science.nasa.gov/saturn/",
    color: "oklch(0.84 0.08 85)", ring: true, r: 0.11, x: 52, y: 62, emoji: "🪐",
  },
  {
    id: "uranus", name: "Uranus", category: "planet", parent: "sun", scaleLevel: 3,
    description: "An ice giant tipped on its side, so it effectively rolls around its orbit.",
    distance: 19.2, distanceUnit: "AU", physicalSize: "50,724 km across",
    interestingFact: "Uranus's axis is tilted about 98°, giving it 21-year-long seasons.",
    source: NASA, sourceURL: "https://science.nasa.gov/uranus/",
    color: "oklch(0.80 0.09 200)", r: 0.08, x: 72, y: 38, emoji: "🔵",
  },
  {
    id: "neptune", name: "Neptune", category: "planet", parent: "sun", scaleLevel: 3,
    description: "The most distant major planet, an ice giant with the fastest winds in the Solar System.",
    distance: 30.1, distanceUnit: "AU", physicalSize: "49,244 km across",
    interestingFact: "Winds on Neptune can reach about 2,000 km/h.",
    source: NASA, sourceURL: "https://science.nasa.gov/neptune/",
    color: "oklch(0.62 0.16 255)", r: 0.08, x: 87, y: 60, emoji: "🌀",
  },
  /* ---------------------------------------------------------- level 4 */
  {
    id: "pluto", name: "Pluto", category: "dwarf-planet", parent: "sun", scaleLevel: 4,
    description: "A dwarf planet in the Kuiper Belt with nitrogen ice plains and five known moons.",
    distance: 39.5, distanceUnit: "AU", physicalSize: "2,377 km across",
    interestingFact: "New Horizons flew past Pluto in 2015 and revealed a heart-shaped glacier.",
    source: NASA, sourceURL: "https://science.nasa.gov/dwarf-planets/pluto/",
    color: "oklch(0.78 0.04 60)", r: 0.06, x: 36, y: 46, emoji: "🤍",
  },
  {
    id: "kuiper-belt", name: "The Kuiper Belt", category: "region", parent: "sun", scaleLevel: 4,
    description: "A doughnut-shaped region of icy bodies beyond Neptune, stretching from about 30 to 50 AU.",
    distance: 40, distanceUnit: "AU", physicalSize: "~20 AU wide",
    interestingFact: "Short-period comets that visit the inner Solar System come from here.",
    source: NASA, sourceURL: "https://science.nasa.gov/solar-system/kuiper-belt/",
    color: "oklch(0.70 0.08 210)", r: 0.30, x: 62, y: 55, emoji: "🧊",
  },
  {
    id: "halley", name: "Comet Halley", category: "comet", parent: "sun", scaleLevel: 4,
    description: "A periodic comet whose ice vaporises near the Sun, growing a glowing coma and tail.",
    distance: 35, distanceUnit: "AU", physicalSize: "Nucleus ~15 × 8 km",
    interestingFact: "Halley returns roughly every 76 years; next perihelion is expected in 2061.",
    source: NASA, sourceURL: "https://science.nasa.gov/solar-system/comets/1p-halley/",
    color: "oklch(0.88 0.10 190)", r: 0.05, x: 84, y: 30, emoji: "☄️",
  },
  /* ---------------------------------------------------------- level 5 */
  {
    id: "oort-cloud", name: "The Oort Cloud", category: "region", parent: "sun", scaleLevel: 5,
    description: "A theorised spherical shell of icy bodies surrounding the Solar System, inferred from long-period comet orbits.",
    distance: 100000, distanceUnit: "AU", physicalSize: "Up to ~1.5 light-years radius",
    interestingFact: "Sunlight takes over a year to reach the outer Oort Cloud.",
    source: NASA, sourceURL: "https://science.nasa.gov/solar-system/oort-cloud/",
    color: "oklch(0.72 0.06 250)", r: 0.42, x: 50, y: 50, emoji: "🫧",
  },
  {
    id: "voyager1", name: "Voyager 1", category: "region", scaleLevel: 5,
    description: "The most distant human-made object, now travelling through interstellar space.",
    distance: 165, distanceUnit: "AU", physicalSize: "Spacecraft, 3.7 m dish",
    interestingFact: "Voyager 1 crossed the heliopause in 2012 and still sends data home.",
    source: NASA, sourceURL: "https://science.nasa.gov/mission/voyager/",
    color: "oklch(0.88 0.03 250)", r: 0.03, x: 24, y: 30, emoji: "🛰️",
  },
  /* ---------------------------------------------------------- level 6 */
  {
    id: "alpha-centauri", name: "Alpha Centauri System", category: "star", scaleLevel: 6,
    description: "The nearest stellar system: a bright pair of Sun-like stars plus the red dwarf Proxima Centauri.",
    distance: 4.37, distanceUnit: "ly", physicalSize: "Triple star system",
    interestingFact: "Proxima Centauri, at 4.24 light-years, hosts a planet in its habitable zone.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/stars/",
    learnContentId: "distance", gameRelatedId: "star-distance",
    color: "oklch(0.92 0.10 85)", r: 0.10, x: 34, y: 46, emoji: "✨",
  },
  {
    id: "barnards-star", name: "Barnard's Star", category: "star", scaleLevel: 6,
    description: "A low-mass red dwarf and one of the closest stars to the Sun.",
    distance: 5.96, distanceUnit: "ly", physicalSize: "About 0.2 solar radii",
    interestingFact: "It has the largest proper motion of any known star — it visibly shifts across decades.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/stars/",
    color: "oklch(0.66 0.16 30)", r: 0.06, x: 62, y: 66, emoji: "🔴",
  },
  {
    id: "sirius", name: "Sirius A & B", category: "white-dwarf", scaleLevel: 6,
    description: "The brightest star in Earth's night sky, orbited by Sirius B, a dense white dwarf.",
    distance: 8.6, distanceUnit: "ly", physicalSize: "Sirius A ~1.7 solar radii",
    interestingFact: "Sirius B packs roughly the Sun's mass into a body about Earth's size.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/stars/",
    learnContentId: "brightness", gameRelatedId: "star-brightness",
    color: "oklch(0.96 0.05 230)", r: 0.09, x: 80, y: 34, emoji: "💎",
  },
  /* ---------------------------------------------------------- level 7 */
  {
    id: "betelgeuse", name: "Betelgeuse", category: "red-giant", scaleLevel: 7,
    description: "A red supergiant in Orion, nearing the end of its life and expected to explode as a supernova.",
    distance: 548, distanceUnit: "ly", physicalSize: "Several hundred solar radii",
    interestingFact: "If placed at the Sun's position, Betelgeuse would swallow the inner planets.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/stars/",
    learnContentId: "colors", gameRelatedId: "star-colors",
    color: "oklch(0.66 0.19 32)", r: 0.16, x: 28, y: 44, emoji: "🟠",
  },
  {
    id: "rigel", name: "Rigel", category: "star", scaleLevel: 7,
    description: "A blue supergiant, the brightest star in Orion and far hotter than the Sun.",
    distance: 863, distanceUnit: "ly", physicalSize: "About 70 solar radii",
    interestingFact: "Rigel shines with tens of thousands of times the Sun's luminosity.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/stars/",
    learnContentId: "classes", gameRelatedId: "star-colors",
    color: "oklch(0.86 0.12 245)", r: 0.11, x: 58, y: 66, emoji: "🔵",
  },
  {
    id: "polaris", name: "Polaris", category: "star", scaleLevel: 7,
    description: "The North Star, a Cepheid variable that sits almost directly above Earth's north pole.",
    distance: 433, distanceUnit: "ly", physicalSize: "About 46 solar radii",
    interestingFact: "Polaris pulses in brightness on a cycle of roughly four days.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/stars/",
    learnContentId: "variable", gameRelatedId: "variable-stars",
    color: "oklch(0.94 0.06 95)", r: 0.08, x: 82, y: 32, emoji: "⭐",
  },
  /* ---------------------------------------------------------- level 8 */
  {
    id: "orion-nebula", name: "Orion Nebula (M42)", category: "nebula", scaleLevel: 8,
    description: "The closest large star-forming region, where hundreds of young stars light up glowing gas.",
    distance: 1344, distanceUnit: "ly", physicalSize: "About 24 light-years across",
    interestingFact: "It is visible to the unaided eye as the fuzzy middle 'star' of Orion's sword.",
    source: "NASA / ESA Hubble", sourceURL: "https://esahubble.org/images/heic0601a/",
    learnContentId: "star", gameRelatedId: "what-is-a-star",
    color: "oklch(0.70 0.18 340)", accent: "oklch(0.78 0.16 200)", r: 0.28, x: 34, y: 48, emoji: "🌸",
  },
  {
    id: "pillars", name: "Pillars of Creation", category: "nebula", parent: "eagle-nebula", scaleLevel: 8,
    description: "Towers of cold gas and dust in the Eagle Nebula being sculpted by radiation from nearby young stars.",
    distance: 6500, distanceUnit: "ly", physicalSize: "Roughly 4-5 light-years tall",
    interestingFact: "JWST's infrared view sees newborn stars hidden inside the dust columns.",
    source: "NASA / ESA / CSA Webb", sourceURL: "https://esawebb.org/images/weic2216a/",
    color: "oklch(0.66 0.16 55)", r: 0.20, x: 68, y: 58, emoji: "🌫️",
  },
  {
    id: "crab-nebula", name: "Crab Nebula (M1)", category: "supernova-remnant", scaleLevel: 8,
    description: "The expanding debris of a star that exploded in 1054 CE, with a spinning pulsar at its heart.",
    distance: 6500, distanceUnit: "ly", physicalSize: "About 11 light-years across",
    interestingFact: "Its pulsar spins about 30 times every second.",
    source: NASA, sourceURL: "https://science.nasa.gov/mission/hubble/science/",
    color: "oklch(0.72 0.15 150)", r: 0.15, x: 84, y: 30, emoji: "🦀",
  },
  /* ---------------------------------------------------------- level 9 */
  {
    id: "pleiades", name: "The Pleiades (M45)", category: "star-cluster", scaleLevel: 9,
    description: "A young open cluster of hot blue stars still wrapped in wisps of reflected dust.",
    distance: 444, distanceUnit: "ly", physicalSize: "About 12 light-years across",
    interestingFact: "Most people see six or seven stars, but the cluster holds over a thousand.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/star-clusters/",
    gameRelatedId: "constellations",
    color: "oklch(0.88 0.10 240)", r: 0.16, x: 32, y: 42, emoji: "✨",
  },
  {
    id: "m13", name: "Hercules Cluster (M13)", category: "star-cluster", scaleLevel: 9,
    description: "A globular cluster: hundreds of thousands of ancient stars packed into a tight sphere.",
    distance: 22200, distanceUnit: "ly", physicalSize: "About 145 light-years across",
    interestingFact: "Its stars are around 12 billion years old, nearly as old as the universe.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/star-clusters/",
    color: "oklch(0.90 0.08 90)", r: 0.20, x: 68, y: 58, emoji: "🌟",
  },
  /* ---------------------------------------------------------- level 10 */
  {
    id: "milky-way", name: "The Milky Way", category: "galaxy", scaleLevel: 10,
    description: "Our barred spiral galaxy, home to a few hundred billion stars including the Sun.",
    distance: 26000, distanceUnit: "ly", physicalSize: "About 100,000 light-years across",
    interestingFact: "The Sun takes roughly 230 million years to orbit the galactic centre once.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/galaxies/",
    color: "oklch(0.80 0.14 285)", accent: "oklch(0.92 0.10 90)", r: 0.42, x: 50, y: 50, emoji: "🌌",
  },
  {
    id: "sgr-a", name: "Sagittarius A*", category: "black-hole", parent: "milky-way", scaleLevel: 10,
    description: "The supermassive black hole at the centre of the Milky Way, imaged by the Event Horizon Telescope in 2022.",
    distance: 26000, distanceUnit: "ly", physicalSize: "About 4 million solar masses",
    interestingFact: "Its shadow is about 52 microarcseconds wide as seen from Earth — like a doughnut on the Moon.",
    source: "NSF / EHT", sourceURL: "https://eventhorizontelescope.org/",
    color: "oklch(0.30 0.08 30)", accent: "oklch(0.85 0.18 70)", r: 0.07, x: 50, y: 50, emoji: "⚫",
  },
  /* ---------------------------------------------------------- level 11 */
  {
    id: "andromeda", name: "Andromeda Galaxy (M31)", category: "galaxy", parent: "local-group", scaleLevel: 11,
    description: "The nearest major galaxy to the Milky Way, a large spiral on a collision course with us.",
    distance: 2.5, distanceUnit: "Mpc", physicalSize: "About 152,000 light-years across",
    interestingFact: "Andromeda and the Milky Way will begin merging in roughly 4 billion years.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/galaxies/",
    color: "oklch(0.84 0.10 300)", r: 0.26, x: 32, y: 42, emoji: "🌀",
  },
  {
    id: "triangulum", name: "Triangulum Galaxy (M33)", category: "galaxy", parent: "local-group", scaleLevel: 11,
    description: "The third-largest member of the Local Group, a loosely wound spiral rich in star-forming regions.",
    distance: 2.7, distanceUnit: "Mpc", physicalSize: "About 60,000 light-years across",
    interestingFact: "Under very dark skies it is one of the most distant objects visible to the naked eye.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/galaxies/",
    color: "oklch(0.80 0.10 200)", r: 0.16, x: 70, y: 60, emoji: "🌀",
  },
  {
    id: "lmc", name: "Large Magellanic Cloud", category: "galaxy", parent: "local-group", scaleLevel: 11,
    description: "A satellite galaxy of the Milky Way, visible from the southern hemisphere.",
    distance: 0.05, distanceUnit: "Mpc", physicalSize: "About 32,000 light-years across",
    interestingFact: "It hosts the Tarantula Nebula, the most active star-forming region known nearby.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/galaxies/",
    color: "oklch(0.86 0.09 95)", r: 0.12, x: 52, y: 26, emoji: "☁️",
  },
  {
    id: "local-group", name: "The Local Group", category: "galaxy-group", scaleLevel: 11,
    description: "A gravitationally bound collection of more than 80 galaxies dominated by the Milky Way and Andromeda.",
    distance: 0, distanceUnit: "Mpc", physicalSize: "About 3 megaparsecs across",
    interestingFact: "Most of its members are small dwarf galaxies orbiting the two big spirals.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/galaxies/",
    color: "oklch(0.70 0.08 260)", r: 0.44, x: 50, y: 50, emoji: "🫂",
  },
  /* ---------------------------------------------------------- level 12 */
  {
    id: "virgo-cluster", name: "Virgo Cluster", category: "galaxy-cluster", scaleLevel: 12,
    description: "The nearest large galaxy cluster, containing well over a thousand galaxies.",
    distance: 16.5, distanceUnit: "Mpc", physicalSize: "About 15 million light-years across",
    interestingFact: "Its gravity tugs the whole Local Group toward it at hundreds of km per second.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/galaxies/",
    color: "oklch(0.78 0.12 320)", r: 0.30, x: 36, y: 46, emoji: "🪩",
  },
  {
    id: "m87", name: "M87 & its Black Hole", category: "black-hole", parent: "virgo-cluster", scaleLevel: 12,
    description: "A giant elliptical galaxy whose supermassive black hole was the first ever imaged, in 2019.",
    distance: 16.8, distanceUnit: "Mpc", physicalSize: "Black hole ~6.5 billion solar masses",
    interestingFact: "M87 shoots a jet of plasma about 5,000 light-years long.",
    source: "NSF / EHT", sourceURL: "https://eventhorizontelescope.org/",
    color: "oklch(0.35 0.10 40)", accent: "oklch(0.88 0.16 75)", r: 0.14, x: 72, y: 60, emoji: "⚫",
  },
  /* ---------------------------------------------------------- level 13 */
  {
    id: "laniakea", name: "Laniakea Supercluster", category: "supercluster", scaleLevel: 13,
    description: "The supercluster of galaxies that contains the Milky Way, defined by the flow of galaxies toward a common region.",
    distance: 0, distanceUnit: "Mpc", physicalSize: "About 160 megaparsecs across",
    interestingFact: "'Laniakea' is Hawaiian for 'immeasurable heaven'.",
    source: "NASA / NED", sourceURL: "https://ned.ipac.caltech.edu/",
    color: "oklch(0.72 0.14 290)", r: 0.40, x: 44, y: 48, emoji: "🕸️",
  },
  {
    id: "great-attractor", name: "The Great Attractor", category: "cosmic-structure", parent: "laniakea", scaleLevel: 13,
    description: "A gravitational focal point within Laniakea toward which nearby galaxies, including ours, are drifting.",
    distance: 65, distanceUnit: "Mpc", physicalSize: "Region tens of Mpc wide",
    interestingFact: "It sits behind the Milky Way's disc, so dust makes it hard to observe directly.",
    source: "NASA / NED", sourceURL: "https://ned.ipac.caltech.edu/",
    color: "oklch(0.60 0.16 20)", r: 0.16, x: 74, y: 62, emoji: "🧲",
  },
  /* ---------------------------------------------------------- level 14 */
  {
    id: "cosmic-web", name: "The Cosmic Web", category: "cosmic-structure", scaleLevel: 14,
    description: "The largest known pattern in nature: galaxies strung along filaments of dark matter around enormous empty voids.",
    physicalSize: "Filaments hundreds of millions of light-years long",
    interestingFact: "Roughly 80% of the universe's matter is invisible dark matter shaping this web.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/dark-matter-dark-energy/",
    color: "oklch(0.76 0.12 265)", r: 0.46, x: 50, y: 50, emoji: "🕸️",
  },
  {
    id: "bootes-void", name: "Boötes Void", category: "cosmic-structure", parent: "cosmic-web", scaleLevel: 14,
    description: "An enormous, nearly empty region of space containing very few galaxies for its size.",
    distance: 213, distanceUnit: "Mpc", physicalSize: "About 330 million light-years across",
    interestingFact: "If the Milky Way sat at its centre, we would not have discovered other galaxies until the 1960s.",
    source: "NASA / NED", sourceURL: "https://ned.ipac.caltech.edu/",
    color: "oklch(0.30 0.04 265)", r: 0.20, x: 26, y: 34, emoji: "🕳️",
  },
  /* ---------------------------------------------------------- level 15 */
  {
    id: "observable-universe", name: "The Observable Universe", category: "cosmic-structure", scaleLevel: 15,
    description: "The sphere of space whose light has had time to reach Earth in the 13.8 billion years since the Big Bang.",
    physicalSize: "About 93 billion light-years across",
    interestingFact: "It is wider than 13.8 billion light-years because space itself has been expanding.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/",
    color: "oklch(0.82 0.14 275)", r: 0.44, x: 50, y: 50, emoji: "🌌",
  },
  {
    id: "cmb", name: "Cosmic Microwave Background", category: "cosmic-structure", parent: "observable-universe", scaleLevel: 15,
    description: "The oldest light we can see: heat left over from about 380,000 years after the Big Bang.",
    physicalSize: "Fills the whole sky",
    interestingFact: "Its temperature today is just 2.725 K — less than three degrees above absolute zero.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/overview/",
    color: "oklch(0.70 0.10 30)", r: 0.18, x: 24, y: 30, emoji: "📡",
  },
  /* ---------------------------------------------------------- level 16 */
  {
    id: "multiverse", name: "Multiverse (Speculative)", category: "theoretical", scaleLevel: 16,
    description: "A hypothesis, not an observation: some inflation models allow other regions of space beyond our horizon with different conditions.",
    physicalSize: "Not measurable",
    interestingFact: "No experiment has confirmed a multiverse — it remains a theoretical idea under debate.",
    source: NASA, sourceURL: "https://science.nasa.gov/universe/",
    color: "oklch(0.68 0.16 315)", r: 0.34, x: 50, y: 50, emoji: "❓",
  },
];

export const objectsByLevel = (level: number) =>
  celestialObjects.filter((o) => o.scaleLevel === level);

export const findObject = (id: string) => celestialObjects.find((o) => o.id === id);

const UNIT_LABEL: Record<DistanceUnit, string> = {
  km: "kilometres", AU: "astronomical units", ly: "light-years",
  pc: "parsecs", kpc: "kiloparsecs", Mpc: "megaparsecs", Gly: "billion light-years",
};

export function formatMeasure(value: number, unit: DistanceUnit) {
  const n =
    value >= 1000 ? value.toLocaleString("en-US")
    : value >= 10 ? value.toFixed(0)
    : value.toFixed(2).replace(/\.?0+$/, "");
  return { n, unit, long: UNIT_LABEL[unit] };
}

export const CATEGORY_LABEL: Record<ObjectCategory, string> = {
  planet: "Planet", "dwarf-planet": "Dwarf Planet", moon: "Moon", asteroid: "Asteroid Field",
  comet: "Comet", star: "Star", "red-giant": "Red Supergiant", "white-dwarf": "White Dwarf",
  "neutron-star": "Neutron Star", "black-hole": "Black Hole", nebula: "Nebula",
  "supernova-remnant": "Supernova Remnant", "star-cluster": "Star Cluster", galaxy: "Galaxy",
  "galaxy-group": "Galaxy Group", "galaxy-cluster": "Galaxy Cluster", supercluster: "Supercluster",
  "cosmic-structure": "Cosmic Structure", region: "Region of Space", theoretical: "Theoretical Concept",
};
