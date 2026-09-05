import React, { useState } from 'react';
import { QuestNode, StoryChoice } from '../types';
import { sound } from '../lib/audioEngine';
import { MessageSquare, ArrowRight, X, AlertCircle, Crown } from 'lucide-react';

interface StoryDialogModalProps {
  quest: QuestNode;
  playerFlorins: number;
  onChoiceSelect: (choice: StoryChoice) => void;
  onClose: () => void;
}

export const StoryDialogModal: React.FC<StoryDialogModalProps> = ({ quest, playerFlorins, onChoiceSelect, onClose }) => {
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);

  const handleChoose = (choice: StoryChoice) => {
    if (choice.costFlorins && playerFlorins < choice.costFlorins) { sound.playAlarmSound(); return; }
    sound.playCommandBeep();
    setSelectedChoice(choice);
  };
  const handleConfirm = () => { if (!selectedChoice) return; sound.playCoinSound(); onChoiceSelect(selectedChoice); };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm">
      <div className="oracle-bottom-sheet w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b-2 border-amber-500/30 bg-gradient-to-r from-slate-900 to-[#1a2744]">
          <div className="flex items-center gap-2">
            <div className="oracle-glyph w-8 h-8"><MessageSquare className="w-4 h-4 text-purple-300" /></div>
            <div>
              <h2 className="font-cinzel text-base text-amber-200">{quest.title}</h2>
              <div className="text-[11px] text-slate-400">LOCATION: {quest.locationName} • Path matters • Same true crown</div>
            </div>
          </div>
          <button onClick={onClose} className="snes-btn p-1.5 rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#121a2e] to-[#0a0e1d]">
          <div className="p-3 border-2 border-amber-500/20 bg-slate-900/60 rounded-xl leading-relaxed text-sm text-slate-200">
            {quest.description}
          </div>
          <div className="p-2.5 border-2 border-sky-500/30 bg-sky-950/20 rounded-xl text-sky-200 text-xs">
            <div className="font-bold flex items-center gap-1.5 text-sky-300 mb-1"><AlertCircle className="w-3.5 h-3.5" /> ORACLE LAW • Olmstead + Graham:</div>
            <p className="opacity-90 leading-relaxed">{quest.optionsLesson}</p>
          </div>

          {!selectedChoice ? (
            <div className="space-y-2">
              <div className="font-cinzel text-amber-200 text-xs uppercase tracking-widest">What is your decision, Oracle Bonded? • Fail→Learn protected</div>
              {quest.choices.map((choice, cIdx) => {
                const canAfford = !choice.costFlorins || playerFlorins >= choice.costFlorins;
                return (
                  <button key={cIdx} onClick={() => handleChoose(choice)} disabled={!canAfford} className={`w-full text-left p-3 border-2 rounded-xl transition-all text-sm ${canAfford ? 'bg-slate-900/60 border-slate-600 hover:border-amber-400 hover:bg-slate-800 text-slate-200' : 'opacity-40 cursor-not-allowed bg-red-950/20 border-red-500/50 text-red-300'}`}>
                    <div className="flex items-center justify-between">
                      <span>[{cIdx+1}] {choice.text}</span>
                      <span className="flex items-center gap-2">
                        {choice.costFlorins && <span className="font-bold text-amber-300">{choice.costFlorins}ƒ</span>}
                        {choice.pathScore && <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-amber-500/20 rounded">T+{choice.pathScore.trader||0} I+{choice.pathScore.investor||0}</span>}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 border-2 border-amber-400 bg-slate-950 rounded-xl space-y-3">
              <div className="font-cinzel text-amber-200 text-xs flex items-center gap-2"><Crown className="w-4 h-4" /> DECISION OUTCOME • Oracle Bond +0.15</div>
              <p className="leading-relaxed text-sm text-slate-200">{selectedChoice.outcomeText}</p>
              {selectedChoice.marketImpact && (
                <div className="text-xs text-sky-300 bg-black/40 border border-sky-500/20 rounded-lg p-2">
                  {selectedChoice.marketImpact.spotChangePercent && <div>Spot shift: {(selectedChoice.marketImpact.spotChangePercent*100).toFixed(1)}%</div>}
                  {selectedChoice.marketImpact.ivChangePercent && <div>IV shift: {(selectedChoice.marketImpact.ivChangePercent*100).toFixed(1)}%</div>}
                </div>
              )}
              <div className="flex justify-end pt-2">
                <button onClick={handleConfirm} className="snes-btn-primary px-4 py-2 rounded-xl flex items-center gap-1.5"><span>PROCEED</span><ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
