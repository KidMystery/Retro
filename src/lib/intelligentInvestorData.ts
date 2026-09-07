import { IntelligentInvestorLesson, OptionsMechanicChallenge } from '../types';

export const INTELLIGENT_INVESTOR_LESSONS: IntelligentInvestorLesson[] = [
  {
    id: 'margin_of_safety',
    title: 'The Central Concept: Margin of Safety',
    chapter: 'Chapter 20 — "Margin of Safety" as the Central Concept of Investment',
    quote: '"Confronted with the challenge to distill the secret of sound investment into three words, we venture the motto, MARGIN OF SAFETY."',
    corePhilosophy: 'The margin of safety is the gap between intrinsic value and price paid. If a bridge can hold 10,000 lbs, you build it for 30,000 to withstand storms. In Valuaria, Valen learns this after the village elder\'s life savings are rug-pulled the same night he finds the Oracle\'s Stone — a carved obsidian altar with floating amber runes and pulsing emerald core. Touching it bonds the Oracle\'s Ledger to his soul.',
    whyYouFailed: 'You allowed your margin of safety to shrink to zero through unhedged leverage, excessive premium speculation, or paying inflated prices without tangible book value.',
    reflectionQuestion: {
      prompt: 'Which action best embodies "Margin of Safety" in the Oracle\'s Ledger?',
      choices: [
        'Buying deep OTM 0-DTE calls with all cash.',
        'Purchasing an undervalued company at 40% discount to tangible book and selling OTM covered calls to hedge.',
        'Borrowing max margin for 100x unhedged bets.',
        'Staking entire net worth into unaudited 10,000% APY pool.'
      ],
      correctIndex: 1,
      explanation: 'Buying at steep discount to net asset value provides cushion against adverse events, while covered call premium further cushions downside. This is Graham\'s Margin of Safety.'
    },
    protectionBonus: 'Permanent: +10% collateral buffer, cannot be liquidated by <5% wicks, unlocks Covered Call rune',
    oracleRune: 'ᚠ',
    mechanicLesson: 'Options mechanic (McMillan): a put\'s intrinsic value is max(strike − spot, 0). A $50 put with the stock at $44 holds $6 of real value — buying ITM premium is buying actual worth, never just cheap lottery tickets.'
  },
  {
    id: 'mr_market',
    title: 'The Parable of Mr. Market & Emotional Discipline',
    chapter: 'Chapter 8 — The Investor and Market Fluctuations',
    quote: '"The investor\'s chief problem—and even his worst enemy—is likely to be himself."',
    corePhilosophy: 'Mr. Market is your eccentric partner who knocks daily with manic highs and depressive lows. You are not obliged to trade unless his price suits your reasoned calculation. In Theta Steppes, the Chrono-Sphinx froze the river of time — options rot into nothingness. The lesson: "What does the 0-DTE lottery call truly cost you?" Answer: patience + capital.',
    whyYouFailed: 'You allowed Mr. Market\'s frenzy or panic to dictate trades. You FOMOed into inflated highs and panicked at temporary bottoms.',
    reflectionQuestion: {
      prompt: 'How should an intelligent investor treat Mr. Market\'s daily quotes in the Oracle\'s Ledger?',
      choices: [
        'Assume Mr. Market is omniscient and always fair value.',
        'Treat him as emotional servant: sell when manic overpaying, buy when unreasonably depressed.',
        'Panic sell all holdings on corrections.',
        'Copy trending influencers.'
      ],
      correctIndex: 1,
      explanation: 'Mr. Market exists to serve you with opportunities, not guide opinions. Form your own independent valuation from the Oracle\'s Stone.'
    },
    protectionBonus: 'Permanent: Immune to FOMO scams, +15% resistance to panic selling, unlocks Calendar Spread',
    oracleRune: 'ᛗ',
    mechanicLesson: 'Options mechanic (McMillan): crowd peaks inflate premiums. When implied volatility spikes on hype, option prices are fattest — selling premium into mania (or refusing the 0-DTE lottery) is the Mr. Market trade: act on his emotion, not with it.'
  },
  {
    id: 'investment_vs_speculation',
    title: 'Investment versus Speculation',
    chapter: 'Chapter 1 — Investment versus Speculation',
    quote: '"An investment operation is one which, upon thorough analysis promises safety of principal and an adequate return."',
    corePhilosophy: 'Speculators gamble on whether next person pays more tomorrow (Greater Fool). Investors purchase productive assets where earnings, assets, dividends justify price. In Whispering Grove, MASTER: Calls & Puts, direction, Delta. Face Ponzi Alchemist "SBF" + $DogeTulip Goblin — crypto = bait. Defeat Grizzly Bear of Drawdowns by understanding panic selling.',
    whyYouFailed: 'You mistook pure speculation for investing. You chased shiny promises of overnight 100x riches instead of rigorous valuation.',
    reflectionQuestion: {
      prompt: 'What are Graham\'s three pillars of authentic investment operation?',
      choices: [
        'Hype, momentum, high leverage.',
        'Thorough analysis, safety of principal, adequate (not miraculous) return.',
        'Secret telegram signals, fast algo, zero research.',
        'Hold indefinitely without checking balance sheets.'
      ],
      correctIndex: 1,
      explanation: 'Graham defined investment as operation guaranteeing thorough analysis, protection of principal, and adequate return.'
    },
    protectionBonus: 'Permanent: Distinguishes investment vs speculation, blocks rug-pull tokens, unlocks Value Asset sight',
    oracleRune: 'ᛝ',
    mechanicLesson: 'Options mechanic (McMillan): a covered call converts speculation into income — you already own the shares, so the short call has no unlimited-loss tail. A naked call, by contrast, carries unbounded risk: theory, not hope, defines the position.'
  },
  {
    id: 'theta_protection',
    title: 'The River of Time — Theta Decay',
    chapter: 'Chapter 5 — Theta & Calendar Spreads (Olmstead)',
    quote: '"Time is the silent predator of options buyers; it devours extrinsic value with every setting sun."',
    corePhilosophy: 'ACT 2 - TIME (Theta Steppes): The Chrono-Sphinx froze the river of time; options rot into nothingness. MASTER: Theta decay, calendar spreads. Riddle: "What does the 0-DTE lottery call truly cost you?" Answer: patience + capital. Lesson: "nothing happens" is profit for disciplined trader. The gambler starves waiting for move.',
    whyYouFailed: 'You bought short-dated OTM lottery tickets and watched Theta bleed your hearts daily. You treated options like scratch-offs, not insurance.',
    reflectionQuestion: {
      prompt: 'When does Theta accelerate most rapidly for ATM option?',
      choices: [
        '180+ days remaining',
        'Final 30 to 7 days before expiration',
        'Theta remains constant always',
        'Only weekends'
      ],
      correctIndex: 1,
      explanation: 'Theta curves steepen dramatically final 30 days as time premium collapses to zero. Calendar spreads exploit this.'
    },
    protectionBonus: 'Permanent: +20% Theta resistance, unlocks Calendar Spread rune, can earn while waiting',
    oracleRune: 'ᛃ',
    mechanicLesson: 'Options mechanic (McMillan): an option\'s price is intrinsic + time value, and theta is the daily rent you pay. ATM options lose roughly a third of their remaining time value in the final 30 days — decay accelerates, so long options bleed fastest at the end while short options collect it.'
  },
  {
    id: 'vega_protection',
    title: 'The Hydra of Implied Vega — Volatility',
    chapter: 'Chapter 7 — Vega & IV Crush (Olmstead)',
    quote: '"Beware the eve of great announcements; the monster inflates prices before dawn, only to exhale and crush them."',
    corePhilosophy: 'ACT 4 - VOL (Volatility Caldera): Hydra of Implied Vega — every head a market shock spitting IV crush. MASTER: Vega, buying cheap IV, selling euphoric IV. Buy shield when everyone else\'s is on fire. Pre-earnings IV 80% pumps premiums, then collapses post-announcement even if direction correct.',
    whyYouFailed: 'You bought expensive naked options at 80% IV before earnings, then IV Crush destroyed value despite correct direction.',
    reflectionQuestion: {
      prompt: 'Why might correct earnings prediction still lose money on OTM Call bought day before?',
      choices: [
        'Options illegal during earnings',
        'Post-earnings IV Crush collapsed extrinsic faster than delta gain',
        'Stock moved too quickly for broker',
        'Delta turns negative on good news'
      ],
      correctIndex: 1,
      explanation: 'Pre-earnings IV inflated. Post-announcement collapse wiped extrinsic faster than spot rise compensated. Use spreads to hedge Vega.'
    },
    protectionBonus: 'Permanent: Vega hedged by spreads, -30% IV Crush damage, unlocks Long Straddle mastery',
    oracleRune: 'ᛋ',
    mechanicLesson: 'Options mechanic (McMillan): vega is the sensitivity of an option\'s price to implied volatility. A long straddle profits from a big move in either direction but bleeds theta daily, and IV crush after an announcement can erase gains even when the direction was right.'
  },
  {
    id: 'leverage_protection',
    title: 'The Liquidation Lord — Position Sizing & Kelly',
    chapter: 'Chapter 20 — Capital Preservation & Kelly Criterion',
    quote: '"Rich is survival first, growth after safety."',
    corePhilosophy: 'ACT 5 - THE CITADEL: Liquidation Lord Marduk Vex, fallen Oracle-Sage who rejected margin of safety for max leverage. MASTER: capital preservation + Kelly Criterion / position sizing / knowing when to take NO trade. TRUE ENDING: you don\'t kill him — you out-discipline him. He confesses he once valued margin of safety, one ruinous year broke him. He sits as humble student.',
    whyYouFailed: 'You used 100x unhedged leverage. Even correct thesis dies when 0.4% wick liquidates you before thesis plays out. Size kills.',
    reflectionQuestion: {
      prompt: 'What does Kelly Criterion teach about position sizing?',
      choices: [
        'Always bet 100% of capital on high conviction',
        'Bet fraction of capital proportional to edge/odds, preserve capital to survive',
        'Use max margin to maximize returns',
        'Position size doesn\'t matter if thesis correct'
      ],
      correctIndex: 1,
      explanation: 'Kelly: bet fraction proportional to edge, never risk ruin. Survival first. True richest investor is one who learned rich = survival first, growth after safety.'
    },
    protectionBonus: 'Permanent: Kelly sizing enforced (max 25% per trade), immune to 100x leverage scams, unlocks true ending',
    oracleRune: 'ᛟ',
    mechanicLesson: 'Options mechanic (McMillan): defined-risk structures — spreads, covered calls, condors — cap your maximum loss at construction. Position size so no single trade risks more than 1–2% of the account: Kelly warns that over-sizing a real edge still leads to ruin.'
  },
  {
    id: 'fomo_protection',
    title: 'The Charm Monsters — FOMO & Social Proof',
    chapter: 'Chapter 12 — Investor Behavior & Scams',
    quote: '"The market is a pendulum that forever swings between unsustainable optimism and unjustified pessimism."',
    corePhilosophy: 'Charm monsters overpromise; sages are patient and dry; Liquidation Lord is menacing but cautionary tragedy. Never cynical. The Ponzi Alchemist "SBF" and $DogeTulip Goblin are crypto bait. True path: trader (aggressive but defined-risk), investor (slow value-first), hybrid. Different quests/bosses, same true end — crown of richest investor reached by discipline practiced.',
    whyYouFailed: 'You fell for social proof, meme rockets, unaudited yield farms. You let influencers be your Oracle instead of Daen Alterspire.',
    reflectionQuestion: {
      prompt: 'How to handle a Telegram group promising 10,000% APY meme rocket?',
      choices: [
        'Invest life savings immediately before it pumps',
        'Check: audited? cash flows? margin of safety? If not, it\'s speculation, not investment',
        'Borrow to invest more',
        'Trust because many followers'
      ],
      correctIndex: 1,
      explanation: 'Intelligent investor demands thorough analysis, safety of principal. If no audited cash flows or tangible assets, it fails Graham\'s test. Reject and earn wisdom.'
    },
    protectionBonus: 'Permanent: Scam radar +50%, auto-rejects unaudited APY, +250 florins bounty for discipline',
    oracleRune: 'ᛉ',
    mechanicLesson: 'Options mechanic (McMillan): expensive premium is the crowd\'s fear priced in. When everyone is panic-buying puts or chasing hype calls, IV is pumped — the disciplined act is selling that fear (defined-risk credit spreads) or standing aside, never joining the chase.'
  }
];

export const GRAHAM_PROTECTIONS_META: Record<string, { title: string; bonus: string; rune: string }> = {
  margin_of_safety: { title: 'Margin of Safety', bonus: '+10% collateral buffer', rune: 'ᚠ' },
  mr_market: { title: 'Mr. Market Discipline', bonus: 'FOMO immunity', rune: 'ᛗ' },
  investment_vs_speculation: { title: 'Investment vs Speculation', bonus: 'Scam sight', rune: 'ᛝ' },
  theta_protection: { title: 'Theta Mastery', bonus: '+20% time resistance', rune: 'ᛃ' },
  vega_protection: { title: 'Vega Mastery', bonus: '-30% IV Crush', rune: 'ᛋ' },
  leverage_protection: { title: 'Kelly Discipline', bonus: 'Max 25% size', rune: 'ᛟ' },
  fomo_protection: { title: 'FOMO Shield', bonus: '+50% scam radar', rune: 'ᛉ' }
};

// Real options-mechanic MCQs (McMillan, "Options as a Strategic Investment") gated
// before each trade encounter. Wrong pick = fail->learn via the Sanctuary.
export const OPTIONS_MECHANIC_CHALLENGES: OptionsMechanicChallenge[] = [
  {
    id: 'mech_put_intrinsic',
    tiedLessonId: 'margin_of_safety',
    prompt: 'Which is the intrinsic value of a $50 strike put when the stock is $44?',
    choices: ['$6', '$50', '$44', 'Nothing'],
    correctIndex: 0,
    explanation: 'Intrinsic value = max(strike − spot, 0) = 50 − 44 = $6. Any price above that is time value — the margin you must justify.'
  },
  {
    id: 'mech_theta_final30',
    tiedLessonId: 'theta_protection',
    prompt: 'An ATM call has 30 days left. What does theta do to its time value?',
    choices: [
      'Decay stops until the final week',
      'Nothing — time value is constant',
      'It loses roughly a third of remaining time value as decay accelerates',
      'Time value rises as expiration nears'
    ],
    correctIndex: 2,
    explanation: 'Theta accelerates in the final 30 days: an ATM option sheds about a third of its remaining time value. Long options bleed fastest at the end; short options collect it.'
  },
  {
    id: 'mech_iv_crush',
    tiedLessonId: 'vega_protection',
    prompt: 'You buy an OTM call the day before earnings at 80% IV. The stock pops. Why might you still lose?',
    choices: [
      'Calls expire worthless immediately after earnings',
      'Post-announcement IV crush collapses extrinsic value faster than the delta gain',
      'Brokers freeze options on earnings days',
      'Delta turns negative on good news'
    ],
    correctIndex: 1,
    explanation: 'Vega: the premium was inflated by uncertainty. Once the event resolves, IV collapses and extrinsic value evaporates — correct direction, wrong volatility.'
  }
];

// Deterministic per-day pick so the same trade day surfaces one coherent beat + challenge.
export const getTradeMechanicGate = (day: number): { lesson: IntelligentInvestorLesson; challenge: OptionsMechanicChallenge } => {
  const challenge = OPTIONS_MECHANIC_CHALLENGES[day % OPTIONS_MECHANIC_CHALLENGES.length];
  const lesson = INTELLIGENT_INVESTOR_LESSONS.find(l => l.id === challenge.tiedLessonId) || INTELLIGENT_INVESTOR_LESSONS[0];
  return { lesson, challenge };
};
