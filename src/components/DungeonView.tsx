import React, { useEffect, useRef } from 'react';
import { sound } from '../lib/audioEngine';

/**
 * DungeonView — first-person 3D dungeon crawler (raycaster, Doom/Duke-style).
 * The player stands INSIDE the dungeon and looks down torchlit corridors of
 * textured stone. This replaces the flat top-down grid with a genuine
 * perspective view and atmospheric depth.
 */

const MAP: string[] = [
  '#################',
  '#.........#.....#',
  '#..##.....#.###.#',
  '#..#......#...#.#',
  '#..#.####.#...#.#',
  '#....#......#...#',
  '#####.#######.#.#',
  '#.........#...#.#',
  '#.###.####.#...#.#',
  '#.....#......#..C#',
  '#####.#######.#.#',
  '#.........#.....#',
  '#.##..##..#.##.##',
  '#.##..##..#####.#',
  '#..........#.....#',
  '#################',
];

const COLORS = {
  stone1: '#2a2420',
  stone3: '#3a312a',
  floor1: '#241f1b',
  floor2: '#2a241f',
  ceiling1: '#15120f',
  ceiling2: '#0e0b09',
  torchGlow: 'rgba(255,160,60,0.16)',
};

interface DungeonViewProps {
  onInteract?: () => void;
}

export const DungeonView: React.FC<DungeonViewProps> = ({ onInteract }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const posRef = useRef({ x: 2.5, y: 4.5 });
  const dirRef = useRef(0);
  const keysRef = useRef<Record<string, boolean>>({});
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 420, H = 260;
    canvas.width = W; canvas.height = H;
    ctx.imageSmoothingEnabled = false;

    const MAPW = MAP[0].length, MAPH = MAP.length;
    const getTile = (mx: number, my: number) =>
      my < 0 || my >= MAPH || mx < 0 || mx >= MAPW ? '#' : MAP[my][mx];

    const render = () => {
      const pos = posRef.current, dir = dirRef.current, anim = animRef.current;
      const sx = Math.cos(dir), sy = Math.sin(dir);
      const plx = -sy, ply = sx;

      const cg = ctx.createLinearGradient(0, 0, 0, H / 2);
      cg.addColorStop(0, COLORS.ceiling1); cg.addColorStop(1, COLORS.ceiling2);
      ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H / 2);
      const fg = ctx.createLinearGradient(0, H / 2, 0, H);
      fg.addColorStop(0, COLORS.floor1); fg.addColorStop(1, COLORS.floor2);
      ctx.fillStyle = fg; ctx.fillRect(0, H / 2, W, H / 2);

      for (let col = 0; col < W; col++) {
        const camX = (2 * col) / W - 1;
        const rdx = sx + plx * camX, rdy = sy + ply * camX;
        let mapX = Math.floor(pos.x), mapY = Math.floor(pos.y);
        const ddx = Math.abs(1 / (rdx || 1e-9)), ddy = Math.abs(1 / (rdy || 1e-9));
        let stepX, stepY, sideX, sideY;
        if (rdx < 0) { stepX = -1; sideX = (pos.x - mapX) * ddx; } else { stepX = 1; sideX = (mapX + 1 - pos.x) * ddx; }
        if (rdy < 0) { stepY = -1; sideY = (pos.y - mapY) * ddy; } else { stepY = 1; sideY = (mapY + 1 - pos.y) * ddy; }
        let side = 0, done = false, guard = 0, tile = '#';
        while (!done && guard++ < 200) {
          if (sideX < sideY) { sideX += ddx; mapX += stepX; side = 0; }
          else { sideY += ddy; mapY += stepY; side = 1; }
          tile = getTile(mapX, mapY);
          if (tile !== '.') done = true;
        }
        const perp = side === 0 ? sideX - ddx : sideY - ddy;
        const lineH = Math.min(H * 3, H / (perp || 1e-9));
        const drawStart = Math.max(0, -lineH / 2 + H / 2);
        const drawEnd = Math.min(H, lineH / 2 + H / 2);

        // wall shade by depth + side
        const shade = Math.max(0.3, 1 - perp / 7);
        const base = tile === 'C' ? '#7a3b10' : (side === 1 ? COLORS.stone3 : '#2a2420');
        // vertical blend toward black for depth (atmospheric fog)
        const mix = Math.max(0, (perp - 2) / 5);
        ctx.fillStyle = blendColor(base, '#000000', mix * 0.5);
        ctx.fillRect(col, drawStart, 1, Math.max(1, drawEnd - drawStart));
        // stone block lines
        if (lineH > 50) {
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          const block = Math.round(lineH / 26);
          for (let b = 1; b <= block; b++) ctx.fillRect(col, drawStart + b * 26, 1, 1);
        }
      }

      // torch flicker glow
      const flicker = 0.9 + 0.1 * Math.sin(anim * 0.18);
      const glow = ctx.createRadialGradient(W/2, H*0.62, 20, W/2, H*0.62, H*0.95 * flicker);
      glow.addColorStop(0, COLORS.torchGlow); glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

      // foreground brazier (bottom-center) — the reference's presence cue
      ctx.fillStyle = 'rgba(0,0,0,0)';
      // black metal bowl
      ctx.fillStyle = '#1c1612';
      ctx.beginPath(); ctx.ellipse(W*0.5, H*0.92, 60, 16, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0d0a08';
      ctx.fillRect(W*0.5-60, H*0.92, 120, 14);
      // flame
      const fl = 0.7 + 0.3 * Math.sin(anim * 0.35);
      const fgx = W*0.5, fgy = H*0.90;
      const flame = ctx.createRadialGradient(fgx, fgy, 4, fgx, fgy, 26*fl);
      flame.addColorStop(0, '#ffd27a'); flame.addColorStop(0.4, '#f0a53a'); flame.addColorStop(1, 'rgba(232,120,10,0)');
      ctx.fillStyle = flame; ctx.beginPath(); ctx.moveTo(fgx, fgy-34*fl); ctx.quadraticCurveTo(fgx+20, fgy-4, fgx+12, fgy+2); ctx.quadraticCurveTo(fgx, fgy+8, fgx-12, fgy+2); ctx.quadraticCurveTo(fgx-20, fgy-4, fgx, fgy-34*fl); ctx.fill();
      // ember glow on floor
      const e = ctx.createRadialGradient(W*0.5, H*0.93, 10, W*0.5, H*0.93, 68);
      e.addColorStop(0, 'rgba(255,160,60,0.22)'); e.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = e; ctx.fillRect(0, H*0.82, W, H*0.18);

      // HUD: heart bar (top-left) + act label (top-right) — makes it a game
      ctx.fillStyle = 'rgba(5,3,2,0.55)';
      ctx.fillRect(8, 8, 86, 16);
      ctx.strokeStyle = '#e8a33a'; ctx.lineWidth = 1; ctx.strokeRect(8.5, 8.5, 86, 16);
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i < 3 ? '#c02a2a' : '#3a1414';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('♥', 15 + i * 16, 22);
      }
      ctx.fillStyle = '#e8a33a'; ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'right'; ctx.fillText('ACT I · THE SEALED VESTIBULE', W - 10, 20); ctx.textAlign = 'left';
    };

    const MOVE = 0.05, ROT = 0.05;
    const kd = (e: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyS','KeyA','KeyD'].includes(e.code)) e.preventDefault();
      keysRef.current[e.code] = true;
    };
    const ku = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);

    let raf = 0;
    const frame = () => {
      animRef.current = (animRef.current + 1) % 360;
      const k = keysRef.current, pos = posRef.current;
      const cs = Math.cos(dirRef.current), sn = Math.sin(dirRef.current);
      if (k['ArrowUp'] || k['KeyW']) { const nx=pos.x+cs*MOVE, ny=pos.y+sn*MOVE; if (getTile(Math.floor(nx),Math.floor(ny))==='.'){pos.x=nx;pos.y=ny;} }
      if (k['ArrowDown'] || k['KeyS']) { const nx=pos.x-cs*MOVE, ny=pos.y-sn*MOVE; if (getTile(Math.floor(nx),Math.floor(ny))==='.'){pos.x=nx;pos.y=ny;} }
      if (k['ArrowLeft'] || k['KeyA']) dirRef.current -= ROT;
      if (k['ArrowRight'] || k['KeyD']) dirRef.current += ROT;
      render();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-2xl" style={{ aspectRatio: '16/10' }}>
      <canvas ref={canvasRef} className="w-full h-full block" onClick={onInteract} />
      <div className="absolute bottom-2 left-2 bg-black/70 border border-amber-500/40 rounded px-2 py-0.5 text-[10px] text-amber-300 font-mono">
        DUNGEON // WASD / ARROWS MOVE
      </div>
    </div>
  );
};

export default DungeonView;

// helper: blend a hex color toward black by t (0..1)
function blendColor(hex: string, targetHex: string, t: number): string {
  const a = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const b = [1, 3, 5].map((i) => parseInt(targetHex.slice(i, i + 2), 16));
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}