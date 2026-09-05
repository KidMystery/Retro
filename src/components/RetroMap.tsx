import React, { useEffect } from 'react';
import { MapData } from '../lib/questData';
import { PlayerStats, AssetQuote } from '../types';
import { sound } from '../lib/audioEngine';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface RetroMapProps {
  mapData: MapData;
  player: PlayerStats;
  asset: AssetQuote;
  onMove: (newX: number, newY: number) => void;
  onTileInteract: (tileChar: string, x: number, y: number) => void;
  riskCategory: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export const RetroMap: React.FC<RetroMapProps> = ({
  mapData,
  player,
  asset,
  onMove,
  onTileInteract,
  riskCategory
}) => {
  const grid = mapData.grid;

  const handleStep = (dx: number, dy: number) => {
    const targetX = player.mapX + dx;
    const targetY = player.mapY + dy;

    if (targetY < 0 || targetY >= grid.length) return;
    if (targetX < 0 || targetX >= grid[targetY].length) return;

    const targetTile = grid[targetY][targetX];
    if (targetTile === '#') {
      sound.playAlarmSound(); // Bump into wall
      return;
    }

    sound.playKeyClick();
    onMove(targetX, targetY);

    if (targetTile !== '.' && targetTile !== ' ') {
      onTileInteract(targetTile, targetX, targetY);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        handleStep(0, -1);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        handleStep(0, 1);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        handleStep(-1, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        handleStep(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player.mapX, player.mapY, grid]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Main ASCII Dungeon Viewport */}
      <div className="flex-1 zelda-panel p-3 sm:p-4 bg-black/90">
        <div className="flex items-center justify-between border-b border-current pb-2 mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-wider uppercase">
              ACT {mapData.act}: {mapData.name}
            </h2>
            <p className="text-xs opacity-75">{mapData.theme}</p>
          </div>
          <div className="text-right text-xs">
            <span className="opacity-70">COORDINATES:</span>{' '}
            <span className="font-bold">[{player.mapX}, {player.mapY}]</span>
          </div>
        </div>

        {/* ASCII Grid Display */}
        <div className="flex justify-center my-2 p-2 bg-[#040804] border border-current select-none overflow-x-auto">
          <div className="font-mono text-base sm:text-xl leading-snug tracking-widest text-center">
            {grid.map((row, rIdx) => {
              return (
                <div key={rIdx} className="whitespace-pre">
                  {row.split('').map((char, cIdx) => {
                    const isPlayer = player.mapX === cIdx && player.mapY === rIdx;
                    if (isPlayer) {
                      return (
                        <span key={cIdx} className="text-yellow-300 font-extrabold bg-current/20 px-0.5 animate-pulse">
                          @
                        </span>
                      );
                    }
                    if (char === '#') {
                      return <span key={cIdx} className="opacity-40">▓</span>;
                    }
                    if (char === 'S') {
                      return <span key={cIdx} className="text-cyan-400 font-bold">S</span>;
                    }
                    if (char === 'M') {
                      return <span key={cIdx} className="text-amber-400 font-bold">M</span>;
                    }
                    if (char === 'E') {
                      return <span key={cIdx} className="text-purple-400 font-bold animate-pulse">?</span>;
                    }
                    if (char === 'C') {
                      return <span key={cIdx} className="text-yellow-400 font-bold">$</span>;
                    }
                    if (char === 'B') {
                      return <span key={cIdx} className="text-red-500 font-bold animate-pulse">Ω</span>;
                    }
                    return <span key={cIdx} className="opacity-30">·</span>;
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Movement Controls (D-Pad & Hotkeys) */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-current/40 text-xs">
          <span className="hidden sm:inline opacity-75">
            Use [WASD] or [ARROW KEYS] to traverse the realm.
          </span>

          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <button
              onClick={() => handleStep(-1, 0)}
              className="px-2 py-1 border border-current hover:bg-current hover:text-black cursor-pointer flex items-center gap-1 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> [W]EST
            </button>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleStep(0, -1)}
                className="px-2 py-0.5 border border-current hover:bg-current hover:text-black cursor-pointer flex items-center justify-center font-bold"
              >
                <ArrowUp className="w-3.5 h-3.5" /> [N]
              </button>
              <button
                onClick={() => handleStep(0, 1)}
                className="px-2 py-0.5 border border-current hover:bg-current hover:text-black cursor-pointer flex items-center justify-center font-bold"
              >
                <ArrowDown className="w-3.5 h-3.5" /> [S]
              </button>
            </div>
            <button
              onClick={() => handleStep(1, 0)}
              className="px-2 py-1 border border-current hover:bg-current hover:text-black cursor-pointer flex items-center gap-1 font-bold"
            >
              [E]AST <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Legend and Live Realm Quote Panel */}
      <div className="w-full lg:w-72 flex flex-col gap-3 font-mono text-xs">
        {/* Live Realm Quote */}
        <div className="zelda-panel p-3 bg-black/80">
          <div className="flex items-center justify-between border-b border-current/50 pb-1 mb-2">
            <span className="font-bold flex items-center gap-1 text-cyan-300">
              <TrendingUp className="w-3.5 h-3.5" /> REALM SPOT FEED
            </span>
            <span className="text-yellow-300 font-bold">{asset.symbol}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="opacity-75">Spot Price:</span>
              <span className="font-bold">{asset.spotPrice.toFixed(2)} Florins</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Implied Vol (IV):</span>
              <span className="font-bold text-purple-300">{(asset.iv * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Market Mood:</span>
              <span className="font-bold text-amber-300">{asset.trend}</span>
            </div>
          </div>
        </div>

        {/* Portfolio Threat / Risk Level Meter */}
        <div className={`zelda-panel p-3 ${riskCategory === 'CRITICAL' ? 'border-red-500 bg-red-950/40 text-red-300' : 'bg-black/80'}`}>
          <div className="flex items-center justify-between border-b border-current/50 pb-1 mb-2">
            <span className="font-bold flex items-center gap-1">
              {riskCategory === 'CRITICAL' ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              RISK TO COMBAT
            </span>
            <span className={`font-bold px-1 ${riskCategory === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' : 'bg-current text-black'}`}>
              {riskCategory}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-85">
            {riskCategory === 'CRITICAL' && '⚠️ High margin or naked exposure! Bosses gain devastating 2.5x rage attacks! Hedge now.'}
            {riskCategory === 'HIGH' && '⚠️ Noticeable leverage. Enemy attack power is amplified by your portfolio risk.'}
            {riskCategory === 'MODERATE' && 'Standard trading posture. Balanced delta and modest theta decay.'}
            {riskCategory === 'SAFE' && '🛡️ Defined-risk spreads or high cash reserves. Bosses deal 40% reduced damage!'}
          </p>
        </div>

        {/* Legend */}
        <div className="zelda-panel p-3 bg-black/80">
          <div className="font-bold border-b border-current/50 pb-1 mb-2">
            MAP RUNES & ICONS
          </div>
          <ul className="space-y-1.5 text-[11px]">
            <li className="flex items-center gap-2">
              <span className="text-yellow-300 font-bold">[@]</span>
              <span>Your Oracle Hero</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">[S]</span>
              <span>Ancient Shrine of Lessons</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">[M]</span>
              <span>Terminal Exchange (Trade Options)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-400 font-bold">[?]</span>
              <span>Mythical Story Encounter</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400 font-bold">[$]</span>
              <span>Treasury of Guild Florins</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-500 font-bold">[Ω]</span>
              <span>Realm Guardian / Boss Gate</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
