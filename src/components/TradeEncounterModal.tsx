import React, { useState } from 'react';
import { TradeEncounter, TradeEncounterChoice } from '../types';
import { sound } from '../lib/audioEngine';
import { X, BookOpen } from 'lucide-react';

interface TradeEncounterModalProps {
  encounter: TradeEncounter;
  /** Resolves the decision: the App layer applies florins/hearts and either
   *  opens the Trade Desk (correct) or pulls the Sanctuary (fail->learn). */
  onResolve: (encounter: TradeEncounter, choice: TradeEncounterChoice) => void;
  onClose: () => void;
}

// Source-backed trade encounter: states a real options structure's thesis,
// entry cost/credit, max profit, max loss and breakeven (where applicable),
// then asks the player for one decision with a real consequence. Follows the
// OptionsMechanicGate look so the trade-gate chain reads as one continuous rite.
export const TradeEncounterModal: React.FC<TradeEncounterModalProps> = ({ encounter, onResolve, onClose }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [resolved, setResolved] = useState(false);
  const chosen = selected !== null ? encounter.decision.choices[selected] : null;

  const handleChoose = (idx: number) => {
    if (resolved) return;
    setSelected(idx);
    setResolved(true);
    const choice = encounter.decision.choices[idx];
    if (choice.correct) sound.playSecretChime();
    else sound.playAlarmSound();
  };

  const handleContinue = () => {
    if (selected === null) return;
    onResolve(encounter, encounter.decision.choices[selected]);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-2 sm:p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0b0f14] border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.25)] font-mono">
        <div className="flex items-center justify-between border-b border-amber-500/30 bg-black/50 px-4 py-2">
          <span className="text-[10px] tracking-[0.3em] text-amber-400">TRADE ENCOUNTER — BROKER'S TALE · SOURCE-VERIFIED</span>
          <button onClick={onClose} className="text-amber-500/70 hover:text-amber-300" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-cinzel text-base text-amber-200 tracking-wide">{encounter.title}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {encounter.source}
            </p>
          </div>

          <p className="text-[12px] leading-relaxed text-amber-100 border-l-2 border-amber-500/50 pl-3">
            {encounter.thesis}
          </p>

          {/* Risk boundaries — the structure's stated contract with the player */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
            <div className="p-2 bg-black/50 border border-amber-500/25 rounded">
              <span className="text-amber-300 font-bold">ENTRY:</span>{' '}
              <span className="text-slate-300">{encounter.entry}</span>
            </div>
            <div className="p-2 bg-black/50 border border-emerald-500/25 rounded">
              <span className="text-emerald-300 font-bold">MAX PROFIT:</span>{' '}
              <span className="text-slate-300">{encounter.maxProfit}</span>
            </div>
            <div className="p-2 bg-black/50 border border-red-500/25 rounded">
              <span className="text-red-300 font-bold">MAX LOSS:</span>{' '}
              <span className="text-slate-300">{encounter.maxLoss}</span>
            </div>
            {encounter.breakeven && (
              <div className="p-2 bg-black/50 border border-cyan-500/25 rounded">
                <span className="text-cyan-300 font-bold">BREAKEVEN:</span>{' '}
                <span className="text-slate-300">{encounter.breakeven}</span>
              </div>
            )}
          </div>

          <div className="border-t border-amber-500/20 pt-3">
            <p className="text-[13px] text-cyan-300 mb-2">» {encounter.decision.prompt}</p>
            <div className="space-y-1.5">
              {encounter.decision.choices.map((choice, idx) => {
                const isPicked = selected === idx;
                let cls = 'border-slate-700 text-slate-300 hover:border-amber-500/60 hover:bg-amber-500/5';
                if (resolved) {
                  if (choice.correct) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                  else if (isPicked) cls = 'border-red-500 bg-red-500/10 text-red-300';
                  else cls = 'border-slate-800 text-slate-500';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleChoose(idx)}
                    disabled={resolved}
                    className={`w-full text-left px-3 py-2 border text-[12px] transition-colors ${cls}`}
                  >
                    <span className="text-amber-500 mr-2">{String.fromCharCode(65 + idx)}.</span>{choice.text}
                  </button>
                );
              })}
            </div>
          </div>

          {resolved && chosen && (
            <div className="space-y-3 pt-1">
              <p className={`text-[12px] leading-relaxed border-l-2 pl-3 ${chosen.correct ? 'border-emerald-500 text-emerald-200' : 'border-red-500 text-red-200'}`}>
                {chosen.outcome}
              </p>
              <p className="text-[11px] text-amber-100/80 border-l-2 border-amber-500/40 pl-3">
                {encounter.decision.explanation}
              </p>
              <button
                onClick={handleContinue}
                className="w-full bg-amber-600 hover:bg-amber-500 text-black text-[12px] tracking-widest py-2"
              >
                {chosen.correct ? 'PROCEED TO TRADE DESK ▶' : 'TO THE SANCTUARY ▶'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
