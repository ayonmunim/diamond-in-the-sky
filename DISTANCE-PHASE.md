# Nova's distance adventures

Scope: Mission 4 Level 5 fact arrows; Mission 5 Levels 1–5, introductions, awards and two hub titles. Other missions retain their gameplay. Existing URLs remain stable even where a level title changed.

## Controls

- M4 L5 / M5 L5: choose True or False, launch the arrow carrying a waving fact note, wait for delivery, then continue or retry. Nova congratulates correct deliveries. Mission 5 contains four facts; Mission 4 retains five. Restart cancels an active flight.
- M5 L1: select the Earth or star journey, pick a useful unit (km / ly), then drag the ruler to the end. Both units can express either distance; the activity teaches choosing a convenient one. Earth towns are imaginary, 100 km apart. Each ruler uses its own scale.
- M5 L2: drag the distance slider through near (10), middle (100), and far (1,000) light-years. It uses a logarithmic scale. The received-light percentage follows the inverse-square law for the same unobscured star. Visual brightness is compressed so the distant star remains findable.
- M5 L3: move the size slider through small, medium and giant. A drawing symbol reveals a round textured star. At fixed temperature and distance, luminosity scales with radius squared. This is a comparison, not real-time stellar evolution.
- M5 L4: drag all ten objects to labeled distance bands, or tap an object then its band. Keyboard users can select buttons with Tab and Enter. Distances and hints are available on each card through Nova. The sphere is a compressed schematic, not actual sky positions or a linear scale. Milky Way width has a separate size dock.
- Sliders support arrow keys, Home and End. Touch, mouse and keyboard controls are supported.

## Story media

The five introductions are live 2D browser animations using the existing local Figma texture, space background and Nova character. They have subtitles, scene progression, pause, replay, skip and device speech-synthesis narration following game voice settings. They are not exported or re-edited MP4 files. The NASA black-hole animation was reviewed as a scientific reference, not embedded or presented as a Nova video.

## Scientific references

Approximate educational values, not precise/current ephemerides:

- [NASA: What is a light-year?](https://science.nasa.gov/exoplanets/what-is-a-light-year/) — about 9.46 trillion km per light-year and galactic scales.
- [NASA: Moon facts](https://science.nasa.gov/moon/facts/) — 384,400 km average Earth–Moon distance.
- [NASA: Earth facts](https://science.nasa.gov/earth/facts/) — about 149.6 million km from Earth to Sun.
- [NASA: Mars Relay Network](https://science.nasa.gov/mars/mars-relay-network/) — Earth–Mars distance changes, roughly 54.6–400.2 million km.
- [NASA: Sirius](https://science.nasa.gov/asset/hubble/the-dog-star-sirius-and-its-tiny-companion/) — 8.6 light-years.
- [NASA: Polaris companion](https://science.nasa.gov/asset/hubble/hubble-images-polariss-companion/) — about 430 light-years; estimates vary.
- [NASA: Andromeda](https://science.nasa.gov/photojournal/andromeda/) — about 2.5 million light-years.
- [NASA: Proxima b](https://science.nasa.gov/exoplanet-catalog/proxima-centauri-b/) — nearby exoplanet around Proxima Centauri; about 4.25 light-years for the system.
- [NASA: Black-hole animation](https://svs.gsfc.nasa.gov/14335/) and [its explanation](https://www.nasa.gov/universe/nasa-animation-sizes-up-the-universes-biggest-black-holes/) — Sagittarius A* about 26,000 light-years away, used instead of an unjustifiably exact 26,670.

Light-year conversions use 9.4607 trillion km. Milky Way's approximately 100,000 light-years is its diameter, not distance from Earth (we live inside it).

## Undo

From `D:\Munim\diamondinthesky`:

```powershell
powershell -ExecutionPolicy Bypass -File .\UNDO-DISTANCE-PHASE.ps1
```

Restores the three changed existing source files from `.review-backup/distance-v11` after saving a safety copy. New files remain unused, and player progress/media are not deleted. Run before subsequent edits to those same files; the restore replaces entire files. Undo newer phases before older ones.
