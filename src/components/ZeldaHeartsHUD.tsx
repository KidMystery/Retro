import React from 'react';
import { PlayerStats, AssetQuote } from '../types';
import { Heart, Coins, Award, Crown, Shield } from 'lucide-react';

interface ZeldaHeartsHUDProps {
  player: PlayerStats;
  asset: AssetQuote;
  onOpenTrade: () => void;
  onOpenPortfolio: () => void;
  onOpenGrimoire: () => void;
  onAdvanceDay: () => void;
}

export const ZeldaHeartsHUD: React.FC<ZeldaHeartsHUDProps> = ({
  player,
  asset,
  onOpenTrade,
  onOpenPortfolio,
  onOpenGrimoire,
  onAdvanceDay
}) => {
  const totalContainers = player.maxHearts || 4;
  const currentHearts = Math.max(0, player.hearts);

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
    <div className="zelda-panel p-2.5 sm:p-3 rounded-xl select-none shadow-lg">
      {/* Top Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-500/20 pb-2 mb-2">
        <div className="flex items-center gap-2">
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
          <div className="text-xs font-bold ml-1">
            <span className="text-red-400 font-cinzel text-sm">{player.hearts.toFixed(1)}</span>
            <span className="opacity-60 text-amber-200/60">/{player.maxHearts} ♥</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 ml-2">
            {[0,1,2].map(idx => (
              <span key={idx} className={`w-2.5 h-2.5 border-2 border-red-500 rounded-sm ${idx < progressToNextHeart ? 'bg-red-500' : 'bg-transparent'}`} />
            ))}
            <span className="text-[11px] text-slate-400 ml-1">({progressToNextHeart}/3 to container)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 border-2 rounded-lg font-bold text-xs ${pathBadgeClass}`}>
            <Crown className="w-3.5 h-3.5" />
            <span>{player.currentPath}</span>
            <span className="opacity-60 text-[10px]">T:{player.pathScores?.trader || 0} I:{player.pathScores?.investor || 0}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 border-2 border-amber-500/60 bg-amber-950/30 text-amber-200 font-bold rounded-lg text-xs">
            <Coins className="w-4 h-4 text-amber-300" />
            <span>{player.florins.toLocaleString()} ƒ</span>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 border-2 border-slate-600 bg-slate-900/60 rounded-lg text-xs">
            <span className="font-bold text-amber-300">{asset.symbol}</span>
            <span className="font-bold text-sky-300">{asset.spotPrice.toFixed(2)} ƒ</span>
            <span className={`text-[10px] font-bold px-1 py-0.5 rounded ${asset.trend === 'BULLISH' ? 'bg-green-900 text-green-300' : asset.trend === 'BEARISH' ? 'bg-red-900 text-red-300' : 'bg-slate-800 text-slate-300'}`}>
              {(asset.iv * 100).toFixed(0)}% IV
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-amber-200/60">DAY</span>
            <span className="font-cinzel text-sky-400 font-bold">#{player.day}</span>
            <button onClick={onAdvanceDay} className="snes-btn px-2 py-1 text-[11px] rounded-md ml-1">REST +1</button>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-amber-300 bg-slate-900/60 px-2 py-1 border border-amber-500/30 rounded-lg">
            <Award className="w-3.5 h-3.5" />
            <span className="font-bold">TIER {player.investorTier}: {tierNames[player.investorTier] || 'Oracle'}</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-sky-300 bg-slate-900/40 px-2 py-1 border border-sky-500/20 rounded-lg">
            <Shield className="w-3 h-3" />
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
      <div className="sm:hidden mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-amber-500/10 pt-1.5">
        <span>Path {player.currentPath} • Bond {player.oracleBondLevel?.toFixed(1)}/5 • Shields {player.grahamProtections?.length || 0}</span>
        <span className="text-amber-200/50">Fail → Learn = Permanent Protection</span>
      </div>
    </div>
  );
};
