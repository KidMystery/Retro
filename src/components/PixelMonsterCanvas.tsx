import React, { useEffect, useRef } from 'react';
import { EnemyStats } from '../types';

interface PixelMonsterCanvasProps {
  enemy: EnemyStats;
  theme: 'green' | 'amber' | 'vga' | 'cyber';
  isHit?: boolean;
}

export const PixelMonsterCanvas: React.FC<PixelMonsterCanvasProps> = ({
  enemy,
  theme,
  isHit = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 160;
    const height = 120;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#060a06';
    ctx.fillRect(0, 0, width, height);

    // Color palette based on theme
    const themeColors: { [key: string]: { primary: string; secondary: string; highlight: string; eye: string } } = {
      green: { primary: '#22aa22', secondary: '#115511', highlight: '#66ff66', eye: '#ff3333' },
      amber: { primary: '#cc8800', secondary: '#664400', highlight: '#ffcc33', eye: '#ff2222' },
      vga: { primary: '#5555ff', secondary: '#0000aa', highlight: '#ffff55', eye: '#ff5555' },
      cyber: { primary: '#00ffcc', secondary: '#005544', highlight: '#ffffff', eye: '#ff0055' }
    };

    const colors = themeColors[theme] || themeColors.green;

    if (isHit) {
      // Flash red/white on hit
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    const p = colors.primary;
    const s = colors.secondary;
    const h = colors.highlight;
    const e = colors.eye;

    // Draw pixel grid based on enemy archetype
    const drawPixel = (x: number, y: number, color: string, size = 4) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * size, y * size, size, size);
    };

    if (enemy.type === 'BEAR') {
      // Draw Grizzly Bear of Drawdowns
      // Ears
      for (let x = 12; x <= 15; x++) drawPixel(x, 5, p);
      for (let x = 24; x <= 27; x++) drawPixel(x, 5, p);
      // Head
      for (let y = 6; y <= 16; y++) {
        for (let x = 11; x <= 28; x++) {
          drawPixel(x, y, p);
        }
      }
      // Eyes
      drawPixel(15, 9, e);
      drawPixel(16, 9, e);
      drawPixel(23, 9, e);
      drawPixel(24, 9, e);
      // Snout
      for (let y = 12; y <= 15; y++) {
        for (let x = 17; x <= 22; x++) drawPixel(x, y, s);
      }
      drawPixel(19, 13, '#000');
      drawPixel(20, 13, '#000');
      // Fangs
      drawPixel(18, 16, h);
      drawPixel(21, 16, h);
      // Torso & Shoulders
      for (let y = 17; y <= 26; y++) {
        for (let x = 8; x <= 31; x++) drawPixel(x, y, s);
      }
      // Claws
      drawPixel(7, 24, h);
      drawPixel(7, 25, h);
      drawPixel(32, 24, h);
      drawPixel(32, 25, h);
      // Bearish Market Down-Arrow on chest
      drawPixel(19, 19, e);
      drawPixel(20, 19, e);
      drawPixel(19, 20, e);
      drawPixel(20, 20, e);
      drawPixel(18, 21, e);
      drawPixel(19, 21, e);
      drawPixel(20, 21, e);
      drawPixel(21, 21, e);
      drawPixel(17, 22, e);
      drawPixel(22, 22, e);
    } 
    else if (enemy.type === 'CRAB') {
      // Draw Crab Golem of Sideways Stagnation / Chrono Sphinx
      // Shell
      for (let y = 8; y <= 19; y++) {
        const span = 14 - Math.abs(y - 13);
        for (let x = 20 - span; x <= 20 + span; x++) {
          drawPixel(x, y, p);
        }
      }
      // Hourglass / Flatline channel symbol on shell
      for (let x = 14; x <= 26; x++) drawPixel(x, 11, h);
      for (let x = 14; x <= 26; x++) drawPixel(x, 16, h);
      drawPixel(18, 13, h);
      drawPixel(20, 13, h);
      drawPixel(22, 13, h);
      // Stalk Eyes
      drawPixel(16, 5, p);
      drawPixel(16, 6, e);
      drawPixel(24, 5, p);
      drawPixel(24, 6, e);
      // Giant Pincers
      // Left
      for (let y = 5; y <= 11; y++) {
        drawPixel(6, y, s);
        drawPixel(7, y, p);
      }
      drawPixel(5, 5, h);
      drawPixel(8, 5, h);
      // Right
      for (let y = 5; y <= 11; y++) {
        drawPixel(32, y, p);
        drawPixel(33, y, s);
      }
      drawPixel(31, 5, h);
      drawPixel(34, 5, h);
      // Legs
      for (let i = 0; i < 3; i++) {
        drawPixel(8 - i, 16 + i * 3, p);
        drawPixel(31 + i, 16 + i * 3, p);
      }
    } 
    else if (enemy.type === 'HYDRA') {
      // Multi-headed Volatility Hydra
      // Head 1 (Left)
      for (let y = 4; y <= 10; y++) {
        for (let x = 8; x <= 14; x++) drawPixel(x, y, p);
      }
      drawPixel(10, 6, e);
      drawPixel(7, 8, h); // fire/fang

      // Head 2 (Center)
      for (let y = 2; y <= 9; y++) {
        for (let x = 17; x <= 23; x++) drawPixel(x, y, p);
      }
      drawPixel(19, 4, e);
      drawPixel(21, 4, e);
      drawPixel(20, 8, h);

      // Head 3 (Right)
      for (let y = 4; y <= 10; y++) {
        for (let x = 26; x <= 32; x++) drawPixel(x, y, p);
      }
      drawPixel(30, 6, e);
      drawPixel(33, 8, h);

      // Necks leading to body
      for (let y = 10; y <= 18; y++) {
        drawPixel(12 + Math.floor((y - 10) / 2), y, s);
        drawPixel(20, y, s);
        drawPixel(28 - Math.floor((y - 10) / 2), y, s);
      }
      // Main Body
      for (let y = 18; y <= 27; y++) {
        for (let x = 11; x <= 29; x++) drawPixel(x, y, p);
      }
      // Volatility lightning spikes
      drawPixel(9, 19, h);
      drawPixel(8, 20, h);
      drawPixel(31, 19, h);
      drawPixel(32, 20, h);
    } 
    else {
      // The Liquidation Lord (Reaper)
      // Cowl / Hood
      for (let y = 3; y <= 14; y++) {
        const w = 6 + Math.min(y, 8);
        for (let x = 20 - w; x <= 20 + w; x++) {
          drawPixel(x, y, s);
        }
      }
      // Skull Face
      for (let y = 7; y <= 13; y++) {
        for (let x = 16; x <= 24; x++) {
          drawPixel(x, y, '#e0e0e0');
        }
      }
      // Glowing Hollow Eyes
      drawPixel(18, 9, e);
      drawPixel(22, 9, e);
      // Nasal cavity & Teeth
      drawPixel(20, 11, '#000');
      drawPixel(18, 13, '#000');
      drawPixel(20, 13, '#000');
      drawPixel(22, 13, '#000');

      // Flowing Robes
      for (let y = 15; y <= 27; y++) {
        for (let x = 11; x <= 29; x++) drawPixel(x, y, s);
      }
      // Great Scythe of Margin Liquidation
      // Staff
      for (let y = 2; y <= 28; y++) {
        drawPixel(32, y, '#888888');
      }
      // Curved Scythe Blade
      for (let x = 24; x <= 32; x++) drawPixel(x, 2, h);
      for (let x = 22; x <= 26; x++) drawPixel(x, 3, h);
      for (let x = 20; x <= 23; x++) drawPixel(x, 4, h);
      drawPixel(19, 5, h);
    }

    // Border line at bottom
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 1);
    ctx.lineTo(width, height - 1);
    ctx.stroke();

  }, [enemy, theme, isHit]);

  return (
    <div className="relative border-2 border-current p-1 bg-black inline-block shadow-lg">
      <canvas
        ref={canvasRef}
        className="w-48 h-36 md:w-56 md:h-42 image-rendering-pixelated block"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute top-1 left-2 text-[11px] tracking-widest opacity-80 uppercase font-mono">
        [TARGET: {enemy.name}]
      </div>
      <div className="absolute bottom-1 right-2 text-[10px] opacity-75 font-mono">
        TYPE: {enemy.type} | RISK-SCALE: x{enemy.riskSensitivity.toFixed(1)}
      </div>
    </div>
  );
};
