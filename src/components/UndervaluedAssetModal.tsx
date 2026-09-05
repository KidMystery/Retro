import React, { useState } from 'react';
import { UndervaluedAsset, PlayerStats } from '../types';
import { sound } from '../lib/audioEngine';
import { Award, CheckCircle2, Crown, Sparkles } from 'lucide-react';

interface UndervaluedAssetModalProps {
  asset: UndervaluedAsset;
  player: PlayerStats;
  onSelectChoice: (choiceIndex: number) => void;
  onClose: () => void;
}

export const UndervaluedAssetModal: React.FC<UndervaluedAssetModalProps> = ({ asset, player, onSelectChoice, onClose }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [outcomeRevealed, setOutcomeRevealed] = useState(false);

  const handleChoose = (idx: number) => {
    setSelectedIdx(idx);
    setOutcomeRevealed(true);
    const choice = asset.choices[idx];
    if (choice.awardsHeartContainer) sound.playHeartContainer();
    else if (choice.heartsEffect > 0) sound.playSecretChime();
    else if (choice.heartsEffect < 0) sound.playAlarmSound();
  };

  const activeChoice = selectedIdx !== null ? asset.choices[selectedIdx] : null;

  const pathColor =
    asset.pathAffinity === 'INVESTOR' ? 'border-green-400 bg-green-950/20 text-green-200' :
    asset.pathAffinity === 'TRADER' ? 'border-red-400 bg-red-950/20 text-red-200' :
    'border-sky-400 bg-sky-950/20 text-sky-200';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 backdrop-blur-sm">
      <div className="zelda-panel w-full max-w-3xl p-4 max-h-[92vh] overflow-y-auto rounded-xl shadow-2xl">
        <div className="flex items-center justify-between border-b-2 border-amber-400/30 pb-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-black font-bold px-2 py-0.5 text-[11px] rounded">SECRET DISCOVERY • Oracle Lens</span>
              <h2 className="font-cinzel text-base md:text-lg font-bold text-amber-200">{asset.name} ({asset.symbol})</h2>
              <span className={`text-[11px] px-2 py-0.5 border rounded font-bold ${pathColor}`}>{asset.pathAffinity}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{asset.locationName} • {asset.category}</p>
          </div>
          <button onClick={onClose} className="snes-btn px-2 py-1 text-xs rounded-md">EXIT</button>
        </div>

        <div className="bg-slate-900/80 border border-amber-500/20 p-3 mb-3 rounded-xl">
          <div className="font-cinzel text-amber-200 text-xs mb-1 flex items-center gap-2">
            <div className="oracle-glyph w-5 h-5"><div className="oracle-emerald-core w-2 h-2" /></div>
            ANALYST AUDIT • Oracle Sight • True Worth
          </div>
          <p className="mb-2 leading-relaxed text-sm text-slate-200">{asset.description}</p>
          <div className="p-2 bg-black/40 border border-amber-500/20 rounded-lg text-xs text-amber-200/70 italic">
            <strong className="text-amber-300">Oracle Insight:</strong> {asset.oracleInsight}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-2 border-t border-amber-500/20 text-center">
            <div className="p-2 bg-black/60 border border-slate-700 rounded-lg"><div className="text-[10px] text-slate-400">MARKET SPOT</div><div className="text-sm font-bold text-sky-300">${asset.marketSpot} ƒ</div></div>
            <div className="p-2 bg-black/60 border border-slate-700 rounded-lg"><div className="text-[10px] text-slate-400">INTRINSIC</div><div className="text-sm font-bold text-emerald-400">${asset.intrinsicValue} ƒ</div></div>
            <div className="p-2 bg-black/60 border border-amber-500/30 rounded-lg"><div className="text-[10px] text-slate-400">MARGIN SAFETY</div><div className="text-sm font-bold text-amber-300">+{asset.marginOfSafetyPercent.toFixed(1)}%</div></div>
            <div className="p-2 bg-black/60 border border-slate-700 rounded-lg"><div className="text-[10px] text-slate-400">P/E & IV</div><div className="text-sm font-bold text-purple-300">{asset.peRatio}x / {(asset.currentIv*100).toFixed(0)}%</div></div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Catalyst: {asset.catalyst}</div>
        </div>

        {!outcomeRevealed ? (
          <div>
            <div className="font-cinzel text-amber-200 text-sm mb-2">DECISION: How will you deploy capital? • Path matters • True ending same</div>
            <div className="space-y-2">
              {asset.choices.map((c, idx) => {
                const canAfford = player.florins >= c.costFlorins;
                const pathScore = c.pathScore ? `T+${c.pathScore.trader||0} I+${c.pathScore.investor||0}` : '';
                return (
                  <button key={idx} disabled={!canAfford} onClick={() => handleChoose(idx)} className={`w-full text-left p-3 border-2 rounded-xl transition-all ${canAfford ? 'bg-slate-900/60 border-slate-600 hover:border-amber-400 hover:bg-slate-800 text-slate-200' : 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'}`}>
                    <div className="flex items-center justify-between font-bold mb-1 text-sm">
                      <span>[{idx+1}] {c.title}</span>
                      <span className="flex items-center gap-2">
                        {c.costFlorins>0 ? <span className="text-amber-300">Cost {c.costFlorins}ƒ</span> : <span className="text-emerald-400">Credit</span>}
                        {pathScore && <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-amber-500/20 rounded">{pathScore}</span>}
                        {c.relicReward && <span className="text-[10px] px-1.5 py-0.5 bg-amber-950 border border-amber-500/30 text-amber-300 rounded flex items-center gap-1"><Crown className="w-3 h-3" />{c.relicReward}</span>}
                      </span>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">{c.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 border-2 border-amber-400 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 font-cinzel text-amber-200 text-sm"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> CONSEQUENCE • Oracle Bond +0.2</div>
            <p className="text-sm leading-relaxed text-slate-200">{activeChoice?.consequenceText}</p>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-500/20">
              {activeChoice?.awardsHeartContainer && <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/50 border border-red-500/50 text-red-300 font-bold rounded-lg text-xs"><Award className="w-4 h-4" />+1 HEART CONTAINER!</div>}
              {activeChoice?.heartsEffect && activeChoice.heartsEffect>0 && <div className="px-2 py-1 border border-emerald-500/50 text-emerald-300 font-bold rounded-lg text-xs">+{activeChoice.heartsEffect}♥ Restored</div>}
              {activeChoice?.heartsEffect && activeChoice.heartsEffect<0 && <div className="px-2 py-1 border border-red-500/50 text-red-300 font-bold rounded-lg text-xs">{activeChoice.heartsEffect}♥ Lost</div>}
              <div className="px-2 py-1 border border-amber-500/50 text-amber-300 font-bold rounded-lg text-xs">{activeChoice?.florinsGain && activeChoice.florinsGain>=0?'+':''}{activeChoice?.florinsGain}ƒ Net</div>
              {activeChoice?.relicReward && <div className="px-2 py-1 border border-amber-400 bg-amber-950/30 text-amber-200 font-bold rounded-lg text-xs flex items-center gap-1"><Sparkles className="w-3 h-3" />Relic: {activeChoice.relicReward}</div>}
            </div>
            <button onClick={() => { if (selectedIdx!==null) onSelectChoice(selectedIdx); }} className="snes-btn-primary w-full mt-2 py-2.5 rounded-xl">ACCEPT CONSEQUENCE & CONTINUE • Path {player.currentPath}</button>
          </div>
        )}
      </div>
    </div>
  );
};
