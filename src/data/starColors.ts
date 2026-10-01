/**
 * Stellar spectral classes (O B A F G K M).
 * Temperatures from NASA Imagine the Universe spectral-class reference.
 */
export type SpectralClass = {
  klass: "O" | "B" | "A" | "F" | "G" | "K" | "M";
  color: string;
  cssColor: string;
  tempMin: number;
  tempMax: number;
  example: string;
  description: string;
};

export const spectralClasses: SpectralClass[] = [
  { klass: "O", color: "Blue",        cssColor: "oklch(0.72 0.18 245)", tempMin: 30000, tempMax: 60000, example: "Mintaka",    description: "Hottest, rarest, and most luminous main-sequence stars." },
  { klass: "B", color: "Blue-white",  cssColor: "oklch(0.80 0.12 235)", tempMin: 10000, tempMax: 30000, example: "Rigel",      description: "Hot, luminous stars often found in young clusters." },
  { klass: "A", color: "White",       cssColor: "oklch(0.95 0.02 230)", tempMin: 7500,  tempMax: 10000, example: "Sirius",     description: "Bright white stars with strong hydrogen lines." },
  { klass: "F", color: "Yellow-white",cssColor: "oklch(0.92 0.06 100)", tempMin: 6000,  tempMax: 7500,  example: "Procyon",    description: "Slightly hotter than the Sun, common in our neighborhood." },
  { klass: "G", color: "Yellow",      cssColor: "oklch(0.88 0.14 95)",  tempMin: 5200,  tempMax: 6000,  example: "Sun",        description: "Our Sun's class — calm, life-friendly stars." },
  { klass: "K", color: "Orange",      cssColor: "oklch(0.78 0.16 60)",  tempMin: 3700,  tempMax: 5200,  example: "Arcturus",   description: "Cool orange stars; many host exoplanet systems." },
  { klass: "M", color: "Red",         cssColor: "oklch(0.62 0.22 25)",  tempMin: 2400,  tempMax: 3700,  example: "Proxima Cen",description: "Coolest and most common stars in the galaxy." },
];
