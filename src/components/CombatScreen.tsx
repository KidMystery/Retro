import React, { useState } from 'react';
import { EnemyStats, PlayerStats, CombatState, DOSTheme } from '../types';
import { PixelMonsterCanvas } from './PixelMonsterCanvas';
import { sound } from '../lib/audioEngine';
import { Shield, Zap, Heart, Clock, DollarSign, Activity, AlertTriangle, Play, HelpCircle } from 'lucide-react';

interface CombatScreenProps {
  combat: CombatState;
  player: PlayerStats;
  theme: DOSTheme;
  riskCategory: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  onAction: (action: 'STRIKE' | 'HEDGE_SHIELD' | 'STRADDLE_SHOCK' | 'THETA_SIPHON' | 'USE_ELIXIR' | 'USE_HOURGLASS') => void;
  onFlee: () => void;
  onOpenTrade: () => void;
}

export const CombatScreen: React.FC<CombatScreenProps> = ({
  combat,
  player,
  theme,
  riskCategory,
  riskScore,
  onAction,
  onFlee,
  onOpenTrade
}) => {
  const enemy = combat.enemy;
  const [isHit, setIsHit] = useState(false);

  if (!enemy) return null;

  const handlePlayerAction = (action: 'STRIKE' | 'HEDGE_SHIELD' | 'STRADDLE_SHOCK' | 'THETA_SIPHON' | 'USE_ELIXIR' | 'USE_HOURGLASS') => {
    setIsHit(true);
    setTimeout(() => setIsHit(false), 200);

    if (action === 'STRIKE') sound.playAttackSound();
    else if (action === 'HEDGE_SHIELD') sound.playSpellCast();
    else if (action === 'STRADDLE_SHOCK') sound.playSpellCast();
    else if (action === 'THETA_SIPHON') sound.playCoinSound();
    else sound.playCommandBeep();

    onAction(action);
  };

  const hpPercent = Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100));
  const playerHpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const playerManaPercent = Math.max(0, Math.min(100, (player.mana / player.maxMana) * 100));

  return (
    <div className="flex flex-col gap-4 font-mono text-xs sm:text-sm">
      {/* Risk Alert Banner */}
      {riskCategory === 'CRITICAL' && (
        <div className="p-2 border-2 border-red-500 bg-red-950/80 text-red-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="font-bold">
              CRITICAL MARGIN DANGER: High portfolio risk! {enemy.name} gains +50% rage damage!
            </span>
          </div>
          <button
            onClick={onOpenTrade}
            className="px-2 py-0.5 border border-red-300 bg-red-800 text-white font-bold cursor-pointer hover:bg-red-700"
          >
            HEDGE NOW
          </button>
        </div>
      )}

      {/* Battle Arena Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Enemy Viewport */}
        <div className="md:col-span-5 zelda-panel p-3 sm:p-4 bg-black/90 flex flex-col items-center">
          <div className="w-full flex justify-between items-center border-b border-current pb-1 mb-3">
            <div>
              <h3 className="font-bold text-sm sm:text-base uppercase tracking-wider text-red-400">
                {enemy.name}
              </h3>
              <p className="text-[11px] opacity-75">{enemy.title}</p>
            </div>
            <div className="text-right text-[11px]">
              <span className="opacity-75">TYPE:</span> <span className="font-bold">{enemy.type}</span>
            </div>
          </div>

          {/* Pixel Monster Canvas */}
          <PixelMonsterCanvas enemy={enemy} theme={theme} isHit={isHit} />

          {/* Enemy HP Meter */}
          <div className="w-full mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>ENEMY HP:</span>
              <span className="font-bold">{enemy.currentHp} / {enemy.maxHp}</span>
            </div>
            <div className="w-full h-3 border border-current bg-black p-0.5">
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Scaling stats breakdown */}
          <div className="w-full mt-3 p-2 border border-dashed border-current/50 text-[11px] bg-black/50 space-y-1">
            <div className="flex justify-between">
              <span className="opacity-75">Capital Scaling Bonus:</span>
              <span className="text-yellow-300 font-bold">
                +{Math.max(0, enemy.maxHp - enemy.baseHp)} HP (Net Worth Tier)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Risk Multiplier:</span>
              <span className={riskScore > 50 ? 'text-red-400 font-bold' : 'text-green-400'}>
                x{(1.0 + (riskScore / 100) * enemy.riskSensitivity).toFixed(2)} ATK ({riskCategory})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Special Technique:</span>
              <span className="text-purple-300">{enemy.specialMove}</span>
            </div>
          </div>
        </div>

        {/* Right: Player Status & Greek Attributes */}
        <div className="md:col-span-7 flex flex-col gap-3">
          {/* Player Vitality Bars */}
          <div className="zelda-panel p-3 bg-black/90">
            <div className="flex justify-between items-center border-b border-current pb-1 mb-2">
              <span className="font-bold text-yellow-300">{player.name} the Options Oracle</span>
              <span className="text-xs opacity-75">TURN #{combat.turn}</span>
            </div>

            {/* Health Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-0.5">
                <span className="flex items-center gap-1 font-bold">
                  <Heart className="w-3.5 h-3.5 text-red-400" /> LIFE (HP)
                </span>
                <span className="font-bold">{player.hp} / {player.maxHp}</span>
              </div>
              <div className="w-full h-3 border border-current bg-black p-0.5">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${playerHpPercent}%` }}
                />
              </div>
            </div>

            {/* Mana Bar */}
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="flex items-center gap-1 font-bold">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" /> DERIVATIVE MANA
                </span>
                <span className="font-bold">{player.mana} / {player.maxMana}</span>
              </div>
              <div className="w-full h-3 border border-current bg-black p-0.5">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${playerManaPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Real-time Greeks & Portfolio Risk Display */}
          <div className="zelda-panel p-3 bg-black/90">
            <div className="flex justify-between items-center border-b border-current pb-1 mb-2 text-xs">
              <span className="font-bold flex items-center gap-1 text-cyan-300">
                <Activity className="w-3.5 h-3.5" /> MYSTICAL PORTFOLIO GREEKS
              </span>
              <button
                onClick={onOpenTrade}
                className="text-[11px] underline hover:text-yellow-300 cursor-pointer"
              >
                [OPEN TRADE DESK]
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="border border-current/40 p-1 bg-black/40">
                <div className="opacity-75 text-[10px]">DELTA (Δ)</div>
                <div className="font-bold text-yellow-300">{player.netDelta.toFixed(2)}</div>
                <div className="text-[9px] opacity-60">Speed & Momentum</div>
              </div>
              <div className="border border-current/40 p-1 bg-black/40">
                <div className="opacity-75 text-[10px]">GAMMA (Γ)</div>
                <div className="font-bold text-purple-300">{player.netGamma.toFixed(3)}</div>
                <div className="text-[9px] opacity-60">Acceleration</div>
              </div>
              <div className="border border-current/40 p-1 bg-black/40">
                <div className="opacity-75 text-[10px]">THETA (Θ)</div>
                <div className={`font-bold ${player.netTheta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {player.netTheta >= 0 ? '+' : ''}{player.netTheta.toFixed(1)}ƒ/day
                </div>
                <div className="text-[9px] opacity-60">Daily Time Flow</div>
              </div>
              <div className="border border-current/40 p-1 bg-black/40">
                <div className="opacity-75 text-[10px]">VEGA (ν)</div>
                <div className="font-bold text-cyan-300">{player.netVega.toFixed(2)}</div>
                <div className="text-[9px] opacity-60">Volatility Storm</div>
              </div>
            </div>

            {/* Active Shield Ward state */}
            {combat.playerShieldActive && (
              <div className="mt-2 p-1 border border-cyan-400 bg-cyan-950/40 text-cyan-200 text-xs flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>[PROTECTIVE PUT WARD ACTIVE]: Incoming damage reduced by 60%!</span>
              </div>
            )}
          </div>

          {/* Combat Actions Deck */}
          <div className="zelda-panel p-3 bg-black/90">
            <div className="font-bold border-b border-current pb-1 mb-2 text-xs">
              COMBAT ACTIONS & OPTIONS SPELLCASTING
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handlePlayerAction('STRIKE')}
                className="px-2.5 py-1.5 border border-current hover:bg-current hover:text-black cursor-pointer text-left font-bold"
              >
                [1] Rune Strike (Physical/Delta)
              </button>

              <button
                onClick={() => handlePlayerAction('HEDGE_SHIELD')}
                disabled={player.mana < 15}
                className={`px-2.5 py-1.5 border border-current text-left font-bold ${
                  player.mana >= 15
                    ? 'hover:bg-cyan-400 hover:text-black cursor-pointer text-cyan-300'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                [2] Protective Put Ward (15 MP)
              </button>

              <button
                onClick={() => handlePlayerAction('STRADDLE_SHOCK')}
                disabled={player.mana < 25}
                className={`px-2.5 py-1.5 border border-current text-left font-bold ${
                  player.mana >= 25
                    ? 'hover:bg-purple-400 hover:text-black cursor-pointer text-purple-300'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                [3] Straddle Chaos Arc (25 MP)
              </button>

              <button
                onClick={() => handlePlayerAction('THETA_SIPHON')}
                disabled={player.mana < 10}
                className={`px-2.5 py-1.5 border border-current text-left font-bold ${
                  player.mana >= 10
                    ? 'hover:bg-green-400 hover:text-black cursor-pointer text-green-300'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                [4] Theta Siphon (Harvest Premium)
              </button>

              <button
                onClick={() => handlePlayerAction('USE_ELIXIR')}
                disabled={player.potions.healthElixir <= 0}
                className={`px-2.5 py-1.5 border border-current text-left font-bold ${
                  player.potions.healthElixir > 0
                    ? 'hover:bg-yellow-300 hover:text-black cursor-pointer text-yellow-300'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                [5] Health Elixir ({player.potions.healthElixir} left)
              </button>

              <button
                onClick={() => handlePlayerAction('USE_HOURGLASS')}
                disabled={player.potions.timeHourglass <= 0}
                className={`px-2.5 py-1.5 border border-current text-left font-bold ${
                  player.potions.timeHourglass > 0
                    ? 'hover:bg-amber-400 hover:text-black cursor-pointer text-amber-300'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                [6] Time Hourglass ({player.potions.timeHourglass} left)
              </button>
            </div>

            <div className="flex gap-2 mt-3 pt-2 border-t border-current/40">
              <button
                onClick={onOpenTrade}
                className="flex-1 py-1 border border-dashed border-current hover:bg-current hover:text-black cursor-pointer font-bold text-center"
              >
                [M] QUICK-TRADE HEDGE DESK
              </button>
              <button
                onClick={onFlee}
                className="px-3 py-1 border border-red-500 hover:bg-red-600 hover:text-white cursor-pointer font-bold text-red-400"
              >
                [ESC] STOP-LOSS FLEE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling DOS Combat Log */}
      <div className="zelda-panel p-3 bg-black/95">
        <div className="border-b border-current/50 pb-1 mb-1 text-xs font-bold opacity-80">
          COMBAT CONSOLE / TRANSACTION AUDIT LOG
        </div>
        <div className="max-h-36 overflow-y-auto space-y-1 text-xs p-1">
          {combat.combatLog.map((line, idx) => (
            <div
              key={idx}
              className={`leading-relaxed ${
                line.includes('TRIUMPH')
                  ? 'text-yellow-300 font-bold'
                  : line.includes('LIQUIDATION') || line.includes('ALERT')
                  ? 'text-red-400 font-bold'
                  : line.includes('Protective') || line.includes('Siphon')
                  ? 'text-cyan-300'
                  : 'opacity-90'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
