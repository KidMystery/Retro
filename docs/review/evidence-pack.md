# VALUARIA — VOLTRON REVIEW EVIDENCE PACK (9/16, blind round input)
# RULES OF ENGAGEMENT FOR REVIEWERS: You have NO stake in this project. If the honest verdict
# is "start over", say so plainly. The Narrative Bible is the invariant — the GAME is judged
# against it, not vice versa. Do not propose rewriting the story.

## 1. THE FOUNDER'S FRAMING (verbatim, the spec)
- Origin: "the bones of this game were the duolingo version of options which we never finished
  and i thought an adventure game would be better"
- "its gone through 4 iterations and none have completed or feel like they are right"
- Standing bar: "everything on the map should feel alive (see link to the past)" / SNES era,
  Chrono Trigger / ALttP feel explicitly named. "this is not zelda or a ALttp at least not yet"
- Asks made across playtests: candles charts (DONE), connective world map (Phase 1 shipped),
  world that feels alive, no spoiler menus, no answer-spam bosses, transaction history,
  map should be traversable across regions, sword not bow, NPC sprites not blobs.
- THE QUESTION: rebuild from scratch, or is the fixable core real? Weigh alternatives honestly.

## 2. WHAT EXISTS TODAY (verified, not aspirational)
- Stack: React + TypeScript + Vite, ~16.3K LOC src, 87 commits, deployed on Railway
  (retro-production-3c81.up.railway.app), e2e harness (tests/fullrun.cjs boot→NG+, zero-console-error gate).
- Playable loop VERIFIED end-to-end: title → overworld → 5 story acts w/ dungeons → bosses →
  Proving Vault (60-day drawdown sim) → ending → NG+ (mirror boss, bear regime) → second ending.
- Pedagogy: 44 lessons mapped to 5 regions (Ashen Acre foundations 8 / Glassmarket value 7 /
  Windglass options 17 / Longacre stewardship 8 / Shatterchain scams 4); source-backed trade
  encounters (Graham/Olmstead/McMillan extracts committed under tests/book-extracts).
- Systems: trade desk w/ Black-Scholes pricing + Greeks, positions & expiry settlement, margin +
  risk score + Kelly meter, decision ledger (HISTORY), badge system, scam/NPC encounters w/
  patrols, multi-floor raycaster dungeon (3 floors, gated ring, boss), combat w/ MCQ puzzles
  (anti-spam: shuffled options + boss tithe-heal on wrong answers), candles (realized OHLC tape,
  no lookahead), save/load + autosave, NG+, edge-door world map Phase 1 (Ashen↔Glassmarket,
  chapter-gated), SNES chrome (wood/gold panels, floor tints, ambient life: motes/clouds/sway).
- Playtest ledger: 4 human playtests, ~25 findings, EVERY finding fixed + verified same-cycle
  with commit hashes. Velocity: multi-milestone days are normal; costs near zero.

## 3. THE HONEST GAPS (as the founder experiences it)
- "Maps feel small" — regions are 20x14 tiles; world-map Phase 1 links only 2 of 5 regions.
- Feel: "pretty but not breathing" (improved: ambient pass) but "not Zelda or ALttP yet".
  Key structural critique: dungeons are a raycaster (Wolf3D-style pseudo-3D), NOT ALttP's
  top-down room-based 2D. The overworld is top-down tiles; the dungeon view is a different genre.
- Founder reports 4 project iterations total (including pre-Valuaria apps) that never completed
  or felt right. The current build is the farthest along by far.
- App.tsx is 2,400+ lines — a god-component holding routing/state/logic; refactoring debt is real.

## 4. THE INVARIANT (bible, not on trial)
- docs/narrative-bible-draft.md: Rowan Vale of Bramble Acre, the Great Rug-Pull, Oracle's Stone,
  the Red Herring; fail→learn→permanent-protection doctrine; multiple paths, same crown.
- docs/lesson-region-map.md: 44 runes across 5 regions, mentors Bram/Mira/Oren, guardians
  Tithe-Monger/Mirror Merchant/Two-Faced Wyvern/Vacant Manor/Red Herring.
- The engine choices, the code, the UI are ALL on trial. The story/curriculum spine is not.

## 5. ALTERNATIVES TO WEIGH (evaluate each against the bible + founder's bar)
A. CONTINUE current architecture to completion (finish world map, polish feel).
B. REBUILD dungeon layer as top-down 2D rooms (ALttP-faithful), keep overworld + all systems.
C. FULL REBUILD from scratch, same bible/curriculum, new engine choices (e.g. Phaser/PixelGameMap
   or Godot), port the curriculum data.
D. HYBRID/FREEZE: ship current build as "Act I complete" vertical slice, freeze scope, rebuild
   only the layers that fail the feel bar.
For each: cost estimate, risk, what survives, what dies, expected time-to-fun.

## 6. VERDICT FORMAT (every reviewer answers independently)
(a) Pedagogy fit 1-10 + one paragraph
(b) Architecture fit for the ALttP-feel bar 1-10 + one paragraph
(c) VERDICT: continue-and-fix / alternative-B / full-rebuild / freeze-slice — with reasoning
(d) Keep list (what survives any path) + Kill list
(e) If rebuild: what's the minimal correct core?
