import React, { useState } from 'react';
import { DOSTheme, PlayerStats, GameView, TunicColor } from '../types';
import { sound, MYTHICAL_TRACKS, MythicalTrack } from '../lib/audioEngine';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  BookOpen, 
  BarChart3, 
  ShieldAlert, 
  Compass, 
  Save, 
  User, 
  Sparkles, 
  Heart, 
  ChevronDown,
  Sun,
  Backpack,
  Crown
} from 'lucide-react';

interface DOSHeaderProps {
  theme: DOSTheme;
  setTheme: (theme: DOSTheme) => void;
  player: PlayerStats;
  currentView: GameView;
  setView: (view: GameView) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isBgmOn: boolean;
  toggleBgm: () => void;
  onAdvanceDay: () => void;
  onOpenSaveModal?: () => void;
  onOpenCustomizeModal?: () => void;
}

const TUNIC_PREVIEWS: Record<TunicColor, string> = {
  green: '#2e7d32',
  blue: '#1d4ed8',
  red: '#b91c1c',
  purple: '#7e22ce',
  black: '#334155'
};

export const DOSHeader: React.FC<DOSHeaderProps> = ({
  theme,
  setTheme,
  player,
  currentView,
  setView,
  isMuted,
  setIsMuted,
  isBgmOn,
  toggleBgm,
  onAdvanceDay,
  onOpenSaveModal,
  onOpenCustomizeModal
}) => {
  const [activeTrack, setActiveTrack] = useState<MythicalTrack>('overworld');
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const [volume, setVolume] = useState(25);

  const handleNav = (targetView: GameView) => {
    sound.playKeyClick();
    setView(targetView);
  };

  const handleTrackChange = (track: MythicalTrack) => {
    setActiveTrack(track);
    setShowMusicMenu(false);
    sound.startMusic(track);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    sound.setVolume(newVol / 100);
  };

  const tunicColorHex = TUNIC_PREVIEWS[player.avatar?.tunicColor || 'green'];

  // Force SNES theme - no DOS
  React.useEffect(() => {
    if (theme !== 'snes') setTheme('snes');
  }, [theme, setTheme]);

  const pathColor = 
    player.currentPath === 'TRADER' ? 'text-red-300 border-red-400 bg-red-950/30' :
    player.currentPath === 'INVESTOR' ? 'text-green-300 border-green-400 bg-green-950/30' :
    player.currentPath === 'HYBRID' ? 'text-sky-300 border-sky-400 bg-sky-950/30' :
    'text-amber-200/60 border-amber-500/20';

  return (
    <header className="zelda-panel p-3 mb-3 select-none rounded-lg shadow-xl">
      {/* Top Bar: Hero + Oracle Bond + Audio */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-500/20 pb-2.5 mb-2.5">
        {/* Hero */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCustomizeModal}
            className="flex items-center gap-2 p-1.5 px-2.5 bg-slate-900/90 hover:bg-slate-800 border-2 border-amber-500/60 rounded-lg cursor-pointer group transition-all shadow-md"
          >
            <div className="w-8 h-8 rounded-md border-2 border-amber-400 relative overflow-hidden bg-slate-900 flex items-center justify-center shrink-0">
              <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: tunicColorHex }} />
              <div className="absolute top-0.5 w-3.5 h-1.5 bg-amber-200/90 rounded-xs" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-sm text-amber-200 font-bold group-hover:text-amber-100 tracking-wide">
                  {player.name}
                </span>
                <User className="w-3 h-3 text-amber-400 opacity-70" />
              </div>
              <div className="text-[11px] text-amber-200/60 truncate max-w-[160px] font-snes">
                {player.avatar?.avatarTitle || player.title} • Lv {player.oracleBondLevel || 1}
              </div>
            </div>
          </button>

          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 border rounded text-[11px] font-bold ${pathColor}`}>
            <Crown className="w-3.5 h-3.5" />
            <span>{player.currentPath}</span>
            <span className="opacity-60">T:{player.pathScores?.trader || 0} I:{player.pathScores?.investor || 0}</span>
          </div>

          {onOpenSaveModal && (
            <button
              onClick={onOpenSaveModal}
              className="snes-btn-primary px-3 py-1.5 text-xs flex items-center gap-1.5 rounded-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE</span>
            </button>
          )}
        </div>

        {/* Audio + Graham */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden md:flex items-center gap-1 text-[11px] text-sky-300 bg-slate-900/60 px-2 py-1 border border-sky-500/30 rounded">
            <BookOpen className="w-3 h-3" />
            <span>{player.grahamProtections?.length || 0} Graham Shields</span>
          </div>

          <button
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              sound.setMuted(nextMuted);
            }}
            className="snes-btn px-2.5 py-1 text-xs flex items-center gap-1"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{isMuted ? 'SFX OFF' : 'SFX ON'}</span>
          </button>

          <div className="relative">
            <div className="flex items-center border-2 border-amber-500/50 rounded-lg overflow-hidden bg-slate-900">
              <button
                onClick={toggleBgm}
                className={`flex items-center gap-1.5 px-2.5 py-1 cursor-pointer transition-colors text-xs font-bold ${
                  isBgmOn ? 'bg-amber-500 text-black' : 'text-amber-300 hover:bg-slate-800'
                }`}
              >
                <Music className={`w-3.5 h-3.5 ${isBgmOn ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">{isBgmOn ? 'BGM' : 'BGM OFF'}</span>
              </button>
              <button
                onClick={() => setShowMusicMenu(!showMusicMenu)}
                className="px-1.5 py-1 border-l border-amber-500/40 text-amber-300 hover:bg-slate-800 cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
            {showMusicMenu && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-slate-950 border-2 border-amber-500 rounded-lg p-2.5 shadow-2xl z-50">
                <div className="font-cinzel text-amber-400 border-b border-amber-500/30 pb-1 mb-2 flex justify-between text-xs">
                  <span>MYTHICAL OST • SNES</span>
                  <span className="text-[10px] text-slate-400">Warm Fantasy</span>
                </div>
                <div className="space-y-1 mb-2">
                  {MYTHICAL_TRACKS.map(track => (
                    <button
                      key={track.id}
                      onClick={() => handleTrackChange(track.id)}
                      className={`w-full text-left p-2 rounded-md transition-colors cursor-pointer flex flex-col ${
                        activeTrack === track.id
                          ? 'bg-amber-500/20 border border-amber-400 text-amber-200 font-bold'
                          : 'hover:bg-slate-900 text-slate-300 border border-transparent'
                      }`}
                    >
                      <span className="text-sm font-bold">{track.title}</span>
                      <span className="text-[11px] text-amber-200/60">{track.mood} • {track.composerLore.slice(0,60)}...</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-amber-500/30 pt-2 flex items-center justify-between gap-2 text-xs text-slate-300">
                  <span>Vol:</span>
                  <input type="range" min="0" max="100" value={volume} onChange={(e) => handleVolumeChange(Number(e.target.value))} className="w-28 accent-amber-500 cursor-pointer" />
                  <span>{volume}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation - Mobile-first large thumb buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <nav className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleNav('MAP')}
            className={`snes-btn px-3 py-2 text-xs md:text-sm flex items-center gap-1.5 rounded-md ${
              currentView === 'MAP' ? 'snes-btn-primary' : ''
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">OVERWORLD</span>
            <span className="sm:hidden">MAP</span>
          </button>

          <button
            onClick={() => handleNav('ORACLE_LEDGER')}
            className={`snes-btn px-3 py-2 text-xs md:text-sm flex items-center gap-1.5 rounded-md ${
              currentView === 'TRADE_DESK' || currentView === 'ORACLE_LEDGER' ? 'snes-btn-primary' : ''
            }`}
          >
            <div className="oracle-glyph w-5 h-5 border-amber-400">
              <div className="oracle-emerald-core w-2 h-2" />
            </div>
            <span className="hidden sm:inline">ORACLE LEDGER</span>
            <span className="sm:hidden">LEDGER</span>
          </button>

          <button
            onClick={() => handleNav('PORTFOLIO')}
            className={`snes-btn px-3 py-2 text-xs md:text-sm flex items-center gap-1.5 rounded-md ${
              currentView === 'PORTFOLIO' ? 'snes-btn-primary' : ''
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden sm:inline">PORTFOLIO</span>
            <span className="sm:hidden">BAG</span>
          </button>

          <button
            onClick={() => handleNav('INVENTORY')}
            className={`snes-btn px-3 py-2 text-xs md:text-sm flex items-center gap-1.5 rounded-md ${
              currentView === 'INVENTORY' ? 'snes-btn-primary' : ''
            }`}
          >
            <Backpack className="w-4 h-4" />
            <span className="hidden lg:inline">INVENTORY</span>
            <span className="lg:hidden">INV</span>
          </button>

          <button
            onClick={() => handleNav('GRIMOIRE')}
            className={`snes-btn px-3 py-2 text-xs md:text-sm flex items-center gap-1.5 rounded-md ${
              currentView === 'GRIMOIRE' ? 'snes-btn-primary' : ''
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden lg:inline">CODEX</span>
            <span className="lg:hidden">BOOK</span>
          </button>

          <button
            onClick={() => {
              sound.playCommandBeep();
              onAdvanceDay();
            }}
            className="px-3 py-2 bg-gradient-to-r from-sky-900/50 to-amber-900/30 hover:from-sky-800/60 hover:to-amber-800/40 border-2 border-sky-500/50 text-sky-200 font-bold rounded-md cursor-pointer flex items-center gap-1.5 shadow-md text-xs md:text-sm"
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>REST +1 DAY</span>
          </button>
        </nav>

        {/* Vital HUD - Hearts + Florins + Day - chunky readable */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-1.5 px-2.5 border-2 border-amber-500/30 rounded-lg shadow-inner">
          <div className="flex items-center gap-1" title="Life Force Hearts - sound trading restores">
            <div className={`flex items-center gap-0.5 ${player.hearts <= 1 ? 'animate-heart-pulse' : ''}`}>
              {Array.from({ length: player.maxHearts || 4 }).map((_, idx) => {
                const rem = player.hearts - idx;
                const isFull = rem >= 1;
                const isHalf = rem >= 0.4 && rem < 1;
                return (
                  <Heart
                    key={idx}
                    className={`w-4 h-4 md:w-5 md:h-5 ${
                      isFull ? 'fill-red-500 text-red-600 drop-shadow-[0_0_4px_rgba(239,68,68,0.7)]' :
                      isHalf ? 'fill-red-400 text-red-500 opacity-90' :
                      'fill-slate-800 text-slate-700 opacity-40'
                    }`}
                  />
                );
              })}
            </div>
            <span className="font-pixel text-[10px] md:text-xs text-red-400 font-bold ml-1">
              {player.hearts.toFixed(1)}/{player.maxHearts}
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-300 font-bold text-sm">
            <div className="w-3 h-4 bg-emerald-500 border border-emerald-300 rotate-45 scale-75 shadow-xs" />
            <span>{player.florins.toLocaleString()} ƒ</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-300 text-xs">
            <span className="text-amber-200/60">PORT:</span>
            <span className="font-bold text-slate-200">{Math.round(player.portfolioValue).toLocaleString()} ƒ</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-amber-200/60">DAY</span>
            <span className="font-cinzel text-xs text-sky-400 font-bold">#{player.day}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400">
            <span>Δ{player.netDelta.toFixed(1)}</span>
            <span className={player.netTheta >=0 ? 'text-green-400' : 'text-red-400'}>Θ{player.netTheta.toFixed(0)}</span>
            <span className={player.riskScore >60 ? 'text-red-400' : 'text-cyan-300'}>Risk {player.riskScore}</span>
          </div>
        </div>
      </div>

      {/* Lore subtitle */}
      <div className="mt-2 text-[11px] text-center text-amber-200/40 font-snes tracking-wide hidden md:block">
        "Zelda found a Bloomberg terminal" — Oracle's Stone • Daen Alterspire • Carved obsidian altar with floating amber runes and pulsing emerald core • Enchanted divination lens, not terminal
      </div>
    </header>
  );
};
