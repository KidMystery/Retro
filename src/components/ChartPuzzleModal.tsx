import React from 'react';
import { ChartPuzzle } from '../lib/curriculum/chartPuzzles';

/**
 * Wiring 4: chart-reading puzzle room. Renders the puzzle's OHLC series as a
 * mini candlestick canvas (rect bodies + wick lines) with MCQ choices.
 * Correct = rune + florin bonus; wrong = sanctuary loop with the lesson text.
 */
interface ChartPuzzleModalProps {
  puzzle: ChartPuzzle;
  onAnswer: (correct: boolean) => void;
  onLeave: () => void;
}

const W = 320, H = 160, PAD = 16;

export const ChartPuzzleModal: React.FC<ChartPuzzleModalProps> = ({ puzzle, onAnswer, onLeave }) => {
  const [picked, setPicked] = React.useState<number | null>(null);
  const [revealed, setRevealed] = React.useState(false);

  const los = puzzle.candles.map(c => c.l);
  const his = puzzle.candles.map(c => c.h);
  const min = Math.min(...los), max = Math.max(...his);
  const range = max - min || 1;
  const cw = (W - PAD * 2) / puzzle.candles.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#0d1526] border-4 border-sky-400 rounded-lg shadow-2xl">
        <div className="px-4 py-2 border-b-2 border-sky-500/40 bg-gradient-to-r from-[#1a2744] to-[#0d1526] flex justify-between items-center">
          <span className="font-mono text-xs tracking-widest text-sky-300">🕯 CHART PUZZLE ROOM • {puzzle.pattern.toUpperCase()}</span>
          <span className="font-mono text-[10px] text-slate-400">DIFFICULTY {'★'.repeat(puzzle.difficulty)}</span>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="font-cinzel text-base text-amber-200">{puzzle.title}</h3>
          {/* Mini candlestick canvas (SVG rects: green/red bodies + wick lines) */}
          <div className="flex justify-center">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-full h-auto border-2 border-sky-500/40 bg-[#060b14] rounded">
              {puzzle.candles.map((c, i) => {
                const x = PAD + i * cw + cw / 2;
                const y = (v: number) => H - PAD - ((v - min) / range) * (H - PAD * 2);
                const up = c.c >= c.o;
                const color = up ? '#22c55e' : '#ef4444';
                const bodyTop = y(Math.max(c.o, c.c));
                const bodyH = Math.max(2, Math.abs(y(c.o) - y(c.c)));
                return (
                  <g key={i}>
                    <line x1={x} y1={y(c.h)} x2={x} y2={y(c.l)} stroke={color} strokeWidth={1} />
                    <rect x={x - cw * 0.3} y={bodyTop} width={cw * 0.6} height={bodyH} fill={color} />
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="font-mono text-xs text-slate-200 leading-relaxed">{puzzle.question}</p>
          <div className="space-y-2">
            {puzzle.choices.map((choice, i) => {
              const isCorrect = i === puzzle.correctIndex;
              const style = !revealed
                ? 'border-sky-500/50 text-sky-200 hover:bg-sky-500/15'
                : isCorrect
                  ? 'border-green-500 text-green-300 bg-green-500/10'
                  : picked === i
                    ? 'border-red-500 text-red-300 bg-red-500/10'
                    : 'border-slate-700 text-slate-500 opacity-60';
              return (
                <button
                  key={i}
                  disabled={revealed}
                  onClick={() => { setPicked(i); setRevealed(true); }}
                  className={`w-full text-left font-mono text-xs px-3 py-2 border-2 rounded transition-colors ${style}`}
                >
                  {String.fromCharCode(65 + i)}. {choice}
                </button>
              );
            })}
          </div>
          {revealed && (
            <div className="p-3 border-2 border-amber-500/40 bg-amber-500/5 rounded">
              <div className={`font-mono text-xs font-bold tracking-wider mb-1 ${picked === puzzle.correctIndex ? 'text-green-300' : 'text-red-300'}`}>
                {picked === puzzle.correctIndex ? '◆ ROOM SOLVED — RUNE GRANTED' : '✗ THE SANCTUARY CLAIMS YOU'}
              </div>
              <p className="font-mono text-[11px] text-slate-200 leading-relaxed">{puzzle.explanation}</p>
              <p className="font-mono text-[11px] text-amber-300/90 italic mt-1">{picked === puzzle.correctIndex ? '' : `Lesson: ${puzzle.lesson}`}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => onAnswer(picked === puzzle.correctIndex)} className="flex-1 font-mono text-xs font-bold py-2 border-2 border-amber-400 rounded text-amber-200 hover:bg-amber-400/20">
                  CONTINUE
                </button>
              </div>
            </div>
          )}
          <button onClick={onLeave} className="w-full font-mono text-[10px] text-slate-500 hover:text-slate-300">[ RETREAT FROM ROOM ]</button>
        </div>
      </div>
    </div>
  );
};
