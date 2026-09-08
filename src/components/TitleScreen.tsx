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

type MenuOption = 'NEW GAME' | 'CONTINUE' | 'ABOUT';

/**
 * SNES-style title screen. Calm, arcade-authentic: logo, three options,
 * blinking ▶ selector. Keyboard (arrows + Enter) and mouse both work.
 */
export function TitleScreen({ onNewGame, onContinue, onAbout, ngPlus }: TitleScreenProps) {
  const [hasSave, setHasSave] = useState(false);
  const [selected, setSelected] = useState<MenuOption>('NEW GAME');

  useEffect(() => {
    const auto = SaveSystem.getAutoSave();
    const slots = SaveSystem.getAllSlots();
    setHasSave(!!auto || slots.some(Boolean));
  }, []);

  const options: MenuOption[] = hasSave ? ['NEW GAME', 'CONTINUE', 'ABOUT'] : ['NEW GAME', 'ABOUT'];

  const activate = useCallback(
    (opt: MenuOption) => {
      if (opt === 'NEW GAME') onNewGame();
      else if (opt === 'CONTINUE') onContinue();
      else onAbout();
    },
    [onNewGame, onContinue, onAbout],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const idx = options.indexOf(selected);
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const delta = e.key === 'ArrowUp' ? -1 : 1;
        setSelected(options[(idx + delta + options.length) % options.length]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(selected);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [options, selected, activate]);

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
      <div className="relative z-10 text-center mb-10 px-4">
        <div className="font-cinzel text-amber-200 text-3xl sm:text-5xl tracking-[0.18em] uppercase drop-shadow-[0_3px_0_rgba(0,0,0,0.8)]">
          Legend of Valuaria
        </div>
        <div className="mt-2 text-sm sm:text-lg tracking-[0.45em] uppercase text-emerald-300/90 font-snes oracle-rune-glow">
          Myth &amp; Margin
        </div>
        <div className="mt-1 text-[10px] tracking-[0.35em] uppercase text-amber-200/50 font-snes">
          Push Start
        </div>
      </div>

      {/* Menu */}
      <div className="relative z-10 flex flex-col items-center gap-2.5 font-snes">
        {options.map((opt) => (
          <button
            key={opt}
            onMouseEnter={() => setSelected(opt)}
            onClick={() => activate(opt)}
            className="group flex items-center gap-3 px-6 py-2 w-56 text-left"
          >
            <span
              className={`w-4 text-amber-400 text-lg leading-none ${
                selected === opt ? 'title-cursor-blink' : 'opacity-0'
              }`}
            >
              ▶
            </span>
            <span
              className={`tracking-[0.25em] uppercase text-base transition-colors ${
                selected === opt ? 'text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-slate-300/70'
              }`}
            >
              {opt}
            </span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-3 inset-x-0 text-center text-[10px] text-slate-400/60 font-snes tracking-widest z-10">
        © ENCHANTED ORACLE CIRCLE • 16-BIT SNES RPG
      </div>
    </div>
  );
}
