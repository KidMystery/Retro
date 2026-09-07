import { ScamEncounter } from '../types';

export const SCAM_ENCOUNTERS: { [key: string]: ScamEncounter } = {
  'ponzi_farm': {
    id: 'ponzi_farm',
    scamType: 'PONZI_YIELD',
    title: 'The Alchemist\'s "Guaranteed 10,000% APY" Liquidity Pool',
    shillerName: 'Alchemist Sam "SBF" of Babylon',
    shillerTitle: 'Chief High-Priest of Algorithmic Yield',
    pitch: '"Greetings, traveler! Why toil for 8% annual when my Black Box Pool guarantees 25% DAILY? Deposit Florins into quantum rebasing vault. Wealth out of thin air!" The charm monster overpromises — village elder\'s savings vanished same night you found Oracle Stone.',
    promiseText: 'Guaranteed 25% Daily APY. Zero risk promised. "Mathematically impossible to lose!"',
    costFlorins: 1200,
    legitimacyClaims: [
      '✅ Smart contract audited by "CertikHawk LLC" (badge provided)',
      '🔒 Liquidity LOCKED — 100% verifiable on-chain*',
      '⭐ Endorsed by Baron Von Chart of the Northern Exchanges',
      '👥 40,000+ depositors. Nobody has ever lost florins!',
    ],
    subtleTells: [
      'Audit firm "CertikHawk LLC" has no registry entry and a freshly minted sigil',
      'Pool claims 25% daily yield, but no underlying asset, vault, or business is named',
      'The lock certificate expires the morning after you deposit',
      'Early depositors may withdraw; your withdrawal window opens "next epoch"',
    ],
    earlyWin: {
      florinsGained: 360,
      storyText: 'Day 1: +8%. Day 2: +14%. Your 1,200ƒ shows 1,560ƒ on the ledger — the dashboard glows green. The Alchemist sends a personal message: "You are early. Compound now, whales are entering." The number is real on the screen. It is not real anywhere else.',
    },
    temptationOutcome: {
      rugPullHeadline: '🚨 DISASTER! ALGORITHMIC VAULT RUG PULL! 🚨',
      storyExplanation: 'Three days after deposit, withdrawal portal locks! Alchemist: "Temporarily halted for upgrade," flees on pegasus. Pool empty — early depositors paid with your money! This is fail->Graham loop: you crack hearts, enter Sanctuary of Quiet Oracle, answer reflection question, gain permanent protection.',
      heartsLost: 1.5,
      intelligentInvestorLesson: 'BENJAMIN GRAHAM LAW: "Most dangerous illusion is promise of extraordinary risk-free returns. When returns paid not from production but incoming deposits, it\'s Ponzi. When you don\'t understand where yield comes from, YOU are yield."',
      chapterReference: 'The Intelligent Investor — Chapter 1: Investment vs Speculation',
      failReason: 'RUG_PULL_SCAM',
      lessonId: 'investment_vs_speculation'
    },
    rejectionOutcome: {
      response: '"Where returns originate? What tangible goods does pool produce?" Alchemist stammers. You reject — discipline rewarded.',
      rewardFlorins: 350,
      rewardWisdom: 'You exposed Ponzi! Constable arrests charlatan, awards 350 ƒ! + Investor path, + FOMO protection permanent.',
      pathScore: { investor: 2 },
      protectionGranted: 'fomo_protection'
    }
  },
  'crypto_meme_pump': {
    id: 'crypto_meme_pump',
    scamType: 'PUMP_AND_DUMP',
    title: 'Telegram Shill Goblin\'s $DogeTulip Rocket',
    shillerName: 'Shill Goblin Jax',
    shillerTitle: 'VIP Alpha Insider Group Admin',
    pitch: '"Psst! Private cabal pumping $DogeTulip midnight! Rocket emojis 🚀🚀🚀! Devs locked liquidity 10 min (trust bro). 1,000 ƒ → 100x by breakfast!" Goblin is bait in Whispering Grove - tests if you learned investment vs speculation.',
    promiseText: '100x Instant Gains. "Backed by vibes and hype!"',
    costFlorins: 800,
    legitimacyClaims: [
      '✅ Liquidity locked (dev wallet renounced — "trust bro")',
      '🏆 Trending #1 on the Coingecko of Valuaria',
      '📣 Celebrity herald Knighthowl tweeted the chart at 2M followers',
      '💎 Diamond-hand community. Paper hands get rekt!',
    ],
    subtleTells: [
      'Liquidity lock is 10 minutes — long enough for the pump, not for you',
      'Team is anonymous ("for security reasons"); 82% of supply sits in 3 unnamed vaults',
      'The "audit" is a screenshot of another token\'s audit with the name cropped',
      'VIP group requires a 500ƒ "entry fee" to receive the same signal everyone else got',
    ],
    earlyWin: {
      florinsGained: 480,
      storyText: 'Midnight. The chart goes vertical — +60% in sixty seconds. Your 800ƒ reads 1,280ƒ. Chat floods with 🚀 and screenshots. Jax posts: "Wave 2 incoming, add before 1am." The candles only ever went up — right until the candle you are holding.',
    },
    temptationOutcome: {
      rugPullHeadline: '🚨 BRUTAL RUG PULL! DEV DUMPED 99.8% SUPPLY! 🚨',
      storyExplanation: 'You handed 1,000 ƒ. Price spikes 60 sec, then gigantic sell wipes order book! Creator dumped pre-mined, deleted channel. Tokens $0.000001. Fail->Graham loop triggers: Sanctuary, reflection question on Mr Market, permanent protection vs FOMO.',
      heartsLost: 1.5,
      intelligentInvestorLesson: 'BENJAMIN GRAHAM: "Speculative public attracted to momentum without intrinsic worth. Buying unbacked token hoping greater fool buys is gambling. Price what you pay, value what you get."',
      chapterReference: 'The Intelligent Investor — Chapter 8: Mr Market',
      failReason: 'RUG_PULL_SCAM',
      lessonId: 'mr_market'
    },
    rejectionOutcome: {
      response: '"Show audited contract, token distribution, real cash flows." Goblin screeches, scurries!',
      rewardFlorins: 200,
      rewardWisdom: 'Avoided greater-fool trap! Discipline preserves capital. + Trader path for defined-risk mindset.',
      pathScore: { trader: 1, investor: 1 },
      protectionGranted: 'mr_market'
    }
  },
  'turbo_leverage_vault': {
    id: 'turbo_leverage_vault',
    scamType: 'UNREGISTERED_TURBO_LEVERAGE',
    title: 'Shadow Broker\'s 100x Naked Leverage Casino',
    shillerName: 'Lord Marginatus - Disciple of Marduk Vex',
    shillerTitle: 'Merchant of Uncapped Downside',
    pitch: '"Why waste time with defined-risk spreads? Real warriors take 100x unhedged margin! Up 1% → double net worth! (Dip 0.5% → family estate liquidated, don\'t worry)." Marduk Vex fell this way — rejected margin of safety for max leverage. One ruinous year broke him.',
    promiseText: '100x Turbo Leverage. Uncapped upside, catastrophic hidden downside.',
    costFlorins: 1500,
    legitimacyClaims: [
      '🏛️ Licensed in the Free Port of Marduk (registry sticker on the desk)',
      '📈 Backtested 9 years: 8 profitable. "The 9th was weather."',
      '🔒 Isolated margin — your other positions are "totally safe"',
      '👨‍💼 Dedicated account manager answers within minutes, any hour',
    ],
    subtleTells: [
      'The "license" is from a jurisdiction with no courts and no address',
      'Backtest excludes fees, funding, and every liquidation wick — the exact thing that kills 100x',
      'Account manager earns a commission on your notional, not your results',
      'Withdrawal terms are one line, in small type, at the very bottom of the scroll',
    ],
    temptationOutcome: {
      rugPullHeadline: '🚨 INSTANT LIQUIDATION! 0.4% WICK WIPED YOU OUT! 🚨',
      storyExplanation: 'Signed contract, took 100x. Random 10-sec jitter blipped spot down fraction. Bots seized 1,500 ƒ + Margin Call! Even correct thesis dies when wick liquidates before thesis plays. Kelly: survival first. Fail->Graham: Sanctuary, leverage_protection lesson, permanent Kelly sizing.',
      heartsLost: 2.0,
      intelligentInvestorLesson: 'BENJAMIN GRAHAM: "Unregulated leverage turns investing into suicide race against volatility noise. Even correct thesis guarantees liquidation before thesis plays. Always maintain iron Margin of Safety. Kelly: position sizing, when NO trade is best."',
      chapterReference: 'The Intelligent Investor — Chapter 20: Margin of Safety + Kelly Criterion',
      failReason: 'OVERLEVERAGE_MARGIN_CALL',
      lessonId: 'leverage_protection'
    },
    rejectionOutcome: {
      response: '"I trade only defined risk + prudent margin. Uncapped asymmetry is madness. Rich = survival first."',
      rewardFlorins: 250,
      rewardWisdom: 'Rejected ruinous leverage! Risk score pristine, capital lives. + Hybrid path, + Kelly discipline.',
      pathScore: { trader: 1, investor: 1 },
      protectionGranted: 'leverage_protection'
    }
  },
  'theta_lottery_trap': {
    id: 'theta_lottery_trap',
    scamType: 'PUMP_AND_DUMP',
    title: 'Chrono-Sphinx\'s 0-DTE Lottery Mirage',
    shillerName: 'Chrono Gambler',
    shillerTitle: 'Seller of Dreams',
    pitch: '"Why buy 45 DTE like boring Graham? Buy 0-DTE OTM Call Strike $150 for 0.05 ƒ! If $AETH jumps 50% by 4pm, you 100x! (It never does, but shhh)" Theta Steppes test: What does 0-DTE lottery truly cost? Answer: patience + capital.',
    promiseText: '0-DTE Lottery: 0.05 ƒ → 5.00 ƒ if miracle happens',
    costFlorins: 400,
    legitimacyClaims: [
      '🧮 "Mathematically the same as calendar spreads — just faster!"',
      '🎫 Ticket price is tiny: defined risk! Only 0.05ƒ per contract',
      '📊 The Sphinx shows you a chart of one (1) time it worked',
      '⏱️ "Theta is only a problem for people who hold overnight. You are day-trading!"',
    ],
    subtleTells: [
      'The sample-size chart has exactly one example, cherry-picked',
      'Nobody mentions that 0-DTE OTM options expire worthless the overwhelming majority of the time',
      'The Sphinx sells these tickets. Every buyer\'s premium is his income',
      '"Same as calendar spreads" — except calendars buy 45 DTE and SELL the lottery leg',
    ],
    temptationOutcome: {
      rugPullHeadline: '⏳ THETA CRUSH! Time decay vaporized premium to zero!',
      storyExplanation: 'You bought 0-DTE OTM. Market moved sideways. Theta decay accelerated final hours, contract expired worthless. You learned: "nothing happens" is profit for premium sellers, not buyers. Fail->Graham loop: Sanctuary, theta_protection lesson.',
      heartsLost: 1.0,
      intelligentInvestorLesson: 'Theta decay accelerates final 30 to 7 days. Buying short-dated OTM options mathematically rigged for seller. Calendar spreads: sell near-term decay, buy long-term. Time is enemy to reckless buyer, servant to spread trader.',
      chapterReference: 'Olmstead Chapter 5 - Theta & Calendar Spreads',
      failReason: 'THETA_DECAY_CRUSH',
      lessonId: 'theta_protection'
    },
    rejectionOutcome: {
      response: '"I collect theta, not pay it. Calendar spread or cash-secured put instead."',
      rewardFlorins: 180,
      rewardWisdom: 'You chose to be seller of time, not buyer. Theta protection granted!',
      pathScore: { investor: 1, trader: 1 },
      protectionGranted: 'theta_protection'
    }
  },
  'iv_crush_honeypot': {
    id: 'iv_crush_honeypot',
    scamType: 'PUMP_AND_DUMP',
    title: 'Hydra\'s 85% IV Honeypot',
    shillerName: 'Volatility Siren',
    shillerTitle: 'Mistress of Euphoric IV',
    pitch: '"Earnings tomorrow! IV 85%! Everyone buying Calls! You should too! Stock will definitely beat and you\'ll get rich! (IV will crush 85%→25% regardless direction, but I won\'t mention)" Vol Caldera teaches: buy shield when others fire.',
    promiseText: 'Buy 85% IV Calls before earnings - sure thing!',
    costFlorins: 600,
    legitimacyClaims: [
      '📈 "The stock ALWAYS runs into earnings — look at this chart!" (one chart shown)',
      '🔥 IV 85% means the market EXPECTS a huge move. Ride it!',
      '🤝 "Everyone on the desk is buying calls. Don\'t be the last one in."',
      '🛡️ "It\'s directional, not speculative — you have a thesis!"',
    ],
    subtleTells: [
      'The Siren is selling you the calls. At 85% IV, she is the one being paid for risk',
      'A huge expected move is already priced into the premium — you need it to move MORE than priced',
      'Nobody mentions what IV does the second after the announcement',
      '"Everyone is buying" is the yield source: their premium, your position',
    ],
    temptationOutcome: {
      rugPullHeadline: '🌋 IV CRUSH! Stock up 2% but Calls down 60%!',
      storyExplanation: 'You bought 85% IV Calls. Earnings beat! Stock +2%. But IV collapsed 85%→30%, extrinsic vaporized. Contracts down 60% despite correct direction. Need vertical spreads hedging Vega. Fail->Graham: vega_protection lesson.',
      heartsLost: 1.2,
      intelligentInvestorLesson: 'Beware eve of announcements; monster inflates prices before dawn, only to exhale and crush. Pre-earnings IV inflated. Post-announcement collapse wiped extrinsic faster than spot rise. Vertical spreads neutralize Vega.',
      chapterReference: 'Olmstead Chapter 7 - Vega & IV Crush',
      failReason: 'IV_CRUSH',
      lessonId: 'vega_protection'
    },
    rejectionOutcome: {
      response: '"IV Rank 85% = sell premium, not buy. Iron Condor or Bull Call Spread hedging Vega."',
      rewardFlorins: 220,
      rewardWisdom: 'You sold euphoric IV instead of buying! Vega mastery +50%.',
      pathScore: { trader: 2 },
      protectionGranted: 'vega_protection'
    }
  }
};
