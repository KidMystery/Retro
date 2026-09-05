import React, { useState } from 'react';
import { INTELLIGENT_INVESTOR_LESSONS } from '../lib/intelligentInvestorData';
import { PlayerStats, GrahamProtectionId, TradeFailReason } from '../types';
import { sound } from '../lib/audioEngine';
import { BookOpen, Sparkles, Heart, ShieldCheck, Crown } from 'lucide-react';

interface IntelligentInvestorSanctuaryModalProps {
  player: PlayerStats;
  onRevive: (lessonId?: GrahamProtectionId) => void;
  onClose?: () => void;
  forcedLessonId?: GrahamProtectionId;
  failReason?: TradeFailReason;
}

export const IntelligentInvestorSanctuaryModal: React.FC<IntelligentInvestorSanctuaryModalProps> = ({
  player,
  onRevive,
  forcedLessonId,
  failReason
}) => {
  const lesson = forcedLessonId 
    ? INTELLIGENT_INVESTOR_LESSONS.find(l => l.id === forcedLessonId) || INTELLIGENT_INVESTOR_LESSONS[0]
    : INTELLIGENT_INVESTOR_LESSONS[player.intelligentInvestorRevivals % INTELLIGENT_INVESTOR_LESSONS.length];

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setAnswered(true);
    const correct = idx === lesson.reflectionQuestion.correctIndex;
    setIsCorrect(correct);
    if (correct) sound.playHeartContainer();
    else sound.playAlarmSound();
  };

  const isAlreadyProtected = player.grahamProtections.includes(lesson.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 backdrop-blur-sm">
      <div className="zelda-panel w-full max-w-3xl p-4 sm:p-6 max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl border-sky-400">
        <div className="flex items-center gap-3 border-b-2 border-sky-400/40 pb-3 mb-4">
          <div className="oracle-glyph w-12 h-12 border-sky-400">
            <Sparkles className="w-6 h-6 text-sky-300 animate-pulse" />
          </div>
          <div>
            <div className="font-cinzel text-[11px] text-amber-300 tracking-[0.2em] uppercase">THE SANCTUARY OF THE QUIET ORACLE • Fail to Learn Loop</div>
            <h2 className="font-cinzel text-base sm:text-xl font-bold text-sky-200">LIFE FORCE CRACKED: {failReason ? `${failReason} •` : ''} Graham Reflection Required</h2>
            <div className="text-[11px] text-slate-400">Cannot leave until correct • Correct = permanent protection • Cannot be held hostage again</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-sky-500/20 p-3.5 mb-4 rounded-xl space-y-2">
          <p className="italic text-amber-200 text-sm leading-relaxed font-snes">
            "Halt, {player.name}. Your hearts {player.hearts <=0 ? 'vanished' : 'cracked'}. {failReason ? `Reason: ${failReason}.` : 'You allowed speculation, leverage, or FOMO to dictate.'} In markets as in life, capital without discipline evaporates. But this is design pillar: fail → learn → permanent protection."
          </p>
          <div className="p-2.5 border-l-4 border-amber-400 bg-amber-950/20 text-amber-100 text-xs rounded-r-lg">
            <span className="font-bold text-amber-300">GRAHAM MAXIM {lesson.oracleRune}:</span> {lesson.quote}
          </div>
          {isAlreadyProtected && (
            <div className="p-2 bg-green-950/30 border border-green-500/40 rounded-lg text-green-200 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Already protected by this lesson! This refresh restores hearts + Oracle Bond, but you already have permanent shield vs this mistake.
            </div>
          )}
        </div>

        <div className="bg-[#0c1830] border-2 border-sky-400/30 p-4 mb-4 rounded-xl space-y-3">
          <div className="flex items-center gap-2 font-bold text-sky-300 font-cinzel text-sm">
            <BookOpen className="w-4 h-4" />
            <span>{lesson.oracleRune} {lesson.title} ({lesson.chapter})</span>
          </div>
          <p className="leading-relaxed text-sm text-slate-200">{lesson.corePhilosophy}</p>
          <div className="p-2.5 border border-red-500/30 bg-red-950/20 text-red-200 text-xs rounded-lg">
            <span className="font-bold">CAUSE OF DOWNFALL:</span> {lesson.whyYouFailed}
          </div>
          <div className="p-2.5 border border-emerald-500/30 bg-emerald-950/20 text-emerald-200 text-xs rounded-lg flex items-center gap-2">
            <Crown className="w-4 h-4" /> <span><strong>Permanent Bonus:</strong> {lesson.protectionBonus}</span>
          </div>
        </div>

        <div className="bg-slate-950 border-2 border-amber-400 p-4 mb-4 rounded-xl">
          <div className="font-cinzel text-amber-200 text-sm mb-2 flex items-center gap-2">
            <span>◆ TRIAL OF WISDOM ◆</span>
            <span className="text-[11px] text-slate-400">Demonstrate discipline to restore hearts</span>
          </div>
          <p className="mb-3 text-sm font-bold text-slate-100">{lesson.reflectionQuestion.prompt}</p>
          <div className="space-y-2">
            {lesson.reflectionQuestion.choices.map((choice, idx) => {
              const isSelected = selectedAnswer === idx;
              let btnStyle = 'border-slate-600 bg-slate-900/60 hover:bg-sky-900/30 hover:border-sky-400 text-slate-200';
              if (answered) {
                if (idx === lesson.reflectionQuestion.correctIndex) btnStyle = 'border-green-400 bg-green-950/60 text-green-200 font-bold';
                else if (isSelected) btnStyle = 'border-red-500 bg-red-950/60 text-red-200';
                else btnStyle = 'opacity-30 border-slate-800 text-slate-600';
              }
              return (
                <button key={idx} disabled={answered} onClick={() => handleSelectAnswer(idx)} className={`w-full text-left p-2.5 border-2 rounded-lg transition-all text-sm cursor-pointer ${btnStyle}`}>
                  <span className="font-bold mr-2">[{String.fromCharCode(65+idx)}]</span>{choice}
                </button>
              );
            })}
          </div>
          {answered && (
            <div className={`mt-3 p-2.5 border-2 rounded-xl text-sm leading-relaxed ${isCorrect ? 'border-green-400 bg-green-950/30 text-green-200' : 'border-red-400 bg-red-950/30 text-red-200'}`}>
              <div className="font-bold mb-1">{isCorrect ? '✅ WISDOM ACKNOWLEDGED! Permanent protection unlocked!' : '❌ INCORRECT PRINCIPLE • Re-read Graham'}</div>
              {lesson.reflectionQuestion.explanation}
            </div>
          )}
        </div>

        {answered && isCorrect && (
          <button onClick={() => onRevive(lesson.id)} className="snes-btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold">
            <Heart className="w-5 h-5 fill-red-600 text-red-600" />
            <span>RESTORE ALL {player.maxHearts}♥ + PERMANENT {lesson.id.toUpperCase()} PROTECTION + ORACLE BOND +0.3</span>
          </button>
        )}
        {answered && !isCorrect && (
          <button onClick={() => { setAnswered(false); setSelectedAnswer(null); }} className="snes-btn w-full py-2.5 rounded-xl text-sm">RE-READ LESSON & RETRY TRIAL • Cannot leave until correct</button>
        )}

        <div className="mt-3 text-[11px] text-center text-slate-500">
          Design Pillar: Fail → Learn → Permanent Protection • Multiple paths same crown • {player.grahamProtections.length} protections • Path {player.currentPath} • Bond {player.oracleBondLevel?.toFixed(1)}/5
        </div>
      </div>
    </div>
  );
};
