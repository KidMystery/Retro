import React from 'react';
import { NoiseEvent } from '../lib/curriculum/noiseEvents';

/**
 * SNES-style news ticker/popup for market noise events.
 * Player must choose: ignore / investigate / hedge.
 */
interface NoiseTickerProps {
  event: NoiseEvent;
  onChoose: (action: 'ignore' | 'investigate' | 'hedge') => void;
}

const ACTIONS: Array<{ key: 'ignore' | 'investigate' | 'hedge'; label: string }> = [
  { key: 'ignore', label: 'IGNORE' },
  { key: 'investigate', label: 'INVESTIGATE' },
  { key: 'hedge', label: 'HEDGE' },
];

export const NoiseTicker: React.FC<NoiseTickerProps> = ({ event, onChoose }) => (
  <div className="fixed inset-0 z-40 bg-black/70 flex items-start justify-center pt-16 px-4">
    <div
      className="w-full max-w-2xl bg-[#0d1526] border-4 border-amber-400 rounded-lg shadow-2xl"
      style={{ boxShadow: '0 0 0 4px #1a2744, 0 8px 32px rgba(0,0,0,0.8)' }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-amber-500/40 bg-gradient-to-r from-[#1a2744] to-[#0d1526]">
        <span className="font-mono text-xs tracking-widest text-amber-300">📰 VALUARIA WIRE • MARKET NOISE</span>
        <span className="font-mono text-[10px] text-slate-400">CHOOSE YOUR ACTION</span>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-mono text-sm font-bold text-amber-200 leading-snug">{event.headline}</h3>
        <p className="font-mono text-xs text-sky-300 italic leading-relaxed">"{event.socialPost}"</p>
        <p className="font-mono text-[11px] text-slate-400">— {event.source}</p>
        <div className="flex gap-3 pt-1">
          {ACTIONS.map(a => (
            <button
              key={a.key}
              onClick={() => onChoose(a.key)}
              className="flex-1 font-mono text-xs font-bold tracking-wider py-2 border-2 border-amber-400/60 rounded text-amber-200 hover:bg-amber-400/20 hover:border-amber-300 transition-colors"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);
