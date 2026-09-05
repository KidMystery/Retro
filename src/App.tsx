/**
 * Legend of Valuaria: Myth & Margin
 * 16-bit SNES RPG - Zelda found a Bloomberg terminal (as Oracle's Ledger)
 * Core mechanic: Fail options -> learn value investing (Graham loop) + Multiple paths
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { ZELDA_MAPS, ZeldaEntity } from './lib/zeldaWorldData';
import { UNDERVALUED_ASSETS } from './lib/undervaluedAssetsData';
import { SCAM_ENCOUNTERS } from './lib/scamsData';
import { INTELLIGENT_INVESTOR_LESSONS } from './lib/intelligentInvestorData';
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
import { ZeldaCombatModal } from './components/ZeldaCombatModal';
import { UndervaluedAssetModal } from './components/UndervaluedAssetModal';
import { RugPullLessonModal } from './components/RugPullLessonModal';
import { IntelligentInvestorSanctuaryModal } from './components/IntelligentInvestorSanctuaryModal';
import { TradeDeskModal } from './components/TradeDeskModal';
import { PortfolioLedgerModal } from './components/PortfolioLedgerModal';
import { GrimoireModal } from './components/GrimoireModal';
import { StoryDialogModal } from './components/StoryDialogModal';
import { TerminalCommandLine } from './components/TerminalCommandLine';
import { AvatarCustomizerModal } from './components/AvatarCustomizerModal';
import { SaveGameModal } from './components/SaveGameModal';
import { TouchDPad } from './components/TouchDPad';
import { InventoryModal } from './components/InventoryModal';
import { SaveSlotData, AvatarConfig } from './types';
import { Play, Award, Save, User, Sparkles, Crown, Shield, BookOpen, Coins } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<DOSTheme>('snes');
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmOn, setIsBgmOn] = useState(false);

  const [currentView, setCurrentView] = useState<GameView>('INTRO');
  const [activeModal, setActiveModal] = useState<'TRADE' | 'PORTFOLIO' | 'GRIMOIRE' | 'QUEST' | 'INVENTORY' | null>(null);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveModalMode, setSaveModalMode] = useState<'SAVE' | 'LOAD'>('SAVE');
  const [isAtSaveShrine, setIsAtSaveShrine] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const [activeUndervaluedAsset, setActiveUndervaluedAsset] = useState<UndervaluedAsset | null>(null);
  const [activeScamEncounter, setActiveScamEncounter] = useState<ScamEncounter | null>(null);
  const [showSanctuary, setShowSanctuary] = useState(false);
  const [sanctuaryReason, setSanctuaryReason] = useState<TradeFailReason | null>(null);
  const [sanctuaryLessonId, setSanctuaryLessonId] = useState<GrahamProtectionId>('margin_of_safety');
  const [npcDialogue, setNpcDialogue] = useState<{ name: string; lines: string[]; lore?: string } | null>(null);

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
    flawlessTradesStreak: 0
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
  }, [assetQuote.spotPrice, assetQuote.iv, positions, player.day, player.grahamProtections, portfolioAnalysis.netTheta, triggerSanctuary]);

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
        setCurrentView('VICTORY');
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

  const handleInteractEntity = (entity: ZeldaEntity) => {
    if (entity.type === 'NPC_SAGE') {
      sound.playSecretChime();
      setNpcDialogue({ name: entity.name, lines: entity.dialogue || ['"Margin of Safety, apprentice."'], lore: entity.lore });
    } else if (entity.type === 'NPC_BROKER') {
      sound.playCommandBeep();
      setActiveModal('TRADE');
      setCurrentView('ORACLE_LEDGER');
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

  const handleSaveProfile = (name: string, title: string, avatar: AvatarConfig) => {
    setPlayer(prev => ({ ...prev, name, title, avatar }));
    setTerminalLog(prev => [...prev.slice(-10), `◈ HERO PROFILE: ${name}, ${title}! Oracle Bond Lv ${player.oracleBondLevel}`]);
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
      flawlessTradesStreak: 0
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
          onOpenCustomizeModal={() => setShowCustomizeModal(true)}
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
          </div>
        )}

        <main className="flex-1 my-1">
          {currentView === 'INTRO' && (
            <div className="zelda-panel p-4 sm:p-8 text-center flex flex-col items-center justify-center min-h-[75vh] rounded-xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-sky-500/5 pointer-events-none" />
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="oracle-glyph w-14 h-14">
                  <div className="oracle-emerald-core w-4 h-4" />
                </div>
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[32px] border-b-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
                <div className="oracle-glyph w-14 h-14">
                  <div className="oracle-emerald-core w-4 h-4" />
                </div>
              </div>

              <div className="font-cinzel text-amber-200 text-2xl sm:text-4xl tracking-[0.2em] uppercase mb-1 drop-shadow-md">
                THE LEGEND OF VALUARIA
              </div>
              <div className="oracle-rune-glow text-sm sm:text-base tracking-[0.3em] uppercase mb-1">
                MYTH & MARGIN • 16-BIT SNES RPG
              </div>
              <div className="text-amber-200/50 text-xs tracking-widest uppercase mb-4 font-snes">
                Zelda found a Bloomberg terminal — as Enchanted Oracle Circle
              </div>

              <div className="max-w-2xl w-full bg-slate-900/90 border-2 border-amber-500/50 p-4 rounded-xl my-3 text-left space-y-2 shadow-inner">
                <div className="font-cinzel text-amber-300 text-sm">LOGLINE: A village orphan finds Oracle's lost ledger</div>
                <p className="text-snes-small text-slate-200 leading-relaxed">
                  You are <strong className="text-amber-300">Valen</strong>, orphan of Grove. Village elder's life savings rug-pulled by charm monster same night you find <strong className="text-emerald-300">Oracle's Stone</strong> in forgotten sanctum — carved obsidian altar with floating amber runes and pulsing emerald core. Touching bonds <strong className="text-amber-300">Oracle's Ledger</strong> to soul: floating glyph-circle shows live prices, greeks, portfolio. THIS is wink at Bloomberg — as fantasy divination, not terminal. Quest: master ancient arts of options across five fractured realms before Liquidation Lord's kingdom of unhedged greed swallows world. Not saving princess. Learning to invest.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mt-2">
                  <div className="p-2 bg-red-950/30 border border-red-500/30 rounded">
                    <strong className="text-red-300">❤️ Fail→Graham Loop</strong>
                    <p className="text-slate-300 mt-1">Bad losing trade cracks hearts → Sanctuary of Quiet Oracle → Graham reflection question (margin of safety, Mr Market, investment vs speculation). Cannot leave until correct. Correct = permanent protection vs that mistake.</p>
                  </div>
                  <div className="p-2 bg-amber-950/30 border border-amber-500/30 rounded">
                    <strong className="text-amber-300">⚔️ Multiple Paths Same Crown</strong>
                    <p className="text-slate-300 mt-1">Trader-path (aggressive defined-risk spreads, condors), Investor-path (slow value-first, covered calls), Hybrid. Different quests/bosses still defeated. TRUE end same: crown of richest investor — whichever discipline practiced.</p>
                  </div>
                  <div className="p-2 bg-sky-950/30 border border-sky-500/30 rounded">
                    <strong className="text-sky-300">📚 Olmstead + Graham</strong>
                    <p className="text-slate-300 mt-1">Strategies from Olmstead "Options For Beginner And Beyond" — each unlock = chapter. Failure philosophy from Graham "Intelligent Investor" — sanctuary lessons, scam verdicts, margin of safety.</p>
                  </div>
                </div>
              </div>

              <div className="max-w-md w-full bg-slate-950/80 border-2 border-amber-500/60 p-3.5 rounded-xl my-3 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg border-2 border-amber-400 bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                    <div className="w-7 h-7 rounded-sm" style={{ backgroundColor: player.avatar?.tunicColor === 'red' ? '#b91c1c' : player.avatar?.tunicColor === 'blue' ? '#1d4ed8' : player.avatar?.tunicColor === 'purple' ? '#7e22ce' : player.avatar?.tunicColor === 'black' ? '#334155' : '#2e7d32' }} />
                    <div className="absolute top-1 w-5 h-2 bg-amber-200/90 rounded-xs" />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] text-amber-200/70 font-bold uppercase tracking-widest">Protagonist • Oracle Bonded</div>
                    <div className="font-cinzel text-base text-amber-200 font-bold">{player.name}</div>
                    <div className="text-[11px] text-slate-400 font-snes">{player.avatar?.avatarTitle || player.title} • Path {player.currentPath}</div>
                  </div>
                </div>
                <button onClick={() => setShowCustomizeModal(true)} className="snes-btn px-3 py-1.5 text-xs flex items-center gap-1.5 rounded-md">
                  <User className="w-3.5 h-3.5" />
                  <span>CUSTOMIZE</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-3xl w-full my-3 text-left text-snes-small">
                <div className="p-3 bg-slate-900/90 border-2 border-amber-500/40 rounded-xl">
                  <strong className="text-amber-300 flex items-center gap-1 font-cinzel text-sm"><span className="oracle-glyph w-6 h-6 text-[10px]">ᛟ</span> ORACLE LEDGER</strong>
                  <p className="text-slate-300 mt-1 leading-relaxed text-sm">Enchanted Oracle Circle, not terminal, not CRT. Carved runes, gem facets, glowing sigils on dark stone. Amber/oil-light. Divination lens revealing market truth. Opens from glyph hovering beside hero.</p>
                </div>
                <div className="p-3 bg-slate-900/90 border-2 border-emerald-500/40 rounded-xl">
                  <strong className="text-emerald-300 flex items-center gap-1 font-cinzel text-sm"><span>🧚</span> ART DIRECTION</strong>
                  <p className="text-slate-300 mt-1 leading-relaxed text-sm">Genuine 16-bit SNES Zelda LttP. Crisp pixel tileset, warm saturated palette, dark-stone-and-amber oracle elements. Large chunky readable pixel font for mobile thumb. Warm fantasy OST, not techno.</p>
                </div>
                <div className="p-3 bg-slate-900/90 border-2 border-sky-500/40 rounded-xl">
                  <strong className="text-sky-300 flex items-center gap-1 font-cinzel text-sm"><span>📱</span> MOBILE-FIRST</strong>
                  <p className="text-slate-300 mt-1 leading-relaxed text-sm">Touch D-pad bottom-left, action bottom-right. Oracle Ledger bottom-sheet overlay, big tappable buttons. Landscape overworld, portrait for ledger sheets. One codebase scaling to desktop.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <button
                  onClick={() => {
                    sound.playFanfare();
                    sound.startMusic('overworld');
                    setIsBgmOn(true);
                    setCurrentView('MAP');
                    setTerminalLog(prev => [...prev.slice(-10), `◈ QUEST START: Valen enters Whispering Grove. Oracle Stone bonded. Path ${player.currentPath}. Graham protections ${player.grahamProtections.length}.`]);
                  }}
                  className="snes-btn-primary px-6 py-3.5 text-sm sm:text-base flex items-center gap-2 rounded-xl shadow-lg transform active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>START QUEST • ENTER OVERWORLD</span>
                </button>
                <button onClick={() => { sound.playKeyClick(); setSaveModalMode('LOAD'); setIsAtSaveShrine(false); setShowSaveModal(true); }} className="snes-btn px-5 py-3.5 text-sm flex items-center gap-2 rounded-xl">
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>RESTORE CHRONICLES</span>
                </button>
                <button onClick={() => setActiveModal('GRIMOIRE')} className="snes-btn px-5 py-3.5 text-sm rounded-xl">
                  CODEX
                </button>
              </div>

              <div className="mt-4 text-[11px] text-slate-500 font-snes max-w-2xl">
                Story Beats: Act1 Origin (Grove - Calls/Puts, Delta, SBF + DogeTulip) • Act2 Time (Theta Steppes - Chrono-Sphinx, 0-DTE cost patience+capital, calendar) • Act3 Range (Iron Sanctuary - Crab Golem, Iron Condors, nothing happens is profit) • Act4 Vol (Caldera - Hydra Vega, buy shield when others fire) • Act5 Citadel (Marduk Vex fallen sage, Kelly, NO trade, true ending out-discipline not kill)
              </div>
            </div>
          )}

          {currentView === 'MAP' && (
            <>
              <ZeldaOverworldCanvas
                act={player.chapter}
                player={player}
                asset={assetQuote}
                onMove={handleOverworldMove}
                onInteractEntity={handleInteractEntity}
                onSwordSlash={() => {}}
                onOpenSave={() => { setSaveModalMode('SAVE'); setIsAtSaveShrine(false); setShowSaveModal(true); }}
                onOpenCustomize={() => setShowCustomizeModal(true)}
              />
              <TouchDPad
                onMove={(dir) => {
                  const dirMap = { UP: [0,-1,'UP'], DOWN: [0,1,'DOWN'], LEFT: [-1,0,'LEFT'], RIGHT: [1,0,'RIGHT'] } as const;
                  const [dx,dy,f] = dirMap[dir];
                  handleOverworldMove(player.mapX + (dx as number), player.mapY + (dy as number), f as any);
                }}
                onAction={() => {
                  // try interact nearby else sword
                  const mapData = ZELDA_MAPS[player.chapter] || ZELDA_MAPS[1];
                  const found = mapData.entities.find(e => Math.abs(e.x - player.mapX) + Math.abs(e.y - player.mapY) <= 1.2);
                  if (found) handleInteractEntity(found);
                }}
                onSecondary={() => {
                  const mapData = ZELDA_MAPS[player.chapter] || ZELDA_MAPS[1];
                  const found = mapData.entities.find(e => Math.abs(e.x - player.mapX) + Math.abs(e.y - player.mapY) <= 1.2);
                  if (found) handleInteractEntity(found);
                }}
              />
            </>
          )}

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

          {currentView === 'VICTORY' && (
            <div className="zelda-panel p-8 text-center flex flex-col items-center justify-center min-h-[65vh] rounded-xl border-amber-400">
              <div className="oracle-glyph w-20 h-20 mb-3">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
              <Award className="w-16 h-16 text-amber-400 mb-2 animate-pulse" />
              <h2 className="font-cinzel text-2xl font-bold uppercase tracking-widest text-amber-200">
                TRIUMPH OF THE SOVEREIGN VALUE MASTER!
              </h2>
              <div className="oracle-rune-glow text-sm mt-1">TRUE ENDING • Crown of Richest Investor</div>
              <div className="max-w-2xl my-4 space-y-3 text-left bg-slate-900/80 p-4 rounded-xl border border-amber-500/30">
                <p className="text-sm leading-relaxed text-slate-200">
                  You have completed quest through Valuaria! Path <strong className={player.currentPath === 'TRADER' ? 'text-red-300' : player.currentPath === 'INVESTOR' ? 'text-green-300' : 'text-sky-300'}>{player.currentPath}</strong> with {player.maxHearts} Heart Containers, {player.grahamProtections.length} Graham Protections, Oracle Bond Lv {player.oracleBondLevel.toFixed(1)}/5!
                </p>
                <p className="text-xs leading-relaxed text-slate-300 italic">
                  Final confrontation: Liquidation Lord Marduk Vex, fallen Oracle-Sage who rejected margin of safety for max leverage. You didn't kill him — you out-disciplined him. He confesses he once valued margin of safety, one ruinous year broke him. He sits back down as humble student. Richest investor is one who learned "rich is survival first, growth after safety."
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-black/40 border border-amber-500/20 rounded">Trader Score: {player.pathScores.trader} • Aggressive but defined-risk</div>
                  <div className="p-2 bg-black/40 border border-green-500/20 rounded">Investor Score: {player.pathScores.investor} • Slow value-first</div>
                  <div className="p-2 bg-black/40 border border-sky-500/20 rounded">Graham Shields: {player.grahamProtections.join(', ') || 'None yet'}</div>
                  <div className="p-2 bg-black/40 border border-purple-500/20 rounded">Premium Collected: {player.totalPremiumCollected.toLocaleString()}ƒ • Discipline {player.positionSizeDiscipline}/100</div>
                </div>
                <div className="text-[11px] text-amber-200/60">
                  Multiple paths same ending: trader-heavy vs value-heavy vs hybrid converging on same true end — crown reached by whichever discipline you actually practiced. Design pillar: choice matters, not linear quiz.
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
                <button onClick={() => setNpcDialogue(null)} className="snes-btn px-2 py-1 text-xs rounded-md">[ESC] CLOSE</button>
              </div>
              <div className="space-y-2 text-sm leading-relaxed text-slate-200 font-snes">
                {npcDialogue.lines.map((line, idx) => (
                  <p key={idx} className="italic">{line}</p>
                ))}
                {npcDialogue.lore && <p className="text-[11px] text-amber-200/50 italic border-l-2 border-amber-500/30 pl-2">{npcDialogue.lore}</p>}
              </div>
              <button onClick={() => setNpcDialogue(null)} className="snes-btn-primary w-full py-2.5 text-sm rounded-xl">CONTINUE [SPACE] • Oracle Bond +0.1</button>
            </div>
          </div>
        )}

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

        {showCustomizeModal && (
          <AvatarCustomizerModal
            currentName={player.name}
            currentTitle={player.avatar?.avatarTitle || player.title}
            currentAvatar={player.avatar}
            onSave={handleSaveProfile}
            onClose={() => setShowCustomizeModal(false)}
          />
        )}
      </div>
    </div>
  );
}
