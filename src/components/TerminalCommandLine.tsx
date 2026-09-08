import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../lib/audioEngine';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TerminalCommandLineProps {
  onCommand: (command: string) => void;
  outputLog: string[];
}

/**
 * HUD DISCIPLINE (game-feel rework): the oracle ticker/log is no longer part
 * of the always-visible frame. Collapsed by default to a one-line strip that
 * previews the latest event; expand to read the full log and command circle.
 */
export const TerminalCommandLine: React.FC<TerminalCommandLineProps> = ({ onCommand, outputLog }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (open) logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [outputLog, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sound.playKeyClick();
    onCommand(input.trim());
    setInput('');
  };

  if (!open) {
    return (
      <button
        onClick={() => { sound.playKeyClick(); setOpen(true); }}
        className="zelda-panel w-full p-1.5 px-3 bg-slate-900/80 rounded-xl border-2 border-amber-500/20 flex items-center justify-between gap-2 text-left cursor-pointer"
        aria-expanded={false}
      >
        <span className="flex items-center gap-2 min-w-0 text-[11px] font-snes text-slate-400">
          <span className="oracle-glyph w-5 h-5 border-amber-400 shrink-0 text-[10px] flex items-center justify-center">ᛚ</span>
          <span className="font-cinzel font-bold text-amber-300/80 text-[11px] shrink-0">ORACLE TERMINAL</span>
          <span className="opacity-70">{outputLog.length} event{outputLog.length === 1 ? '' : 's'} logged</span>
        </span>
        <ChevronUp className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
      </button>
    );
  }

  return (
    <div className="zelda-panel p-2.5 bg-slate-900/90 rounded-xl border-2 border-amber-500/20 flex flex-col gap-2">
      <button
        onClick={() => { sound.playKeyClick(); setOpen(false); }}
        className="self-end flex items-center gap-1 text-[10px] tracking-widest text-slate-400 hover:text-amber-200 cursor-pointer"
        aria-expanded={true}
      >
        COLLAPSE <ChevronDown className="w-3.5 h-3.5" />
      </button>
      <div className="max-h-28 overflow-y-auto space-y-1 p-1.5 bg-black/40 rounded-lg border border-slate-700/50">
        {outputLog.map((line, idx) => (
          <div key={idx} className="leading-snug text-[12px] font-snes text-slate-300 whitespace-pre-wrap">{line}</div>
        ))}
        <div ref={logEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t-2 border-amber-500/20 pt-2">
        <div className="oracle-glyph w-6 h-6 border-amber-400 shrink-0"><span className="text-[11px]">ᛚ</span></div>
        <span className="font-cinzel font-bold text-amber-300 text-xs shrink-0">ORACLE CIRCLE ▸</span>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Speak: HELP, TRADE, MAP, PORTFOLIO, REST, INVENTORY, LEDGER" className="flex-1 bg-transparent border-none outline-none text-amber-100 font-snes text-xs placeholder:text-slate-600 focus:ring-0" autoComplete="off" spellCheck="false" />
        <span className="animate-pulse font-bold text-amber-400 text-xs">◈</span>
      </form>
    </div>
  );
};
