export interface ZeldaEntity {
  id: string;
  name: string;
  type: 'NPC_SAGE' | 'NPC_BROKER' | 'NPC_SCAMMER' | 'NPC_ASSET' | 'BOSS' | 'CHEST' | 'SHRINE' | 'PORTAL';
  x: number;
  y: number;
  sprite: string;
  dialogue?: string[];
  interactPrompt: string;
  targetId?: string;
  lore?: string;
}

export interface ZeldaMap {
  act: number;
  name: string;
  regionTitle: string;
  storyBeat: string;
  masterLesson: string;
  width: number;
  height: number;
  tiles: string[];
  entities: ZeldaEntity[];
  playerSpawn: { x: number; y: number };
}

export interface PatrolRoute {
  id: string;
  name: string;
  /** Start position (tile coords, will be +0.5 centered). */
  x: number;
  y: number;
  /** Waypoints in tile coords; patrols loop through them. */
  waypoints: Array<{ x: number; y: number }>;
  /** Tiles per second. */
  speed: number;
  prompt: string;
}

export interface DungeonConfig {
  /** Raycaster maze rows. '#'/wall = solid, '.' = floor, 'o' = brazier (refuels torch), 'G' = spread gate (solid until opened). */
  tiles: string[];
  playerSpawn: { x: number; y: number };
  /** HUD label, e.g. 'ACT II · THE TWO CHAMBERS'. */
  actLabel: string;
  /** Torch light radius in world units. Default ~9 (fully lit). */
  lightRadius?: number;
  /** Torch fuel drain per second; 0/undefined = no light mechanic. */
  torchDrainPerSec?: number;
  /** Moving scammer NPCs; seen = forced bad trade. */
  patrols?: PatrolRoute[];
  /** True when the act uses spread-gates ('G' tiles). */
  hasSpreadGates?: boolean;
}

export const ZELDA_MAPS: { [act: number]: ZeldaMap } = {
  1: {
    act: 1,
    name: 'The Whispering Grove of Strikes',
    regionTitle: 'Act 1: The Ashen Acre - The Field That Cannot Be Planted',
    storyBeat: 'You are Rowan Vale of Bramble Acre. The Great Rug-Pull took your family\'s seed fund — the Red Herring\'s golden token vanished overnight. The village storehouse stands empty. A sealed letter from the Crown of the Richest Investor promises a charter that can restore the common seed stores, but only its bearer can activate it. Walk. Learn. Return. — same night you find Oracle\'s Stone in forgotten sanctum. Two events collide: quest born. MASTER: Calls & Puts, Delta.',
    masterLesson: 'Calls & Puts, Delta, Direction. Olmstead Ch1. Investment vs Speculation.',
    width: 20,
    height: 14,
    tiles: [
      'TTTTTTTTTTTTTTTTTTTT',
      'T....P....TT...TT..T',
      'T.F..P..F.TT.D.TT..T',
      'T....P....TT...TT..T',
      'TPPPPPPPPPPPPPPPPPPT',
      'T....P~~~~~~~.....PT',
      'T....P======P....PT',
      'TT.T.P~~~~~~~P....PT',
      'T....PPPPPPPPP....PT',
      'T.F......T........PT',
      'T........T..F.....PT',
      'T..D.....T........PT',
      'T........T....D...PT',
      'TTTTTTTTTTTTTTTTTTTT'
    ],
    playerSpawn: { x: 5, y: 4 },
    entities: [
      {
        id: 'sage_graham',
        name: 'Bram Ashfall — Keeper of the Storehouse',
        type: 'NPC_SAGE',
        x: 3,
        y: 2,
        sprite: 'SAGE',
        interactPrompt: 'Speak to Bram Ashfall [The Keeper of the Storehouse]',
        lore: 'Warm, epic, patient and dry. Not cynical.',
        dialogue: [
          '"Rowan Vale. So the letter found you after all. Come in, come in — you are standing in the Sanctum of Daen Alterspire, though the villagers just call it the shrine."',
          '"The stone you touched is older than any of us. It bonded the Oracle\'s Ledger to your soul — see how the glyph-circle hovers at your shoulder? It shows what things are truly worth: live prices, the greeks, all of it. Merchants in the capital would trade a kingdom for what you now carry for free."',
          '"Listen well. Your hearts are your life force, and sound trades will refill them — every third disciplined trade earns you a new heart container. But hear the harder truth: a bad trade cracks a heart, and the Oracle will pull you to the Sanctuary of the Quiet Oracle to learn from it. Failure here is not the end. It is the lesson."',
          '"When you fall, the Sanctuary will ask you one question from the Book of Graham. You cannot leave until you answer it truly — and once you do, that protection is yours for the rest of your days. No mistake can claim you twice."',
          '"Two warnings before you walk. First: charm monsters haunt these roads, promising ten thousand percent a year — the Ponzi Alchemist and his $DogeTulip Goblin are bait, nothing more. Second: real treasure hides in what others overlook. Seek undervalued assets, and never buy without a margin of safety."',
          '"One last thing, and then I will let you go. There are many roads up this mountain — the quick blade of the trader, the slow plough of the investor, or a path that walks between them. They all end at the same crown: the Crown of the Richest Investor. Whichever discipline you truly practice will carry you there."'
        ]
      },
      {
        id: 'broker_lyra',
        name: 'Oracle Ledger Glyph',
        type: 'NPC_BROKER',
        x: 8,
        y: 2,
        sprite: 'BROKER',
        interactPrompt: 'Touch Oracle Stone • Open Ledger [Trade Options]',
        lore: 'Enchanted Oracle Circle, not terminal, not CRT. Carved runes, gem facets, glowing sigils on dark stone. Amber/oil-light.',
        dialogue: [
          '"◈ Oracle Sight active ◈ $AETH 100 ƒ • IV 28% • Delta • Theta • Vega"',
          '"Choose your rune: Spear of Bullish Light (Long Call) or Shield of Bearish Warding (Long Put). Olmstead Chapter 1."',
          '"Investor path: buy wonderful business at discount, sell covered calls. Trader path: aggressive but defined-risk spreads. Both converge to same crown."'
        ]
      },
      {
        id: 'scam_shiller',
        name: 'Ponzi Alchemist SBF',
        type: 'NPC_SCAMMER',
        x: 14,
        y: 6,
        sprite: 'SCAMMER',
        interactPrompt: 'Approach Hooded Alchemist [10,000% APY - Charm Monster]',
        targetId: 'ponzi_farm',
        lore: 'Charm monster overpromises'
      },
      {
        id: 'scam_goblin',
        name: 'Telegram $DogeTulip Goblin',
        type: 'NPC_SCAMMER',
        x: 10,
        y: 10,
        sprite: 'SCAMMER',
        interactPrompt: 'Talk to Whispering Goblin [$DogeTulip Rocket - Bait]',
        targetId: 'crypto_meme_pump',
        lore: 'Crypto = bait, teaches investment vs speculation'
      },
      {
        id: 'scam_theta',
        name: 'Chrono Gambler - Lottery Seller',
        type: 'NPC_SCAMMER',
        x: 12,
        y: 3,
        sprite: 'SCAMMER',
        interactPrompt: 'Chrono Gambler [0-DTE Lottery - Theta Trap]',
        targetId: 'theta_lottery_trap'
      },
      {
        id: 'undervalued_mine',
        name: 'Deed to Sunken Silver Mine - Deep Value',
        type: 'NPC_ASSET',
        x: 3,
        y: 11,
        sprite: 'ASSET',
        interactPrompt: 'Inspect Abandoned Mine [Deeds & assay reports lie in the moss]',
        targetId: 'silver_mine',
        lore: 'Margin of Safety 46%, IV 18% cheap'
      },
      {
        id: 'shrine_save_act1',
        name: 'Daen Alterspire - Obsidian Altar Shrine',
        type: 'SHRINE',
        x: 2,
        y: 6,
        sprite: 'SHRINE',
        interactPrompt: 'Pray at Daen Alterspire [Save + Oracle Bond +1]',
        lore: 'Carved obsidian altar with floating amber runes, pulsing emerald core. Saves game.'
      },
      {
        id: 'chest_heart',
        name: 'Ancient Treasury Chest',
        type: 'CHEST',
        x: 17,
        y: 2,
        sprite: 'CHEST',
        interactPrompt: 'Open Guild Treasury [400ƒ + Elixir + Heart]',
        lore: 'Contains Black-Scholes Slate relic'
      },
      {
        id: 'dungeon_gate_act1',
        name: 'Dungeon Entrance — The Sealed Vestibule',
        type: 'PORTAL',
        x: 13,
        y: 2,
        sprite: 'PORTAL',
        interactPrompt: 'DESCEND into The Sealed Vestibule [Act 1 Dungeon]',
        lore: 'Stone stair spiraling down beneath the grove. Torchlight dances below.'
      },
      {
        id: 'boss_bear',
        name: 'The Tithe-Monger — Collector of the Harvest',
        type: 'BOSS',
        x: 14,
        y: 12,
        sprite: 'BOSS',
        interactPrompt: 'Engage Guardian Beast [Boss 1 - Bear Phantom]',
        lore: 'Harbinger of 20% Drawdown. Teaches panic selling vs margin of safety.'
      }
    ]
  },
  2: {
    act: 2,
    name: 'The Theta Steppes of Decay',
    regionTitle: 'Act 2: The Glassmarket - The Mirror Merchant Froze the River of Time',
    storyBeat: 'Chrono-Sphinx froze river of time; options rot to nothingness. MASTER: Theta decay, calendar spreads. Riddle: "What does 0-DTE lottery call truly cost you?" Answer: patience + capital.',
    masterLesson: 'Theta, Calendar Spreads. Olmstead Ch5. Mr Market patience.',
    width: 20,
    height: 14,
    tiles: [
      '####################',
      '#....P....##...##..#',
      '#....P....##.D.##..#',
      '#....P....##...##..#',
      '#PPPPPPPPPPPPPPPPPP#',
      '#....P~~~~~~~.....P#',
      '#....P======P....P#',
      '##.#.P~~~~~~~P....P#',
      '#....PPPPPPPPP....P#',
      '#........#........P#',
      '#........#........P#',
      '#..D.....#........P#',
      '#........#....D...P#',
      '####################'
    ],
    playerSpawn: { x: 5, y: 4 },
    entities: [
      {
        id: 'sage_graham_2',
        name: 'Mira Vey — Signal-Warden of the Pass',
        type: 'NPC_SAGE',
        x: 3,
        y: 2,
        sprite: 'SAGE',
        interactPrompt: 'Consult Graham Echo [Time & Theta]',
        dialogue: [
          '"Welcome to the Theta Steppes, traveler. Out here, time itself decays — watch how an option\'s price speeds up as its final week becomes its final days."',
          '"Buying short-dated lottery calls is slow suicide on this sand. The patient either sell premium for income, or build calendar spreads and let the far leg ride."',
          '"I will leave you with the river\'s riddle: what does a zero-day lottery ticket truly cost you? The answer is patience and capital — for the disciplined, nothing happening is itself profit."',
          '"And should a bad trade crack your heart, do not despair: the Sanctuary of the Quiet Oracle will teach you, and its protection against time\'s decay will never leave you."'
        ]
      },
      {
        id: 'broker_act2',
        name: 'Oasis Oracle Circle',
        type: 'NPC_BROKER',
        x: 8,
        y: 2,
        sprite: 'BROKER',
        interactPrompt: 'Enter Oasis Oracle Ledger [Calendar Spreads]',
        dialogue: [
          '"Spot $AETH 112 ƒ steady. Time decay eating buyers alive! Sell premium!"',
          '"Calendar: Sell near-term decay, buy long-term. Time is ally if you sell it."',
          '"Investor path: cash-secured puts collecting rent while waiting. Trader path: calendar spreads harvesting theta."'
        ]
      },
      {
        id: 'scam_leverage',
        name: 'Shadow Margin Lord - Disciple of Vex',
        type: 'NPC_SCAMMER',
        x: 14,
        y: 6,
        sprite: 'SCAMMER',
        interactPrompt: 'Shadow Broker [100x Turbo Leverage - Kelly Test]',
        targetId: 'turbo_leverage_vault'
      },
      {
        id: 'scam_theta2',
        name: 'Vol Siren - IV Honeypot',
        type: 'NPC_SCAMMER',
        x: 15,
        y: 9,
        sprite: 'SCAMMER',
        interactPrompt: 'Volatility Siren [85% IV Honeypot]',
        targetId: 'iv_crush_honeypot'
      },
      {
        id: 'undervalued_grain',
        name: 'Royal Granary & Grain Mill - Value',
        type: 'NPC_ASSET',
        x: 3,
        y: 11,
        sprite: 'ASSET',
        interactPrompt: 'Inspect Granary [Undervalued $28→$65 - Time Teaches Patience]',
        targetId: 'grain_silo'
      },
      {
        id: 'shrine_save_act2',
        name: 'Oasis Save Shrine - Chrono Obelisk',
        type: 'SHRINE',
        x: 2,
        y: 6,
        sprite: 'SHRINE',
        interactPrompt: 'Pray at Chrono-Obelisk [Save + Theta Lesson]'
      },
      {
        id: 'chest_act2',
        name: 'Hourglass Relic Chest',
        type: 'CHEST',
        x: 17,
        y: 2,
        sprite: 'CHEST',
        interactPrompt: 'Open Hourglass Chest [Time Manipulation Relic]'
      },
      {
        id: 'dungeon_gate_act2',
        name: 'Dungeon Entrance — The Two Chambers',
        type: 'PORTAL',
        x: 13,
        y: 2,
        sprite: 'PORTAL',
        interactPrompt: 'DESCEND into The Two Chambers [Act 2 Dungeon — Spread Gates]',
        lore: 'A vault sealed by twin sigil-doors: only a combined vertical spread opens them.'
      },
      {
        id: 'boss_sphinx',
        name: 'The Mirror Merchant — Who Changes Value When You Look Away',
        type: 'BOSS',
        x: 14,
        y: 12,
        sprite: 'BOSS',
        interactPrompt: 'Challenge Chrono-Sphinx [Boss 2 - Time Devourer]'
      }
    ]
  },
  3: {
    act: 3,
    name: 'The Iron Sanctuary of Neutrality',
    regionTitle: 'Act 3: The Windglass Pass - The Two-Faced Wyvern Clamped the Realm in Iron Bands',
    storyBeat: 'Crab Golem clamped realm in iron bands; price can\'t break out. MASTER: Iron Condors, selling premium, defined-risk range plays. Lesson: "nothing happens" is profit. Disciplined trader earns while gambler starves.',
    masterLesson: 'Iron Condors, Cash-Secured Puts, Covered Calls. Olmstead Ch3-4,6. Margin of Safety.',
    width: 20,
    height: 14,
    tiles: [
      '####################',
      '#....P....##...##..#',
      '#....P....##.D.##..#',
      '#....P....##...##..#',
      '#PPPPPPPPPPPPPPPPPP#',
      '#....P~~~~~~~.....P#',
      '#....P======P....P#',
      '##.#.P~~~~~~~P....P#',
      '#....PPPPPPPPP....P#',
      '#........#........P#',
      '#........#........P#',
      '#..D.....#........P#',
      '#........#....D...P#',
      '####################'
    ],
    playerSpawn: { x: 5, y: 4 },
    entities: [
      {
        id: 'sage_graham_3',
        name: 'Oren Olm — Surveyor of Longacre',
        type: 'NPC_SAGE',
        x: 3,
        y: 2,
        sprite: 'SAGE',
        interactPrompt: 'Bastion Sage [Nothing Happens Is Profit]',
        dialogue: [
          '"Welcome to the Iron Sanctuary, surveyor. The fortress has clamped the price between $118 and $124 — every directional trader down here bleeds commissions and theta."',
          '"You ask whether any spell profits when nothing moves. There is: the Iron Condor. Sell an out-of-the-money call spread and an out-of-the-money put spread, collect the credit, and win while the market sleeps."',
          '"The farmer\'s way works the same fields: covered calls and cash-secured puts are rent collected from a business you are proud to own."',
          '"The condor is the quicker blade and the covered call the slower plough — both are disciplined, and both lead to the same crown."'
        ]
      },
      {
        id: 'shrine_save_act3',
        name: 'Bastion Altar - Iron Condor Shrine',
        type: 'SHRINE',
        x: 2,
        y: 6,
        sprite: 'SHRINE',
        interactPrompt: 'Pray at Bastion Altar [Save + Condor Scrolls]'
      },
      {
        id: 'broker_act3',
        name: 'Fortress Vault Oracle Ledger',
        type: 'NPC_BROKER',
        x: 8,
        y: 2,
        sprite: 'BROKER',
        interactPrompt: 'Trade Iron Condor Spreads [Range Mastery]',
        dialogue: [
          '"Market locked tightly $118-$124. Iron Condors reign supreme!"',
          '"Four-legged fortress: Sell 116 Put / Buy 112 Put & Sell 126 Call / Buy 130 Call. Net credit upfront."',
          '"Set stop at 2x credit. Discipline = survival."'
        ]
      },
      {
        id: 'undervalued_bridge',
        name: 'Toll Bridge Utility - Moat Asset',
        type: 'NPC_ASSET',
        x: 3,
        y: 11,
        sprite: 'ASSET',
        interactPrompt: 'Inspect Toll Bridge [Moat $50→$95 - Iron Sanctuary Lesson]',
        targetId: 'toll_bridge'
      },
      {
        id: 'scam_range',
        name: 'Range Gambler - Breakout Chaser',
        type: 'NPC_SCAMMER',
        x: 14,
        y: 6,
        sprite: 'SCAMMER',
        interactPrompt: 'Range Gambler [Chasing Breakouts - Fail Loop]',
        targetId: 'theta_lottery_trap'
      },
      {
        id: 'chest_act3',
        name: 'Gold Bullion + Covered Call Deed',
        type: 'CHEST',
        x: 17,
        y: 2,
        sprite: 'CHEST',
        interactPrompt: 'Open Bullion Chest [Value Investing Relic]'
      },
      {
        id: 'dungeon_gate_act3',
        name: 'Dungeon Entrance — The Iron Halls',
        type: 'PORTAL',
        x: 13,
        y: 2,
        sprite: 'PORTAL',
        interactPrompt: 'DESCEND into The Iron Halls [Act 3 Dungeon — Patrolling Scammers]',
        lore: 'Open halls where breakout-chasers walk their rounds. Approach unseen, or be seen.'
      },
      {
        id: 'boss_crab',
        name: 'The Two-Faced Wyvern — One Head Promises, One Head Collects',
        type: 'BOSS',
        x: 14,
        y: 12,
        sprite: 'BOSS',
        interactPrompt: 'Confront Crab Golem [Boss 3 - Range Titan]'
      }
    ]
  },
  4: {
    act: 4,
    name: 'The Volatility Caldera',
    regionTitle: 'Act 4: The Longacre Vale - The Hydra of Implied Vega, Every Head a Market Shock',
    storyBeat: 'Hydra of Implied Vega - every head market shock spitting IV crush. MASTER: Vega, buying cheap IV, selling euphoric IV. Buy shield when everyone else fire.',
    masterLesson: 'Vega, Long Straddle, IV Crush. Olmstead Ch7. Be fearful when others greedy.',
    width: 20,
    height: 14,
    tiles: [
      '####################',
      '#....P....##...##..#',
      '#....P....##.D.##..#',
      '#....P....##...##..#',
      '#PPPPPPPPPPPPPPPPPP#',
      '#....P~~~~~~~.....P#',
      '#....P======P....P#',
      '##.#.P~~~~~~~P....P#',
      '#....PPPPPPPPP....P#',
      '#........#........P#',
      '#........#........P#',
      '#..D.....#........P#',
      '#........#....D...P#',
      '####################'
    ],
    playerSpawn: { x: 5, y: 4 },
    entities: [
      {
        id: 'sage_graham_4',
        name: 'Mira Vey — Caldera Aspect',
        type: 'NPC_SAGE',
        x: 3,
        y: 2,
        sprite: 'SAGE',
        interactPrompt: 'Volcano Sage [Buy Shield When Others Fire]',
        dialogue: [
          '"Mind your footing — this is the Volatility Caldera, and every head of the Hydra spits a fresh shock of implied volatility."',
          '"Before earnings, implied volatility can climb to eighty percent and pump every premium fat. When the announcement lands, it collapses — even if you called the direction rightly, a naked long option dies in your hands."',
          '"The lesson of this mountain: buy volatility when others are fearful and it is cheap; sell it when others are euphoric and it is rich."',
          '"And hedge what you cannot avoid — a vertical spread balances the vega you buy against the vega you sell, and the Iron Condor neutralizes the beast entirely."',
          '"If a volatile trade burns you anyway, the Sanctuary will make the protection permanent. Fear is a teacher here, not an executioner."'
        ]
      },
      {
        id: 'broker_act4',
        name: 'Magma Oracle Circle',
        type: 'NPC_BROKER',
        x: 8,
        y: 2,
        sprite: 'BROKER',
        interactPrompt: 'Magma Oracle Ledger [Volatility Trading]',
        dialogue: [
          '"IV 65% elevated! Hydra roaring!"',
          '"Long Straddle: Long ATM Call + Put, delta neutral, long gamma, long vega. Gains from explosive moves either way."',
          '"But only buy when IV cheap (15%). Sell when euphoric (80%)."'
        ]
      },
      {
        id: 'scam_vol',
        name: 'Volatility Siren',
        type: 'NPC_SCAMMER',
        x: 14,
        y: 6,
        sprite: 'SCAMMER',
        interactPrompt: 'Vol Siren [85% IV Honeypot - Vega Trap]',
        targetId: 'iv_crush_honeypot'
      },
      {
        id: 'undervalued_vol',
        name: 'Volcanic Obsidian Options Shrine',
        type: 'NPC_ASSET',
        x: 3,
        y: 11,
        sprite: 'ASSET',
        interactPrompt: 'Inspect Obsidian Shrine [Vol Mastery $135→$180]',
        targetId: 'vol_shrine'
      },
      {
        id: 'shrine_save_act4',
        name: 'Volcanic Rune Shrine',
        type: 'SHRINE',
        x: 2,
        y: 6,
        sprite: 'SHRINE',
        interactPrompt: 'Pray at Volcanic Shrine [Save + Vega Lesson]'
      },
      {
        id: 'chest_act4',
        name: 'Fire Pearl of Delta + Straddle Rune',
        type: 'CHEST',
        x: 17,
        y: 2,
        sprite: 'CHEST',
        interactPrompt: 'Open Fire Pearl Chest [Vol Mastery Relic]'
      },
      {
        id: 'dungeon_gate_act4',
        name: 'Dungeon Entrance — The Lightless Vaults',
        type: 'PORTAL',
        x: 13,
        y: 2,
        sprite: 'PORTAL',
        interactPrompt: 'DESCEND into The Lightless Vaults [Act 4 Dungeon — Torch Light]',
        lore: 'The Hydra\'s breath swallowed every flame. Your torch is your only light — and it burns down.'
      },
      {
        id: 'boss_hydra',
        name: 'The Vacant Manor — The Estate That Grows When You Borrow',
        type: 'BOSS',
        x: 14,
        y: 12,
        sprite: 'BOSS',
        interactPrompt: 'Challenge Hydra [Boss 4 - Volatility Dragon]'
      }
    ]
  },
  5: {
    act: 5,
    name: 'The Citadel of Marduk Vex',
    regionTitle: 'Act 5: The Shatterchain - Citadel of the Red Herring, Marduk Vex the Fallen Oracle-Sage',
    storyBeat: 'Liquidation Lord Marduk Vex, fallen Oracle-Sage who rejected margin of safety for max leverage. MASTER: capital preservation + Kelly / position sizing / when NO trade. TRUE END: you don\'t kill — you out-discipline. He confesses he once valued margin of safety, one ruinous year broke him. Sits as humble student. Richest investor = survival first, growth after safety.',
    masterLesson: 'Kelly Criterion, Position Sizing, NO trade. Graham Ch20. Olmstead Final. True Ending.',
    width: 20,
    height: 14,
    tiles: [
      '####################',
      '#....P....##...##..#',
      '#....P....##.D.##..#',
      '#....P....##...##..#',
      '#PPPPPPPPPPPPPPPPPP#',
      '#....P~~~~~~~.....P#',
      '#....P======P....P#',
      '##.#.P~~~~~~~P....P#',
      '#....PPPPPPPPP....P#',
      '#........#........P#',
      '#........#........P#',
      '#..D.....#........P#',
      '#........#....D...P#',
      '####################'
    ],
    playerSpawn: { x: 5, y: 4 },
    entities: [
      {
        id: 'sage_graham_final',
        name: 'Bram Ashfall — Final Sanctuary',
        type: 'NPC_SAGE',
        x: 3,
        y: 2,
        sprite: 'SAGE',
        interactPrompt: 'Final Sage [Kelly + NO Trade - True Ending]',
        dialogue: [
          '"Come close, Rowan, for this is my final lesson. Marduk Vex was once a Master Oracle, as I am — and in his day, no one taught the margin of safety better than he did."',
          '"Then came one ruinous year. He reached for maximum leverage, cast Graham\'s teachings aside, and the market broke him. What crawled out of that ruin calls itself the Liquidation Lord."',
          '"So master what he forgot: preserve capital first. Let the Kelly Criterion size every position, and know that sometimes the best trade you will ever make is no trade at all."',
          '"And know this of your ending with him: you will not kill Marduk Vex. You will out-discipline him — and when he confesses what he lost, he will sit as a humble student at your feet."',
          '"The richest investor in Valuaria is simply the one who learned that being rich means surviving first and growing only after safety."',
          '"However you have walked — the trader\'s quick blade, the investor\'s slow plough, or both in hand — every disciplined road ends at the same crown."'
        ]
      },
      {
        id: 'broker_act5',
        name: 'Grand Sovereign Oracle Ledger',
        type: 'NPC_BROKER',
        x: 8,
        y: 2,
        sprite: 'BROKER',
        interactPrompt: 'Grand Oracle Ledger [Final Mastery - Kelly]',
        dialogue: [
          '"Final desk: $AETH 150 ƒ, IV 50%. Kelly says max 25% per trade."',
          '"Know when NO trade: if no margin of safety, no edge, stay cash. Survival first."',
          '"Your path: TRADER / INVESTOR / HYBRID — all converge to crown if disciplined."'
        ]
      },
      {
        id: 'inquisitor',
        name: 'Spectral Inquisitor of Sizing',
        type: 'NPC_SCAMMER',
        x: 14,
        y: 6,
        sprite: 'SCAMMER',
        interactPrompt: 'Spectral Inquisitor [Audits Margin Cushion + Kelly]',
        targetId: 'turbo_leverage_vault'
      },
      {
        id: 'shrine_save_act5',
        name: 'Apex Sanctuary - Kelly Shrine',
        type: 'SHRINE',
        x: 2,
        y: 6,
        sprite: 'SHRINE',
        interactPrompt: 'Pray at Apex Sanctuary [Save + Kelly Lesson + True End]'
      },
      {
        id: 'chest_act5',
        name: "Emperor's Treasury + Graham Crown",
        type: 'CHEST',
        x: 17,
        y: 2,
        sprite: 'CHEST',
        interactPrompt: 'Open Emperor Treasury [Final Relic + Crown]'
      },
      {
        id: 'dungeon_gate_act5',
        name: 'Dungeon Entrance — The Gauntlet of Discipline',
        type: 'PORTAL',
        x: 13,
        y: 2,
        sprite: 'PORTAL',
        interactPrompt: 'DESCEND into The Gauntlet of Discipline [Act 5 Dungeon — Boss Marathon]',
        lore: 'Every lord you defeated waits again, in sequence, with no sanctuary between. Only then Vex.'
      },
      {
        id: 'boss_vex',
        name: 'THE RED HERRING — Marduk Vex, the Fallen Oracle-Sage',
        type: 'BOSS',
        x: 14,
        y: 12,
        sprite: 'BOSS',
        interactPrompt: 'Confront Marduk Vex [Final Boss - True Ending Awaits]'
      }
    ]
  }
};

/**
 * Per-act DUNGEON layer (raycaster mazes beneath the overworld).
 * Act I: The Sealed Vestibule — the original 19x17 teaching dungeon.
 * Act II: The Two Chambers — two halves joined by spread-gates ('G'): place
 *         BOTH legs of a vertical spread at the leg shrines to key the doors.
 * Act III: The Iron Halls — open halls patrolled by scammer NPCs; getting
 *          SEEN forces a bad trade (approach from behind = safe).
 * Act IV: The Lightless Vaults — torch burns down (lightRadius shrinks);
 *          braziers ('o') refuel; deeper darkness guards better chests.
 * Act V: The Gauntlet of Discipline — spiral corridor; act bosses rematch in
 *        sequence before Vex, no sanctuary between.
 * All mazes BFS-validated fully connected (Act II once gates open).
 */
export const DUNGEONS: { [act: number]: DungeonConfig } = {
  1: {
    tiles: [
      '###################',
      '#.......C.#.......#',
      '#######.#.#.###.###',
      '#.....#.#.#...#...#',
      '#..####.#.#.#.#.#.#',
      '#.......#...#.#...#',
      '#.#.#.###.###.#.#.#',
      '#...#...#...#.#.#.#',
      '#..####.###.#.#.###',
      '#.....#.......#...#',
      '#####.####.######.#',
      '#.......#.......#.#',
      '#.#.###.#.#####.#.#',
      '#.#...#...#.....#.#',
      '#.###.#####.###.#.#',
      '#...#.............#',
      '###################',
    ],
    playerSpawn: { x: 2, y: 4 },
    actLabel: 'ACT I · THE SEALED VESTIBULE',
  },
  2: {
    tiles: [
      '###################',
      '#........#........#',
      '#.o..##..#..##..o.#',
      '#....#...G...#....#',
      '#.##.#...G...#.##.#',
      '#....#.#####.#....#',
      '#.o..G.#.#.#.G..o.#',
      '#....#.#.#.#.#....#',
      '#.####.#.#.#.####.#',
      '#......#.#.#......#',
      '#.o##..#.#.#..##o.#',
      '#....#...#...#....#',
      '#.##.#.#####.#.##.#',
      '#.o..#...#...#..o.#',
      '###################',
    ],
    playerSpawn: { x: 2, y: 1 },
    actLabel: 'ACT II · THE TWO CHAMBERS — SPREAD GATES',
    hasSpreadGates: true,
  },
  3: {
    tiles: [
      '###################',
      '#.................#',
      '#..##..####..##...#',
      '#.................#',
      '#...####....####..#',
      '#.................#',
      '#..##...o....##...#',
      '#.................#',
      '#...####....####..#',
      '#.................#',
      '#..##...o....##...#',
      '#.................#',
      '#...####....####..#',
      '#.................#',
      '###################',
    ],
    playerSpawn: { x: 2, y: 1 },
    actLabel: 'ACT III · THE IRON HALLS — AVOID THE PATROLS',
    patrols: [
      {
        id: 'patrol_chaser_east',
        name: 'Breakout Chaser (East Round)',
        x: 2, y: 3,
        waypoints: [{ x: 2, y: 3 }, { x: 16, y: 3 }],
        speed: 1.6,
        prompt: 'Avoid his gaze — if he SEES you, he forces a bad trade',
      },
      {
        id: 'patrol_chaser_west',
        name: 'Breakout Chaser (West Round)',
        x: 16, y: 5,
        waypoints: [{ x: 16, y: 5 }, { x: 2, y: 5 }],
        speed: 1.9,
        prompt: 'Approach from behind to stay safe',
      },
      {
        id: 'patrol_chager_center',
        name: 'Range Gambler (Center Round)',
        x: 9, y: 7,
        waypoints: [{ x: 9, y: 7 }, { x: 2, y: 7 }, { x: 9, y: 7 }, { x: 16, y: 7 }],
        speed: 1.3,
        prompt: 'He walks the Iron Halls seeking exit liquidity',
      },
    ],
  },
  4: {
    tiles: [
      '###################',
      '#...#.........#...#',
      '#.#.#.#######.#.#.#',
      '#.#...#..o..#...#.#',
      '#.#####.###.#####.#',
      '#...o.....#.....o.#',
      '###.#####.#####.###',
      '#...#...#.#...#...#',
      '#.#.#.#.#.#.#.#.#.#',
      '#.#...#.....#...#.#',
      '#.#####.###.#####.#',
      '#...o.....#.....o.#',
      '###.#####.#####.###',
      '#.................#',
      '###################',
    ],
    playerSpawn: { x: 2, y: 13 },
    actLabel: 'ACT IV · THE LIGHTLESS VAULTS — MANAGE YOUR TORCH',
    lightRadius: 2.6,
    torchDrainPerSec: 0.014,
  },
  5: {
    tiles: [
      '###################',
      '#.................#',
      '#.###############.#',
      '#.#.............#.#',
      '#.#.###########.#.#',
      '#.#.#.........#.#.#',
      '#.#.#.#######.#.#.#',
      '#.....#.....#.....#',
      '#.###.#.###.#.###.#',
      '#.#...#..o..#...#.#',
      '#.#.#####.#####.#.#',
      '#.#.............#.#',
      '#.###############.#',
      '#.................#',
      '###################',
    ],
    playerSpawn: { x: 2, y: 1 },
    actLabel: 'ACT V · THE GAUNTLET OF DISCIPLINE',
  },
};
