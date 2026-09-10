import { IntelligentInvestorLesson, OptionsMechanicChallenge, TradeEncounter } from '../types';

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

// Richer trade encounters (Olmstead "Options For The Beginner And Beyond" +
// McMillan "Options as a Strategic Investment", verified extracts in tests/).
// Each states thesis, entry, max profit, max loss, breakeven where applicable,
// and one decision with a real consequence. Wrong pick = fail->learn Sanctuary.
export const TRADE_ENCOUNTERS: TradeEncounter[] = [
  {
    id: 'enc_bull_call_vertical',
    tiedLessonId: 'margin_of_safety',
    strategy: 'BULL_CALL_SPREAD',
    title: 'Twin Blades of Defined Risk — the Bull Call Spread',
    thesis: 'XYZ trades at $35 and you expect $40 or higher by November. Buying the Nov 35 call outright costs $4.10 — all time value. If XYZ barely reaches $40 at expiry, the call is worth only $5, a $90 profit on $410 risked. To lower the risk, finance the long call by selling the Nov 40 call against it.',
    entry: 'Net debit $2.00/share — buy 1 Nov 35 call at $4.10, sell 1 Nov 40 call at $2.10 = $200 per contract.',
    maxProfit: '$300 per contract ($3/share — $5 spread width minus $2 debit) if XYZ is at or above $40 at November expiry.',
    maxLoss: '$200 per contract — the net debit. That is the entire risk; nothing else can go wrong.',
    breakeven: '$37 at November expiry (long strike + net debit).',
    source: 'Olmstead, Chapter 10 — Vertical Spreads (bull call spread example, tests/olm_ch10_vertical.txt).',
    failReason: 'DIRECTIONAL_WRONG',
    decision: {
      prompt: 'XYZ is $35. You want the $40 move but refuse to pay $410 for an all-time-value call. What do you forge?',
      choices: [
        {
          text: 'Buy the naked Nov 40 call instead — it is cheaper, so it must be safer.',
          correct: false,
          outcome: 'The cheaper call is cheap for a reason: lower delta, higher odds of expiring worthless. You saved pennies on the entry and paid for it in probability. The Sanctuary re-teaches margin of safety.',
          hearts: 1
        },
        {
          text: 'Bull call spread: buy the Nov 35 call at $4.10, sell the Nov 40 call at $2.10 — $200 net debit, $200 max risk, $300 max profit, breakeven $37.',
          correct: true,
          outcome: 'Defined risk at construction. Even a total miss costs only the $200 debit, and hitting $40 pays $3/share — 150% on risk. Margin of safety, spelled in strike prices.',
          florins: 250
        },
        {
          text: 'Sell naked Nov 40 calls for the $2.10 credit — you keep the premium if XYZ stalls.',
          correct: false,
          outcome: 'A naked short call has no ceiling on its loss. If XYZ gaps to $48, you owe $6/share with no long leg to cap it. The Sanctuary shows you the unbounded tail.',
          hearts: 1
        }
      ],
      explanation: 'A vertical spread caps BOTH sides: max loss = net debit, max profit = (strike width − net debit) × 100. You traded unlimited upside for a structure that cannot surprise you — Olmstead\'s bull call spread.'
    }
  },
  {
    id: 'enc_calendar_theta',
    tiedLessonId: 'theta_protection',
    strategy: 'CALENDAR_SPREAD',
    title: 'Chrono-Sphinx Sands — Selling Front-Month Time',
    thesis: 'XYZ is $34.70 in early May. Sell 1 Jun 35 call at $1.20 (all time value) and buy 1 Nov 35 call at $3.50 — a $2.20 net debit ($220). The June option decays fast; the November option barely bleeds. If XYZ sits still near $35, the short call dies worthless while the long one keeps most of its worth.',
    entry: 'Net debit $2.20/share — $220 per contract (buy Nov 35 call $3.50, sell Jun 35 call $1.20).',
    maxProfit: 'Variable — limited to the November call\'s remaining value when the June call expires. In the book\'s idealized case: +$80 in six weeks (36% on risk), then repeatable by selling July for another $80 (67% on the reduced $120 basis).',
    maxLoss: '$220 per contract — the net debit, if the short leg is a total loss against a worthless long leg.',
    source: 'Olmstead, Chapter 12 — Calendar Spreads (tests/olm_ch12_calendar.txt).',
    failReason: 'THETA_DECAY_CRUSH',
    decision: {
      prompt: 'June expiry arrives and XYZ is still $34.70 — the trade worked as designed. What is the disciplined move?',
      choices: [
        {
          text: 'Close everything — the stock went nowhere, so the trade must have failed.',
          correct: false,
          outcome: '"Nothing happens" IS the calendar\'s profit condition. The June call you sold expired worthless: all $1.20 of time value is yours. Walking away now forfeits the decay you were paid to collect.',
          hearts: 1
        },
        {
          text: 'Do nothing at June expiry — the short Jun 35 call dies worthless; then sell the Nov 35 call near $3.00 for roughly +$80.',
          correct: true,
          outcome: 'The June call surrendered its full $1.20 of time value while your November call lost only about $0.50. Net ≈ +$0.80/share — decay collected, capital preserved. You can even sell July next.',
          florins: 250
        },
        {
          text: 'Roll the proceeds into 0-DTE calls — the move must come any day now.',
          correct: false,
          outcome: 'The 0-DTE lottery costs patience + capital. You just farmed theta; handing the harvest to the house\'s fastest table is how the Chrono-Sphinx wins. The Sanctuary re-teaches the river of time.',
          hearts: 1
        }
      ],
      explanation: 'A calendar profits when time does its uneven work: front-month theta decay outruns back-month decay. The short leg\'s total collapse is your income; the long leg\'s slow bleed is your rent.'
    }
  },
  {
    id: 'enc_covered_vs_naked',
    tiedLessonId: 'investment_vs_speculation',
    strategy: 'COVERED_CALL',
    title: 'Harvest of the Covered Field vs the Naked Abyss',
    thesis: 'You hold 100 shares of XYZ bought at $30. A Jun 35 call sells for $1.00. Writing it against shares you own collects $100 of income with no new risk tail. Writing the identical call WITHOUT owning the shares — a naked call — collects the same $100 but owes the market everything above $35, forever.',
    entry: 'Covered: no new cash (already own 100 shares at $3,000) + $100 credit from the short Jun 35 call. Naked: $100 credit, zero cover.',
    maxProfit: 'Covered: $600 per contract — $5/share of stock appreciation to the $35 strike plus the $1 premium. Capped, because you sold away upside above $35. Naked: the same $100 premium — and nothing more, ever.',
    maxLoss: 'Covered: $2,900 — stock falling to zero minus the premium collected. Painful but bounded, and you keep the shares. Naked: unbounded — every dollar XYZ rises above $35 is a dollar you owe, with no stock to deliver.',
    breakeven: '$29 — stock cost minus premium collected.',
    source: 'Olmstead, Chapter 14 — Covered Calls; Chapter 5/20 — Naked Call Writing (McMillan: a naked call carries unbounded risk).',
    failReason: 'OVERLEVERAGE_MARGIN_CALL',
    decision: {
      prompt: 'Two desks offer the same $100 credit for the same Jun 35 call. One requires you own the shares; one does not. Same premium — same trade?',
      choices: [
        {
          text: 'Same premium, same trade — write the naked call and skip buying $3,000 of stock.',
          correct: false,
          outcome: 'The premiums are identical; the tails are not. Covered, your worst case is owning stock you chose. Naked, a takeover rumor or squeeze owes the counterparty everything above $35. Theory, not hope, defines the position.',
          hearts: 1
        },
        {
          text: 'Write it covered — collect the $100 against shares you own: $600 max profit, breakeven $29, no new tail.',
          correct: true,
          outcome: 'An investment operation: thorough analysis, safety of principal, adequate return. The short call has no unlimited-loss tail because you already own what you might have to deliver.',
          florins: 200
        },
        {
          text: 'Buy the shares AND five extra naked calls — diversify the premium.',
          correct: false,
          outcome: 'Five uncovered calls is five unbounded tails wearing one income costume. Covered-call income comes from shares you hold; scaling it by going naked is speculation, not investment.',
          hearts: 1
        }
      ],
      explanation: 'A covered call converts speculation into income — you own the shares, so the short call has no unlimited-loss tail. A naked call is the same premium with an unbounded risk graph. McMillan: the position, not the payout, defines the risk.'
    }
  },
  {
    id: 'enc_protective_put_collar',
    tiedLessonId: 'mr_market',
    strategy: 'LONG_PUT',
    title: 'The Married Put and the Collar — Insurance Against Mr. Market',
    thesis: 'You buy 100 shares of XYZ at $31, expecting $35 or higher — but Mr. Market knocks with manic lows before any rise. Without insurance, a fall to $30 costs the full $3,100 of stock risk. Buying the Sept 30 put at $0.80 alongside the shares caps that downside at $180 while you wait for the uptrend.',
    entry: 'Cost $3,180 — 100 shares at $31 plus 1 Sept 30 put at $0.80 ($80 of premium).',
    maxProfit: 'Uncapped on the upside — every dollar above $31.80 is yours; the put only insures, it never sells away upside the way a short call does.',
    maxLoss: '$180 — if XYZ is below $30 at September expiry, exercise the put and sell at $30: $1/share of stock loss plus $0.80 premium. Without the put, the same fall risks $3,100.',
    breakeven: '$31.80 — stock cost plus put premium.',
    source: 'Olmstead, Chapters 17–18 — Married Puts and Collars (tests/olm_ch17_married.txt, olm_ch18_collars.txt); the collar variant adds a short call that cuts the insurance cost and caps upside.',
    failReason: 'NO_STOP_LOSS',
    decision: {
      prompt: 'You own the shares but fear a pullback before your $35 thesis plays out. A trader brags that stop-loss orders make insurance unnecessary. What do you do?',
      choices: [
        {
          text: 'Rely on a stop-loss order at $30 — same protection, no premium wasted.',
          correct: false,
          outcome: 'A stop is a market order once triggered: a gap through $30 fills far lower, and a wick can evict you days before the recovery your thesis predicted. The married put exists precisely to avoid the stop-loss problem.',
          hearts: 1
        },
        {
          text: 'Buy the Sept 30 put with the shares — $80 premium caps worst case at $180 and lets you hold through the pullback.',
          correct: true,
          outcome: 'Insurance in place: below $30 you exercise and exit at $30 no matter how hard Mr. Market panics. Max risk drops from $3,100 to $180 and you stop watching the ticker like a hostage.',
          florins: 200
        },
        {
          text: 'Sell a naked put instead for $0.80 — collecting premium is the same as buying protection.',
          correct: false,
          outcome: 'Selling a put is the opposite side of the trade: you become the insurer, not the insured. A crash below $30 now hands you the shares at a loss instead of paying you. Direction of the premium matters.',
          hearts: 1
        }
      ],
      explanation: 'A married put pays a known premium to cap a known worst case — $180 here, versus $3,100 exposed. A collar goes further: sell an OTM call to finance the put, trading some upside for cheaper insurance. A stop-loss is not insurance — it is a guaranteed sale at whatever price the panic will pay.'
    }
  },
  {
    id: 'enc_position_sizing',
    tiedLessonId: 'leverage_protection',
    strategy: 'CASH_SECURED_PUT',
    title: 'The Liquidation Lord\'s Ledger — Position Sizing & Maximum Loss',
    thesis: 'OVTI trades near $25 with earnings due June 9. Selling 5 Jun 25 puts naked collects $500 — easy money if the report is rosy. Then the earnings announcement is delayed amid an investigation: the stock opens at $19 and bleeds to $15.50. Buying back the 5 puts at $9.50 costs $4,750 against your $500 credit — a $4,250 hole from one "safe" trade.',
    entry: '$500 credit — 5 contracts of naked Jun 25 puts at $1.00.',
    maxProfit: '$500 — the full credit, only if the puts expire worthless.',
    maxLoss: '$12,000 theoretical ($24/share × 5 contracts × 100) if the stock went to zero; $4,250 in the book\'s actual case. The credit is fixed; the loss is not.',
    source: 'McMillan, Chapter 20 (naked put example, OVTI June 2004) + Graham leverage lesson: Kelly sizing — no single trade may risk more than 1–2% of the account.',
    failReason: 'OVERLEVERAGE_MARGIN_CALL',
    decision: {
      prompt: 'Your account holds $10,000. You like the same $1.00 put sale. What does the discipline of survival first demand?',
      choices: [
        {
          text: 'Sell all 5 contracts — $500 credit is $500 credit, and the thesis is sound.',
          correct: false,
          outcome: 'A 43% account hole ($4,250 on $10,000) from one delayed earnings report. Even a correct thesis dies when sizing kills you first — the Liquidation Lord\'s own confession.',
          hearts: 1
        },
        {
          text: 'Size so the maximum loss stays within 1–2% of the account ($100–$200) — and only in a defined-risk structure.',
          correct: true,
          outcome: 'Kelly discipline: bet a fraction proportional to your edge, never so much that one adverse tape ends the game. Defined-risk structures cap max loss at construction; sizing keeps that cap survivable.',
          florins: 250
        },
        {
          text: 'Sell the 5 puts but keep a mental stop — you will exit if it "feels" wrong.',
          correct: false,
          outcome: '"Feels wrong" is not a risk limit. The stock gapped from $25 toward $19 overnight — no mental stop could have filled anywhere near your mental price. Uncapped loss, unmanaged.',
          hearts: 1
        }
      ],
      explanation: 'Position sizing is the margin of safety applied to yourself: size so no single trade — especially one with an uncapped tail — can risk more than 1–2% of the account. Kelly warns that over-sizing a real edge still leads to ruin.'
    }
  }
];

// Deterministic per-day encounter pick — pairs with getTradeMechanicGate so the
// same trade day surfaces one coherent mechanic beat followed by one encounter.
export const getTradeEncounter = (day: number): TradeEncounter =>
  TRADE_ENCOUNTERS[day % TRADE_ENCOUNTERS.length];
