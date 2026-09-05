import React from 'react';
import { PlayerStats, OptionContract, AssetQuote } from '../types';
import { calculateBlackScholes } from '../lib/blackScholes';
import { sound } from '../lib/audioEngine';
import { ShieldAlert, X, AlertTriangle, Crown } from 'lucide-react';

interface PortfolioLedgerModalProps {
  player: PlayerStats;
  positions: OptionContract[];
  asset: AssetQuote;
  onClosePosition: (positionId: string, currentMarketValue: number) => void;
  onExercisePosition: (positionId: string) => void;
  onClose: () => void;
  riskCategory: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number;
}

export const PortfolioLedgerModal: React.FC<PortfolioLedgerModalProps> = ({
  player,
  positions,
  asset,
  onClosePosition,
  onExercisePosition,
  onClose,
  riskCategory,
  riskScore
}) => {
  const spot = asset.spotPrice;
  const iv = asset.iv;

  const positionRows = positions.map(pos => {
    const isCall = pos.type === 'CALL';
    const liveBs = calculateBlackScholes(spot, pos.strike, pos.dte, iv, 0.05, isCall);
    const currentPrice = liveBs.price;
    const initialCost = pos.entryPrice * 100 * pos.quantity;
    const currentValue = currentPrice * 100 * pos.quantity;
    const pnl = currentValue - initialCost;
    const isItm = isCall ? spot > pos.strike : spot < pos.strike;
    return { ...pos, currentPrice, currentValue, pnl, isItm, liveDelta: liveBs.delta * pos.quantity, liveTheta: liveBs.theta * pos.quantity };
  });

  const totalUnrealizedPnl = positionRows.reduce((acc, row) => acc + row.pnl, 0);
  const marginUsagePct = player.marginLimit > 0 ? (player.marginUsed / player.marginLimit) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm">
      <div className="oracle-bottom-sheet w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b-2 border-amber-500/30 bg-gradient-to-r from-slate-900 to-[#1a2744]">
          <div className="flex items-center gap-3">
            <div className="oracle-glyph w-8 h-8 border-amber-400"><ShieldAlert className="w-4 h-4 text-amber-300" /></div>
            <div>
              <h2 className="font-cinzel text-lg text-amber-200">PORTFOLIO AUDIT • Oracle Ledger</h2>
              <div className="text-[11px] text-slate-400">Path {player.currentPath} • Bond Lv {player.oracleBondLevel?.toFixed(1)}/5 • Shields {player.grahamProtections.length} • Discipline {player.positionSizeDiscipline}/100 Kelly</div>
            </div>
          </div>
          <button onClick={onClose} className="snes-btn p-2 rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 bg-gradient-to-b from-[#121a2e] to-[#0a0e1d]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-slate-900/80 border border-amber-500/20 p-2.5 rounded-xl text-center"><div className="text-[10px] text-slate-400">LIQUID FLORINS</div><div className="font-bold text-amber-300 text-sm">{player.florins.toLocaleString()} ƒ</div><div className="text-[10px] text-slate-500">Buying Power</div></div>
            <div className="bg-slate-900/80 border border-sky-500/20 p-2.5 rounded-xl text-center"><div className="text-[10px] text-slate-400">TOTAL EQUITY</div><div className="font-bold text-sky-300 text-sm">{Math.round(player.portfolioValue).toLocaleString()} ƒ</div><div className="text-[10px] text-slate-500">Cash + Marks</div></div>
            <div className="bg-slate-900/80 border border-emerald-500/20 p-2.5 rounded-xl text-center"><div className="text-[10px] text-slate-400">UNREALIZED P&L</div><div className={`font-bold text-sm ${totalUnrealizedPnl>=0?'text-emerald-400':'text-red-400'}`}>{totalUnrealizedPnl>=0?'+':''}{Math.round(totalUnrealizedPnl).toLocaleString()} ƒ</div><div className="text-[10px] text-slate-500">Open Marks</div></div>
            <div className="bg-slate-900/80 border border-purple-500/20 p-2.5 rounded-xl text-center"><div className="text-[10px] text-slate-400">DAILY THETA</div><div className={`font-bold text-sm ${player.netTheta>=0?'text-emerald-400':'text-red-400'}`}>{player.netTheta>=0?'+':''}{player.netTheta.toFixed(1)} ƒ/d</div><div className="text-[10px] text-slate-500">{player.netTheta>=0?'Earning while waiting ✨':'Bleeding ⏳'}</div></div>
          </div>

          <div className={`p-3 border-2 rounded-xl ${riskCategory==='CRITICAL'?'border-red-500 bg-red-950/30 text-red-200': riskCategory==='HIGH'?'border-amber-500 bg-amber-950/20 text-amber-200':'border-slate-600 bg-slate-900/60 text-slate-200'}`}>
            <div className="flex justify-between items-center mb-2 text-xs">
              <span className="font-bold flex items-center gap-1.5 font-cinzel">{riskCategory==='CRITICAL' && <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />} MARGIN & KELLY DISCIPLINE:</span>
              <span className="font-bold">{player.marginUsed.toLocaleString()}ƒ / {player.marginLimit.toLocaleString()}ƒ ({marginUsagePct.toFixed(1)}%) • Risk {riskScore}/100 {riskCategory} • Kelly {player.positionSizeDiscipline}/100</span>
            </div>
            <div className="w-full h-3 border border-slate-700 bg-black rounded-full overflow-hidden p-0.5">
              <div className={`h-full rounded-full transition-all ${marginUsagePct>80?'bg-red-500':marginUsagePct>50?'bg-amber-400':'bg-emerald-500'}`} style={{ width: `${Math.min(100, marginUsagePct)}%` }} />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2 text-[11px]">
              <span className={`px-2 py-0.5 border rounded ${player.grahamProtections.includes('leverage_protection') ? 'bg-green-950 border-green-500 text-green-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>Leverage Protection {player.grahamProtections.includes('leverage_protection')?'✓':'✗'}</span>
              <span className={`px-2 py-0.5 border rounded ${player.grahamProtections.includes('margin_of_safety') ? 'bg-green-950 border-green-500 text-green-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>Margin of Safety {player.grahamProtections.includes('margin_of_safety')?'✓':'✗'}</span>
              <span className="px-2 py-0.5 border border-amber-500/30 bg-black/40 rounded text-amber-200/70">Premium Collected {player.totalPremiumCollected.toLocaleString()}ƒ • Value Invested {player.totalValueInvested.toLocaleString()}ƒ</span>
            </div>
            <div className="mt-1 text-[11px] opacity-80">{marginUsagePct>80?'⚠️ Close positions! Kelly says max 25% per trade! Survival first!':'Collateral healthy • Kelly compliant • Survival first, growth after safety'}</div>
          </div>

          <div>
            <div className="font-cinzel text-amber-200 text-sm border-b border-amber-500/20 pb-1 mb-2 flex justify-between items-center">
              <span>ACTIVE CONTRACTS ({positions.length}) • Oracle Sight</span>
              <span className="text-[11px] text-slate-400">SPOT {spot.toFixed(2)}ƒ IV {(iv*100).toFixed(1)}% • Path {player.currentPath}</span>
            </div>
            {positions.length===0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
                <div className="oracle-glyph w-12 h-12 mx-auto mb-2"><Crown className="w-6 h-6 text-amber-400" /></div>
                [ NO OPEN CONTRACTS ]<br/><span className="text-xs">Visit Oracle Ledger Glyph to forge runes • Each strategy = Olmstead chapter</span>
              </div>
            ) : (
              <div className="space-y-2">
                {positionRows.map(row => (
                  <div key={row.id} className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${row.type==='CALL'?'text-emerald-400':'text-red-400'}`}>{row.quantity}x {row.strategy} {row.type}</span>
                        {row.isItm && <span className="px-1.5 py-0.5 bg-amber-400 text-black font-bold text-[10px] rounded">ITM</span>}
                        <span className="text-xs text-slate-400">Strike {row.strike}ƒ DTE {row.dte}d Entry {row.entryPrice.toFixed(2)}ƒ Mark {row.currentPrice.toFixed(2)}ƒ</span>
                        {row.isProtectedByGraham && <span className="px-1.5 py-0.5 bg-sky-950 border border-sky-500/40 text-sky-300 text-[10px] rounded">Graham Protected</span>}
                      </div>
                      <div className="flex gap-3 text-[11px] mt-1">
                        <span className="text-slate-400">Δ {row.liveDelta.toFixed(2)}</span>
                        <span className={row.liveTheta>=0?'text-emerald-400':'text-red-400'}>Θ {row.liveTheta.toFixed(1)}ƒ/d</span>
                        <span className={row.pnl>=0?'text-emerald-400':'text-red-400'}>P&L {row.pnl>=0?'+':''}{Math.round(row.pnl)}ƒ</span>
                        <span className="text-slate-500">{row.entrySpot ? `Entry Spot ${row.entrySpot}ƒ IV ${(row.entryIv!*100).toFixed(0)}%` : ''}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {row.isItm && <button onClick={() => { sound.playCoinSound(); onExercisePosition(row.id); }} className="snes-btn px-3 py-1.5 text-xs rounded-lg border-amber-400">EXERCISE</button>}
                      <button onClick={() => { sound.playCoinSound(); onClosePosition(row.id, row.currentValue); }} className="snes-btn px-3 py-1.5 text-xs rounded-lg">CLOSE {row.pnl>=0?'WIN':'LOSS'}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900/60 border border-amber-500/20 p-3 rounded-xl text-xs">
            <div className="font-bold text-amber-200 mb-1">Oracle Insight • Fail → Learn Loop</div>
            <p className="text-slate-300 leading-relaxed">Losing trade? Don't fear — it's teaching loop. Bad trade cracks hearts → Sanctuary of Quiet Oracle → Graham reflection question → Correct answer = permanent protection vs that mistake. You cannot be held hostage by it again. Flawless streak {player.flawlessTradesStreak} • Failed {player.failedTradesCount} • Protections {player.grahamProtections.length}/7</p>
          </div>
        </div>

        <div className="p-3 border-t-2 border-amber-500/20 bg-slate-950 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">Portfolio = Life Force • Defined-risk armor reduces risk score • Kelly max 25% per trade</span>
          <button onClick={onClose} className="snes-btn-primary px-4 py-1.5 rounded-xl text-xs">RETURN TO OVERWORLD</button>
        </div>
      </div>
    </div>
  );
};
