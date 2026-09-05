import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../lib/audioEngine';

interface TerminalCommandLineProps {
  onCommand: (command: string) => void;
  outputLog: string[];
}

export const TerminalCommandLine: React.FC<TerminalCommandLineProps> = ({ onCommand, outputLog }) => {
  const [input, setInput] = useState('');
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [outputLog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sound.playKeyClick();
    onCommand(input.trim());
    setInput('');
  };

  return (
    <div className="zelda-panel p-2.5 bg-slate-900/90 rounded-xl border-2 border-amber-500/20 flex flex-col gap-2">
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
      <div className="text-[10px] text-slate-500 text-center">Oracle divination circle • Carved runes • Amber sigils • No CRT, no phosphor • Warm saturated SNES palette • Fail to Learn = Protection</div>
    </div>
  );
};
