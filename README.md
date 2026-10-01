# Diamond In The Sky

A space-learning game for children guided by Nova: animated lessons, interactive missions, a zoomable universe explorer, rewards and customization.

**Handoff status:** working frontend with TanStack Start server rendering. Authentication, a trusted gameplay API and a database are **not implemented**. Player state currently lives in browser storage. A production build alone does not make this ready for a public children's-service launch.

## Install and run — Windows, macOS, Linux

Install Git and Node.js **22.12+** (verified with Node 24). Use npm and the committed `package-lock.json`. The older Bun lockfile is retained for history, but npm is the supported handoff workflow.

```bash
git clone https://github.com/ayonmunim/diamond-in-the-sky.git
cd diamond-in-the-sky
npm ci
npm run dev
```

Open **http://127.0.0.1:5173**. This private repository requires GitHub access. Local videos are included, so cloning downloads several hundred MB. No database or application API keys are required for the current frontend. Ctrl+C stops the server.

Port 5173 is strict: if occupied, use `npm run dev -- --port 5180`. To test a phone on trusted Wi-Fi, use `npm run dev -- --host 0.0.0.0`, allow private-network firewall access, and open `http://YOUR-COMPUTER-LAN-IP:5173`. Never expose the dev server publicly. Browser profiles are origin-specific; changing host/port changes the local save location.

## Production

```bash
npm ci
npm run typecheck
npm run build
npm start
```

Open **http://localhost:3000**. Build uses Nitro's **node-server** preset, producing `.output/server/index.mjs` and `.output/public/`. Deploy the **entire `.output` directory** to a supported Node host/container. `npm start` runs the built server. This SSR application is **not a static GitHub Pages site**.

Custom production port in PowerShell:

```powershell
$env:PORT = "8080"
$env:HOST = "127.0.0.1"
npm start
```

macOS/Linux:

```bash
PORT=8080 HOST=127.0.0.1 npm start
```

For deployment, use a process manager/container behind HTTPS, caching and monitoring. Bind `HOST=0.0.0.0` only when network/container access is needed. Lovable's managed builds can override the Nitro preset; the Node instructions apply outside that managed environment.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install exact locked dependencies and build tools |
| `npm run dev` | Development on port 5173 |
| `npm run typecheck` | TypeScript validation |
| `npm run build` | Production client and server build |
| `npm start` | Production server, default port 3000 |
| `npm run preview` | Local Vite preview; not the deployed server command |
| `npm run lint` | Repository lint; legacy formatting debt may be reported |
| `npm run format` | Reformat files; review changes before committing |

GitHub Actions runs install, type checking and build on main pushes and pull requests. There is no committed complete end-to-end suite yet; earlier review tests and backups remain workstation-local.

## Stack and code structure

React 19, TypeScript, TanStack Start/Router, Vite 8, Nitro 3 beta, Tailwind CSS 4, Radix/shadcn-style UI, Framer Motion, Lucide, React Query, React Hook Form and Zod. Exact resolved versions are in `package-lock.json`. This is **not Next.js**. Upgrade framework/build dependencies together with route and production smoke tests.

| Location | Responsibility |
| --- | --- |
| `src/routes/` | File-based pages and route loaders |
| `src/components/` | Game scenes, Nova, HUD and interactions |
| `src/components/ui/` | Shared interface primitives |
| `src/data/` | Missions, chapters, facts and reward/catalogue definitions |
| `src/lib/game-store.tsx` | GameState, actions and browser persistence |
| `src/lib/audio.tsx` | Audio/music support |
| `src/services/` | Local dataset interfaces |
| `src/assets/` | MP4s, sprites, fonts and Figma graphics |
| `public/explorer/` | Celestial imagery |
| `src/styles.css`, component CSS | Theme, responsive layouts and motion |
| `src/server.ts`, `src/start.ts` | SSR entry/error handling and middleware |
| `vite.config.ts` | Framework plugins and Node build target |

Key components: `StarLearningLab`, `CinematicStoryScene`, `ColorMission`, `DistanceMission`, `FactArrow`, `UniverseExplorer`. Mission 4/5 introductions use live browser animation, not newly exported MP4s. Narration uses device speech-synthesis voices and game sound settings.

Main routes: `/`, `/missions`, `/missions/:missionId`, `/missions/:missionId/:levelId`, `/explore`, `/learn`, `/profile`, `/hangar`, `/settings`, `/create-star`. Earlier `/play` and `/story` flows remain. Preserve route/content IDs even when changing display titles.

## Frontend UI/UX handoff

- Preserve the dark space theme, Nova guidance, readable contrast and introduction → interaction → celebration flow.
- Reuse UI primitives and local fonts; licenses are included. Prefer scoped component CSS over broad global changes.
- Keep mouse, touch and keyboard support, visible focus, captions, replayable instructions and select-then-place alternatives to dragging.
- Honor reduced motion and voice/music settings. Autoplay and orientation locking depend on browsers; preserve portrait fallbacks.
- Test desktop, tablet, portrait phone and short landscape phone. Home/game scenes target viewport-fit layouts; check clipping, enlarged text and on-screen keyboards.
- Test completion, replay, refresh and rewards after changes. Distinguish approximate astronomy values from exact measurements; preserve source notes in phase documents.

## Backend / database handoff

Read [docs/BACKEND-HANDOFF.md](docs/BACKEND-HANDOFF.md). Current state uses localStorage key **`dits-game-state-v3`**. It is anonymous, editable by the player, not authenticated and not synced between devices.

Keep `useGame()` stable while introducing an API persistence adapter. The server must authorize profile access and calculate rewards rather than trust client balances. The linked guide describes proposed endpoints, tables, migration and idempotency; these are **not already implemented**.

No secrets belong in `VITE_*` variables or browser code. `.env*`, private keys, dependencies, build output and `.review-backup/` are ignored. Future credentials must be server-only deployment configuration.

## Assets and release checklist

Videos/assets are included in ordinary Git; Git LFS is not needed to clone. For repeated media updates, consider object storage/CDN to limit repository growth. Verify media/artwork permissions before public release; no blanket third-party asset license is implied.

Before launch: implement identity/persistence, review child privacy and safety with the responsible team, add integration/accessibility tests, verify content/media rights, measure loading performance and configure backups, security and observability.

## Rollback

Git history includes a baseline before the production handoff. Use `git log --oneline` and a reviewed `git revert <commit>`; avoid rewriting shared history or force pushing.

Older `UNDO-*.ps1` scripts require the original workstation's ignored `.review-backup` files. They **do not work on fresh clones** without those backups. Use Git rollback for shared work. Reverting source does not delete browser player data.
