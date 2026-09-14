# VALUARIA — 8-HOUR ITERATION PLAN (started 9/13, council-approved)
## Council verdict (5 members, blind, converged → implemented)
- Q1 ambient top-3 (4/5 converge): torch flicker+dust motes / grass sway / cloud shadows
- Q2 floor identity (5/5): per-floor LIGHT TEMPERATURE + plaques (1F warm / 2F cool ring / B1 dark vault)
- Q3 chrome (converged): desaturated wood border, GOLD AS ACCENT ONLY on active/focus, SNES palette 1px lines, no anti-alias
- Q4 sequencing (3/2): THREE PUSHES, not one pass — isolate regressions ahead of playtest #8
- Q5 paid-token uses: no convergence → parked as ideas (sante's Greeks-verification noted for candles milestone)

## PUSH 1 — AMBIENT + SIGNAGE (hours 0-3) ← council's #1 aliveness fixes
1. Overworld grass sway (ZeldaOverworldCanvas: per-tile blade offset, sin(frame))
2. Overworld water shimmer (animate existing foam/water highlight, cheap alpha wave)
3. Cloud shadows drifting across viewport (screen-space ellipses, parallax vs cam, 3 layers)
4. Dungeon dust motes (DungeonView: particles inside existing torch glow, ~40 lines)
5. Per-floor light temperature: floorTint prop → DungeonView fog color per floor (1F warm amber / 2F cool blue / B1 sepia)
6. Floor plaques: floorName in actLabel position on descent (App already has floorCfg @1815)
GATE: tsc 0 + build + fullrun 0 console errors → PUSH.

## PUSH 2 — GOLD/WOOD CHROME (hours 3-5)
1. Wood-grain 2px border + 8x8 corner bevels on HUD panels/dialog frames
2. Gold accent ONLY on active/selected elements (#D4AF37 family, SNES-palette locked)
3. Font treatment: existing pixel font + 1px gold drop shadow, no anti-aliasing
GATE: same → PUSH.

## PUSH 3 — VERIFY + DEPLOY + BUFFER (hours 5-6)
1. fullrun + deep-floor probe (descend 1F→2F→B1, chest one-shot, boss)
2. Screenshot evidence per floor + overworld ambient
3. Railway deploy verify (prod bundle hash == local)
4. Buffer / regression sweep / tracker update

## RULES
- Zero mechanics changes. Zero new asset files (programmatic only). 
- Playtest #8 can interrupt at any push boundary — code is always shippable.
- Council cost this session: <$0.001 (mercury only). Free models $0.
- NO new scope enters this window (candles/world-map are NEXT iteration).

## WISHLIST → REALITY MAP (user's 3, sequenced after this window)
1. CANDLESTICK CHARTS — presentation layer on existing trade sim data (price history exists in
   chartPuzzles/encounter data). Council's sante flagged: Greeks math needs verification discipline
   (free models hallucinate; session implements + unit test against known values). ~1 iteration.
2. CONNECTIVE WORLD MAP — regions currently story-gated separate maps. Design doc first (council),
   then world-map overlay + travel gates. LARGEST item, ~1-2 iterations. Depends on playtest #8 verdict.
3. 'FEELS ALIVE' BAR — this iteration IS the response; measure vs user's own ALttP references, not vibes.
