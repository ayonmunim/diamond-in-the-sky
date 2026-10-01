/**
 * Constellation patterns with normalized 0-100 coordinates (x: right, y: down)
 * and the canonical connect order. Star coordinates are simplified for
 * gameplay — true J2000 positions live in `starCatalog.ts` for reference.
 */
export type Constellation = {
  id: string;
  name: string;
  story: string;
  origin: string;
  stars: { name: string; x: number; y: number }[];
  edges: [number, number][]; // index pairs
  sourceId: string;
};

export const constellations: Constellation[] = [
  {
    id: "big-dipper",
    name: "The Big Dipper",
    story: "Part of Ursa Major, the Great Bear. Sailors and travelers have used it for centuries to find the North Star.",
    origin: "Northern hemisphere — visible all year.",
    sourceId: "starchild_stars",
    stars: [
      { name: "Alkaid",  x: 10, y: 30 },
      { name: "Mizar",   x: 22, y: 35 },
      { name: "Alioth",  x: 35, y: 40 },
      { name: "Megrez",  x: 48, y: 48 },
      { name: "Phecda",  x: 56, y: 70 },
      { name: "Merak",   x: 78, y: 72 },
      { name: "Dubhe",   x: 80, y: 50 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],
  },
  {
    id: "orion",
    name: "Orion the Hunter",
    story: "The mighty hunter of the sky. His three-star belt is one of the easiest patterns to spot.",
    origin: "Visible from almost everywhere on Earth in winter.",
    sourceId: "starchild_stars",
    stars: [
      { name: "Betelgeuse", x: 30, y: 20 },
      { name: "Bellatrix",  x: 70, y: 22 },
      { name: "Mintaka",    x: 38, y: 50 },
      { name: "Alnilam",    x: 50, y: 52 },
      { name: "Alnitak",    x: 62, y: 54 },
      { name: "Saiph",      x: 70, y: 82 },
      { name: "Rigel",      x: 30, y: 80 },
    ],
    edges: [[0,2],[2,3],[3,4],[4,1],[2,6],[4,5],[0,1]],
  },
  {
    id: "cassiopeia",
    name: "Cassiopeia",
    story: "The vain queen — five stars forming a clear letter W (or M) in the sky.",
    origin: "Named after a queen in Greek mythology.",
    sourceId: "starchild_stars",
    stars: [
      { name: "Caph",      x: 12, y: 40 },
      { name: "Schedar",   x: 30, y: 60 },
      { name: "Gamma Cas", x: 50, y: 30 },
      { name: "Ruchbah",   x: 70, y: 60 },
      { name: "Segin",     x: 88, y: 35 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4]],
  },
  {
    id: "scorpius",
    name: "Scorpius",
    story: "A giant scorpion with the red supergiant Antares as its heart.",
    origin: "Best seen on summer nights from the northern hemisphere.",
    sourceId: "starchild_stars",
    stars: [
      { name: "Antares",   x: 50, y: 50 },
      { name: "Graffias",  x: 30, y: 30 },
      { name: "Dschubba",  x: 40, y: 35 },
      { name: "Pi Sco",    x: 25, y: 40 },
      { name: "Tail-1",    x: 65, y: 60 },
      { name: "Tail-2",    x: 78, y: 72 },
      { name: "Shaula",    x: 88, y: 80 },
    ],
    edges: [[3,1],[1,2],[2,0],[0,4],[4,5],[5,6]],
  },
  {
    id: "ursa-major",
    name: "Ursa Major",
    story: "The Great Bear — one of the largest constellations, containing the Big Dipper.",
    origin: "Recognized across nearly every culture on Earth.",
    sourceId: "starchild_stars",
    stars: [
      { name: "Dubhe",  x: 80, y: 50 },
      { name: "Merak",  x: 78, y: 72 },
      { name: "Phecda", x: 56, y: 70 },
      { name: "Megrez", x: 48, y: 48 },
      { name: "Alioth", x: 35, y: 40 },
      { name: "Mizar",  x: 22, y: 35 },
      { name: "Alkaid", x: 10, y: 30 },
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
  },
  {
    id: "southern-cross",
    name: "The Southern Cross",
    story: "The compass of the southern sky — used by sailors to find south.",
    origin: "Seen only from the southern hemisphere.",
    sourceId: "starchild_stars",
    stars: [
      { name: "Acrux",   x: 50, y: 85 },
      { name: "Gacrux",  x: 50, y: 15 },
      { name: "Mimosa",  x: 80, y: 50 },
      { name: "Imai",    x: 22, y: 50 },
    ],
    edges: [[0,1],[2,3]],
  },
];
