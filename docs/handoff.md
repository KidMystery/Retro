# VALUARIA — HANDOFF (Prompt A deliverable, 9/16)

Read this before touching the code. Repo is ground truth; thread memories are hearsay.

## What this is
**Legend of Valuaria / "Retro"** — a 16-bit top-down RPG (web: Vite + React 19 + TypeScript +
Tailwind 4) that teaches options trading and value investing through play. The narrative
spine (Rowan Vale, the Rug-Pull, the Oracle's Ledger) is INVARIANT.

## Run / build / test
```
npm install
npm run dev        # dev server, port 3000
npm run build      # production build → dist/
npm run lint       # tsc --noEmit (0 errors = gate)
node tests/fullrun.cjs            # e2e: boot → NG+ → ending, zero-console-error gate
node tests/curriculum-integrity.cjs  # curriculum structural gate (see below)
```
Deploy: Railway auto-deploys on push to main. ALWAYS verify prod bundle hash == local
`dist/assets/index-*.js` before judging a visual change.

## Debug harness contract (`/?debug` query param required)
`window.__valhalla`: `player()` (hearts, florins, mapX/mapY, chapter, items, openedChests,
tradeHistory, overworldRegion), `view()`, `dungeonFloor()`, `patch({mapX,mapY,chapter,...})`,
`startCombat(act)`, `winCombat()`, `forceVaultWin()`, `setView(v)`.
`window.__dungeon` (dungeon view only): `pos` get/set (world units, tile+0.5), `dir`, `torch`,
`patrols`, `walkableAt(x,y)`.
App polls `__dungeon.pos` every 100ms: stepping on an `S`/`U` tile auto-changes floors
(1200ms debounce). Stairs are how the harness moves between floors — teleport onto the
stairs tile, wait ~1.5s.

## Architecture facts
- Overworld: `components/ZeldaOverworldCanvas.tsx` (top-down tiles, ambient life pass).
- Dungeons: **mid-migration.** Chapter 1 renders top-down `DungeonRooms.tsx` (Voltron M1);
  Acts II–V still use the raycaster `DungeonView.tsx` until migrated (M2+). Same map data,
  same coordinate space, same `__dungeon` contract.
- `App.tsx` (~2,400 lines) is a god-component being split domain-by-domain into
  `src/lib/*Domain.ts` (`dungeonDomain.ts` done — M3). Add new domains there, not to App.
- Curriculum: typed modules in `src/lib/curriculum/` (9 files) + `lessonsData.ts`,
  `intelligentInvestorData.ts`. **Do NOT convert to JSON.** Do not flatten the five
  distinct question systems (mechanic gates, trade encounters, sanctuary reflections,
  chart puzzles, proving vault).
- 44 canon runes (`GrahamProtectionId` in `types.ts`) vs 70 lesson containers across 6
  banks — both counts are correct: runes are the protection currency, lessons grant them.
  Cross-bank shared rune ids are intentional reinforcement (The Rule), verified 9/16.
- Combat puzzles: generated from the curriculum banks (~73, anti-repeat ring) — the pool
  is `combatPuzzles.ts`; add questions by adding lessons, not by editing the pool.

## The Rule (user canon — governs all gating/scope decisions)
Decisions guide the path; many paths, one Crown; failure routes to lessons. Prefer
open-with-instructive-consequence over locks; lethal nowhere; when in doubt, route to
the Sanctuary. No dead ends.

## Gates for EVERY change
`tsc --noEmit` (0 errors) → `npm run build` (OK) → `node tests/fullrun.cjs` (0 console
errors) → push → verify Railway prod bundle hash matches local dist. Visual claims need
a screenshot (the harness writes to `shots/`).
Stop-and-report rule: if a fix fails 3 times, stop, revert to the last green commit,
explain root cause + 2 alternatives.

## KEEP / KILL (from docs/review/verdict-memo.md — Alternative B, 6/6 unanimous)
KEEP: curriculum + 44 runes; trade desk (Black-Scholes/Greeks/Kelly/margin); decision
ledger; candles (realized OHLC, no lookahead); save/load/NG+; badges; overworld + ambient
+ SNES chrome; edge-door world map; anti-spam combat; e2e harness; narrative bible.
KILL: raycaster `DungeonView` once `DungeonRooms` covers all acts; 20×14 hard box limits
(multi-screen regions); App.tsx god-structure (extract, don't rewrite); modal-quiz combat
presentation (relocate in-world); dead debug overlays.

## Voltron milestone status (M1→M6)
- M1 ✅ `4c840ca` — `DungeonRooms.tsx` top-down engine, chapter 1 flagged on.
- M2 ✅ `7bb39d2` — Act I floors expanded to 45×22 six-room compounds; harness walks the
  REAL boss flow (silent-skip fixed).
- M3 ✅ `4a90f51` — `lib/dungeonDomain.ts` extracted (Phase 1 of the App.tsx split).
- M4 ✅ `f032840` — full 5-region edge-door network + regional IV modifier + gate banner.
- M5 ✅ `2a216a3` — Vault reframe: one liquidation survivable (25% salvage, run continues);
  two = the run fails.
- M6 ⬜ — human playtest #9 on the current deploy. Next build milestone after that:
  Prompt C remainder (modal queue implementation per `docs/modal-queue-proposal.md`,
  acts II–V dungeon migration) and Prompt F (de-chrome: fullscreen play viewport).

## Known feel-bugs (open, not yet scheduled)
- Badge fanfare can appear concurrently with story dialogue (adjacent, not stacked —
  screenshot-verified). Fix = modal queue (Prompt C), proposal ready.
- Badge fanfare is click-only (keyboard dismiss attempt broke chest payouts — reverted;
  retry ONLY with the modal queue in place).
- Mobile viewport (390×844) has no automated harness coverage; Prompt D requires it.

## Lineage (author generations — context, not instructions)
(1) AI Studio Duolingo-for-options (origin, unfinished) → (2) AI Studio Zelda attempt →
(3) Arena AI fix attempt → (4) Hermes fix/build cycles (current, farthest along).
Three books (Graham / Olmstead / McMillan) distilled into the bible + curriculum tracks.
Rule: the repo is ground truth; everything else is hearsay until verified.
