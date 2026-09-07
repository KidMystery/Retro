import { IntelligentInvestorLesson } from '../../types';

/**
 * McMILLAN TRACK — "Options as a Strategic Investment" (Lawrence G. McMillan).
 * Grounded in the actual chapters of the 4th-edition text in exhibits/:
 * Ch2 Covered Call Writing (combined writes), Ch4 The Reverse Hedge /
 * Protected Short Sale, Ch11 Ratio Call Spreads, Ch13 Reverse Spreads
 * (Backspreads), Ch17 Put Buying With Stock / No-Cost Collars, Ch18 Straddle
 * Buying, Ch21 Synthetic Stock Positions, Ch27 Arbitrage (Conversions,
 * Reversals, the Box Spread), Ch28 Mathematical Applications (Black-Scholes),
 * Ch36 The Basics of Volatility Trading, Ch40 Advanced Concepts (Neutrality,
 * the Greeks, ESP). All mechanics (hedge ratios, breakevens, synthetics
 * equivalence) use the book's own numbers.
 */
export const MCMILLAN_TRACK_LESSONS: IntelligentInvestorLesson[] = [
  {
    id: 'hedging_basics',
    title: 'The Combined Write: Balance Return Against Protection',
    chapter: 'Chapter 2 — Covered Call Writing: Diversifying Return and Protection (McMillan)',
    quote: '"The combined write — half the position against the in-the-money call and half against the out-of-the-money call — offers the best balance of return and protection."',
    corePhilosophy: 'McMillan\u2019s covered-write analysis is not one decision but a spectrum. Against 1,000 shares of XYZ, writing only the in-the-money April 40 gives over 10% downside protection but a return-if-exercised under 1% per month; writing only the out-of-the-money April 45 gives over 2% per month if exercised but only 5% protection. His solution: split the position — write some of each. The combined write blends the in-the-money call\u2019s cushion with the out-of-the-money call\u2019s yield, landing near 8% return and 8% downside protection. Every covered write is a trade between those two dials; the mistake is maxing one dial and forgetting the other exists.',
    whyYouFailed: 'You chased the biggest premium — sold the highest out-of-the-money calls against your whole position — and had almost no cushion when the stock gapped down through your "protection."',
    reflectionQuestion: {
      prompt: 'You own 1,000 shares and want both yield and a cushion. What does McMillan\u2019s table favor?',
      choices: [
        'Write 10 out-of-the-money calls — maximum premium is maximum safety.',
        'A combined write: in-the-money calls on part of the position for protection, out-of-the-money on the rest for return.',
        'No calls — options cannot protect a stock position.',
        'Sell everything; hedging is impossible.'
      ],
      correctIndex: 1,
      explanation: 'The book\u2019s own comparison: ITM-only writes over-protect and under-earn; OTM-only writes earn and under-protect. The combined write captured ~8% return AND ~8% downside protection where each pure choice got one at the expense of the other.'
    },
    protectionBonus: 'Permanent: covered writes now split between ITM and OTM legs; combined-write cushion flagged per position',
    oracleRune: 'ᚦ',
    mechanicLesson: 'Downside protection in a covered write equals the call premium received — nothing more. Return-if-exercised shrinks as the strike moves in-the-money; the two curves cross near a blended position.'
  },
  {
    id: 'protective_put',
    title: 'The Protective Put: Insurance Priced by the Strike You Choose',
    chapter: 'Chapter 17 — Put Buying in Conjunction with Common Stock Ownership (McMillan)',
    quote: '"The purchase of a deeply out-of-the-money put as protection is more like disaster insurance."',
    corePhilosophy: 'With XYZ at 40, buying the Oct 35 put for \u00bd point caps total loss at 5\u00bd points but lets a small slide hurt you; buying the Oct 45 put for 5\u00bd points caps total loss at \u00bd point but requires the stock to rise more than 5\u00bd points before the position shows any profit. McMillan\u2019s verdict: a deep in-the-money put is "overly conservative," a far out-of-the-money put is mere disaster insurance, and the slightly out-of-the-money put offers the best risk/reward ratio. And the profit graph of stock-plus-put is exactly the shape of a long call — they are equivalent positions; the stockholder just pays far more capital and collects dividends in exchange for the same payoff curve.',
    whyYouFailed: 'You bought the cheapest put on the board, congratulated yourself on cheap insurance, and discovered it only paid off below a level the stock had to crash through — a slow bleed all the way down was fully uninsured.',
    reflectionQuestion: {
      prompt: 'XYZ is 40. Which protective put does McMillan rank best?',
      choices: [
        'The Oct 35 put at \u00bd — cheapest is always best.',
        'The Oct 45 put at 5\u00bd — maximum protection is maximum wisdom.',
        'A slightly out-of-the-money put — a balanced cap on loss that doesn\u2019t smother upside.',
        'Two deep out-of-the-money puts, doubled up for spectacle.'
      ],
      correctIndex: 2,
      explanation: 'Slightly OTM balances protection against profit-limiting: the deep ITM put caps loss at \u00bd point but needs a >13% rally to profit; the \u00bd-point OTM put still loses 5\u00bd points in a moderate decline.'
    },
    protectionBonus: 'Permanent: protective puts sized to the balanced strike; deep-ITM/disaster-OTM extremes flagged at purchase',
    oracleRune: 'ᛉ',
    mechanicLesson: 'Long stock + long put has exactly the payoff of a long call, with different capital and carry: max loss = (stock − strike) + premium; profit above breakeven = stock − strike − premium. Equivalence means the same payoff can be bought in a cheaper chassis.'
  },
  {
    id: 'collars',
    title: 'The No-Cost Collar: Protection Paid For With Your Own Upside',
    chapter: 'Chapter 17 — No-Cost Collars (McMillan)',
    quote: '"He has established a protective collar at no cost — at least no debit. His \u2018cost\u2019 is the fact that he has forsaken the upside profit potential on his stock."',
    corePhilosophy: 'A stockholder who buys a protective put but winces at the price can sell an out-of-the-money call to fund it: long stock, long OTM put, short OTM call, net debit zero. Nothing is free — the premium received is paid out of the stock\u2019s upside above the written call\u2019s strike. McMillan\u2019s real-world scene: an institution tells an OTC broker "I own XYZ, I want a one-year put 10% out of the money at zero cost — what call strike buys it?" and the answer depends entirely on volatility, rates, and dividends; in the 1999 CSCO example, a three-year collar at-the-money put at 50% volatility demanded a call struck far above. The collar\u2019s width IS the implied volatility made visible.',
    whyYouFailed: 'You wanted a "free" hedge and never asked what you were selling to pay for it. When the stock doubled, your collar had capped you at the written call\u2019s strike — protection purchased with someone else\u2019s windfall.',
    reflectionQuestion: {
      prompt: 'A one-year, zero-debit collar: the put is struck 10% below the stock. What fixes the call strike?',
      choices: [
        'Round number above the stock — strike selection is decorative.',
        'Volatility, interest rates, and dividends — high implied vol means the call must be struck far out of the money to fund the put.',
        'The broker\u2019s preference.',
        'The put strike, mirrored exactly.'
      ],
      correctIndex: 1,
      explanation: 'The no-cost condition is an equation: put premium = call premium. Richer implied volatility makes the short call\u2019s funding power larger, so it can be struck further OTM. The skew between the two strikes is priced volatility you can read.'
    },
    protectionBonus: 'Permanent: collar structures quote the implied "skew width" between put and call strikes; upside caps shown before entry',
    oracleRune: 'ᛡ',
    mechanicLesson: 'Covered write + protective put = collar, and its payoff graph is a bull spread. Max profit = call strike − stock + net credit; max loss = stock − put strike − net credit. Zero debit never means zero cost.'
  },
  {
    id: 'synthetic_positions',
    title: 'Synthetic Stock: The Call, the Put, and the Same Payoff Twice',
    chapter: 'Chapter 21 — Synthetic Stock Positions Created by Puts and Calls (McMillan)',
    quote: '"When one buys a call and sells a put at the same strike, he sets up a position that is equivalent to owning the stock."',
    corePhilosophy: 'XYZ at 50: buy the Jan 50 call at 5, sell the Jan 50 put at 4, and every price at expiration leaves you $100 worse than owning the stock — exactly the 1 point of net time premium paid. That identity is put-call parity in strategy clothing. Why bother? Capital: real stock costs $5,000 cash (or $2,500 on margin); the synthetic needs a $100 debit plus roughly 20% collateral — $1,500 total — and the parked funds earn interest. The leverage cuts both ways: +40% on margin stock becomes +60% on the synthetic at XYZ 60, and the same magnification applies to losses. The mirror position — short call, long put — is a synthetic short sale with two superiorities McMillan names: no stock borrow required and no uptick rule.',
    whyYouFailed: 'You treated options as lottery tickets adjacent to stock, never as the same exposure repackaged — so you never noticed when the synthetic version of "your" position was available for a third of the capital.',
    reflectionQuestion: {
      prompt: 'Long 50 call at 5, short 50 put at 4, stock at 50. At expiration the stock is 60. How does this compare to owning stock?',
      choices: [
        'It beats stock by 9 points.',
        'It matches stock minus the 1 point of net time premium: $900 vs. $1,000.',
        'It expires worthless.',
        'It depends on the weather.'
      ],
      correctIndex: 1,
      explanation: 'The call is worth 10 (+5), the short put loses 6 (−4). Total +9 per share against stock\u2019s +10. The gap is exactly the net time premium paid — the "cost of manufacture" of the synthetic.'
    },
    protectionBonus: 'Permanent: parity gap between synthetic and real stock shown as net time premium; leverage multiples disclosed per position',
    oracleRune: 'ᛊ',
    mechanicLesson: 'Put-call parity in one line: long call + short put = long stock; short call + long put = short stock. The difference in outcomes is always the net time premium — and the synthetic short needs no borrow and no uptick.'
  },
  {
    id: 'volatility_trading',
    title: 'Volatility Trading: Betting on the Error in the Price',
    chapter: 'Chapter 36 — The Basics of Volatility Trading (McMillan)',
    quote: '"The volatility trader\u2019s main objective is spotting situations when implied volatility is overvalued or undervalued, irrespective of his outlook for the underlying stock itself."',
    corePhilosophy: 'McMillan\u2019s charts say it plainly: "implied volatility is really not a very good predictor of the actual volatility that is to follow" — it swings wildly above and below the realized number, though both trade within ranges. That error IS the trade. When a stock has gone quiet, sellers grow aggressive and buyers grow timid, and implied volatility sinks below what the stock\u2019s own history says is normal — the volatility trader buys. When panic makes options expensive, he sells. It is a contrarian stance in a dimension most traders never look at. But the caution matters as much as the trade: you cannot blindly sell every "expensive" option, because rising implied volatility with rising volume is often the footprint of someone acting on inside information — a takeover whisper buys options first, and selling into that is picking up pennies before a truck.',
    whyYouFailed: 'You bought options when they felt cheap in dollars and never asked whether they were cheap in volatility — paying full rumor-price for calm, and selling into genuine information flow because the math said "expensive."',
    reflectionQuestion: {
      prompt: 'Implied vol on a quiet stock drops to a multi-year low; volume is normal. What is the volatility trader\u2019s read?',
      choices: [
        'Sell the options — low always goes lower.',
        'Buy volatility (e.g., a straddle): implied is at an irrational extreme versus the stock\u2019s own history, and no information flow is inflating it.',
        'Ignore volatility; only direction matters.',
        'Wait for someone else to decide.'
      ],
      correctIndex: 1,
      explanation: 'Implied underestimating realized volatility is the whole edge. But the same cheapness during a volume spike with rising implied vol is a warning of informed buying — context flips the trade.'
    },
    protectionBonus: 'Permanent: implied-vs-historical range shown per underlying; volume-plus-IV spikes flagged as "do not sell" zones',
    oracleRune: 'ᛟ',
    mechanicLesson: 'Implied vol is the market\u2019s live prediction and it is often wrong at the extremes. Range-trading it (buy low percentiles, sell high) is direction-neutral. Rising volume + rising IV = possible insider demand; stand aside.'
  },
  {
    id: 'theta_protection',
    title: 'Straddle Buying: Paying Both Breakevens at Once',
    chapter: 'Chapter 18 — Buying Puts in Conjunction with Call Purchases: Straddle Buying (McMillan)',
    quote: '"The straddle buyer can immediately determine his break-even points at expiration — 45 and 55 in this example."',
    corePhilosophy: 'Buy the July 50 call at 3 and the July 50 put at 2: a 5-point straddle on a 50 stock means the stock must finish outside 45–55 by expiration or the full debit evaporates. Both strikes must be beaten, because you paid for the right to win in either direction. McMillan\u2019s selection rule is volatility-first: straddles belong on volatile stocks with premium cheap relative to that volatility, and the probability of total loss at expiration is "minute" even in the worst case — there is always a residual salvage price on the final day. Crucially, he proves the family tree: a straddle purchase is equivalent to the reverse hedge (short stock plus two long calls) and to long stock plus two long puts; where listed puts exist, the reverse hedge is obsolete because dividends and commissions are smaller.',
    whyYouFailed: 'You bought "both directions" as a comfort blanket, without computing that a 50-dollar stock must move more than 10% to clear a 5-point straddle — and theta collected rent from both legs every single day.',
    reflectionQuestion: {
      prompt: 'Straddle cost 5 on a 50 stock. At expiration XYZ is 54. Result?',
      choices: [
        '$400 profit — it went up!',
        'A loss of the full 5 points, minus salvage: 54 sits inside the 45–55 breakeven band.',
        'The put pays off.',
        'It depends on the order you bought in.'
      ],
      correctIndex: 1,
      explanation: 'Upper breakeven = strike + total debit (55); lower = strike − debit (45). A 4-point rally is inside the band: the call is worth 4, the put worthless, against a 5-point cost. Both breakevens must be cleared.'
    },
    protectionBonus: 'Permanent: straddle breakeven bands computed at entry and re-shown daily; theta burn on both legs displayed',
    oracleRune: 'ᛞ',
    mechanicLesson: 'Breakevens = strike ± total debit. Equivalence chain: straddle buy = reverse hedge (short stock + 2 calls) = stock + 2 puts. Same payoff curve; pick the chassis with the least carry cost.'
  },
  {
    id: 'delta_neutral',
    title: 'Neutrality and ESP: Reading Your Position as One Number',
    chapter: 'Chapter 40 — Advanced Concepts: Neutrality, the Greeks, Equivalent Stock Position (McMillan)',
    quote: '"\u2018Delta long 200 shares\u2019 means that the entire option position behaves as if the strategist were merely long 200 shares of the underlying stock."',
    corePhilosophy: 'Neutrality means being noncommittal about at least one pricing factor — price, rate of change, volatility, or time — and it always requires at least two options. The tool that makes it operational is the Equivalent Stock Position: ESP = quantity × delta × 100. McMillan\u2019s worked example: 8 short Jan 45 straddles with the stock at 50 — the short calls carry −8 × 0.90 × 100 = −720 shares, the short puts +8 × 0.10 × 100 = +80, net ESP short 640 shares. Fix it any of three ways: buy 600 shares of stock, buy back 7 of the short calls (+630 delta), or buy 10 of the Jan 50 calls at delta 0.60 (+600) — though prudence says 8, since you\u2019re only short 8 straddles. Neutrality is not a permanent state; it is a number that drifts and must be re-struck.',
    whyYouFailed: 'You stacked positions by "feel" and never reduced them to a share-equivalent — a pile of puts, calls, and stock that was secretly a large directional bet, moving against you while you believed you were hedged.',
    reflectionQuestion: {
      prompt: 'Your position\u2019s ESP is short 640 shares and you have no view on direction. What is the mechanical fix?',
      choices: [
        'Buy 640 shares of stock (or an equivalent delta of options).',
        'Sell more puts until it feels balanced.',
        'Nothing — ESP is an accounting figure, not a risk one.',
        'Double everything so errors cancel out.'
      ],
      correctIndex: 0,
      explanation: 'ESP = quantity × delta × 100 sums the whole book into a share count. Neutralizing is buying that share count back — via stock or any option package with the same aggregate delta.'
    },
    protectionBonus: 'Permanent: portfolio ESP computed live and shown as a net share count; drift from neutrality flagged each session',
    oracleRune: 'ᛜ',
    mechanicLesson: 'Delta is both a hedge ratio and a probability read (delta 0.40 ≈ 40% chance of finishing in-the-money). ESP turns any multi-leg position into "long/short N shares" — the single number that reveals a hidden directional bet.'
  },
  {
    id: 'defined_risk',
    title: 'The Ratio Spread: Credited Entry, Unguarded Ceiling',
    chapter: 'Chapter 11 — Ratio Call Spreads (McMillan)',
    quote: '"The greatest risk in a ratio call spread lies to the upside, where the loss may theoretically be unlimited."',
    corePhilosophy: 'Buy one April 40 call at 5, sell two April 45 calls at 3 each: a 2:1 ratio spread entered for a 1-point credit. Below 40, all options die and you keep the credit — with an initial credit there is no downside risk at all. Maximum profit lands exactly at the short strike (45): credit + strike differential = 6 points. Then the structure turns: the second naked call takes over and losses run above the upside breakeven, higher strike + max profit = 51. McMillan\u2019s formulae make the geometry mechanical, and his framing is honest — the position is for the neutral investor who expects the stock near the short strike, and the naked upper tail is the price of the credited entry.',
    whyYouFailed: 'You saw a credit, a guaranteed floor, and a fat profit zone — and ignored that above 51 the position that paid you to enter begins bleeding without limit.',
    reflectionQuestion: {
      prompt: '2:1 ratio spread: long 40 call at 5, short two 45s at 3 (net credit 1). Stock at expiration is 55. Result?',
      choices: [
        'Maximum profit — above the short strike is always best.',
        'A loss: max profit 6 points peaked at 45; upside breakeven is 51, so 55 loses about 4 points.',
        'Exactly zero.',
        'The credit doubles.'
      ],
      correctIndex: 1,
      explanation: 'Max profit = credit + strike gap = 6, earned only at 45. Above 45 each point costs 1 point net (2 short, 1 long); breakeven = 45 + 6 = 51. At 55: +6 from the long, −10 from the shorts, +1 credit = −4.'
    },
    protectionBonus: 'Permanent: ratio-spread upside breakeven computed and flagged before entry; naked-tail exposure capped per position',
    oracleRune: 'ᚱ',
    mechanicLesson: 'Formulas: max profit = credit + strike gap (at the short strike); upside BE = higher strike + max profit. Downside is a constant (the credit or debit); the unbounded tail is always above the short strikes.'
  },
  {
    id: 'stop_loss_discipline',
    title: 'The Backspread: Unlimited Upside Bought at a Known Worst Case',
    chapter: 'Chapter 13 — Reverse Spreads: The Reverse Ratio Spread / Backspread (McMillan)',
    quote: '"In most backspreading strategies, the spreader wants the stock to move dramatically. He does not generally care whether it moves up or down."',
    corePhilosophy: 'The backspread is the ratio spread flipped: sell one July 40 call at 4, buy two July 45 calls at 1 each — a 2-point credit. Below 40 everything expires and you keep the credit; above 48 the extra long call takes over and profit is unlimited; in between lies the danger zone, with maximum loss exactly at the long strike: at 45 the short call costs 5 to buy back and the longs die, a 3-point loss (2 credit surrendered plus the 1-point gap in payoff terms). The upside breakeven computes as higher strike + (strike gap − credit) = 48. The rule McMillan attaches: if the spread cannot be initiated for a credit, it is usually not attractive. And versus the reverse hedge, this all-optional version is cleaner — it is "a long call added to a bear spread," with no stock to borrow and no margin bleed.',
    whyYouFailed: 'You bought convexity — unlimited profit if the stock runs — but placed your bet where the stock was most likely to park: right at the long strike, the one price where the backspread bleeds its maximum.',
    reflectionQuestion: {
      prompt: 'Backspread: short 1 40 call at 4, long 2 45 calls at 1 (credit 2). Where is maximum loss at expiration?',
      choices: [
        'Below 40 — the shorts blow up.',
        'Exactly at 45, the long strike — longs worthless, short call 5 points against a 2-point credit.',
        'Above 48 — unlimited losses.',
        'Backspreads have no maximum loss.'
      ],
      correctIndex: 1,
      explanation: 'At 45: longs expire worthless (−2 paid… net with the credit, −3 total), short call costs 5 to cover. Loss region runs 42–48; profits live below 42 and above 48, unlimited on top.'
    },
    protectionBonus: 'Permanent: backspread "dead zone" (loss band between breakevens) drawn at entry; max-loss strike marked',
    oracleRune: 'ᚹ',
    mechanicLesson: 'Backspread = sell nearer strike, buy more of a higher strike, ideally for a credit. Profit tails below the low breakeven and above the high one; max loss sits at the long strike. Upside BE = long strike + (gap − credit).'
  },
  {
    id: 'hedge_not_gamble',
    title: 'The Reverse Hedge: Never Sell Your Own Protection',
    chapter: 'Chapter 4 — Other Call Buying Strategies: The Reverse Hedge / Simulated Straddle (McMillan)',
    quote: '"When the stock rises, it is not an equivalent situation... if the short seller sells his call for a profit and the stock subsequently rises even further, large losses could result."',
    corePhilosophy: 'Short 100 shares of XYZ at 40, buy two July 40 calls at 3: the reverse hedge. Downside profits accrue without limit below 34 (the short gain outruns the capped 6-point call loss); upside the two calls outrun the short stock above 46. Losses are bounded between 34 and 46 — a defined-risk straddle built from stock and calls. McMillan\u2019s follow-up rule is the moral center of the chapter: when the stock drops, taking the call profit is fine — you\u2019re keeping the profitable side and the residual risk is benign. But when the stock rises and the call is in-the-money, selling your protection "hoping for a drop" converts a hedged position into a naked short. That is the moment hedging becomes gambling. Margin detail from the same chapter: a protected short needs only the lower of 10% of strike plus out-of-the-money amount or 30% of stock value — protection is cheaper than hope.',
    whyYouFailed: 'Your hedge worked, the long call went deep in-the-money, and you sold it to "lock in the profit" — instantly restoring unlimited loss on the short leg you still carried.',
    reflectionQuestion: {
      prompt: 'You are short stock, hedged with an in-the-money long call. The call has grown to 10 points. What does McMillan advise?',
      choices: [
        'Sell the call, take the 7-point profit, wait for the drop.',
        'Keep the protection (or exercise it to cover the short) — selling it leaves you naked short into a rising stock.',
        'Double the short stock to average in.',
        'Convert to a naked straddle sale.'
      ],
      correctIndex: 1,
      explanation: 'Removing protection while the uncovered leg is losing is the exact pattern that turns a hedge into a gamble. If closing out, exercise near parity — you must buy stock back anyway, so exercising buys it at the strike and saves a commission.'
    },
    protectionBonus: 'Permanent: "protection sale" while a naked leg remains exposed is blocked or requires override; hedge-ratio margin shown',
    oracleRune: 'ᛚ',
    mechanicLesson: 'Reverse hedge breakevens: downside = stock short price − 2×call cost; upside = strike + 2×call cost − net (the point where 2 calls outrun 1 short share). Never remove the long option while the short leg stays open against the trend.'
  },
  {
    id: 'early_assignment',
    title: 'Arbitrage, the Box, and What Carrying Costs Really Price',
    chapter: 'Chapter 27 — Arbitrage: Conversions, Reversals, the Box Spread (McMillan)',
    quote: '"No matter where XYZ is at January expiration, this position will be worth 10 points."',
    corePhilosophy: 'A conversion is long stock + short call + long put; a reversal is short stock + long call + short put — each is holding a position and its synthetic opposite, harvesting only the mispricing plus carrying costs. The box spread purifies the idea: buy the Jan 50/60 call bull spread (7 − 2 = 5 debit) and the Jan 50/60 put bear spread (5\u00bd − 1 = 4\u00bd debit), total 9\u00bd — and no matter where XYZ finishes, the package is worth exactly the 10-point strike width. Half a point locked, riskless, if you can execute. But McMillan\u2019s risk section keeps it honest: reversals live or die on interest rates (the arbitrageur is effectively lending), and early assignment on short in-the-money puts — which "can be assigned very far in advance of expiration" in bearish markets — collapses the interest engine and can turn the whole "riskless" trade into a loss. Arbitrage is not free money; it is carry income wearing a hedge.',
    whyYouFailed: 'You heard "riskless" and skipped the risk section — your short puts were assigned early in a bear move, and the interest your reversal was supposed to earn vanished into a forced stock debit.',
    reflectionQuestion: {
      prompt: 'Box spread: bull 50/60 calls for 5 debit + bear 50/60 puts for 4\u00bd debit. Value at expiration?',
      choices: [
        'Depends entirely on where the stock finishes.',
        '10 points — strike width — for 9\u00bd invested, always.',
        'Zero; the two spreads cancel.',
        '15 points.'
      ],
      correctIndex: 1,
      explanation: 'Above 60 the call spread pays 10; between 50 and 60 the two legs together pay 10; below 50 the put spread pays 10. The box is worth the strike width in every state — pricing below that width is the arbitrage; the residual risks are early assignment and carry.'
    },
    protectionBonus: 'Permanent: early-assignment watch (parity or discount on short options) flagged per position; carry cost shown on synthetic pairs',
    oracleRune: 'ᛖ',
    mechanicLesson: 'Conversions/reversals = position + its synthetic opposite; box = call bull spread + put bear spread, worth strike width in all states. The hidden inputs are interest (engine of the trade) and early assignment (its assassin — short options at parity can be assigned any day).'
  },
  {
    id: 'vega_protection',
    title: 'Black-Scholes: Five Inputs, One Unknown',
    chapter: 'Chapter 28 — Mathematical Applications: The Black-Scholes Model (McMillan)',
    quote: '"An important by-product of the model is the exact calculation of the delta — more formally known as the hedge ratio."',
    corePhilosophy: 'An option\u2019s price is a function of stock price, strike, time, interest rates, and volatility — and Black-Scholes (1973) turns five of those into a theoretical value: pN(d\u2081) − se⁻ʳᵗN(d\u2082), with d\u2081 built from the log of the price/strike ratio plus half the variance scaled by time, all divided by volatility times the square root of time. McMillan\u2019s worked example — XYZ 45, July 50 call, 60 days, 30% volatility, 10% rate — shows t = 60/365 entering directly. The decisive insight is that every input except volatility is observable: the market hands you stock price, strike, calendar, and rates; only "v" is a guess. Therefore an option\u2019s market price minus its model value with a reasonable v is a statement about what volatility traders are charging — and the model\u2019s delta, N(d\u2081), is the hedge ratio a neutral strategist uses to stay balanced.',
    whyYouFailed: 'You quoted options by price alone, never asking which of the five inputs the market was disagreeing with you about — and it was always the only one that is an opinion: volatility.',
    reflectionQuestion: {
      prompt: 'Of Black-Scholes\u2019 five inputs, which one is not directly observable in the market?',
      choices: [
        'Stock price — it moves too fast.',
        'Volatility — it must be estimated (or backed out as implied from the option\u2019s own price).',
        'Striking price — it changes daily.',
        'Interest rate — nobody publishes it.'
      ],
      correctIndex: 1,
      explanation: 'Price, strike, time, and the risk-free rate are all observable; volatility is the assumed input. Feeding the observed market price back in to solve for "v" yields implied volatility — the number the volatility trader trades against.'
    },
    protectionBonus: 'Permanent: theoretical value vs market price gap shown per option; the volatility assumption behind every quote made explicit',
    oracleRune: 'ᛝ',
    mechanicLesson: 'Theoretical value = pN(d\u2081) − se⁻ʳᵗN(d\u2082); delta = N(d\u2081) is the hedge ratio. Time enters as a fraction of a year (t = days/365). Delta also reads as probability of finishing in-the-money — one number, two jobs.'
  }
];
