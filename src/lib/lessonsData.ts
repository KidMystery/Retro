export interface LessonEntry {
  id: string;
  runeTitle: string;
  concept: string;
  quote: string;
  explanation: string;
  practicalRule: string;
  gameApplication: string;
  quizQuestion: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const OPTIONS_LESSONS: LessonEntry[] = [
  {
    id: 'lesson_calls_puts',
    runeTitle: 'The Rite of Calls & Puts (Directional Foundations)',
    concept: 'Call vs Put Contracts & Rights vs Obligations',
    quote: '"A Call is a spear aimed at the heavens; a Put is an iron shield dug into the falling abyss."',
    explanation: 'A Call option grants the buyer the right (not obligation) to BUY 100 shares at the strike price before expiry. A Put option grants the right to SELL at the strike price. Buyers pay a premium for leverage with defined loss (maximum loss = premium paid). Sellers receive premium upfront but undertake obligations.',
    practicalRule: 'Buy Calls when you foresee rapid upward momentum with strong catalysts. Buy Puts when you seek downside protection or foresee a steep collapse. Never buy out-of-the-money (OTM) calls with short expiration as speculative lottery tickets.',
    gameApplication: 'In combat, casting a Long Call channels Bullish Momentum—if underlying $AETH surges, your strike critical damage multiplies. Casting a Long Put acts as a protective aegis—absorbing crash attacks from Bearish Phantoms.',
    quizQuestion: {
      prompt: 'If you expect the underlying asset $AETH to rise sharply from 100 to 120 within 30 days, which contract offers leveraged upside with capped risk?',
      options: [
        'Sell a naked Call option',
        'Buy a Call option with strike 100 or 105',
        'Buy a Put option with strike 90',
        'Sell your entire portfolio for cash'
      ],
      correctIndex: 1,
      explanation: 'Buying a Call option gives you uncapped upside participation above the strike price while strictly limiting your loss to the premium paid.'
    }
  },
  {
    id: 'lesson_theta_decay',
    runeTitle: 'The Curse of Theta (The River of Time)',
    concept: 'Theta Time Decay & Extrinsic Value Bleed',
    quote: '"Time is the silent predator of options buyers; it devours extrinsic value with every setting sun."',
    explanation: 'Options possess intrinsic value (in-the-money depth) and extrinsic value (time + volatility value). Theta measures how much the contract price decreases each single day. Theta decay accelerates exponentially as expiration approaches, particularly in the final 30 to 14 days.',
    practicalRule: 'Long option holders bleed theta every day the underlying asset consolidates. To survive, option buyers must buy ample duration (45-90 DTE) or use spreads to offset theta decay. Option sellers collect theta as rental income.',
    gameApplication: 'Every turn or dungeon rest advances the game clock by 1 Day. If you hold raw long options, your portfolio loses value each sunset! However, if you deploy Credit Spreads or Iron Condors, you siphon positive mana and florins each day.',
    quizQuestion: {
      prompt: 'When does Theta (time decay) accelerate most rapidly for an at-the-money option?',
      options: [
        'When there are 180+ days remaining until expiration',
        'During the final 30 to 7 days before expiration',
        'Theta decay remains strictly constant at all times',
        'Only on weekends when markets are closed'
      ],
      correctIndex: 1,
      explanation: 'Theta decay curves steepen dramatically in the final 30 days before expiration as time premium collapses to zero.'
    }
  },
  {
    id: 'lesson_greeks_balance',
    runeTitle: 'The Four Elemental Greeks (Delta, Gamma, Theta, Vega)',
    concept: 'Risk Sensitivities and Portfolio Balance',
    quote: '"Delta is your heading, Gamma your momentum, Theta the sands of your hourglass, and Vega the atmospheric storm."',
    explanation: 'Delta (Δ) is price sensitivity ($ change per $1 underlying move) and approximate probability of expiring ITM. Gamma (Γ) is the rate of change of Delta. Theta (Θ) is the daily time erosion. Vega (ν) is the price sensitivity per 1% change in Implied Volatility.',
    practicalRule: 'Monitor your Net Portfolio Greeks. If your Net Delta is excessively positive (+0.80+), a market dip will crush you. If your Gamma is extreme, sudden moves can trigger rapid liquidation.',
    gameApplication: 'Your character attributes display Net Delta, Gamma, Theta, and Vega. Enemies in the realm exploit unhedged Greeks: high Vega makes you vulnerable to the Volatility Hydra, while high negative Theta drains your stamina in battle.',
    quizQuestion: {
      prompt: 'If your portfolio has a net Delta of +0.50 and the underlying asset drops by $10, what is the approximate directional impact on your portfolio value?',
      options: [
        'Gain approximately $500',
        'Lose approximately $500 (plus gamma acceleration)',
        'No change at all because options are derivatives',
        'Gain double your initial cash'
      ],
      correctIndex: 1,
      explanation: 'Delta of +0.50 on 100 shares means a $10 drop reduces your position by roughly $5 per share ($500 per contract).'
    }
  },
  {
    id: 'lesson_vertical_spreads',
    runeTitle: 'The Shield of Defined Risk (Vertical Spreads)',
    concept: 'Debit and Credit Vertical Spreads',
    quote: '"He who caps his boundless greed with a second strike builds a fortress impervious to ruin."',
    explanation: 'A Bull Call Debit Spread involves buying a lower strike Call and selling a higher strike Call. This slashes the upfront cost, mitigates theta decay, and strictly defines both maximum gain and maximum loss. Credit spreads (selling closer to money, buying further OTM for protection) generate net cash upfront.',
    practicalRule: 'Trade defined-risk spreads when trading directional moves. By selling the higher strike, you finance your long strike and protect yourself against high implied volatility collapse.',
    gameApplication: 'Equipping a Bull Call Spread or Bear Put Spread grants the "Defined Risk Ward"—even if the boss unleashes a 999-damage Black Swan blow, your damage is capped at the defined spread width!',
    quizQuestion: {
      prompt: 'What is the primary advantage of a Bull Call Spread over buying a single naked Call option?',
      options: [
        'It offers unlimited infinite profit',
        'It reduces trade cost, caps maximum loss, and lessens the burden of theta decay',
        'It eliminates the need for the stock to ever rise',
        'It allows trading with zero margin requirement forever'
      ],
      correctIndex: 1,
      explanation: 'By selling an OTM Call against your long Call, you offset premium cost and time decay, trading off unlimited upside for a higher probability, defined-risk trade.'
    }
  },
  {
    id: 'lesson_covered_call',
    runeTitle: 'Harvest of the Covered Field (Covered Calls - Farmer Income)',
    concept: 'Covered Calls: Own 100 Shares + Sell Call for Income',
    quote: '"The farmer does not sell his field for promise of moon harvest; he owns field and rents its fruit."',
    explanation: 'Covered Call: Own 100 shares of wonderful business at discount (margin of safety), sell OTM Call against it for income. If stock stays flat or rises modestly to short strike, you keep premium + appreciation up to strike. If rockets past strike, you cap upside but keep premium. If falls, premium cushions loss but you still own stock. Buffett-style: get paid to wait. Olmstead Chapter 4. Investor-path staple. Risk: downside still hurts, but less than naked.',
    practicalRule: 'Deploy Covered Calls when you own wonderful business bought at margin of safety, IV Rank elevated, and you are willing to sell at higher strike for income. Never sell covered calls below cost basis unless disciplined rebalancing.',
    gameApplication: 'In Iron Sanctuary range, Covered Call generates Theta income daily! Against Crab Golem, selling calls while holding stock = farmer income while market sleeps. Investor path +2, Oracle Bond +0.2. True ending same via discipline.',
    quizQuestion: {
      prompt: 'You own 100 shares $AETH bought at 100 ƒ (margin of safety). Spot 105 ƒ, IV Rank 60%. You sell 110 strike Call 30 DTE for 2.50 ƒ. What happens if $AETH expires at 108 ƒ?',
      options: [
        'You lose everything and margin call',
        'You keep 2.50 ƒ premium + stock gains 100→108 = 800 ƒ, total +1050 ƒ profit, keep shares',
        'You must buy shares at 110 ƒ',
        'Covered calls always lose money'
      ],
      correctIndex: 1,
      explanation: 'Covered Call at 108 ƒ expires OTM, you keep 250 ƒ premium + 800 ƒ stock appreciation = 1050 ƒ, still own shares. If above 110 ƒ, shares called away at 110 ƒ + premium.'
    }
  },
  {
    id: 'lesson_calendar_spread',
    runeTitle: 'Chrono-Sphinx Sands (Calendar Spreads - Theta as Ally)',
    concept: 'Calendar Spread: Sell Near-Term Decay, Buy Long-Term',
    quote: '"Time enemy to reckless buyer, faithful servant to spread trader."',
    explanation: 'Calendar Spread: Same strike, different expirations. Sell near-term option (fast theta decay) and buy long-term option (slow decay) same strike. Near-term decays faster, you profit from time decay differential if stock pins near strike at front expiry. Long leg protects. Ideal for Theta Steppes: 0-DTE lottery costs patience + capital, but selling that decay while owning longer-dated hedge turns theta from predator to rent. Olmstead Chapter 5. Hybrid path.',
    practicalRule: 'Deploy Calendars when IV low to moderate, you expect stock to pin near strike at front expiry, and you want positive theta after front expiry? Actually calendar has negative theta initially then positive as front decays. Manage by closing front leg before expiry, rolling. Never hold short leg into expiry without plan.',
    gameApplication: 'Against Chrono-Sphinx who devours extrinsic value, Calendar Spread lets you sell his time river while owning long-term protection! Theta Steppes riddle: What does 0-DTE lottery cost? Patience + capital. Calendar earns that cost back.',
    quizQuestion: {
      prompt: 'What does 0-DTE OTM lottery call truly cost, per Theta Steppes riddle?',
      options: [
        'Nothing, it is free lottery',
        'Patience + capital - theta decay accelerates final days, contract expires worthless most time',
        'Only brokerage commission',
        'It always profits 100x'
      ],
      correctIndex: 1,
      explanation: '0-DTE OTM lottery: 0.05 ƒ → 0 ƒ most days. Theta decay non-linear, final 30-7 days hyper-speed. Buying short-dated OTM mathematically rigged for seller. Calendar spreads sell that decay, buy longer protection.'
    }
  },
  {
    id: 'lesson_iv_crush',
    runeTitle: 'The Dragon of Vega (Implied Volatility & IV Crush)',
    concept: 'Implied Volatility (IV) and IV Crush',
    quote: '"Beware the eve of great announcements; the monster of IV inflates prices before the dawn, only to exhale and crush them."',
    explanation: 'Implied Volatility reflects the market\'s expected price movement. Before major events (earnings, dragon awakenings), IV inflates option premiums to extreme heights. Once the event passes and uncertainty resolves, IV collapses instantly ("IV Crush"), causing both Calls and Puts to lose substantial value even if the stock moved in the expected direction.',
    practicalRule: 'Avoid buying expensive naked options when IV Rank is above 70%. In high IV regimes, favor selling premium (Credit Spreads, Iron Condors) or using calendar/diagonal strategies.',
    gameApplication: 'When facing the Volatility Hydra, IV surges past 80%. If you buy raw calls right before the boss fight, the victory scene triggers IV crush, losing you 60% of your contract value unless you used spreads or hedged Vega!',
    quizQuestion: {
      prompt: 'Why might an investor who correctly predicted an earnings beat on a stock still lose money on an Out-of-the-Money Call option bought the day before?',
      options: [
        'Because options are illegal during earnings',
        'Due to post-earnings IV Crush collapsing extrinsic value more than the delta gain',
        'Because the stock moved too quickly for the broker',
        'Because Delta turns negative on good news'
      ],
      correctIndex: 1,
      explanation: 'Pre-earnings IV was artificially inflated. Post-announcement, the sudden collapse in IV (IV crush) wiped out the extrinsic time premium faster than the modest spot rise could compensate.'
    }
  },
  {
    id: 'lesson_iron_condor',
    runeTitle: 'The Bastion of Neutrality (The Iron Condor)',
    concept: 'Four-Legged Non-Directional Income Strategy',
    quote: '"When kings squabble without advancing their borders, the merchant in the middle harvests the grain."',
    explanation: 'An Iron Condor combines an Out-of-the-Money Bull Put Credit Spread with an Out-of-the-Money Bear Call Credit Spread. It collects net credit upfront and achieves maximum profit if the underlying stock remains bounded between the two short strikes at expiration.',
    practicalRule: 'Deploy Iron Condors when IV is elevated (IV Rank > 50) and you expect the market to trade sideways or consolidate in a trading range. Set stop-losses if the short strikes are threatened (typically at 2x the credit received).',
    gameApplication: 'Against the Chrono-Sphinx and Crab Golems, who refuse to trend and lock the market in range, deploying an Iron Condor generates passive golden florins each turn as long as the spot price stays within the mystic runes!',
    quizQuestion: {
      prompt: 'Under what market condition does an Iron Condor achieve its maximum theoretical profit at expiration?',
      options: [
        'When the underlying asset makes a catastrophic 50% plunge',
        'When the underlying asset finishes between the short call and short put strikes',
        'When implied volatility triples overnight',
        'Only when interest rates drop to zero'
      ],
      correctIndex: 1,
      explanation: 'All four options expire worthless outside the money, allowing the trader to keep 100% of the initial net credit collected.'
    }
  },
  {
    id: 'lesson_margin_discipline',
    runeTitle: 'The Law of Capital Preservation (Margin & Sizing)',
    concept: 'Position Sizing, Leverage & Surviving Margin Calls',
    quote: '"The graveyard of failed sorcerers is paved with naked leverage and 100% position sizing."',
    explanation: 'Capital preservation is the sacred rule of trading. Even a strategy with a 90% win rate will suffer bankruptcy if each trade risks 25% of the account (Gambler\'s Ruin). Professional risk management dictates allocating no more than 2-5% of total capital to any single risk position and keeping sufficient cash reserves.',
    practicalRule: 'Always preserve at least 30-50% liquid cash. Never sell uncovered (naked) options on high-volatility underlyings. If margin usage exceeds 70%, immediately de-risk or hedge.',
    gameApplication: 'The combat system scales enemy ferocity directly with your Margin Utilization and Net Portfolio Risk! If you overleverage into 80%+ margin, the Inquisitor of Liquidation summons devastating Margin Call strikes that bypass armor!',
    quizQuestion: {
      prompt: 'According to disciplined financial risk management, what percentage of your total portfolio should you typically risk on a single speculative options trade?',
      options: [
        '50% to 100% to maximize rapid growth',
        '1% to 5% of total account capital to endure losing streaks',
        'Always borrow the maximum margin available',
        '0%, never trade any contracts under any circumstances'
      ],
      correctIndex: 1,
      explanation: 'Limiting risk to 1-5% per trade guarantees that a sequence of inevitable losses will not impair your ability to recover and continue compounding.'
    }
  }
];
