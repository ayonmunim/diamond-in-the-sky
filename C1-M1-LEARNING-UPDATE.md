# C1 · M1 · L1–L2: guided star discoveries

This update changes only the activities after the existing videos in Chapter 1, Mission 1, Levels 1 and 2. Other levels, videos, music, and existing progress/rewards remain in place.

## Try it

Run `npm run dev` in `D:\Munim\diamondinthesky`. Open the local address printed in your terminal, then visit:

- `/missions/what-is-a-star/meet-a-star` — L1: expand the early universe, gather gas, warm the core, and tap the shining star to complete the level.
- `/missions/what-is-a-star/hydrogen-helium` — L2: tap six hydrogen and two helium model circles, explore three gravity-compression steps, discover fusion, and complete the level.

Watch the original video or use **Skip Intro** to try the activity immediately. These are untimed learning models, without wrong-answer penalties. Children can restart the discovery before completing it. The existing reward screen and level progression are retained. The level route now remounts its session when navigating to a different level so the next level starts at its video, not the previous reward screen.

## Learning and accessibility

- Stars formed much later than the Big Bang, from collapsing gas clouds.
- Mixing hydrogen and helium alone does not make a star: a sufficiently hot, dense core is needed for fusion.
- In this model, hydrogen is the fusion fuel and helium is the product; helium already in the cloud is not shown as fuel for hydrogen fusion.
- The eight circles illustrate more hydrogen than helium; they are not a literal atom count or a precise abundance ratio. Sizes and time are simplified.
- Large buttons work with touch, mouse, Enter, and Space; text labels accompany color, and step changes are announced to screen readers.
- **Read this to me** uses browser speech synthesis and respects Settings narration enable/volume. Available voices depend on the device.
- The layout stacks on narrow screens and allows vertical scrolling so learning content remains accessible. The new illustration respects reduced-motion preferences.

## Undo this phase without losing music or local videos

The exact pre-update route is saved at `.review-backup/c1-m1-learning-v1/level-route.tsx`. This folder is a local backup, not a Git commit. Keep a separate copy if moving the project.

Stop the development server. If you made any later edits to the level route, save them separately first: the following command overwrites that route with its pre-update version.

```powershell
Set-Location -LiteralPath 'D:\Munim\diamondinthesky'
Copy-Item -LiteralPath '.review-backup/c1-m1-learning-v1/level-route.tsx' -Destination 'src/routes/missions.$missionId.$levelId.tsx'
npm run dev
```

Restoring this one file switches L1 back to its original quiz and L2 back to its original fusion mini-game. It also restores the previous route lifecycle. The new `StarLearningLab.tsx` and `star-learning-lab.css` files can remain: they are no longer imported after restoration. Music, downloaded videos, other levels, and browser-saved progress are not reset.

## Code

- `src/components/StarLearningLab.tsx`: guided interactions, diagrams, optional narration, and completion.
- `src/components/star-learning-lab.css`: scoped responsive styling and reduced-motion support.
- `src/routes/missions.$missionId.$levelId.tsx`: limits the new activities to the two requested level IDs.

No dependencies were added.
