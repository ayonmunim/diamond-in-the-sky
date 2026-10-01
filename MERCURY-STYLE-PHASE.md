# Mercury-inspired styling — phase 4

## What changed

- Nova keeps her blue face, eyes, and smile. The updated white costume uses dark indigo seams, a blue chest control, and a yellow rocket plume, inspired by the supplied astronaut reference. The chest reads **Team Diamonds**.
- The homepage returns to its earlier centered arrangement: title, Nova, Explore planet, Learn/Play, footer; Home/Settings and Profile/Logbook stay at the sides.
- Navigation now uses glowing cratered planet controls with visible labels. Decorative game planets have crater/band details and the playfield has subtle curved nebula layers. Existing controls and all five Mission 1 activities are preserved.
- The interface uses locally bundled **Orbitron**, a close geometric sci-fi alternative to the screenshot's MERCURY lettering. This is not a verified identification of the original game's exact font. Mission/Level headings are no longer bitmap letters. Short explanatory text keeps a readable system font.
- Previous landscape guidance and viewport-fitting behavior remain. On short landscape screens the centered homepage uses smaller artwork so links remain accessible without page scrolling.

## Plugin access

The requested plugin-management skill was used. Searching the directory for National Geographic returned no integration. The public [Space Explorer page](https://kids.nationalgeographic.com/games/action-adventure/article/space-explorer), supplied screenshots, built-in image generation, and local code tools were enough for this phase. No plugin installation, login, or additional permission is required. The original game's code and graphic files were not imported.

This phase does not re-edit the original MP4s or add a recorded child voice; those outstanding production tasks remain as described in `NOVA-MISSION-PHASE.md`.

## Undo only this phase

Stop the dev server and run:

```powershell
& 'D:\Munim\diamondinthesky\UNDO-MERCURY-PHASE.ps1'
```

Then restart `npm run dev`. This restores the previous Nova sprite reference, homepage, font imports, and Mission/Level headings. Current versions of the four affected source files are first saved in a uniquely named `.review-backup/before-mercury-undo-*` folder. No videos, assets, music, or browser progress are deleted.

Backups: `.review-backup/mercury-style-v4/src/`. Keep that folder alongside the project. Run the phase-4 undo before an older phase undo if restoring multiple phases in reverse order.

## Asset and font provenance

- Sprite: `src/assets/nova-guide-v4.png`, edited using the built-in image-generation tool. The previous `nova-guide-v3.png` remains untouched.
- Font: `src/assets/orbitron.ttf`, from Google Fonts' `ofl/orbitron/Orbitron[wght].ttf`; license saved as `src/assets/orbitron-OFL.txt`.
- Styling: `src/mercury-phase.css`.

Image-generation prompt: “Edit target Image 1: Nova. Costume reference Image 2 only. Keep Nova blue face, eyes, smile and large head identity from Image1. Change ONLY suit styling and rendering of suit to the simpler white cartoon astronaut costume in Image2: dark indigo outlines, clean white padded arms/legs, white gloves/boots, small blue square chest control, backpack with small soft yellow rocket plume. Remove gold/blue suit stripes and oversized chest plate; use simple dark indigo seams, short compact cute astronaut body. Preserve face expression. On small chest badge write ‘Team Diamonds’. Transparent background actual alpha, complete full character inside image with margins, no scenery, no caption, no logo. Friendly original game sprite, not a screenshot. Keep blue face visible, do not cover it with the dark opaque visor from reference2.”
