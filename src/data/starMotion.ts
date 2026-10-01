/**
 * Proper motion vectors for nearby bright stars (mas/year, simplified).
 * Used by Chapter 4 ("Dancing Stars") and Chapter 5 ("Time Traveler").
 */
export type MotionStar = {
  id: string;
  name: string;
  x: number;        // 0..100 starting position
  y: number;
  vx: number;       // motion per 100 years (in % canvas)
  vy: number;
  magnitude: number;
  color: string;
};

export const motionStars: MotionStar[] = [
  { id: "barnard",   name: "Barnard's Star", x: 20, y: 30, vx:  4.2, vy: -3.1, magnitude: 9.5, color: "oklch(0.68 0.20 30)"  },
  { id: "kapteyn",   name: "Kapteyn's Star", x: 40, y: 60, vx: -2.7, vy:  2.0, magnitude: 8.8, color: "oklch(0.72 0.16 50)"  },
  { id: "sirius",    name: "Sirius",         x: 55, y: 45, vx:  0.6, vy: -0.5, magnitude: -1.5, color: "oklch(0.95 0.02 230)" },
  { id: "arcturus",  name: "Arcturus",       x: 70, y: 25, vx: -0.4, vy:  1.6, magnitude: -0.1, color: "oklch(0.78 0.16 60)"  },
  { id: "proxima",   name: "Proxima Centauri", x: 30, y: 75, vx: -1.8, vy: 0.4, magnitude: 11, color: "oklch(0.62 0.22 25)"  },
  { id: "vega",      name: "Vega",           x: 80, y: 55, vx: 0.2,  vy: 0.3, magnitude: 0.03, color: "oklch(0.95 0.02 230)" },
];
