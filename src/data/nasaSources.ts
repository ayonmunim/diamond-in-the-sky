/**
 * Central citation map. Every fact, dataset, and visualization in the game
 * is tagged with one of these sources. Display via the <SourceChip /> helper.
 *
 * The game uses NASA's open educational resources and public astronomy data.
 * It is NOT an official NASA product.
 */
export type NasaSource = {
  id: string;
  label: string;
  agency: "NASA" | "STScI" | "HEASARC" | "BRITE";
  url: string;
};

export const nasaSources: Record<string, NasaSource> = {
  starchild_stars: {
    id: "starchild_stars",
    label: "NASA StarChild — Stars",
    agency: "NASA",
    url: "https://starchild.gsfc.nasa.gov/docs/StarChild/universe_level1/stars.html",
  },
  starchild_cepheids: {
    id: "starchild_cepheids",
    label: "NASA StarChild — Cepheid Variables",
    agency: "NASA",
    url: "https://starchild.gsfc.nasa.gov/docs/StarChild/questions/cepheids.html",
  },
  imagine_timing: {
    id: "imagine_timing",
    label: "NASA Imagine the Universe — Timing & Variability",
    agency: "NASA",
    url: "https://imagine.gsfc.nasa.gov/science/toolbox/timing1.html",
  },
  imagine_cv: {
    id: "imagine_cv",
    label: "NASA Imagine the Universe — Cataclysmic Variables",
    agency: "NASA",
    url: "https://imagine.gsfc.nasa.gov/science/objects/cataclysmic_variables.html",
  },
  gcvs: {
    id: "gcvs",
    label: "HEASARC — General Catalog of Variable Stars (GCVS)",
    agency: "HEASARC",
    url: "https://heasarc.gsfc.nasa.gov/W3Browse/all/gcvs.html",
  },
  tess: {
    id: "tess",
    label: "NASA TESS — Transiting Exoplanet Survey Satellite",
    agency: "HEASARC",
    url: "https://heasarc.gsfc.nasa.gov/docs/tess/software.html",
  },
  kepler: {
    id: "kepler",
    label: "Kepler Mission Archive (MAST/STScI)",
    agency: "STScI",
    url: "https://archive.stsci.edu/missions-and-data/kepler",
  },
  brite: {
    id: "brite",
    label: "BRITE-Constellation Public Database",
    agency: "BRITE",
    url: "https://brite.camk.edu.pl/pub/index.html",
  },
};

export const NASA_ATTRIBUTION =
  "Built using NASA open educational resources and public astronomy references. Not an official NASA product.";
