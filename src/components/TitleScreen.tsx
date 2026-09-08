import { useCallback, useEffect, useState } from 'react';
import titleBgUrl from '../assets/textures/title_background.jpg';
import titleNgPlusUrl from '../assets/textures/title_ngplus.jpg';
import { SaveSystem } from '../lib/saveSystem';

interface TitleScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  onAbout: () => void;
  /** NG+ is available (Seal Sigil earned): the title realm shows its corrupted variant. */
  ngPlus?: boolean;
}

/**
 * QUIET TITLE (game-feel rework): exactly ONE clear call to action —
 * CONTINUE when a save exists, otherwise START. Everything else is a small,
 * unobtrusive text row. No competing buttons, no clutter.
 */
export function TitleScreen({ onNewGame, onContinue, onAbout, ngPlus }: TitleScreenProps) {
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    const auto = SaveSystem.getAutoSave();
    const slots = SaveSystem.getAllSlots();
    setHasSave(!!auto || slots.some(Boolean));
  }, []);

  const primary = useCallback(() => (hasSave ? onContinue() : onNewGame()), [hasSave, onContinue, onNewGame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        primary();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [primary]);

  return (
    <div className="relative min-h-[75vh] w-full rounded-xl overflow-hidden shadow-2xl flex flex-col items-center justify-center select-none">
      <img
        src={ngPlus ? titleNgPlusUrl : titleBgUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75 pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 text-center mb-12 px-4">
        <div className="font-cinzel text-amber-200 text-3xl sm:text-5xl tracking-[0.18em] uppercase drop-shadow-[0_3px_0_rgba(0,0,0,0.8)]">
          Legend of Valuaria
        </div>
        <div className="mt-2 text-sm sm:text-lg tracking-[0.45em] uppercase text-emerald-300/90 font-snes oracle-rune-glow">
          Myth &amp; Margin
        </div>
      </div>

      {/* THE one call to action */}
      <div className="relative z-10 flex flex-col items-center gap-4 font-snes">
        <button
          onClick={primary}
          className="snes-btn-primary px-10 py-3.5 text-base tracking-[0.3em] uppercase rounded-xl shadow-[0_0_18px_rgba(251,191,36,0.35)] cursor-pointer"
        >
          {hasSave ? '▶ CONTINUE' : '▶ START'}
        </button>

        {/* Quiet secondary row — small, plain, out of the way */}
        <div className="flex items-center gap-4 text-[11px] tracking-widest text-slate-400/70">
          {hasSave && (
            <button onClick={onNewGame} className="hover:text-amber-200 cursor-pointer transition-colors uppercase">
              New Game
            </button>
          )}
          <button onClick={onAbout} className="hover:text-amber-200 cursor-pointer transition-colors uppercase">
            About
          </button>
        </div>
      </div>

      <div className="absolute bottom-3 inset-x-0 text-center text-[10px] text-slate-400/60 font-snes tracking-widest z-10">
        © ENCHANTED ORACLE CIRCLE • 16-BIT SNES RPG
      </div>
    </div>
  );
}
