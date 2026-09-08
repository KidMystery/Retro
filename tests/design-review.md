# VALUARIA DESIGN REVIEW — LUNA NIGHT SHIFT, 2026-09-09

Read: App.tsx (1904L), zeldaWorldData.ts, questData.ts bosses, combatPuzzles.ts, curriculum tracks (olmstead/mcmillan/crypto/graham), DungeonView, ZeldaOverworldCanvas, TouchDPad, audioEngine.

## Act-by-act: what's boring

**Every act's overworld is the same map.** Acts 2–5 in `zeldaWorldData.ts` share a literally identical 20x14 tile string (only `T`→`#` swapped) with entities at identical coords (sage 3,2 / broker 8,2 / scammer 14,6 / asset 3,11 / shrine 2,6 / chest 17,2 / portal+boss 17,9 & 14,12). A player who finishes Act I has, spatially, already played Acts II–V. The dungeon mazes differ, but the hub does not. This is the #1 boredom engine: "walk to the same six tiles again, at act N."

**Entity-interaction loop repeats without variation.** Scammer → RugPull modal → (INVEST/DECLINE). Asset → choice modal. Shrine → save. Chest → florins. That's the same 3 modal shapes 5+ times per act. By Act IV the player is speed-walking past story content because the reward structure (florins/hearts) is constant and the market doesn't react to it.

**Act verbs are load-bearing but one-gimmick.** Verdict per verb:
- Act I torch-less vestibule: fine as tutorial; chart rooms (4× the same "read the tape" MCQ) are the weakest repeated loop.
- Act II spread-gates (`hasSpreadGates`, leg shrines at [1,6]/[7,3]): genuinely load-bearing — gates physically lock 75 tiles until BOTH legs placed. Good teaching overlap. But it's a one-shot: place 2 legs, done in 3 minutes, rest of dungeon is walking.
- Act III patrols (3 scammers, LOS): best verb — continuous threat, real skill (approach from behind). Underused: only 3 routes, speed static, no counter-play variety.
- Act IV torch (`torchDrainPerSec 0.014`, braziers): good *pressure*, zero *teaching* — the torch has nothing to do with Vega. It's a survival timer stapled to a vol lesson.
- Act V gauntlet: 4 identical rematch fights in sequence is padding, not escalation — same puzzles, same boss logic, only order enforced.

## Teaching vs game mechanics: the overlap gap

The game teaches through **quizzes at doors**, not through play. Sanctuary (Graham MCQ), mechanic gate (McMillan MCQ), chart rooms (chart MCQ), combat puzzles (3-choice MCQ) are four differently-skinned multiple-choice systems. The actual trade desk (Black-Scholes pricing, real greeks — `handleExecuteTrade`, `handleAdvanceDay`) is the most authentic mechanic in the game and *nothing on the map ever references your positions* except margin liquidation. The verbs of the dungeon (avoid patrols, manage torch, open gates) never require you to have opened — or priced — anything. That's the failing overlap: **game verbs test reflexes; quizzes test recall; the trading sim sits orphaned in a modal.** Boss HP/damage is scaled by portfolio risk (`getScaledEnemyStats(player, riskInfo.riskScore)`) — good — but that's the only thread from sim to world.

## Boss quality

Fights are puzzles in the right direction: weaknessStrategy/resistanceStrategy + tiered combatPuzzles with real explanations. But mechanically every fight is: answer MCQ → deal 42+16·chapter damage, wrong → −1♥. There is no per-boss *mechanical* difference — the Chrono-Sphinx's "Temporal Acceleration" and the Hydra's "IV Crush" special moves are flavor text, never enforced in code (combatEngine applies none of the `specialMove` strings). Vex's Kelly-based "Forced Liquidation" is likewise narrative. Bosses are quizzes with an HP bar, not fights with rules. Exception: Second Oracle's mirror rule IS mechanically enforced (App.tsx `handlePuzzleAttack` mirror branch) — proof the team knows how; do that five more times.

## Where a player quits

1. **Act III start** — identical overworld, same NPCs again, no new visible hook before the dungeon.
2. **Anywhere after a forced scam loss in the dungeon** (−350ƒ −0.5♥ with no way to fight back or avoid skillfully at speed 1.9).
3. **Proving Vault** — 60-day exam is a grind with no mid-exam variety.

## Single weakest system

The **static overworld**. It recycles one tilemap 5× with identical entity coordinates. Everything else has at least a per-act idea.

## What a real designer adds FIRST

1. **Companion character (Wren, the Oracle's Ledger given voice).** The ledger already witnesses every trade, scam, loss, and day advance — it has *everything to have opinions about*. A companion who disagrees with a naked long call at 80% IV, remembers you fell for the DogeTulip Goblin, and comments in Act V that you've stopped panicking costs almost nothing (event-driven dialogue lines) and converts the tutorial-sage monologues (6-line walls in `sage_graham.dialogue`) into a relationship. Highest impact per line-of-code in this repo.
2. Music identity: audioEngine already has overworld/battle/sanctuary loops; wire dungeon→its own track + a victory sting (small).
3. Make each boss's specialMove enforced (1 mechanic each).

Do #1 tonight. It is the soul pass.
