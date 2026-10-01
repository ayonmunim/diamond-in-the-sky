
# Diamond In The Sky — Endless Universe Phase 1

The vision is enormous (88 constellations, avatars, spaceships, friends, shared galaxies, infinite missions). I'll build a strong **Phase 1 vertical slice** that proves the full loop end-to-end, with data-driven systems so new missions/levels plug in without rewrites. Everything stays front-end with dummy data (no backend yet).

## What ships in Phase 1

### 1. Universe → Missions → Levels architecture
- New data model `src/data/universe.ts` — `Universe → Mission[] → Level[]` with typed scenes, challenges, rewards. Designed so future missions (Planets, Moons, Black Holes, JWST...) drop in as new `Mission` entries.
- Mission Hub route `/missions` — animated map of mission planets (Constellations unlocked, others "Coming Soon" with shimmering lock).
- Mission detail `/missions/$missionId` — level trail (12 zodiac levels) with progress, locks, brightest-star bonus markers.

### 2. Zodiac Constellation Mission (12 levels)
Orion, Leo, Cancer, Gemini, Scorpio, Sagittarius, Aquarius, Pisces, Aries, Taurus, Virgo, Capricorn. Each level:
- **Story Phase** — reuses the existing `LessonMovie` cinematic player with constellation-specific scenes (mythology + science + Nova narration + captions + music).
- **Gameplay Phase — Connect the Stars** — `ConstellationDraw.tsx` canvas: drag between real star coordinates, correct edges light up gold, wrong edges shake. Completion triggers Nova celebration + line glow animation.
- **Brightest Star Challenge** — multiple choice over the constellation's stars (Rigel/Antares/Regulus/Aldebaran etc.). Correct = bonus gems.
- **Rewards Phase** — `RewardScreen.tsx` with gem burst, XP bar fill, badge unlock card, "Next Level" portal.

### 3. Reward + progression systems
- Extend `game-store` with: `gems`, `xp`, `rank`, unlocked `avatarItems[]`, unlocked `shipParts[]`, completed `levels[]`, earned `badges[]`. Persisted to `localStorage`.
- Rank ladder: Cadet → Explorer → Navigator → Astronomer → Starborn (XP thresholds).
- Reward tables per level in data, so designers can tune without touching components.

### 4. Avatar & Spaceship scaffolding
- `/profile` — Nova-themed explorer profile: avatar preview (SVG, swappable hair/eyes/helmet/suit/backpack/pet), unlocked items grid, equip/unequip.
- `/hangar` — Spaceship builder: swap engine, wings, color, lights, trail (all SVG). Locked parts shown greyed with the level that unlocks them.
- Phase 1 ships ~6 items per category as dummy unlockables tied to zodiac level completion.

### 5. Create Your Own Star (social seed)
- `/create-star` route: sliders for mass, temperature, color, size, rotation, brightness; name + story textarea; live SVG preview reacts in real time.
- Saved to `myStars[]` in store, shown in `/profile` nursery.
- "Pair with a friend's star" UI present but stubbed (binary orbit preview using a second dummy star) — full friends backend deferred.

### 6. Friends (local mock)
- `/friends` route with seeded mock friends (Luna, Atlas, Vega, Orion Jr). Visit friend galaxy → see their dummy stars orbiting. Pre-defined message bubbles ("Great job!", "Awesome star!"). No real networking — clearly a local mock layered so a real backend can replace it later.

### 7. Home hub refresh
- Update `/` planet portals: Adventure → `/missions`, Create Star → `/create-star`, Hangar → `/hangar`, Profile → `/profile`, Friends → `/friends`, Learn (existing), Settings.
- Persistent HUD: gems 💎, XP bar, rank badge, Nova companion.

## Out of scope for this phase (acknowledged, deferred)
- Real backend / accounts / multiplayer (no Lovable Cloud yet — would need user opt-in).
- Remaining 76 constellations + Planet/Moon/BlackHole/JWST missions (data model ready; just add entries).
- Recorded VO + licensed music (Web Speech API + procedural audio continue).
- PixiJS/Phaser/Lottie engines (Framer Motion + SVG continue to hit 60fps for this scope).

## Technical details

```
src/
  data/
    universe.ts            # Mission/Level types + registry
    zodiac.ts              # 12 constellations: stars, edges, brightest, lore, scenes
    avatarItems.ts         # hair/eyes/helmet/suit/backpack/pet catalog
    shipParts.ts           # engine/wings/lights/trail catalog
    ranks.ts               # XP thresholds
  components/
    ConstellationDraw.tsx  # SVG canvas, drag-to-connect, validation
    BrightestStarChallenge.tsx
    RewardScreen.tsx       # gem burst, XP fill, badge unlock
    GemHud.tsx, XpBar.tsx, RankBadge.tsx
    AvatarPreview.tsx, ShipPreview.tsx
    StarForge.tsx          # create-your-own-star sliders + live SVG
    FriendCard.tsx, MessageBubble.tsx
  routes/
    missions.index.tsx
    missions.$missionId.tsx
    missions.$missionId.$levelId.tsx   # story → play → reward flow
    create-star.tsx
    profile.tsx
    hangar.tsx
    friends.tsx
    friends.$friendId.tsx
  lib/game-store.tsx       # extended: gems, xp, rank, unlocks, myStars, persistence
```

Level flow is a single route with phase state (`story | play | bonus | rewards`) so transitions stay cinematic without page reloads.

Reply **approve** to build, or tell me what to cut/add (e.g. "skip Friends for now", "start with 4 zodiac levels not 12", "add Planets mission too").
