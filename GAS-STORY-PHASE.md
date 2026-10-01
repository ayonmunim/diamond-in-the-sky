# C1 M1: Big Bang and gas discovery

Only L1 and L2 have changed in this phase. L3–L5 retain the previous activities.

L1 opens directly in a three-scene 2D animation built with React, CSS and Framer Motion: the hot expanding universe, neutral atoms about 380,000 years later, and gas clouds hundreds of millions of years later. Scenes advance automatically with pause, next, skip, narration and restart controls. This is a video-style in-game scene, not an exported MP4; original media files are preserved.

L2 keeps its existing intro video, then shows the new gas-selection activity. Hover or keyboard focus announces the gas name using the browser speech engine when voice is enabled. On mobile, tapping selects the gas and provides spoken/caption feedback. The voice depends on the device; no recorded child voice is included.

Select hydrogen and helium from four labelled gas options. Correct choices animate into the central cloud. Oxygen/nitrogen give a gentle explanation without a penalty. Once both gas types are identified, activate gravity to see the collapse, hot core, fusion and star stages, then touch the star to finish. This identifies gas types, not equal amounts of gas. The first star-forming clouds were mostly hydrogen, with helium and traces of other light elements. Oxygen and nitrogen options are present-day comparison cards, not a depiction of the early universe's actual inventory.

Scientific references:
- https://science.nasa.gov/mission/webb/science-overview/science-explainers/what-were-the-first-stars-like/
- https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-big-bang/
- https://science.nasa.gov/universe/stars/

Stars did not form during the Big Bang. The chronology is compressed for learning; gravity and suitable core conditions are necessary, and simply mixing gases does not cause stellar fusion. The first-star formation date is uncertain.

## Undo

```powershell
cd D:\Munim\diamondinthesky
powershell -ExecutionPolicy Bypass -File .\UNDO-GAS-STORY-PHASE.ps1
```

This saves the current entry component and route, then restores their previous versions. New helpers remain unused. Videos, saved progress and other phases are not deleted.
