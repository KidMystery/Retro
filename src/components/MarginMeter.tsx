import React from 'react';
import { MarginState, MarginEvent, marginUtilization } from '../lib/curriculum/marginDanger';

/**
 * Wiring 2: SNES-style margin utilization meter for the HUD.
 * Green→yellow→orange→red by severity. Shows the latest danger-event warning.
 */
interface MarginMeterProps {
  marginUsed: number;
  marginLimit: number;
  equity: number;
  warning: MarginEvent | null;
  onDismissWarning: () => void;
}

function severityColor(util: number): { bar: string; label: string } {
  if (util >= 0.75) return { bar: 'bg-red-500', label: 'LIQUIDATION RISK' };
  if (util >= 0.55) return { bar: 'bg-orange-400', label: 'DANGER' };
  if (util >= 0.40) return { bar: 'bg-yellow-400', label: 'WARNING' };
  return { bar: 'bg-green-500', label: 'WATCH' };
}

export const MarginMeter: React.FC<MarginMeterProps> = ({ marginUsed, marginLimit, equity, warning, onDismissWarning }) => {
  if (marginUsed <= 0 && marginLimit <= 0) return null;
  const s: MarginState = { equity, marginUsed, maintenanceReq: marginUsed * 0.25 };
  const util = marginUtilization(s);
  const { bar, label } = severityColor(util);
  return (
    <div className="w-full max-w-[220px]">
      <div className="flex justify-between items-baseline font-mono text-[10px] tracking-widest">
        <span className="text-amber-300">MARGIN</span>
        <span className="text-slate-300">{Math.round(util * 100)}% • {label}</span>
      </div>
      <div className="h-3 mt-0.5 border-2 border-amber-500/60 rounded-sm bg-[#0d1526] overflow-hidden">
        <div className={`h-full ${bar} transition-all duration-500`} style={{ width: `${Math.min(100, util * 100)}%` }} />
      </div>
      <div className="font-mono text-[9px] text-slate-500 mt-0.5">{Math.round(marginUsed).toLocaleString()}ƒ / {Math.round(marginLimit).toLocaleString()}ƒ drawn</div>
      {warning && (
        <div
          onClick={onDismissWarning}
          className="mt-1 p-2 border-2 border-red-500 bg-red-950/80 rounded cursor-pointer animate-pulse"
        >
          <div className="font-mono text-[10px] font-bold text-red-300 tracking-wider">⚠ MARGIN {warning.severity.toUpperCase()}</div>
          <div className="font-mono text-[10px] text-red-200 leading-snug">{warning.message}</div>
          <div className="font-mono text-[9px] text-red-400/80 mt-1 italic">{warning.lesson}</div>
        </div>
      )}
    </div>
  );
};
