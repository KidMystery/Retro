/**
 * Legend of Valuaria: Myth & Margin
 * 16-bit SNES RPG - Zelda found a Bloomberg terminal (as Oracle's Ledger)
 * Core mechanic: Fail options -> learn value investing (Graham loop) + Multiple paths
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  DOSTheme,
  GameView,
  PlayerStats,
  OptionContract,
  AssetQuote,
  CombatState,
  QuestNode,
  UndervaluedAsset,
  ScamEncounter,
  GrahamProtectionId,
  TradeFailReason,
  FailedTradeRecord,
  PlayerPath
} from './types';
import { REALM_MAPS, BOSS_ENEMIES, STORY_QUESTS } from './lib/questData';
import { ZELDA_MAPS, ZeldaEntity, DUNGEONS } from './lib/zeldaWorldData';
import { UNDERVALUED_ASSETS } from './lib/undervaluedAssetsData';
import { SCAM_ENCOUNTERS } from './lib/scamsData';
import { INTELLIGENT_INVESTOR_LESSONS, getTradeMechanicGate } from './lib/intelligentInvestorData';
import { calculateBlackScholes } from './lib/blackScholes';
import { sound } from './lib/audioEngine';
import {
  calculatePortfolioRisk,
  getScaledEnemyStats,
  resolveCombatAction
} from './lib/combatEngine';

import { DOSHeader } from './components/DOSHeader';
import { ZeldaHeartsHUD } from './components/ZeldaHeartsHUD';
import { ZeldaOverworldCanvas } from './components/ZeldaOverworldCanvas';
import { DungeonView } from './components/DungeonView';
import { ZeldaCombatModal } from './components/ZeldaCombatModal';
import { UndervaluedAssetModal } from './components/UndervaluedAssetModal';
import { RugPullLessonModal } from './components/RugPullLessonModal';
import { IntelligentInvestorSanctuaryModal } from './components/IntelligentInvestorSanctuaryModal';
import { OptionsMechanicGate } from './components/OptionsMechanicGate';
import { TradeDeskModal } from './components/TradeDeskModal';
import { PortfolioLedgerModal } from './components/PortfolioLedgerModal';
import { GrimoireModal } from './components/GrimoireModal';
import { StoryDialogModal } from './components/StoryDialogModal';
import { TerminalCommandLine } from './components/TerminalCommandLine';
import { SaveGameModal } from './components/SaveGameModal';
import { TitleScreen } from './components/TitleScreen';
import { TouchDPad } from './components/TouchDPad';
import { InventoryModal } from './components/InventoryModal';
import { SaveSlotData } from './types';
import { pickNoiseEvents, NoiseEvent } from './lib/curriculum/noiseEvents';
import { NoiseTicker } from './components/NoiseTicker';
import { MarginEvent, MarginState, describeMarginDanger, marginUtilization } from './lib/curriculum/marginDanger';
import { MarginMeter } from './components/MarginMeter';
import { checkBadges, Badge } from './lib/curriculum/dopamineBadges';
import { BadgeFanfare, BadgeShelf } from './components/BadgeFanfare';
import { chartPuzzles, ChartPuzzle } from './lib/curriculum/chartPuzzles';
import { ChartPuzzleModal } from './components/ChartPuzzleModal';
import { ProvingVaultModal } from './components/ProvingVaultModal';
import { ProvingVaultResult, TOTAL_CURRICULUM_LESSONS } from './lib/curriculum/provingVault';
import { Play, Award, Save, Sparkles, Crown, Shield, BookOpen, Coins } from 'lucide-react';
import titleBgUrl from './assets/textures/title_background.jpg';
import sageSpriteUrl from './assets/sprites/sage.png';

export default function App() {
  const [theme, setTheme] = useState<DOSTheme>('snes');
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmOn, setIsBgmOn] = useState(false);

  const [currentView, setCurrentView] = useState<GameView>('INTRO');
  const [activeModal, setActiveModal] = useState<'TRADE' | 'PORTFOLIO' | 'GRIMOIRE' | 'QUEST' | 'INVENTORY' | null>(null);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveModalMode, setSaveModalMode] = useState<'SAVE' | 'LOAD'>('SAVE');
  const [isAtSaveShrine, setIsAtSaveShrine] = useState(false);

  const [activeUndervaluedAsset, setActiveUndervaluedAsset] = useState<UndervaluedAsset | null>(null);
  const [activeScamEncounter, setActiveScamEncounter] = useState<ScamEncounter | null>(null);
  const [showSanctuary, setShowSanctuary] = useState(false);
  const [sanctuaryReason, setSanctuaryReason] = useState<TradeFailReason | null>(null);
  const [sanctuaryLessonId, setSanctuaryLessonId] = useState<GrahamProtectionId>('margin_of_safety');
  // McMillan mechanic gate: blocks a trade encounter until a real options-mechanics MCQ is answered.
  const [mechanicGate, setMechanicGate] = useState<{ lessonId: GrahamProtectionId } | null>(null);
  const [npcDialogue, setNpcDialogue] = useState<{ name: string; lines: string[]; lore?: string; portrait?: string } | null>(null);

  const [player, setPlayer] = useState<PlayerStats>({
    name: 'Valen',
    title: 'Orphan of Whispering Grove',
    avatar: {
      tunicColor: 'green',
      hairColor: 'blonde',
      shieldStyle: 'hylian',
      avatarTitle: 'Hero of Valuaria - Oracle Bonded'
    },
    hearts: 4.0,
    maxHearts: 4,
    successfulTradesCount: 0,
    failedTradesCount: 0,
    investorTier: 1,
    hp: 100,
    maxHp: 100,
    mana: 50,
    maxMana: 50,
    florins: 10000,
    stockShares: 50,
    portfolioValue: 10000,
    marginUsed: 0,
    marginLimit: 16000,
    netDelta: 0,
    netGamma: 0,
    netTheta: 0,
    netVega: 0,
    riskScore: 10,
    chapter: 1,
    day: 1,
    mapX: 5,
    mapY: 4,
    facing: 'DOWN',
    potions: { healthElixir: 2, ivStabilizer: 1, timeHourglass: 1 },
    relics: ['Black-Scholes Slate', 'Wooden Value Shield'],
    relicDetails: [],
    undervaluedAssetsDiscovered: [],
    scamsFallen: [],
    scamsAvoided: [],
    intelligentInvestorRevivals: 0,
    grahamProtections: [],
    failedTrades: [],
    pathScores: { trader: 0, investor: 0 },
    currentPath: 'UNDECIDED',
    oracleBondLevel: 1,
    positionSizeDiscipline: 50,
    kellyFraction: 0.25,
    totalValueInvested: 0,
    totalPremiumCollected: 0,
    flawlessTradesStreak: 0,
    peakEquity: 0,
    maxDrawdownPct: 0,
    sanctuaryLessonsCompleted: 0,
    heldThroughNoise: false,
    survivedCrash: false
  });

  const [positions, setPositions] = useState<OptionContract[]>([]);

  const [assetQuote, setAssetQuote] = useState<AssetQuote>({
    symbol: '$AETH',
    name: 'Crown Index of Aethelgard',
    spotPrice: 100.0,
    previousClose: 99.5,
    iv: 0.28,
    trend: 'BULLISH',
    lore: 'Sovereign underlying powering economic currents of Valuaria. Oracle Stone reveals true worth beneath Mr Market mood swings.'
  });

  const [combatState, setCombatState] = useState<CombatState>({
    inCombat: false,
    enemy: null,
    turn: 1,
    combatLog: [],
    lastAction: null,
    playerShieldActive: false,
    enemyChargingSpecial: false,
    marketEventThisTurn: null
  });

  const [activeQuest, setActiveQuest] = useState<QuestNode | null>(null);
  // ── Wiring 1: market noise popups ──
  const [activeNoise, setActiveNoise] = useState<NoiseEvent | null>(null);
  // ACT VERB: Act II spread-gates — both legs of a vertical spread must be
  // placed (one per leg shrine) before the 'G' gate tiles open.
  const [spreadLegsPlaced, setSpreadLegsPlaced] = useState<string[]>([]);
  // ACT VERB: Act V gauntlet — bosses 1-4 rematch in sequence before Vex.
  const [gauntletProgress, setGauntletProgress] = useState(0);
  const gauntletRoundRef = useRef(0);
  const GAUNTLET_BOSSES = ['Grizzly Bear of Drawdowns', 'The Chrono-Sphinx', 'Crab Golem of Sideways Range', 'Hydra of Implied Vega'];
  // ── Wiring 2: margin danger meter + warnings ──
  const [marginWarning, setMarginWarning] = useState<MarginEvent | null>(null);
  const lastMarginUtilRef = useRef(-1);
  const marginEquity = player.florins + player.stockShares * assetQuote.spotPrice;
  // ── Wiring 3: dopamine badge ladder ──
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
  const [fanfareBadge, setFanfareBadge] = useState<Badge | null>(null);
  const soldLossDuringNoiseRef = useRef(false); // iron-hands: did they panic-sell while noise was up?
  // ── Seal of Discipline endgame ──
  const [vaultResult, setVaultResult] = useState<ProvingVaultResult | null>(null);
  // ── Wiring 4: chart puzzle rooms ──
  const [activeChartPuzzle, setActiveChartPuzzle] = useState<ChartPuzzle | null>(null);

  const [terminalLog, setTerminalLog] = useState<string[]>([
    '◈ Daen Alterspire awakens... Obsidian altar with floating amber runes, pulsing emerald core.',
    '◈ Valen, orphan of Grove, bonds Oracle Ledger to soul. Floating glyph-circle shows live prices, greeks, portfolio.',
    '◈ Village elder rug-pulled same night you found Stone. Quest born: learn to invest, not save princess.',
    '[WASD/Arrows] move • [SPACE/E] interact & sword • Oracle Ledger reveals market truth • Fail->Graham loop teaches',
    'Paths: TRADER (aggressive defined-risk) • INVESTOR (slow value-first) • HYBRID • Same true ending: crown of richest investor'
  ]);

  const portfolioAnalysis = useMemo(() => {
    let totalOptionsValue = 0;
    let netDelta = player.stockShares / 100.0;
    let netGamma = 0;
    let netTheta = 0;
    let netVega = 0;
    const spot = assetQuote.spotPrice;
    const iv = assetQuote.iv;
    positions.forEach(pos => {
      const isCall = pos.type === 'CALL';
      const bs = calculateBlackScholes(spot, pos.strike, pos.dte, iv, 0.05, isCall);
      const markValue = bs.price * 100 * pos.quantity;
      totalOptionsValue += markValue;
      netDelta += bs.delta * pos.quantity;
      netGamma += bs.gamma * pos.quantity;
      netTheta += bs.theta * pos.quantity;
      netVega += bs.vega * pos.quantity;
    });
    const stockValue = player.stockShares * spot;
    const totalEquity = player.florins + totalOptionsValue + stockValue;
    return {
      totalEquity,
      netDelta: Number(netDelta.toFixed(2)),
      netGamma: Number(netGamma.toFixed(3)),
      netTheta: Number(netTheta.toFixed(2)),
      netVega: Number(netVega.toFixed(2))
    };
  }, [positions, player.florins, player.stockShares, assetQuote.spotPrice, assetQuote.iv]);

  // Integration part 2: real max-drawdown tracking. Peak equity vs current
  // equity; running max of (peak - current) / peak, persisted in player state.
  useEffect(() => {
    const equity = portfolioAnalysis.totalEquity;
    if (!isFinite(equity) || equity <= 0) return;
    setPlayer(prev => {
      const peak = Math.max(prev.peakEquity || 0, equity);
      const dd = ((peak - equity) / peak) * 100;
      const maxDd = Math.max(prev.maxDrawdownPct || 0, dd);
      if (peak === (prev.peakEquity || 0) && maxDd === (prev.maxDrawdownPct || 0)) return prev;
      return { ...prev, peakEquity: peak, maxDrawdownPct: maxDd };
    });
  }, [portfolioAnalysis.totalEquity]);

  const riskInfo = useMemo(() => {
    return calculatePortfolioRisk(
      {
        ...player,
        portfolioValue: portfolioAnalysis.totalEquity,
        netDelta: portfolioAnalysis.netDelta,
        netTheta: portfolioAnalysis.netTheta
      } as PlayerStats,
      positions
    );
  }, [player, portfolioAnalysis, positions]);

  useEffect(() => {
    setPlayer(prev => ({
      ...prev,
      portfolioValue: portfolioAnalysis.totalEquity,
      netDelta: portfolioAnalysis.netDelta,
      netGamma: portfolioAnalysis.netGamma,
      netTheta: portfolioAnalysis.netTheta,
      netVega: portfolioAnalysis.netVega,
      riskScore: riskInfo.riskScore,
      hp: Math.round(prev.hearts * 25)
    }));
  }, [portfolioAnalysis, riskInfo.riskScore]);

  // Discipline badge: red-market-survivor — equity positive after a crash-phase day advance.
  useEffect(() => {
    if (player.day >= 2 && marketPhase(player.day) === 'crash' && portfolioAnalysis.totalEquity > 0) {
      setPlayer(prev => (prev.survivedCrash ? prev : { ...prev, survivedCrash: true }));
    }
  }, [player.day, portfolioAnalysis.totalEquity]);

  useEffect(() => {
    if (player.hearts <= 0 && !showSanctuary && currentView !== 'INTRO') {
      sound.playAlarmSound();
      if (!sanctuaryReason) {
        setSanctuaryReason('DIRECTIONAL_WRONG');
        setSanctuaryLessonId('margin_of_safety');
      }
      setShowSanctuary(true);
    }
  }, [player.hearts, showSanctuary, currentView, sanctuaryReason]);

  const triggerSanctuary = useCallback((reason: TradeFailReason, lessonId: GrahamProtectionId, lossFlorins: number = 0) => {
    const failedRecord: FailedTradeRecord = {
      id: `fail_${Date.now()}`,
      reason,
      strategy: 'LONG_CALL',
      lossFlorins,
      day: player.day,
      lessonId
    };
    setPlayer(prev => ({
      ...prev,
      failedTrades: [...prev.failedTrades, failedRecord],
      failedTradesCount: prev.failedTradesCount + 1,
      flawlessTradesStreak: 0
    }));
    setSanctuaryReason(reason);
    setSanctuaryLessonId(lessonId);
    setShowSanctuary(true);
    sound.playAlarmSound();
    setTerminalLog(prev => [...prev.slice(-10), `◈ FAIL->GRAHAM LOOP: ${reason} triggered Sanctuary of Quiet Oracle. Lesson: ${lessonId}. Answer correctly for permanent protection!`]);
  }, [player.day]);

  // McMillan mechanic gate: pass -> mechanic rune knowledge + proceed to Trade Desk.
  const handleMechanicPass = (lessonId: GrahamProtectionId) => {
    sound.playSecretChime();
    setPlayer(prev => ({ ...prev, oracleBondLevel: Math.min(5, prev.oracleBondLevel + 0.1) }));
    setTerminalLog(prev => [...prev.slice(-10), `◈ MECHANIC RUNE: ${lessonId} options mechanics absorbed • Oracle Bond +0.1`]);
    setMechanicGate(null);
    setActiveModal('TRADE');
    setCurrentView('ORACLE_LEDGER');
  };

  // McMillan mechanic gate: wrong mechanics -> costs hearts+florins, fail->learn via Sanctuary.
  const handleMechanicFail = (lessonId: GrahamProtectionId) => {
    const failReasonByLesson: Partial<Record<GrahamProtectionId, TradeFailReason>> = {
      margin_of_safety: 'OTM_LOTTERY_EXPIRED',
      theta_protection: 'THETA_DECAY_CRUSH',
      vega_protection: 'IV_CRUSH'
    };
    setPlayer(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
      hp: Math.round(Math.max(0, prev.hearts - 1) * 25),
      florins: Math.max(0, prev.florins - 150)
    }));
    setMechanicGate(null);
    triggerSanctuary(failReasonByLesson[lessonId] || 'DIRECTIONAL_WRONG', lessonId, 150);
  };


  // Market phase cycle mapped to the Valuaria market arc (matches curriculum noise phases).
  const marketPhase = (day: number): string => {
    if (day <= 10) return 'euphoria';
    if (day <= 20) return 'sideways';
    if (day <= 30) return 'decline';
    if (day <= 40) return 'crash';
    return 'recovery';
  };

  // Resolve a noise event choice. Correct action = small florin bonus / avoided loss;
  // wrong = the event's lessonIfFollowed plays out as a small loss.
  const handleNoiseChoice = (action: 'ignore' | 'investigate' | 'hedge') => {
    if (!activeNoise) return;
    const correct = action === activeNoise.correctAction;
    sound.playCommandBeep();
    // Discipline badge: iron-hands — held an underwater position through the noise
    // event without panic-selling it.
    const heldUnderwater = positions.some(p => {
      const bs = calculateBlackScholes(assetQuote.spotPrice, p.strike, p.dte, assetQuote.iv, 0.05, p.type === 'CALL');
      return bs.price * 100 * p.quantity < p.entryPrice * 100 * Math.abs(p.quantity);
    });
    if (heldUnderwater && !soldLossDuringNoiseRef.current) {
      setPlayer(prev => (prev.heldThroughNoise ? prev : { ...prev, heldThroughNoise: true }));
      setTerminalLog(prev => [...prev.slice(-10), `🦾 IRON HANDS: You held a losing position through "${activeNoise.headline}" without selling. The hands do not shake.`]);
    }
    setPlayer(prev => ({
      ...prev,
      florins: Math.max(0, prev.florins + (correct ? 250 : -300)),
      hearts: Math.max(0.5, prev.hearts)
    }));
    setTerminalLog(prev => [
      ...prev.slice(-10),
      correct
        ? `📰 NOISE (${activeNoise.id}): You chose ${action.toUpperCase()} — correct! +250ƒ (avoided loss / good read)`
        : `📰 NOISE (${activeNoise.id}): You chose ${action.toUpperCase()} — the trap took hold. -300ƒ • ${activeNoise.lessonIfFollowed}`
    ]);
    setActiveNoise(null);
  };

  // Wiring 2: track margin utilization ladder. A worse event than last shown
  // flashes the warning banner; liquidation force-closes positions + hits hearts.
  useEffect(() => {
    if (player.marginUsed <= 0) { lastMarginUtilRef.current = -1; return; }
    const s: MarginState = { equity: marginEquity, marginUsed: player.marginUsed, maintenanceReq: player.marginUsed * 0.25 };
    const util = marginUtilization(s);
    const evt = describeMarginDanger(util);
    if (evt && util > lastMarginUtilRef.current) {
      lastMarginUtilRef.current = util;
      setMarginWarning(evt);
      sound.playAlarmSound();
      if (evt.severity === 'liquidation') {
        setPositions([]);
        setPlayer(prev => {
          const newHearts = Math.max(0, prev.hearts - 1);
          return { ...prev, marginUsed: 0, hearts: newHearts, hp: Math.round(newHearts * 25) };
        });
        setTerminalLog(prev => [...prev.slice(-10), `⚠ LIQUIDATION! Broker force-closed all positions. -1♥ • ${evt.consequence}`]);
      } else {
        setTerminalLog(prev => [...prev.slice(-10), `⚠ MARGIN ${evt.severity.toUpperCase()} @ ${Math.round(util * 100)}%: ${evt.message}`]);
      }
    }
  }, [player.marginUsed, marginEquity]);

  const handleAdvanceDay = useCallback(() => {
    sound.playCommandBeep();
    const updatedPositions: OptionContract[] = [];
    let expiredSettlementFlorins = 0;
    const logs: string[] = [];
    let failedTradesThisDay: FailedTradeRecord[] = [];
    const spot = assetQuote.spotPrice;

    positions.forEach(pos => {
      const newDte = pos.dte - 1;
      if (newDte <= 0) {
        let intrinsic = 0;
        if (pos.type === 'CALL') intrinsic = Math.max(0, spot - pos.strike);
        else intrinsic = Math.max(0, pos.strike - spot);
        const payout = intrinsic * 100 * pos.quantity;
        const entryCost = pos.entryPrice * 100 * Math.abs(pos.quantity);
        const pnl = payout - entryCost;
        expiredSettlementFlorins += payout;
        if (payout > 0) {
          logs.push(`◈ ${pos.strategy} Strike ${pos.strike} ITM! Settled +${Math.round(payout)} ƒ (P&L ${pnl >=0?'+':''}${Math.round(pnl)} ƒ)`);
        } else {
          logs.push(`◈ ${pos.strategy} Strike ${pos.strike} OTM worthless. Loss -${Math.round(entryCost)} ƒ • Theta + IV crush`);
          let reason: TradeFailReason = 'OTM_LOTTERY_EXPIRED';
          let lesson: GrahamProtectionId = 'investment_vs_speculation';
          if (pos.dte <= 7 && Math.abs(pos.strike - spot) > 8) {
            reason = 'OTM_LOTTERY_EXPIRED';
            lesson = 'investment_vs_speculation';
          } else if (pos.strategy === 'LONG_CALL' || pos.strategy === 'LONG_PUT') {
            reason = 'THETA_DECAY_CRUSH';
            lesson = 'theta_protection';
          }
          if (!player.grahamProtections.includes(lesson)) {
            failedTradesThisDay.push({
              id: `fail_${Date.now()}_${pos.id}`,
              reason,
              strategy: pos.strategy,
              lossFlorins: entryCost,
              day: player.day,
              lessonId: lesson
            });
          }
        }
      } else {
        updatedPositions.push({ ...pos, dte: newDte });
      }
    });

    setPositions(updatedPositions);
    const randomDrift = (Math.random() - 0.48) * 0.035;
    const newSpot = Math.max(10, Number((spot * (1 + randomDrift)).toFixed(2)));
    const randomIvDrift = (Math.random() - 0.5) * 0.02;
    const newIv = Math.max(0.12, Math.min(0.95, Number((assetQuote.iv + randomIvDrift).toFixed(3))));
    setAssetQuote(prev => ({
      ...prev,
      spotPrice: newSpot,
      previousClose: spot,
      iv: newIv,
      trend: newSpot >= spot ? 'BULLISH' : 'BEARISH'
    }));

    setPlayer(prev => {
      const restoredHearts = Math.min(prev.maxHearts, prev.hearts + 0.5);
      const restoredMana = Math.min(prev.maxMana, prev.mana + 15);
      const newFlorins = prev.florins + expiredSettlementFlorins;
      const marginUtil = prev.marginLimit > 0 ? prev.marginUsed / prev.marginLimit : 0;
      let heartPenalty = 0;
      let failReason: TradeFailReason | null = null;
      let lessonId: GrahamProtectionId = 'leverage_protection';

      if (marginUtil > 0.85 || newFlorins < 500) {
        heartPenalty = 1.0;
        failReason = 'OVERLEVERAGE_MARGIN_CALL';
        lessonId = 'leverage_protection';
        sound.playAlarmSound();
        logs.push(`◈ MARGIN CALL! Overleveraged breached! Lost 1.0 Heart! Kelly says survival first!`);
      }

      if (failedTradesThisDay.length > 0 && !prev.grahamProtections.includes(failedTradesThisDay[0].lessonId)) {
        const firstFail = failedTradesThisDay[0];
        setTimeout(() => triggerSanctuary(firstFail.reason, firstFail.lessonId, firstFail.lossFlorins), 800);
      } else if (failReason && !prev.grahamProtections.includes(lessonId)) {
        setTimeout(() => triggerSanctuary(failReason!, lessonId, 500), 800);
      }

      const finalHearts = Math.max(0, restoredHearts - heartPenalty);
      return {
        ...prev,
        day: prev.day + 1,
        hearts: finalHearts,
        hp: Math.round(finalHearts * 25),
        mana: restoredMana,
        florins: newFlorins,
        failedTrades: [...prev.failedTrades, ...failedTradesThisDay],
        failedTradesCount: prev.failedTradesCount + failedTradesThisDay.length,
        oracleBondLevel: Math.min(5, prev.oracleBondLevel + (failedTradesThisDay.length === 0 ? 0.1 : 0))
      };
    });

    setTerminalLog(prev => [
      ...prev.slice(-12),
      `=== DAY #${player.day + 1} • Oracle Sight Transition ===`,
      `Spot $AETH ${spot.toFixed(2)} → ${newSpot.toFixed(2)} ƒ (IV ${(newIv*100).toFixed(1)}%) • Theta flow: ${portfolioAnalysis.netTheta.toFixed(1)} ƒ/d`,
      ...logs
    ]);

    // Wiring 1: surface curriculum noise events for the new day/phase.
    const newDay = player.day + 1;
    const noise = pickNoiseEvents(newDay, marketPhase(newDay));
    if (noise.length > 0) {
      soldLossDuringNoiseRef.current = false; // fresh iron-hands window for this event
      setActiveNoise(noise[0]);
    }
  }, [assetQuote.spotPrice, assetQuote.iv, positions, player.day, player.grahamProtections, portfolioAnalysis.netTheta, triggerSanctuary]);

  // Wiring 3: badge ladder evaluated continuously against current equity, REAL
  // drawdown (computed live so a same-day crash can't dodge the gate), and the
  // discipline flags — so mid-day earns (noise choice, sanctuary lesson, trade
  // streak) fanfare immediately, not only on day advance.
  useEffect(() => {
    const peak = Math.max(player.peakEquity || 0, portfolioAnalysis.totalEquity);
    const liveDrawdownPct = peak > 0
      ? Math.max(player.maxDrawdownPct || 0, ((peak - portfolioAnalysis.totalEquity) / peak) * 100)
      : 0;
    const earned = checkBadges(portfolioAnalysis.totalEquity, liveDrawdownPct, [], {
      flawlessTrades: player.flawlessTradesStreak,
      sanctuaryLessons: player.sanctuaryLessonsCompleted,
      heldThroughNoise: player.heldThroughNoise,
      survivedCrash: player.survivedCrash
    });
    const fresh = earned.filter(b => !earnedBadgeIds.includes(b.id));
    if (fresh.length > 0) {
      setEarnedBadgeIds(prev => [...prev, ...fresh.map(b => b.id)]);
      setFanfareBadge(fresh[0]);
      sound.playFanfare();
    }
  }, [portfolioAnalysis.totalEquity, player.peakEquity, player.maxDrawdownPct, player.flawlessTradesStreak, player.sanctuaryLessonsCompleted, player.heldThroughNoise, player.survivedCrash, earnedBadgeIds]);

  const handleExecuteTrade = (contract: OptionContract, netCost: number, marginReq: number) => {
    sound.playCoinSound();
    setPositions(prev => [...prev, contract]);

    setPlayer(prev => {
      const newTradeCount = prev.successfulTradesCount + 1;
      let newMaxHearts = prev.maxHearts;
      let earnedHeartContainer = false;
      if (newTradeCount % 3 === 0) {
        newMaxHearts = Math.min(10, prev.maxHearts + 1);
        earnedHeartContainer = true;
      }
      const restoredHearts = Math.min(newMaxHearts, prev.hearts + 0.5);
      let newTier = 1;
      if (newMaxHearts >= 7) newTier = 3;
      else if (newMaxHearts >= 5) newTier = 2;

      const isTraderStrategy = ['LONG_CALL', 'LONG_PUT', 'BULL_CALL_SPREAD', 'BEAR_PUT_SPREAD', 'IRON_CONDOR', 'LONG_STRADDLE'].includes(contract.strategy);
      const isInvestorStrategy = ['CASH_SECURED_PUT', 'COVERED_CALL', 'CALENDAR_SPREAD'].includes(contract.strategy);
      let traderScore = prev.pathScores.trader;
      let investorScore = prev.pathScores.investor;
      if (isTraderStrategy && contract.strategy !== 'LONG_CALL' && contract.strategy !== 'LONG_PUT') {
        traderScore += 2; // defined-risk trader gets more points than naked
      } else if (isTraderStrategy) {
        traderScore += 1;
      }
      if (isInvestorStrategy) investorScore += 2;

      let currentPath: PlayerPath = prev.currentPath;
      if (traderScore > investorScore + 2) currentPath = 'TRADER';
      else if (investorScore > traderScore + 2) currentPath = 'INVESTOR';
      else if (traderScore > 0 && investorScore > 0) currentPath = 'HYBRID';
      else if (prev.currentPath === 'UNDECIDED' && newTradeCount >= 2) {
        currentPath = traderScore >= investorScore ? 'TRADER' : 'INVESTOR';
      }

      const positionPct = (contract.premium * 100 * Math.abs(contract.quantity)) / Math.max(1, prev.portfolioValue);
      const kellyCompliant = positionPct <= 0.25;
      const discipline = kellyCompliant ? Math.min(100, prev.positionSizeDiscipline + 5) : Math.max(0, prev.positionSizeDiscipline - 10);

      const isCredit = netCost < 0;
      const premiumCollected = isCredit ? Math.abs(netCost) : 0;

      if (earnedHeartContainer) {
        sound.playHeartContainer();
        setTerminalLog(log => [
          ...log.slice(-10),
          `◈ DISCIPLINED TRADING MILESTONE! Heart Container ${newMaxHearts} Max! Tier ${newTier}! Path ${currentPath} • Oracle Bond Lv ${Math.min(5, prev.oracleBondLevel + 0.2).toFixed(1)}`,
          `◈ ${currentPath} path: ${currentPath === 'TRADER' ? 'Aggressive but defined-risk' : currentPath === 'INVESTOR' ? 'Slow value-first, margin of safety' : 'Balanced discipline'} • True end same destination`
        ]);
      }

      return {
        ...prev,
        florins: prev.florins - netCost,
        marginUsed: prev.marginUsed + marginReq,
        successfulTradesCount: newTradeCount,
        maxHearts: newMaxHearts,
        hearts: earnedHeartContainer ? newMaxHearts : restoredHearts,
        hp: Math.round((earnedHeartContainer ? newMaxHearts : restoredHearts) * 25),
        investorTier: newTier,
        pathScores: { trader: traderScore, investor: investorScore },
        currentPath,
        oracleBondLevel: Math.min(5, prev.oracleBondLevel + 0.15),
        positionSizeDiscipline: discipline,
        totalPremiumCollected: prev.totalPremiumCollected + premiumCollected,
        flawlessTradesStreak: prev.flawlessTradesStreak + 1,
        totalValueInvested: prev.totalValueInvested + Math.max(0, netCost)
      };
    });

    setActiveModal(null);
    setTerminalLog(prev => [
      ...prev.slice(-12),
      `◈ ORACLE FORGED: ${contract.quantity}x ${contract.strategy} Strike ${contract.strike} ${contract.dte}DTE Premium ${contract.premium.toFixed(2)}ƒ • Path ${player.currentPath} • Bond Lv ${(player.oracleBondLevel + 0.15).toFixed(1)} • Life +0.5♥`
    ]);
  };

  const handleClosePosition = (positionId: string, currentMarketValue: number) => {
    const pos = positions.find(p => p.id === positionId);
    if (!pos) return;
    const entryCost = pos.entryPrice * 100 * Math.abs(pos.quantity);
    const pnl = currentMarketValue - entryCost;
    const isLoss = pnl < -entryCost * 0.2;
    const isBigWin = currentMarketValue >= entryCost * 1.5;

    sound.playCoinSound();
    setPositions(prev => prev.filter(p => p.id !== positionId));

    // iron-hands: panic-selling a loser while a noise event is on screen kills the flag.
    if (isLoss && activeNoise) soldLossDuringNoiseRef.current = true;

    setPlayer(prev => {
      let maxH = prev.maxHearts;
      if (isBigWin && maxH < 10) {
        maxH += 1;
        sound.playHeartContainer();
        setTerminalLog(log => [...log.slice(-10), `◈ LEGENDARY WIN +50%! Heart Container ${maxH} Max!`]);
      }
      let newFailed = prev.failedTrades;
      let newFailedCount = prev.failedTradesCount;
      let newStreak = prev.flawlessTradesStreak;

      if (isLoss) {
        const lossPct = Math.abs(pnl) / entryCost;
        let reason: TradeFailReason = 'DIRECTIONAL_WRONG';
        let lesson: GrahamProtectionId = 'mr_market';
        if (pos.dte <= 5) { reason = 'THETA_DECAY_CRUSH'; lesson = 'theta_protection'; }
        else if (Math.abs(pos.entryIv! - assetQuote.iv) > 0.3) { reason = 'IV_CRUSH'; lesson = 'vega_protection'; }
        else if (lossPct > 0.8) { reason = 'OTM_LOTTERY_EXPIRED'; lesson = 'investment_vs_speculation'; }

        if (!prev.grahamProtections.includes(lesson)) {
          const rec: FailedTradeRecord = {
            id: `fail_${Date.now()}`,
            reason,
            strategy: pos.strategy,
            lossFlorins: Math.abs(pnl),
            day: prev.day,
            lessonId: lesson
          };
          newFailed = [...prev.failedTrades, rec];
          newFailedCount += 1;
          newStreak = 0;
          setTimeout(() => triggerSanctuary(reason, lesson, Math.abs(pnl)), 600);
        }
      } else {
        newStreak += 1;
      }

      return {
        ...prev,
        florins: prev.florins + currentMarketValue,
        maxHearts: maxH,
        hearts: Math.min(maxH, prev.hearts + (isLoss ? -0.5 : 0.5)),
        hp: Math.round(Math.min(maxH, prev.hearts + (isLoss ? -0.5 : 0.5)) * 25),
        marginUsed: Math.max(0, prev.marginUsed - (pos.strategy === 'CASH_SECURED_PUT' || pos.strategy === 'COVERED_CALL' ? pos.strike * 100 * pos.quantity * 0.5 : 0)),
        failedTrades: newFailed,
        failedTradesCount: newFailedCount,
        flawlessTradesStreak: newStreak
      };
    });

    setTerminalLog(prev => [
      ...prev.slice(-12),
      isLoss ? `◈ POSITION CLOSED LOSS: ${pos.strategy} ${pnl >=0?'+':''}${Math.round(pnl)}ƒ • Fail->Graham loop may trigger if no protection` : `◈ POSITION CLOSED WIN: ${pos.strategy} +${Math.round(pnl)}ƒ • Discipline rewarded!`
    ]);
  };

  const handleExercisePosition = (positionId: string) => {
    const pos = positions.find(p => p.id === positionId);
    if (!pos) return;
    const spot = assetQuote.spotPrice;
    let netGain = 0;
    if (pos.type === 'CALL') netGain = Math.max(0, spot - pos.strike) * 100 * pos.quantity;
    else netGain = Math.max(0, pos.strike - spot) * 100 * pos.quantity;

    sound.playCoinSound();
    setPositions(prev => prev.filter(p => p.id !== positionId));
    setPlayer(prev => ({
      ...prev,
      florins: prev.florins + netGain,
      hearts: Math.min(prev.maxHearts, prev.hearts + 0.5),
      hp: Math.round(Math.min(prev.maxHearts, prev.hearts + 0.5) * 25),
      marginUsed: Math.max(0, prev.marginUsed - (pos.strategy === 'CASH_SECURED_PUT' ? pos.strike * 100 * pos.quantity : 0)),
      successfulTradesCount: prev.successfulTradesCount + 1,
      pathScores: { ...prev.pathScores, investor: prev.pathScores.investor + 1 }
    }));

    setTerminalLog(prev => [...prev.slice(-12), `◈ EXERCISED: ${pos.strategy} Strike ${pos.strike} +${Math.round(netGain)}ƒ • Investor path +1 • +0.5♥`]);
  };

  const initiateCombat = (chapterNum: number) => {
    const baseEnemy = BOSS_ENEMIES[chapterNum] || BOSS_ENEMIES[1];
    sound.startMusic('battle');
    const scaledEnemy = getScaledEnemyStats(baseEnemy, player, riskInfo.riskScore);
    setCombatState({
      inCombat: true,
      enemy: scaledEnemy,
      turn: 1,
      combatLog: [
        `◈ ENCOUNTER: ${scaledEnemy.name} emerges! ${scaledEnemy.title}`,
        `◈ Lore: ${scaledEnemy.lore.slice(0,120)}...`,
        `◈ Scaled ${scaledEnemy.maxHp} HP • Your Portfolio ${Math.round(player.portfolioValue).toLocaleString()}ƒ • Path ${player.currentPath}`,
        `◈ Weakness: ${scaledEnemy.weaknessStrategy?.join(', ') || 'Solve puzzles'} • Resistance: ${scaledEnemy.resistanceStrategy?.join(', ') || 'None'}`,
        `◈ Solve tactical options puzzles to unleash sword strikes! Graham protections active: ${player.grahamProtections.length}`
      ],
      lastAction: null,
      playerShieldActive: false,
      enemyChargingSpecial: false,
      marketEventThisTurn: null
    });
    setCurrentView('COMBAT');
  };

  const handlePuzzleAttack = (bonusDamage: number, isCorrect: boolean, explanation: string) => {
    if (!combatState.enemy) return;
    const baseDamage = isCorrect ? 42 + player.chapter * 16 : 6;
    const totalPlayerDamage = Math.max(0, baseDamage + bonusDamage);
    const updatedEnemyHp = Math.max(0, combatState.enemy.currentHp - totalPlayerDamage);
    let heartDelta = 0;
    if (isCorrect) heartDelta = 0.5;
    else { heartDelta = -1.0; sound.playAlarmSound(); }

    setPlayer(prev => {
      const newHearts = Math.max(0, Math.min(prev.maxHearts, prev.hearts + heartDelta));
      return { ...prev, hearts: newHearts, hp: Math.round(newHearts * 25) };
    });

    if (updatedEnemyHp <= 0) {
      sound.playFanfare();
      sound.startMusic('dungeon');
      const lootGold = 1200 * player.chapter + player.chapter * 200;
      setPlayer(prev => {
        const newMax = Math.min(10, prev.maxHearts + 1);
        const newBond = Math.min(5, prev.oracleBondLevel + 0.5);
        return {
          ...prev,
          florins: prev.florins + lootGold,
          maxHearts: newMax,
          hearts: newMax,
          hp: Math.round(newMax * 25),
          oracleBondLevel: newBond
        };
      });
      if (player.chapter >= 5) {
        // ACT VERB (Act V): inside the gauntlet, rounds 1-4 rematches advance the
        // gauntlet instead of ending the run. Round 5 (Vex) opens the Vault.
        if (gauntletRoundRef.current >= 1 && gauntletRoundRef.current <= 4) {
          const round = gauntletRoundRef.current;
          gauntletRoundRef.current = 0;
          setGauntletProgress(round);
          setTerminalLog(prev => [...prev.slice(-10), `⚔ GAUNTLET: ${GAUNTLET_BOSSES[round - 1]} falls again! Round ${round}/5 survived. No sanctuary — the next challenger waits.`]);
          setCurrentView('DUNGEON');
          return;
        }
        gauntletRoundRef.current = 0;
        // Seal of Discipline endgame: boss #5 down → the Proving Vault exam,
        // then the seal-judged ending. VICTORY is only reached through it.
        sound.playSecretChime();
        setTerminalLog(prev => [...prev.slice(-10), `⚖ MARDUK VEX FALLEN — but the crown is not yet yours. The Oracle opens THE PROVING VAULT: a 60-day scripted exam. Three seals judge you.`]);
        setVaultResult(null);
        setCurrentView('PROVING_VAULT');
        return;
      }
      setTerminalLog(prev => [...prev.slice(-10), `◈ GUARDIAN VANQUISHED! Act ${player.chapter} cleared! +${lootGold}ƒ +1 Heart Container! Oracle Bond +0.5! Path ${player.currentPath}`]);
      setPlayer(prev => ({ ...prev, chapter: prev.chapter + 1, mapX: 5, mapY: 4 }));
      setCurrentView('MAP');
      return;
    }

    setCombatState(prev => ({
      ...prev,
      turn: prev.turn + 1,
      combatLog: [
        ...prev.combatLog.slice(-8),
        isCorrect ? `⚔️ CRITICAL STRIKE ᛚ ${totalPlayerDamage} dmg! +0.5♥ • Path ${player.currentPath} bonus!` : `❌ FLAWED THESIS! Only ${totalPlayerDamage} dmg. ${prev.enemy?.name} retaliates -1.0♥!`,
        `> ${explanation}`
      ],
      enemy: { ...prev.enemy!, currentHp: updatedEnemyHp }
    }));
  };

  const handleCombatShield = () => {
    sound.playShieldBlock();
    setCombatState(prev => ({
      ...prev,
      playerShieldActive: true,
      combatLog: [...prev.combatLog.slice(-8), `🛡️ GRAHAM SHIELD ᛉ Defined-Risk Ward! 70% reduction if margin_of_safety protected!`]
    }));
  };

  const handleCombatItem = (itemType: 'healthElixir' | 'ivStabilizer' | 'timeHourglass') => {
    if (player.potions[itemType] <= 0) return;
    sound.playSecretChime();
    setPlayer(prev => {
      let h = prev.hearts;
      if (itemType === 'healthElixir') h = Math.min(prev.maxHearts, prev.hearts + 2.0);
      else if (itemType === 'ivStabilizer') h = Math.min(prev.maxHearts, prev.hearts + 1.0);
      else h = Math.min(prev.maxHearts, prev.hearts + 0.8);
      return { ...prev, hearts: h, hp: Math.round(h * 25), potions: { ...prev.potions, [itemType]: prev.potions[itemType] - 1 } };
    });
    setCombatState(prev => ({
      ...prev,
      combatLog: [...prev.combatLog.slice(-8), `✨ Used ${itemType}! Life force restored!`]
    }));
  };

  const handleOverworldMove = (x: number, y: number, facing: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    setPlayer(prev => ({ ...prev, mapX: x, mapY: y, facing }));
  };

  // Encounter nodes placed on open floor tiles of the act's raycaster dungeon
  // (DUNGEONS coords, BFS-validated per act). Each carries the chapter's real
  // entity id so interacting fires the full trade/scam/sage flow.
  const dungeonEncounters = useMemo(() => {
    const mapData = ZELDA_MAPS[player.chapter] || ZELDA_MAPS[1];
    // Per-act placements on that act's own maze (tile coords).
    const actCoords: { [act: number]: Array<[number, number]> } = {
      1: [
        [2, 4], [9, 5], [10, 9], [4, 11], [16, 5], [2, 9], [12, 9], [9, 15], [17, 15],
      ],
      2: [
        [4, 1],   // sage
        [7, 2],   // broker
        [1, 9],   // scam: leverage lord (left chamber)
        [16, 9],  // scam: vol siren (right chamber — behind the gates)
        [17, 3],  // undervalued asset
        [2, 13],  // shrine
        [17, 13], // chest (right chamber — better loot past the gates)
        [17, 11], // boss sphinx
      ],
      3: [
        [2, 13],  // sage
        [9, 6],   // shrine (brazier court)
        [16, 1],  // broker
        [16, 13], // undervalued bridge
        [2, 9],   // scam: range gambler (static)
        [16, 9],  // chest
        [9, 13],  // boss crab
      ],
      4: [
        [1, 13],  // sage
        [17, 13], // broker
        [9, 11],  // scam: vol siren
        [1, 1],   // undervalued obsidian shrine
        [9, 3],   // shrine
        [17, 1],  // chest (deep dark = better loot)
        [9, 9],   // boss hydra (deepest chamber)
      ],
    };
    const coords = actCoords[player.chapter] || actCoords[1];
    const base = mapData.entities
      .filter(e => e.type !== 'PORTAL')
      .slice(0, coords.length)
      .map((e, i) => ({
        id: e.id,
        name: e.name,
        x: coords[i][0] + 0.5,
        y: coords[i][1] + 0.5,
        prompt: e.interactPrompt,
      }));
    // Act II spread-gate leg shrines — the "key" is a combined vertical spread.
    const gateLegs = player.chapter === 2 ? [
      { id: 'gate-leg-call', name: 'Long Call Leg Shrine', x: 1.5, y: 6.5, prompt: spreadLegsPlaced.includes('call') ? '✔ CALL leg placed' : 'Place SPREAD LEG 1 • Buy 1 Call (vertical spread leg)' },
      { id: 'gate-leg-put', name: 'Short Put Leg Shrine', x: 7.5, y: 3.5, prompt: spreadLegsPlaced.includes('put') ? '✔ PUT leg placed' : 'Place SPREAD LEG 2 • Sell 1 Put (vertical spread leg)' },
    ] : [];
    // Act V gauntlet — bosses 1-4 rematch in sequence, then Vex.
    const gauntlet = player.chapter === 5 ? GAUNTLET_BOSSES.map((name, i) => ({
      id: `gauntlet-${i + 1}`,
      name: `Gauntlet Round ${i + 1}: ${name}`,
      x: [[9, 1], [17, 7], [9, 11], [1, 7]][i][0] + 0.5,
      y: [[9, 1], [17, 7], [9, 11], [1, 7]][i][1] + 0.5,
      prompt: i === gauntletProgress ? `Gauntlet Round ${i + 1} • Face the ${name} again — no sanctuary between` : `Sealed until Round ${gauntletProgress + 1} • The gauntlet demands order`,
    })).concat([{
      id: 'boss_vex',
      name: 'Liquidation Lord Marduk Vex',
      x: 9.5, y: 9.5,
      prompt: gauntletProgress >= 4 ? 'Confront Marduk Vex [Final Boss — the gauntlet is complete]' : `Sealed • Survive all ${GAUNTLET_BOSSES.length} rematches first`,
    }]) : [];
    // Chart puzzle rooms stay in the Act I teaching dungeon.
    const chartRoomCoords: Array<[number, number]> = [[6, 4], [14, 12], [5, 8], [15, 3]];
    const chartRooms = player.chapter === 1 ? chartRoomCoords.map((c, i) => ({
      id: `chart-room-${i}`,
      name: `Chart Shrine ${i + 1}`,
      x: c[0] + 0.5,
      y: c[1] + 0.5,
      prompt: `Read the tape • ${chartPuzzles[i % chartPuzzles.length].pattern}`,
    })) : [];
    return base.concat(gateLegs).concat(gauntlet).concat(chartRooms);
  }, [player.chapter, spreadLegsPlaced, gauntletProgress]);

  // Wiring 4: resolve a chart puzzle answer. Correct = rune + florin bonus;
  // wrong = sanctuary loop with the explanation as the lesson.
  const handleChartPuzzleAnswer = (correct: boolean) => {
    const puzzle = activeChartPuzzle;
    setActiveChartPuzzle(null);
    if (!puzzle) return;
    if (correct) {
      sound.playFanfare();
      setPlayer(prev => ({
        ...prev,
        florins: prev.florins + 400,
        grahamProtections: prev.grahamProtections.includes(puzzle.protectionId as any)
          ? prev.grahamProtections
          : [...prev.grahamProtections, puzzle.protectionId as any]
      }));
      setTerminalLog(prev => [...prev.slice(-10), `🕯 CHART ROOM SOLVED: ${puzzle.pattern} read correctly! +400ƒ • ${puzzle.explanation}`]);
    } else {
      sound.playAlarmSound();
      setTerminalLog(prev => [...prev.slice(-10), `🕯 CHART ROOM FAILED: ${puzzle.trap} • Sanctuary lesson: ${puzzle.lesson}`]);
      triggerSanctuary('DIRECTIONAL_WRONG', 'margin_of_safety', 300);
    }
  };

  const handleInteractEntity = (entity: ZeldaEntity) => {
    if (entity.type === 'NPC_SAGE') {
      sound.playSecretChime();
      setNpcDialogue({ name: entity.name, lines: entity.dialogue || ['"Margin of Safety, apprentice."'], lore: entity.lore, portrait: sageSpriteUrl });
    } else if (entity.type === 'NPC_BROKER') {
      sound.playCommandBeep();
      // McMillan mechanic gate first: read the mechanic beat + answer a real options MCQ
      // before the Trade Desk opens. Wrong pick costs hearts+florins and pulls the Sanctuary.
      setMechanicGate({ lessonId: getTradeMechanicGate(player.day).challenge.tiedLessonId });
    } else if (entity.type === 'NPC_SCAMMER') {
      sound.playAlarmSound();
      const scam = SCAM_ENCOUNTERS[entity.targetId || 'ponzi_farm'] || SCAM_ENCOUNTERS['ponzi_farm'];
      setActiveScamEncounter(scam);
    } else if (entity.type === 'NPC_ASSET') {
      sound.playSecretChime();
      const asset = UNDERVALUED_ASSETS[entity.targetId || 'silver_mine'] || UNDERVALUED_ASSETS['silver_mine'];
      setActiveUndervaluedAsset(asset);
    } else if (entity.type === 'CHEST') {
      sound.playCoinSound();
      const rewardFlorins = 400 + player.chapter * 180;
      const relicChance = Math.random() > 0.6 ? ['Silver Vein Compass'] : [];
      setPlayer(prev => ({
        ...prev,
        florins: prev.florins + rewardFlorins,
        hearts: Math.min(prev.maxHearts, prev.hearts + 1.0),
        hp: Math.round(Math.min(prev.maxHearts, prev.hearts + 1.0) * 25),
        potions: { ...prev.potions, healthElixir: prev.potions.healthElixir + 1 },
        relics: [...prev.relics, ...relicChance],
        totalValueInvested: prev.totalValueInvested + rewardFlorins
      }));
      setTerminalLog(prev => [...prev.slice(-10), `◈ Treasury Chest! +${rewardFlorins}ƒ +1 Elixir +1♥ • Relic chance! • Oracle Bond +0.1`]);
      setPlayer(prev => ({ ...prev, oracleBondLevel: Math.min(5, prev.oracleBondLevel + 0.1) }));
    } else if (entity.type === 'SHRINE') {
      sound.playSaveGame();
      setIsAtSaveShrine(true);
      setSaveModalMode('SAVE');
      setShowSaveModal(true);
      setPlayer(prev => ({ ...prev, oracleBondLevel: Math.min(5, prev.oracleBondLevel + 0.2), hearts: Math.min(prev.maxHearts, prev.hearts + 0.5) }));
    } else if (entity.type === 'PORTAL') {
      sound.playSecretChime();
      const dun = DUNGEONS[player.chapter] || DUNGEONS[1];
      setTerminalLog(prev => [...prev.slice(-10), `🕳 You descend into ${entity.name}. ${dun.actLabel}`]);
      setCurrentView('DUNGEON');
    } else if (entity.type === 'BOSS') {
      initiateCombat(player.chapter);
    }
  };

  const handleLoadGame = (data: SaveSlotData) => {
    setPlayer(data.player);
    setPositions(data.positions || []);
    if (data.assetQuote) setAssetQuote(data.assetQuote);
    if (data.terminalLog) setTerminalLog(data.terminalLog);
    setCurrentView('MAP');
    setShowSaveModal(false);
    setTerminalLog(prev => [...prev.slice(-10), `◈ RESTORED: ${data.saveName} • Path ${data.player.currentPath} • Protections ${data.player.grahamProtections.length}`]);
  };

  const handleSelectUndervaluedChoice = (choiceIdx: number) => {
    if (!activeUndervaluedAsset) return;
    const choice = activeUndervaluedAsset.choices[choiceIdx];
    setPlayer(prev => {
      let newFlorins = prev.florins - choice.costFlorins + choice.florinsGain;
      let newMax = prev.maxHearts;
      if (choice.awardsHeartContainer) newMax = Math.min(10, prev.maxHearts + 1);
      const newHearts = Math.max(0, Math.min(newMax, prev.hearts + choice.heartsEffect));
      const newTier = newMax >= 7 ? 3 : newMax >= 5 ? 2 : 1;
      let trader = prev.pathScores.trader + (choice.pathScore?.trader || 0);
      let investor = prev.pathScores.investor + (choice.pathScore?.investor || 0);
      let path: PlayerPath = prev.currentPath;
      if (trader > investor + 2) path = 'TRADER';
      else if (investor > trader + 2) path = 'INVESTOR';
      else if (trader > 0 && investor > 0) path = 'HYBRID';
      const newRelics = choice.relicReward ? [...prev.relics, choice.relicReward] : prev.relics;
      return {
        ...prev,
        florins: newFlorins,
        maxHearts: newMax,
        hearts: choice.awardsHeartContainer ? newMax : newHearts,
        hp: Math.round(newHearts * 25),
        investorTier: newTier,
        undervaluedAssetsDiscovered: [...prev.undervaluedAssetsDiscovered, activeUndervaluedAsset.id],
        pathScores: { trader, investor },
        currentPath: path,
        relics: newRelics,
        totalValueInvested: prev.totalValueInvested + choice.costFlorins,
        oracleBondLevel: Math.min(5, prev.oracleBondLevel + 0.2)
      };
    });
    if (choice.spotShiftPercent) {
      setAssetQuote(prev => ({ ...prev, spotPrice: Number((prev.spotPrice * (1 + choice.spotShiftPercent)).toFixed(2)) }));
    }
    setTerminalLog(prev => [...prev.slice(-10), `◈ VALUE DISCOVERY: ${choice.title} ${choice.florinsGain >=0?'+':''}${choice.florinsGain}ƒ • Path ${choice.pathScore ? JSON.stringify(choice.pathScore) : ''} • Relic ${choice.relicReward || 'none'}`]);
    setActiveUndervaluedAsset(null);
  };

  const handleFallForScam = () => {
    if (!activeScamEncounter) return;
    const scam = activeScamEncounter;
    setPlayer(prev => {
      const lostFlorins = scam.costFlorins;
      const lostHearts = scam.temptationOutcome.heartsLost;
      const finalHearts = Math.max(0, prev.hearts - lostHearts);
      const failRec: FailedTradeRecord = {
        id: `fail_${Date.now()}`,
        reason: scam.temptationOutcome.failReason,
        strategy: 'LONG_CALL',
        lossFlorins: lostFlorins,
        day: prev.day,
        lessonId: scam.temptationOutcome.lessonId
      };
      return {
        ...prev,
        florins: Math.max(100, prev.florins - lostFlorins),
        hearts: finalHearts,
        hp: Math.round(finalHearts * 25),
        scamsFallen: [...prev.scamsFallen, scam.id],
        failedTrades: [...prev.failedTrades, failRec],
        failedTradesCount: prev.failedTradesCount + 1,
        flawlessTradesStreak: 0
      };
    });
    setTerminalLog(prev => [...prev.slice(-10), `🚨 RUG PULL: Fell for ${scam.title}! -${scam.temptationOutcome.heartsLost}♥ -${scam.costFlorins}ƒ • Fail->Graham loop: ${scam.temptationOutcome.lessonId}`]);
    if (!player.grahamProtections.includes(activeScamEncounter.temptationOutcome.lessonId)) {
      setSanctuaryReason(activeScamEncounter.temptationOutcome.failReason);
      setSanctuaryLessonId(activeScamEncounter.temptationOutcome.lessonId);
      setTimeout(() => setShowSanctuary(true), 800);
    }
  };

  const handleRejectScam = () => {
    if (!activeScamEncounter) return;
    const scam = activeScamEncounter;
    setPlayer(prev => {
      let trader = prev.pathScores.trader + (scam.rejectionOutcome.pathScore?.trader || 0);
      let investor = prev.pathScores.investor + (scam.rejectionOutcome.pathScore?.investor || 0);
      let path: PlayerPath = prev.currentPath;
      if (trader > investor + 2) path = 'TRADER';
      else if (investor > trader + 2) path = 'INVESTOR';
      else if (trader > 0 && investor > 0) path = 'HYBRID';
      const newProtections = scam.rejectionOutcome.protectionGranted && !prev.grahamProtections.includes(scam.rejectionOutcome.protectionGranted)
        ? [...prev.grahamProtections, scam.rejectionOutcome.protectionGranted]
        : prev.grahamProtections;
      return {
        ...prev,
        florins: prev.florins + scam.rejectionOutcome.rewardFlorins,
        scamsAvoided: [...prev.scamsAvoided, scam.id],
        pathScores: { trader, investor },
        currentPath: path,
        grahamProtections: newProtections,
        oracleBondLevel: Math.min(5, prev.oracleBondLevel + 0.15),
        positionSizeDiscipline: Math.min(100, prev.positionSizeDiscipline + 3)
      };
    });
    setTerminalLog(prev => [...prev.slice(-10), `✅ DISCIPLINED: Exposed ${scam.title}! +${scam.rejectionOutcome.rewardFlorins}ƒ • ${scam.rejectionOutcome.rewardWisdom} • Protection ${scam.rejectionOutcome.protectionGranted || 'none'}`]);
  };

  const handleReviveInSanctuary = (lessonId?: GrahamProtectionId) => {
    sound.playHeartContainer();
    const granted = lessonId || sanctuaryLessonId;
    setPlayer(prev => {
      const newProtections = prev.grahamProtections.includes(granted) ? prev.grahamProtections : [...prev.grahamProtections, granted];
      return {
        ...prev,
        hearts: prev.maxHearts,
        hp: Math.round(prev.maxHearts * 25),
        florins: Math.max(1500, prev.florins),
        intelligentInvestorRevivals: prev.intelligentInvestorRevivals + 1,
        sanctuaryLessonsCompleted: prev.sanctuaryLessonsCompleted + 1,
        grahamProtections: newProtections,
        oracleBondLevel: Math.min(5, prev.oracleBondLevel + 0.3),
        positionSizeDiscipline: Math.min(100, prev.positionSizeDiscipline + 10)
      };
    });
    setShowSanctuary(false);
    setSanctuaryReason(null);
    setCurrentView('MAP');
    setTerminalLog(prev => [...prev.slice(-10), `◈ BLESSED BY GRAHAM! All ${player.maxHearts}♥ restored + Margin of Safety! Permanent protection ${granted} unlocked! Cannot be held hostage by that mistake again! Oracle Bond +0.3!`]);
  };

  const handleRestart = () => {
    sound.playCommandBeep();
    setPlayer({
      name: 'Valen',
      title: 'Orphan of Whispering Grove',
      avatar: { tunicColor: 'green', hairColor: 'blonde', shieldStyle: 'hylian', avatarTitle: 'Hero of Valuaria - Oracle Bonded' },
      hearts: 4.0,
      maxHearts: 4,
      successfulTradesCount: 0,
      failedTradesCount: 0,
      investorTier: 1,
      hp: 100,
      maxHp: 100,
      mana: 50,
      maxMana: 50,
      florins: 10000,
      stockShares: 50,
      portfolioValue: 10000,
      marginUsed: 0,
      marginLimit: 16000,
      netDelta: 0,
      netGamma: 0,
      netTheta: 0,
      netVega: 0,
      riskScore: 10,
      chapter: 1,
      day: 1,
      mapX: 5,
      mapY: 4,
      facing: 'DOWN',
      potions: { healthElixir: 2, ivStabilizer: 1, timeHourglass: 1 },
      relics: ['Black-Scholes Slate', 'Wooden Value Shield'],
      relicDetails: [],
      undervaluedAssetsDiscovered: [],
      scamsFallen: [],
      scamsAvoided: [],
      intelligentInvestorRevivals: 0,
      grahamProtections: [],
      failedTrades: [],
      pathScores: { trader: 0, investor: 0 },
      currentPath: 'UNDECIDED',
      oracleBondLevel: 1,
      positionSizeDiscipline: 50,
      kellyFraction: 0.25,
      totalValueInvested: 0,
      totalPremiumCollected: 0,
      flawlessTradesStreak: 0,
      peakEquity: 0,
      maxDrawdownPct: 0,
      sanctuaryLessonsCompleted: 0,
      heldThroughNoise: false,
      survivedCrash: false
    });
    setPositions([]);
    setAssetQuote({
      symbol: '$AETH',
      name: 'Crown Index of Aethelgard',
      spotPrice: 100.0,
      previousClose: 99.5,
      iv: 0.28,
      trend: 'BULLISH',
      lore: 'Sovereign underlying powering economic currents of Valuaria. Oracle Stone reveals true worth.'
    });
    setCurrentView('INTRO');
    setActiveModal(null);
    setShowSanctuary(false);
    setSanctuaryReason(null);
  };

  const themeClassMap: { [key in DOSTheme]: string } = {
    green: 'text-[#f3e9c9] bg-[#0a0e1d]',
    amber: 'text-[#f3e9c9] bg-[#0a0e1d]',
    vga: 'text-[#f3e9c9] bg-[#0a0e1d]',
    cyber: 'text-[#f3e9c9] bg-[#0a0e1d]',
    snes: 'text-[#f3e9c9] bg-[#0a0e1d]'
  };

  return (
    <div className={`min-h-screen ${themeClassMap[theme]} relative transition-colors duration-200 font-snes`}>
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-amber-500/[0.03] via-transparent to-sky-500/[0.03] z-0" />
      <div className="max-w-6xl mx-auto p-2 sm:p-4 min-h-screen flex flex-col justify-between relative z-10">
        <DOSHeader
          theme={theme}
          setTheme={setTheme}
          player={player}
          currentView={currentView}
          setView={setCurrentView}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          isBgmOn={isBgmOn}
          toggleBgm={() => {
            const nowPlaying = sound.toggleMusic(combatState.inCombat ? 'battle' : 'overworld');
            setIsBgmOn(nowPlaying);
          }}
          onAdvanceDay={handleAdvanceDay}
          onOpenSaveModal={() => {
            setSaveModalMode('SAVE');
            setIsAtSaveShrine(false);
            setShowSaveModal(true);
          }}
        />

        {currentView !== 'INTRO' && (
          <div className="mb-2">
            <ZeldaHeartsHUD
              player={player}
              asset={assetQuote}
              onOpenTrade={() => { setActiveModal('TRADE'); setCurrentView('ORACLE_LEDGER'); }}
              onOpenPortfolio={() => { setActiveModal('PORTFOLIO'); setCurrentView('PORTFOLIO'); }}
              onOpenGrimoire={() => { setActiveModal('GRIMOIRE'); setCurrentView('GRIMOIRE'); }}
              onAdvanceDay={handleAdvanceDay}
            />
            {/* Wiring 2: margin utilization meter + danger warning banner */}
            {(player.marginUsed > 0 || player.relics.includes('Margin Boots')) && (
              <div className="flex justify-end px-2 -mt-1">
                <MarginMeter
                  marginUsed={player.marginUsed}
                  marginLimit={player.marginLimit}
                  equity={marginEquity}
                  warning={marginWarning}
                  onDismissWarning={() => setMarginWarning(null)}
                />
              </div>
            )}
          </div>
        )}

        <main className="flex-1 my-1">
          {currentView === 'INTRO' && (
            <TitleScreen
              onNewGame={() => {
                sound.playFanfare();
                sound.startMusic('overworld');
                setIsBgmOn(true);
                setCurrentView('MAP');
                setTerminalLog(prev => [...prev.slice(-10), `◈ QUEST START: Valen enters Whispering Grove. Oracle Stone bonded. Path ${player.currentPath}. Graham protections ${player.grahamProtections.length}.`]);
              }}
              onContinue={() => { sound.playKeyClick(); setSaveModalMode('LOAD'); setIsAtSaveShrine(false); setShowSaveModal(true); }}
              onAbout={() => setActiveModal('GRIMOIRE')}
            />
          )}

          {currentView === 'MAP' && (
            <>
              {/* OVERWORLD — the primary game space (principal directive): talk to NPCs,
                  see story, prepare; dungeons are DESTINATIONS entered via PORTAL markers. */}
              <ZeldaOverworldCanvas
                act={player.chapter}
                player={player}
                asset={assetQuote}
                onMove={handleOverworldMove}
                onInteractEntity={handleInteractEntity}
                onSwordSlash={() => sound.playSwordSlash()}
              />
            </>
          )}

          {currentView === 'DUNGEON' && (() => {
            const dun = DUNGEONS[player.chapter] || DUNGEONS[1];
            return (
              <>
                <DungeonView
                  map={dun.tiles}
                  spawn={dun.playerSpawn}
                  actLabel={dun.actLabel}
                  lightRadius={dun.lightRadius}
                  torchDrainPerSec={dun.torchDrainPerSec}
                  patrols={dun.patrols}
                  gatesOpen={spreadLegsPlaced.length >= 2}
                  onPatrolCaught={(pid) => {
                    // ACT VERB (Act III): getting SEEN by a patrolling scammer forces a bad trade.
                    setPlayer(prev => ({
                      ...prev,
                      florins: Math.max(0, prev.florins - 350),
                      hearts: Math.max(0.5, prev.hearts - 0.5),
                      hp: Math.round(Math.max(0.5, prev.hearts - 0.5) * 25)
                    }));
                    setTerminalLog(prev => [...prev.slice(-10), `🚨 SEEN by a patrolling scammer! Forced into a bad trade: -350ƒ -0.5♥ • The lesson: approach unseen, or don't approach. (Avoidance is a skill.)`]);
                  }}
                  encounters={dungeonEncounters}
                  onEncounter={(id) => {
                    if (id.startsWith('chart-room-')) {
                      const idx = parseInt(id.split('-')[2], 10);
                      sound.playSecretChime();
                      setActiveChartPuzzle(chartPuzzles[idx % chartPuzzles.length]);
                      return;
                    }
                    // ACT VERB (Act II): spread-gate leg shrines — combine two legs to open the gates.
                    if (id === 'gate-leg-call' || id === 'gate-leg-put') {
                      const leg = id === 'gate-leg-call' ? 'call' : 'put';
                      setSpreadLegsPlaced(prev => {
                        if (prev.includes(leg)) return prev;
                        const next = [...prev, leg];
                        if (next.length >= 2) {
                          sound.playFanfare();
                          setTerminalLog(prev2 => [...prev2.slice(-10), `🔑 VERTICAL SPREAD COMBINED — long call + short put! The violet gates grind open. Defined-risk structure is the key.`]);
                        } else {
                          sound.playSecretChime();
                          setTerminalLog(prev2 => [...prev2.slice(-10), `🔑 Leg 1/2 placed (${leg === 'call' ? 'long call' : 'short put'}). One leg alone opens nothing — a spread needs BOTH legs.`]);
                        }
                        return next;
                      });
                      return;
                    }
                    // ACT VERB (Act V): gauntlet order enforcement.
                    if (id.startsWith('gauntlet-')) {
                      const round = parseInt(id.split('-')[1], 10);
                      if (round !== gauntletProgress + 1) {
                        sound.playAlarmSound();
                        setTerminalLog(prev => [...prev.slice(-10), `⛓ The gauntlet seals the door — Round ${gauntletProgress + 1} first. No sanctuary, no skipping: the exam is the order.`]);
                        return;
                      }
                      gauntletRoundRef.current = round;
                      sound.startMusic('battle');
                      setTerminalLog(prev => [...prev.slice(-10), `⚔ GAUNTLET ROUND ${round}/5: ${GAUNTLET_BOSSES[round - 1]} returns, stronger. No sanctuary between rounds.`]);
                      initiateCombat(5);
                      return;
                    }
                    if (id === 'boss_vex' && player.chapter === 5) {
                      if (gauntletProgress < 4) {
                        sound.playAlarmSound();
                        setTerminalLog(prev => [...prev.slice(-10), `⛓ Vex's door is sealed. The gauntlet must be completed: ${gauntletProgress}/4 rematches survived.`]);
                        return;
                      }
                      gauntletRoundRef.current = 5;
                      initiateCombat(5);
                      return;
                    }
                    const mapData = ZELDA_MAPS[player.chapter] || ZELDA_MAPS[1];
                    const found = mapData.entities.find(e => e.id === id);
                    if (found) handleInteractEntity(found);
                  }}
                />
                <TouchDPad
                  onMove={() => { /* dungeon moves via WASD on keyboard; D-pad click = interact */ }}
                  onAction={() => { /* interaction handled by DungeonView [E] */ }}
                  onSecondary={() => { }}
                />
                <div className="mt-2 flex justify-center">
                  <button onClick={() => { sound.playSecretChime(); setCurrentView('MAP'); setTerminalLog(prev => [...prev.slice(-10), `🕳 You climb the stairs back to the overworld.`]); }} className="snes-btn px-6 py-2 rounded-xl text-xs">
                    ◀ LEAVE DUNGEON • Return to Overworld
                  </button>
                </div>
              </>
            );
          })()}

          {currentView === 'COMBAT' && (
            <ZeldaCombatModal
              combat={combatState}
              player={player}
              positions={positions}
              onExecutePuzzleAttack={handlePuzzleAttack}
              onShieldBlock={handleCombatShield}
              onUseItem={handleCombatItem}
              onFlee={() => {
                sound.playAlarmSound();
                sound.startMusic('dungeon');
                setPlayer(prev => ({ ...prev, florins: Math.max(100, prev.florins - 200), hearts: Math.max(0.5, prev.hearts - 0.5) }));
                setCurrentView('MAP');
                setTerminalLog(prev => [...prev.slice(-10), `◈ RETREAT! Lost 200ƒ +0.5♥ • Sometimes NO trade is best trade - Kelly wisdom`]);
              }}
            />
          )}

          {(currentView === 'ORACLE_LEDGER' || currentView === 'TRADE_DESK') && (
            <TradeDeskModal
              player={player}
              asset={assetQuote}
              onExecuteTrade={handleExecuteTrade}
              onClose={() => { setActiveModal(null); setCurrentView('MAP'); }}
            />
          )}

          {currentView === 'PORTFOLIO' && (
            <PortfolioLedgerModal
              player={player}
              positions={positions}
              asset={assetQuote}
              onClosePosition={handleClosePosition}
              onExercisePosition={handleExercisePosition}
              onClose={() => { setActiveModal(null); setCurrentView('MAP'); }}
              riskCategory={riskInfo.riskCategory}
              riskScore={riskInfo.riskScore}
            />
          )}

          {currentView === 'GRIMOIRE' && (
            <GrimoireModal
              onAwardFlorins={(amount) => {
                sound.playCoinSound();
                setPlayer(prev => ({ ...prev, florins: prev.florins + amount }));
                setTerminalLog(prev => [...prev.slice(-10), `◈ TRIAL SOLVED: Mastered options rune! +${amount}ƒ • Oracle Bond +0.1`]);
                setPlayer(prev => ({ ...prev, oracleBondLevel: Math.min(5, prev.oracleBondLevel + 0.1) }));
              }}
              onClose={() => { setActiveModal(null); setCurrentView('MAP'); }}
            />
          )}

          {currentView === 'INVENTORY' && (
            <InventoryModal
              player={player}
              earnedBadgeIds={earnedBadgeIds}
              onUseItem={(itemType) => {
                if (player.potions[itemType] <=0) return;
                sound.playSecretChime();
                setPlayer(prev => {
                  let h = prev.hearts;
                  if (itemType === 'healthElixir') h = Math.min(prev.maxHearts, prev.hearts + 2.0);
                  else if (itemType === 'ivStabilizer') h = Math.min(prev.maxHearts, prev.hearts + 1.0);
                  else h = Math.min(prev.maxHearts, prev.hearts + 0.8);
                  return { ...prev, hearts: h, hp: Math.round(h*25), potions: { ...prev.potions, [itemType]: prev.potions[itemType]-1 } };
                });
              }}
              onClose={() => setCurrentView('MAP')}
            />
          )}

          {currentView === 'VICTORY' && (() => {
            // Seal of Discipline judgment (luna-pro memo):
            const survivalSeal = player.chapter >= 5; // all five act bosses defeated (quest state)
            const knowledgeSeal = player.grahamProtections.length >= TOTAL_CURRICULUM_LESSONS;
            const competenceSeal = vaultResult?.win === true;
            const allSeals = survivalSeal && knowledgeSeal && competenceSeal;
            const seals = [
              { name: 'SURVIVAL', earned: survivalSeal, desc: 'All five guardians defeated' },
              { name: 'KNOWLEDGE', earned: knowledgeSeal, desc: `All ${TOTAL_CURRICULUM_LESSONS} curriculum runes earned (${player.grahamProtections.length}/${TOTAL_CURRICULUM_LESSONS})` },
              { name: 'COMPETENCE', earned: competenceSeal, desc: vaultResult ? `Proving Vault: end ${Math.round(vaultResult.endEquity).toLocaleString()}ƒ vs start ${Math.round(vaultResult.startEquity).toLocaleString()}ƒ • max dd ${vaultResult.maxDrawdownPct.toFixed(1)}%${vaultResult.liquidated ? ' • LIQUIDATED' : ''}` : 'Proving Vault not attempted' },
            ];
            return (
            <div className={`zelda-panel p-8 text-center flex flex-col items-center justify-center min-h-[65vh] rounded-xl ${allSeals ? 'border-amber-400' : 'border-slate-500'}`}>
              <div className="oracle-glyph w-20 h-20 mb-3">
                <Crown className={`w-8 h-8 ${allSeals ? 'text-amber-400' : 'text-slate-400'}`} />
              </div>
              <Award className={`w-16 h-16 mb-2 ${allSeals ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
              <h2 className="font-cinzel text-2xl font-bold uppercase tracking-widest text-amber-200">
                {allSeals ? 'THE SEAL OF DISCIPLINE — CROWN OF THE RICHEST INVESTOR!' : 'THE JUDGMENT OF THE THREE SEALS'}
              </h2>
              <div className="oracle-rune-glow text-sm mt-1">
                {allSeals ? 'TRUE ENDING • All three seals earned' : allSeals === false && competenceSeal && survivalSeal ? 'INCOMPLETE • The Knowledge seal is missing' : 'INCOMPLETE • The Competence seal is missing'}
              </div>

              <div className="grid grid-cols-3 gap-2 my-4 w-full max-w-xl">
                {seals.map(s => (
                  <div key={s.name} className={`p-3 rounded-xl border ${s.earned ? 'bg-amber-950/40 border-amber-400/60' : 'bg-slate-900/60 border-slate-600/40 opacity-70'}`}>
                    <div className={`text-2xl ${s.earned ? '' : 'grayscale'}`}>{s.earned ? '🔮' : '🔒'}</div>
                    <div className={`font-cinzel text-xs mt-1 ${s.earned ? 'text-amber-200' : 'text-slate-400'}`}>SEAL OF {s.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{s.desc}</div>
                  </div>
                ))}
              </div>

              <div className="max-w-2xl my-2 space-y-3 text-left bg-slate-900/80 p-4 rounded-xl border border-amber-500/30">
                {allSeals ? (
                  <p className="text-sm leading-relaxed text-slate-200">
                    The Oracle places the <strong className="text-amber-300">Crown of the Richest Investor</strong> upon your head. Path <strong className="text-sky-300">{player.currentPath}</strong>, {player.maxHearts} Heart Containers, {player.grahamProtections.length} Graham Protections, Oracle Bond Lv {player.oracleBondLevel.toFixed(1)}/5, worst drawdown {player.maxDrawdownPct.toFixed(1)}%. You survived the guardians, learned every rune, and passed the Vault's 60-day trial — profitable, never past 25% drawdown, never liquidated. Marduk Vex kneels: he once valued margin of safety; one ruinous year broke him. You out-disciplined him, and the Vault proves it was not luck. <em>Rich is survival first, growth after safety.</em>
                  </p>
                ) : !competenceSeal ? (
                  <p className="text-sm leading-relaxed text-slate-200">
                    Marduk Vex is defeated, but the Oracle does not crown you. The <strong className="text-red-300">Proving Vault</strong> spoke: {vaultResult?.liquidated ? 'you were liquidated — leverage ate the account.' : vaultResult && vaultResult.maxDrawdownPct >= 25 ? `your drawdown reached ${vaultResult.maxDrawdownPct.toFixed(1)}% — you gambled through the crash.` : vaultResult ? `you finished below your starting equity (${Math.round(vaultResult.endEquity).toLocaleString()}ƒ < ${Math.round(vaultResult.startEquity).toLocaleString()}ƒ) — the tape outran you.` : 'it was never attempted.'} Survival and study mean nothing if the hands cannot be trusted with real florins. Return, discipline your sizing, and face the Vault again.
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed text-slate-200">
                    The Vault bowed to your discipline — end {Math.round(vaultResult!.endEquity).toLocaleString()}ƒ, drawdown held under 25%, never liquidated. But the <strong className="text-sky-300">Knowledge seal</strong> is unfinished: {player.grahamProtections.length} of {TOTAL_CURRICULUM_LESSONS} curriculum runes earned. A trader who wins without understanding why will one day meet a market that takes it all back. Walk the Sanctuary, learn the missing runes, and return for the crown.
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-black/40 border border-amber-500/20 rounded">Trader Score: {player.pathScores.trader} • Aggressive but defined-risk</div>
                  <div className="p-2 bg-black/40 border border-green-500/20 rounded">Investor Score: {player.pathScores.investor} • Slow value-first</div>
                  <div className="p-2 bg-black/40 border border-sky-500/20 rounded">Graham Shields: {player.grahamProtections.length}/{TOTAL_CURRICULUM_LESSONS} • Max DD {player.maxDrawdownPct.toFixed(1)}%</div>
                  <div className="p-2 bg-black/40 border border-purple-500/20 rounded">Premium Collected: {player.totalPremiumCollected.toLocaleString()}ƒ • Discipline {player.positionSizeDiscipline}/100</div>
                </div>
                <div className="text-[11px] text-amber-200/60">
                  Multiple paths same ending: trader-heavy vs value-heavy vs hybrid converging on same true end — the crown reached only through the three seals. Design pillar: discipline, not luck.
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleRestart} className="snes-btn-primary px-6 py-3 flex items-center gap-2 rounded-xl">
                  <Play className="w-4 h-4" />
                  <span>NEW GAME+ • NEW SEED • NEW PATH?</span>
                </button>
                <button onClick={() => setCurrentView('MAP')} className="snes-btn px-6 py-3 rounded-xl">EXPLORE MORE</button>
              </div>
            </div>
            );
          })()}

          {currentView === 'PROVING_VAULT' && (
            <ProvingVaultModal
              startEquity={Math.max(1000, portfolioAnalysis.totalEquity)}
              onComplete={(result) => {
                setVaultResult(result);
                sound.playFanfare();
                setCurrentView('VICTORY');
              }}
            />
          )}
        </main>

        <footer className="mt-2">
          <TerminalCommandLine
            onCommand={(cmd) => {
              const command = cmd.trim().toUpperCase();
              if (command === 'HELP') {
                setTerminalLog(prev => [...prev.slice(-10), '◈ ORACLE COMMANDS: LEDGER, PORTFOLIO, CODEX, MAP, INVENTORY, REST, STATUS • Fail->Graham loop active • Path matters']);
              } else if (command === 'LEDGER' || command === 'TRADE') {
                setActiveModal('TRADE'); setCurrentView('ORACLE_LEDGER');
              } else if (command === 'PORTFOLIO' || command === 'BAG') {
                setActiveModal('PORTFOLIO'); setCurrentView('PORTFOLIO');
              } else if (command === 'CODEX' || command === 'GRIMOIRE') {
                setActiveModal('GRIMOIRE'); setCurrentView('GRIMOIRE');
              } else if (command === 'INVENTORY' || command === 'INV') {
                setCurrentView('INVENTORY');
              } else if (command === 'REST') {
                handleAdvanceDay();
              } else {
                setTerminalLog(prev => [...prev.slice(-10), `◈ Oracle whispers: Command "${cmd}" processed. Bond Lv ${player.oracleBondLevel.toFixed(1)} • Path ${player.currentPath}`]);
              }
            }}
            outputLog={terminalLog}
          />
        </footer>

        {activeUndervaluedAsset && (
          <UndervaluedAssetModal
            asset={activeUndervaluedAsset}
            player={player}
            onSelectChoice={handleSelectUndervaluedChoice}
            onClose={() => setActiveUndervaluedAsset(null)}
          />
        )}

        {activeScamEncounter && (
          <RugPullLessonModal
            scam={activeScamEncounter}
            player={player}
            onFallForScam={handleFallForScam}
            onRejectScam={handleRejectScam}
            onClose={() => setActiveScamEncounter(null)}
          />
        )}

        {showSanctuary && (
          <IntelligentInvestorSanctuaryModal
            player={player}
            forcedLessonId={sanctuaryLessonId}
            failReason={sanctuaryReason || undefined}
            onRevive={handleReviveInSanctuary}
            onClose={() => {}}
          />
        )}

        {npcDialogue && (
          <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="zelda-panel w-full max-w-xl p-4 space-y-3 shadow-2xl rounded-xl">
              <div className="flex items-center justify-between border-b-2 border-amber-500/30 pb-2">
                <span className="font-cinzel text-amber-200 text-sm flex items-center gap-2">
                  <div className="oracle-glyph w-6 h-6"><div className="oracle-emerald-core w-2 h-2" /></div>
                  {npcDialogue.name}
                </span>
                <button onClick={() => { setNpcDialogue(null); setPlayer(prev => ({ ...prev, oracleBondLevel: Math.min(5, prev.oracleBondLevel + 0.1) })); }} className="snes-btn px-2 py-1 text-xs rounded-md">[ESC] CLOSE</button>
              </div>
              <div className="space-y-2 text-sm leading-relaxed text-slate-200 font-snes flex gap-3">
                {npcDialogue.portrait && (
                  <img src={npcDialogue.portrait} alt={npcDialogue.name} className="w-24 h-24 shrink-0 rounded-lg border-2 border-amber-500/50 bg-black/60 object-contain" style={{ imageRendering: 'pixelated' }} />
                )}
                <div className="space-y-2">
                {npcDialogue.lines.map((line, idx) => (
                  <p key={idx} className="italic">{line}</p>
                ))}
                {npcDialogue.lore && <p className="text-[11px] text-amber-200/50 italic border-l-2 border-amber-500/30 pl-2">{npcDialogue.lore}</p>}
                </div>
              </div>
              <button onClick={() => { setNpcDialogue(null); setPlayer(prev => ({ ...prev, oracleBondLevel: Math.min(5, prev.oracleBondLevel + 0.1) })); }} className="snes-btn-primary w-full py-2.5 text-sm rounded-xl">CONTINUE [SPACE] • Oracle Bond +0.1</button>
            </div>
          </div>
        )}

        {mechanicGate && (() => {
          const { lesson, challenge } = getTradeMechanicGate(player.day);
          return (
            <OptionsMechanicGate
              lesson={lesson}
              challenge={challenge}
              onPass={handleMechanicPass}
              onFail={handleMechanicFail}
              onClose={() => { setMechanicGate(null); setCurrentView('MAP'); }}
            />
          );
        })()}

        {activeModal === 'TRADE' && currentView !== 'ORACLE_LEDGER' && (
          <TradeDeskModal
            player={player}
            asset={assetQuote}
            onExecuteTrade={handleExecuteTrade}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'PORTFOLIO' && currentView !== 'PORTFOLIO' && (
          <PortfolioLedgerModal
            player={player}
            positions={positions}
            asset={assetQuote}
            onClosePosition={handleClosePosition}
            onExercisePosition={handleExercisePosition}
            onClose={() => setActiveModal(null)}
            riskCategory={riskInfo.riskCategory}
            riskScore={riskInfo.riskScore}
          />
        )}

        {activeModal === 'GRIMOIRE' && currentView !== 'GRIMOIRE' && (
          <GrimoireModal
            onAwardFlorins={(amount) => {
              sound.playCoinSound();
              setPlayer(prev => ({ ...prev, florins: prev.florins + amount }));
              setTerminalLog(prev => [...prev.slice(-10), `◈ TRIAL SOLVED: Mastered options rune! +${amount}ƒ • Oracle Bond +0.1`]);
              setPlayer(prev => ({ ...prev, oracleBondLevel: Math.min(5, prev.oracleBondLevel + 0.1) }));
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {/* Wiring 1: market noise ticker popup */}
        {activeNoise && <NoiseTicker event={activeNoise} onChoose={handleNoiseChoice} />}

        {/* Wiring 3: full-screen badge fanfare */}
        {fanfareBadge && (
          <BadgeFanfare badge={fanfareBadge} onDismiss={() => setFanfareBadge(null)} />
        )}

        {/* Wiring 4: chart puzzle room */}
        {activeChartPuzzle && (
          <ChartPuzzleModal
            puzzle={activeChartPuzzle}
            onAnswer={handleChartPuzzleAnswer}
            onLeave={() => setActiveChartPuzzle(null)}
          />
        )}

        {activeModal === 'QUEST' && activeQuest && (
          <StoryDialogModal
            quest={activeQuest}
            playerFlorins={player.florins}
            onChoiceSelect={(choice) => {
              if (choice.action) {
                setPlayer(prev => {
                  const copy = { ...prev, pathScores: { ...prev.pathScores } } as any;
                  choice.action!(copy);
                  let trader = copy.pathScores.trader + (choice.pathScore?.trader || 0);
                  let investor = copy.pathScores.investor + (choice.pathScore?.investor || 0);
                  let path: PlayerPath = copy.currentPath;
                  if (trader > investor + 2) path = 'TRADER';
                  else if (investor > trader + 2) path = 'INVESTOR';
                  else if (trader > 0 && investor > 0) path = 'HYBRID';
                  copy.pathScores = { trader, investor };
                  copy.currentPath = path;
                  return copy;
                });
              }
              setActiveModal(null);
              setActiveQuest(null);
            }}
            onClose={() => { setActiveModal(null); setActiveQuest(null); }}
          />
        )}

        {showSaveModal && (
          <SaveGameModal
            player={player}
            positions={positions}
            assetQuote={assetQuote}
            terminalLog={terminalLog}
            initialMode={saveModalMode}
            isAtShrine={isAtSaveShrine}
            onLoadGame={handleLoadGame}
            onClose={() => setShowSaveModal(false)}
          />
        )}
      </div>
    </div>
  );
}
