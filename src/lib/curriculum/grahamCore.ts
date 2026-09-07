import { IntelligentInvestorLesson } from '../../types';

/**
 * GRAHAM CORE TRACK — The Intelligent Investor (1949/2003 ed.), grounded in the
 * actual chapters: Ch4 General Portfolio Policy, Ch5 The Defensive Investor,
 * Ch6 Portfolio Policy for the Enterprising Investor, Ch7, Ch11 Security
 * Analysis for the Lay Investor, Ch12 Per-Share Earnings, Ch14/15 Stock
 * Selection, Ch19 Dividend Policy. Authentic frameworks only.
 */
export const GRAHAM_CORE_LESSONS: IntelligentInvestorLesson[] = [
  {
    id: 'diversification',
    title: 'Diversification: The Defensive Investor\u2019s Shield',
    chapter: 'Chapter 5 — The Defensive Investor and Common Stocks (Graham)',
    quote: '"Adequate diversification of a portfolio... is one of the sound principles of investment."',
    corePhilosophy: 'Graham\u2019s defensive investor holds a balanced spread across stocks and bonds and within stocks across industries, because no analysis can make a single holding safe from the unforeseeable. Diversification is not a hedge against ignorance of markets — it is a hedge against being wrong in your own analysis. Between 10 and 30 holdings, distinct industries, was his rule of thumb.',
    whyYouFailed: 'You concentrated nearly everything into one position — one story, one ticker, one promise. When that single thesis cracked, there was nothing standing behind it.',
    reflectionQuestion: {
      prompt: 'A defensive portfolio in Valuaria should look like…',
      choices: [
        'One "sure thing" kingdom bond, all your florins.',
        '10-30 holdings across distinct realms and industries, sized so no single ruin is fatal.',
        'Whatever the loudest merchant heralds are buying this week.',
        'All cash, forever — ownership is too dangerous.'
      ],
      correctIndex: 1,
      explanation: 'Graham: adequate but not extreme diversification — enough holdings across industries that no single failure is fatal, few enough that you can still know what you own.'
    },
    protectionBonus: 'Permanent: single-position ruin cannot exceed 10% of net worth; portfolio volatility -15%',
    oracleRune: 'ᛒ',
    mechanicLesson: 'Options tie-in (McMillan): a spread IS diversification of outcomes — a long put financed by a short put caps both loss and gain. You are never betting everything on one scenario.'
  },
  {
    id: 'intrinsic_value',
    title: 'Intrinsic Value: The Anchor Beneath Price',
    chapter: 'Chapter 11 — Security Analysis for the Lay Investor (Graham)',
    quote: '"Price is what you pay; value is what you get."',
    corePhilosophy: 'Intrinsic value is not a precise number but a justified range: earning power, assets, and honest prospects. Graham treated precise valuation as a false comfort — his "function of security analysis" is to know when value is clearly below price, not to compute value to the copper coin. If the gap between value and price is not obvious enough to survive being wrong, there is no gap.',
    whyYouFailed: 'You bought a story, not a business. No earning power, no asset backing, no justified range — only a price you hoped someone else would beat.',
    reflectionQuestion: {
      prompt: 'Which estimate is most in the spirit of intrinsic value?',
      choices: [
        'Yesterday\u2019s closing price, because markets are efficient.',
        'A justified range from earning power, assets and honest prospects — wide enough to admit uncertainty.',
        'The vendor\u2019s promise of 25% daily returns.',
        'A precise valuation to the copper coin, updated hourly.'
      ],
      correctIndex: 1,
      explanation: 'Graham rejected spurious precision. Value is a reasoned range; you only act when price is so far below it that the margin of safety is unmistakable.'
    },
    protectionBonus: 'Permanent: assets bought below justified range marked with an anchor glyph; overpaying blocked above +20% of range',
    oracleRune: 'ᛜ',
    mechanicLesson: 'Options tie-in (Olmstead ch2): an option\u2019s "value" also splits into intrinsic (max(S−K,0) for calls) and time value. Never pay time value for what you could get intrinsic — that is overpaying with extra steps.'
  },
  {
    id: 'enterprising_vs_defensive',
    title: 'Two Investors, Two Disciplines',
    chapter: 'Chapters 4\u20136 — General Portfolio Policy; Defensive and Enterprising Investor (Graham)',
    quote: '"The distinction... has always been roughly that of the passive (defensive) and the aggressive or enterprising investor."',
    corePhilosophy: 'The defensive investor wants safety with minimal effort: index-style spread, balanced stocks/bonds, mechanical rules. The enterprising investor accepts work and risk for better results: rigorous selection, patience for bargains. Both are legitimate. The unforgivable error is being a defensive investor who trades like an enterprising one — half the effort, none of the discipline, all of the risk.',
    whyYouFailed: 'You wanted enterprising returns with defensive effort — checking prices daily, chasing stories, doing no balance-sheet work.',
    reflectionQuestion: {
      prompt: 'You have one hour per month for your portfolio. What is the intelligent stance?',
      choices: [
        'Day-trade the hottest ticker — one hour is plenty.',
        'Defensive: broad, balanced, mechanical; revisit on a schedule, not on headlines.',
        'Copy the enterprising merchant guild\u2019s picks, no review needed.',
        'Leverage up to make the small effort "worth it".'
      ],
      correctIndex: 1,
      explanation: 'Graham: your strategy must fit your time, temperament and knowledge. Little time = defensive policy. The sin is mixing the two halves of each discipline and keeping none.'
    },
    protectionBonus: 'Permanent: path choice locked with honest bonus; mixed-discipline penalty removed',
    oracleRune: 'ᛏ',
    mechanicLesson: 'Options tie-in (Olmstead ch9): options are risk capital by definition. A defensive policy means most capital never touches them; an enterprising one means defined-risk structures only.'
  },
  {
    id: 'earnings_quality',
    title: 'Per-Share Earnings: Read the Footnotes',
    chapter: 'Chapter 12 — Things to Consider About Per-Share Earnings (Graham)',
    quote: '"The more promising... the more important it is for the purchaser to examine with care."',
    corePhilosophy: 'Graham warned that reported per-share earnings are shaped by accounting choices: one-time items, arbitrary write-offs that "tidy up" bad years, and averaging across 7-10 years to reveal true earning power. A single glorious year proves nothing; a smoothed multi-year record with disclosed assumptions is the honest picture.',
    whyYouFailed: 'You extrapolated one euphoric quarter to the horizon. The write-offs hidden in the footnotes told a different story two quarters later.',
    reflectionQuestion: {
      prompt: 'How do you judge a company\u2019s true earning power?',
      choices: [
        'Last quarter\u2019s EPS multiplied by four.',
        'Average earnings across 7-10 years, adjusted for one-time items and disclosed accounting choices.',
        'The founder\u2019s forecast, signed in gold ink.',
        'Revenue alone — profit is a detail.'
      ],
      correctIndex: 1,
      explanation: 'Graham ch12: average across years, strip the special items, distrust aggressive assumptions. Earning power is a record, not a wish.'
    },
    protectionBonus: 'Permanent: false-growth traps revealed before purchase; -50% damage from "hidden write-off" events',
    oracleRune: 'ᛖ',
    mechanicLesson: 'Options tie-in (McMillan): earnings announcements inflate IV before the event, then crush it. Buying options on the story pays the inflated premium for a number the footnotes already questioned.'
  },
  {
    id: 'dollar_cost_avg',
    title: 'Dollar-Cost Averaging: Investing on Schedule',
    chapter: 'Chapter 5 — The Defensive Investor and Common Stocks (Graham)',
    quote: '"...the purchase of common stocks of equal dollar amounts every month or quarter."',
    corePhilosophy: 'Dollar-cost averaging removes timing from the hands of emotion: a fixed sum, invested on a fixed schedule, regardless of Mr. Market\u2019s mood. You automatically buy more shares when prices are low and fewer when high — without needing to know which is which. Graham saw it as one of the few mechanical plans the defensive investor could trust, precisely because it requires no forecast.',
    whyYouFailed: 'You waited for the "perfect" entry, missed it, then dumped a lump sum at the euphoric top because waiting felt worse than buying.',
    reflectionQuestion: {
      prompt: 'The realm\u2019s market has fallen 25% and headlines wail. Your schedule says invest 500ƒ this week. You…',
      choices: [
        'Cancel the plan until "certainty returns".',
        'Invest the scheduled 500ƒ — the plan buys more when prices are low, which is the point.',
        'Borrow 5,000ƒ to buy the dip with leverage.',
        'Double everything at the euphoric high instead.'
      ],
      correctIndex: 1,
      explanation: 'The whole advantage of averaging is that it acts against your emotions automatically. Suspending it at the bottom is paying for insurance and never claiming it.'
    },
    protectionBonus: 'Permanent: scheduled buys execute regardless of panic; -20% to panic-timing losses',
    oracleRune: 'ᛇ',
    mechanicLesson: 'Options tie-in (Olmstead ch6): LEAPS let a small monthly budget hold long-dated exposure — a schedule-compatible, defined-cost alternative to lump-sum premium buys.'
  },
  {
    id: 'bond_buffer',
    title: 'The 25\u201375 Band: Stocks and Bonds Together',
    chapter: 'Chapter 4 — General Portfolio Policy: The Investor\u2019s Attitude (Graham)',
    quote: '"...never less than 25% or more than 75% in common stocks, with a reverse guiding policy for bonds."',
    corePhilosophy: 'Graham\u2019s famous 25\u201375 rule keeps a permanent tension in the portfolio: bonds as the defensive ballast and dry powder, stocks as the engine of ownership. When stocks climb to euphoria, trim toward 25%; when they collapse in despair, shift toward 75%. The band forces you to sell some high and buy some low — mechanically, without a forecast.',
    whyYouFailed: 'You were 100% exposed at the top and 100% cash at the bottom — maximum exposure at maximum error.',
    reflectionQuestion: {
      prompt: 'Stocks have run euphoric for two years. The 25\u201375 band says…',
      choices: [
        'Go 100% stocks — the trend is your friend forever.',
        'Trim toward 25% stocks / 75% bonds — mechanically selling high.',
        'Go 100% bonds and never own a business again.',
        'Leverage the stock position at the top.'
      ],
      correctIndex: 1,
      explanation: 'The band is a discipline, not a prediction: it trims into euphoria and rebuilds into despair, keeping the reversal always affordable.'
    },
    protectionBonus: 'Permanent: portfolio shock capped at 25% of net worth; cash buffer auto-held for opportunities',
    oracleRune: 'ᚼ',
    mechanicLesson: 'Options tie-in (McMillan): the bond sleeve is what lets you hold unassigned cash-secured puts or take assignment calmly — you are never a forced seller.'
  },
  {
    id: 'position_sizing',
    title: 'Position Sizing: Survival Is the First Return',
    chapter: 'Graham Ch6 ("risk capital") with Kelly insight (McMillan appendix discussion of expectations)',
    quote: '"...the avoidance of all accidents that could ruin you is the first requirement."',
    corePhilosophy: 'Kelly\u2019s criterion says the optimal fraction of capital to risk scales with your edge and odds — and when the edge is uncertain, the Kelly fraction is small. Graham\u2019s version is blunter: only risk capital belongs in speculation, and no position may be sized so a normal bad outcome is fatal. The richest investor is not the one who bet biggest; it is the one still standing when the odds finally paid.',
    whyYouFailed: 'You sized positions by conviction, not by odds. One ordinary bad outcome — not even a freak — erased half a year of gains.',
    reflectionQuestion: {
      prompt: 'Your edge is modest and the odds uncertain. How much of your capital belongs in one trade?',
      choices: [
        'Everything — conviction is the edge.',
        'A small defined fraction of risk capital; survival lets the edge compound.',
        'Half — diversification is for the fearful.',
        'Borrowed funds, to magnify the small edge.'
      ],
      correctIndex: 1,
      explanation: 'Kelly logic: over-betting a positive edge still leads to ruin. Fractional, risk-capital-only sizing keeps you in the game where compounding lives.'
    },
    protectionBonus: 'Permanent: max position auto-capped; margin calls can never exceed risk-capital sleeve',
    oracleRune: 'ᛚ',
    mechanicLesson: 'Options tie-in: defined-risk spreads ARE position sizing — the max loss is decided before entry, not discovered after.'
  },
  {
    id: 'stop_loss_discipline',
    title: 'Predefined Exits: Decide Before Mr. Market Knocks',
    chapter: 'Graham Ch8 (market fluctuations) with McMillan\u2019s stop/exit discipline',
    quote: '"...the investor should proceed as if he were running a business, with defined policies."',
    corePhilosophy: 'A position without a predefined exit is a decision delegated to your future frightened self. McMillan\u2019s traders write the stop and the maximum loss before entry — the point is not that the stop is always right, but that the decision made calmly is better than the decision made in a 6% intraday hole. Graham\u2019s business framing: an operator with an unbounded loss line is not running a business; he is gambling with open-ended stakes.',
    whyYouFailed: 'You "held through the dip" with no line drawn. The dip became a collapse, and the collapse decided your exit for you.',
    reflectionQuestion: {
      prompt: 'Before entering a speculative position, an intelligent operator…',
      choices: [
        'Decides nothing — exits are clear in hindsight.',
        'Writes the maximum acceptable loss and the exit condition before entry, and honors them.',
        'Sets the stop so wide it can never be hit.',
        'Averages down without limit, forever.'
      ],
      correctIndex: 1,
      explanation: 'The calm decision beats the panicked one. Predefined exits bound the error; averaging down without limit turns a small mistake into a catastrophe.'
    },
    protectionBonus: 'Permanent: every speculative entry carries an auto stop at the predefined line',
    oracleRune: 'ᚱ',
    mechanicLesson: 'Options tie-in (Olmstead ch10): a vertical spread\u2019s short leg is a built-in exit line — max loss is structural, not emotional.'
  },
  {
    id: 'chart_pattern_recognition',
    title: 'Reading the Crowd\u2019s Fingerprints',
    chapter: 'Technical supplement — Graham\u2019s "market fluctuations" applied via pattern recognition (Ch8)',
    quote: '"The market is a voting machine in the short run, a weighing machine in the long run."',
    corePhilosophy: 'Candlestick patterns are the crowd\u2019s emotions made visible: euphoria at tops, capitulation at bottoms, indecision at turning points. Graham would warn that a pattern is never a promise — it is evidence of what the crowd did, to be weighed against value. Recognizing a blow-off top or a base breakout helps you ask the right question: is Mr. Market manic or depressed today?',
    whyYouFailed: 'You bought the vertical rocket at its final candle — the fingerprint of euphoria — because "it kept going up".',
    reflectionQuestion: {
      prompt: 'A parabolic vertical rise with huge volume at the last candle. What is the crowd telling you?',
      choices: [
        'It will rise forever — buy everything.',
        'Euphoria fingerprint: late buyers are most at risk; check value and wait for Mr. Market\u2019s mood to turn.',
        'Charts are witchcraft; ignore everything.',
        'Short with 50x leverage at once.'
      ],
      correctIndex: 1,
      explanation: 'A parabolic blow-off is the short-run voting machine at maximum emotion. It is not a forecast — it is a warning that the price is furthest from the weighing machine\u2019s verdict.'
    },
    protectionBonus: 'Permanent: chart-puzzle rooms reveal pattern names before entry; euphoria warnings auto-flagged',
    oracleRune: 'ᛝ',
    mechanicLesson: 'Options tie-in (McMillan): euphoric verticals = IV spikes. The pattern that warns the chart buyer warns the premium seller — same fingerprint, opposite trade.'
  }
];
