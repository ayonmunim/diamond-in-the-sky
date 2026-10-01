# Diamond In The Sky

An interactive astronomy-learning frontend built around Nova, a friendly star companion. Explore the universe, watch animated lessons, complete mission activities, and collect progress and rewards.

**Project directory:** `D:\Munim\diamondinthesky`

This README documents the source code in this directory. It is a frontend onboarding and design handoff guide, not a claim that production readiness or cross-browser testing has been completed.

## 1. Install and run

### Prerequisites

- Install [Node.js](https://nodejs.org/) 22.12 or newer on a supported even-numbered release line; Node 24 is a suitable setup choice. Vite documents a minimum of Node 20.19+ or 22.12+, but dependencies can impose higher requirements. See the [Vite setup guide](https://vite.dev/guide/).
- Install [Bun](https://bun.sh/) if using the repository's existing `bun.lock`. Bun is the preferred package manager for reproducible installs in this project.
- Use a modern browser and an internet connection for package downloads and Google Fonts. The ten mission MP4s are included locally in `src/assets`.
- An editor with TypeScript support, such as VS Code, is useful but not required.

### Recommended: Bun

Open PowerShell in the project directory:

```powershell
cd "D:\Munim\diamondinthesky"
node --version
bun --version
bun install --frozen-lockfile
bun run dev
```

The install command installs both application dependencies and development tools listed in `package.json`; there is no need to install React, Tailwind, or Vite separately.

Open the local URL printed by Vite. It is normally [http://localhost:5173](http://localhost:5173), but the configuration or another running server may change the port. Keep the terminal open while developing. Press **Ctrl+C** to stop the server.

If an intentional dependency change makes the lockfile outdated, run `bun install`, review the resulting lockfile changes, and keep them with that dependency change.

### Alternative: npm

Node includes npm:

```powershell
cd "D:\Munim\diamondinthesky"
node --version
npm --version
npm install
npm run dev
```

This checkout contains a Bun lockfile, not an npm lockfile. The first npm install resolves versions from `package.json` and creates `package-lock.json`; its dependency tree may differ from Bun's. Choose one package manager for ongoing work. Use `npm ci` only after a matching npm lockfile exists.

### macOS and Linux

Change to your actual project location, then use the same package-manager commands:

```bash
cd /path/to/diamondinthesky
bun install --frozen-lockfile
bun run dev
```

### Environment configuration

No application API keys or environment-variable files are currently required by the checked-in source. The NASA-style data service uses local datasets rather than a live NASA API.

The app still uses server rendering through TanStack Start. “No external backend setup” does not mean it is a plain static HTML project.

If future integrations require credentials, keep them in server-only code and excluded local environment files. Never put secrets in `VITE_*` variables, which may be exposed to browser code.

## 2. Commands and dependency management

| Purpose | Bun | npm |
| --- | --- | --- |
| Install dependencies | `bun install --frozen-lockfile` | `npm install` |
| Development server | `bun run dev` | `npm run dev` |
| Production build | `bun run build` | `npm run build` |
| Build in development mode | `bun run build:dev` | `npm run build:dev` |
| Preview an existing build | `bun run preview` | `npm run preview` |
| Lint | `bun run lint` | `npm run lint` |
| Format the whole codebase | `bun run format` | `npm run format` |
| Type-check without emitting files | `bunx tsc --noEmit` | `npx tsc --noEmit` |

Type checking is a direct tool command, not an existing package script. No automated test script is currently declared in `package.json`.

To add a dependency after deciding it is needed:

```bash
bun add package-name
bun add --dev package-name
```

For npm, use `npm install package-name` or `npm install --save-dev package-name`. Review the manifest and lockfile together.

`bunfig.toml` configures a 24-hour minimum release age for dependency installation with an explicit exception list. Follow the instructions in that file before changing exceptions. npm does not apply this Bun-specific setting.

## 3. Technical stack

Versions below are declared ranges in `package.json`, not a report of installed versions. The lockfile records resolved packages.

| Layer | Technology | Role |
| --- | --- | --- |
| UI | React / React DOM `^19.2.0` | Components, hooks, rendering |
| Language | TypeScript `^5.8.3` | Strict typing; ES2022 target |
| Application framework | TanStack Start `^1.167.50` | Server-rendered React application |
| Routing | TanStack Router `^1.168.25` | File-based routes and typed navigation |
| Query infrastructure | TanStack Query `^5.83.0` | Query client supplied through the root |
| Bundler | Vite `^8.0.16` | Development server and builds |
| Framework configuration | `@lovable.dev/vite-tanstack-config` `2.13.1` | Integrated Vite/framework plugins |
| Server build | Nitro `3.0.260603-beta` | Server output and deployment target integration |
| Styling | Tailwind CSS / Vite plugin `^4.2.1` | Utility classes and CSS theme tokens |
| UI primitives | Radix UI and local shadcn-style components | Dialogs, menus, forms, tabs, and controls |
| Motion | Framer Motion `^12.40.0`; CSS keyframes | Scene transitions, hover/tap effects, animated characters |
| Icons | Lucide React `^0.575.0`; custom SVG | Interface icons and cartoon graphics |
| Forms | React Hook Form `^7.71.2`, Zod `^3.24.2`, Hook Form resolvers | Form state and validation tooling |
| Charts | Recharts `^2.15.4` | Chart components |
| Feedback | Sonner `^2.0.7` | Toast tooling |
| Class composition | `clsx`, `tailwind-merge`, `class-variance-authority` | Conditional classes and variants |
| Code quality | ESLint 9, typescript-eslint, Prettier 3 | Linting and formatting |

Other declared UI dependencies include Embla Carousel, Vaul, cmdk, react-day-picker, react-resizable-panels, input-otp, and date-fns. Availability as a dependency does not imply every package is used on every screen.

This is **not a Next.js application**. Do not introduce Next.js route, layout, or `server-only` conventions into this project.

## 4. Codebase structure

```text
diamondinthesky/
├── src/
│   ├── assets/                 Local mission MP4s and original Lovable metadata
│   ├── components/
│   │   ├── ui/                 Reusable UI primitives
│   │   ├── Nova.tsx            Animated star companion
│   │   ├── SpaceScene.tsx      Stars, nebulae, and decorative planets
│   │   ├── UniverseExplorer.tsx  Interactive astronomical-scale explorer
│   │   ├── CinematicStoryScene.tsx  Mission video/animated introduction
│   │   ├── LessonMovie.tsx     Animated lesson player
│   │   ├── MiniGame.tsx        Seven activity variants
│   │   └── RewardScreen.tsx    Mission reward presentation
│   ├── data/                   Lessons, missions, facts, badges, and astronomy content
│   ├── hooks/                  Shared React hooks
│   ├── lib/
│   │   ├── game-store.tsx      Player state and browser persistence
│   │   ├── audio.tsx           Web Audio effects/music
│   │   ├── rand.ts             Seeded randomness
│   │   └── utils.ts           cn() class-name helper
│   ├── routes/                 File-based pages and root shell
│   ├── services/
│   │   └── nasaDataService.ts  Async interface over local astronomy datasets
│   ├── router.tsx              Router and QueryClient initialization
│   ├── routeTree.gen.ts        Generated route tree; do not edit manually
│   ├── start.ts                Request middleware
│   ├── server.ts               Server entry and SSR error handling
│   └── styles.css              Theme, typography, utilities, and animations
├── components.json             UI component configuration and aliases
├── vite.config.ts              Lovable/TanStack/Vite configuration
├── tsconfig.json               TypeScript settings and @/* alias
├── eslint.config.js            ESLint rules
├── .prettierrc                 Formatting rules
├── bunfig.toml                 Bun install policy
├── bun.lock                    Bun dependency lockfile
├── package.json                Dependencies and runnable scripts
└── AGENTS.md                   Project-specific collaboration instructions
```

### Where to make common changes

| Change | Start here |
| --- | --- |
| Landing page | `src/routes/index.tsx` |
| App providers, metadata, fonts | `src/routes/__root.tsx` |
| Brand palette, gradients, typography | `src/styles.css` |
| Nova's appearance and interaction | `src/components/Nova.tsx` |
| Space backdrop / cartoon assets | `SpaceScene.tsx`, `CartoonIcon.tsx` |
| Mission content and game configuration | `src/data/starMissions.ts`, `src/data/universe.ts` |
| Video/scene definitions | `src/data/cinematicStories.tsx`, `src/data/lessonMovies.tsx` |
| Activity implementation | `src/components/MiniGame.tsx` |
| Rewards, unlocks, persistence | `src/lib/game-store.tsx` |
| Astronomy data access | `src/services/nasaDataService.ts` |

## 5. Routes and application flow

| URL | Experience |
| --- | --- |
| `/` | Nova landing page, Explore portal, Learn and Play links |
| `/explore` | Interactive universe scale explorer |
| `/learn`, `/learn/$lesson` | Lesson selection and playback |
| `/missions` | Chapter and mission selection |
| `/missions/$missionId` | Mission's levels |
| `/missions/$missionId/$levelId` | Cinematic → activity → reward |
| `/story`, `/story/$chapter` | Story chapters |
| `/play`, `/play/$level` | Existing numbered-level gameplay |
| `/quiz` | Quiz experience |
| `/dashboard`, `/profile` | Progress and player profile |
| `/hangar`, `/create-star` | Customization and star creation |
| `/settings` | Player preferences |
| `/educators`, `/about` | Supporting information |

`$lesson`, `$missionId`, and other dollar-prefixed names represent dynamic route parameters. See `src/routes/README.md` for routing conventions.

The root shell provides TanStack Query, player state, and audio initialization. Route components compose reusable UI and local content. Player actions update the game store, which saves to browser storage.

The mission activity dispatcher supports **quiz, fuse, sequence, sort, match, memory, and tap**. Add new content through the typed game configuration where possible; add a new activity component and configuration variant only when a new mechanic requires one.

## 6. Styling and brand design

### Visual identity

The current design uses a dark space background, layered nebula gradients, glowing stars, rounded panels, and a cartoon companion. The main brand is **Diamond In The Sky**.

The theme is defined in `src/styles.css` using OKLCH color values and Tailwind v4's CSS-first `@theme inline` mapping:

| Token | Current value | Intended use |
| --- | --- | --- |
| `--background` | `oklch(0.07 0.02 275)` | Deep-space canvas |
| `--primary` | `oklch(0.74 0.18 265)` | Primary UI accents |
| `--accent` | `oklch(0.70 0.24 315)` | Magenta emphasis |
| `--gold` | `oklch(0.88 0.16 88)` | Starlight and rewards |
| `--radius` | `1.25rem` | Rounded component foundation |

Use semantic classes such as `bg-background`, `text-primary`, `text-gold`, and `border-border`. Adjust shared tokens for a brand-wide change rather than scattering replacement colors across components.

Existing utilities include `glass`, `glass-strong`, `bubble`, `toon-card`, `toon-text`, gradient text, and glow effects. CSS keyframes provide twinkling, floating, bobbing, blinking, and portal animation.

### Typography

- Display stack: **Baloo 2 → Fredoka → Space Grotesk → system UI**.
- Body stack: **Nunito → Inter → system UI**.
- Google Fonts stylesheets are loaded by `src/routes/__root.tsx`.
- Use `font-display` for titles and the configured body font for supporting text.

### Component styling

`components.json` specifies the shadcn-style **new-york** preset, slate base color, CSS variables, TypeScript, and Lucide icons. Reuse the local `src/components/ui` components before adding competing component libraries.

Use `cn()` from `@/lib/utils` to combine conditional Tailwind classes. Keep page-specific styling scoped to that page or component.

Formatting rules: 100-character print width, semicolons, double quotes, and trailing commas. TypeScript is strict; the `@/` import alias points to `src/`.

## 7. UI/UX and responsive frontend guidelines

These are development and acceptance guidelines, not a completed accessibility audit.

- Keep the main action obvious: Explore on the homepage; start/continue on missions.
- Preserve a clear learning sequence: introduction → interaction → feedback → reward.
- Keep labels short, use understandable instructions, and provide retry/replay paths.
- Make primary touch controls approximately 44 × 44 CSS pixels or larger.
- Provide keyboard access, visible focus, accessible names for icon buttons, and logical focus handling for dialogs.
- Do not communicate success or failure through color alone.
- Keep captions readable; narration should supplement visible instructions.
- Respect reduced-motion preferences when adding animation. Avoid excessive flashing and constantly moving text.
- Design mobile-first with flexible grid/flex layouts and test portrait and landscape orientations.
- Use dynamic viewport units where appropriate, but remember that `min-h-dvh` allows content to grow and scroll. The current homepage is not a verified no-scroll layout at all screen sizes.
- Do not hide required content with `overflow: hidden` merely to remove scrollbars. At small sizes or increased text zoom, preserve access to navigation and controls.
- Check at least 320px and 390px phone widths, tablet sizes, laptop widths, and wide desktop screens. Test browser zoom and long content as well as the default view.

## 8. Data, media, and persistence

- `nasaDataService.ts` currently wraps local datasets in asynchronous functions. Its name does not indicate a live NASA connection.
- Player progress uses React context and `localStorage` under `dits-game-state-v3`.
- Local progress is specific to a browser profile and origin. Switching ports, browsers, or devices does not share that progress. Clearing site data removes it.
- No authentication, cloud database, or cross-device synchronization is configured in this checkout.
- Ten mission MP4 files are stored in `src/assets` and imported by `src/data/cinematicStories.tsx` through Vite's `?url` handling. The original asset JSON files are retained as source metadata. The videos are served locally in development and included in the production build.
- To restore missing MP4 files from the original Lovable preview, run `node scripts/download-mission-videos.mjs`. The script verifies expected byte sizes and MP4 headers. Downloads depend on the original preview remaining available; existing complete files are skipped.
- Background music is the original “Little Star Voyage” piano-style score in `src/lib/space-piano.ts`, synthesized with Web Audio. Settings control music on/off and volume; changing volume does not restart the melody. Playback begins after a user gesture and stops while the browser tab is hidden.
- The application also uses Web Audio for sound effects and browser speech synthesis for narration. Voice availability varies across platforms.
- Keep browser-only APIs inside effects, event handlers, or guarded client code because the application renders on the server too.
- Use deterministic initial rendering for generated star fields and other random visuals to avoid server/client hydration differences.

## 9. Frontend development workflow

1. Install dependencies with the selected package manager and start the dev server.
2. Find the route, content file, or shared component responsible for the change.
3. Reuse existing theme tokens and UI primitives.
4. Keep content in `src/data`, shared behavior in `src/lib` or hooks, and rendering in components.
5. For new pages, follow TanStack file-based routing; let tooling regenerate `routeTree.gen.ts`.
6. Clean up animation frames, timers, event listeners, and narration when leaving a screen.
7. Check loading, empty, failure, retry, and completion states where relevant.
8. Run lint, type checking, and a production build before handing off.

`vite.config.ts` already receives React, TanStack Start, Tailwind, path aliases, and other integrations from the Lovable configuration package. Do not manually add duplicates. Nitro's default target is documented there as Cloudflare; review that configuration before choosing hosting.

## 10. Build, preview, and release checks

```powershell
cd "D:\Munim\diamondinthesky"
bun run lint
bunx tsc --noEmit
bun run build
bun run preview
```

With npm, use `npm run` instead of `bun run`, and `npx tsc --noEmit` for type checking.

The preview command serves a built application locally; it is not a production deployment. Because this is TanStack Start with a server build, do not assume that uploading a client assets folder alone will deploy the complete application. Inspect the build output and target configuration for the chosen host.

Before calling the frontend release-ready:

- Verify installation, lint, type checking, build, and preview in this checkout.
- Test direct navigation and refresh on nested routes.
- Test mission completion, replay, rewards, level navigation, and persisted progress.
- Check hosted video loading, audio controls, and captions.
- Review keyboard, touch, focus, contrast, and reduced-motion behavior.
- Check Chrome/Edge, Firefox, Safari, and mobile browsers as available.
- Verify metadata and social preview assets in the root route.
- Review third-party media licensing and attribution for the actual assets shipped.

**Validation status for this README:** documentation was checked against source files and package scripts. Dependencies were not installed and runtime/build checks were not run as part of this documentation-only update. No automated test runner is configured.

## 11. Troubleshooting

| Symptom | What to check |
| --- | --- |
| `bun` or `node` is not recognized | Install the runtime, reopen the terminal, and check its version |
| Node engine compatibility error | Check the installed Node version against Vite and dependency requirements |
| Frozen lockfile install fails | Check whether `package.json` and `bun.lock` match; update deliberately if needed |
| PowerShell blocks `npm.ps1` | Use `npm.cmd install` and `npm.cmd run dev` |
| Port is occupied | Read Vite's printed URL or run `npm run dev -- --port 5174` |
| Unresolved imports | Install dependencies in this folder and verify the `@/` alias and filename casing |
| Missing movie or font | Check local MP4 files in `src/assets`; restore them with the download script if needed. Fonts still require external network access |
| No audio | Interact with the page, check game settings, and check browser autoplay permissions |
| Progress appears missing | Check browser profile, hostname, port, and whether site storage was cleared |
| SSR or hydration error | Check server logs, browser-only API use, and random initial rendering |
| Works locally but not on hosting | Verify server deployment target and nested-route behavior |

## 12. Lovable and project history

This project is connected to Lovable. Follow `AGENTS.md`: do not rewrite published history by force-pushing or rebasing/amending/squashing already-pushed commits. Pushed commits on the connected branch sync to Lovable, so keep that branch working.

Keep dependencies and generated build output out of source control according to `.gitignore`. Commit source changes and the chosen package manager's lockfile together.
