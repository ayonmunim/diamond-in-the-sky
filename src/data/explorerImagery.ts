/** NASA Image Library IDs preserve provenance. Images include processed observations. */
export const explorerImagery: Record<string, { id: string; credit: string; kind: string }> = {
  moon: { id: "PIA00405", credit: "NASA / JPL / USGS", kind: "Galileo color composite" },
  earth: { id: "PIA18033", credit: "NASA / Suomi NPP", kind: "Satellite mosaic" },
  mercury: {
    id: "PIA12051",
    credit: "NASA / JHUAPL / Smithsonian / Carnegie",
    kind: "MESSENGER mosaic",
  },
  venus: { id: "PIA23791", credit: "NASA / JPL-Caltech", kind: "False-color Mariner 10 composite" },
  mars: { id: "PIA00407", credit: "NASA / JPL / USGS", kind: "Global color mosaic" },
  jupiter: {
    id: "PIA02873",
    credit: "NASA / JPL / University of Arizona",
    kind: "Cassini images projected onto a globe",
  },
  saturn: {
    id: "PIA11141",
    credit: "NASA / JPL / Space Science Institute",
    kind: "Cassini observation",
  },
  uranus: { id: "PIA18182", credit: "NASA / JPL-Caltech", kind: "Voyager 2 observation" },
  neptune: { id: "PIA01492", credit: "NASA / JPL", kind: "Voyager 2 filtered composite" },
  sun: {
    id: "GSFC_20171208_Archive_e002035",
    credit: "NASA / Goddard / SDO",
    kind: "Extreme-ultraviolet observation; assigned colors",
  },
  "orion-nebula": {
    id: "PIA04227",
    credit: "NASA / Hubble Heritage / STScI / AURA",
    kind: "Hubble detail of the Orion region",
  },
  andromeda: {
    id: "PIA04921",
    credit: "NASA / JPL / Caltech",
    kind: "GALEX ultraviolet observation",
  },
};

// Equatorial diameters in km, NASA NSSDCA planetary fact sheet.
export const planetDiameters: Record<string, number> = {
  mercury: 4879,
  venus: 12104,
  earth: 12756,
  mars: 6792,
  jupiter: 142984,
  saturn: 120536,
  uranus: 51118,
  neptune: 49528,
};

export const discoveryMissions = [
  { title: "Our cosmic home", ids: ["earth", "moon", "sun"] },
  { title: "Rocky world explorer", ids: ["mercury", "venus", "mars"] },
  { title: "Meet the giants", ids: ["jupiter", "saturn", "uranus", "neptune"] },
  { title: "Beyond our Sun", ids: ["alpha-centauri", "orion-nebula", "andromeda"] },
];
