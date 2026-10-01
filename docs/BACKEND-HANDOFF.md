# Backend and database handoff

## Implemented today

`src/lib/game-store.tsx` defines `GameState`, `GameProvider` and `useGame()`. It hydrates browser localStorage key `dits-game-state-v3` after SSR. There is no authenticated account, database or trusted reward service. Dataset services read local astronomy content.

State includes completed missions/lessons/chapters, best level stars, stars/coins/gems/diamonds/XP balances, badges, avatar/ship inventory and equipment, discoveries, custom stars/constellations, streaks and sound/caption settings. Mission progress keys use `missionId:levelId`. Preserve IDs and distinguish best scores from accumulated rewards.

## Proposed API (not implemented)

Authenticate requests and derive ownership from the session. Validate bounded payloads with shared schemas, rate-limit mutations and provide structured recoverable errors.

| Endpoint | Responsibility |
| --- | --- |
| `GET /api/v1/me/game-state` | Canonical state, schema version and revision |
| `POST /api/v1/level-attempts` | Start an attempt for a known content version |
| `POST /api/v1/level-attempts/:id/complete` | Validate completion and atomically grant server-calculated rewards |
| `PATCH /api/v1/me/settings` | Validate volumes 0–1 and boolean settings |
| `POST /api/v1/me/discoveries` | Idempotent discovery of known object IDs |
| `PUT /api/v1/me/equipment` | Check item ownership and valid slot |
| `POST /api/v1/me/created-stars` | Store validated star parameters and bounded text |
| `POST /api/v1/me/constellations` | Store bounded text and validated points |
| `GET /api/v1/catalog` | Optional versioned curriculum/media metadata |

Completion example: `{ "idempotencyKey": "uuid", "contentVersion": "v1", "interactionSummary": {...} }`. Resolve the level from the attempt; never accept reward amounts from the browser. Use a transaction and unique award/idempotency key, so retries return the same result without a duplicate award. Define replay rewards explicitly. Client interaction evidence is untrusted and cannot prove genuine learning by itself.

## Proposed relational schema (not a migration)

| Table | Fields / constraints |
| --- | --- |
| `accounts` | Auth identity; adult ownership distinct from child display profiles where applicable |
| `player_profiles` | UUID, account FK, display name, revision, timestamps |
| `player_settings` | Profile unique FK, sound/caption booleans, volumes checked 0–1 |
| `content_levels` | Unique stable mission/level IDs, chapter ID, version, enabled status |
| `level_attempts` | UUID, profile/content/version, start/completion time and outcome |
| `level_progress` | Unique profile/mission/level, best stars 0–3, first/last completion |
| `reward_ledger` | Profile, event/attempt ID, currency, integer delta, unique award key |
| `player_balances` | Unique profile/currency, transactional cache of ledger totals |
| `player_badges` | Unique profile/badge ID and earned time |
| `player_inventory` | Unique profile/item/type and unlock provenance |
| `player_equipment` | Unique profile/category/slot; owned item reference |
| `lesson_progress`, `chapter_progress` | Unique profile/content ID and completion time |
| `discoveries` | Unique profile/object ID and timestamp |
| `created_stars` | Owner FK, validated model parameters, bounded name/story, timestamps |
| `constellations` | Owner FK, bounded text, validated points JSON |

PostgreSQL is a possible choice, not an installed dependency. Use foreign keys, ownership indexes, UTC timestamps and a documented streak-day timezone policy. Plan migrations, encrypted backups, retention and restore drills.

## Integration sequence

1. Agree on identity, child profile ownership, content versions and replay rewards.
2. Implement shared request/response types, API authorization and idempotency tests.
3. Add a persistence adapter behind `useGame()` without rewriting visual components.
4. Add loading/offline/retry/conflict states; avoid overwriting server state with SSR defaults.
5. Offer explicit guest-state import, with bounded schema validation and repeat-import protection. Never mint trusted currency from arbitrary localStorage.
6. Test logout, account switching, refresh, two-device conflicts, duplicate completions, interruptions and deleted profiles.

Use revision checks or per-resource versions for concurrent changes. Sanitize/limit user text and render it safely. Avoid collecting unnecessary personal data. Public child profiles, chat, ads and tracking require separate product/privacy review; this document is not legal certification.

## Acceptance checklist

- Cross-profile reads/writes are denied.
- Duplicate completion requests grant rewards once.
- Client-edited balances are ignored; canonical server state wins.
- Stable content IDs survive display-title changes.
- Equipment requires ownership and valid slots.
- Guest import cannot be repeated to farm rewards.
- Deletion and backup-retention policies are defined.
- Media, captions and narration remain usable with the deployment architecture.
- Monitoring excludes secrets and sensitive child content.
- Frontend errors are understandable and recoverable without lost progress.
