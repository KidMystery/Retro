import React, { useState } from 'react';
import { CombatState, PlayerStats, CombatAttackPuzzle, OptionContract } from '../types';
import { getAttackPuzzleForTier } from '../lib/combatPuzzles';
import { sound } from '../lib/audioEngine';
import { Swords, Shield, Sparkles, Heart, AlertTriangle, BookOpen, CheckCircle2, Crown, Zap } from 'lucide-react';

interface ZeldaCombatModalProps {
  combat: CombatState;
  player: PlayerStats;
  positions?: OptionContract[];
  onExecutePuzzleAttack: (bonusDamage: number, isCorrect: boolean, explanation: string) => void;
  onShieldBlock: () => void;
  onUseItem: (itemType: 'healthElixir' | 'ivStabilizer' | 'timeHourglass') => void;
  onFlee: () => void;
}

export const ZeldaCombatModal: React.FC<ZeldaCombatModalProps> = ({
  combat,
  player,
  positions = [],
  onExecutePuzzleAttack,
  onShieldBlock,
  onUseItem,
  onFlee
}) => {
  const enemy = combat.enemy;
  const [activePuzzle, setActivePuzzle] = useState<CombatAttackPuzzle | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [puzzleOutcome, setPuzzleOutcome] = useState<{ isCorrect: boolean; explanation: string; bonus: number } | null>(null);

  const openAttackPuzzle = () => {
    const tier = player.investorTier || 1;
    const p = getAttackPuzzleForTier(tier);
    setActivePuzzle(p);
    setSelectedOption(null);
    setPuzzleOutcome(null);
  };

  const handleSolvePuzzle = (idx: number) => {
    if (!activePuzzle) return;
    const opt = activePuzzle.options[idx];
    setSelectedOption(idx);
    setPuzzleOutcome({ isCorrect: opt.isCorrect, explanation: opt.explanation, bonus: opt.damageBonus });
    if (opt.isCorrect) sound.playSwordSlash();
    else sound.playAlarmSound();
  };

  const handleConfirmAttack = () => {
    if (!puzzleOutcome) return;
    onExecutePuzzleAttack(puzzleOutcome.bonus, puzzleOutcome.isCorrect, puzzleOutcome.explanation);
    setActivePuzzle(null);
    setSelectedOption(null);
    setPuzzleOutcome(null);
  };

  if (!enemy) return null;
  const enemyHpPercent = Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100));

  const renderHearts = () => {
    const hearts = [];
    const total = player.maxHearts || 4;
    for (let i = 0; i < total; i++) {
      const rem = player.hearts - i;
      if (rem >= 1) hearts.push(<Heart key={i} className="w-4 h-4 fill-red-500 text-red-600" />);
      else if (rem >= 0.4) hearts.push(<Heart key={i} className="w-4 h-4 fill-red-400 text-red-500 opacity-70" />);
      else hearts.push(<Heart key={i} className="w-4 h-4 fill-slate-800 text-slate-700 opacity-30" />);
    }
    return hearts;
  };

  const hasWeakness = enemy.weaknessStrategy?.some(ws => positions.map(p => p.strategy).includes(ws));

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 md:p-4 backdrop-blur-sm">
      <div className="zelda-panel w-full max-w-4xl p-4 max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl">
        <div className="flex items-center justify-between border-b-2 border-red-500/40 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="oracle-glyph w-8 h-8 border-red-400">
              <Swords className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h2 className="font-cinzel text-base md:text-lg font-bold text-red-300 flex items-center gap-2">
                TACTICAL ARENA • {enemy.name}
                <span className="text-[11px] px-1.5 py-0.5 bg-red-950 border border-red-500 text-red-300 rounded">{enemy.type}</span>
              </h2>
              <p className="text-[11px] text-slate-400">TURN #{combat.turn} • Risk Sensitivity {enemy.riskSensitivity}x • Path {player.currentPath} • Graham {player.grahamProtections.length} shields</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">{renderHearts()}</div>
            <span className="font-bold text-red-400 text-xs">{player.hearts.toFixed(1)}/{player.maxHearts}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-900/80 border-2 border-red-500/40 p-3 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-red-300 font-cinzel">{enemy.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-amber-950 border border-amber-500/40 text-amber-300 rounded">{enemy.title}</span>
            </div>
            <p className="text-[11px] text-slate-400 italic mb-2">{enemy.lore.slice(0,140)}...</p>
            <div className="mb-2">
              <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-400">HP</span><span className="font-bold text-red-400">{enemy.currentHp}/{enemy.maxHp}</span></div>
              <div className="w-full h-3 bg-red-950 border border-red-500/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all" style={{ width: `${enemyHpPercent}%` }} />
              </div>
            </div>
            <div className="p-2 border border-amber-500/30 bg-amber-950/20 rounded-lg text-[11px] text-amber-200">
              <strong>Special:</strong> {enemy.specialMove}
            </div>
            {hasWeakness && (
              <div className="mt-2 p-2 bg-green-950/30 border border-green-500/40 rounded-lg text-[11px] text-green-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Oracle reveals weakness! {enemy.weaknessStrategy?.join(', ')} deals +50%!
              </div>
            )}
            <div className="h-20 flex items-center justify-center border border-red-500/20 bg-black/40 rounded-lg mt-2 text-red-400 font-cinzel text-sm">
              {enemy.type === 'BEAR' ? '🐻 GRIZZLY BEAR PHANTOM' : enemy.type === 'HYDRA' ? '🐉 HYDRA VEGA' : enemy.type === 'REAPER' ? '👑 MARDUK VEX' : '🦀 CRAB GOLEM'}
            </div>
          </div>

          <div className="bg-slate-900/80 border-2 border-amber-500/20 p-3 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-200 font-cinzel">{player.name} • {player.title}</span>
                <span className="text-[11px] px-1.5 py-0.5 bg-slate-800 border border-amber-500/30 text-amber-300 rounded">TIER {player.investorTier} • Bond {player.oracleBondLevel?.toFixed(1)}/5</span>
              </div>
              <div className="h-36 overflow-y-auto border border-slate-700 p-2 bg-black/60 rounded-lg space-y-1 text-[12px] font-snes">
                <div className="text-amber-300 font-bold border-b border-amber-500/20 pb-1">ACTION LOG • Oracle Sight</div>
                {combat.combatLog.slice(-6).map((log, idx) => (
                  <div key={idx} className="text-slate-300 leading-tight">{log}</div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-2 text-center text-[11px]">
              <div className="p-1.5 border border-amber-500/20 bg-black/40 rounded-lg"><span className="text-slate-400">Florins</span><br/><strong className="text-amber-300">{player.florins}ƒ</strong></div>
              <div className="p-1.5 border border-sky-500/20 bg-black/40 rounded-lg"><span className="text-slate-400">Δ Delta</span><br/><strong className={player.netDelta>=0?'text-green-400':'text-red-400'}>{player.netDelta.toFixed(2)}</strong></div>
              <div className="p-1.5 border border-emerald-500/20 bg-black/40 rounded-lg"><span className="text-slate-400">Elixirs</span><br/><strong className="text-emerald-300">{player.potions.healthElixir}</strong></div>
            </div>
          </div>
        </div>

        {activePuzzle ? (
          <div className="bg-slate-950 border-2 border-amber-400 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
              <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-300" /><span className="font-cinzel text-sm text-amber-200">ATTACK PUZZLE • TIER {activePuzzle.difficultyTier} • {player.currentPath} Path</span></div>
              <span className="text-[11px] text-amber-200/60">Solve to strike with Master Sword ᛚ</span>
            </div>
            <p className="text-sm font-bold text-slate-100">{activePuzzle.prompt}</p>
            <p className="text-[11px] text-slate-400 italic">Context: {activePuzzle.context} • Graham Shields {player.grahamProtections.length} active</p>
            <div className="space-y-2">
              {activePuzzle.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let style = 'border-slate-600 bg-slate-900/60 hover:bg-amber-500/20 hover:border-amber-400 text-slate-200';
                if (puzzleOutcome) {
                  if (opt.isCorrect) style = 'border-green-400 bg-green-950/60 text-green-200 font-bold';
                  else if (isSelected) style = 'border-red-500 bg-red-950/60 text-red-200';
                  else style = 'opacity-30 border-slate-800 text-slate-600';
                }
                return (
                  <button key={idx} disabled={puzzleOutcome !== null} onClick={() => handleSolvePuzzle(idx)} className={`w-full text-left p-2.5 border-2 rounded-lg transition-all text-sm cursor-pointer ${style}`}>
                    <span className="font-bold mr-2">[{opt.label}]</span>{opt.text}
                  </button>
                );
              })}
            </div>
            {puzzleOutcome && (
              <div className={`p-3 border-2 rounded-xl text-sm leading-relaxed ${puzzleOutcome.isCorrect ? 'border-green-400 bg-green-950/30 text-green-200' : 'border-red-400 bg-red-950/30 text-red-200'}`}>
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {puzzleOutcome.isCorrect ? <><CheckCircle2 className="w-4 h-4 text-green-400" /> CRITICAL STRIKE! +{puzzleOutcome.bonus} DMG • +0.5♥</> : <><AlertTriangle className="w-4 h-4 text-red-400" /> FLAWED THESIS! -1.0♥</>}
                </div>
                <p>{puzzleOutcome.explanation}</p>
                <button onClick={handleConfirmAttack} className="snes-btn-primary w-full mt-3 py-2.5 rounded-xl">EXECUTE STRIKE ⚔️ • Oracle Bond +0.1</button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t-2 border-red-500/20">
            <button onClick={openAttackPuzzle} className="snes-btn p-3 flex flex-col items-center gap-1 rounded-xl">
              <Swords className="w-5 h-5 text-amber-300" />
              <span className="font-bold text-xs">SWORD ATTACK</span>
              <span className="text-[10px] opacity-60">Solve Puzzle</span>
            </button>
            <button onClick={onShieldBlock} className="snes-btn p-3 flex flex-col items-center gap-1 rounded-xl border-sky-500/40">
              <Shield className="w-5 h-5 text-sky-300" />
              <span className="font-bold text-xs">SHIELD BLOCK</span>
              <span className="text-[10px] opacity-60">Graham Ward</span>
            </button>
            <button disabled={player.potions.healthElixir <=0} onClick={() => onUseItem('healthElixir')} className={`snes-btn p-3 flex flex-col items-center gap-1 rounded-xl ${player.potions.healthElixir>0 ? '' : 'opacity-40 cursor-not-allowed'}`}>
              <Sparkles className="w-5 h-5 text-emerald-300" />
              <span className="font-bold text-xs">ELIXIR {player.potions.healthElixir}</span>
              <span className="text-[10px] opacity-60">Heal +2.0♥</span>
            </button>
            <button onClick={onFlee} className="snes-btn p-3 flex flex-col items-center gap-1 rounded-xl border-slate-600">
              <span className="font-bold text-xs">FLEE</span>
              <span className="text-[10px] opacity-60">NO trade = best trade sometimes</span>
            </button>
          </div>
        )}

        <div className="mt-3 text-[11px] text-center text-slate-500">
          Combat scales with portfolio {Math.round(player.portfolioValue).toLocaleString()}ƒ • Risk {player.riskScore} • Weakness {enemy.weaknessStrategy?.join(', ') || 'puzzle mastery'} • Path {player.currentPath} +15% bonus
        </div>
      </div>
    </div>
  );
};
