/**
 * Notable stars used across Learn Mode fact cards.
 * Values follow widely-cited astronomy references summarized for ages 8-14.
 * Sources: NASA StarChild + NASA Imagine the Universe.
 */
export type StarFact = {
  id: string;
  category: "largest" | "smallest" | "hottest" | "coolest" | "brightest" | "nearest" | "fastest" | "fun";
  name: string;
  detail: string;
  value: string;
  sourceId: string;
};

export const starFacts: StarFact[] = [
  { id: "uy-scuti", category: "largest", name: "UY Scuti", detail: "One of the largest stars known — a red supergiant.", value: "≈ 1,700× Sun's radius", sourceId: "starchild_stars" },
  { id: "ogle-tr", category: "smallest", name: "OGLE-TR-122b", detail: "An extremely small red dwarf, barely larger than Jupiter.", value: "≈ 0.12× Sun's radius", sourceId: "starchild_stars" },
  { id: "wr102", category: "hottest", name: "WR 102", detail: "A Wolf-Rayet star — one of the hottest known.", value: "≈ 210,000 °C surface", sourceId: "imagine_timing" },
  { id: "wise0855", category: "coolest", name: "WISE 0855-0714", detail: "A failed star (brown dwarf) cooler than a kitchen oven.", value: "≈ -23 °C", sourceId: "starchild_stars" },
  { id: "sirius", category: "brightest", name: "Sirius", detail: "Brightest star in Earth's night sky.", value: "Apparent magnitude -1.46", sourceId: "starchild_stars" },
  { id: "proxima", category: "nearest", name: "Proxima Centauri", detail: "Closest star to our Sun.", value: "4.24 light-years away", sourceId: "starchild_stars" },
  { id: "s2", category: "fastest", name: "S2", detail: "Orbits the supermassive black hole at the Milky Way's center.", value: "≈ 24 million km/h at closest pass", sourceId: "imagine_timing" },
  { id: "sun-mass", category: "fun", name: "The Sun", detail: "1.3 million Earths could fit inside.", value: "1.989 × 10³⁰ kg", sourceId: "starchild_stars" },
  { id: "betelgeuse", category: "fun", name: "Betelgeuse", detail: "A red supergiant that could go supernova within 100,000 years.", value: "Diameter ≈ 1 billion km", sourceId: "starchild_stars" },
];
