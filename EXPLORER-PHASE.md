# Explore Universe — review phase 5

Project: D:\Munim\diamondinthesky. Run `npm install`, then `npm run dev`, and open `/explore` at the address printed by Vite.

## Included

- Frame-rate independent eased wheel, trackpad, keyboard and slider travel through the existing 17 scales.
- Touch vertical drag and two-finger pinch in the universe journey. Reduced-motion preference disables travel easing.
- Twelve locally stored NASA observational images/composites, with object-specific credit and processing labels. Other objects remain explicitly labelled illustrations.
- Four discovery checklists using the existing saved discoveries and one-time 5-XP reward.
- Planet comparison lab: eight planetary circle diameters share one km-per-CSS-pixel ruler. Spacing, photo framing and rings are not scientifically scaled. Wheel/slider zoom and sideways touch browsing.
- Planet width relative to Earth, information-card Escape handling and focus restoration.

## Sources and boundaries

The Figma science-panel reference informed the compact stat-card grouping; existing project branding and components are retained. The attached screenshot informed the separate size-comparison lab.

Interaction inspiration: https://scaleofuniverse.com/en . Its complete database, artwork and text were not copied. The existing 43-object astronomy catalog remains; this is not a full reproduction of that site's collection or a WebGL 3D simulation. Motion uses layered images and scale transitions.

Planet diameters: https://nssdc.gsfc.nasa.gov/planetary/factsheet/ (equatorial values, not mean diameters).

NASA image IDs, credit and processing types: `src/data/explorerImagery.ts`. Originals are stored under `public/explorer`; source record links are displayed in the game. Do not describe ultraviolet or false-color composites as naked-eye true-color photographs.

## Undo this phase only

From PowerShell in the project folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\UNDO-EXPLORER-PHASE.ps1
```

The script restores the previous explorer component from `.review-backup/explorer-v5`, and saves the current component in a new safety folder first. Added assets/helpers remain unused so nothing is deleted. Saved discoveries, other pages, Nova, videos and music remain unchanged. Restart the dev server if necessary.
