import { IntelligentInvestorLesson } from '../../types';

/**
 * CRYPTO ARC — Pitfalls of the speculative frontier.
 * Chapters cite real events: BTC 2021 cycle, Terra/Luna May 2022,
 * FTX Nov 2022. Each lesson ties the crypto failure to its options
 * equivalent in the Legend of Valuaria mechanic layer.
 */
export const CRYPTO_ARC_LESSONS: IntelligentInvestorLesson[] = [
  {
    id: 'recovery_math',
    title: 'Recovery Math: The Asymmetry That Eats You',
    chapter: 'BTC 2021 cycle — $69k to $15.5k',
    quote: '"A 50% loss requires a 100% gain just to get back to even."',
    corePhilosophy: 'Drawdowns and recoveries are not symmetric. \u221250% needs +100%; \u221260% needs +150%; \u221280% needs +400%; \u221290% needs +900%. BTC 2021\u20132022: $69k \u2192 $15.5k was \u221277% — the buy-the-dip crowd at $20k still needed +120% to break even. This asymmetry is why the desk trader who lives on Robinhood margin knows it in his bones: every drawdown on borrowed money compounds the hole. The repair principle from Chapter 16 applies — you cannot un-lose money by adding risk; you restructure the payoff and cap further loss.',
    whyYouFailed: 'You averaged down all the way into the \u221280% hole, then needed a 5x just to get back to even — and kept the leverage on while trying.',
    reflectionQuestion: {
      prompt: 'Your position is down 80%. What gain returns you to breakeven?',
      choices: ['+80%.', '+100%.', '+400% — losses compound downward, so recovery must compound upward.', '+160%.'],
      correctIndex: 2,
      explanation: 'From 20% of your cost, you must multiply by 5. The deeper the hole, the more asymmetric the climb — which is why avoiding the hole is the whole game.'
    },
    protectionBonus: 'Permanent: recovery_math — every drawdown displays its breakeven multiplier live',
    oracleRune: 'ᛦ',
    mechanicLesson: 'Options equivalent: the stock repair spread (1 long ATM call + 2 short OTM calls) restructures a fallen position so a partial recovery pays like a full one — without adding risk.'
  },
  {
    id: 'fomo_protection',
    title: 'FOMO Tops: The Story Recruits You at the Worst Price',
    chapter: 'BTC 2021 cycle — Coinbase listing week peak',
    quote: '"When cab drivers give stock tips, it is time to sell."',
    corePhilosophy: 'The $0.001 \u2192 $50,000 story is not information — it is marketing. It circulates loudest exactly at the top, because the story itself is what recruits marginal buyers whose purchases ARE the top. Coinbase\u2019s Super Bowl listing, Elon\u2019s SNL Dogecoin appearance (top tick, May 8 2021): maximum media = maximum bagholders. You bought at $49k because the story guaranteed $100k; the bottom at $15.5k came with silence, not headlines. Mr. Market in crypto form: euphoric at the high, invisible at the low.',
    whyYouFailed: 'You entered because everyone was talking about it. Loud entry signals are a census of who is already in — nobody is left to buy from you.',
    reflectionQuestion: {
      prompt: 'A coin is up 400% this month and every feed is full of screenshots. What is the mechanical read?',
      choices: ['The trend confirms more upside.', 'The advertising IS the distribution: late buyers are the exit liquidity for early ones.', 'It is a guaranteed $100k.', 'Screenshots do not matter either way.'],
      correctIndex: 1,
      explanation: 'Reflexive markets need new money to sustain price. The moment the story reaches you — the last uninformed buyer — the marginal bid is exhausted.'
    },
    protectionBonus: 'Permanent: fomo_protection — purchases on parabolic volume trigger a 24h cooldown with a drawdown-from-high readout',
    oracleRune: 'ᚠ',
    mechanicLesson: 'Options equivalent: buying calls after vega has spiked on a rumor — you pay the top of the hype premium. Olmstead\u2019s rule: never buy the inflated option; wait for the dust to settle.'
  },
  {
    id: 'leverage_liquidation',
    title: 'Leverage & Liquidation: One Red Candle',
    chapter: 'Terra/Luna May 2022 and the May 19 2021 cascade',
    quote: '"The market can stay irrational longer than you can stay solvent."',
    corePhilosophy: '5x and 10x longs do not need a bear market — they need one red candle. May 19, 2021: BTC dropped ~30% in hours; $8\u201310B of positions liquidated, and those liquidations (forced market sells) crashed price further, triggering more liquidations — a cascade, not a dip. Perpetual funding costs bleed longs 0.01\u20130.1% per 8h while they wait. \u221220% at 10x is \u2212200%: account zero, then a negative balance you still owe. The lesson is not "leverage is risky" — it is that leverage converts temporary price error into permanent capital death.',
    whyYouFailed: 'You ran 10x on a "sure thing." One wick to your liquidation price erased everything, and the cascade you fed made the wick deeper.',
    reflectionQuestion: {
      prompt: 'BTC is 10x long at $40k. A single \u221211% candle prints. Where are you?',
      choices: ['Down 11%, fine.', 'Down ~110% — liquidated to zero or below; the position no longer exists.', 'Down 1.1%.', 'The exchange absorbs the loss.'],
      correctIndex: 1,
      explanation: 'At 10x, an 11% adverse move is 110% of margin — the engine force-closes you at the worst tick, selling your position into the very cascade it is causing.'
    },
    protectionBonus: 'Permanent: leverage_liquidation — liquidation price shown before entry; cascade risk flagged at high open interest',
    oracleRune: 'ᛚ',
    mechanicLesson: 'Options equivalent: selling naked options. Defined-risk structures (verticals) cap max loss at the credit spread width; naked shorts — like 10x longs — have unbounded loss on one gap. Never hold a position whose worst case is "everything."'
  },
  {
    id: 'this_time_different',
    title: 'The Four Most Expensive Words',
    chapter: 'BTC 2021 cycle — "supercycle" narrative at $69k',
    quote: '"This time is different" — Sir John Templeton\u2019s four most dangerous words in investing.',
    corePhilosophy: 'Every cycle, the story upgrades: 2017 it was "digital gold store of value"; 2021 it was "institutional supercycle, no more 80% drawdowns, corporations are buying." MicroStrategy at $30k average, Tesla at ~$30k+, El Salvador legal tender — and BTC still drew down 77% to $15.5k. The mechanics never change: reflexive assets need marginal buyers, and marginal buyers are finite. "This time" narratives are how each cycle\u2019s final buyers justify ignoring every previous cycle\u2019s ending. The claim itself is a contrarian indicator: the louder it gets, the closer the mean reversion.',
    whyYouFailed: 'You believed the supercycle thesis at the top and held through \u221277% waiting for institutions to validate you. Institutions do not validate bagholders.',
    reflectionQuestion: {
      prompt: 'Every prior cycle drew down 80%+. This cycle "institutions changed everything." Best response?',
      choices: ['Position sizing and exit plans that survive an 80% drawdown — the base rate is the base rate until proven otherwise.', 'All-in; this time is structurally different.', 'Leverage up because the downside is impossible now.', 'There is no historical base rate to consult.'],
      correctIndex: 0,
      explanation: 'Base rates from four prior cycles survived every institutional narrative. You do not have to be a perma-bear to respect them — you just have to size so the base rate cannot kill you.'
    },
    protectionBonus: 'Permanent: this_time_different — narrative-euphoria meter flags "new paradigm" language in feeds',
    oracleRune: 'ᛗ',
    mechanicLesson: 'Options equivalent: "this expiry will be different" — every assignment chapter rule (the $0.20 time-value line) exists because the SAME mechanics repeat every cycle. Write rules from repetition, not hope.'
  },
  {
    id: 'yield_ponzi',
    title: 'Yield That Comes From New Buyers Is Not Yield',
    chapter: 'Terra/Luna May 2022 — Anchor Protocol\u2019s 19.5%',
    quote: '"If you cannot identify who is paying you, you are the product."',
    corePhilosophy: 'Anchor Protocol paid 19.5% "savings yield." The reserve fund bled down as withdrawals grew; the yield was circular — UST printed against LUNA, LUNA\u2019s value depended on UST demand. When $2B left in one weekend, the death spiral took $40B with it. Real yield comes from a cashflow-generating activity someone profitsably pays for. Fake yield comes from token emissions or new deposits — a redistribution from tomorrow\u2019s buyers to today\u2019s. Stablecoin "risk-free 10%+" is actually selling crash insurance (short volatility): you collect small premiums until the one depeg event takes years of "yield" and the principal.',
    whyYouFailed: 'You parked everything in the 19.5% "stable" account and called it income. You were short a depeg and did not know it.',
    reflectionQuestion: {
      prompt: 'A stablecoin account pays 19.5%, far above comparable rates. What is the honest interpretation?',
      choices: ['Found money — arbitrage.', 'You are being paid to bear hidden risk (depeg/solvency); the excess IS the premium for shorting volatility.', 'The rate proves the system is sound.', 'Risk-free yield exists if the team is doxxed.'],
      correctIndex: 1,
      explanation: 'No one profitably pays 19.5% risk-free. The spread over the risk-free rate is compensation for a tail risk — exactly what a naked short put collects, and it expires the same way.'
    },
    protectionBonus: 'Permanent: yield_ponzi — yield sources audited; emission-funded yields flagged as redistribution, not income',
    oracleRune: 'ᛞ',
    mechanicLesson: 'Options equivalent: selling naked puts for premium. Small steady credits, then one event takes the account. Olmstead\u2019s rule: sell defined-risk spreads, and ask of ANY income — what risk am I selling?'
  },
  {
    id: 'rug_pull_recognition',
    title: 'Rug Pull Recognition: Audits, Locks, Doxxing',
    chapter: 'DeFi 2021\u20132022 — Squid Game token, Bitconnect, countless LP drains',
    quote: '"Not your keys, not your coins — and not your liquidity, not your yield."',
    corePhilosophy: 'A rug pull is the developer as counterparty: mint control, LP (liquidity pool) withdrawal rights, and honeypot contracts — code that lets you buy but not sell. The checklist: (1) audited by a named firm, with the report public and no criticals unresolved; (2) LP tokens locked or burned via a timelock you can verify on-chain — otherwise the "team" can pull the pool in one transaction; (3) doxxed team with reputation at stake — anonymous founders have no collateral; (4) ownership renounced, mint functions disabled; (5) you can actually SELL (test with a small amount). Squid Game token rose 2,300% then went to zero in minutes when sell functions failed. Unchecked boxes are not risk — they are the plan.',
    whyYouFailed: 'You bought because the chart went up, never checked if liquidity was locked, and discovered the honeypot when you tried to sell.',
    reflectionQuestion: {
      prompt: 'A new token is mooning. The team is anonymous, LP is unlocked, and no audit exists. What are you holding?',
      choices: ['An early opportunity.', 'A claim on nothing — the developer can mint infinite supply and drain the pool at will; you are the exit liquidity.', 'A hedge against inflation.', 'Community-owned assets by default.'],
      correctIndex: 1,
      explanation: 'Unlocked LP + anonymous team + no audit is the full rug checklist, every box wrong. Price going up is not due diligence — it is the bait.'
    },
    protectionBonus: 'Permanent: rug_pull_recognition — every token purchase runs the 5-point checklist and blocks on honeypot detection',
    oracleRune: 'ᛉ',
    mechanicLesson: 'Options equivalent: counterparty and assignment risk. The exchange/contract you trade through is a counterparty — Olmstead\u2019s assignment anxiety chapter teaches reading the mechanics BEFORE you hold the position, not after.'
  },
  {
    id: 'cold_storage_custody',
    title: 'Not Your Keys, Not Your Coins',
    chapter: 'FTX Nov 2022 — $8B customer funds rehypothecated',
    quote: '"If you do not own the keys, you own an IOU — from whoever holds the keys."',
    corePhilosophy: 'An exchange balance is a database entry backed by the exchange\u2019s solvency, not an asset you control. FTX Nov 2022: $8B of customer funds lent to Alameda; withdrawals froze Nov 8; the database entry went to zero. Mt. Gox 2014, Celsius, Voyager — same pattern, different decade. Self-custody: hardware wallet (keys never touch an internet-connected machine), seed phrase on paper or steel, never digital photos or cloud notes — one leaked screenshot empties the wallet. Custodial risk is an option YOU wrote: you collect convenience (fast trading, staking one-click) and the premium paid out is your entire balance on the tail event.',
    whyYouFailed: 'You left everything on the exchange for convenience. When withdrawals froze, your "assets" were someone else\u2019s loan collateral.',
    reflectionQuestion: {
      prompt: 'Your BTC sits on an exchange. What do you actually own?',
      choices: ['BTC — the exchange holds it for me.', 'A claim against the exchange, recoverable only if it stays solvent and cooperative.', 'A government-guaranteed deposit.', 'Nothing differs between exchange and hardware wallet.'],
      correctIndex: 1,
      explanation: 'Unsecured counterparty credit. "Not your keys, not your coins" — hardware self-custody removes the solvency bet; you trade convenience for control.'
    },
    protectionBonus: 'Permanent: cold_storage_custody — exchange balances above threshold prompt withdrawal; custody type shown per holding',
    oracleRune: 'ᛜ',
    mechanicLesson: 'Options equivalent: cash-secured vs margin — owning the collateral outright vs borrowing exposure. Self-custody is the cash-secured position: slower, no leverage of convenience, no counterparty margin call.'
  },
  {
    id: 'crypto_boom_bust',
    title: 'Meme Reflexivity: When Price IS the Product',
    chapter: 'Dogecoin 2021 — $0.002 to $0.74 on no fundamentals',
    quote: '"With no cashflow, the only thing backing the price is the belief of the next buyer."',
    corePhilosophy: 'A productive asset has cashflows to value; a meme coin has only reflexive demand — price rises because people expect it to rise. Dogecoin: no supply cap, no utility, no cashflow, 40x in five months purely on attention. That makes price the product itself: early buyers are paid by later buyers, and the asset\u2019s "fundamentals" are literally the rate of new entrants. Reflexivity cuts both ways — when new entrants slow, price falls, which reduces entrants further. There is no floor except sentiment. Boom/bust is not a bug in the meme; it is the entire mechanism. You may trade it — you must not confuse it with owning anything.',
    whyYouFailed: 'You bought the meme "because it kept going up" and held it as an investment. When attention rotated, the only fundamental — new buyers — left.',
    reflectionQuestion: {
      prompt: 'A coin has no cashflow, no utility, no supply cap. What can its price analysis be based on?',
      choices: ['Discounted future earnings.', 'Only flows and reflexivity: who is entering, at what rate, and what is left when they stop.', 'Book value.', 'Nothing — it cannot have a price.'],
      correctIndex: 1,
      explanation: 'Greater-fool dynamics have no valuation floor. Flow analysis can trade it; valuation cannot. The distinction between trading and owning is the whole lesson.'
    },
    protectionBonus: 'Permanent: crypto_boom_bust — meme assets tagged with flow-driven warning; no "valuation" framing offered',
    oracleRune: 'ᛝ',
    mechanicLesson: 'Options equivalent: delta-neutral scalping vs long theta — you can trade direction and flows as a trade, but holding a cashflowless asset is paying theta (attention decay) with no expiry payoff.'
  },
  {
    id: 'hedge_not_gamble',
    title: 'Hedge, Don\u2019t Gamble: The Buffett Anchor',
    chapter: 'Through all cycles — Graham\u2019s student, Omaha',
    quote: '"Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1."',
    corePhilosophy: 'Warren Buffett is Graham\u2019s student: buy productive assets you understand, hold, and keep cash for the crash — he sat 2020\u20132022 with $100B+ in Treasuries while crypto partied. Options enter his vocabulary only one way: as a HEDGE (selling long-dated index puts against cash he already holds, or writing covered calls he is happy to be exercised on) — never as a lottery ticket. The recovery math lesson (−80% needs +400%) is the reason: capital preservation IS compounding. In crypto terms, this means small sized exposure, no leverage, cold custody, and using options to define worst cases — not to double them.',
    whyYouFailed: 'You used options as lottery tickets and crypto as the retirement plan. The gambler\u2019s position has no hedges, no cash reserve, and no exit — only size.',
    reflectionQuestion: {
      prompt: 'Buffett sells long-dated index puts while holding $100B in T-bills. What is this trade?',
      choices: ['A gamble on indexes going up.', 'A hedged structure: cash-covered put writing against assets he is willing to buy lower — premium on capital he already holds.', 'Naked leverage.', 'A Ponzi.'],
      correctIndex: 1,
      explanation: 'The puts are fully backed by cash and sized against the desire to own more at lower prices. Same instruments as the casino trade — entirely different structure. Structure, not instrument, is the risk.'
    },
    protectionBonus: 'Permanent: hedge_not_gamble — every position shows its hedged alternative; naked exposure prompts a defined-risk version',
    oracleRune: 'ᛟ',
    mechanicLesson: 'Options equivalent: protective puts and collars define your worst case BEFORE entry (Olmstead Ch17\u201318). The gambler buys calls; the hedger owns the floor. Same market, opposite survival curve.'
  },
  {
    id: 'intrinsic_value',
    title: 'What Does "Value" Even Mean?',
    chapter: 'Through all cycles — productive vs nonproductive assets',
    quote: '"A stock is ownership of a business; a coin is ownership of a hope."',
    corePhilosophy: 'Graham\u2019s intrinsic value is the discounted cashflows the ASSET generates to its owner — a bond pays coupons, a business pays earnings, a rental pays rent. BTC produces no cashflow to its holder, so DCF is undefined: any "value case" must rest on adoption (more future demand) or monetary premium (digital gold). That can still be an honest thesis — but it is a demand thesis, not a valuation, and it must be framed as such: "I expect more buyers" is a prediction, while "this earns $X" is a measurement. Know which kind of claim you are making, and never let a demand thesis borrow the confidence of a valuation thesis. The nonproductive asset can be held — sized and named for what it is.',
    whyYouFailed: 'You dressed a demand bet in valuation language — "network value," "addressable market" — and then sized it like something that had earnings behind it.',
    reflectionQuestion: {
      prompt: 'Can a rigorous "value case" exist for a nonproductive, cashflowless asset?',
      choices: ['Yes — standard DCF on projected earnings.', 'Only as a demand/scarcity thesis — honest but unfalsifiable-by-valuation; it must be sized as speculation, not investment.', 'No asset without cashflow can have any price.', 'Value does not apply to anything.'],
      correctIndex: 1,
      explanation: 'Graham\u2019s line: investment rests on analysis promising safety of principal and adequate return. Without cashflows, the analysis cannot promise either — so the position is speculation by definition, and deserves speculative size.'
    },
    protectionBonus: 'Permanent: intrinsic_value — cashflow vs demand-thesis framing forced at purchase; speculation-size caps applied',
    oracleRune: 'ᚨ',
    mechanicLesson: 'Options equivalent: option_selection — intrinsic value of an option is what it pays if exercised TODAY. An asset that pays nothing when "exercised" (held forever, no distribution) has zero fundamental intrinsic value; its price is all time value — i.e., all belief.'
  },
  {
    id: 'position_sizing',
    title: 'Position Sizing in Extreme Volatility',
    chapter: 'BTC 2021 cycle — 80% drawdowns as routine weather',
    quote: '"The question is not how much you can make, but how much you can lose and still be in the game."',
    corePhilosophy: 'An asset that routinely draws down 70\u201380% cannot be sized like an equity that draws down 30%. Two rules follow. (1) Survival size: what you can watch fall 80% without acting. If $5k of a $50k portfolio in BTC falling to $1k would force you to sell the bottom, your real size is not $5k — the volatility means you must size on the DRAWDOWN, not the stake. (2) Kelly discipline: edge is uncertain in reflexive markets, so bet fractions of even a fractional Kelly. Volatility drag makes the sequence matter: two \u221250%s is \u221275%, and no allocation "recovers on average" if the game ends. Sizing is the only risk control that works before the candle prints.',
    whyYouFailed: 'You put 60% of the portfolio in alts "for the cycle." The \u221290% alt drawdown took more than your "medium risk" — it took the portfolio.',
    reflectionQuestion: {
      prompt: 'You can tolerate losing $5k without panic. How much crypto can you hold?',
      choices: ['$25k — it will probably work out.', 'Roughly $5k / (1 − 0.8) is wrong-side math: size so that a routine 80% drawdown loses no more than $5k — about $6k, not $25k.', '$50k on margin to recover faster.', 'Size does not matter if the thesis is right.'],
      correctIndex: 1,
      explanation: 'In an asset with an 80% base-rate drawdown, your loss exposure is size × 0.8, not size. If $5k is the survivable loss, the position must be ~$6k. Thesis correctness does not waive arithmetic.'
    },
    protectionBonus: 'Permanent: position_sizing — max survivable loss input recalculates crypto allocation; drawdown-sized, not stake-sized',
    oracleRune: 'ᛠ',
    mechanicLesson: 'Options equivalent: max loss is known at entry on every defined-risk structure. Vertical spread risk $240 → sized so even full loss is survivable. Naked positions cannot be sized safely because max loss is undefined.'
  },
  {
    id: 'stop_loss_discipline',
    title: 'Exit Plans Made BEFORE Entry',
    chapter: 'Through all cycles — the bottom is decided at the top',
    quote: '"Everyone has a plan until they are down 50%."',
    corePhilosophy: 'Exits decided during a drawdown are decided by panic, not analysis — cortisol does not read charts. The plan is written at entry, when you are rational: profit target (scale out at predefined levels), invalidation point (the price/condition that proves the thesis wrong — not a percentage, a REASON), and time stop (if the thesis has not played out in N months, the marginal buyer assumption is dead). Write all three down before the fill. Olmstead\u2019s calendar rules are exactly this: take profit at ≥50% of max, cut at 50% of the debit — decided in Chapter 12, executed in a crash without thinking. The 2021 buyer with a written invalidation ("below the 200-week MA, thesis dead") exited at $23k. The buyer "deciding later" decided at $15.5k, by surrender.',
    whyYouFailed: 'You bought with an entry and no exits. Every decision afterward was made by the position — at the worst emotional moments — instead of by you in advance.',
    reflectionQuestion: {
      prompt: 'Best time to decide your stop and profit levels?',
      choices: ['When the position is in trouble, with live data.', 'At entry — before the fill — as written reasons, not percentages: profit targets, thesis-invalidation price, and a time stop.', 'Never — winners are held forever.', 'When your group chat votes.'],
      correctIndex: 1,
      explanation: 'Pre-commitment defeats panic. Percentages are arbitrary; invalidation reasons are analytical. A thesis that dies at a price deserves an exit at that price — decided before emotion arrives.'
    },
    protectionBonus: 'Permanent: stop_loss_discipline — entry flow requires written invalidation, targets, and time stop before the fill',
    oracleRune: 'ᚱ',
    mechanicLesson: 'Options equivalent: Olmstead\u2019s exit rules from Chapter 12 — take profit at \u226550% of max possible, cut the loss at 50% of the debit. On spreads, exits are mechanical because max profit/loss was arithmetic at entry. Build every position so the exit is arithmetic.'
  }
];

