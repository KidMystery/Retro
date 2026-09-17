# VOLTRON VERDICT — Valuaria Scrap-vs-Continue Review (9/16)
Round: 6 independent reviewers, blind, identical evidence pack (docs/review/evidence-pack.md).
Panel: gemini-3.8-flash (pedagogy authority, paid), nemotron-3-super-120b (brain seat),
laguna-s-2.1 (code), ling-3.0-flash-sante (finance/math), mercury-2.5 (PM synthesis),
deepseek-v4-flash-0731 (fresh eyes). Full verdicts: docs/review/blind-round.json.

## THE VERDICT — 6/6 CONVERGENCE: ALTERNATIVE B
**Do NOT start from scratch. DO rebuild the dungeon layer as top-down 2D rooms (ALttP-faithful). Keep the overworld and every other system.**

| Reviewer | Pedagogy | Arch (ALttP bar) | Verdict |
|---|---|---|---|
| gemini-3.8 (Pedagogy Authority) | 9/10 | 4/10 | B |
| nemotron-super (Brain seat) | 9/10 | 4/10 | B |
| laguna-s (Code) | 7/10 | 4/10 | B |
| sante (Finance/math) | 9/10 | 3/10 | B |
| mercury (PM synthesis) | 9/10 | 5/10 | B |
| deepseek-v4-flash (Fresh Eyes) | 9/10 | 4/10 | B |

Zero divergence on the verdict. Zero divergence on the culprit.

## WHY (the convergence, in one paragraph each)
**Pedagogy: the moat is real.** All six independently scored pedagogy 7-9/10. The 44-rune
curriculum, source-backed encounters, fail→learn doctrine, anti-spam combat, decision ledger,
and Proving Vault drawdown sim are named the project's true asset. Gemini (Vals #1): "pedagogy
drives game verbs rather than sitting in separate encyclopedia popups." No reviewer proposes
touching the story or curriculum.

**Architecture: the dungeon is the sin.** All six scored the ALttP-feel bar 3-5/10 and named
the SAME culprit unprompted: the Wolf3D-style raycaster dungeon is a genre rupture against the
top-down overworld — "two different games stitched together" (sante), "a fatal stylistic
rupture" (gemini), "corridors, not spaces" (laguna). Secondary convergent critique: App.tsx
god-component (2,400 lines) slows feel iteration; regions feel small (20x14, 2/5 linked).

**Why not full rebuild (C):** every reviewer independently rejected it — the verified
boot→NG+ loop, 16.3K LOC of working systems, and 4 closed playtest cycles are too much real
value to discard; a rebuild "guarantees project death" (gemini) and "resets the iteration
count to zero" (mercury).

**Why not continue-and-fix (A):** polish cannot fix a genre contradiction — "no amount of
ambient motes will make a raycaster feel like Chrono Trigger" (gemini); "polishing a raycaster
dungeon produces a finished version of the wrong feeling" (deepseek).

## ASK-VS-DELIVERED LEDGER (founder's asks vs present state)
| Ask | Status |
|---|---|
| Adventure game beats Duolingo version | DELIVERED — playable loop, verified e2e |
| 44-lesson curriculum in-world | DELIVERED — source-backed, reviewers 7-9/10 |
| Feels alive / ALttP bar | PARTIAL — overworld yes, dungeon NO (genre mismatch) |
| Candlestick charts | DELIVERED (realized OHLC, no lookahead) |
| Connective world map | PHASE 1 of 2 delivered (2/5 regions linked) |
| No spoiler menus / no A-spam / trade history | DELIVERED (all fixed+verified) |
| Maps feel bigger | IN PROGRESS (edge doors; dungeon rebuild changes the feel math) |
| Completed iteration that feels right | NOT YET — this review says the path exists |

## EXECUTION PLAN (Alternative B, phased — each phase gated + deployable)
- **M1 — Dungeon room engine prototype**: reuse the overworld's top-down tile renderer for one
  ALttP-style room (4x4 room grid, edge-scroll transitions, collision from existing isSolid).
  Gate: playable single room + fullrun green.
- **M2 — Migrate Act I dungeon** (3 floors → top-down rooms; encounters/boss repositioned;
  MCQ puzzles re-skinned as in-world door/sphinx challenges per gemini's note).
  Gate: fullrun + playtest.
- **M3 — App.tsx domain split** (routing/state/logic modules; rides alongside, not before).
- **M4 — World map Phase 2** (regions 3-4-5 links + regional IV modifier).
- **M5 — Vault reframe** (liquidation tolerance, council-converged) + label pass.
- **M6 — Playtest #9** on the rebuilt dungeon.
Estimates from panel: 2-3 focused sprints (gemini) / 2-3 weeks solo-dev (nemotron) /
4-6 sprints w/ tooling (sante). With current velocity (same-day milestones): ~1-2 weeks.

## KEEP (survives every path)
Curriculum + 44 runes + source extracts; trade desk (BS/Greeks/Kelly/margin); decision ledger;
candles; save/load/NG+; badges; overworld + ambient + SNES chrome; edge-door world map;
anti-spam combat; e2e harness; narrative bible characters.

## KILL
Raycaster dungeon renderer + its camera/movement math; 20x14 hard box limits (multi-screen
streaming zones); App.tsx god-component structure; modal-quiz combat presentation (moves
in-world); dead debug overlays.

## HONEST CAVEATS
- laguna scored pedagogy 7/10 (others 9) — its note: mechanics modeled but not yet EMBODIED
  in Rowan's narrative arc. Flagged for the dungeon rebuild's encounter design.
- sante: Windglass's 17 lessons outmass their region's narrative weight — rebalance in M2+.
- deepseek: some encounters are "answer gates, not dramatized lessons" — fixable in current design.
- If the top-down room engine cannot deliver discrete-screen navigation + gating, the honest
  fallback is sante's: call it a different game. That's the kill-switch criterion.
