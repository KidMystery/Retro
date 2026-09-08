import React from 'react';

interface CompanionBubbleProps {
  line: string | null;
}

/** Wren — the Oracle's Ledger given voice. A speech bubble anchored to the
 *  overworld (bottom-left, above the TouchDPad on mobile via z-index layering). */
export const CompanionBubble: React.FC<CompanionBubbleProps> = ({ line }) => {
  if (!line) return null;
  return (
    <div className="fixed left-3 bottom-40 md:bottom-16 z-30 max-w-[300px] md:max-w-md pointer-events-none animate-[fadeIn_0.3s_ease-out]">
      <div className="zelda-panel-dark px-4 py-3 rounded-2xl rounded-bl-sm border-2 border-sky-400/70 bg-[#0d1526]/95 shadow-2xl">
        <div className="flex items-start gap-2">
          <div className="oracle-glyph w-8 h-8 shrink-0 mt-0.5" aria-hidden>
            <span className="text-sky-300 text-lg leading-none block text-center mt-1">◈</span>
          </div>
          <p className="text-sky-100 text-sm leading-snug font-snes">{line}</p>
        </div>
      </div>
    </div>
  );
};
