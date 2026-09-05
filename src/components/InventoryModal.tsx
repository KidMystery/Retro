import React from 'react';
import { PlayerStats } from '../types';
import { INTELLIGENT_INVESTOR_LESSONS } from '../lib/intelligentInvestorData';
import { Heart, Sparkles, Crown, Shield, Coins, BookOpen, Zap, X } from 'lucide-react';

interface InventoryModalProps {
  player: PlayerStats;
  onUseItem: (itemType: 'healthElixir' | 'ivStabilizer' | 'timeHourglass') => void;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ player, onUseItem, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm">
      <div className="oracle-bottom-sheet w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b-2 border-amber-500/30 bg-gradient-to-r from-slate-900 to-[#1a2744]">
          <div className="flex items-center gap-3">
            <div className="oracle-glyph w-8 h-8"><Crown className="w-4 h-4 text-amber-300" /></div>
            <div>
              <h2 className="font-cinzel text-lg text-amber-200">INVENTORY • Oracle Bond Lv {player.oracleBondLevel?.toFixed(1)}/5</h2>
              <div className="text-[11px] text-slate-400">Path {player.currentPath} • {player.relics.length} relics • {player.grahamProtections.length} Graham shields permanent</div>
            </div>
          </div>
          <button onClick={onClose} className="snes-btn p-2 rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-b from-[#121a2e] to-[#0a0e1d]">
          <div className="space-y-3">
            <div className="bg-slate-900/80 border-2 border-amber-500/20 p-3 rounded-xl">
              <h3 className="font-cinzel text-amber-200 text-sm mb-2 flex items-center gap-2"><Heart className="w-4 h-4 text-red-400" /> Potions • Life Force</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-emerald-500/20 rounded-lg">
                  <div><div className="font-bold text-emerald-300 text-sm">Health Elixir</div><div className="text-[11px] text-slate-400">Heal +2.0♥ • Margin recovery</div></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-bold text-emerald-300">x{player.potions.healthElixir}</span><button disabled={player.potions.healthElixir<=0} onClick={()=>onUseItem('healthElixir')} className={`snes-btn px-3 py-1 text-xs rounded-lg ${player.potions.healthElixir>0?'':'opacity-40 cursor-not-allowed'}`}>USE</button></div>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-sky-500/20 rounded-lg">
                  <div><div className="font-bold text-sky-300 text-sm">IV Stabilizer</div><div className="text-[11px] text-slate-400">+1.0♥ • Vega hedge, IV crush defense</div></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-bold text-sky-300">x{player.potions.ivStabilizer}</span><button disabled={player.potions.ivStabilizer<=0} onClick={()=>onUseItem('ivStabilizer')} className={`snes-btn px-3 py-1 text-xs rounded-lg ${player.potions.ivStabilizer>0?'':'opacity-40 cursor-not-allowed'}`}>USE</button></div>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-black/40 border border-purple-500/20 rounded-lg">
                  <div><div className="font-bold text-purple-300 text-sm">Time Hourglass</div><div className="text-[11px] text-slate-400">+0.8♥ • Theta manipulation, DTE buffer</div></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-bold text-purple-300">x{player.potions.timeHourglass}</span><button disabled={player.potions.timeHourglass<=0} onClick={()=>onUseItem('timeHourglass')} className={`snes-btn px-3 py-1 text-xs rounded-lg ${player.potions.timeHourglass>0?'':'opacity-40 cursor-not-allowed'}`}>USE</button></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border-2 border-amber-500/20 p-3 rounded-xl">
              <h3 className="font-cinzel text-amber-200 text-sm mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Relics • Permanent Buffs</h3>
              <div className="space-y-1.5">
                {player.relics.map((r,i)=>(
                  <div key={i} className="p-2 bg-black/40 border border-amber-500/20 rounded-lg flex items-center gap-2 text-sm">
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-slate-200">{r}</span>
                    <span className="ml-auto text-[11px] text-amber-300/60">+Oracle Bond</span>
                  </div>
                ))}
                {player.relics.length===0 && <div className="text-xs text-slate-500">No relics yet - discover value in overworld chests & asset audits</div>}
              </div>
              <div className="mt-3 text-[11px] text-slate-500">Black-Scholes Slate: +5% pricing insight • Wooden Value Shield: +10% margin buffer • Silver Compass: reveals hidden value chests</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900/80 border-2 border-sky-500/20 p-3 rounded-xl">
              <h3 className="font-cinzel text-sky-200 text-sm mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Graham Protections • Permanent</h3>
              <div className="text-[11px] text-slate-400 mb-2">Fail to Learn loop: Bad trade → Sanctuary → Correct answer = permanent protection, cannot be held hostage again. Same true ending crown via different paths.</div>
              <div className="flex flex-wrap gap-1.5">
                {player.grahamProtections.length===0 ? <span className="text-xs text-slate-500">No protections yet - fail forward! Each failure teaches permanent discipline.</span> : player.grahamProtections.map(pid=>{
                  const lesson = INTELLIGENT_INVESTOR_LESSONS.find(l=>l.id===pid);
                  return <span key={pid} className="graham-badge unlocked text-xs flex items-center gap-1 px-2 py-1 rounded-full border-2 border-green-500 bg-green-950/40 text-green-200"><span>{lesson?.oracleRune||'ᛟ'}</span>{pid}</span>;
                })}
              </div>
              <div className="mt-3 p-2 bg-sky-950/20 border border-sky-500/20 rounded-lg text-[11px] text-sky-200">
                <strong>Available Shields:</strong> margin_of_safety (no leverage), mr_market (don't follow mood), investment_vs_speculation (tangible cash flows), leverage_protection (Kelly 25%), theta_protection (don't buy 0-DTE), vega_protection (buy when others fear), discipline_protection (no FOMO)
              </div>
            </div>

            <div className="bg-slate-900/80 border-2 border-amber-500/20 p-3 rounded-xl">
              <h3 className="font-cinzel text-amber-200 text-sm mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Path Progress • Multiple Paths Same Crown</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Current Path</span><span className={`font-bold px-2 py-0.5 rounded border text-xs ${player.currentPath==='TRADER'?'path-trader border-red-500 text-red-300': player.currentPath==='INVESTOR'?'path-investor border-green-500 text-green-300': player.currentPath==='HYBRID'?'path-hybrid border-sky-500 text-sky-300':'bg-slate-800 border-slate-600 text-slate-400'}`}>{player.currentPath}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Trader Score (aggressive defined-risk)</span><span className="text-red-300 font-bold">{player.pathScores.trader}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Investor Score (slow value-first)</span><span className="text-green-300 font-bold">{player.pathScores.investor}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Discipline (Kelly)</span><span className={player.positionSizeDiscipline>70?'text-green-400':'text-amber-400'}>{player.positionSizeDiscipline}/100 {player.positionSizeDiscipline>70?'✓ Compliant':'⚠ Overleveraging?'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Flawless Streak</span><span className="text-amber-300">{player.flawlessTradesStreak} trades</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Premium Collected (income)</span><span className="text-emerald-300">{player.totalPremiumCollected.toLocaleString()}ƒ</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Value Invested (margin safety)</span><span className="text-sky-300">{player.totalValueInvested.toLocaleString()}ƒ</span></div>
              </div>
            </div>

            <div className="bg-slate-900/80 border-2 border-red-500/20 p-3 rounded-xl">
              <h3 className="font-cinzel text-red-200 text-sm mb-2 flex items-center gap-2"><Zap className="w-4 h-4" /> Failed Trades • Learning Log</h3>
              <div className="max-h-28 overflow-y-auto space-y-1 text-[11px]">
                {player.failedTrades.length===0 ? <span className="text-slate-500">No fails yet - perfect so far, but failing forward teaches permanent shields!</span> : player.failedTrades.slice(-6).map(f=>(
                  <div key={f.id} className="p-1.5 bg-red-950/30 border border-red-500/20 rounded text-red-200">Day {f.day}: {f.reason} {f.strategy} -{f.lossFlorins}ƒ → Graham {f.lessonId} {player.grahamProtections.includes(f.lessonId)?'✓ Protected':'✗ Learn in Sanctuary'}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-t-2 border-amber-500/20 bg-slate-950 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">Inventory = potions + relics + Graham shields • Oracle Bond Lv {player.oracleBondLevel?.toFixed(1)}/5 • True ending: richest investor = survival first</span>
          <button onClick={onClose} className="snes-btn-primary px-4 py-1.5 rounded-xl text-xs">RETURN</button>
        </div>
      </div>
    </div>
  );
};
