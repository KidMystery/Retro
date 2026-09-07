export type DOSTheme = 'green' | 'amber' | 'vga' | 'cyber' | 'snes';

export type TunicColor = 'green' | 'blue' | 'red' | 'purple' | 'black';
export type HairColor = 'blonde' | 'brown' | 'black' | 'white';

export interface AvatarConfig {
  tunicColor: TunicColor;
  hairColor: HairColor;
  shieldStyle: 'wooden' | 'hylian' | 'mirror';
  avatarTitle: string;
}

export interface SaveSlotData {
  id: string;
  slotNumber: number;
  saveName: string;
  savedAt: string;
  locationName: string;
  player: PlayerStats;
  positions: OptionContract[];
  assetQuote: AssetQuote;
  terminalLog: string[];
}

export type ContractType = 'CALL' | 'PUT';

// Olmstead progression - each strategy = chapter unlock
export type StrategyType = 
  | 'LONG_CALL'
  | 'LONG_PUT'
  | 'BULL_CALL_SPREAD'
  | 'BEAR_PUT_SPREAD'
  | 'CASH_SECURED_PUT'
  | 'COVERED_CALL'
  | 'CALENDAR_SPREAD'
  | 'IRON_CONDOR'
  | 'LONG_STRADDLE';

export interface OptionContract {
  id: string;
  symbol: string;
  type: ContractType;
  strike: number;
  dte: number;
  premium: number;
  entryPrice: number;
  quantity: number;
  strategy: StrategyType;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  // Enhanced tracking
  entrySpot?: number;
  entryIv?: number;
  isProtectedByGraham?: boolean;
}

export interface AssetQuote {
  symbol: string;
  name: string;
  spotPrice: number;
  previousClose: number;
  iv: number;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'VOLATILE';
  lore: string;
}

// New: Graham protections - permanent unlocks after failing then learning
export type GrahamProtectionId =
  | 'margin_of_safety'
  | 'mr_market'
  | 'investment_vs_speculation'
  | 'theta_protection'
  | 'vega_protection'
  | 'leverage_protection'
  | 'fomo_protection'
  | 'diversification'
  | 'intrinsic_value'
  | 'enterprising_vs_defensive'
  | 'earnings_quality'
  | 'dollar_cost_avg'
  | 'bond_buffer'
  | 'vertical_spreads'
  | 'calendar_spreads'
  | 'covered_calls'
  | 'straddles_strangles'
  | 'leaps'
  | 'assignment_risk'
  | 'risk_graphs'
  | 'option_selection'
  | 'greeks_beyond_delta'
  | 'hedging_basics'
  | 'volatility_trading'
  | 'synthetic_positions'
  | 'delta_neutral'
  | 'position_sizing'
  | 'stop_loss_discipline'
  | 'crypto_boom_bust'
  | 'leverage_liquidation'
  | 'this_time_different'
  | 'recovery_math'
  | 'hedge_not_gamble'
  | 'yield_ponzi'
  | 'chart_pattern_recognition'
  | 'cash_secured_puts'
  | 'protective_put'
  | 'collars'
  | 'rolling_positions'
  | 'defined_risk'
  | 'early_assignment'
  | 'event_risk'
  | 'rug_pull_recognition'
  | 'cold_storage_custody';

export interface GrahamProtection {
  id: GrahamProtectionId;
  title: string;
  unlocked: boolean;
  unlockedAtDay?: number;
  description: string;
  gameplayBonus: string;
}

// New: Player path - multiple ways to true ending
export type PlayerPath = 'UNDECIDED' | 'TRADER' | 'INVESTOR' | 'HYBRID';

export interface PathScores {
  trader: number; // aggressive but defined-risk trades, spreads, condors, straddles
  investor: number; // value assets, covered calls, cash-secured puts, long-term holds
}

// New: Relic with actual gameplay effects
export interface RelicDetail {
  id: string;
  name: string;
  lore: string;
  effect: string;
  bonus: {
    thetaBonus?: number;
    vegaReduction?: number;
    deltaCap?: number;
    marginDiscount?: number;
    heartBonus?: number;
  };
}

// New: Trade fail reason for the fail->Graham loop
export type TradeFailReason = 
  | 'OTM_LOTTERY_EXPIRED'
  | 'THETA_DECAY_CRUSH'
  | 'IV_CRUSH'
  | 'OVERLEVERAGE_MARGIN_CALL'
  | 'RUG_PULL_SCAM'
  | 'DIRECTIONAL_WRONG'
  | 'NO_STOP_LOSS';

export interface FailedTradeRecord {
  id: string;
  reason: TradeFailReason;
  strategy: StrategyType;
  lossFlorins: number;
  day: number;
  lessonId: GrahamProtectionId;
}

export interface PlayerStats {
  name: string;
  title: string;
  avatar: AvatarConfig;
  hearts: number;
  maxHearts: number;
  successfulTradesCount: number;
  failedTradesCount: number;
  investorTier: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  florins: number;
  stockShares: number;
  portfolioValue: number;
  marginUsed: number;
  marginLimit: number;
  netDelta: number;
  netGamma: number;
  netTheta: number;
  netVega: number;
  riskScore: number;
  chapter: number;
  day: number;
  mapX: number;
  mapY: number;
  facing: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  potions: {
    healthElixir: number;
    ivStabilizer: number;
    timeHourglass: number;
  };
  relics: string[];
  relicDetails?: RelicDetail[];
  undervaluedAssetsDiscovered: string[];
  scamsFallen: string[];
  scamsAvoided: string[];
  intelligentInvestorRevivals: number;
  // NEW FIELDS FOR CORE LOOP
  grahamProtections: GrahamProtectionId[];
  failedTrades: FailedTradeRecord[];
  pathScores: PathScores;
  currentPath: PlayerPath;
  oracleBondLevel: number; // 0-5, bonding with Oracle's Stone
  positionSizeDiscipline: number; // 0-100, Kelly Criterion adherence
  kellyFraction: number; // 0.0-1.0
  totalValueInvested: number;
  totalPremiumCollected: number;
  flawlessTradesStreak: number;
  // Discipline tracking (integration part 2)
  peakEquity: number; // highest total equity ever seen
  maxDrawdownPct: number; // worst (peak - current) / peak, in percent
  sanctuaryLessonsCompleted: number;
  heldThroughNoise: boolean; // held a down position through a noise event without selling
  survivedCrash: boolean; // equity stayed positive through a crash-phase day advance
  // NEW GAME+ (The Second Oracle regime): unlocked after the Seal of Discipline.
  ngPlus?: boolean; // bear regime: doubled IV floor, wider spreads, 2 starting hearts
  secondOracleDefeated?: boolean; // mirror-self boss conquered in NG+

}

export interface EnemyStats {
  id: string;
  name: string;
  title: string;
  type: 'BEAR' | 'BULL' | 'CRAB' | 'HYDRA' | 'REAPER';
  baseHp: number;
  maxHp: number;
  currentHp: number;
  attackPower: number;
  defense: number;
  riskSensitivity: number;
  marketAffinity: 'CRASH' | 'SURGE' | 'STAGNATION' | 'CHAOS';
  specialMove: string;
  lore: string;
  dialogue: string[];
  // Enhanced
  chapterRequirement?: number;
  weaknessStrategy?: StrategyType[];
  resistanceStrategy?: StrategyType[];
}

export interface CombatState {
  inCombat: boolean;
  enemy: EnemyStats | null;
  turn: number;
  combatLog: string[];
  lastAction: string | null;
  playerShieldActive: boolean;
  enemyChargingSpecial: boolean;
  marketEventThisTurn: string | null;
  currentPuzzle?: CombatAttackPuzzle | null;
  playerPathBonusActive?: boolean;
}

export interface CombatAttackPuzzle {
  id: string;
  difficultyTier: number;
  prompt: string;
  context: string;
  options: {
    label: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    damageBonus: number;
  }[];
}

export interface UndervaluedAsset {
  id: string;
  name: string;
  symbol: string;
  category: string;
  locationName: string;
  description: string;
  marketSpot: number;
  intrinsicValue: number;
  bookValuePerShare: number;
  cashPerShare: number;
  peRatio: number;
  marginOfSafetyPercent: number;
  currentIv: number;
  catalyst: string;
  // Enhanced: path alignment
  pathAffinity: PlayerPath;
  oracleInsight: string;
  choices: {
    title: string;
    description: string;
    actionType: 'VALUE_BUY_COVERED_CALL' | 'DEEP_ITM_LEAPS' | 'QUICK_SPECULATE_FLIP' | 'SHORT_THE_ASSET';
    costFlorins: number;
    heartsEffect: number;
    awardsHeartContainer?: boolean;
    consequenceText: string;
    florinsGain: number;
    spotShiftPercent: number;
    pathScore?: Partial<PathScores>;
    relicReward?: string;
  }[];
}

export interface ScamEncounter {
  id: string;
  scamType: 'PONZI_YIELD' | 'PUMP_AND_DUMP' | 'RUG_PULL_TOKEN' | 'UNREGISTERED_TURBO_LEVERAGE';
  title: string;
  shillerName: string;
  shillerTitle: string;
  pitch: string;
  promiseText: string;
  costFlorins: number;
  /** Loud marketing claims that make the WRONG choice look legitimate and attractive. */
  legitimacyClaims?: string[];
  /** Fine-print tells — visible but unstyled, never color-coded. */
  subtleTells?: string[];
  /** If present: the scam pays out first, THEN rugs. Early win is displayed but never withdrawable. */
  earlyWin?: {
    florinsGained: number;
    storyText: string;
  };
  temptationOutcome: {
    rugPullHeadline: string;
    storyExplanation: string;
    heartsLost: number;
    intelligentInvestorLesson: string;
    chapterReference: string;
    failReason: TradeFailReason;
    lessonId: GrahamProtectionId;
  };
  rejectionOutcome: {
    response: string;
    rewardFlorins: number;
    rewardWisdom: string;
    pathScore?: Partial<PathScores>;
    protectionGranted?: GrahamProtectionId;
  };
}

export interface IntelligentInvestorLesson {
  id: GrahamProtectionId;
  title: string;
  chapter: string;
  quote: string;
  corePhilosophy: string;
  whyYouFailed: string;
  reflectionQuestion: {
    prompt: string;
    choices: string[];
    correctIndex: number;
    explanation: string;
  };
  // Enhanced
  protectionBonus: string;
  oracleRune: string;
  // McMillan-level real options-mechanic teaching beat surfaced on trade encounters
  mechanicLesson?: string;
}

// A short MCQ about real options mechanics shown at the trade desk gate.
export interface OptionsMechanicChallenge {
  id: string;
  tiedLessonId: GrahamProtectionId;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface StoryChoice {
  text: string;
  costFlorins?: number;
  requiredRelic?: string;
  lessonKey?: string;
  outcomeText: string;
  action?: (state: any) => void;
  marketImpact?: {
    spotChangePercent?: number;
    ivChangePercent?: number;
  };
  combatTrigger?: string;
  pathScore?: Partial<PathScores>;
}

export interface QuestNode {
  id: string;
  title: string;
  locationName: string;
  description: string;
  speaker?: string;
  optionsLesson: string;
  choices: StoryChoice[];
}

export type GameView =
  | 'INTRO'
  | 'MAP'
  | 'DUNGEON'
  | 'QUEST'
  | 'COMBAT'
  | 'TRADE_DESK'
  | 'ORACLE_LEDGER'
  | 'PORTFOLIO'
  | 'GRIMOIRE'
  | 'INVENTORY'
  | 'UNDERVALUED_ASSET'
  | 'SCAM_ENCOUNTER'
  | 'INTELLIGENT_INVESTOR'
  | 'PROVING_VAULT'
  | 'VICTORY'
  | 'GAME_OVER';

// Oracle Ledger UI state
export interface OracleLedgerState {
  isOpen: boolean;
  activeRune: StrategyType;
  glyphPower: number;
  isDivining: boolean;
}
