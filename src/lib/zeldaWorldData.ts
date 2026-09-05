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

export const ZELDA_MAPS: { [act: number]: ZeldaMap } = {
  1: {
    act: 1,
    name: 'The Whispering Grove of Strikes',
    regionTitle: 'Act 1: Origin - Grove of Valen, Orphan Finds Oracle Stone',
    storyBeat: 'You are Valen, orphan of Grove. Village elder\'s life savings rug-pulled by charm monster same night you find Oracle\'s Stone in forgotten sanctum. Two events collide: quest born. MASTER: Calls & Puts, Delta.',
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
      'T....P~====~P.....PT',
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
        name: 'Sage Benjamin Graham',
        type: 'NPC_SAGE',
        x: 3,
        y: 2,
        sprite: 'SAGE',
        interactPrompt: 'Speak to Sage Graham [Margin of Safety - Origin]',
        lore: 'Warm, epic, patient and dry. Not cynical.',
        dialogue: [
          '"Greetings, Valen. Welcome to Valuaria! You found Daen Alterspire — obsidian altar with floating amber runes and pulsing emerald core."',
          '"Touching it bonded Oracle\'s Ledger to your soul: floating glyph-circle shows live prices, greeks, portfolio. This is wink at Bloomberg — as fantasy divination, not terminal."',
          '"Your HEARTS are life force. Sound trades replenish. Every 3 sound trades = Heart Container. But fail->learn is core: bad trade cracks hearts, pulls you to Sanctuary of Quiet Oracle."',
          '"You answer one Graham reflection question. Cannot leave until correct. Answering correctly permanently unlocks protection vs that mistake."',
          '"Beware charm monsters overpromising; Ponzi Alchemist SBF + $DogeTulip Goblin are crypto bait. Seek true Undervalued Assets with Margin of Safety!"',
          '"Multiple paths to same ending: trader-path (aggressive but defined-risk), investor-path (slow value-first), hybrid. True end same — crown of richest investor — reached by whichever discipline you practiced."'
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
        interactPrompt: 'Inspect Abandoned Mine [Deep Value $42→$78 - Investor Path]',
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
        x: 16,
        y: 2,
        sprite: 'CHEST',
        interactPrompt: 'Open Guild Treasury [400ƒ + Elixir + Heart]',
        lore: 'Contains Black-Scholes Slate relic'
      },
      {
        id: 'boss_bear',
        name: 'Grizzly Bear of Drawdowns',
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
    regionTitle: 'Act 2: Time - Chrono-Sphinx Froze River of Time',
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
      '#....P~====~P.....P#',
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
        name: 'Chrono-Sage Echo of Graham',
        type: 'NPC_SAGE',
        x: 3,
        y: 2,
        sprite: 'SAGE',
        interactPrompt: 'Consult Graham Echo [Time & Theta]',
        dialogue: [
          '"Here in Desert of Time, Theta decay accelerates! Final 30-7 days hyper-speed!"',
          '"Buying short-dated lottery calls = slow suicide. Intelligent investor sells premium or calendar spreads."',
          '"Riddle: What does 0-DTE lottery truly cost? Answer: patience + capital. Nothing happens is profit for disciplined trader."',
          '"Fail->Graham loop: bad trade cracks hearts → Sanctuary of Quiet Oracle → reflection question → permanent theta_protection."'
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
        x: 16,
        y: 2,
        sprite: 'CHEST',
        interactPrompt: 'Open Hourglass Chest [Time Manipulation Relic]'
      },
      {
        id: 'boss_sphinx',
        name: 'The Chrono-Sphinx',
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
    regionTitle: 'Act 3: Range - Crab Golem Clamped Realm in Iron Bands',
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
      '#....P~====~P.....P#',
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
        name: 'Bastion Sage - Graham of Range',
        type: 'NPC_SAGE',
        x: 3,
        y: 2,
        sprite: 'SAGE',
        interactPrompt: 'Bastion Sage [Nothing Happens Is Profit]',
        dialogue: [
          '"Welcome to Iron Sanctuary. Price locked $118-$124. Directional traders lose to commission+theta."',
          '"Is there no spell to profit when nothing moves? Yes — Iron Condor: Sell OTM Call spread + OTM Put spread, collect credit, win when market sleeps."',
          '"Covered Calls + Cash-Secured Puts = farmer income. Own wonderful business, harvest premium. Buffett-style."',
          '"Trader path: aggressive but defined-risk condors. Investor path: slow covered calls. Both valid. Same true end."'
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
        x: 16,
        y: 2,
        sprite: 'CHEST',
        interactPrompt: 'Open Bullion Chest [Value Investing Relic]'
      },
      {
        id: 'boss_crab',
        name: 'Crab Golem of Sideways Range',
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
    regionTitle: 'Act 4: Vol - Hydra of Implied Vega, Every Head Market Shock',
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
      '#....P~====~P.....P#',
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
        name: 'Volcano Sage - Vega Master',
        type: 'NPC_SAGE',
        x: 3,
        y: 2,
        sprite: 'SAGE',
        interactPrompt: 'Volcano Sage [Buy Shield When Others Fire]',
        dialogue: [
          '"Volatility Caldera: Hydra every head shock spitting IV crush."',
          '"Pre-earnings IV 80% pumps premiums, then collapses post-announcement even if direction correct. Naked long options lose."',
          '"MASTER: Vega, buying cheap IV when others fearful, selling euphoric IV when others greedy."',
          '"Vertical spreads hedge Vega: long vega hedged by short vega. Iron Condor neutralizes."',
          '"Fail->Graham: bad vol trade → Sanctuary → vega_protection permanent."'
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
        x: 16,
        y: 2,
        sprite: 'CHEST',
        interactPrompt: 'Open Fire Pearl Chest [Vol Mastery Relic]'
      },
      {
        id: 'boss_hydra',
        name: 'Hydra of Implied Vega',
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
    regionTitle: 'Act 5: Citadel - Liquidation Lord Marduk Vex, Fallen Oracle-Sage',
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
      '#....P~====~P.....P#',
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
        name: 'Sage Graham - Final Sanctuary',
        type: 'NPC_SAGE',
        x: 3,
        y: 2,
        sprite: 'SAGE',
        interactPrompt: 'Final Sage [Kelly + NO Trade - True Ending]',
        dialogue: [
          '"Final lesson, Valen: Marduk Vex was once Master Oracle like me. Taught margin of safety."',
          '"One ruinous year, he sought max leverage, rejected Graham. Broke. Became Liquidation Lord."',
          '"MASTER: capital preservation + Kelly Criterion / position sizing / knowing when NO trade is best trade."',
          '"TRUE ENDING: you don\'t kill him — you out-discipline him. He confesses, sits as humble student."',
          '"Richest investor is one who learned rich is survival first, growth after safety."',
          '"Multiple paths same destination: trader-path aggressive but defined-risk, investor-path slow value-first, hybrid. Whichever discipline you practiced, crown same."'
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
        x: 16,
        y: 2,
        sprite: 'CHEST',
        interactPrompt: 'Open Emperor Treasury [Final Relic + Crown]'
      },
      {
        id: 'boss_vex',
        name: 'Liquidation Lord Marduk Vex',
        type: 'BOSS',
        x: 14,
        y: 12,
        sprite: 'BOSS',
        interactPrompt: 'Confront Marduk Vex [Final Boss - True Ending Awaits]'
      }
    ]
  }
};
