import { IntelligentInvestorLesson } from '../../types';

/**
 * OLMSTEAD TRACK — Options for the Beginner and Beyond (Wade Olmstead).
 * Grounded in the actual chapters: Ch2 Option Selection, Ch3 Entering/Exiting,
 * Ch4 The Greeks, Ch5 Risk Graphs, Ch6 LEAPS, Ch7 Assignment Anxiety,
 * Ch10 Vertical Spreads, Ch11 Event-Producing Credit Spreads, Ch12 Calendar
 * Spreads (+ rollout), Ch14 Covered Calls, Ch15 Straddles/Strangles, Ch16
 * Stock Repair/Enhancement, Ch17 Married Puts, Ch18 Collars. All mechanics
 * (max profit/loss, breakevens, credits/debits) use the book's own numbers.
 */
export const OLMSTEAD_TRACK_LESSONS: IntelligentInvestorLesson[] = [
  {
    id: 'option_selection',
    title: 'Option Selection: Cheap Is Not the Same as Bargain',
    chapter: 'Chapter 2 — Option Selection (Olmstead)',
    quote: '"The option with the lowest price is not always the best bargain."',
    corePhilosophy: 'Every option price splits into intrinsic value (what it would be worth if it expired today) and time value (the rest — and time value is what dies at expiration). Olmstead\u2019s test: XYZ at $89 — the Dec 85 call at $4.50 holds $4 intrinsic and only $0.50 time value, while the Dec 90 call at $1.50 is ALL time value. The "cheap" $1.50 option is three times more expensive by the only measure that decays. Select by asking: can the stock rise high enough and fast enough to overcome the lost time value and still pay? The in-the-money May 65 call ($4.20 = $2 intrinsic + $2.20 time) breaks even at $69.20 and profits on a slow 7% grind, while the out-of-the-money Apr 70 call ($1.50, all time) needs a fast 9% pop just to break even.',
    whyYouFailed: 'You bought the cheapest option on the board — all time value, weeks from expiring — and watched the stock go up while your position still lost money.',
    reflectionQuestion: {
      prompt: 'XYZ is at $89. Which option is truly "cheaper"?',
      choices: [
        'The Dec 90 call at $1.50 — lowest price always wins.',
        'The Dec 85 call at $4.50 — only $0.50 of it is decaying time value vs. $1.50 all time value on the 90 call.',
        'Whichever call the trader who yelled loudest bought.',
        'None — options are always a bad price.'
      ],
      correctIndex: 1,
      explanation: 'Time value is the perishable part of an option. The Dec 85 call carries $4 intrinsic + $0.50 time; the Dec 90 call is $1.50 of pure time value — three times more expensive where it counts.'
    },
    protectionBonus: 'Permanent: overpriced all-time-value options flagged at the desk; entering one requires an override',
    oracleRune: 'ᚨ',
    mechanicLesson: 'Gameplay rule: option price = intrinsic + time value. Expiring in-the-money pays intrinsic only. At-the-money calls run ~delta 0.50; a $2 stock move lifts them ~$1.'
  },
  {
    id: 'greeks_beyond_delta',
    title: 'The Greeks: Delta, Theta, Gamma, Vega as Game Mechanics',
    chapter: 'Chapter 4 — The Greeks (Olmstead)',
    quote: '"When you buy an option, time is your enemy."',
    corePhilosophy: 'Delta is your exposure multiplier: XYZ $30 — the Mar 30 call (delta 0.50) gains $1 on a $2 stock rise; the Mar 25 call (delta 0.80, in-the-money) gains $1.60; the Mar 35 call (delta 0.10) gains only $0.20. Puts mirror with negative delta (ATM \u2248 \u22120.50). Theta is the decay clock: it scales inversely with the square root of remaining time — an option with 40 days left decays twice as fast as one with 160 days, and 10 days decays 6\u00d7 faster than 360. Example: an ATM option worth $4.30 with four months left vs $2.50 with two — a theta of roughly \u2212$0.03/day, a 42% loss over two months. Gamma is how fast delta itself changes: near expiration, a tick above the strike flips delta from ~0 to ~1 — the profit-or-worthless knife edge. Vega is the rumor tax: buyout whispers inflate option prices even when the stock barely moves. Rho barely matters at modest interest rates.',
    whyYouFailed: 'You judged an option by its premium alone, never by delta (how much it moves), theta (how fast it bleeds), or vega (whether you are paying an inflated rumor price).',
    reflectionQuestion: {
      prompt: 'One week before expiration, an option sits exactly at the strike. The $2 stock move happens. What decides your fate?',
      choices: [
        'Nothing — a $2 move always pays.',
        'Gamma: near expiry delta snaps from ~0 to ~1 around the strike; if the move falls a hair short, the option can still end worthless.',
        'Rho, obviously.',
        'The broker\u2019s mood.'
      ],
      correctIndex: 1,
      explanation: 'Near expiration, gamma risk is extreme: an in-the-money option\u2019s delta rushes toward 1 and out-of-the-money toward 0, so a tiny price shortfall flips a profitable option to worthless.'
    },
    protectionBonus: 'Permanent: theta decay shown per position each day; gamma-knife zones (expiry-week ATM) flagged red',
    oracleRune: 'ᛗ',
    mechanicLesson: 'Greeks as stats: delta = movement per $1 of stock; theta = HP lost per day; gamma = how fast your delta stat changes; vega = sensitivity to hype. Olmstead\u2019s habit: never hold a long ATM option into its final three weeks.'
  },
  {
    id: 'risk_graphs',
    title: 'Risk Graphs: See the Profit Zone Before You Pay',
    chapter: 'Chapter 5 — Risk Graphs (Olmstead)',
    quote: '"One picture is worth more than ten thousand words."',
    corePhilosophy: 'A risk graph plots stock price against trade profit/loss across time lines (today \u2192 expiration), turning an option\u2019s many factors into one readable picture. Olmstead\u2019s calendar example: buy the Nov 35 call at $3.50, sell the Jun 35 call at $1.30 ($220 net risk). The graph alone reveals the profit zone at June expiration — $33 to $38 — with max profit $90 exactly at $35. Below $33 or above $38, the trade loses; the maximum loss of $220 sits far at the edges. The graph also shows slippage: at entry the trade starts slightly left of zero because of the bid/ask spread. Time lines only hold until the earliest option expires; past that, a new graph must be drawn.',
    whyYouFailed: 'You traded multi-leg structures blind. The profit zone existed only in your hope — a risk graph would have shown you the $33\u2013$38 window and the $220 floor.',
    reflectionQuestion: {
      prompt: 'Why does a risk graph show a small immediate loss the moment a trade is entered?',
      choices: [
        'The broker stole your money.',
        'Slippage — you buy at the ask and sell at the bid, so entry starts just left of zero profit.',
        'Options always lose money on day one by law.',
        'The graph is broken.'
      ],
      correctIndex: 1,
      explanation: 'Slippage is the bid/ask spread converted to dollars on the graph. It is the real cost of entry, which is why Olmstead says saving $0.10 per share on entry or exit usually covers the commissions on both ends (Ch3).'
    },
    protectionBonus: 'Permanent: every multi-leg offer in the shop displays its risk graph with profit zone before confirmation',
    oracleRune: 'ᛟ',
    mechanicLesson: 'Reading the graph: horizontal axis = $ profit/loss, vertical = stock price, curves = time lines. The zero-crossings are your breakevens; the deepest left point is max risk.'
  },
  {
    id: 'leaps',
    title: 'LEAPS: The Poor Man\u2019s Stock (Look Before You LEAPS)',
    chapter: 'Chapter 6 — LEAPS (Olmstead)',
    quote: '"Because there can be drawbacks to using these long-term options, you should always \'Look before you LEAPS.\'"',
    corePhilosophy: 'LEAPS (Long-term Equity AnticiPation Securities) run two-plus years, mostly expiring in January. As a stock surrogate: XYZ at $98 — 100 shares cost $9,800; the Jan(07) 100 call at $11.50 costs $1,150, 12% of the stock position. When the stock runs to $120 after 8 months (+22%), the LEAPS shows ~$1,400 (+122%) — the leverage is real. But the mirror side is brutal: after 17 months, stock at $105 (+7%) leaves the LEAPS at roughly break-even; stock at $100 (+2%) and the LEAPS is down ~26%; stock at $95 (\u22123%) and the LEAPS is down ~61%. Time value decay catches even long-dated options. No dividends either — a 6% yielder changes the whole comparison. Two legitimate uses: diversification (the cost of one stock position buys LEAPS on several names — Olmstead\u2019s 2004 Medley returned 121%) and selling front-month calls against the long LEAPS ($50/month against a Feb 105 call would offset $600/year of decay).',
    whyYouFailed: 'You treated a LEAPS like stock. It drifted sideways for a year, the stock gained 2%, and you were down a quarter of your premium to decay.',
    reflectionQuestion: {
      prompt: 'Your LEAPS has 17 months left. The stock is up 2% from your entry. What is most likely true of the LEAPS?',
      choices: [
        'Up roughly 2% too — LEAPS track stock one-for-one.',
        'Down ~26% — time value decay over a full year outweighs the small intrinsic gain.',
        'Up 100% — leverage always amplifies.',
        'Unchanged — long-dated options do not decay.'
      ],
      correctIndex: 1,
      explanation: 'Olmstead\u2019s Scenario 2: after 17 months, stock +2% \u2192 Jan(07) 100 call \u221226%. A small stock gain cannot outrun a year of decay; only a strong sustained move favors the LEAPS.'
    },
    protectionBonus: 'Permanent: LEAPS decay-vs-stock comparison table shown at purchase; dividend loss noted',
    oracleRune: 'ᛚ',
    mechanicLesson: 'LEAPS = leveraged stock rental: big upside multiplier, decay floor underneath, no dividends. The dollar at risk in a crash is far smaller than owning 100 shares — that is the insurance argument.'
  },
  {
    id: 'assignment_risk',
    title: 'Assignment Anxiety: The $0.15\u2013$0.20 Line',
    chapter: 'Chapter 7 — Assignment Anxiety (Olmstead)',
    quote: '"If the bid price of the option includes at least $.20 of time value, an early assignment is rather unlikely."',
    corePhilosophy: 'Early assignment is not random doom — it follows mechanics. Guideline 1: an out-of-the-money short option is essentially never assigned early (nobody pays your $40 strike for a $38 stock). Guideline 2: an in-the-money short option with real time value is safe — short the Nov 40 call at $2 with $1 of time value and the holder prefers selling you the option over exercising it. Guideline 3: when time value thins below roughly $0.15\u2013$0.20, expect it: short the Nov 40 call at $1.10 ($0.10 time value) and early assignment is a real possibility, especially the final week. Puts get assigned more often than calls (sellers want cash now). Deep-in-the-money shorts lose time value even far from expiry; low open interest raises the odds; an imminent dividend raises them for short calls. Covered or spread-hedged, assignment is survivable — in the bull call spread, letting the short call be assigned while exercising your long call captures the full $5 spread, beating the $4.80 you would get selling both legs into slippage.',
    whyYouFailed: 'You panicked at the word "assignment" and closed a spread at $4.80 instead of letting it settle to $5.00 — fear, not mechanics, set your price.',
    reflectionQuestion: {
      prompt: 'Your short covered call is in-the-money, bid $1.10 with one week left. Time value \u2248 $0.10. What is the mechanical read?',
      choices: [
        'Impossible — in-the-money options are never assigned.',
        'Early assignment is likely (time value under ~$0.15–$0.20) — decide: do nothing and take the $40 sale, or roll out to the Dec 45 call.',
        'Double down on shorts to punish the exerciser.',
        'Exercise your own broker in protest.'
      ],
      correctIndex: 1,
      explanation: 'Olmstead\u2019s dividing line is ~$0.15\u2013$0.20 of time value. Below it, assignment is likely; both responses are legitimate — being called away at the strike with the premium kept is not a loss.'
    },
    protectionBonus: 'Permanent: time-value gauge on every short leg; assignment warning below the $0.20 line; early_assignment events resolve at full spread value',
    oracleRune: 'ᚾ',
    mechanicLesson: 'Assignment mechanics: OTM short = safe; ITM with \u2265$0.20 time value = safe; time value \u2264$0.15 = expect the envelope. Naked shorts are the only genuinely anxious position — and those are the ones this chapter refuses to discuss.'
  },
  {
    id: 'vertical_spreads',
    title: 'Vertical Spreads: Defined Risk as Structure',
    chapter: 'Chapter 10 — Vertical Spreads (Olmstead)',
    quote: '"The maximum possible profit is always the difference between the strike prices of the long and short options less the original cost of the spread."',
    corePhilosophy: 'A vertical sells one option to finance another, converting "expensive direction bet" into "defined-risk bet." Bull call spread: XYZ $35 — the Nov 35 call alone costs $4.10, all time value; a mere $40 finish pays only 22%. Instead buy the Nov 35 call ($4.10), sell the Nov 40 call ($2.10): $200 debit, max risk $200, max profit $300 at/above $40 — 150%. Bear put spread mirrors: buy the Nov 35 put ($3.90), sell the Nov 30 put ($1.80) — $210 debit, max profit $290 at $30. Credit side flips the coin: bull put spread — buy the May 45 put ($2.70), sell the May 50 put ($5.30): $260 credit, max risk $240, full credit kept if ZYX closes above $50. Bear call spread — buy the May 45 call ($3), sell the May 40 call ($5.70): $270 credit, max risk $230. Debit spreads need time to reach the target and pay best at expiration; credit spreads need little or no movement, and when the target is reached, both legs expire worthless — no exit required.',
    whyYouFailed: 'You bought the naked option: $410 at risk to make $90 if the stock merely reached your target — then it did, and you scraped 22%. The spread version risked $200 for $300.',
    reflectionQuestion: {
      prompt: 'Bull put spread: sell the May 50 put / buy the May 45 put for a $260 credit. Max loss if ZYX is below $45 at expiry?',
      choices: [
        '$5,000 — short puts are unlimited risk.',
        '$240 — width ($500) minus the $260 credit; both legs close at the $5 strike difference.',
        '$260, the credit itself.',
        'Zero — credit spreads cannot lose.'
      ],
      correctIndex: 1,
      explanation: 'Max loss = strike width minus credit: (50 \u2212 45 \u2212 2.60) \u00d7 100 = $240. And the return math is profit/risk: 260/240 = 108% (Olmstead\u2019s credit-spread convention).'
    },
    protectionBonus: 'Permanent: defined_risk bonus — max loss on any spread position deducted from HP pool once, never compounding',
    oracleRune: 'ᛉ',
    mechanicLesson: 'Four verticals: bull call / bear put (debits — need the move, pay best at expiry) vs bull put / bear call (credits — need the hold, expire worthless when right). Max profit/loss is arithmetic decided before entry.'
  },
  {
    id: 'event_risk',
    title: 'Event-Producing Credit Spreads: Selling the Aftermath',
    chapter: 'Chapter 11 — Event-Producing Credit Spreads (Olmstead)',
    quote: '"The idea is to not enter the credit spread until the dust has had a chance to settle."',
    corePhilosophy: 'The best credit spreads follow a concluded event: a major one-way price move on exceptional volume — an earnings surprise (RMBS losing a patent ruling, falling $30 \u2192 $24.35), a FDA ruling, a buyout proposal in doubt (Comcast/DIS gapping $24 \u2192 $28 then retreating) — pumping extra premium into the front-month options as traders scramble. The recipe: wait a day or two for the move to exhaust itself, place the short leg near the extreme, and collect a credit that nearly equals or exceeds the max risk. RMBS: buy the Mar 22.5 put / sell the Mar 25 put for $125 credit vs $125 risk — max profit needed only a close above $25; it closed at $27.21, options worthless. DIS: sell the Mar 27.5 call / buy the Mar 30 call for $130 credit vs $120 risk; DIS closed $25.39. AAPL sold off $40 \u2192 $34 on GOOD earnings: sell the May 35 put / buy the May 32.5 put for $120 credit vs $130 risk; closed $37.55. The event must be truly concluded — avoid "accounting irregularities" announcements that breed follow-on revelations.',
    whyYouFailed: 'You bought premium into the event (paying the inflated vega) or chased the move at its extreme — instead of waiting for the dust to settle and being the one paid the inflated premium.',
    reflectionQuestion: {
      prompt: 'A stock just crashed from $30 to $24 on a one-time patent ruling, stabilizing at $25. Best credit-spread structure?',
      choices: [
        'Buy calls immediately — the crash means upside.',
        'Sell the Mar 25 put / buy the Mar 22.5 put, collecting ~$125 credit against $125 max risk — the short leg sits at the damage line, premium inflated.',
        'Sell naked puts with 10x size — the news is over, so risk is over.',
        'Wait for the stock to return to $30 first.'
      ],
      correctIndex: 1,
      explanation: 'Olmstead\u2019s RMBS trade exactly: credit \u2248 max risk (1:1 payoff), short leg at the extreme of the concluded event, front-month so time decay works. It paid the max when RMBS closed at $27.21.'
    },
    protectionBonus: 'Permanent: event_risk alert — concluded-event premiums highlighted; repeat-event warnings ("accounting irregularities") block entry',
    oracleRune: 'ᛞ',
    mechanicLesson: 'Three elements of a good credit spread: (1) extra premium pumped in by an event, (2) little or no stock movement needed for max profit, (3) front-month options. Credit \u2248 max risk is the mark of a good one.'
  },
  {
    id: 'calendar_spreads',
    title: 'Calendar Spreads and the Rollout: Harvesting Time Decay Twice',
    chapter: 'Chapter 12 — Calendar Spreads (Olmstead)',
    quote: '"The calendar spread profited by gaining $1.30 per share from the Jun 35 call, while losing only $.50 per share in the Nov 35 call."',
    corePhilosophy: 'Buy the distant month, sell the near month, same strike (nearest the stock). The front-month option decays faster; the long option\u2019s cost basis drops as each short expires worthless. XYZ at $34.70: buy the Nov 35 call ($3.50), sell the Jun 35 call ($1.30) — $220 max risk. Stock unchanged at June expiry: the short dies worthless, the Nov 35 basis drops to $2.20, the long is worth ~$3.00 — sell for $80 (36% in six weeks). The rollout: don\u2019t wait for expiry — buy back the front-month early and sell the next month when the differential is widest. The short Jul 35 call sells for $1.00, cutting basis to $1.20; repeat and the decay income compounds. Best on narrow-range stocks — volatile names that swing 15% in a month are unsuitable. The profit window at expiry was $33\u2013$38 (neither 9% above nor 6% below the strike). Exit rules: take profit at \u226550% of maximum possible; cut the loss at 50% of the debit paid. Puts for a downward drift, calls for upward.',
    whyYouFailed: 'You sold front-month premium naked, holding a short option with unlimited pain on a gap — instead of owning the long back-month that turns the same decay into a bounded trade.',
    reflectionQuestion: {
      prompt: 'Your calendar\u2019s short Jun 35 call is in-the-money with 9 days left. The rollout rule says…',
      choices: [
        'Hold to expiration — always let options die.',
        'Roll now: buy back the short and sell next month — the differential between months is widest before an ITM front option bleeds out, and you avoid assignment.',
        'Sell everything at a 50% loss immediately regardless.',
        'Double the position to average the debit.'
      ],
      correctIndex: 1,
      explanation: 'Olmstead: an in-the-money short loses almost all time value 8\u201310 days early — roll immediately. Even out-of-the-money, market makers hold the ask at $0.15+ into expiry week, so rolling days early often nets more.'
    },
    protectionBonus: 'Permanent: rolling_positions — the rollout is one click, short-leg assignment impossible, basis tracking automatic',
    oracleRune: 'ᛠ',
    mechanicLesson: 'Calendar economics: short leg decays \u2212$1.30/share over 6 weeks while the long leg loses only \u2212$0.50. Max risk = the initial debit ($220). Profit band at expiry: $33\u2013$38.'
  },
  {
    id: 'covered_calls',
    title: 'Covered Calls: The "Conservative" Trade That Is Not',
    chapter: 'Chapter 14 — Covered Calls (Olmstead)',
    quote: '"Covered call trades are not really \'conservative.\'"',
    corePhilosophy: 'Own 100 shares, sell a call at a strike 10\u201315% above the stock. Idealized: QCOM $30 \u2192 $50 over 7 months, $120/month of premium turns a 67% gain into 95%. Real life: bought May 2003 at $30, sold the Jun 35 call for $1; by June the stock was $37 — buy back the short call for $2 (a $1 loss) or lose the stock for a $6/share profit? The Jul 40 call expired worthless as QCOM fell back to $35; then Aug 40 calls paid only $0.35 while Aug 35 calls paid $2 but risked the stock. Every month poses a decision. The kicker: the covered call\u2019s risk profile is identical to selling a naked put — buy QCOM at $53, sell the Feb 55 call for $2 (net basis $51, max risk $5,100) matches selling the Feb 55 put for $4 (exercise basis $51, same $5,100). Capped upside, full downside of the stock. Rules: watch the stock, not the premium; pick a strike you are willing to sell at; sell front or next month, not the juicy long dates; if the stock is above strike at expiry, let it go — do not buy back the call for a loss and then watch the stock collapse.',
    whyYouFailed: 'You bought back the short call to keep your stock, paid the premium loss, and the stock collapsed the next week — the double loss Olmstead warns is the classic covered-call blunder.',
    reflectionQuestion: {
      prompt: 'A covered call (stock $53, short Feb 55 call @ $2) and a naked Feb 55 put (@ $4) — what actually differs?',
      choices: [
        'The covered call is far safer.',
        'Nothing in P/L — identical risk profile ($5,100 max risk, capped upside). The covered call collects dividends; the naked put ties up less cash.',
        'The naked put cannot lose money.',
        'The covered call has unlimited profit.'
      ],
      correctIndex: 1,
      explanation: 'Olmstead\u2019s equivalence proof: same net basis ($51), same $5,100 max risk, same $600 max profit. The covered call\u2019s real advantages: dividends, less leverage temptation.'
    },
    protectionBonus: 'Permanent: covered_calls — monthly premium income auto-collected; strike-choice preview shows call-away price before entry',
    oracleRune: 'ᚳ',
    mechanicLesson: 'Covered call math: effective stock basis = purchase \u2212 premium. Max profit = strike \u2212 basis (capped); max risk \u2248 full stock basis below the strike. Not "income" — a capped, leveraged short put.'
  },
  {
    id: 'straddles_strangles',
    title: 'Straddles and Strangles: Paying Two Thetas to Guess One Way',
    chapter: 'Chapter 15 — Straddles and Strangles (Olmstead)',
    quote: '"With a straddle, you own two options, so time is working against both legs of the trade."',
    corePhilosophy: 'The straddle buys a call and a put at the same strike — the dream of not needing direction. The reality: XYZ at $30, buy the Aug 30 call ($2.10) and Aug 30 put ($1.90) — $400 at risk, and a modest move loses both ways. The winners: a fast crash to $25 with two months left puts the call at $0.50 and the put at $6.20 — exit both for $670, +68%. A rumor-fueled run loses slow: the earnings warning that comes late only drops the stock to $27.50, and the same position exits for $300 (\u221225%). Do nothing and it bleeds to \u221290% ($360 lost on $400). The hidden enemy is implied volatility: if the rumor is well circulated, the ATM options inflate ~$0.85 each — the straddle costs $570, and outcome 2 becomes a loss. Olmstead\u2019s criteria: stock $20\u2013$50; a real event 30\u201360 days out; options with 60\u201390 days of life expiring \u226530 days after the event; IV not yet inflated; stock trading sideways. Exits: sell the profitable leg into the post-event premium pump, and NEVER hold both legs into the final 3\u20134 weeks. The strangle (Aug 35 call $0.80 + Aug 25 put $0.70 = $150) halves the cost and doubles the move required.',
    whyYouFailed: 'You bought the straddle after the rumor was public — paying the IV premium — then held both legs to the last month, where $400 became $140.',
    reflectionQuestion: {
      prompt: 'The event everyone expects just happened and the stock barely moved. What happened to your straddle?',
      choices: [
        'Big profit — any event pays.',
        'IV crush + time decay: the inflated premium you paid deflates post-event, and both legs bleed theta together.',
        'Nothing — straddles are unaffected by events.',
        'The broker refunds you.'
      ],
      correctIndex: 1,
      explanation: 'You pay inflated ATM premiums when the rumor circulates (cost rises from $400 to $570 in Olmstead\u2019s example), and after the event the extra time value evaporates — the double hit that makes straddles "one of the more difficult option trades."'
    },
    protectionBonus: 'Permanent: straddles_strangles — IV-at-purchase vs historical shown; auto-exit warning at 3\u20134 weeks; one leg only held post-event',
    oracleRune: 'ᛝ',
    mechanicLesson: 'Breakevens at expiry: strike \u00b1 total debit (Aug 30 straddle: $26 and $34; a $4 move, both ways). Strangle widens them further (Aug 35/25: needs beyond $23.50 or $36.50) for half the cost.'
  },
  {
    id: 'recovery_math',
    title: 'Stock Repair: Getting Back to Even for Free',
    chapter: 'Chapter 16 — Stock Repair and Stock Enhancement (Olmstead)',
    quote: '"The great appeal of this strategy is that it involves no additional risk since it can be applied for little or no additional expense."',
    corePhilosophy: 'You own a fallen stock; only a partial recovery is coming. The repair structure turns that partial recovery into a full one: buy one at-the-money call, sell two out-of-the-money calls at the same expiration — a covered call plus a bull call spread stacked on your 100 shares. XYZ: bought at $35, now $23. Buy the Jun 25 call ($3.30), sell two Jun 30 calls ($1.75 each) — net CREDIT of $0.20. If XYZ recovers just to $30 at expiry: called away for +$7, the spread worth +$5, plus the $0.20 credit — $12.20/share total, equivalent to $35.20: break-even with the stock still $5 below your cost. YZX: bought $19.50, now $16.50 — buy the May 15 call ($2.40), sell two May 17.5 calls ($1.10 each) for a $0.20 debit; a 6% recovery to $17.50 returns $3.30/share ($19.80 equivalent). The same skeleton enhances winners: ZYX at $58 with a $75 target — buy the Jan 70 call ($3.70), sell two Jan 75 calls ($2.50 each), $1.30 credit; at $75 the payoff is $23.30/share (41% instead of 29%). Swap the stock for the deep-ITM Jan 40 call (delta 0.87, $19.70) and the payoff is $21.60 on $19.70 — 110%.',
    whyYouFailed: 'You sat paralyzed with a fallen stock, needing a 52% rally to break even — when a free option structure could have needed only a 30% rally.',
    reflectionQuestion: {
      prompt: 'Stock bought at $35, now $23. Repair: +Jun 25 call, \u22122 Jun 30 calls, net $0.20 credit. At expiry the stock recovers to $30. Your economics?',
      choices: [
        'Still down $5 per share — repair is a scam.',
        'Called away at $30 (+$7) + bull call spread worth $5 + $0.20 credit = $12.20 — equivalent to $35.20, break-even on a 30% recovery.',
        'You receive unlimited profit from the two short calls.',
        'The put you never bought pays out.'
      ],
      correctIndex: 1,
      explanation: 'Olmstead\u2019s Example 1 exactly: the 1\u00d7 long call + 2\u00d7 short calls restructure the payoff so the recovery from $23 to $30 pays like a recovery to $35.20. Caution: the repair only helps if the stock recovers — flat or falling still loses.'
    },
    protectionBonus: 'Permanent: recovery_math — fallen positions show the repair structure with its exact break-even price before you act',
    oracleRune: 'ᛦ',
    mechanicLesson: 'Repair anatomy: 1 long ATM call + 2 short OTM calls = covered call + bull call spread. Needs \u22652 months to expiry to price at ~zero cost. Reward concentrated in a recovery band; no help below.'
  },
  {
    id: 'protective_put',
    title: 'Married Puts: A Stop Loss Without the Gap Risk',
    chapter: 'Chapter 17 — Married Puts (Olmstead)',
    quote: '"You know that you cannot lose more than $180 no matter what happens to the stock."',
    corePhilosophy: 'The 7\u201310% stop loss fails twice: it executes at the gap level on overnight bad news (a 15\u201320% gap fills at the open, not your stop), and it shakes you out of a pullback that rebounds 15%. The married put replaces it: buy the stock and a put together. XYZ at $31 with the Sept 30 put at $0.80: cost $3,180, and if disaster strikes you can always sell at $30 — max risk $180 ($100 to the strike gap + $80 premium) versus $3,100 unprotected. The stock gaps to $25 overnight and the unprotected holder is down $600 and staring at a harder decision; you are capped and calm. Selection rules: current-month put if \u22653 weeks remain, else next month (3\u20137 weeks of protection — longer is too expensive); nearest strike BELOW the stock (pay only time value), except go to the higher strike when the stock sits just under it (at $34, the Sept 35 put at $1.90 beats eating $4 of stock risk). At expiry: up \u2192 keep the stock with a stop on the gains; down \u2192 exercise or sell the put for a profit and lower your basis; sideways \u2192 sell — a second married put needs an even bigger gain to pay for two premiums.',
    whyYouFailed: 'You ran a 10% stop on a gapping stock. The overnight news filled your stop 18% lower, and the rebound that followed was never yours.',
    reflectionQuestion: {
      prompt: 'XYZ at $31, Sept 30 put at $0.80. Overnight gap to $25. Your loss?',
      choices: [
        '$600 — the full gap, like every stockholder.',
        '$180, the predefined max: $1 strike distance + $0.80 premium. The put converts the crash into a known cost.',
        '$0 — puts refund everything.',
        '$3,180 — the whole position.'
      ],
      correctIndex: 1,
      explanation: 'Exercise the put: sell at $30 (\u2212$100 vs the $31 basis) plus the $80 premium = \u2212$180. That is why the married put beats the stop-loss: gaps fill at the gap price, puts fill at the strike.'
    },
    protectionBonus: 'Permanent: protective_put — new equity buys auto-offer a married put; gap damage capped at strike + premium',
    oracleRune: 'ᛈ',
    mechanicLesson: 'Married put = stock + near-dated OTM put. Max risk = (stock \u2212 strike + premium) \u00d7 100, known before the gap ever comes. Variant for expensive volatile names: a bear put spread instead of the plain put (limited protection, lower cost).'
  },
  {
    id: 'collars',
    title: 'Collars: Insurance You Sell Part Of',
    chapter: 'Chapter 18 — Collars (Olmstead)',
    quote: '"If those stocks whose price collapsed had been properly collared with options, the loss would have been held to less than 10 percent."',
    corePhilosophy: 'The collar wraps long stock between a long put (the floor) and a short call (the ceiling that pays for the floor). XYZ at $19, 14 months out: buy the Jan(06) 20 put ($2.90), sell the Jan(06) 25 call ($1.00) — $190 net; whole trade $2,090. Worst case, stock under $20: exercise the put, lose $90 \u2014 4.3%. Best case, above $25: called away at $25, gain $410 — 20% (17% annualized). Tighten the floor: Jan(06) 22.5 put at $4.50 vs the same $1.00 call — $2,250 total; below $22.5 you exit at exactly $2,250, zero loss of principal, but the best case shrinks to $250 (11%). Loosen it: two Jan(06) 20 puts against one Jan(06) 30 call at $0.60 — $130 max loss (6.1%), $870 best case (41%). Stretch to 26 months (Jan(07) 20 put $3.40 / 25 call $2.30): total $2,010, worst case \u2212$10 (0.5% — essentially riskless), best case +$490 (24%). Dividends improve everything: XYZ\u2019s $0.65 annual dividend lifts Example 1\u2019s max return to 24% and cuts the max loss to 0.3%. Rules: 10\u201312 months minimum duration, LEAPS required, avoid high-volatility names (the options cost too much), and expect to hold to expiration for the full payoff.',
    whyYouFailed: 'You held the "good long-term stock" naked through a bear market and ate a 40\u201350% drawdown — the exact catastrophe the collar would have capped under 10%.',
    reflectionQuestion: {
      prompt: 'Collar on $19 stock: long Jan(06) 20 put, short Jan(06) 25 call, net cost $190. What are the walls?',
      choices: [
        'Loss unbounded, profit capped — worst of both.',
        'Floor: sell at $20 anytime (\u2212$90 max). Ceiling: sold at $25 (+$410 max). Both decided before entry.',
        'Profit unbounded, loss capped at $190.',
        'No walls — collars are theoretical.'
      ],
      correctIndex: 1,
      explanation: 'The put guarantees the $20 sale price; the short call caps it at $25. Net risk $90 (4.3%), max reward $410 (20% over 14 months) — the trade-off knob is how wide the walls sit.'
    },
    protectionBonus: 'Permanent: collars — portfolio holdings over 10% of net worth prompt collar offers; principal loss on collared holdings hard-capped',
    oracleRune: 'ᛞ',
    mechanicLesson: 'Collar = married put minus the call premium. Floor = put strike, ceiling = call strike, cost = net of the two. Longer LEAPS duration tightens cost toward zero-risk; dividends stack on top.'
  }
];
