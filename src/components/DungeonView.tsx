import React, { useEffect, useRef } from 'react';
import { sound } from '../lib/audioEngine';
import { PatrolRoute } from '../lib/zeldaWorldData';
import wallTexUrl from '../assets/textures/dungeon_wall.png';
import floorTexUrl from '../assets/textures/dungeon_floor.png';
import ceilTexUrl from '../assets/textures/dungeon_ceiling.png';
import sageSpriteUrl from '../assets/sprites/sage.png';
import brokerSpriteUrl from '../assets/sprites/broker.png';
import scammerSpriteUrl from '../assets/sprites/scammer.png';
import chestSpriteUrl from '../assets/sprites/chest.png';

/**
 * DungeonView — first-person 3D dungeon crawler (raycaster, Doom/Duke-style).
 * The player stands INSIDE the dungeon and looks down torchlit corridors of
 * textured stone. This replaces the flat top-down grid with a genuine
 * perspective view and atmospheric depth.
 */

const MAP: string[] = [
  // Validated dungeon: 19x17, uniform row width, BFS-verified fully connected
  // from spawn tile (2,4). Encounter nodes at (2,4) (9,5) (10,9) (4,11) all on
  // reachable floor. 'C' = decorative sealed relic-door (renders as bronze).
  '###################',
  '#.......C.#.......#',
  '#######.#.#.###.###',
  '#.....#.#.#...#...#',
  '#..####.#.#.#.#.#.#',
  '#.......#...#.#...#',
  '#.#.#.###.###.#.#.#',
  '#...#...#...#.#.#.#',
  '#..####.###.#.#.###',
  '#.....#.......#...#',
  '#####.####.######.#',
  '#.......#.......#.#',
  '#.#.###.#.#####.#.#',
  '#.#...#...#.....#.#',
  '#.###.#####.###.#.#',
  '#...#.............#',
  '###################',
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
  /** Encounter nodes placed in the dungeon world (map coords). Player walks up + presses E. */
  encounters?: Array<{ id: string; name: string; x: number; y: number; prompt: string }>;
  /** Fired when the player interacts (E / click) with an encounter within range. */
  onEncounter?: (encounterId: string) => void;
  /** Per-act maze override (defaults to the Act I vestibule). */
  map?: string[];
  /** Spawn tile (defaults to Act I spawn). */
  spawn?: { x: number; y: number };
  /** HUD label, e.g. 'ACT II · THE TWO CHAMBERS'. */
  actLabel?: string;
  /** Torch light radius in world units (default 9 = fully lit). */
  lightRadius?: number;
  /** Torch fuel drain/sec (0/undefined = no light mechanic). */
  torchDrainPerSec?: number;
  /** Patrolling scammer NPCs. */
  patrols?: PatrolRoute[];
  /** Fired when a patrol SEES the player (forced bad trade). */
  onPatrolCaught?: (patrolId: string) => void;
  /** Spread-gates ('G' tiles) open when both legs are placed. */
  gatesOpen?: boolean;
}

const ENCOUNTER_RANGE = 0.75;

// Encounter id prefix → real generated sprite (batch-1 art pass)
const spriteFor = (id: string): string | null => {
  if (id.startsWith('sage')) return sageSpriteUrl;
  if (id.startsWith('broker')) return brokerSpriteUrl;
  if (id.startsWith('scam')) return scammerSpriteUrl;
  if (id.startsWith('chest')) return chestSpriteUrl;
  return null;
};

export const DungeonView: React.FC<DungeonViewProps> = ({ onInteract, encounters = [], onEncounter, map, spawn, actLabel = 'ACT I · THE SEALED VESTIBULE', lightRadius = 9, torchDrainPerSec = 0, patrols = [], onPatrolCaught, gatesOpen = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const posRef = useRef({ x: (spawn?.x ?? 2) + 0.5, y: (spawn?.y ?? 4) + 0.5 });
  const dirRef = useRef(0);
  const keysRef = useRef<Record<string, boolean>>({});
  const animRef = useRef(0);
  const encRef = useRef(encounters);
  const onEncRef = useRef(onEncounter);
  const mapRef = useRef(map || MAP);
  const gatesRef = useRef(gatesOpen);
  const lightRef = useRef(lightRadius);
  const patrolCfgRef = useRef(patrols);
  const onCaughtRef = useRef(onPatrolCaught);
  const torchRef = useRef(1);
  const patrolStateRef = useRef(patrols.map(p => ({
    id: p.id,
    px: p.x + 0.5, py: p.y + 0.5,
    wi: 1, fx: 0, fy: 0,
    cooldown: 0,
  })));
  const caughtFlashRef = useRef(0);
  encRef.current = encounters;
  onEncRef.current = onEncounter;
  mapRef.current = map || MAP;
  gatesRef.current = gatesOpen;
  lightRef.current = lightRadius;
  patrolCfgRef.current = patrols;
  onCaughtRef.current = onPatrolCaught;
  const actLabelRef = useRef(actLabel);
  const torchDrainRef = useRef(torchDrainPerSec);
  actLabelRef.current = actLabel;
  torchDrainRef.current = torchDrainPerSec;
  const [nearEncounter, setNearEncounter] = React.useState<(typeof encounters)[number] | null>(null);
  const nearEncRef = useRef<(typeof encounters)[number] | null>(null);

  // Re-spawn + reset act resources when the act's dungeon changes
  useEffect(() => {
    posRef.current = { x: (spawn?.x ?? 2) + 0.5, y: (spawn?.y ?? 4) + 0.5 };
    dirRef.current = 0;
    torchRef.current = 1;
    patrolStateRef.current = (patrolCfgRef.current || []).map(p => ({
      id: p.id, px: p.x + 0.5, py: p.y + 0.5, wi: 1, fx: 0, fy: 0, cooldown: 0,
    }));
  }, [map, spawn?.x, spawn?.y]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = 420, H = 260;
    canvas.width = W; canvas.height = H;
    ctx.imageSmoothingEnabled = false;

    // ===== GENERATED TEXTURES (art batch 1) =====
    let wallTex: HTMLImageElement | null = null;
    let floorTexData: ImageData | null = null;
    let ceilTexData: ImageData | null = null;
    const spriteImgs: Record<string, HTMLImageElement> = {};
    const loadTex = (src: string, cb: (img: HTMLImageElement) => void) => {
      const img = new Image();
      img.onload = () => cb(img);
      img.src = src;
    };
    loadTex(wallTexUrl, (img) => { wallTex = img; });
    loadTex(ceilTexUrl, (img) => {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const cc = c.getContext('2d');
      if (cc) { cc.drawImage(img, 0, 0); ceilTexData = cc.getImageData(0, 0, 256, 256); }
    });
    loadTex(floorTexUrl, (img) => {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const cc = c.getContext('2d');
      if (cc) { cc.drawImage(img, 0, 0); floorTexData = cc.getImageData(0, 0, 256, 256); }
    });
    [sageSpriteUrl, brokerSpriteUrl, scammerSpriteUrl, chestSpriteUrl].forEach((u) => {
      loadTex(u, (img) => { spriteImgs[u] = img; });
    });

    // Low-res floor-casting buffer (chunky upscaled pixels = on-aesthetic)
    const FW = 210, FH = 65;
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = FW; floorCanvas.height = FH;
    const floorCtx = floorCanvas.getContext('2d');
    const floorBuf = floorCtx ? floorCtx.createImageData(FW, FH) : null;
    // Ceiling-casting buffer (art batch 2): mirrors the floor buffer above the horizon
    const ceilCanvas = document.createElement('canvas');
    ceilCanvas.width = FW; ceilCanvas.height = FH;
    const ceilCtx = ceilCanvas.getContext('2d');
    const ceilBuf = ceilCtx ? ceilCtx.createImageData(FW, FH) : null;

    const getTile = (mx: number, my: number) => {
      const arr = mapRef.current;
      if (my < 0 || my >= arr.length || mx < 0 || mx >= arr[0].length) return '#';
      const t = arr[my][mx];
      if (t === 'G') return gatesRef.current ? '.' : 'G';
      return t;
    };
    const walkable = (t: string) => t === '.' || t === 'o';

    const render = () => {
      const pos = posRef.current, dir = dirRef.current, anim = animRef.current;
      const sx = Math.cos(dir), sy = Math.sin(dir);
      const plx = -sy, ply = sx;

      const cg = ctx.createLinearGradient(0, 0, 0, H / 2);
      cg.addColorStop(0, COLORS.ceiling1); cg.addColorStop(1, COLORS.ceiling2);
      ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H / 2);
      // CEILING — perspective-correct textured ceiling casting (art batch 2)
      if (ceilCtx && ceilBuf && ceilTexData) {
        const d = ceilBuf.data, td = ceilTexData.data;
        const rdx0 = sx - plx, rdy0 = sy - ply;
        const rdx1 = sx + plx, rdy1 = sy + ply;
        for (let j = 0; j < FH; j++) {
          const p = (j + 0.5) * 2;             // screen px above horizon (mirrored)
          const rowDist = (H * 0.5) / p;       // camera height 0.5 world units
          let fx = pos.x + rowDist * rdx0;
          let fy = pos.y + rowDist * rdy0;
          const stx = rowDist * (rdx1 - rdx0) / FW;
          const sty = rowDist * (rdy1 - rdy0) / FW;
          const shade = Math.max(0.02, 1 - rowDist / Math.max(1.1, lightRef.current * (0.35 + 0.65 * torchRef.current))) * 0.7;
          const rowOff = j * FW * 4;
          for (let i = 0; i < FW; i++) {
            const tu = (((fx - Math.floor(fx)) * 256) | 0) & 255;
            const tv = (((fy - Math.floor(fy)) * 256) | 0) & 255;
            const toff = (tv * 256 + tu) * 4;
            const o = rowOff + i * 4;
            d[o] = td[toff] * shade;
            d[o + 1] = td[toff + 1] * shade;
            d[o + 2] = td[toff + 2] * shade;
            d[o + 3] = 255;
            fx += stx; fy += sty;
          }
        }
        ceilCtx.putImageData(ceilBuf, 0, 0);
        ctx.drawImage(ceilCanvas, 0, 0, FW, FH, 0, 0, W, H / 2);
      }
      // FLOOR — perspective-correct textured floor casting at half res
      if (floorCtx && floorBuf && floorTexData) {
        const d = floorBuf.data, td = floorTexData.data;
        const rdx0 = sx - plx, rdy0 = sy - ply;
        const rdx1 = sx + plx, rdy1 = sy + ply;
        for (let j = 0; j < FH; j++) {
          const p = (j + 0.5) * 2;             // screen px below horizon
          const rowDist = (H * 0.5) / p;       // camera height 0.5 world units
          let fx = pos.x + rowDist * rdx0;
          let fy = pos.y + rowDist * rdy0;
          const stx = rowDist * (rdx1 - rdx0) / FW;
          const sty = rowDist * (rdy1 - rdy0) / FW;
          const shade = Math.max(0.02, 1 - rowDist / Math.max(1.1, lightRef.current * (0.35 + 0.65 * torchRef.current)));
          const rowOff = j * FW * 4;
          for (let i = 0; i < FW; i++) {
            const tu = (((fx - Math.floor(fx)) * 256) | 0) & 255;
            const tv = (((fy - Math.floor(fy)) * 256) | 0) & 255;
            const toff = (tv * 256 + tu) * 4;
            const o = rowOff + i * 4;
            d[o] = td[toff] * shade;
            d[o + 1] = td[toff + 1] * shade;
            d[o + 2] = td[toff + 2] * shade;
            d[o + 3] = 255;
            fx += stx; fy += sty;
          }
        }
        floorCtx.putImageData(floorBuf, 0, 0);
        ctx.drawImage(floorCanvas, 0, 0, FW, FH, 0, H / 2, W, H / 2);
      } else {
        const fg = ctx.createLinearGradient(0, H / 2, 0, H);
        fg.addColorStop(0, COLORS.floor1); fg.addColorStop(1, COLORS.floor2);
        ctx.fillStyle = fg; ctx.fillRect(0, H / 2, W, H / 2);
      }

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
          if (tile !== '.' && tile !== 'o') done = true;
        }
        const perp = side === 0 ? sideX - ddx : sideY - ddy;
        const lineH = Math.min(H * 3, H / (perp || 1e-9));
        const drawStart = Math.max(0, -lineH / 2 + H / 2);
        const drawEnd = Math.min(H, lineH / 2 + H / 2);

        // wall shade by depth + side
        const isDoor = tile === 'C';
        const isGate = tile === 'G';
        const effR = Math.max(1.1, lightRef.current * (0.35 + 0.65 * torchRef.current));
        if (wallTex) {
          // textured wall slice: hit fraction along wall face → texture u
          let wallX = side === 0 ? pos.y + perp * rdy : pos.x + perp * rdx;
          wallX -= Math.floor(wallX);
          const texX = Math.min(255, Math.floor(wallX * 256));
          const fullStart = H / 2 - lineH / 2;
          const srcY = Math.max(0, (0 - fullStart) / lineH) * 256;
          const srcH = Math.max(1, ((drawEnd - drawStart) / lineH) * 256);
          ctx.drawImage(wallTex, texX, srcY, 1, srcH, col, drawStart, 1, Math.max(1, drawEnd - drawStart));
          // depth fog + side darkening (+ bronze tint for sealed relic doors, violet for spread gates)
          if (isDoor) { ctx.fillStyle = 'rgba(122,59,16,0.5)'; ctx.fillRect(col, drawStart, 1, Math.max(1, drawEnd - drawStart)); }
          if (isGate) { ctx.fillStyle = 'rgba(120,60,200,0.55)'; ctx.fillRect(col, drawStart, 1, Math.max(1, drawEnd - drawStart)); }
          if (side === 1) { ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fillRect(col, drawStart, 1, Math.max(1, drawEnd - drawStart)); }
          const fogMix = Math.min(0.96, Math.max(0, ((perp - effR * 0.25) / (effR * 0.85)) * 0.9));
          if (fogMix > 0) { ctx.fillStyle = `rgba(0,0,0,${fogMix.toFixed(3)})`; ctx.fillRect(col, drawStart, 1, Math.max(1, drawEnd - drawStart)); }
        } else {
          const base = isGate ? '#5a2a8a' : isDoor ? '#7a3b10' : (side === 1 ? COLORS.stone3 : '#2a2420');
          const fogMix = Math.min(0.96, Math.max(0, ((perp - effR * 0.25) / (effR * 0.85)) * 0.9));
          ctx.fillStyle = blendColor(base, '#000000', fogMix);
          ctx.fillRect(col, drawStart, 1, Math.max(1, drawEnd - drawStart));
          if (lineH > 50) {
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            const block = Math.round(lineH / 26);
            for (let b = 1; b <= block; b++) ctx.fillRect(col, drawStart + b * 26, 1, 1);
          }
        }
      }

      // torch flicker glow
      const flicker = 0.9 + 0.1 * Math.sin(anim * 0.18);
      const glow = ctx.createRadialGradient(W/2, H*0.62, 20, W/2, H*0.62, H*0.95 * flicker);
      glow.addColorStop(0, COLORS.torchGlow); glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

      // ENCOUNTER NODES — billboarded pulsing embers projected via player pos+dir
      const encs = encRef.current;
      const invDet = 1 / (plx * sy - sx * ply);
      for (const enc of encs) {
        const dx = enc.x - pos.x, dy = enc.y - pos.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 12) continue;
        const tx = invDet * (sy * dx - sx * dy);   // camera-space x
        const ty = invDet * (-ply * dx + plx * dy); // depth
        if (ty <= 0.15) continue; // behind player
        const screenX = Math.round((W / 2) * (1 + tx / ty));
        const size = Math.max(3, Math.round(Math.min(H * 3, H / ty) * 0.12));
        const bob = Math.sin(anim * 0.12 + enc.x * 3 + enc.y) * size * 0.35;
        const sy2 = H / 2 + bob;
        const pulse = 0.65 + 0.35 * Math.sin(anim * 0.22 + dist);
        // occlusion: skip if a wall blocks the line of sight
        let occluded = false;
        for (let t = 0.15; t < dist - 0.05; t += 0.1) {
          if (getTile(Math.floor(pos.x + dx / dist * t), Math.floor(pos.y + dy / dist * t)) !== '.') { occluded = true; break; }
        }
        if (occluded) continue;
        // glow halo
        const halo = ctx.createRadialGradient(screenX, sy2, 1, screenX, sy2, size * 3.2);
        halo.addColorStop(0, `rgba(120,230,160,${0.5 * pulse})`);
        halo.addColorStop(1, 'rgba(120,230,160,0)');
        ctx.fillStyle = halo;
        ctx.fillRect(screenX - size * 3.2, sy2 - size * 3.2, size * 6.4, size * 6.4);
        // real generated sprite billboard (batch-1 art pass), grounded on floor plane
        const sprUrl = spriteFor(enc.id);
        const spr = sprUrl ? spriteImgs[sprUrl] : null;
        if (spr) {
          const sh = Math.min(H * 1.4, (H / ty) * 0.6);
          const floorScreenY = H / 2 + (H * 0.5) / ty;
          ctx.drawImage(spr, screenX - sh / 2, floorScreenY - sh + bob * 0.5, sh, sh);
        } else {
          // fallback glyph diamond
          ctx.fillStyle = pulse > 0.8 ? '#a8ffcf' : '#4ade80';
          ctx.beginPath();
          ctx.moveTo(screenX, sy2 - size);
          ctx.lineTo(screenX + size * 0.7, sy2);
          ctx.lineTo(screenX, sy2 + size);
          ctx.lineTo(screenX - size * 0.7, sy2);
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = 'rgba(20,60,35,0.8)'; ctx.stroke();
        }
      }

      // BRAZIERS ('o' tiles) — standing near one refuels the torch (Act IV light verb)
      const arr = mapRef.current;
      for (let by = 0; by < arr.length; by++) {
        const row = arr[by];
        for (let bx = 0; bx < row.length; bx++) {
          if (row[bx] !== 'o') continue;
          const dx = bx + 0.5 - pos.x, dy = by + 0.5 - pos.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 9) continue;
          const tx = invDet * (sy * dx - sx * dy);
          const ty = invDet * (-ply * dx + plx * dy);
          if (ty <= 0.15) continue;
          const screenX = Math.round((W / 2) * (1 + tx / ty));
          const size = Math.max(2, Math.round(Math.min(H * 3, H / ty) * 0.07));
          const fl = 0.7 + 0.3 * Math.sin(anim * 0.3 + bx + by);
          const fg2 = ctx.createRadialGradient(screenX, H / 2, 1, screenX, H / 2, size * 4 * fl);
          fg2.addColorStop(0, 'rgba(255,200,110,0.85)');
          fg2.addColorStop(0.4, 'rgba(240,150,50,0.5)');
          fg2.addColorStop(1, 'rgba(232,120,10,0)');
          ctx.fillStyle = fg2;
          ctx.fillRect(screenX - size * 4, H / 2 - size * 4, size * 8, size * 8);
        }
      }

      // PATROLLING SCAMMERS — moving billboards with red halos (Act III avoidance verb)
      for (const st of patrolStateRef.current) {
        const dx = st.px - pos.x, dy = st.py - pos.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 12) continue;
        const tx = invDet * (sy * dx - sx * dy);
        const ty = invDet * (-ply * dx + plx * dy);
        if (ty <= 0.15) continue;
        const screenX = Math.round((W / 2) * (1 + tx / ty));
        const size = Math.max(3, Math.round(Math.min(H * 3, H / ty) * 0.12));
        const bob = Math.sin(anim * 0.18 + st.px * 2) * size * 0.3;
        const sy2 = H / 2 + bob;
        const pulse = 0.6 + 0.4 * Math.sin(anim * 0.25 + dist);
        let occluded = false;
        for (let t = 0.15; t < dist - 0.05; t += 0.1) {
          if (getTile(Math.floor(pos.x + dx / dist * t), Math.floor(pos.y + dy / dist * t)) === '#') { occluded = true; break; }
        }
        if (occluded) continue;
        const halo = ctx.createRadialGradient(screenX, sy2, 1, screenX, sy2, size * 3.2);
        halo.addColorStop(0, `rgba(255,90,80,${0.55 * pulse})`);
        halo.addColorStop(1, 'rgba(255,90,80,0)');
        ctx.fillStyle = halo;
        ctx.fillRect(screenX - size * 3.2, sy2 - size * 3.2, size * 6.4, size * 6.4);
        const spr = spriteImgs[scammerSpriteUrl];
        if (spr) {
          const sh = Math.min(H * 1.4, (H / ty) * 0.6);
          const floorScreenY = H / 2 + (H * 0.5) / ty;
          ctx.drawImage(spr, screenX - sh / 2, floorScreenY - sh + bob * 0.5, sh, sh);
        } else {
          ctx.fillStyle = '#ff6b5e';
          ctx.beginPath();
          ctx.moveTo(screenX, sy2 - size);
          ctx.lineTo(screenX + size * 0.7, sy2);
          ctx.lineTo(screenX, sy2 + size);
          ctx.lineTo(screenX - size * 0.7, sy2);
          ctx.closePath(); ctx.fill();
        }
      }

      // caught flash — red vignette pulse when a patrol SEES you
      if (caughtFlashRef.current > 0) {
        caughtFlashRef.current -= 1;
        const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.8);
        vg.addColorStop(0, 'rgba(200,20,20,0)');
        vg.addColorStop(1, `rgba(200,20,20,${(caughtFlashRef.current / 45) * 0.55})`);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);
      }

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
      ctx.textAlign = 'right'; ctx.fillText(actLabelRef.current, W - 10, 20); ctx.textAlign = 'left';
      // torch fuel bar (light-resource acts)
      if (torchDrainRef.current > 0) {
        const t = torchRef.current;
        ctx.fillStyle = 'rgba(5,3,2,0.55)';
        ctx.fillRect(8, 28, 86, 10);
        ctx.strokeStyle = '#e8a33a'; ctx.strokeRect(8.5, 28.5, 86, 10);
        ctx.fillStyle = t > 0.35 ? '#f0a53a' : '#c02a2a';
        ctx.fillRect(10, 30, Math.max(1, 82 * t), 6);
        ctx.fillStyle = '#e8a33a'; ctx.font = 'bold 7px monospace';
        ctx.fillText('TORCH', 100, 36);
        if (t < 0.25) { ctx.fillStyle = '#ff8080'; ctx.fillText('FIND A BRAZIER!', 140, 36); }
      }
    };

    const MOVE = 0.05, ROT = 0.05;
    // Opt-in test hook: /?debug exposes player pose so automated playtests can
    // verify real movement and reach every encounter deterministically.
    if (new URLSearchParams(window.location.search).has('debug')) {
      (window as any).__dungeon = {
        get pos() { return { ...posRef.current }; },
        get dir() { return dirRef.current; },
        set pos(v: { x: number; y: number }) { posRef.current = { ...v }; },
        set dir(v: number) { dirRef.current = v; },
        get torch() { return torchRef.current; },
        set torch(v: number) { torchRef.current = v; },
        get patrols() { return patrolStateRef.current.map(p => ({ id: p.id, x: p.px, y: p.py })); },
        get walkableAt() { return (x: number, y: number) => walkable(getTile(Math.floor(x), Math.floor(y))); },
      };
    }
    const findNear = () => {
      const p = posRef.current;
      let best: { e: typeof encRef.current[number]; d: number } | null = null;
      for (const enc of encRef.current) {
        const d = Math.hypot(enc.x - p.x, enc.y - p.y);
        if (d <= ENCOUNTER_RANGE && (!best || d < best.d)) best = { e: enc, d };
      }
      return best ? best.e : null;
    };
    const kd = (e: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyS','KeyA','KeyD'].includes(e.code)) e.preventDefault();
      keysRef.current[e.code] = true;
      if (e.code === 'KeyE' && !e.repeat) {
        const near = findNear();
        if (near) onEncRef.current?.(near.id);
      }
    };
    const ku = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);

    let raf = 0;
    let lastT = performance.now();
    const frame = () => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - lastT) / 1000);
      lastT = now;
      animRef.current = (animRef.current + 1) % 360;
      const k = keysRef.current, pos = posRef.current;
      const cs = Math.cos(dirRef.current), sn = Math.sin(dirRef.current);
      if (k['ArrowUp'] || k['KeyW']) { const nx=pos.x+cs*MOVE, ny=pos.y+sn*MOVE; if (walkable(getTile(Math.floor(nx),Math.floor(ny)))){pos.x=nx;pos.y=ny;} }
      if (k['ArrowDown'] || k['KeyS']) { const nx=pos.x-cs*MOVE, ny=pos.y-sn*MOVE; if (walkable(getTile(Math.floor(nx),Math.floor(ny)))){pos.x=nx;pos.y=ny;} }
      if (k['ArrowLeft'] || k['KeyA']) dirRef.current -= ROT;
      if (k['ArrowRight'] || k['KeyD']) dirRef.current += ROT;

      // ACT VERB: torch light resource — fuel drains; braziers ('o' tiles) refuel
      if (torchDrainRef.current > 0) {
        const p = posRef.current;
        let nearBrazier = false;
        for (let by = Math.floor(p.y) - 2; by <= Math.floor(p.y) + 2; by++) {
          for (let bx = Math.floor(p.x) - 2; bx <= Math.floor(p.x) + 2; bx++) {
            if (getTile(bx, by) === 'o' && Math.hypot(bx + 0.5 - p.x, by + 0.5 - p.y) < 1.4) nearBrazier = true;
          }
        }
        torchRef.current = Math.max(0, Math.min(1, torchRef.current + (nearBrazier ? 0.45 : -torchDrainRef.current) * dt));
      }

      // ACT VERB: patrol avoidance — move scammers along routes; being SEEN (in
      // front of their facing + close + line of sight) forces a bad trade.
      // Approaching from BEHIND is safe (no eye contact).
      for (let i = 0; i < patrolStateRef.current.length; i++) {
        const cfg = patrolCfgRef.current[i];
        const st = patrolStateRef.current[i];
        if (!cfg) continue;
        const wp = cfg.waypoints[st.wi] || cfg.waypoints[0];
        const tx = wp.x + 0.5, ty = wp.y + 0.5;
        const ddx = tx - st.px, ddy = ty - st.py;
        const dd = Math.hypot(ddx, ddy);
        if (dd < 0.12) {
          st.wi = (st.wi + 1) % cfg.waypoints.length;
          st.fx = 0; st.fy = 0;
        } else {
          st.fx = ddx / dd; st.fy = ddy / dd;
          const step = Math.min(dd, cfg.speed * dt);
          st.px += st.fx * step; st.py += st.fy * step;
        }
        st.cooldown = Math.max(0, st.cooldown - dt);
        const p = posRef.current;
        const dist = Math.hypot(st.px - p.x, st.py - p.y);
        if (dist < 2.3 && st.cooldown <= 0) {
          // facing dot toPlayer: >0.35 means player is clearly IN FRONT of the patrol
          const toPX = (p.x - st.px) / (dist || 1e-9), toPY = (p.y - st.py) / (dist || 1e-9);
          const facingDot = st.fx * toPX + st.fy * toPY;
          let los = true;
          for (let t = 0.2; t < dist - 0.1; t += 0.15) {
            if (getTile(Math.floor(st.px + toPX * t), Math.floor(st.py + toPY * t)) === '#') { los = false; break; }
          }
          if (facingDot > 0.35 && los) {
            st.cooldown = 4;
            caughtFlashRef.current = 45;
            sound.playAlarmSound();
            onCaughtRef.current?.(st.id);
          }
        }
      }

      render();
      // proximity prompt (only re-render React state on change)
      const near = findNear();
      if (near !== nearEncRef.current) {
        nearEncRef.current = near;
        setNearEncounter(near);
      }
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
      <canvas ref={canvasRef} className="w-full h-full block" onClick={() => {
        if (nearEncRef.current) onEncRef.current?.(nearEncRef.current.id);
        else onInteract?.();
      }} />
      {nearEncounter && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 bg-black/85 border-2 border-emerald-400/70 rounded px-3 py-1.5 text-xs text-emerald-300 font-mono animate-pulse shadow-lg whitespace-nowrap">
          [E] {nearEncounter.prompt}
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black/70 border border-amber-500/40 rounded px-2 py-0.5 text-[10px] text-amber-300 font-mono">
        DUNGEON // WASD / ARROWS MOVE {nearEncounter ? '• [E] INTERACT' : ''}{torchDrainPerSec > 0 ? ' • 🔥 TORCH BURNING' : ''}{patrols.length > 0 ? ' • ⚠ SCAMMERS PATROL — DON\'T GET SEEN' : ''}
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