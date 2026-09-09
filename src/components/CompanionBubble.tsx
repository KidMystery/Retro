import React from 'react';
import wrenSpriteUrl from '../assets/sprites/wren.png';

interface CompanionBubbleProps {
  line: string | null;
}

/** Wren — the Oracle's Ledger given voice. A speech bubble anchored to the
 *  overworld (bottom-left, above the TouchDPad on mobile via z-index layering). */
export const CompanionBubble: React.FC<CompanionBubbleProps> = ({ line }) => {
  if (!line) return null;
  return (
    <div className="fixed left-3 bottom-3 z-30 max-w-[280px] md:max-w-sm pointer-events-none animate-[fadeIn_0.3s_ease-out]">
      <div className="zelda-panel-dark px-4 py-3 rounded-2xl rounded-bl-sm border-2 border-sky-400/70 bg-[#0d1526]/95 shadow-2xl">
        <div className="flex items-start gap-2">
          <img src={wrenSpriteUrl} alt="Wren, the luminous ledger spirit" className="w-8 h-8 shrink-0 -mt-0.5 rounded-md border border-sky-400/40 bg-black/50 object-contain" style={{ imageRendering: 'pixelated' }} aria-hidden />
          <p className="text-sky-100 text-sm leading-snug font-snes">{line}</p>
        </div>
      </div>
    </div>
  );
};
