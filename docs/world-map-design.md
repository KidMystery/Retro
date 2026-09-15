# WORLD MAP DESIGN DOC — Edge-Door Regions (council verdict 9/14, 2/2 converged)
Status: DESIGN ONLY — build queued behind playtest #8 verdict.

## Verdict (converged, independent)
- Architecture: **(c) EDGE-DOORS** — keep the five 20x14 region maps; walking off a border
  scrolls/seamlessly loads the adjacent region. Feels contiguous, zero new art, ~1 iteration.
  (Rejected: mega-map = re-layout of 44-lesson placements; warp overlay = feels disconnected.)
- Gating: border crossings check story progress (act cleared / pass item). Blocked players
  get an in-world refusal (NPC/barrier + Wren line), never a UI error.
- Teaching layer (the reason this feature exists): REGIONAL RISK PREMIUM — each region carries
  a volatility/liquidity character (foundations = calm, Glassmarket = value dispersion,
  Windglass = options-rich, Longacre = stewardship income, Shatterchain = scam-heavy IV spikes).
  Diversification across regions becomes a MECHANIC, not just a lesson.

## What must NOT break
1. 44-lesson → region mapping (docs/lesson-region-map.md is the source of truth).
2. Per-act dungeons + portals (unchanged; borders are overworld-only).
3. fullrun.cjs boot→NG+ (map transitions must not orphan encounters/chests state).
4. Save compatibility (region entry point derivable from chapter; no save format break).

## Implementation sketch (4-6h, when green-lit)
1. Adjacency graph for the 5 regions (linear act order + Ashen↔Glassmarket shortcut optional).
2. Border tiles: mark map edges with door tiles ('<' '>' style); on step, swap mapData + spawn
   at opposite edge; camera smooth-scroll across the seam.
3. Gate check at border: `player.chapter` vs target region act; block + Wren line if locked.
4. Regional IV modifier hook in the price engine (region-aware ivFloor) — the teaching layer.
5. fullrun extension: walk Ashen Acre → Glassmarket border, verify lesson entities intact.

## Open questions for the player (playtest #8 / verdict)
- Should Shatterchain (scam region) be walkable EARLY but lethal, teaching why not to YOLO
  into 0DTE land? (council split: nemotron yes-as-trap, mercury gates-only)
