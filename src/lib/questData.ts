import { QuestNode, EnemyStats } from '../types';

export interface MapData {
  act: number;
  name: string;
  theme: string;
  underlyingSymbol: string;
  baseSpot: number;
  baseIv: number;
  grid: string[];
  legend: { [key: string]: { name: string; type: string; desc: string } };
  storyBeat: string;
  masterLesson: string;
}

export const REALM_MAPS: MapData[] = [
  {
    act: 1,
    name: 'The Whispering Grove of Strikes',
    theme: 'Forest of directional winds and nascent trends - Origin of Valen',
    underlyingSymbol: '$AETH',
    baseSpot: 100,
    baseIv: 0.28,
    grid: [
      '############',
      '#.@..S...E.#',
      '#.####.###.#',
      '#...M..#...#',
      '###.####.###',
      '#...C..#...#',
      '#.####.###.#',
      '#....E...B.#',
      '############'
    ],
    legend: {
      '@': { name: 'Valen - Orphan of Grove', type: 'PLAYER', desc: 'You, bonded to Oracle Stone' },
      'S': { name: 'Shrine of Daen Alterspire', type: 'SHRINE', desc: 'Obsidian altar with floating amber runes, emerald core - the Bloomberg made fantasy' },
      'M': { name: "Oracle's Ledger Glyph", type: 'EXCHANGE', desc: 'Floating glyph-circle showing live prices, greeks, portfolio - divination lens' },
      'E': { name: 'Village Elder Memory', type: 'EVENT', desc: 'Rug-pulled life savings - your quest born' },
      'C': { name: 'Cache of Florins', type: 'CHEST', desc: 'Hidden guild currency + Black-Scholes Slate' },
      'B': { name: 'Grizzly Bear Phantom', type: 'BOSS', desc: 'Guardian of Drawdowns - teaches panic selling' }
    },
    storyBeat: 'ACT 1 - ORIGIN: You are Valen, orphan of Grove. Village elder\'s life savings rug-pulled by charm monster same night you find Oracle\'s Stone in forgotten sanctum. Two events collide: quest born. MASTER: Calls & Puts, direction, Delta. Face Ponzi Alchemist "SBF" + $DogeTulip Goblin.',
    masterLesson: 'Calls & Puts, Delta, Direction. Olmstead Chapter 1. Graham: Investment vs Speculation.'
  },
  {
    act: 2,
    name: 'The Theta Steppes of Decay',
    theme: 'Arid desert where river of time burns extrinsic value - Time teaches patience',
    underlyingSymbol: '$AETH',
    baseSpot: 112,
    baseIv: 0.35,
    grid: [
      '############',
      '#.@..#..S..#',
      '#.##.##.##.#',
      '#..E.M...C.#',
      '#.########.#',
      '#...#....#.#',
      '###.#.##.#.#',
      '#.E...#..B.#',
      '############'
    ],
    legend: {
      '@': { name: 'Valen', type: 'PLAYER', desc: 'Time-worn traveler' },
      'S': { name: 'Chrono-Obelisk of Theta', type: 'SHRINE', desc: 'Altar teaching Theta decay and Calendar Spreads' },
      'M': { name: 'Oasis Oracle Circle', type: 'EXCHANGE', desc: 'Derivatives divination post' },
      'E': { name: 'Chrono-Sage Echo', type: 'EVENT', desc: 'Riddle: What does 0-DTE lottery truly cost? Answer: patience + capital' },
      'C': { name: 'Hourglass Relic', type: 'CHEST', desc: 'Time manipulation + Graham protection' },
      'B': { name: 'The Chrono-Sphinx', type: 'BOSS', desc: 'Devourer of extrinsic value - punishes lottery calls' }
    },
    storyBeat: 'ACT 2 - TIME: Chrono-Sphinx froze river of time; options rot to nothingness. MASTER: Theta decay, calendar spreads. Riddle: "What does 0-DTE lottery call truly cost?"',
    masterLesson: 'Theta, Calendar Spreads. Olmstead Chapter 5. Graham: Mr. Market patience.'
  },
  {
    act: 3,
    name: 'The Iron Sanctuary of Neutrality',
    theme: 'Fortress canyon locked in rangebound channel - Discipline earns while gambler starves',
    underlyingSymbol: '$AETH',
    baseSpot: 120,
    baseIv: 0.42,
    grid: [
      '############',
      '#.@.M..#...#',
      '###.##.#.S.#',
      '#...#..#.###',
      '#.E.#.C#...#',
      '#.###.####.#',
      '#...#..M.#.#',
      '#.E...#..B.#',
      '############'
    ],
    legend: {
      '@': { name: 'Valen', type: 'PLAYER', desc: 'Rangebound pilgrim' },
      'S': { name: 'Bastion Altar of Condors', type: 'SHRINE', desc: 'Iron Condor scrolls - nothing happens is profit' },
      'M': { name: 'Sanctuary Vault Ledger', type: 'EXCHANGE', desc: 'High-discipline options desk' },
      'E': { name: 'Arbitrage Merchant', type: 'EVENT', desc: 'Market-neutral spread opportunities' },
      'C': { name: 'Gold Bullion + Covered Call Deed', type: 'CHEST', desc: 'Value investing relic' },
      'B': { name: 'Crab Golem of Sideways Range', type: 'BOSS', desc: 'Stone crab destroying directional bets' }
    },
    storyBeat: 'ACT 3 - RANGE: Crab Golem clamped realm in iron bands; price can\'t break out. MASTER: Iron Condors, selling premium, defined-risk range plays. Lesson: "nothing happens" is profit. Disciplined trader earns while gambler starves.',
    masterLesson: 'Iron Condors, Cash-Secured Puts, Covered Calls. Olmstead Chapters 3-4,6. Graham: Margin of Safety.'
  },
  {
    act: 4,
    name: 'The Volatility Caldera',
    theme: 'Lava crags radiating violent IV eruptions - Buy shield when others fire',
    underlyingSymbol: '$AETH',
    baseSpot: 135,
    baseIv: 0.65,
    grid: [
      '############',
      '#.@...#..S.#',
      '#.###.#.##.#',
      '#..M#..C.#.#',
      '##.#######.#',
      '#..E#....#.#',
      '#.###.##.#.#',
      '#...E.#..B.#',
      '############'
    ],
    legend: {
      '@': { name: 'Valen', type: 'PLAYER', desc: 'Volatility survivor' },
      'S': { name: 'Volcanic Rune Shrine of Vega', type: 'SHRINE', desc: 'Secrets of Vega and IV Crush' },
      'M': { name: 'Magma Oracle Circle', type: 'EXCHANGE', desc: 'Options terminal amid extreme vol' },
      'E': { name: 'Seismic Prophet', type: 'EVENT', desc: 'Forewarns earnings explosions' },
      'C': { name: 'Fire Pearl of Delta + Straddle Rune', type: 'CHEST', desc: 'Vol mastery' },
      'B': { name: 'Hydra of Implied Vega', type: 'BOSS', desc: 'Multi-headed dragon thriving in shocks' }
    },
    storyBeat: 'ACT 4 - VOL: Hydra of Implied Vega - every head a market shock spitting IV crush. MASTER: Vega, buying cheap IV, selling euphoric IV. Buy shield when everyone else\'s is on fire.',
    masterLesson: 'Vega, Long Straddle, IV Crush. Olmstead Chapter 7. Graham: Be fearful when others greedy.'
  },
  {
    act: 5,
    name: 'The Citadel of Marduk Vex',
    theme: 'Tower where Liquidation Lord Marduk Vex, fallen Oracle-Sage, rejected margin of safety for max leverage',
    underlyingSymbol: '$AETH',
    baseSpot: 150,
    baseIv: 0.50,
    grid: [
      '############',
      '#.@.M..#..S#',
      '#.####.###.#',
      '#..C#....#.#',
      '###.#.##.###',
      '#...#.#..#.#',
      '#.###.##.#.#',
      '#..E.....B.#',
      '############'
    ],
    legend: {
      '@': { name: 'Valen - Near Master', type: 'PLAYER', desc: 'Crown of richest investor awaits' },
      'S': { name: 'Apex Sanctuary of Kelly', type: 'SHRINE', desc: 'Capital preservation + Kelly Criterion + knowing when NO trade' },
      'M': { name: 'Grand Sovereign Oracle Ledger', type: 'EXCHANGE', desc: 'Supreme market desk' },
      'E': { name: 'Spectral Inquisitor of Sizing', type: 'EVENT', desc: 'Audits portfolio margin cushion + position sizing' },
      'C': { name: "Emperor's Treasury + Graham's Crown", type: 'CHEST', desc: 'Final relic' },
      'B': { name: 'Liquidation Lord Marduk Vex', type: 'BOSS', desc: 'Fallen sage - true end: out-discipline, not kill' }
    },
    storyBeat: 'ACT 5 - CITADEL: Liquidation Lord Marduk Vex, fallen Oracle-Sage who rejected margin of safety for max leverage. MASTER: capital preservation + Kelly / position sizing / when to take NO trade. TRUE END: you don\'t kill him — you out-discipline. He confesses he once valued margin of safety, one ruinous year broke him. He sits as humble student. Richest investor = survival first, growth after safety.',
    masterLesson: 'Kelly Criterion, Position Sizing, NO trade. Graham Chapter 20. Olmstead Final.'
  }
];

export const BOSS_ENEMIES: { [key: number]: EnemyStats } = {
  1: {
    id: 'boss_bear_phantom',
    name: 'Grizzly Bear Phantom',
    title: 'Harbinger of 20% Drawdown - Grove Guardian',
    type: 'BEAR',
    baseHp: 140,
    maxHp: 140,
    currentHp: 140,
    attackPower: 16,
    defense: 3,
    riskSensitivity: 1.2,
    marketAffinity: 'CRASH',
    specialMove: 'Cascading Flash Crash - drives spot down $8, tests Put protection!',
    lore: 'Origin boss. Ghostly ursine from historical crashes. Preys on greedy long call holders neglecting protective puts. Teaches: panic selling vs margin of safety. Valen must understand direction + Delta. Linked to Ponzi Alchemist SBF and $DogeTulip Goblin - crypto bait.',
    dialogue: [
      '"You hold no Put protection, orphan Valen? Watch unhedged calls dissolve!"',
      '"Every green candle is illusion before my winter! Where is your margin of safety?"',
      '"The elder\'s savings vanished same night you found the Stone... coincidence? No — lesson!"'
    ],
    chapterRequirement: 1,
    weaknessStrategy: ['LONG_PUT', 'BEAR_PUT_SPREAD', 'CASH_SECURED_PUT'],
    resistanceStrategy: ['LONG_CALL']
  },
  2: {
    id: 'boss_chrono_sphinx',
    name: 'The Chrono-Sphinx',
    title: 'Devourer of Extrinsic Value - Keeper of Time River',
    type: 'CRAB',
    baseHp: 200,
    maxHp: 200,
    currentHp: 200,
    attackPower: 20,
    defense: 6,
    riskSensitivity: 1.4,
    marketAffinity: 'STAGNATION',
    specialMove: 'Temporal Acceleration - forces 5 DTE to vanish instantly! Theta siphon!',
    lore: 'Immortal Sphinx whose gaze ages derivatives. Long OTM lotto tickets perish before rolling. Riddle: "What does 0-DTE lottery truly cost?" Answer: patience + capital. Teaches calendar spreads, Theta as friend not foe when selling premium.',
    dialogue: [
      '"Tick... tock... sand drains. What has your OTM call earned today, Valen?"',
      '"Stagnation is my blade! River of Theta flows only in my favor — unless you sell premium!"',
      '"The gambler starves waiting for move. Disciplined trader earns while nothing happens."'
    ],
    chapterRequirement: 2,
    weaknessStrategy: ['CALENDAR_SPREAD', 'IRON_CONDOR', 'CASH_SECURED_PUT', 'COVERED_CALL'],
    resistanceStrategy: ['LONG_CALL', 'LONG_PUT']
  },
  3: {
    id: 'boss_crab_golem',
    name: 'Crab Golem of Sideways Range',
    title: 'Titan of Consolidation Channel - Iron Sanctuary Warden',
    type: 'CRAB',
    baseHp: 260,
    maxHp: 260,
    currentHp: 260,
    attackPower: 24,
    defense: 10,
    riskSensitivity: 1.5,
    marketAffinity: 'STAGNATION',
    specialMove: 'Iron Clamp - locks spot at $120 for 3 turns, suffocating directional bets, condors feast!',
    lore: 'Forged from granite and Bollinger Bands. Directional bulls/bears break swords on carapace, Iron Condor practitioners siphon life. Teaches: range trading, premium selling, defined-risk. Investor path: Covered Calls + Cash-Secured Puts = Buffett-style income while waiting.',
    dialogue: [
      '"You bet on breakout? Ha! I sit precisely on 50-day forever! Nothing happens is profit!"',
      '"Your calls decay. Puts decay. Only Iron Condor masters harm my shell!"',
      '"Buffett waits. Do you have patience to collect rent while market sleeps?"'
    ],
    chapterRequirement: 3,
    weaknessStrategy: ['IRON_CONDOR', 'CALENDAR_SPREAD', 'COVERED_CALL', 'CASH_SECURED_PUT'],
    resistanceStrategy: ['LONG_CALL', 'LONG_PUT', 'LONG_STRADDLE']
  },
  4: {
    id: 'boss_hydra_vega',
    name: 'Hydra of Implied Vega',
    title: 'Cataclysmic Earnings Beast - Caldera Sovereign',
    type: 'HYDRA',
    baseHp: 340,
    maxHp: 340,
    currentHp: 340,
    attackPower: 30,
    defense: 8,
    riskSensitivity: 1.8,
    marketAffinity: 'CHAOS',
    specialMove: 'Post-Earnings Vol Crush - slashes IV from 80% to 25% in single roar! Vega test!',
    lore: 'Monstrous dragon with heads of Uncertainty, Speculation, Greed. Inflates options before earnings exhale that vaporizes premium. Teaches: Vega, buying cheap IV when others fearful, selling euphoric IV. Buy shield when everyone else\'s is on fire.',
    dialogue: [
      '"Buy my overpriced 90% IV options, fool! When I exhale tomorrow, premium = ash!"',
      '"My volatility shifts like thunder! 5% move will not save bloated contract without spread!"',
      '"Have you hedged Vega with vertical? Or will shockwave consume soul?"'
    ],
    chapterRequirement: 4,
    weaknessStrategy: ['BULL_CALL_SPREAD', 'BEAR_PUT_SPREAD', 'IRON_CONDOR'],
    resistanceStrategy: ['LONG_CALL', 'LONG_PUT']
  },
  5: {
    id: 'boss_liquidation_lord',
    name: 'Liquidation Lord Marduk Vex',
    title: 'Fallen Oracle-Sage, Sovereign of Spectral Margin Call',
    type: 'REAPER',
    baseHp: 520,
    maxHp: 520,
    currentHp: 520,
    attackPower: 38,
    defense: 12,
    riskSensitivity: 2.2,
    marketAffinity: 'CRASH',
    specialMove: 'Forced Liquidation - damage = 40% margin utilization! Tests Kelly Criterion!',
    lore: 'Supreme arbiter of capital destruction. Once Master Oracle who taught margin of safety, one ruinous year of max leverage broke him. He rejected Graham for greed. True ending: you don\'t kill — you out-discipline. He confesses, sits as humble student. Richest investor = survival first, growth after safety. Teaches Kelly, position sizing, knowing when NO trade is best trade.',
    dialogue: [
      '"MARGIN CALL! Collateral forfeit! I once taught safety... then I sought 100x!"',
      '"You enter with 80% margin? Greed is executioner! I was you — I forgot Kelly!"',
      '"...wait. You... you have Graham protections? You survived my wicks? How?"',
      '"Rich is survival first... growth after safety... I... I remember now. Teach me again, Valen."'
    ],
    chapterRequirement: 5,
    weaknessStrategy: ['COVERED_CALL', 'CASH_SECURED_PUT', 'IRON_CONDOR', 'CALENDAR_SPREAD', 'BULL_CALL_SPREAD'],
    resistanceStrategy: []
  }
};

export const STORY_QUESTS: { [key: string]: QuestNode } = {
  'act1_intro': {
    id: 'act1_intro',
    title: 'Origin: The Oracle Stone Beneath Valuaria',
    locationName: 'Whispering Grove - Sanctum of Daen Alterspire',
    description: 'LOGLINE: Village orphan Valen finds Oracle\'s lost ledger - sacred instrument revealing true worth of all things - must master ancient arts of options across five fractured realms before Liquidation Lord\'s kingdom of unhedged greed swallows world. Not saving princess. Learning to invest. HOOK: Obsidian altar with floating amber runes, pulsing emerald core. Touching bonds Ledger glyph to soul: floating circle shows live prices, greeks, portfolio. THIS is wink at Bloomberg - as fantasy divination, not terminal. You have 10,000 Florins seed. Elder\'s savings rug-pulled same night.',
    optionsLesson: 'Lesson 1: Calls & Puts, Delta. Trader vs Investor path begins. Olmstead Chapter 1.',
    choices: [
      {
        text: 'Touch Oracle Stone - Bond Ledger to Soul (Investor Path +1)',
        outcomeText: 'Emerald core pulses! Glyph-circle floats beside you, showing $AETH 100 ƒ, IV 28%, Delta, Theta. You feel Graham\'s whisper: "Margin of Safety." Path: INVESTOR +2',
        action: (state) => {
          state.florins += 150;
          state.relics.push('Black-Scholes Slate');
          state.pathScores = { trader: 0, investor: 2 };
          state.currentPath = 'INVESTOR';
          state.oracleBondLevel = 1;
        },
        pathScore: { investor: 2 }
      },
      {
        text: 'Forge Spear of Bullish Light - Long Call (Trader Path)',
        costFlorins: 500,
        outcomeText: 'You cast Long Call 100 strike 30 DTE. Leveraged upside, defined loss. Trader path calls. If $AETH surges past 104, exponential profit!',
        action: (state) => {
          state.florins -= 500;
          state.pathScores.trader += 2;
          state.currentPath = 'TRADER';
        },
        marketImpact: { spotChangePercent: 0.02 },
        pathScore: { trader: 2 }
      },
      {
        text: 'Seek Sage Graham in Grove - Learn Value First (Hybrid)',
        outcomeText: 'Sage appears: "Before spear, learn shield. Before profit, learn safety." You gain Graham protection hint and 0.5 heart.',
        action: (state) => {
          state.mana = Math.min(state.maxMana, state.mana + 15);
          state.pathScores.investor += 1;
          state.pathScores.trader += 1;
          state.currentPath = 'HYBRID';
        },
        pathScore: { trader: 1, investor: 1 }
      }
    ]
  },
  'act1_event': {
    id: 'act1_event',
    title: 'The Elder\'s Rug-Pull & The Charm Monster',
    locationName: 'Grove Village - Night of Two Events',
    description: 'Elder\'s life savings rug-pulled by charm monster promising 10,000% APY. Same night you found Stone. Two events collide: quest born. Ponzi Alchemist SBF + $DogeTulip Goblin are crypto bait. Need to teach village difference investment vs speculation.',
    optionsLesson: 'Graham Chapter 1: Investment vs Speculation. Olmstead Calls/Puts.',
    choices: [
      {
        text: 'Expose Alchemist: Demand audited cash flows, tangible book (Investor)',
        outcomeText: 'You: "Where tangible cash flows originate?" Alchemist flees! Village saves remaining florins. You gain 300 ƒ bounty + Graham protection fomo_protection hint.',
        action: (state) => {
          state.florins += 300;
          state.potions.healthElixir += 1;
          state.scamsAvoided.push('ponzi_farm');
          state.pathScores.investor += 2;
        },
        pathScore: { investor: 2 }
      },
      {
        text: 'Challenge with Defined-Risk Spread - Show how to hedge (Trader)',
        outcomeText: 'You demonstrate Bull Call Spread vs naked lottery. Villagers learn defined risk. You gain trader respect + 200 ƒ.',
        action: (state) => {
          state.florins += 200;
          state.pathScores.trader += 2;
        },
        pathScore: { trader: 2 }
      }
    ]
  },
  'act2_event': {
    id: 'act2_event',
    title: 'Theta Steppes: What Does 0-DTE Lottery Truly Cost?',
    locationName: 'Dune of Vanishing Days - Chrono-Sphinx Riddle',
    description: 'Sorcerer: "Contract 60 days worth 10 ƒ, now 5 days barely moved worth 1 ƒ! Where gold vanish?" Answer: patience + capital. Theta decay non-linear, final 30-7 days hyper-speed. Buying short-dated OTM mathematically rigged for seller. Calendar spreads = sell near-term decay, buy long-term.',
    optionsLesson: 'Theta, Calendar Spreads. Olmstead Ch5. Graham: Mr Market patience.',
    choices: [
      {
        text: '"Theta consumed extrinsic as time ran out!" - Teach Calendar Spread (Hybrid)',
        outcomeText: 'Correct! "Time enemy to reckless buyer, faithful servant to spread trader!" Bestows Hourglass + Theta protection.',
        action: (state) => {
          state.potions.timeHourglass += 1;
          state.mana = Math.min(state.maxMana, state.mana + 20);
          state.grahamProtections.push('theta_protection');
          state.pathScores.trader += 1;
          state.pathScores.investor += 1;
        },
        pathScore: { trader: 1, investor: 1 }
      },
      {
        text: 'Answer: "Market maker stole gold!" (Fail -> Graham Sanctuary)',
        outcomeText: 'Sigh: "Blaming cabals for math?" Sandstorm -15 damage, but you learn via fail->Graham loop.',
        action: (state) => {
          state.hp -= 15;
          state.failedTrades.push({ id: 'theta_fail', reason: 'THETA_DECAY_CRUSH', strategy: 'LONG_CALL', lossFlorins: 100, day: state.day, lessonId: 'theta_protection' });
        }
      }
    ]
  },
  'act3_event': {
    id: 'act3_event',
    title: 'Iron Sanctuary: Nothing Happens Is Profit',
    locationName: 'Iron Gates of Consolidation - Rangebound',
    description: 'Merchants despair: $AETH trapped 118-124 weeks. Directional losing to commission+theta. "Is there no spell to profit when nothing moves?" Iron Condor: Sell OTM Call spread + OTM Put spread, collect credit, win as long as market sleeps. Covered Calls + Cash-Secured Puts = farmer income.',
    optionsLesson: 'Iron Condor, Covered Calls, Cash-Secured Puts. Olmstead Ch3-4,6. Margin of Safety.',
    choices: [
      {
        text: 'Teach Iron Condor + Covered Call harvest (Investor Path)',
        outcomeText: 'Merchants rejoice! "Bounded cage of four strikes! Collect credit, win when market sleeps!" Reward 500 ƒ + Condor Crest + investor path.',
        action: (state) => {
          state.florins += 500;
          state.relics.push('Condor Crest');
          state.pathScores.investor += 2;
        },
        pathScore: { investor: 2 }
      },
      {
        text: 'Teach Iron Condor as trader - aggressive but defined (Trader Path)',
        outcomeText: 'You show 45 DTE Iron Condor, 2x credit stop-loss discipline. Traders learn risk-defined income. + trader path.',
        action: (state) => {
          state.florins += 400;
          state.pathScores.trader += 2;
        },
        pathScore: { trader: 2 }
      }
    ]
  },
  'act4_event': {
    id: 'act4_event',
    title: 'Volatility Caldera: Buy Shield When Others Fire',
    locationName: 'Rim of Smoldering Caldera - Eve of Earnings',
    description: 'Tomorrow Quarterly Realm Earnings! IV 85%. Novices rushing buy 150-strike Calls exorbitant. IV Crush: buying high IV hazardous. Post-earnings IV plummets, crushing prices regardless direction. Need vertical spreads hedging Vega.',
    optionsLesson: 'Vega, IV Crush, Straddles. Olmstead Ch7.',
    choices: [
      {
        text: 'Warn about IV Crush, recommend credit spreads hedged (Investor)',
        outcomeText: 'Wise heed warning. Stock rises 2%, naked calls drop 40% due IV collapse! Acolytes gift IV Stabilizer + 250 ƒ.',
        action: (state) => {
          state.potions.ivStabilizer += 1;
          state.florins += 250;
          state.grahamProtections.push('vega_protection');
          state.pathScores.investor += 1;
        },
        pathScore: { investor: 1 }
      },
      {
        text: 'Deploy Long Straddle at low IV before event - trader vol play (Trader)',
        outcomeText: 'You buy cheap IV Straddle before pump, sell into euphoric 85% IV! Trader vol mastery + trader path.',
        action: (state) => {
          state.florins += 350;
          state.pathScores.trader += 2;
        },
        marketImpact: { ivChangePercent: -0.40 },
        pathScore: { trader: 2 }
      }
    ]
  },
  'act5_event': {
    id: 'act5_event',
    title: 'Citadel: Kelly Criterion & When NO Trade Is Best Trade',
    locationName: 'Citadel of Marduk Vex - Final Lesson',
    description: 'Spectral Inquisitor audits margin cushion. Marduk Vex fallen Oracle-Sage rejected margin of safety for max leverage. One ruinous year broke him. True end: out-discipline, not kill. Richest investor = survival first, growth after safety. Kelly: position sizing, knowing when NO trade.',
    optionsLesson: 'Kelly Criterion, Position Sizing, Capital Preservation. Graham Ch20.',
    choices: [
      {
        text: 'Demonstrate Kelly: 25% max per trade, survival first (Investor True End)',
        outcomeText: 'Inquisitor: "You understand! Rich = survival first!" Marduk Vex listens... remembers... He sits as humble student. True ending unlocked via investor discipline.',
        action: (state) => {
          state.positionSizeDiscipline = 100;
          state.kellyFraction = 0.25;
          state.grahamProtections.push('leverage_protection');
          state.pathScores.investor += 3;
        },
        pathScore: { investor: 3 }
      },
      {
        text: 'Demonstrate defined-risk trader path - aggressive but never naked (Trader True End)',
        outcomeText: 'You show portfolio of spreads/condors, max loss capped, Kelly sized. Vex: "You traded aggressively yet defined... you out-disciplined me." True ending via trader discipline.',
        action: (state) => {
          state.positionSizeDiscipline = 90;
          state.kellyFraction = 0.3;
          state.pathScores.trader += 3;
        },
        pathScore: { trader: 3 }
      }
    ]
  }
};
