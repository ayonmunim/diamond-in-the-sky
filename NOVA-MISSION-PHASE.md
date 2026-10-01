# Nova companion, Mission 1, and landscape layout

## Implemented in this phase

- A reference-matched Nova astronaut sprite with `Team Dimonds` on the suit and a `NOVA` name tag above it. Nova replaces the old star companion wherever the existing Nova component is used, appears as a help control inside Mission 1, and provides contextual guidance on other journey pages.
- Removed the Story / Discover / Reward strip from level screens. The Mission / Level indicators remain inside the game scene.
- Mission 1 has five direct-manipulation learning activities: L1 cloud gathering and gravity; L2 hydrogen/helium gathering and gravity; L3 hydrogen fusion in a hot core; L4 energy travelling to the surface; L5 cloud formation, gravity, fusion, then light release. Complete each by touching the star.
- The homepage and Mission 1 activity area use the available viewport rather than a long page. Landscape phone styles reduce controls and graphics to fit short screens. Reward content is reduced on short landscape screens. Large text zoom and other mission types may still need further accessibility/layout review.
- A fullscreen/landscape control requests browser-supported rotation. Portrait phones/tablets get rotation guidance with an accessible “Continue in portrait” fallback. Websites cannot force hardware rotation in every browser. See [MDN orientation support](https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock).
- Pixelify Sans is bundled locally for the interface, alongside the custom pixel Mission/Level lettering. Font license: `src/assets/pixelify-sans-OFL.txt`; source: Google Fonts `ofl/pixelifysans`.

Visual direction references [National Geographic Kids Space Explorer](https://kids.nationalgeographic.com/games/action-adventure/article/space-explorer): astronaut-led exploration and a space-playfield presentation. No proprietary game assets were copied from that site.

## Not implemented: actual video re-editing

You explicitly requested scene-level character replacement in the MP4 files, not a UI overlay. The ten original MP4s have therefore **not been changed**, and no overlay is presented as a video edit. A video-editing/generation workflow or editable scene sources are needed to replace the character throughout each video.

The requested recorded childlike girl narration has **not** been produced or inserted into the MP4s. Existing audio is preserved. Nova's in-game help uses available device speech synthesis; its voice is device-dependent and is not a guaranteed child voice. A suitable voice recording or TTS/video production service is required for the requested soundtrack. Subtitle text remains available in `src/data/cinematicStories.tsx` for that future production step.

## One-command undo

Stop the development server, open PowerShell, and run:

```powershell
& 'D:\Munim\diamondinthesky\UNDO-NOVA-PHASE.ps1'
```

Then restart `npm run dev` from the project folder. This restores the exact previous phase: L1/L2 visual activities, old Nova, previous layout and typography. Before restoring, the script saves the current affected files into a uniquely named `.review-backup/before-nova-undo-*` folder so later edits are not lost. It does not delete videos, music, new asset files, or browser-saved progress.

If PowerShell blocks the local script under its execution policy, inspect the script and run it for this process only:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File 'D:\Munim\diamondinthesky\UNDO-NOVA-PHASE.ps1'
```

Originals are in `.review-backup/nova-mission-v3/src/`. The undo command restores eight backed-up source files; new files become unused after restoration and can stay safely on disk. Keep the backup folder with the project. This is a local backup, not a pushed Git commit.

## Character asset provenance

Asset: `src/assets/nova-guide-v3.png`. Generated with the built-in image-generation tool using the user's Nova image as the identity reference. The original generated file is retained in the generation output folder.

Prompt: “Use case: background-extraction / identity-preserve. Create one game character sprite of Nova based precisely on the attached reference: happy round glossy blue face, large cute black-white eyes, white space suit with blue trim, antenna, waving hand, floating pose. Preserve character identity and polished kid-friendly 3D cartoon rendering. Full character visible centered with generous small margins; transparent background with actual alpha, no scenery, no ground, no UI or caption. Replace chest emblem with legible exact words ‘Team Dimonds’ (spelled D-i-m-o-n-d-s) on a white rectangular chest badge. No text above head (the game renders the Nova name separately). Project-bound reusable sprite for ages 6–12.”
