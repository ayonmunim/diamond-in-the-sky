# Visual star missions — phase 2

Updated C1 / M1 / L1 and L2 only. Existing videos, music, progress saving, rewards, and other levels remain unchanged. No new dependencies were added.

## Play

Run `npm run dev`, open the address printed in the terminal, and visit:

- `/missions/what-is-a-star/meet-a-star` — drag four gas clouds into the center, drag the glowing gravity handle inward, watch the star appear, then touch the star to complete L1.
- `/missions/what-is-a-star/hydrogen-helium` — drag six hydrogen and two helium model bubbles into the cloud, pull the gravity handle into the core, watch hydrogen fusion, and touch the new star to complete L2.

Watch the existing video or choose **Skip Intro** to reach the interactive scene.

The main interactions use pointer capture for mouse, pen, and touch. Missed drops return the object to its original position; canceled gestures do not collect it. There is no timer or penalty. The restart icon resets the current activity without clearing saved progress.

## Design and learning

- Locally rendered, original pixel-style MISSION / LEVEL lettering and star indicators inspired by the supplied references. No external font download is required for these labels.
- An enlarged animated space scene replaces the previous text-led card layout. Interactive graphics are SVG/CSS, not a replacement video or pre-rendered 3D scene.
- The core responds to the gravity-handle drag; gas objects follow the pointer. A brief fusion animation ends with a directly selectable star.
- The speaker icon reads the current learning note using browser speech synthesis and the existing voice settings. The information icon opens the longer explanation and control instructions.
- Stars form much later than the Big Bang. Mixing gases alone does not create a shining star: gravity and a hot, dense core are needed. Hydrogen fusion produces helium and energy; helium already present in the cloud is not used as fuel for that step.
- Gas amounts, sizes, time, and the fusion animation are simplified models, not a literal scale or complete nuclear reaction simulation.
- Keyboard alternative: Tab to a cloud/particle or gravity handle, then press Enter or Space. A single-pointer alternative also works: select the object, then select the center. Touching the final star completes the level.
- Color is supported by H/He labels and accessible names. Reduced-motion preferences disable decorative motion. Narrow layouts may scroll vertically to keep controls usable.

## Undo only this visual phase

The exact previous text-led learning components are preserved in:

`.review-backup/c1-m1-visual-v2/`

Stop the development server. Save any later changes to these two component files before running the restore commands, because restoring overwrites them:

```powershell
Set-Location -LiteralPath 'D:\Munim\diamondinthesky'
Copy-Item -LiteralPath '.review-backup/c1-m1-visual-v2/StarLearningLab.tsx' -Destination 'src/components/StarLearningLab.tsx'
Copy-Item -LiteralPath '.review-backup/c1-m1-visual-v2/star-learning-lab.css' -Destination 'src/components/star-learning-lab.css'
npm run dev
```

This returns to the previous guided-learning design without undoing the piano music or local videos. The level route was not changed in this visual phase. Saved browser progress remains intact.

To return further back to the original quiz/fusion mini-games, follow `C1-M1-LEARNING-UPDATE.md` instead. Both backup folders are local files, not Git commits; preserve them when copying the project.

## Verification

Browser checks cover mouse dragging, missed drops, mobile touch dragging through Chromium touch input, canceled gestures, L1/L2 completion, saved progress, restart, keyboard and select-then-target alternatives, reduced motion, and no horizontal page overflow at 320, 390, and 768 pixels. This is browser emulation, not testing on physical phones.
