// Chart-reading puzzle rooms: candlestick & pattern recognition rendered as
// Zelda-style dungeon-room puzzles. Each room shows a real OHLC series; the
// player must read what the tape is actually saying before the door opens.

export interface ChartPuzzle {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3;
  pattern: string; // canonical name
  candles: { o: number; h: number; l: number; c: number }[]; // OHLC series (5-9 candles)
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string; // what the pattern MEANS + what to do
  lesson: string; // the trading principle a wrong answer teaches
  trap: string; // the wrong reading most traders make
  protectionId: string; // existing curriculum protection ID
}

export const chartPuzzles: ChartPuzzle[] = [
  // ─── DIFFICULTY 1 ────────────────────────────────────────────────────────
  {
    id: 'room-doji-shrine',
    title: 'The Shrine of Still Air',
    difficulty: 1,
    pattern: 'Doji',
    candles: [
      { o: 41.2, h: 42.8, l: 40.9, c: 41.5 },
      { o: 41.5, h: 42.1, l: 41.0, c: 41.9 },
      { o: 41.9, h: 43.6, l: 41.8, c: 43.1 },
      { o: 43.1, h: 43.9, l: 41.6, c: 43.0 },
      { o: 43.0, h: 43.5, l: 41.9, c: 43.1 },
    ],
    question:
      'The last candle opened and closed almost at the same price after a run up. What is the room telling you?',
    choices: [
      'The trend is confirmed — buy more immediately',
      'Indecision: buyers and sellers tied. Wait for the next candle to break the tie',
      'The stock is broken and will collapse tomorrow',
      'It means nothing — dojis never matter',
    ],
    correctIndex: 1,
    explanation:
      'A doji means equilibrium: neither side could push price through. After a run, it is a warning, not a signal. The correct action is to do nothing until the next candle shows which side won.',
    lesson:
      'No decision is a decision. When the market ties, the disciplined player waits for the tie to break — the next candle is the verdict.',
    trap:
      'Reading a doji as confirmation and adding to a position mid-run, or as a guaranteed reversal. It is neither — it is a pause, not a verdict.',
    protectionId: 'chart_pattern_recognition',
  },
  {
    id: 'room-hammer-forge',
    title: 'The Hammer at the Abyss',
    difficulty: 1,
    pattern: 'Hammer',
    candles: [
      { o: 33.4, h: 34.0, l: 32.8, c: 33.6 },
      { o: 33.6, h: 33.9, l: 32.9, c: 33.1 },
      { o: 33.1, h: 33.4, l: 31.7, c: 32.0 },
      { o: 32.0, h: 32.3, l: 30.2, c: 31.9 },
      { o: 31.9, h: 32.6, l: 29.4, c: 32.4 },
    ],
    question:
      'Price plunged deep below the open intraday, then recovered to close near the top. What happened in this room?',
    choices: [
      'Sellers were in total control — the fall will continue tomorrow',
      'Buyers slammed the door on the sell-off: a potential bottom-reversal signal after a downtrend',
      'It was just a slow news day with no meaning',
      'The gap down guarantees a bounce',
    ],
    correctIndex: 1,
    explanation:
      'The long lower wick shows sellers drove price down hard and buyers absorbed it all, closing near the high. At the end of a downtrend, that is a classic hammer — a potential reversal. Enter only on confirmation (next candle closing higher) with a stop below the hammer low.',
    lesson:
      'A hammer is the market showing its hand: the low was tested and rejected. But a signal without confirmation is a rumor — wait for the follow-through candle.',
    trap:
      'Catching the wick because it "looks cheap" without confirmation. A hammer in a downtrend that never confirms keeps falling — that low becomes the next ceiling, not the floor.',
    protectionId: 'chart_pattern_recognition',
  },
  {
    id: 'room-star-summit',
    title: 'The Summit Lookout',
    difficulty: 1,
    pattern: 'Shooting Star',
    candles: [
      { o: 58.2, h: 59.0, l: 57.9, c: 58.7 },
      { o: 58.7, h: 59.8, l: 58.5, c: 59.5 },
      { o: 59.5, h: 60.9, l: 59.3, c: 60.4 },
      { o: 60.4, h: 63.8, l: 60.2, c: 60.6 },
      { o: 60.6, h: 61.0, l: 59.8, c: 60.1 },
    ],
    question:
      'At the top of a rally, one candle spiked far above the pack and closed back down near the open. What is this?',
    choices: [
      'A breakout — the spike proves buyers are unstoppable',
      'A shooting star: buyers were rejected at the highs — a warning of a potential top',
      'A buyable dip with zero risk',
      'The wick is a data error and should be ignored',
    ],
    correctIndex: 1,
    explanation:
      'The long upper wick means price was pushed dramatically higher and sellers threw it all back before the close. After an advance, that rejection is a shooting star — the rally is losing its grip. Tighten stops or take partial profits; go short only on a confirmed close below the star\u2019s low.',
    lesson:
      'Upper wicks at highs are receipts for failed attacks. When an advance is rejected intraday, someone big was selling into strength — respect the rejection.',
    trap:
      'Buying the spike as a "breakout" hours before it fails. Breakouts that close back inside the range on the same day are failed attacks, not launches.',
    protectionId: 'chart_pattern_recognition',
  },
  {
    id: 'room-engulf-gate',
    title: 'The Engulfing Gate',
    difficulty: 1,
    pattern: 'Bullish Engulfing',
    candles: [
      { o: 27.8, h: 28.3, l: 27.5, c: 28.0 },
      { o: 28.0, h: 28.2, l: 27.4, c: 27.6 },
      { o: 27.6, h: 27.8, l: 26.9, c: 27.1 },
      { o: 27.1, h: 27.4, l: 26.8, c: 26.9 },
      { o: 26.7, h: 28.4, l: 26.6, c: 28.2 },
    ],
    question:
      'After three down candles, the last one opened lower and closed above the entire body of the previous candle. What does this mean?',
    choices: [
      'Nothing — one candle never changes a trend',
      'Bullish engulfing: buyers took full control — a potential reversal, best acted on with the next candle\u2019s confirmation',
      'The gap up is a short squeeze trap and must be faded',
      'Sell everything — the bounce will instantly fail',
    ],
    correctIndex: 1,
    explanation:
      'The final candle\u2019s body completely engulfs the prior red body: the open at/below the prior close and the close above the prior open. That is buyers overwhelming sellers in one session. Act on confirmation — a higher close next session — with a stop below the engulfing low.',
    lesson:
      'Whoever controls the close controls the next session\u2019s bias. An engulfing candle is a full-session takeover, not a wimpy bounce.',
    trap:
      'Treating any green candle after red as "engulfing." The body must swallow the entire prior body — a close barely above the prior close is a tie, not a takeover.',
    protectionId: 'chart_pattern_recognition',
  },

  // ─── DIFFICULTY 2 ────────────────────────────────────────────────────────
  {
    id: 'room-shoulders-hall',
    title: 'The Hall of Two Shoulders',
    difficulty: 2,
    pattern: 'Head and Shoulders (top)',
    candles: [
      { o: 62.0, h: 64.5, l: 61.8, c: 64.0 },
      { o: 64.0, h: 64.8, l: 60.9, c: 61.4 },
      { o: 61.4, h: 67.9, l: 61.2, c: 67.2 },
      { o: 67.2, h: 68.3, l: 62.1, c: 62.6 },
      { o: 62.6, h: 64.9, l: 62.0, c: 64.5 },
      { o: 64.5, h: 65.0, l: 60.4, c: 60.8 },
    ],
    question:
      'Three peaks: ~64.5, ~68, ~64.9 — with the middle one the highest. What structure is forming and what should you do?',
    choices: [
      'An ascending staircase — buy each new high',
      'A head and shoulders top: a distribution pattern — anticipate a break of the neckline (~60.9) and stand aside or go short',
      'A rounding bottom — accumulate aggressively',
      'A bull flag — add on the next dip',
    ],
    correctIndex: 1,
    explanation:
      'Left shoulder, higher head, lower right shoulder — each peak fails on lighter conviction. That is distribution: strong hands selling into strength while the crowd buys each "new high." The tell is the right shoulder failing to reach the head. The action: place a mental stop at the neckline (~61) and expect acceleration if it breaks.',
    lesson:
      'Lower highs after a peak are the market\u2019s way of showing the bid is thinning. Structure beats hope — the pattern is the plan.',
    trap:
      'Buying the right shoulder as a "dip to the mean." The third peak is where the smart money exits — the crowd buying it is the exit liquidity.',
    protectionId: 'chart_pattern_recognition',
  },
  {
    id: 'room-twin-floors',
    title: 'The Twin Floors',
    difficulty: 2,
    pattern: 'Double Bottom',
    candles: [
      { o: 46.5, h: 47.2, l: 44.9, c: 45.4 },
      { o: 45.4, h: 46.1, l: 43.6, c: 43.9 },
      { o: 43.9, h: 46.8, l: 43.7, c: 46.2 },
      { o: 46.2, h: 46.6, l: 44.3, c: 44.8 },
      { o: 44.8, h: 45.1, l: 43.8, c: 44.0 },
      { o: 44.0, h: 46.9, l: 43.9, c: 46.5 },
    ],
    question:
      'Price hit ~43.7 twice and bounced both times, with the second low slightly higher. What is the read?',
    choices: [
      'A double bottom: support confirmed twice — a potential reversal, entry on the break above the middle peak (~46.8)',
      'A dead-cat bounce — short it',
      'A rounding top — sell everything',
      'The market is random; this means nothing',
    ],
    correctIndex: 0,
    explanation:
      'Two rejections at nearly the same level, the second higher than the first, form a double bottom — sellers tried twice to break the floor and failed. The buy signal is not the second low itself; it is the break above the middle peak with volume. Stop goes below the second bottom.',
    lesson:
      'Support that holds under a second test is stronger than support tested once. But the entry is the breakout, not the bounce — patience is the edge.',
    trap:
      'Buying the first bounce instead of the breakout. Double bottoms fail constantly when the "bottom" is really just a pause before the third leg down.',
    protectionId: 'chart_pattern_recognition',
  },
  {
    id: 'room-ascending-triangle',
    title: 'The Ascending Gate',
    difficulty: 2,
    pattern: 'Ascending Triangle',
    candles: [
      { o: 51.0, h: 53.9, l: 50.8, c: 51.8 },
      { o: 51.8, h: 52.4, l: 50.9, c: 52.1 },
      { o: 52.1, h: 53.8, l: 51.5, c: 52.4 },
      { o: 52.4, h: 53.1, l: 52.0, c: 52.7 },
      { o: 52.7, h: 53.7, l: 52.5, c: 53.0 },
      { o: 53.0, h: 53.6, l: 52.9, c: 53.4 },
    ],
    question:
      'Repeated highs crowd ~54 while each pullback makes a higher low. What is coiling here?',
    choices: [
      'A bear wedge — short immediately',
      'An ascending triangle: rising lows pressing into flat resistance — position for the breakout above ~54, stop below the last higher low',
      'Head and shoulders — sell',
      'Nothing — wait for a fundamental catalyst before acting',
    ],
    correctIndex: 1,
    explanation:
      'Flat resistance at ~54, rising lows beneath it: supply gets absorbed at a fixed price while buyers pay more each session. That compression usually resolves upward — but only on a decisive close above resistance with volume. Entry on the break, stop below the most recent higher low.',
    lesson:
      'Rising lows into flat resistance is a pressure gauge. The breakout is the event, not the setup — never front-run the ceiling.',
    trap:
      'Buying inside the triangle "early." Compressed patterns resolve violently in BOTH directions — a failed breakout here drops fast because everyone\u2019s stop is in the same place.',
    protectionId: 'chart_pattern_recognition',
  },
  {
    id: 'room-evening-star',
    title: 'The Evening Star Shrine',
    difficulty: 2,
    pattern: 'Evening Star',
    candles: [
      { o: 72.0, h: 73.1, l: 71.8, c: 72.8 },
      { o: 72.8, h: 74.9, l: 72.7, c: 74.6 },
      { o: 74.9, h: 75.2, l: 74.1, c: 74.4 },
      { o: 74.4, h: 74.8, l: 72.3, c: 72.5 },
      { o: 72.5, h: 72.9, l: 71.0, c: 71.2 },
    ],
    question:
      'Big green candle, small-bodied candle gapping near the high, then a red candle closing deep into the first\u2019s body. Name the pattern and act.',
    choices: [
      'A morning star — buy the dip',
      'An evening star: momentum stalled at the top — reduce or exit longs; short only on a confirmed break below the star\u2019s low',
      'A doji — wait one more week',
      'A cup and handle — accumulate',
    ],
    correctIndex: 1,
    explanation:
      'Strong advance, exhaustion (small body at the high), then real distribution: the red candle erases most of the green. Three candles, one story — buyers spent everything and got nothing. Longs tighten or exit; shorts wait for the low to break, never pre-empt the pattern.',
    lesson:
      'The middle candle is the confession: momentum died at the top while price looked fine. Patterns are stories across candles — never read one candle alone.',
    trap:
      'Reading candle 2\u2019s small body as "consolidation before continuation." Small body AT the high after a big run is exhaustion, not rest — the third candle settles the argument.',
    protectionId: 'chart_pattern_recognition',
  },

  // ─── DIFFICULTY 3 ────────────────────────────────────────────────────────
  {
    id: 'room-bull-trap',
    title: 'The False Door',
    difficulty: 3,
    pattern: 'Bull Trap (failed breakout)',
    candles: [
      { o: 44.0, h: 46.1, l: 43.8, c: 45.9 },
      { o: 45.9, h: 46.3, l: 45.1, c: 45.4 },
      { o: 45.4, h: 45.8, l: 44.6, c: 45.0 },
      { o: 45.0, h: 45.6, l: 44.9, c: 45.2 },
      { o: 45.2, h: 47.4, l: 45.1, c: 45.6 },
      { o: 45.6, h: 46.0, l: 43.9, c: 44.1 },
    ],
    question:
      'Resistance sat at ~46 for weeks. Candle 5 spiked to 47.4 — a breakout! — but closed back at 45.6. Candle 6 dumped below the range. What really happened?',
    choices: [
      'A shakeout before the real breakout — back up the truck',
      'A bull trap: the "breakout" closed back inside the range on no real volume — longs who bought the spike are trapped; exit or short the failure',
      'A gap-and-go — ride it',
      'The breakdown was a bear trap — buy the flush',
    ],
    correctIndex: 1,
    explanation:
      'The spike above resistance that cannot hold the close is the definition of a failed breakout. Looks like a launch, but the close back inside the range says nobody followed through — and candle 6 confirms the trap as trapped longs liquidate. The action: if you bought the spike, your stop was the range high and you are out; if flat, the failed breakout is itself a short setup.',
    lesson:
      'Breakouts are proven at the close, not the high. Volume without follow-through close is a feint — the market teasing the crowd into the wrong door.',
    trap:
      'The trap field in its purest form: "it broke out, so it must keep going." Price above resistance intraday means nothing; only a close above with expanding volume means anything.',
    protectionId: 'chart_pattern_recognition',
  },
  {
    id: 'room-wedge-or-knife',
    title: 'The Wedge and the Knife',
    difficulty: 3,
    pattern: 'Falling Wedge (vs falling knife)',
    candles: [
      { o: 38.0, h: 38.4, l: 35.9, c: 36.2 },
      { o: 36.2, h: 37.9, l: 35.8, c: 37.5 },
      { o: 37.5, h: 37.8, l: 35.7, c: 36.0 },
      { o: 36.0, h: 37.2, l: 35.6, c: 36.9 },
      { o: 36.9, h: 37.1, l: 35.5, c: 35.8 },
      { o: 35.8, h: 36.9, l: 35.6, c: 36.7 },
    ],
    question:
      'Price is falling, but each sell-off makes shallower lows and each bounce makes lower highs — the two lines are converging. What is this?',
    choices: [
      'A falling knife — the crash will accelerate, stay out',
      'A falling wedge: downside momentum decaying into compression — often resolves UP; watch for a break above the upper trendline',
      'A head and shoulders — short the neckline',
      'A rounding top — distribute',
    ],
    correctIndex: 1,
    explanation:
      'Lower highs + higher lows while drifting down = sellers losing force, not gaining it. A falling wedge is typically a bullish pattern — the squeeze before the release. The knife, by contrast, makes LOWER lows with widening bodies and no bounce structure. The action: alert, do not enter — the wedge breaks out above the upper line, and that break is the trade.',
    lesson:
      'Shape matters more than direction. Falling price with converging, compressing range is decay; falling price with expanding bodies is panic. Same direction, opposite trade.',
    trap:
      'Seeing "down = bad" and shorting the compression. Shorting into a falling wedge is shorting the exact spot where the reversal tends to ignite.',
    protectionId: 'chart_pattern_recognition',
  },
  {
    id: 'room-cup-or-dome',
    title: 'The Cup and the Dome',
    difficulty: 3,
    pattern: 'Cup and Handle (vs rounding top)',
    candles: [
      { o: 55.0, h: 55.6, l: 52.8, c: 53.4 },
      { o: 53.4, h: 54.0, l: 51.2, c: 51.6 },
      { o: 51.6, h: 52.2, l: 50.4, c: 50.9 },
      { o: 50.9, h: 52.6, l: 50.6, c: 52.1 },
      { o: 52.1, h: 53.8, l: 52.0, c: 53.5 },
      { o: 53.5, h: 54.2, l: 52.9, c: 53.9 },
      { o: 53.9, h: 54.0, l: 52.6, c: 52.9 },
      { o: 52.9, h: 55.4, l: 52.8, c: 55.1 },
    ],
    question:
      'A slow bowl: down, flat bottom, recovery, and now a small pullback near the old high before a final push. Which is it and what is the trade?',
    choices: [
      'A rounding top — the recovery is a bull trap, short it',
      'A cup with handle: rounded base, shallow handle under resistance — buy the handle break above ~55.5, stop below the handle low',
      'A double bottom — buy right now at the highs',
      'A descending triangle — sell the support break',
    ],
    correctIndex: 1,
    explanation:
      'The U-shaped recovery to the old high, followed by a shallow sideways drift (the handle), is a base — accumulation, not distribution. A rounding TOP would fail below the prior high and roll over; here price reclaims the highs. The trade: buy the break above the handle with volume; the measured move projects roughly the cup\u2019s depth.',
    lesson:
      'Context separates twins: same curve, opposite meaning depending on whether it forms at the END of a decline (base) or the end of a rise (top). Always ask: what came before this shape?',
    trap:
      'Confusing the handle for a top and selling the base, or buying the "cup" before the handle forms. The handle is the shakeout that removes weak hands — trade its break, not its existence.',
    protectionId: 'chart_pattern_recognition',
  },
  {
    id: 'room-gap-of-exhaustion',
    title: 'The Gap at the End of the Road',
    difficulty: 3,
    pattern: 'Exhaustion Gap (vs gap-and-go)',
    candles: [
      { o: 61.0, h: 63.2, l: 60.8, c: 62.9 },
      { o: 63.9, h: 65.8, l: 63.6, c: 65.4 },
      { o: 65.9, h: 67.9, l: 65.7, c: 67.5 },
      { o: 68.9, h: 70.6, l: 68.4, c: 69.8 },
      { o: 71.8, h: 72.4, l: 68.9, c: 69.4 },
      { o: 68.8, h: 69.3, l: 66.2, c: 66.5 },
    ],
    question:
      'Three strong gap-ups in a row, then a fourth gap that gaps up to 71.8 — and collapses to close at 69.4, below the open. What is this?',
    choices: [
      'Gap-and-go — the fourth gap is the strongest, buy it',
      'An exhaustion gap: the last gap up on a late-stage run that fails intraday — the run is ending; exit longs, tighten stops, consider the short side',
      'A common gap — noise, ignore it',
      'A breakaway gap — the start of a new trend',
    ],
    correctIndex: 1,
    explanation:
      'Consecutive gaps mark acceleration; a gap that appears AFTER the acceleration and fails to hold is an exhaustion gap — the final buyers bought the top tick. The close back below the gap open is the confirmation. The action: longs exit on the failed close, and the measured target is the origin of the last leg.',
    lesson:
      'Gaps are fuel gauges: early gaps in a trend are thrust, late gaps after extended runs are the last buyers bidding against nobody. Position in the trend decides what a gap means.',
    trap:
      'Chasing the late gap because "gaps get filled, so up it goes." The exhaustion gap is the market\u2019s last squeeze of the crowd — buying it means buying from the seller who is done.',
    protectionId: 'event_risk',
  },
];
