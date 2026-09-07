/**
 * ProvingVaultModal.tsx — Seal of COMPETENCE exam.
 * A scripted 60-day portfolio run reusing the day-advance engine's mechanics
 * (equity, peak, drawdown) against a deterministic market series. The player
 * picks a daily allocation; discipline (not heroics) passes the exam.
 */

import { useMemo, useState } from 'react';
import { buildProvingVaultSeries, gradeProvingVault, vaultPhaseForDay, ProvingVaultResult } from '../lib/curriculum/provingVault';

interface Props {
  startEquity: number;
  onComplete: (result: ProvingVaultResult) => void;
}

const ALLOCATIONS = [0, 25, 50, 75, 100];

export function ProvingVaultModal({ startEquity, onComplete }: Props) {
  const series = useMemo(() => buildProvingVaultSeries(), []);
  const [day, setDay] = useState(1);
  const [equity, setEquity] = useState(startEquity);
  const [peak, setPeak] = useState(startEquity);
  const [maxDrawdownPct, setMaxDrawdownPct] = useState(0);
  const [allocation, setAllocation] = useState(50);
  const [liquidated, setLiquidated] = useState(false);
  const [log, setLog] = useState<string[]>([
    `◈ THE PROVING VAULT: 60 days, scripted tape. Start equity ${Math.round(startEquity).toLocaleString()}ƒ.`,
    '◈ Pass = finish at or above start, drawdown never worse than 25%, zero liquidations.',
    '◈ Each morning choose your allocation. The market does not care how you feel.'
  ]);

  const phase = vaultPhaseForDay(day);

  const advanceVaultDay = () => {
    const r = series[Math.min(day, series.length) - 1] ?? 0;
    const portfolioReturn = r * (allocation / 100); // cash portion is flat
    const newEquity = Math.max(0, equity * (1 + portfolioReturn));
    const newPeak = Math.max(peak, newEquity);
    const dd = ((newPeak - newEquity) / newPeak) * 100;
    const newMaxDd = Math.max(maxDrawdownPct, dd);
    const newDay = day + 1;
    const nextPhase = vaultPhaseForDay(Math.min(60, newDay));

    let newLog = log;
    let isLiquidated = liquidated;
    if (newEquity <= 0) {
      isLiquidated = true;
      newLog = [...log.slice(-6), `☠ DAY ${day}: LIQUIDATED. The vault door seals shut.`];
    } else {
      const note = nextPhase !== phase ? ` → ${nextPhase} begins` : '';
      newLog = [...log.slice(-6), `◈ DAY ${day} [${phase}]: market ${r >= 0 ? '+' : ''}${(r * 100).toFixed(1)}% × ${allocation}% invested → equity ${Math.round(newEquity).toLocaleString()}ƒ • dd ${dd.toFixed(1)}%${note}`];
    }

    setDay(newDay);
    setEquity(newEquity);
    setPeak(newPeak);
    setMaxDrawdownPct(newMaxDd);
    setLiquidated(isLiquidated);
    setLog(newLog);

    if (isLiquidated || newDay > 60) {
      const result = gradeProvingVault(startEquity, isLiquidated ? 0 : newEquity, newMaxDd, isLiquidated, day);
      setTimeout(() => onComplete(result), 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 backdrop-blur-sm">
      <div className="zelda-panel w-full max-w-2xl p-4 space-y-3 shadow-2xl rounded-xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-amber-500/30 pb-2">
          <span className="font-cinzel text-amber-200 text-sm tracking-widest">⚖ THE PROVING VAULT — SEAL OF COMPETENCE</span>
          <span className="text-xs text-amber-300 font-snes">DAY {Math.min(day, 60)}/60</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-snes">
          <div className="p-2 bg-black/40 border border-amber-500/20 rounded">
            <div className="text-amber-200/60 uppercase tracking-widest">Equity</div>
            <div className="text-amber-200 text-base">{Math.round(equity).toLocaleString()}ƒ</div>
          </div>
          <div className="p-2 bg-black/40 border border-red-500/20 rounded">
            <div className="text-red-200/60 uppercase tracking-widest">Max Drawdown</div>
            <div className={`text-base ${maxDrawdownPct >= 25 ? 'text-red-400' : 'text-green-300'}`}>{maxDrawdownPct.toFixed(1)}%</div>
          </div>
          <div className="p-2 bg-black/40 border border-sky-500/20 rounded">
            <div className="text-sky-200/60 uppercase tracking-widest">Phase</div>
            <div className={`text-base ${phase === 'IV-CRUSH CRASH' ? 'text-red-400' : phase === 'BULL MELT-UP' ? 'text-green-300' : 'text-sky-300'}`}>{phase}</div>
          </div>
        </div>

        <div className="p-2 bg-slate-900/80 border border-amber-500/30 rounded text-xs space-y-1 font-snes">
          <div className="text-amber-200/70 uppercase tracking-widest mb-1">Allocation for next day</div>
          <div className="flex gap-2 flex-wrap">
            {ALLOCATIONS.map(a => (
              <button
                key={a}
                onClick={() => setAllocation(a)}
                className={`px-3 py-1.5 rounded-lg text-xs border ${allocation === a ? 'snes-btn-primary border-amber-400' : 'snes-btn border-amber-500/30'}`}
              >
                {a === 0 ? 'ALL CASH' : `${a}% INVESTED`}
              </button>
            ))}
          </div>
          <p className="text-slate-400 italic pt-1">Uninvested florins hold flat. Kelly whispers: survival first, growth after safety.</p>
        </div>

        <div className="p-2 bg-black/50 border border-amber-500/20 rounded text-[11px] font-snes space-y-0.5 max-h-40 overflow-y-auto">
          {log.map((l, i) => (
            <div key={i} className="text-slate-300">{l}</div>
          ))}
        </div>

        <button onClick={advanceVaultDay} className="snes-btn-primary w-full py-3 text-sm rounded-xl font-cinzel tracking-widest">
          {liquidated ? 'THE VAULT HAS SPOKEN' : day > 60 ? 'FINISH' : `ADVANCE TO DAY ${Math.min(day + 1, 60)} ▶`}
        </button>
      </div>
    </div>
  );
}
