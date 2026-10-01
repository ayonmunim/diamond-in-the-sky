/**
 * 12 Zodiac constellations — Phase 1 of the endless Constellation Mission.
 * Star coordinates are simplified to a 0..100 SVG canvas. They preserve the
 * general SHAPE of the real constellation, not absolute sky coords.
 * Brightest star data is real (Bayer-designation α / brightest member).
 */

export type ZodiacStar = {
  id: string;
  /** Display name (Bayer / proper name). */
  name: string;
  /** SVG x in 0..100 */
  x: number;
  /** SVG y in 0..100 */
  y: number;
  /** Apparent visual magnitude — lower = brighter. */
  mag: number;
};

export type ZodiacLevel = {
  id: string;            // slug — also missionLevel id
  index: number;         // 1..12
  name: string;          // "Orion" etc. (technically constellation)
  emoji: string;
  /** 2-3 sentence mythology / lore narrated by Nova. */
  lore: string;
  /** 2-3 sentence science narrated by Nova. */
  science: string;
  /** One-line cosmic fun fact. */
  funFact: string;
  /** Theme color — used for glow tints. */
  color: string;
  stars: ZodiacStar[];
  /** Pairs of star ids forming the constellation outline. */
  edges: [string, string][];
  /** Id of the brightest star — used for the bonus challenge. */
  brightestId: string;
};

// Helper: build a level
const L = (l: ZodiacLevel): ZodiacLevel => l;

export const zodiacLevels: ZodiacLevel[] = [
  L({
    id: "aries", index: 1, name: "Aries", emoji: "🐏",
    color: "oklch(0.78 0.18 25)",
    lore: "Aries is the golden ram from Greek myth, who carried two children safely across the sea. Its fleece became the legendary Golden Fleece.",
    science: "Aries is a small zodiac constellation with three bright stars in a gentle curve. It hides the famous meteor shower called the Daytime Arietids.",
    funFact: "Hamal, the brightest star in Aries, has a confirmed planet orbiting it — a giant world bigger than Jupiter!",
    stars: [
      { id: "hamal",     name: "Hamal (α Ari)",      x: 70, y: 38, mag: 2.00 },
      { id: "sheratan",  name: "Sheratan (β Ari)",   x: 52, y: 52, mag: 2.66 },
      { id: "mesarthim", name: "Mesarthim (γ Ari)",  x: 46, y: 58, mag: 3.86 },
      { id: "41ari",     name: "41 Ari",             x: 30, y: 70, mag: 3.63 },
    ],
    edges: [["hamal","sheratan"],["sheratan","mesarthim"],["sheratan","41ari"]],
    brightestId: "hamal",
  }),
  L({
    id: "taurus", index: 2, name: "Taurus", emoji: "🐂",
    color: "oklch(0.85 0.14 70)",
    lore: "Taurus is the great celestial bull. In myth, Zeus took the shape of a snow-white bull to carry the princess Europa across the sea.",
    science: "Taurus is home to the Pleiades star cluster and the Hyades — the closest open cluster to Earth. The fiery red eye of the bull is the star Aldebaran.",
    funFact: "Aldebaran is a red giant about 44 times the size of our Sun. It shines with an orange-red light you can spot with the naked eye!",
    stars: [
      { id: "aldebaran", name: "Aldebaran (α Tau)", x: 55, y: 55, mag: 0.86 },
      { id: "elnath",    name: "Elnath (β Tau)",    x: 20, y: 22, mag: 1.65 },
      { id: "tianguan",  name: "Tianguan (ζ Tau)",  x: 12, y: 50, mag: 3.00 },
      { id: "eps-tau",   name: "Ain (ε Tau)",       x: 68, y: 45, mag: 3.53 },
      { id: "gamma-tau", name: "Prima Hyadum (γ)",  x: 60, y: 50, mag: 3.65 },
      { id: "lambda-tau",name: "λ Tau",             x: 72, y: 70, mag: 3.41 },
    ],
    edges: [
      ["aldebaran","eps-tau"],["aldebaran","gamma-tau"],
      ["gamma-tau","elnath"],["aldebaran","lambda-tau"],
      ["gamma-tau","tianguan"],
    ],
    brightestId: "aldebaran",
  }),
  L({
    id: "gemini", index: 3, name: "Gemini", emoji: "👯",
    color: "oklch(0.80 0.16 280)",
    lore: "Gemini honors the twin brothers Castor and Pollux. They were inseparable and after one died, Zeus placed them side by side in the sky forever.",
    science: "The two brightest stars share the names of the mythical twins. Pollux is an orange giant, while Castor is actually a six-star system in disguise!",
    funFact: "Even though Castor's name comes first in the alphabet, Pollux is brighter — the second twin steals the spotlight!",
    stars: [
      { id: "pollux",  name: "Pollux (β Gem)", x: 70, y: 30, mag: 1.14 },
      { id: "castor",  name: "Castor (α Gem)", x: 80, y: 22, mag: 1.58 },
      { id: "alhena",  name: "Alhena (γ Gem)", x: 35, y: 60, mag: 1.93 },
      { id: "wasat",   name: "Wasat (δ Gem)",  x: 55, y: 45, mag: 3.50 },
      { id: "mebsuta", name: "Mebsuta (ε Gem)",x: 45, y: 32, mag: 2.98 },
      { id: "tejat",   name: "Tejat (μ Gem)",  x: 30, y: 28, mag: 2.87 },
      { id: "propus",  name: "Propus (η Gem)", x: 22, y: 38, mag: 3.31 },
    ],
    edges: [
      ["pollux","wasat"],["wasat","alhena"],
      ["castor","mebsuta"],["mebsuta","tejat"],["tejat","propus"],
      ["mebsuta","wasat"],
    ],
    brightestId: "pollux",
  }),
  L({
    id: "cancer", index: 4, name: "Cancer", emoji: "🦀",
    color: "oklch(0.78 0.14 200)",
    lore: "Cancer is the small but loyal crab from the legend of Heracles. Sent into battle, it earned its place among the stars even though it lost.",
    science: "Cancer is the dimmest of the zodiac constellations. At its heart shimmers the Beehive Cluster — hundreds of young stars huddled together.",
    funFact: "The Beehive Cluster has over 1,000 stars and is one of the closest star clusters to our Solar System.",
    stars: [
      { id: "tarf",    name: "Tarf (β Cnc)",     x: 30, y: 75, mag: 3.50 },
      { id: "asellus", name: "Asellus A. (δ Cnc)",x: 50, y: 45, mag: 3.94 },
      { id: "acubens", name: "Acubens (α Cnc)",  x: 70, y: 65, mag: 4.20 },
      { id: "iota",    name: "ι Cnc",            x: 55, y: 25, mag: 4.02 },
      { id: "gamma",   name: "Asellus B. (γ)",   x: 45, y: 40, mag: 4.66 },
    ],
    edges: [["tarf","asellus"],["asellus","gamma"],["gamma","iota"],["asellus","acubens"]],
    brightestId: "tarf",
  }),
  L({
    id: "leo", index: 5, name: "Leo", emoji: "🦁",
    color: "oklch(0.85 0.16 75)",
    lore: "Leo is the mighty lion defeated by the hero Heracles in his first labor. To honor its courage, Zeus placed the lion among the stars.",
    science: "Leo's brightest star, Regulus, marks the lion's heart. Each November, the Leonid meteor shower seems to stream out of this constellation.",
    funFact: "Regulus spins so fast — once every 16 hours — that it's squashed into an egg shape instead of a sphere!",
    stars: [
      { id: "regulus",  name: "Regulus (α Leo)",   x: 28, y: 55, mag: 1.40 },
      { id: "denebola", name: "Denebola (β Leo)",  x: 82, y: 40, mag: 2.14 },
      { id: "algieba",  name: "Algieba (γ Leo)",   x: 35, y: 35, mag: 2.08 },
      { id: "zosma",    name: "Zosma (δ Leo)",     x: 65, y: 35, mag: 2.56 },
      { id: "chertan",  name: "Chertan (θ Leo)",   x: 65, y: 50, mag: 3.33 },
      { id: "rasalas",  name: "Rasalas (μ Leo)",   x: 30, y: 25, mag: 3.88 },
      { id: "eta",      name: "η Leo",             x: 32, y: 45, mag: 3.48 },
    ],
    edges: [
      ["regulus","eta"],["eta","algieba"],["algieba","rasalas"],
      ["algieba","zosma"],["zosma","denebola"],["denebola","chertan"],
      ["chertan","regulus"],["zosma","chertan"],
    ],
    brightestId: "regulus",
  }),
  L({
    id: "virgo", index: 6, name: "Virgo", emoji: "🌾",
    color: "oklch(0.84 0.14 130)",
    lore: "Virgo is the maiden of the harvest — often linked to Demeter, the goddess of the grain. She holds an ear of wheat, marked by the star Spica.",
    science: "Virgo is the second-largest constellation in the sky. It points toward the Virgo Cluster, a huge family of more than 1,000 galaxies.",
    funFact: "Spica is actually two stars whirling around each other every four days — and we see them as one diamond-bright point.",
    stars: [
      { id: "spica",     name: "Spica (α Vir)",   x: 60, y: 78, mag: 1.04 },
      { id: "porrima",   name: "Porrima (γ Vir)", x: 40, y: 55, mag: 2.74 },
      { id: "vindemiatrix", name: "Vindemiatrix (ε)", x: 28, y: 30, mag: 2.83 },
      { id: "zavijava",  name: "Zavijava (β Vir)",x: 18, y: 18, mag: 3.60 },
      { id: "minelauva", name: "Minelauva (δ Vir)",x: 38, y: 38, mag: 3.39 },
      { id: "heze",      name: "Heze (ζ Vir)",    x: 52, y: 60, mag: 3.37 },
      { id: "syrma",     name: "Syrma (ι Vir)",   x: 78, y: 70, mag: 4.07 },
    ],
    edges: [
      ["zavijava","vindemiatrix"],["vindemiatrix","minelauva"],
      ["minelauva","porrima"],["porrima","heze"],["heze","spica"],
      ["spica","syrma"],
    ],
    brightestId: "spica",
  }),
  L({
    id: "libra", index: 7, name: "Libra", emoji: "⚖️",
    color: "oklch(0.80 0.14 160)",
    lore: "Libra is the celestial scales — the only zodiac constellation that is an object, not a creature. It represents balance, justice, and fairness.",
    science: "Libra's stars were once part of Scorpius — they were its claws! Long ago the Romans separated them to create the scales of justice.",
    funFact: "The brightest star, Zubeneschamali, looks slightly green to some observers — extremely rare among visible stars!",
    stars: [
      { id: "zubgen", name: "Zubeneschamali (β)", x: 35, y: 30, mag: 2.61 },
      { id: "zubeli", name: "Zubenelgenubi (α)",  x: 70, y: 55, mag: 2.75 },
      { id: "sigma",  name: "Brachium (σ Lib)",   x: 60, y: 75, mag: 3.29 },
      { id: "ups",    name: "υ Lib",              x: 40, y: 75, mag: 3.58 },
      { id: "tau",    name: "τ Lib",              x: 25, y: 60, mag: 3.66 },
    ],
    edges: [["zubgen","zubeli"],["zubeli","sigma"],["sigma","ups"],["ups","tau"],["tau","zubgen"]],
    brightestId: "zubgen",
  }),
  L({
    id: "scorpius", index: 8, name: "Scorpius", emoji: "🦂",
    color: "oklch(0.75 0.20 25)",
    lore: "Scorpius is the giant scorpion sent by Artemis to defeat the hunter Orion. Forever they chase each other across the sky — never both at once!",
    science: "Scorpius lies near the heart of our Milky Way. The bright red star Antares marks the scorpion's heart — a true supergiant.",
    funFact: "Antares is so massive that if you placed it where our Sun is, its surface would reach beyond the orbit of Mars.",
    stars: [
      { id: "antares", name: "Antares (α Sco)", x: 40, y: 40, mag: 1.06 },
      { id: "shaula",  name: "Shaula (λ Sco)",  x: 82, y: 78, mag: 1.62 },
      { id: "sargas",  name: "Sargas (θ Sco)",  x: 70, y: 75, mag: 1.86 },
      { id: "dschubba",name: "Dschubba (δ Sco)",x: 25, y: 25, mag: 2.32 },
      { id: "graffias",name: "Graffias (β Sco)",x: 30, y: 18, mag: 2.50 },
      { id: "pi-sco", name: "π Sco",            x: 18, y: 35, mag: 2.89 },
      { id: "eps-sco",name: "ε Sco",            x: 50, y: 60, mag: 2.29 },
      { id: "mu-sco", name: "μ Sco",            x: 60, y: 70, mag: 3.04 },
      { id: "lesath", name: "Lesath (υ Sco)",   x: 80, y: 80, mag: 2.69 },
    ],
    edges: [
      ["graffias","dschubba"],["dschubba","pi-sco"],
      ["dschubba","antares"],["antares","eps-sco"],["eps-sco","mu-sco"],
      ["mu-sco","sargas"],["sargas","shaula"],["shaula","lesath"],
    ],
    brightestId: "antares",
  }),
  L({
    id: "sagittarius", index: 9, name: "Sagittarius", emoji: "🏹",
    color: "oklch(0.80 0.18 60)",
    lore: "Sagittarius is the wise centaur archer — half-human, half-horse. He aims his bow forever at the heart of the Scorpion.",
    science: "Sagittarius points toward the center of our Milky Way galaxy. Hidden there is Sagittarius A*, a supermassive black hole 4 million times the mass of the Sun.",
    funFact: "Most people see Sagittarius as a giant 'teapot' shape — and the steam from it really IS the Milky Way!",
    stars: [
      { id: "kaus-aus", name: "Kaus Australis (ε)", x: 30, y: 70, mag: 1.85 },
      { id: "nunki",    name: "Nunki (σ Sgr)",      x: 70, y: 55, mag: 2.05 },
      { id: "ascella",  name: "Ascella (ζ Sgr)",    x: 75, y: 70, mag: 2.60 },
      { id: "kaus-med", name: "Kaus Media (δ Sgr)", x: 35, y: 60, mag: 2.72 },
      { id: "kaus-bor", name: "Kaus Borealis (λ)",  x: 45, y: 45, mag: 2.81 },
      { id: "phi-sgr",  name: "φ Sgr",              x: 58, y: 50, mag: 3.17 },
      { id: "tau-sgr",  name: "τ Sgr",              x: 70, y: 65, mag: 3.32 },
    ],
    edges: [
      ["kaus-aus","kaus-med"],["kaus-med","kaus-bor"],["kaus-bor","phi-sgr"],
      ["phi-sgr","nunki"],["nunki","ascella"],["ascella","tau-sgr"],
      ["tau-sgr","kaus-aus"],["phi-sgr","tau-sgr"],
    ],
    brightestId: "kaus-aus",
  }),
  L({
    id: "capricornus", index: 10, name: "Capricornus", emoji: "🐐",
    color: "oklch(0.78 0.12 220)",
    lore: "Capricornus is the strange 'sea-goat' — half goat, half fish. In myth, the god Pan grew a fish tail to escape danger and was set in the sky for his cleverness.",
    science: "Capricornus is one of the smallest and oldest constellations. It is shaped like a great triangular smile in the southern sky.",
    funFact: "Algedi (the brightest stars at the goat's head) is actually two stars that are not related — they just appear close from Earth!",
    stars: [
      { id: "deneb-alg", name: "Deneb Algedi (δ)", x: 75, y: 50, mag: 2.85 },
      { id: "dabih",     name: "Dabih (β Cap)",    x: 20, y: 30, mag: 3.05 },
      { id: "algedi",    name: "Algedi (α₂ Cap)",  x: 22, y: 25, mag: 3.57 },
      { id: "nashira",   name: "Nashira (γ Cap)",  x: 65, y: 55, mag: 3.67 },
      { id: "omega",     name: "ω Cap",            x: 40, y: 75, mag: 4.11 },
      { id: "psi",       name: "ψ Cap",            x: 55, y: 80, mag: 4.13 },
    ],
    edges: [
      ["algedi","dabih"],["dabih","omega"],["omega","psi"],
      ["psi","nashira"],["nashira","deneb-alg"],["deneb-alg","algedi"],
    ],
    brightestId: "deneb-alg",
  }),
  L({
    id: "aquarius", index: 11, name: "Aquarius", emoji: "🏺",
    color: "oklch(0.80 0.14 230)",
    lore: "Aquarius is the cup-bearer pouring water from a jar. In Greek myth, he served the gods of Olympus and was rewarded with an eternal home in the sky.",
    science: "Aquarius is large but dim. It hosts the Helix Nebula — the closest planetary nebula to Earth, sometimes called the 'Eye of God'.",
    funFact: "The water Aquarius pours flows into the mouth of Piscis Austrinus — a fish constellation right below him!",
    stars: [
      { id: "sadalsuud", name: "Sadalsuud (β Aqr)", x: 30, y: 35, mag: 2.87 },
      { id: "sadalmelik",name: "Sadalmelik (α Aqr)",x: 45, y: 28, mag: 2.95 },
      { id: "skat",      name: "Skat (δ Aqr)",      x: 55, y: 75, mag: 3.27 },
      { id: "ancha",     name: "Ancha (θ Aqr)",     x: 50, y: 55, mag: 4.16 },
      { id: "gamma-aqr", name: "Sadachbia (γ Aqr)", x: 55, y: 40, mag: 3.84 },
      { id: "zeta-aqr",  name: "ζ Aqr",             x: 62, y: 45, mag: 3.65 },
      { id: "eta-aqr",   name: "η Aqr",             x: 70, y: 38, mag: 4.04 },
    ],
    edges: [
      ["sadalsuud","sadalmelik"],["sadalmelik","gamma-aqr"],
      ["gamma-aqr","zeta-aqr"],["zeta-aqr","eta-aqr"],
      ["gamma-aqr","ancha"],["ancha","skat"],
    ],
    brightestId: "sadalsuud",
  }),
  L({
    id: "pisces", index: 12, name: "Pisces", emoji: "🐟",
    color: "oklch(0.80 0.14 310)",
    lore: "Pisces are two fish tied by a cord. In legend, the goddess Aphrodite and her son leapt into a river as fish to escape danger, tied so they wouldn't lose each other.",
    science: "Pisces is shaped like a giant 'V'. Inside it is the 'Circlet' — a ring of stars that marks one of the fish's heads.",
    funFact: "Right now, the point where the Sun crosses the equator each spring sits inside Pisces — astronomers call it the 'First Point of Aries'!",
    stars: [
      { id: "alrescha", name: "Alrescha (α Psc)", x: 65, y: 60, mag: 3.82 },
      { id: "eta-psc",  name: "Alpherg (η Psc)",  x: 40, y: 30, mag: 3.62 },
      { id: "gamma-psc",name: "γ Psc",            x: 25, y: 70, mag: 3.70 },
      { id: "omega-psc",name: "ω Psc",            x: 80, y: 35, mag: 4.01 },
      { id: "iota-psc", name: "ι Psc",            x: 30, y: 55, mag: 4.13 },
      { id: "tx-psc",   name: "TX Psc",           x: 18, y: 78, mag: 4.79 },
    ],
    edges: [
      ["alrescha","eta-psc"],["eta-psc","omega-psc"],
      ["alrescha","iota-psc"],["iota-psc","gamma-psc"],["gamma-psc","tx-psc"],
    ],
    brightestId: "eta-psc",
  }),
];

export function zodiacById(id: string): ZodiacLevel | undefined {
  return zodiacLevels.find((l) => l.id === id);
}
