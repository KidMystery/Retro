import React from 'react';
import { Badge, BADGES, badgeFanfare } from '../lib/curriculum/dopamineBadges';

/** Wiring 3: full-screen SNES badge fanfare for a newly-earned badge. */
export const BadgeFanfare: React.FC<{ badge: Badge; onDismiss: () => void }> = ({ badge, onDismiss }) => (
  <div
    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-pointer"
    onClick={onDismiss}
  >
    <div className="text-center px-6 animate-bounce">
      <div className="text-8xl mb-4 drop-shadow-[0_0_24px_rgba(245,158,11,0.9)]">{badge.icon}</div>
      <div className="font-mono text-amber-300 tracking-[0.3em] text-sm mb-2">♪ ♫ ♪</div>
      <h2 className="font-cinzel text-2xl font-bold text-amber-200 uppercase tracking-widest mb-3">
        {badge.label}
      </h2>
      <p className="font-mono text-xs text-slate-200 max-w-md mx-auto leading-relaxed">{badge.description}</p>
      <div className="font-mono text-[10px] text-slate-500 mt-5 animate-pulse">[ CLICK ANYWHERE TO CONTINUE ]</div>
    </div>
  </div>
);

/** Wiring 3: badge shelf for the pause/inventory modal — locked badges greyed out. */
export const BadgeShelf: React.FC<{ earnedIds: string[] }> = ({ earnedIds }) => (
  <div className="mt-4 border-t-2 border-amber-500/30 pt-3 px-4 pb-2 max-h-[26vh] overflow-y-auto">
    <div className="font-mono text-xs text-amber-300 tracking-widest mb-2">🏅 BADGE SHELF — {earnedIds.length}/{BADGES.length} EARNED</div>
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {BADGES.map(b => {
        const earned = earnedIds.includes(b.id);
        return (
          <div
            key={b.id}
            title={`${b.label} — ${b.description}`}
            className={`p-2 rounded text-center border-2 ${earned
              ? 'border-amber-400 bg-amber-400/10'
              : 'border-slate-700 bg-slate-900/60 opacity-50 grayscale'}`}
          >
            <div className="text-xl leading-none">{earned ? b.icon : '🔒'}</div>
            <div className={`font-mono text-[8px] mt-1 leading-tight ${earned ? 'text-amber-200' : 'text-slate-500'}`}>
              {b.label.toUpperCase()}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
