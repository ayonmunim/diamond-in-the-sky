/**
 * NASA data service. Today this reads from local mock data structured to
 * mirror NASA/STScI/HEASARC/BRITE responses. Every function is async so
 * it can be swapped to a live HTTP fetch without touching call sites.
 *
 * Sources:
 *  - NASA StarChild              https://starchild.gsfc.nasa.gov
 *  - NASA Imagine the Universe   https://imagine.gsfc.nasa.gov
 *  - HEASARC GCVS                https://heasarc.gsfc.nasa.gov/W3Browse/all/gcvs.html
 *  - Kepler Mission Archive      https://archive.stsci.edu/missions-and-data/kepler
 *  - TESS                        https://heasarc.gsfc.nasa.gov/docs/tess/software.html
 *  - BRITE                       https://brite.camk.edu.pl/pub/index.html
 */
import { constellations } from "@/data/constellations";
import { lightCurves } from "@/data/lightCurves";
import { motionStars } from "@/data/starMotion";
import { starCatalog } from "@/data/starCatalog";
import { spectralClasses } from "@/data/starColors";
import { starFacts } from "@/data/starFacts";

const wait = <T>(v: T, ms = 0) => new Promise<T>((r) => setTimeout(() => r(v), ms));

export const nasaDataService = {
  getStarBrightness: () => wait(starFacts.filter((s) => s.category === "brightest" || s.category === "fun")),
  getVariableStars:  () => wait(lightCurves.filter((c) => c.type === "cepheid" || c.type === "cataclysmic" || c.type === "eclipsing-binary")),
  getConstellations: () => wait(constellations),
  getLightCurves:    () => wait(lightCurves),
  getStarMotion:     () => wait(motionStars),
  getKeplerData:     () => wait(starCatalog.filter((s) => s.catalog === "Kepler")),
  getTessTargets:    () => wait(starCatalog.filter((s) => s.catalog === "TESS")),
  getBriteStars:     () => wait(starCatalog.filter((s) => s.catalog === "BRITE")),
  getSpectralClasses:() => wait(spectralClasses),
  getStarFacts:      () => wait(starFacts),
};
