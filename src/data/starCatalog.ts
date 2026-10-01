/**
 * Small mock catalog shaped like Kepler / TESS / BRITE target list rows.
 * The service layer reads from this today and can switch to a real
 * MAST / HEASARC query without changing call sites.
 */
export type CatalogEntry = {
  id: string;
  catalog: "Kepler" | "TESS" | "BRITE";
  designation: string;
  ra: number;       // degrees
  dec: number;
  magnitude: number;
  spectralClass: string;
  notes: string;
};

export const starCatalog: CatalogEntry[] = [
  { id: "kic-11904151", catalog: "Kepler", designation: "Kepler-10",    ra: 285.679, dec: 50.241, magnitude: 10.96, spectralClass: "G", notes: "Hosts Kepler-10b, first confirmed rocky exoplanet." },
  { id: "kic-10666592", catalog: "Kepler", designation: "HAT-P-7",      ra: 292.247, dec: 47.969, magnitude: 10.5,  spectralClass: "F", notes: "Hot Jupiter host star." },
  { id: "tic-261136679", catalog: "TESS",  designation: "Pi Mensae",    ra: 84.291,  dec: -80.469, magnitude: 5.65, spectralClass: "G", notes: "TESS mission's first confirmed exoplanet (Pi Men c)." },
  { id: "tic-410214986", catalog: "TESS",  designation: "TOI-700",      ra: 97.660,  dec: -65.578, magnitude: 13.1, spectralClass: "M", notes: "Hosts an Earth-sized planet in the habitable zone." },
  { id: "brite-hd148937", catalog: "BRITE",designation: "HD 148937",    ra: 248.235, dec: -48.099, magnitude: 6.77, spectralClass: "O", notes: "Massive magnetic O-type star observed by BRITE." },
  { id: "brite-betelg",   catalog: "BRITE",designation: "Betelgeuse",   ra: 88.793,  dec:  7.407,  magnitude: 0.50, spectralClass: "M", notes: "Red supergiant — long-term BRITE photometry." },
];
