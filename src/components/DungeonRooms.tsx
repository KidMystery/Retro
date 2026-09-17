import React, { useEffect, useRef } from 'react';
import { PatrolRoute } from '../lib/zeldaWorldData';
import sageSpriteUrl from '../assets/sprites/sage.png';
import brokerSpriteUrl from '../assets/sprites/broker.png';
import scammerSpriteUrl from '../assets/sprites/scammer.png';
import chestSpriteUrl from '../assets/sprites/chest.png';
import bossSphinxUrl from '../assets/sprites/boss_chrono_sphinx.png';
import bossHydraUrl from '../assets/sprites/boss_iv_hydra.png';
import bossWraithUrl from '../assets/sprites/boss_margin_wraith.png';
import bossReaperUrl from '../assets/sprites/boss_assignment_reaper.png';

/**
 * ⚡ VOLTRON M1 (9/16) — DUNGEON ROOMS: top-down ALttP-faithful dungeon renderer.
 * Replaces the raycaster for mapped acts (App flags by chapter). Same tile-grid data,
 * same coordinate space, same encounters/stairs/boss/braziers — so the curriculum,
 * the App stairs-poll, and the e2e harness contract (__dungeon.pos/walkableAt) are
 * untouched. Grid-step motion (tap = step, hold = walk), discrete top-down view,
 * raised-wall blocks, torch glow, per-floor light temperature (council pass preserved).
 */

const TS = 32;
const VIEW_W = 19 * TS;
const VIEW_H = 13 * TS;
const ENCOUNTER_RANGE = 0.75;
const BOSS_RANGE = 1.05;

const COLORS = {
  wallFace: '#171320',
  wallTop: '#2b2437',
  wallEdge: '#3d3450',
  floor1: '#221d2b',
  floor2: '#262030',
  floorGrout: '#1a1622',
};

const SPRITE_URLS: Record<string, string> = {
  sage: sageSpriteUrl,
  broker: brokerSpriteUrl,
  scam: scammerSpriteUrl,
  chest: chestSpriteUrl,
  boss_sphinx: bossSphinxUrl,
  boss_crab: bossSphinxUrl,
  boss_hydra: bossHydraUrl,
  boss_wraith: bossWraithUrl,
  boss_reaper: bossReaperUrl,
  boss_liquidation: bossReaperUrl,
  boss_bear: bossHydraUrl,
};
const spriteFor = (id: string): string | null => {
  for (const k of Object.keys(SPRITE_URLS)) if (id.startsWith(k)) return SPRITE_URLS[k];
  return null;
};

const TINTS: Record<string, { glow: string }> = {
  warm:  { glow: 'rgba(255,176,84,0.10)' },
  cool:  { glow: 'rgba(120,170,255,0.08)' },
  vault: { glow: 'rgba(190,140,220,0.07)' },
};

export interface DungeonRoomsProps {
  map: string[];
  spawn?: { x: number; y: number };
  actLabel?: string;
  encounters?: Array<{ id: string; name: string; x: number; y: number; prompt: string }>;
  onEncounter?: (id: string) => void;
  onExit?: () => void;
  suppressExit?: boolean;
  gatesOpen?: boolean;
  patrols?: PatrolRoute[];
  onPatrolCaught?: (patrolId: string) => void;
  torchDrainPerSec?: number;
  floorTint?: 'warm' | 'cool' | 'vault';
  /** Raycaster-compat: accepted and ignored (no perspective light in top-down rooms). */
  lightRadius?: number;
  /** Raycaster-compat: accepted and ignored. */
  onInteract?: () => void;
}

export const DungeonRooms: React.FC<DungeonRoomsProps> = ({
  map, spawn, actLabel = 'DUNGEON', encounters = [], onEncounter,
  onExit, suppressExit = false, gatesOpen = false, patrols = [], onPatrolCaught,
  torchDrainPerSec = 0, floorTint,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapRef = useRef<string[]>(map);
  const gatesRef = useRef(gatesOpen);
  const encRef = useRef(encounters);
  const onEncRef = useRef(onEncounter);
  const onExitRef = useRef(onExit);
  const suppressRef = useRef(suppressExit);
  const torchRef = useRef(1);
  const torchDrainRef = useRef(torchDrainPerSec);
  const posRef = useRef({ x: (spawn?.x ?? 2) + 0.5, y: (spawn?.y ?? 4) + 0.5 });
  const heldDirsRef = useRef<Set<string>>(new Set());
  const stepOnceRef = useRef<null | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>(null);
  const animRef = useRef(0);
  const heldTimerRef = useRef(0);
  const lastFacingRef = useRef<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('DOWN');
  const rafRef = useRef(0);
  const nearbyIdRef = useRef<string | null>(null);
  const spriteImgsRef = useRef<Record<string, HTMLImageElement>>({});
  const patrolStateRef = useRef<Array<{ id: string; px: number; py: number; wi: number; cooldown: number; cfg: PatrolRoute }>>([]);
  const onPatrolCaughtRef = useRef(onPatrolCaught);

  useEffect(() => { mapRef.current = map; }, [map]);
  useEffect(() => { gatesRef.current = gatesOpen; }, [gatesOpen]);
  useEffect(() => { encRef.current = encounters; }, [encounters]);
  useEffect(() => { onEncRef.current = onEncounter; }, [onEncounter]);
  useEffect(() => { onExitRef.current = onExit; }, [onExit]);
  useEffect(() => { suppressRef.current = suppressExit; }, [suppressExit]);
  useEffect(() => { torchDrainRef.current = torchDrainPerSec; }, [torchDrainPerSec]);
  useEffect(() => { onPatrolCaughtRef.current = onPatrolCaught; }, [onPatrolCaught]);

  // spawn sync (floor switches re-key the spawn prop)
  const spawnKey = `${spawn?.x ?? 2},${spawn?.y ?? 4}`;
  const lastSpawnKeyRef = useRef(spawnKey);
  useEffect(() => {
    if (spawnKey !== lastSpawnKeyRef.current) {
      lastSpawnKeyRef.current = spawnKey;
      posRef.current = { x: (spawn?.x ?? 2) + 0.5, y: (spawn?.y ?? 4) + 0.5 };
    }
  }, [spawnKey]);

  const getTile = (mx: number, my: number): string => {
    const arr = mapRef.current;
    if (my < 0 || my >= arr.length || mx < 0 || mx >= (arr[my]?.length ?? 0)) return '#';
    const t = arr[my][mx];
    if (t === 'G') return gatesRef.current ? '.' : 'G';
    return t;
  };
  const walkable = (t: string) => t === '.' || t === 'o' || t === 'S' || t === 'U';

  const tryStep = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const p = posRef.current;
    const nx = p.x + (dir === 'LEFT' ? -1 : dir === 'RIGHT' ? 1 : 0);
    const ny = p.y + (dir === 'UP' ? -1 : dir === 'DOWN' ? 1 : 0);
    if (!walkable(getTile(Math.floor(nx), Math.floor(ny)))) return;
    posRef.current = { x: Math.floor(nx) + 0.5, y: Math.floor(ny) + 0.5 };
  };

  // ── Input: held-key tracking (overworld model), E/Enter/Space interact, Esc/Q exit ──
  useEffect(() => {
    const isTyping = (e: KeyboardEvent) => ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);
    const DIRS: Record<string, 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> = {
      ArrowUp: 'UP', KeyW: 'UP', ArrowDown: 'DOWN', KeyS: 'DOWN',
      ArrowLeft: 'LEFT', KeyA: 'LEFT', ArrowRight: 'RIGHT', KeyD: 'RIGHT',
    };
    const kd = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      const dir = DIRS[e.code];
      if (dir) { e.preventDefault(); heldDirsRef.current.add(dir); }
      else if (['KeyE', 'Enter', 'Space'].includes(e.code)) {
        e.preventDefault();
        if (nearbyIdRef.current && onEncRef.current) onEncRef.current(nearbyIdRef.current);
      } else if ((e.code === 'Escape' || e.code === 'KeyQ') && !suppressRef.current) {
        onExitRef.current?.();
      }
    };
    const ku = (e: KeyboardEvent) => {
      const dir = DIRS[e.code];
      if (dir) heldDirsRef.current.delete(dir);
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, []);

  // patrol state init
  useEffect(() => {
    patrolStateRef.current = patrols.map(p => ({
      id: p.id, px: p.x + 0.5, py: p.y + 0.5, wi: 0, cooldown: 0, cfg: p,
    }));
  }, [patrols]);

  // torch drain
  useEffect(() => {
    if (torchDrainPerSec <= 0) return;
    const iv = setInterval(() => { torchRef.current = Math.max(0, torchRef.current - torchDrainPerSec * 0.1); }, 100);
    return () => clearInterval(iv);
  }, [torchDrainPerSec]);

  // debug hook — identical contract to the raycaster (harness + App stairs-poll + probes)
  useEffect(() => {
    (window as any).__dungeon = {
      get pos() { return { ...posRef.current }; },
      set pos(v: { x: number; y: number }) { posRef.current = { ...v }; },
      get dir() { return 0; },
      set dir(_: number) {},
      get torch() { return torchRef.current; },
      set torch(v: number) { torchRef.current = v; },
      get patrols() { return patrolStateRef.current.map(p => ({ id: p.id, x: p.px, y: p.py })); },
      walkableAt: (x: number, y: number) => {
        const t = getTile(Math.floor(x), Math.floor(y));
        return t === '.' || t === 'o' || t === 'S' || t === 'U';
      },
    };
  });

  // ── RENDER LOOP ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spriteImg = (url: string | null): HTMLImageElement | null =>
      url ? (spriteImgsRef.current[url] ?? null) : null;
    const loadSprite = (url: string) => {
      if (spriteImgsRef.current[url]) return;
      const img = new Image();
      img.onload = () => { spriteImgsRef.current[url] = img; };
      img.src = url;
    };
    loadSprite(scammerSpriteUrl);
    for (const enc of encRef.current) { const u = spriteFor(enc.id); if (u) loadSprite(u); }

    const drawTile = (ch: string, x: number, y: number, sx: number, sy: number) => {
      ctx.fillStyle = ((x + y) % 2 === 0) ? '#221d2b' : '#262030';
      ctx.fillRect(sx, sy, TS, TS);
      ctx.strokeStyle = '#1a1624'; ctx.lineWidth = 1;
      ctx.strokeRect(sx + 0.5, sy + 0.5, TS - 1, TS - 1);
      if (ch === '#') {
        ctx.fillStyle = '#171320'; ctx.fillRect(sx, sy, TS, TS);
        ctx.fillStyle = '#2b2437'; ctx.fillRect(sx, sy, TS, 8);
        ctx.fillStyle = '#3d3450'; ctx.fillRect(sx, sy + 8, TS, 2);
        ctx.strokeStyle = 'rgba(0,0,0,0.55)';
        ctx.strokeRect(sx + 0.5, sy + 0.5, TS - 1, TS - 1);
      } else if (ch === 'S' || ch === 'U') {
        ctx.fillStyle = '#c9a44c'; ctx.fillRect(sx + 4, sy + 4, TS - 8, TS - 8);
        ctx.fillStyle = '#8a6440';
        for (let s2 = 0; s2 < 3; s2++) ctx.fillRect(sx + 7, sy + 9 + s2 * 7, TS - 18, 2);
        ctx.fillStyle = '#22180d'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
        ctx.fillText(ch === 'S' ? '▼' : '▲', sx + TS / 2, sy + TS - 5);
        ctx.textAlign = 'left';
      } else if (ch === 'o') {
        ctx.fillStyle = '#3a2c14'; ctx.fillRect(sx + TS / 2 - 6, sy + TS / 2 + 2, 12, 6);
        const fl = 4 + Math.sin(animRef.current * 0.2 + x * 3 + y) * 2;
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(sx + TS / 2 - 3, sy + TS / 2 - fl, 6, fl + 2);
        ctx.fillStyle = '#fde047'; ctx.fillRect(sx + TS / 2 - 1, sy + TS / 2 - fl + 2, 2, 3);
      } else if (ch === 'G') {
        if (!gatesRef.current) {
          ctx.fillStyle = 'rgba(212,175,55,0.8)';
          for (let b = 0; b < 4; b++) ctx.fillRect(sx + 4 + b * 7, sy + 2, 3, TS - 4);
        }
      } else if (ch === 'C') {
        ctx.fillStyle = '#7a3b10'; ctx.fillRect(sx + 3, sy + 3, TS - 6, TS - 6);
        ctx.strokeStyle = '#c9a44c'; ctx.strokeRect(sx + 4.5, sy + 4.5, TS - 9, TS - 9);
      }
    };

    const step = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      const p = posRef.current;
      const nx = p.x + (dir === 'LEFT' ? -1 : dir === 'RIGHT' ? 1 : 0);
      const ny = p.y + (dir === 'UP' ? -1 : dir === 'DOWN' ? 1 : 0);
      if (walkable(getTile(Math.floor(nx), Math.floor(ny)))) {
        posRef.current = { x: Math.floor(nx) + 0.5, y: Math.floor(ny) + 0.5 };
      }
    };

    const frame = () => {
      const nowMs = performance.now();
      const dt = Math.min(0.1, (nowMs - ((frame as any).lastT ?? nowMs)) / 1000);
      (frame as any).lastT = nowMs;
      animRef.current = (animRef.current + 1) % 360;
      const hero = posRef.current;

      // hold-walk: one tile per 0.22s while held; taps handled by keydown
      heldTimerRef.current += dt;
      if (heldDirsRef.current.size > 0 && heldTimerRef.current >= 0.22) {
        heldTimerRef.current = 0;
        const last = Array.from(heldDirsRef.current).pop() as 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | undefined;
        if (last) tryStep(last);
      }

      // encounter proximity (nearest within range; bosses forgive a looser stand-off)
      let near: string | null = null;
      let nearD = Infinity;
      for (const enc of encRef.current) {
        const range = /boss/i.test(enc.id) ? 1.05 : 0.75;
        const d = Math.hypot(enc.x - hero.x, enc.y - hero.y);
        if (d <= range && (!near || d < nearD)) { near = enc.id; nearD = d; }
      }
      nearbyIdRef.current = near;

      // patrol walkers
      for (const p of patrolStateRef.current) {
        const wp = p.cfg.waypoints[p.wi] ?? p.cfg.waypoints[0];
        const tx = wp.x + 0.5, ty = wp.y + 0.5;
        const dx = tx - p.px, dy = ty - p.py;
        const dd = Math.hypot(dx, dy);
        if (dd < 0.12) { p.wi = (p.wi + 1) % p.cfg.waypoints.length; }
        else {
          const st = Math.min(dd, (p.cfg.speed ?? 1.4) * dt);
          p.px += (dx / dd) * st; p.py += (dy / dd) * st;
        }
        p.cooldown = Math.max(0, p.cooldown - dt);
        if (Math.hypot(p.px - hero.x, p.py - hero.y) < 1.4 && p.cooldown <= 0) {
          p.cooldown = 6;
          onPatrolCaughtRef.current?.(p.id);
        }
      }

      // camera: center hero, clamp to map
      const mapW = mapRef.current[0]?.length ?? 19;
      const mapH = mapRef.current.length ?? 17;
      const worldW = mapW * TS, worldH = mapH * TS;
      const hx = hero.x * TS, hy = hero.y * TS;
      const cam = {
        x: Math.max(0, Math.min(worldW - VIEW_W, hx - VIEW_W / 2)),
        y: Math.max(0, Math.min(worldH - VIEW_H, hy - VIEW_H / 2)),
      };

      ctx.fillStyle = '#0a0812'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      for (let y = 0; y < mapH; y++) {
        const row = mapRef.current[y] ?? '';
        for (let x = 0; x < mapW; x++) {
          const ch = row[x] ?? '#';
          const sx = x * TS - cam.x, sy = y * TS - cam.y;
          if (sx < -TS || sy < -TS || sx > VIEW_W || sy > VIEW_H) continue;
          drawTile(ch === 'S' || ch === 'U' ? '.' : ch, x, y, sx, sy);
          if (ch === 'S' || ch === 'U') drawTile(ch, x, y, sx, sy);
        }
      }

      // encounters: glow halo + top-down sprite + prompt bubble
      for (const enc of encRef.current) {
        const ex = enc.x * TS - cam.x, ey = enc.y * TS - cam.y;
        if (ex < -TS || ey < -TS || ex > VIEW_W + TS || ey > VIEW_H + TS) continue;
        const dist = Math.hypot(enc.x - hero.x, enc.y - hero.y);
        const pulse = 0.65 + 0.35 * Math.sin(animRef.current * 0.22 + dist);
        const halo = ctx.createRadialGradient(ex, ey, 2, ex, ey, 34);
        halo.addColorStop(0, `rgba(120,230,160,${0.4 * pulse})`);
        halo.addColorStop(1, 'rgba(120,230,160,0)');
        ctx.fillStyle = halo; ctx.fillRect(ex - 34, ey - 34, 68, 68);
        const url = spriteFor(enc.id);
        const spr = spriteImg(url);
        if (spr) ctx.drawImage(spr, ex - 15, ey - 19, 30, 30);
        else { ctx.fillStyle = pulse > 0.8 ? '#a8ffcf' : '#4ade80'; ctx.beginPath(); ctx.arc(ex, ey, 7, 0, Math.PI * 2); ctx.fill(); }
        if (near === enc.id) {
          ctx.fillStyle = 'rgba(5,3,2,0.72)'; ctx.fillRect(ex - 66, ey - 32, 132, 14);
          ctx.strokeStyle = '#6b4a2c'; ctx.strokeRect(ex - 65.5, ey - 31.5, 131, 13);
          ctx.fillStyle = '#e8a33a'; ctx.font = 'bold 8px monospace'; ctx.textAlign = 'center';
          ctx.fillText(enc.prompt.slice(0, 28).toUpperCase(), ex, ey - 22);
          ctx.textAlign = 'left';
        }
      }

      // patrols (red chasers)
      for (const p of patrolStateRef.current) {
        const px = p.px * TS - cam.x, py = p.py * TS - cam.y;
        const spr = spriteImg(scammerSpriteUrl);
        if (spr) ctx.drawImage(spr, px - 13, py - 13, 26, 26);
        else { ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill(); }
      }

      // torch flicker + floor-temperature wash
      const flicker = 0.9 + 0.1 * Math.sin(animRef.current * 0.18);
      const glow = ctx.createRadialGradient(hx - cam.x, hy - cam.y, 30, hx - cam.x, hy - cam.y, 190 * flicker);
      glow.addColorStop(0, 'rgba(255,176,84,0.20)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      const tint = TINTS[floorTint || 'warm'] || TINTS.warm;
      ctx.fillStyle = tint.glow; ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      // hero: top-down chibi with facing pip
      const dx0 = hx - cam.x, dy0 = hy - cam.y;
      ctx.fillStyle = '#2e7d32'; ctx.beginPath(); ctx.arc(dx0, dy0 - 6, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1b5e20'; ctx.fillRect(dx0 - 9, dy0 + 1, 18, 10);
      ctx.fillStyle = '#f5d76e'; ctx.beginPath(); ctx.arc(dx0, dy0 - 8, 5, 0, Math.PI * 2); ctx.fill();
      const face = (Array.from(heldDirsRef.current).pop() || lastFacingRef.current) as 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
      lastFacingRef.current = face;
      const fd = face === 'UP' ? [0, -13] : face === 'DOWN' ? [0, 13] : face === 'LEFT' ? [-13, 0] : [13, 0];
      ctx.fillStyle = '#fff'; ctx.fillRect(dx0 + fd[0] - 1, dy0 - 6 + fd[1] - 1, 3, 3);

      // HUD plaques
      ctx.fillStyle = 'rgba(5,3,2,0.55)'; ctx.fillRect(8, 8, 86, 16);
      ctx.strokeStyle = '#6b4a2c'; ctx.lineWidth = 1; ctx.strokeRect(8.5, 8.5, 86, 15);
      ctx.fillStyle = '#e8a33a'; ctx.font = 'bold 8px monospace'; ctx.textAlign = 'right';
      ctx.fillText(actLabel, VIEW_W - 12, 19); ctx.textAlign = 'left';
      if (torchDrainRef.current > 0) {
        ctx.fillStyle = 'rgba(5,3,2,0.55)'; ctx.fillRect(8, 28, 86, 10);
        ctx.strokeStyle = '#e8a33a'; ctx.strokeRect(8.5, 28.5, 85, 9);
        ctx.fillStyle = torchRef.current > 0.35 ? '#f0a53a' : '#c02a2a';
        ctx.fillRect(10, 30, Math.max(1, 82 * torchRef.current), 6);
      }

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [map, spawn, encounters, actLabel, floorTint, gatesOpen, patrols, torchDrainPerSec, suppressExit, onEncounter, onExit, onPatrolCaught]);

  void heldTimerRef; void torchRef;

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="zelda-panel p-2 rounded-xl relative w-fit">
        <canvas ref={canvasRef} width={VIEW_W} height={VIEW_H}
                className="block w-full h-auto cursor-pointer rounded-lg border-2 border-amber-500/60 shadow-2xl"
                style={{ imageRendering: 'pixelated' }} />
      </div>
    </div>
  );
};