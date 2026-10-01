# Missions 4–6: Nova science labs

This phase unlocks Missions 4, 5 and 6 in Chapter 1, including all five levels in each mission. It does not mark any level complete or grant rewards automatically.

## Story motion graphics

Every level opens with an app-native animated cutscene built from its own `storyBeats`. These are live React/Framer Motion scenes rather than new MP4 files. They use the same cinematic controls as the existing mission stories: captions, narration when voice is enabled, pause, replay, next scene, skip and start. Nova appears in every scene through the existing Nova animation templates.

- Mission 4: star color and surface-temperature clues.
- Mission 5: light-years, cosmic distance and apparent brightness.
- Mission 6: the Sun as a star, solar layers, magnetic activity and energy for Earth.

## Gameplay

All 15 existing concept-specific games remain intact—visual choice, sorting, matching, sequencing, memory and true-fact challenges—but now run inside one of three full-screen graphical environments:

- a blue-to-red stellar spectrum laboratory;
- an expanding cosmic-distance range;
- a layered animated solar laboratory.

Nova remains on the game screen. Selecting Nova shows a written science hint and reads it when voice is enabled. The game still supports touch, mouse and keyboard controls, saved progress, rewards and replay.

Primary science references used to check the concepts:

- NASA star color and temperature: https://science.nasa.gov/exoplanets/stars/
- NASA inverse-square distance activity: https://science.nasa.gov/wp-content/uploads/2023/09/Electromagnetic_Math.pdf
- NASA Sun facts and structure: https://science.nasa.gov/sun/facts/
- NASA solar storms: https://science.nasa.gov/sun/solar-storms-and-flares/

## Undo this phase only

```powershell
cd D:\Munim\diamondinthesky
powershell -ExecutionPolicy Bypass -File .\UNDO-MISSIONS-4-6-PHASE.ps1
```

The undo script first saves the current versions to a new safety folder, then restores the four files changed by this phase. New helper files remain unused. Player progress, videos, audio and other phases are not deleted.
