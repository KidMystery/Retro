import React, { useState } from 'react';
import { IntelligentInvestorLesson, OptionsMechanicChallenge } from '../types';
import { sound } from '../lib/audioEngine';
import { X } from 'lucide-react';

interface OptionsMechanicGateProps {
  lesson: IntelligentInvestorLesson;
  challenge: OptionsMechanicChallenge;
  onPass: (lessonId: IntelligentInvestorLesson['id']) => void;
  onFail: (lessonId: IntelligentInvestorLesson['id']) => void;
  onClose: () => void;
}

// McMillan mechanic gate: shown before a trade encounter opens the Trade Desk.
// Reads a real options-mechanic beat, then a mechanics MCQ. Correct -> proceeds
// with a mechanic rune reward; wrong -> costs hearts+florins and pulls the Sanctuary.
export const OptionsMechanicGate: React.FC<OptionsMechanicGateProps> = ({ lesson, challenge, onPass, onFail, onClose }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const correct = selected === challenge.correctIndex;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === challenge.correctIndex) sound.playSecretChime();
    else sound.playAlarmSound();
  };

  const handleContinue = () => {
    if (correct) onPass(lesson.id);
    else onFail(lesson.id);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-2 sm:p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0b0f14] border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.25)] font-mono">
        <div className="flex items-center justify-between border-b border-amber-500/30 bg-black/50 px-4 py-2">
          <span className="text-[10px] tracking-[0.3em] text-amber-400">TRADE GATE — MECHANIC SCRIBE · MCMILLAN</span>
          <button onClick={onClose} className="text-amber-500/70 hover:text-amber-300" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-2xl leading-none text-amber-400">{lesson.oracleRune}</span>
            <p className="text-[13px] leading-relaxed text-amber-100">{lesson.mechanicLesson}</p>
          </div>

          <div className="border-t border-amber-500/20 pt-3">
            <p className="text-[13px] text-cyan-300 mb-2">» {challenge.prompt}</p>
            <div className="space-y-1.5">
              {challenge.choices.map((choice, idx) => {
                const isPicked = selected === idx;
                const isRight = idx === challenge.correctIndex;
                let cls = 'border-slate-700 text-slate-300 hover:border-amber-500/60 hover:bg-amber-500/5';
                if (answered) {
                  if (isRight) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                  else if (isPicked) cls = 'border-red-500 bg-red-500/10 text-red-300';
                  else cls = 'border-slate-800 text-slate-500';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                    className={`w-full text-left px-3 py-2 border text-[12px] transition-colors ${cls}`}
                  >
                    <span className="text-amber-500 mr-2">{String.fromCharCode(65 + idx)}.</span>{choice}
                  </button>
                );
              })}
            </div>
          </div>

          {answered && (
            <div className="space-y-3 pt-1">
              <p className={`text-[12px] leading-relaxed border-l-2 pl-3 ${correct ? 'border-emerald-500 text-emerald-200' : 'border-red-500 text-red-200'}`}>
                {challenge.explanation}
              </p>
              {correct ? (
                <p className="text-[11px] text-amber-300">◈ Mechanic rune earned: {lesson.title} knowledge absorbed. The Trade Desk opens.</p>
              ) : (
                <p className="text-[11px] text-red-300">◈ Wrong mechanic. −1♥ −150ƒ. The Sanctuary of Quiet Oracle will re-teach this discipline.</p>
              )}
              <button
                onClick={handleContinue}
                className="w-full bg-amber-600 hover:bg-amber-500 text-black text-[12px] tracking-widest py-2"
              >
                {correct ? 'PROCEED TO TRADE DESK ▶' : 'TO THE SANCTUARY ▶'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
