import React, { useState } from 'react';
import { OPTIONS_LESSONS } from '../lib/lessonsData';
import { sound } from '../lib/audioEngine';
import { BookOpen, CheckCircle, X, Award, HelpCircle, Crown } from 'lucide-react';

interface GrimoireModalProps {
  onAwardFlorins: (amount: number) => void;
  onClose: () => void;
}

export const GrimoireModal: React.FC<GrimoireModalProps> = ({ onAwardFlorins, onClose }) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(OPTIONS_LESSONS[0].id);
  const [quizAnswers, setQuizAnswers] = useState<{ [lessonId: string]: number }>({});
  const [solvedQuizzes, setSolvedQuizzes] = useState<{ [lessonId: string]: boolean }>({});

  const activeLesson = OPTIONS_LESSONS.find(l => l.id === selectedLessonId) || OPTIONS_LESSONS[0];

  const handleSelectAnswer = (optionIdx: number) => {
    sound.playKeyClick();
    setQuizAnswers(prev => ({ ...prev, [activeLesson.id]: optionIdx }));
    if (optionIdx === activeLesson.quizQuestion.correctIndex && !solvedQuizzes[activeLesson.id]) {
      sound.playFanfare();
      setSolvedQuizzes(prev => ({ ...prev, [activeLesson.id]: true }));
      onAwardFlorins(180);
    } else if (optionIdx !== activeLesson.quizQuestion.correctIndex) {
      sound.playAlarmSound();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm">
      <div className="oracle-bottom-sheet w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b-2 border-amber-500/30 bg-gradient-to-r from-slate-900 to-[#1a2744]">
          <div className="flex items-center gap-3">
            <div className="oracle-glyph w-8 h-8"><BookOpen className="w-4 h-4 text-amber-300" /></div>
            <div>
              <h2 className="font-cinzel text-lg text-amber-200">GRIMOIRE OF DERIVATIVES • Sacred Options Handbook</h2>
              <div className="text-[11px] text-slate-400">Olmstead progression: each strategy = chapter • Graham philosophy • Fail to Learn = permanent protection</div>
            </div>
          </div>
          <button onClick={onClose} className="snes-btn p-2 rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 overflow-hidden p-3 bg-gradient-to-b from-[#121a2e] to-[#0a0e1d]">
          <div className="md:col-span-4 border-2 border-amber-500/20 bg-slate-900/60 p-2 rounded-xl space-y-1.5 overflow-y-auto max-h-[70vh]">
            <div className="font-cinzel text-amber-300 text-xs border-b border-amber-500/20 pb-1 mb-2 flex items-center justify-between">
              <span>RUNIC CODEX • Olmstead</span>
              <Crown className="w-3 h-3" />
            </div>
            {OPTIONS_LESSONS.map((lesson, idx) => {
              const isSelected = lesson.id === activeLesson.id;
              const isSolved = solvedQuizzes[lesson.id];
              return (
                <button key={lesson.id} onClick={() => { sound.playKeyClick(); setSelectedLessonId(lesson.id); }} className={`w-full text-left p-2.5 border-2 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-bold' : 'border-slate-700 bg-slate-900/40 hover:border-amber-500/40 text-slate-300'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{idx+1}. {lesson.concept}</span>
                    {isSolved && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{lesson.runeTitle.slice(0,40)}...</div>
                </button>
              );
            })}
          </div>

          <div className="md:col-span-8 border-2 border-slate-700 bg-slate-900/60 p-3 md:p-4 rounded-xl space-y-3 overflow-y-auto max-h-[70vh]">
            <div>
              <h3 className="font-cinzel text-base text-amber-200 mb-1">{activeLesson.runeTitle}</h3>
              <p className="text-xs italic text-sky-300 border-l-4 border-sky-400 pl-2 my-2 bg-sky-950/20 p-2 rounded-r-lg">{activeLesson.quote}</p>
            </div>
            <div>
              <div className="font-bold text-[11px] text-amber-200/60 uppercase tracking-widest mb-1">Explanation • Oracle Sight</div>
              <p className="leading-relaxed text-sm text-slate-200">{activeLesson.explanation}</p>
            </div>
            <div className="p-2.5 border border-dashed border-slate-600 bg-black/40 rounded-xl space-y-1 text-xs">
              <div><strong className="text-emerald-400">Discipline Rule:</strong> <span className="text-slate-300">{activeLesson.practicalRule}</span></div>
              <div><strong className="text-sky-300">Realm & Combat:</strong> <span className="text-slate-300">{activeLesson.gameApplication}</span></div>
            </div>

            <div className="p-3 border-2 border-amber-500/30 bg-slate-950 rounded-xl space-y-2">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-300 text-sm"><HelpCircle className="w-4 h-4" /> MASTER'S TRIAL</span>
                {solvedQuizzes[activeLesson.id] ? <span className="text-emerald-300 font-bold flex items-center gap-1 text-xs"><Award className="w-3.5 h-3.5" /> MASTERED +180ƒ</span> : <span className="text-[11px] text-slate-500">Reward 180ƒ • Oracle Bond +0.1</span>}
              </div>
              <p className="font-bold text-sm text-slate-100">{activeLesson.quizQuestion.prompt}</p>
              <div className="space-y-1.5">
                {activeLesson.quizQuestion.options.map((opt, oIdx) => {
                  const isChosen = quizAnswers[activeLesson.id] === oIdx;
                  const isCorrect = oIdx === activeLesson.quizQuestion.correctIndex;
                  let btnStyle = 'border-slate-600 bg-slate-900/60 hover:bg-slate-800 text-slate-200';
                  if (isChosen) btnStyle = isCorrect ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200 font-bold' : 'border-red-500 bg-red-950/60 text-red-200 font-bold';
                  return (
                    <button key={oIdx} onClick={() => handleSelectAnswer(oIdx)} className={`w-full text-left p-2.5 border-2 rounded-xl cursor-pointer text-sm ${btnStyle}`}>
                      <span className="mr-1.5 opacity-60">[{String.fromCharCode(65+oIdx)}]</span>{opt}
                    </button>
                  );
                })}
              </div>
              {quizAnswers[activeLesson.id] !== undefined && (
                <div className={`p-2.5 border-2 rounded-xl text-sm leading-relaxed ${quizAnswers[activeLesson.id] === activeLesson.quizQuestion.correctIndex ? 'border-emerald-400 text-emerald-200 bg-emerald-950/20' : 'border-red-500 text-red-200 bg-red-950/20'}`}>
                  <strong>{quizAnswers[activeLesson.id] === activeLesson.quizQuestion.correctIndex ? 'CORRECT! Permanent wisdom + Oracle Bond!' : 'INCORRECT. Re-read Graham.'} </strong>{activeLesson.quizQuestion.explanation}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 border-t-2 border-amber-500/20 bg-slate-950 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">Answer trials correctly to earn florins + Oracle Bond • Fail forward = Graham protection permanent</span>
          <button onClick={onClose} className="snes-btn-primary px-4 py-1.5 rounded-xl text-xs">CLOSE CODEX</button>
        </div>
      </div>
    </div>
  );
};
