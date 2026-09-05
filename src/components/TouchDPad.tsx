import React, { useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Swords, Sparkles } from 'lucide-react';

interface TouchDPadProps {
  onMove: (dir: 'UP'|'DOWN'|'LEFT'|'RIGHT') => void;
  onAction: () => void;
  onSecondary?: () => void;
  disabled?: boolean;
}

export const TouchDPad: React.FC<TouchDPadProps> = ({ onMove, onAction, onSecondary, disabled }) => {
  const handleTouch = useCallback((dir: 'UP'|'DOWN'|'LEFT'|'RIGHT') => {
    if (disabled) return;
    onMove(dir);
  }, [onMove, disabled]);

  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 flex items-end justify-between pointer-events-none md:hidden">
      {/* D-Pad */}
      <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md border-2 border-amber-500/40 rounded-2xl p-2 shadow-2xl">
        <div className="grid grid-cols-3 gap-1.5 w-32 h-32">
          <div />
          <button
            onTouchStart={(e)=>{ e.preventDefault(); handleTouch('UP'); }}
            onMouseDown={()=>handleTouch('UP')}
            className="bg-slate-900 border-2 border-amber-500/50 rounded-xl flex items-center justify-center active:bg-amber-500 active:text-black shadow-md"
            aria-label="Up"
          ><ArrowUp className="w-6 h-6 text-amber-300" /></button>
          <div />
          <button
            onTouchStart={(e)=>{ e.preventDefault(); handleTouch('LEFT'); }}
            onMouseDown={()=>handleTouch('LEFT')}
            className="bg-slate-900 border-2 border-amber-500/50 rounded-xl flex items-center justify-center active:bg-amber-500 active:text-black shadow-md"
            aria-label="Left"
          ><ArrowLeft className="w-6 h-6 text-amber-300" /></button>
          <div className="bg-slate-950 border border-amber-500/20 rounded-xl flex items-center justify-center text-[9px] text-amber-400/50 font-bold">PAD</div>
          <button
            onTouchStart={(e)=>{ e.preventDefault(); handleTouch('RIGHT'); }}
            onMouseDown={()=>handleTouch('RIGHT')}
            className="bg-slate-900 border-2 border-amber-500/50 rounded-xl flex items-center justify-center active:bg-amber-500 active:text-black shadow-md"
            aria-label="Right"
          ><ArrowRight className="w-6 h-6 text-amber-300" /></button>
          <div />
          <button
            onTouchStart={(e)=>{ e.preventDefault(); handleTouch('DOWN'); }}
            onMouseDown={()=>handleTouch('DOWN')}
            className="bg-slate-900 border-2 border-amber-500/50 rounded-xl flex items-center justify-center active:bg-amber-500 active:text-black shadow-md"
            aria-label="Down"
          ><ArrowDown className="w-6 h-6 text-amber-300" /></button>
          <div />
        </div>
        <div className="text-[9px] text-center text-slate-500 mt-1 font-snes">Hold to walk • Fail→Learn</div>
      </div>

      {/* Action buttons */}
      <div className="pointer-events-auto flex flex-col gap-2">
        {onSecondary && (
          <button
            onTouchStart={(e)=>{ e.preventDefault(); onSecondary(); }}
            onMouseDown={onSecondary}
            className="w-14 h-14 bg-slate-900/90 border-2 border-emerald-500/50 rounded-full flex items-center justify-center shadow-xl active:scale-95 active:bg-emerald-500 active:text-black backdrop-blur-md"
            aria-label="Interact"
          ><Sparkles className="w-6 h-6 text-emerald-300" /></button>
        )}
        <button
          onTouchStart={(e)=>{ e.preventDefault(); onAction(); }}
          onMouseDown={onAction}
          className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 border-4 border-amber-200 rounded-full flex flex-col items-center justify-center shadow-2xl active:scale-95"
          aria-label="Sword Action"
        >
          <Swords className="w-7 h-7 text-black" />
          <span className="text-[10px] font-bold text-black mt-0.5">SWORD</span>
        </button>
      </div>
    </div>
  );
};
