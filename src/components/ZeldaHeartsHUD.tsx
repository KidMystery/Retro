import React, { useState } from 'react';
import { PlayerStats, AssetQuote } from '../types';
import { Heart, Coins, Award, ChevronDown, ChevronUp, ScrollText } from 'lucide-react';

interface ZeldaHeartsHUDProps {
  player: PlayerStats;
  asset: AssetQuote;
  onOpenTrade: () => void;
  onOpenPortfolio: () => void;
  onOpenGrimoire: () => void;
  onAdvanceDay: () => void;
  /** Decision-review ledger: every trade/choice journaled, viewable in place. */
  onOpenHistory: () => void;
}

/**
 * HUD DISCIPLINE (game-feel rework): the always-visible frame is just
 * hearts + florins. Every readout (path, tier, greeks, shields, market quote,
 * day, menu buttons) lives behind the MARKET toggle — the default view stays
 * mostly game world.
 */
export const ZeldaHeartsHUD: React.FC<ZeldaHeartsHUDProps> = ({
  player,
  asset,
  onOpenTrade,
  onOpenPortfolio,
  onOpenGrimoire,
  onAdvanceDay,
  onOpenHistory
}) => {
  const [expanded, setExpanded] = useState(false);
  const totalContainers = player.maxHearts || 4;
  const currentHearts = Math.max(0, player.hearts);
  // 🧭 Greeks Compass item: net delta/gamma/theta/vega visible in the HUD.
  const showCompass = (player.items || []).includes('greeks_compass');

  const tierNames: { [key: number]: string } = {
    1: 'Apprentice of Grove',
    2: 'Enterprising Investor',
    3: 'Master Oracle of Value'
  };

  const progressToNextHeart = player.successfulTradesCount % 3;

  const pathBadgeClass =
    player.currentPath === 'TRADER' ? 'bg-red-950/50 border-red-500/50 text-red-300' :
    player.currentPath === 'INVESTOR' ? 'bg-green-950/50 border-green-500/50 text-green-300' :
    player.currentPath === 'HYBRID' ? 'bg-sky-950/50 border-sky-500/50 text-sky-300' :
    'bg-slate-800 border-slate-600 text-slate-400';

  return (
    <div className="zelda-panel p-2 sm:p-2.5 rounded-xl select-none shadow-lg">
      {/* Always-visible strip: hearts + florins + the toggle. Nothing else. */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`flex items-center gap-0.5 ${player.hearts <= 1 ? 'animate-heart-pulse' : ''}`}>
            {Array.from({ length: totalContainers }).map((_, idx) => {
              const rem = currentHearts - idx;
              const isFull = rem >= 1;
              const isHalf = rem >= 0.4 && rem < 1;
              return (
                <Heart
                  key={idx}
                  className={`w-5 h-5 md:w-6 md:h-6 ${
                    isFull ? 'fill-red-500 text-red-600 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]' :
                    isHalf ? 'fill-red-400 text-red-500 opacity-80' :
                    'fill-slate-800 text-slate-700 opacity-30'
                  }`}
                />
              );
            })}
          </div>
          <span className="text-[11px] text-red-400/70 hidden sm:inline">({progressToNextHeart}/3)</span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 border-2 border-amber-500/60 bg-amber-950/30 text-amber-200 font-bold rounded-lg text-xs ml-1">
            <Coins className="w-4 h-4 text-amber-300" />
            <span>{player.florins.toLocaleString()} ƒ</span>
          </div>
        </div>

        <button
        onClick={onOpenHistory}
        className="snes-btn px-3 py-1 text-xs rounded-md flex items-center gap-1 shrink-0"
        title="Decision ledger — every trade and choice journaled (day, position, size, outcome, P/L)"
        >
        <ScrollText className="w-3.5 h-3.5" />
        <span>HISTORY</span>
        </button>
        <button
        onClick={() => setExpanded(e => !e)}
        className="snes-btn px-3 py-1 text-xs rounded-md flex items-center gap-1 shrink-0"
        aria-expanded={expanded}
        >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        <span>MARKET</span>
        </button>
      </div>

      {/* Expanded detail: everything that used to squat in the persistent frame. */}
      {expanded && (
        <div className="mt-2 pt-2 border-t-2 border-amber-500/20 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 border-2 rounded-lg font-bold ${pathBadgeClass}`}>
              <Award className="w-3.5 h-3.5" />
              <span>{player.currentPath}</span>
              <span className="opacity-60 text-[10px]">T:{player.pathScores?.trader || 0} I:{player.pathScores?.investor || 0}</span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 border-2 border-slate-600 bg-slate-900/60 rounded-lg">
              <span className="font-bold text-amber-300">{asset.symbol}</span>
              <span className="font-bold text-sky-300">{asset.spotPrice.toFixed(2)} ƒ</span>
              <span className={`text-[10px] font-bold px-1 py-0.5 rounded ${asset.trend === 'BULLISH' ? 'bg-green-900 text-green-300' : asset.trend === 'BEARISH' ? 'bg-red-900 text-red-300' : 'bg-slate-800 text-slate-300'}`}>
                {(asset.iv * 100).toFixed(0)}% IV
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-amber-200/60">DAY</span>
              <span className="font-cinzel text-sky-400 font-bold">#{player.day}</span>
              <button onClick={onAdvanceDay} className="snes-btn px-2 py-1 text-[11px] rounded-md ml-1">REST +1</button>
            </div>

            {/* 🧭 Greeks Compass item: live net greeks at a glance */}
            {showCompass && (
              <div className="flex items-center gap-2 px-2.5 py-1 border-2 border-purple-500/50 bg-purple-950/30 rounded-lg" title="Greeks Compass — net portfolio exposure">
                <span className="font-bold text-purple-300">🧭 Δ {player.netDelta?.toFixed(2) ?? '0'}</span>
                <span className="text-purple-200/70">Γ {player.netGamma?.toFixed(3) ?? '0'}</span>
                <span className="text-emerald-300/80">Θ {player.netTheta?.toFixed(2) ?? '0'}</span>
                <span className="text-sky-300/80">ν {player.netVega?.toFixed(2) ?? '0'}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-300 bg-slate-900/60 px-2 py-1 border border-amber-500/30 rounded-lg">
                <Award className="w-3.5 h-3.5" />
                <span className="font-bold">TIER {player.investorTier}: {tierNames[player.investorTier] || 'Oracle'}</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 text-sky-300 bg-slate-900/40 px-2 py-1 border border-sky-500/20 rounded-lg">
                <span>{player.grahamProtections?.length || 0} Graham Shields • Bond Lv {(player.oracleBondLevel || 1).toFixed(1)}/5</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span title="Net Delta">Δ <strong className={player.netDelta >=0 ? 'text-green-400' : 'text-red-400'}>{player.netDelta >0?'+':''}{player.netDelta.toFixed(2)}</strong></span>
              <span title="Net Theta">Θ <strong className={player.netTheta >=0 ? 'text-green-400' : 'text-red-400'}>{player.netTheta >0?'+':''}{player.netTheta.toFixed(1)}ƒ/d</strong></span>
              <span title="Risk">Risk <strong className={player.riskScore >60 ? 'text-red-400' : 'text-cyan-300'}>{player.riskScore}/100</strong></span>
              <span title="Kelly Discipline" className={player.positionSizeDiscipline >70 ? 'text-green-400' : player.positionSizeDiscipline >40 ? 'text-yellow-400' : 'text-red-400'}>Kelly {player.positionSizeDiscipline}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={onOpenTrade} className="snes-btn px-3 py-1 text-xs rounded-md flex items-center gap-1">
                <div className="oracle-glyph w-4 h-4 border-amber-400"><div className="oracle-emerald-core w-1.5 h-1.5" /></div>
                <span>LEDGER</span>
              </button>
              <button onClick={onOpenPortfolio} className="snes-btn px-3 py-1 text-xs rounded-md">[P] BAG</button>
              <button onClick={onOpenGrimoire} className="snes-btn px-3 py-1 text-xs rounded-md">[G] CODEX</button>
            </div>
          </div>

          {/* Mobile path hint */}
          <div className="sm:hidden flex items-center justify-between text-[11px] text-slate-400 border-t border-amber-500/10 pt-1.5">
            <span>Path {player.currentPath} • Bond {player.oracleBondLevel?.toFixed(1)}/5 • Shields {player.grahamProtections?.length || 0}</span>
            <span className="text-amber-200/50">Fail → Learn = Permanent Protection</span>
          </div>
        </div>
      )}
    </div>
  );
};
