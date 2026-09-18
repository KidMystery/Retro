# Modal Queue Proposal

## 1. Priority Ladder
0. ProvingVault (endgame cutscene — owns the screen once started)
1. Combat (halts all non-critical UI) — z-50
2. RugPullLesson (scam lesson — same class as Sanctuary)
3. Sanctuary (protects save progress)
4. Story-Dialogue (requires immediate attention)
5. Mechanic-Gate z-70 (prevents broken state)
6. Chart-Puzzle (locks input focus)
7. Trade-Encounter z-70 (finalizes asset swaps)
8. UndervaluedAsset (asset discovery — same class as Trade-Encounter)
9. Grimoire/Codex quizzes (same class as Mechanic-Gate)
10. Trade-Desk (negotiation surface)
11. PortfolioLedger/HISTORY + Inventory (pause-menu class under Prompt F)
12. Save (writes persistent data)
13. Badge-Fanfare (decorative — ALWAYS defers)
14. Noise-Ticker z-40 (background info)
GLM audit note (9/16): the 7 families Mercury omitted — Grimoire, PortfolioLedger, Inventory,
UndervaluedAsset, RugPullLesson, ProvingVault, Trade-Desk-adjacent — are added above; z-70
exceptions (Mechanic-Gate, Trade-Encounter) are superseded by the queue's single renderer.

## 2. Queue Mechanics
- Single queue state renders exactly one blocking modal at a time.
- New modals enqueue if higher priority than current top.
- Badges always defer to underlying content; never block input.
- Deduplicate identical modal requests to prevent stack bloat.
- Escape key closes only the top modal; does not pop queue.

## 3. Integration Points
Collapse these useState states into the queue dispatcher:
- combatState.inCombat
- showSanctuary
- npcDialogue
- mechanicGate
- activeChartPuzzle
- activeScamEncounter
- activeModal
- showSaveModal
- activeNoise

## 4. Migration (GLM audit: order corrected — highest-value collision first)
1. BadgeFanfare defers to npcDialogue (the screenshot-verified collision) — fanfare
   enqueues instead of rendering over dialogue. (Gated: tsc, build, fullrun)
2. Badge + NoiseTicker become queue citizens (never block). (Gated: same)
3. Collapse the remaining states (mechanicGate, activeChartPuzzle, activeScamEncounter,
   activeUndervaluedAsset, showSaveModal, showSanctuary, combatState) into the queue
   consumer, lowest-risk first, one state per landing. (Gated: same)

## 5. Edge Cases
- ESC in combat blocks exit; suppressExit applies only to dungeon.
- BadgeFanfare and Wren dialogue must not render simultaneously.
- TradeEncounterModal z-index must respect queue priority over TradeDesk.
- SaveModal during combat requires explicit user confirmation before queuing.
---
GLM AUDIT TRAIL (9/16): Mercury draft v1 was EMPTY (0 chars — the exact rush-failure mode the founder flagged); v2 landed but omitted 7 of 18 overlay families and ordered migration lowest-value-first. Both corrected above by session audit. Nothing landed on Mercury's word alone.