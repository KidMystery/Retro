import React, { useState, useMemo } from 'react';
import { StrategyType, PlayerStats, AssetQuote, OptionContract, GrahamProtectionId } from '../types';
import { calculateBlackScholes, generateAsciiPayoffChart } from '../lib/blackScholes';
import { sound } from '../lib/audioEngine';
import { X, Sparkles, Shield, TrendingUp, Clock, Zap, Coins, BookOpen } from 'lucide-react';

interface TradeDeskModalProps {
  player: PlayerStats;
  asset: AssetQuote;
  onExecuteTrade: (contract: OptionContract, netCost: number, marginReq: number) => void;
  onClose: () => void;
}

// Strategy metadata with Olmstead chapter progression + fantasy lore
const STRATEGY_RUNES: Record<StrategyType, {
  name: string;
  rune: string;
  chapter: number;
  lore: string;
  path: 'TRADER' | 'INVESTOR' | 'HYBRID';
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  icon: React.ReactNode;
  description: string;
}> = {
  LONG_CALL: {
    name: 'Spear of Bullish Light',
    rune: 'ᛚ',
    chapter: 1,
    lore: 'Chapter 1 - Calls & Puts: Direction',
    path: 'TRADER',
    risk: 'MEDIUM',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Leveraged upside with defined loss. Your first rune.'
  },
  LONG_PUT: {
    name: 'Shield of Bearish Warding',
    rune: 'ᛉ',
    chapter: 1,
    lore: 'Chapter 1 - Protective Puts',
    path: 'INVESTOR',
    risk: 'LOW',
    icon: <Shield className="w-4 h-4" />,
    description: 'Crash protection, portfolio insurance.'
  },
  BULL_CALL_SPREAD: {
    name: 'Twin Blades of Defined Risk',
    rune: 'ᛞ',
    chapter: 2,
    lore: 'Chapter 2 - Vertical Spreads',
    path: 'TRADER',
    risk: 'LOW',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Finance your long with a short. Caps both profit & loss.'
  },
  BEAR_PUT_SPREAD: {
    name: 'Duskfall Hedge',
    rune: 'ᛟ',
    chapter: 2,
    lore: 'Chapter 2 - Bear Spreads',
    path: 'TRADER',
    risk: 'LOW',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Bearish defined-risk, low theta bleed.'
  },
  CASH_SECURED_PUT: {
    name: "Merchant's Oath",
    rune: 'ᚠ',
    chapter: 3,
    lore: 'Chapter 3 - Cash-Secured Puts (Buffett-style)',
    path: 'INVESTOR',
    risk: 'LOW',
    icon: <Coins className="w-4 h-4" />,
    description: 'Get paid to buy wonderful businesses at a discount.'
  },
  COVERED_CALL: {
    name: 'Harvest of the Covered Field',
    rune: 'ᛃ',
    chapter: 3,
    lore: 'Chapter 4 - Covered Calls (Income) • Iron Sanctuary',
    path: 'INVESTOR',
    risk: 'LOW',
    icon: <Coins className="w-4 h-4" />,
    description: 'Own 100 shares + sell call for income. Farmer way - Theta Steppes earns.'
  },
  CALENDAR_SPREAD: {
    name: 'Chrono-Sphinx Sands',
    rune: 'ᛝ',
    chapter: 2,
    lore: 'Chapter 3 - Calendar Spreads (Theta) • Theta Steppes',
    path: 'HYBRID',
    risk: 'MEDIUM',
    icon: <Clock className="w-4 h-4" />,
    description: 'Sell near-term decay, buy long-term. Time is your ally - answers 0-DTE cost.'
  },
  IRON_CONDOR: {
    name: 'Iron Bastion of Neutrality',
    rune: 'ᛜ',
    chapter: 3,
    lore: 'Chapter 5 - Iron Condors (Range) • Iron Sanctuary',
    path: 'TRADER',
    risk: 'LOW',
    icon: <Shield className="w-4 h-4" />,
    description: 'Four-legged fortress. Profits when nothing happens - disciplined trader earns.'
  },
  LONG_STRADDLE: {
    name: 'Hydra Shock Vortex',
    rune: 'ᛋ',
    chapter: 4,
    lore: 'Chapter 6 - Straddles (Volatility) • Volatility Caldera',
    path: 'TRADER',
    risk: 'HIGH',
    icon: <Zap className="w-4 h-4" />,
    description: 'Long vol. Gains from explosive moves either way - buy shield when others fire.'
  }
};

export const TradeDeskModal: React.FC<TradeDeskModalProps> = ({
  player,
  asset,
  onExecuteTrade,
  onClose
}) => {
  const [strategy, setStrategy] = useState<StrategyType>('LONG_CALL');
  const [strikeOffset, setStrikeOffset] = useState<number>(0);
  const [dte, setDte] = useState<number>(30);
  const [contractsCount, setContractsCount] = useState<number>(1);
  const [showPayoff, setShowPayoff] = useState(false);

  const spot = asset.spotPrice;
  const iv = asset.iv;
  const selectedStrike = Math.round(spot + strikeOffset);

  const bsCall = useMemo(() => calculateBlackScholes(spot, selectedStrike, dte, iv, 0.05, true), [spot, selectedStrike, dte, iv]);
  const bsPut = useMemo(() => calculateBlackScholes(spot, selectedStrike, dte, iv, 0.05, false), [spot, selectedStrike, dte, iv]);

  // Enhanced pricing including new strategies
  const tradeDetails = useMemo(() => {
    let type: 'CALL' | 'PUT' = 'CALL';
    let premium = bsCall.price;
    let delta = bsCall.delta;
    let gamma = bsCall.gamma;
    let theta = bsCall.theta;
    let vega = bsCall.vega;
    let maxLoss = premium * 100 * contractsCount;
    let maxProfit: number | string = Infinity;
    let breakEven = selectedStrike + premium;
    let marginRequired = 0;
    let netCost = premium * 100 * contractsCount;
    let pathHint: 'TRADER' | 'INVESTOR' | 'HYBRID' = 'TRADER';

    switch (strategy) {
      case 'LONG_CALL':
        type = 'CALL';
        premium = bsCall.price;
        delta = bsCall.delta;
        theta = bsCall.theta;
        vega = bsCall.vega;
        maxLoss = premium * 100 * contractsCount;
        breakEven = selectedStrike + premium;
        maxProfit = '∞ Uncapped';
        pathHint = 'TRADER';
        break;
      case 'LONG_PUT':
        type = 'PUT';
        premium = bsPut.price;
        delta = bsPut.delta;
        theta = bsPut.theta;
        maxLoss = premium * 100 * contractsCount;
        breakEven = selectedStrike - premium;
        maxProfit = selectedStrike * 100;
        pathHint = 'INVESTOR';
        break;
      case 'BULL_CALL_SPREAD': {
        const bsShortCall = calculateBlackScholes(spot, selectedStrike + 6, dte, iv, 0.05, true);
        const netPremium = Math.max(0.5, bsCall.price - bsShortCall.price);
        premium = Number(netPremium.toFixed(2));
        delta = Number((bsCall.delta - bsShortCall.delta).toFixed(3));
        theta = Number((bsCall.theta - bsShortCall.theta).toFixed(3));
        vega = Number((bsCall.vega - bsShortCall.vega).toFixed(3));
        maxLoss = premium * 100 * contractsCount;
        maxProfit = (6 - premium) * 100 * contractsCount;
        breakEven = selectedStrike + premium;
        netCost = maxLoss;
        pathHint = 'TRADER';
        break;
      }
      case 'BEAR_PUT_SPREAD': {
        const bsShortPut = calculateBlackScholes(spot, selectedStrike - 6, dte, iv, 0.05, false);
        const netPremium = Math.max(0.5, bsPut.price - bsShortPut.price);
        premium = Number(netPremium.toFixed(2));
        delta = Number((bsPut.delta - bsShortPut.delta).toFixed(3));
        theta = Number((bsPut.theta - bsShortPut.theta).toFixed(3));
        vega = Number((bsPut.vega - bsShortPut.vega).toFixed(3));
        maxLoss = premium * 100 * contractsCount;
        maxProfit = (6 - premium) * 100 * contractsCount;
        breakEven = selectedStrike - premium;
        netCost = maxLoss;
        pathHint = 'TRADER';
        break;
      }
      case 'CASH_SECURED_PUT':
        type = 'PUT';
        premium = bsPut.price;
        delta = -bsPut.delta;
        theta = -bsPut.theta;
        vega = -bsPut.vega;
        netCost = -premium * 100 * contractsCount;
        marginRequired = selectedStrike * 100 * contractsCount;
        maxLoss = (selectedStrike - premium) * 100 * contractsCount;
        maxProfit = premium * 100 * contractsCount;
        breakEven = selectedStrike - premium;
        pathHint = 'INVESTOR';
        break;
      case 'COVERED_CALL': {
        // Own 100 shares per contract, sell OTM call
        const shortCall = calculateBlackScholes(spot, selectedStrike + 4, dte, iv, 0.05, true);
        const stockCost = spot * 100 * contractsCount;
        const credit = shortCall.price * 100 * contractsCount;
        premium = Number((shortCall.price).toFixed(2));
        delta = Number((1 - shortCall.delta).toFixed(3)); // long stock delta 1 minus short call
        theta = Number((-shortCall.theta).toFixed(3));
        netCost = stockCost - credit;
        marginRequired = 0; // stock already owned? Simplified: need shares
        maxProfit = ((selectedStrike + 4 - spot) + shortCall.price) * 100 * contractsCount;
        maxLoss = (spot - shortCall.price) * 100 * contractsCount;
        breakEven = spot - shortCall.price;
        type = 'CALL';
        pathHint = 'INVESTOR';
        break;
      }
      case 'CALENDAR_SPREAD': {
        // Sell near-term, buy long-term same strike
        const longDte = dte + 30;
        const bsLongCall = calculateBlackScholes(spot, selectedStrike, longDte, iv, 0.05, true);
        const netDebit = Math.max(0.6, bsLongCall.price - bsCall.price);
        premium = Number(netDebit.toFixed(2));
        delta = Number((bsLongCall.delta - bsCall.delta).toFixed(3));
        theta = Number((bsLongCall.theta - bsCall.theta).toFixed(3)); // should be positive initially
        vega = Number((bsLongCall.vega - bsCall.vega).toFixed(3));
        maxLoss = netDebit * 100 * contractsCount;
        maxProfit = 999 * contractsCount; // variable, max near short strike at expiry
        breakEven = selectedStrike;
        netCost = maxLoss;
        pathHint = 'HYBRID';
        break;
      }
      case 'IRON_CONDOR': {
        const shortPut = calculateBlackScholes(spot, spot - 5, dte, iv, 0.05, false);
        const longPut = calculateBlackScholes(spot, spot - 10, dte, iv, 0.05, false);
        const shortCall = calculateBlackScholes(spot, spot + 5, dte, iv, 0.05, true);
        const longCall = calculateBlackScholes(spot, spot + 10, dte, iv, 0.05, true);
        const creditPut = shortPut.price - longPut.price;
        const creditCall = shortCall.price - longCall.price;
        const totalCredit = Math.max(0.8, Number((creditPut + creditCall).toFixed(2)));
        premium = totalCredit;
        delta = 0.02;
        theta = Number((-(shortPut.theta + shortCall.theta) + (longPut.theta + longCall.theta)).toFixed(3));
        gamma = Number((-(shortPut.gamma + shortCall.gamma) + (longPut.gamma + longCall.gamma)).toFixed(4));
        vega = Number((-(shortPut.vega + shortCall.vega) + (longPut.vega + longCall.vega)).toFixed(3));
        netCost = -totalCredit * 100 * contractsCount;
        marginRequired = (5 - totalCredit) * 100 * contractsCount;
        maxProfit = totalCredit * 100 * contractsCount;
        maxLoss = (5 - totalCredit) * 100 * contractsCount;
        breakEven = spot - 5 - totalCredit;
        pathHint = 'TRADER';
        break;
      }
      case 'LONG_STRADDLE': {
        const straddleCost = bsCall.price + bsPut.price;
        premium = Number(straddleCost.toFixed(2));
        delta = Number((bsCall.delta + bsPut.delta).toFixed(3));
        theta = Number((bsCall.theta + bsPut.theta).toFixed(3));
        vega = Number((bsCall.vega + bsPut.vega).toFixed(3));
        gamma = Number((bsCall.gamma + bsPut.gamma).toFixed(4));
        maxLoss = straddleCost * 100 * contractsCount;
        netCost = maxLoss;
        breakEven = selectedStrike + straddleCost;
        maxProfit = '∞ Uncapped (Vol)';
        pathHint = 'TRADER';
        break;
      }
    }

    return {
      type,
      premium,
      delta: delta * contractsCount,
      gamma: gamma * contractsCount,
      theta: theta * contractsCount,
      vega: vega * contractsCount,
      netCost,
      marginRequired,
      maxLoss,
      maxProfit,
      breakEven,
      pathHint
    };
  }, [strategy, selectedStrike, dte, spot, iv, contractsCount, bsCall, bsPut]);

  const asciiChart = useMemo(() => {
    const legs: Array<{ type: 'CALL' | 'PUT'; strike: number; premium: number; quantity: number }> = [];
    if (strategy === 'LONG_CALL') {
      legs.push({ type: 'CALL', strike: selectedStrike, premium: tradeDetails.premium, quantity: contractsCount });
    } else if (strategy === 'LONG_PUT') {
      legs.push({ type: 'PUT', strike: selectedStrike, premium: tradeDetails.premium, quantity: contractsCount });
    } else if (strategy === 'BULL_CALL_SPREAD') {
      legs.push({ type: 'CALL', strike: selectedStrike, premium: bsCall.price, quantity: contractsCount });
      legs.push({ type: 'CALL', strike: selectedStrike + 6, premium: bsCall.price - tradeDetails.premium, quantity: -contractsCount });
    } else if (strategy === 'BEAR_PUT_SPREAD') {
      legs.push({ type: 'PUT', strike: selectedStrike, premium: bsPut.price, quantity: contractsCount });
      legs.push({ type: 'PUT', strike: selectedStrike - 6, premium: bsPut.price - tradeDetails.premium, quantity: -contractsCount });
    } else if (strategy === 'COVERED_CALL') {
      legs.push({ type: 'CALL', strike: selectedStrike + 4, premium: tradeDetails.premium, quantity: -contractsCount });
    } else if (strategy === 'CALENDAR_SPREAD') {
      legs.push({ type: 'CALL', strike: selectedStrike, premium: bsCall.price, quantity: -contractsCount });
      legs.push({ type: 'CALL', strike: selectedStrike, premium: bsCall.price + tradeDetails.premium, quantity: contractsCount });
    } else if (strategy === 'IRON_CONDOR') {
      legs.push({ type: 'PUT', strike: Math.round(spot - 5), premium: 2.2, quantity: -contractsCount });
      legs.push({ type: 'PUT', strike: Math.round(spot - 10), premium: 0.8, quantity: contractsCount });
      legs.push({ type: 'CALL', strike: Math.round(spot + 5), premium: 2.2, quantity: -contractsCount });
      legs.push({ type: 'CALL', strike: Math.round(spot + 10), premium: 0.8, quantity: contractsCount });
    } else if (strategy === 'LONG_STRADDLE') {
      legs.push({ type: 'CALL', strike: selectedStrike, premium: bsCall.price, quantity: contractsCount });
      legs.push({ type: 'PUT', strike: selectedStrike, premium: bsPut.price, quantity: contractsCount });
    }
    return generateAsciiPayoffChart(legs, spot);
  }, [strategy, selectedStrike, tradeDetails, contractsCount, spot, bsCall, bsPut]);

  const canAfford = player.florins >= tradeDetails.netCost + tradeDetails.marginRequired;
  const hasProtection = player.grahamProtections?.length > 0;
  const runeMeta = STRATEGY_RUNES[strategy];

  const handleExecute = () => {
    if (!canAfford) {
      sound.playAlarmSound();
      return;
    }
    sound.playCoinSound();
    const newContract: OptionContract = {
      id: `opt_${Date.now()}`,
      symbol: asset.symbol,
      type: tradeDetails.type,
      strike: selectedStrike,
      dte,
      premium: tradeDetails.premium,
      entryPrice: tradeDetails.premium,
      entrySpot: spot,
      entryIv: iv,
      quantity: contractsCount,
      strategy,
      delta: tradeDetails.delta,
      gamma: tradeDetails.gamma,
      theta: tradeDetails.theta,
      vega: tradeDetails.vega,
      isProtectedByGraham: hasProtection
    };
    onExecuteTrade(newContract, tradeDetails.netCost, tradeDetails.marginRequired);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm">
      {/* Oracle Circle Container - bottom sheet on mobile, centered on desktop */}
      <div className="oracle-bottom-sheet w-full max-w-5xl max-h-[92vh] md:max-h-[88vh] flex flex-col overflow-hidden animate-ledger-glow">
        {/* Header - Daen Alterspire */}
        <div className="relative p-4 border-b-2 border-amber-500/40 bg-gradient-to-r from-slate-900 via-[#1a2744] to-slate-900">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Emerald Core Glyph */}
              <div className="oracle-glyph shrink-0">
                <div className="oracle-emerald-core" />
                <span className="absolute -top-1 -right-1 text-[10px] text-amber-300 font-pixel animate-rune-float">{runeMeta.rune}</span>
              </div>
              <div>
                <h2 className="font-cinzel text-xl md:text-2xl text-amber-200 tracking-widest flex items-center gap-2">
                  ORACLE'S LEDGER
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </h2>
                <div className="text-[11px] md:text-xs text-amber-200/60 font-snes tracking-wide uppercase">
                  Daen Alterspire • Obsidian Altar with Floating Amber Runes • Bond Level {player.oracleBondLevel || 1}/5
                </div>
                <div className="text-[11px] text-emerald-300/80 mt-0.5 italic">
                  "Touching it bonds the Oracle's Ledger to your soul: a floating glyph-circle shows live prices, greeks, and portfolio."
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="snes-btn p-2 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Path indicator */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-amber-200/50">YOUR PATH:</span>
            <span className={`px-2 py-0.5 border font-bold ${
              player.currentPath === 'TRADER' ? 'path-trader text-red-300 border-red-400' :
              player.currentPath === 'INVESTOR' ? 'path-investor text-green-300 border-green-400' :
              player.currentPath === 'HYBRID' ? 'path-hybrid text-sky-300 border-sky-400' :
              'border-amber-500/30 text-amber-200/60'
            }`}>
              {player.currentPath} • T:{player.pathScores?.trader || 0} I:{player.pathScores?.investor || 0}
            </span>
            {player.grahamProtections?.length > 0 && (
              <span className="flex items-center gap-1 text-sky-300">
                <BookOpen className="w-3 h-3" /> {player.grahamProtections.length} Graham Protections
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 bg-gradient-to-b from-[#121a2e] to-[#0a0e1d]">
          {/* Market Sight - Oracle Divination */}
          <div className="divination-lens p-3 rounded-lg">
            <div className="flex flex-wrap justify-between items-center gap-2 text-snes-small">
              <div className="flex items-center gap-2">
                <span className="oracle-rune-glow text-sm">◈ MARKET SIGHT ◈</span>
                <span className="text-amber-200 font-bold">{asset.name}</span>
                <span className="text-sky-300 font-bold text-lg">{spot.toFixed(2)} ƒ</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${asset.trend === 'BULLISH' ? 'bg-green-900 text-green-300' : asset.trend === 'BEARISH' ? 'bg-red-900 text-red-300' : 'bg-slate-800 text-slate-300'}`}>
                  {asset.trend}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-purple-300">IV {(iv * 100).toFixed(1)}%</span>
                <span className="text-amber-300">Cash {player.florins.toLocaleString()} ƒ</span>
                <span className="text-slate-400">Day #{player.day}</span>
              </div>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 italic">
              {asset.lore} • Oracle Bond reveals true worth beneath Mr. Market's mood swings.
            </div>
          </div>

          {/* Rune Selection - Olmstead Chapters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-cinzel text-amber-200 text-sm tracking-widest">◆ CHOOSE YOUR RUNE • OLMSTEAD CHAPTERS ◆</span>
              <span className="text-[11px] text-slate-400">Each strategy = a chapter from "Options For The Beginner And Beyond"</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {(Object.keys(STRATEGY_RUNES) as StrategyType[]).map((key) => {
                const meta = STRATEGY_RUNES[key];
                const isSelected = strategy === key;
                const isUnlocked = player.chapter >= meta.chapter || player.investorTier >= Math.ceil(meta.chapter / 2);
                return (
                  <button
                    key={key}
                    disabled={!isUnlocked}
                    onClick={() => {
                      sound.playKeyClick();
                      setStrategy(key);
                    }}
                    className={`relative p-3 text-left border-2 rounded-lg transition-all text-snes-small ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-[0_0_16px_rgba(245,166,35,0.4)]'
                        : isUnlocked
                        ? 'bg-slate-900/80 border-slate-600 hover:border-amber-500/60 hover:bg-slate-800 text-slate-200'
                        : 'bg-black/40 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-cinzel ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>{meta.rune}</span>
                        <div className={`${isSelected ? 'text-amber-300' : ''}`}>{meta.icon}</div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        meta.path === 'TRADER' ? 'bg-red-950 text-red-300' :
                        meta.path === 'INVESTOR' ? 'bg-green-950 text-green-300' :
                        'bg-sky-950 text-sky-300'
                      }`}>
                        {meta.path}
                      </span>
                    </div>
                    <div className="font-bold text-sm mt-1 leading-tight">{meta.name}</div>
                    <div className="text-[11px] opacity-70 mt-0.5">{meta.lore}</div>
                    <div className="text-[11px] mt-1 opacity-80 leading-tight">{meta.description}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-1 py-0.5 rounded ${
                        meta.risk === 'LOW' ? 'bg-green-900/60 text-green-300' :
                        meta.risk === 'MEDIUM' ? 'bg-yellow-900/60 text-yellow-300' :
                        'bg-red-900/60 text-red-300'
                      }`}>{meta.risk} RISK</span>
                      <span className="text-[10px] text-slate-500">Ch {meta.chapter}</span>
                      {!isUnlocked && <span className="text-[10px] text-amber-400">🔒 Requires Ch {meta.chapter}</span>}
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rune Attunement - Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="zelda-panel p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-cinzel text-amber-200 text-xs">STRIKE RUNE</span>
                <span className="text-amber-300 font-bold">{selectedStrike} ƒ {strikeOffset >= 0 ? `+${strikeOffset}` : strikeOffset}</span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={strikeOffset}
                onChange={e => setStrikeOffset(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>ITM Deep Value</span>
                <span>ATM</span>
                <span>OTM Spec</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {strikeOffset < -5 ? '💎 Deep ITM - High delta, low extrinsic, Graham-approved' :
                 strikeOffset > 5 ? '🎲 OTM lottery - Cheap but needs big move' :
                 '⚖️ ATM - Balanced delta ~0.50'}
              </div>
            </div>

            <div className="zelda-panel p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-cinzel text-sky-200 text-xs">TIME SANDS</span>
                <span className="text-sky-300 font-bold">{dte} DTE</span>
              </div>
              <input
                type="range"
                min="7"
                max="90"
                step="1"
                value={dte}
                onChange={e => setDte(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>7D (Theta Burn)</span>
                <span>45D Ideal</span>
                <span>90D (Slow)</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {dte <= 14 ? '🔥 Theta decay accelerates! 0-DTE lottery costs patience + capital' :
                 dte >= 60 ? '🧘 Patient - LEAPS style, low decay' :
                 '✨ Sweet spot - balanced theta'}
              </div>
            </div>

            <div className="zelda-panel p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-cinzel text-emerald-200 text-xs">CONTRACTS</span>
                <span className="text-emerald-300 font-bold">{contractsCount}x (x100 shares)</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={contractsCount}
                onChange={e => setContractsCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 Conservative</span>
                <span>5</span>
                <span>10 Aggressive</span>
              </div>
              <div className="mt-2 text-[11px]">
                <span className={contractsCount * 100 * spot > player.florins * 0.25 ? 'text-red-400' : 'text-slate-400'}>
                  Kelly Check: {((contractsCount * tradeDetails.premium * 100) / player.florins * 100).toFixed(1)}% of capital
                  {contractsCount > 5 && ' • Size kills!'}
                </span>
              </div>
            </div>
          </div>

          {/* Oracle Sight - Greeks */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="bg-slate-900/80 border border-amber-500/30 p-2.5 rounded-lg text-center">
              <div className="text-[10px] text-amber-200/60 uppercase tracking-widest">Δ Delta • Direction</div>
              <div className={`text-lg font-bold ${tradeDetails.delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tradeDetails.delta > 0 ? '+' : ''}{tradeDetails.delta.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500">Price sensitivity per $1 move</div>
            </div>
            <div className="bg-slate-900/80 border border-sky-500/30 p-2.5 rounded-lg text-center">
              <div className="text-[10px] text-sky-200/60 uppercase tracking-widest">Θ Theta • Time</div>
              <div className={`text-lg font-bold ${tradeDetails.theta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {tradeDetails.theta >= 0 ? '+' : ''}{tradeDetails.theta.toFixed(1)} ƒ/d
              </div>
              <div className="text-[10px] text-slate-500">
                {tradeDetails.theta >= 0 ? 'Earning daily premium ✨' : 'Bleeding daily ⏳'}
              </div>
            </div>
            <div className="bg-slate-900/80 border border-purple-500/30 p-2.5 rounded-lg text-center">
              <div className="text-[10px] text-purple-200/60 uppercase tracking-widest">Vega • Vol</div>
              <div className="text-lg font-bold text-purple-300">{tradeDetails.vega.toFixed(2)}</div>
              <div className="text-[10px] text-slate-500">Per 1% IV change</div>
            </div>
            <div className="bg-slate-900/80 border border-cyan-500/30 p-2.5 rounded-lg text-center">
              <div className="text-[10px] text-cyan-200/60 uppercase tracking-widest">Break-Even</div>
              <div className="text-lg font-bold text-cyan-300">{tradeDetails.breakEven.toFixed(2)} ƒ</div>
              <div className="text-[10px] text-slate-500">Target at expiry</div>
            </div>
          </div>

          {/* Risk & Path */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-amber-500/30 rounded">
              <span className="text-slate-400">Premium:</span>
              <span className="text-amber-300 font-bold">{tradeDetails.premium.toFixed(2)} ƒ/share • {(tradeDetails.premium * 100).toFixed(0)} ƒ/contract</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-slate-600 rounded">
              <span className="text-slate-400">Max Loss:</span>
              <span className="text-red-300 font-bold">{typeof tradeDetails.maxLoss === 'number' ? `${Math.round(tradeDetails.maxLoss as number)} ƒ` : tradeDetails.maxLoss}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-emerald-600/50 rounded">
              <span className="text-slate-400">Max Profit:</span>
              <span className="text-emerald-300 font-bold">{typeof tradeDetails.maxProfit === 'number' ? `${Math.round(tradeDetails.maxProfit as number)} ƒ` : tradeDetails.maxProfit}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded font-bold ${
              tradeDetails.pathHint === 'TRADER' ? 'bg-red-950/50 border-red-500/50 text-red-300' :
              tradeDetails.pathHint === 'INVESTOR' ? 'bg-green-950/50 border-green-500/50 text-green-300' :
              'bg-sky-950/50 border-sky-500/50 text-sky-300'
            }`}>
              Path: {tradeDetails.pathHint}
            </div>
          </div>

          {/* Graham Protection Notice */}
          {player.grahamProtections?.includes('margin_of_safety' as any) && (
            <div className="bg-green-950/30 border border-green-500/40 p-2 rounded text-xs text-green-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              Graham Protection Active: Margin of Safety - This trade has 10% extra collateral buffer from your learned wisdom.
            </div>
          )}

          {/* Divination Prophecy Chart */}
          <div>
            <button
              onClick={() => setShowPayoff(!showPayoff)}
              className="w-full flex items-center justify-between p-2 bg-slate-900 border border-amber-500/20 rounded text-xs hover:bg-slate-800"
            >
              <span className="flex items-center gap-2 text-amber-200">
                <BookOpen className="w-4 h-4" /> DIVINATION PROPHECY • Expiry Payoff Profile (Oracle Sight)
              </span>
              <span className="text-slate-400">{showPayoff ? '▼ Hide' : '▶ Show'}</span>
            </button>
            {showPayoff && (
              <div className="mt-2 overflow-x-auto p-2 bg-black border border-amber-500/20 rounded text-[11px] leading-none">
                <pre className="whitespace-pre font-mono text-amber-200/80">{asciiChart}</pre>
                <div className="mt-2 text-[10px] text-slate-500 italic">
                  The Oracle's Lens reveals market truth beyond Mr. Market's daily mood swings. Dark stone and amber sigils show where profit lives.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Execution */}
        <div className="p-3 md:p-4 border-t-2 border-amber-500/30 bg-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Oracle Cost:</span>
              <span className={`font-bold text-base ${tradeDetails.netCost >= 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                {tradeDetails.netCost >= 0 ? `${tradeDetails.netCost.toLocaleString()} ƒ outflow` : `+${Math.abs(tradeDetails.netCost).toLocaleString()} ƒ credit collected`}
              </span>
            </div>
            {tradeDetails.marginRequired > 0 && (
              <div className="text-[11px] text-amber-300/80">Collateral held: {tradeDetails.marginRequired.toLocaleString()} ƒ • Bonded by Oracle's Stone</div>
            )}
            {!canAfford && (
              <div className="text-[11px] text-red-400 font-bold mt-1">⚠️ Insufficient florins! Seek value assets or reduce size. Kelly says: survival first.</div>
            )}
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button onClick={onClose} className="snes-btn flex-1 md:flex-none">
              Close Ledger
            </button>
            <button
              onClick={handleExecute}
              disabled={!canAfford}
              className={`snes-btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-base ${
                !canAfford ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <span className="oracle-rune-glow text-black">ᛟ</span>
              <span>FORGE {runeMeta.name.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Bottom hint for mobile */}
        <div className="md:hidden p-2 bg-black/60 text-[11px] text-center text-slate-500 border-t border-amber-500/10">
          💡 Tip: {runeMeta.path === 'INVESTOR' ? 'Investor path - slow, value-first, margin of safety' : runeMeta.path === 'TRADER' ? 'Trader path - aggressive but defined-risk' : 'Hybrid - balanced discipline'} • True ending same, discipline matters
        </div>
      </div>
    </div>
  );
};
