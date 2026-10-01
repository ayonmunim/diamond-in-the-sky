/**
 * Sample variable-star light curves. Shapes are characteristic of the type
 * rather than exact measurements — the structure mirrors what a real
 * Kepler/TESS query would return so the service layer can swap to live data.
 */
export type LightCurve = {
  id: string;
  star: string;
  type: "cepheid" | "eclipsing-binary" | "cataclysmic" | "exoplanet-transit";
  periodDays: number;
  sourceId: string;
  // Each point: { time (days), brightness (normalized 0..1) }
  points: { t: number; b: number }[];
};

function gen(period: number, fn: (phase: number) => number, n = 80, sourceId: string, id: string, star: string, type: LightCurve["type"]): LightCurve {
  const points = Array.from({ length: n }, (_, i) => {
    const t = (i / n) * period * 2;
    const phase = (t % period) / period;
    return { t: +t.toFixed(3), b: +fn(phase).toFixed(3) };
  });
  return { id, star, type, periodDays: period, sourceId, points };
}

export const lightCurves: LightCurve[] = [
  // Cepheid: sharp rise, slow decline
  gen(5.4, (p) => {
    const x = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8;
    return 0.4 + 0.55 * x;
  }, 80, "starchild_cepheids", "delta-cep", "Delta Cephei (Cepheid)", "cepheid"),

  // Eclipsing binary
  gen(2.87, (p) => {
    const dip1 = Math.exp(-Math.pow((p - 0.0) / 0.04, 2)) * 0.55;
    const dip2 = Math.exp(-Math.pow((p - 0.5) / 0.04, 2)) * 0.35;
    return 1 - dip1 - dip2;
  }, 100, "kepler", "algol", "Algol (Eclipsing Binary)", "eclipsing-binary"),

  // Cataclysmic outburst
  gen(40, (p) => {
    if (p < 0.05) return 0.95;
    if (p < 0.2) return 0.95 - (p - 0.05) * 3;
    return 0.3 + Math.sin(p * Math.PI * 8) * 0.05;
  }, 120, "imagine_cv", "ss-cyg", "SS Cygni (Cataclysmic)", "cataclysmic"),

  // Exoplanet transit
  gen(3.5, (p) => {
    const dip = Math.exp(-Math.pow((p - 0.5) / 0.02, 2)) * 0.05;
    return 1 - dip;
  }, 120, "tess", "wasp-12b", "WASP-12 b transit", "exoplanet-transit"),
];
