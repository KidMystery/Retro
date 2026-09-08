import React, { useRef, useEffect, useState, useCallback } from "react";
import { ZeldaMap, ZeldaEntity, ZELDA_MAPS } from '../lib/zeldaWorldData';
import { PlayerStats, AssetQuote, TunicColor, HairColor } from '../types';
import { sound } from '../lib/audioEngine';
import { blitGrid, BASE_PALETTE, HERO_D, TILE_GRASS16, TILE_DIRT16, TILE_WATER16, OAK } from '../lib/pixelArt';
import {
  TILE_SIZE, VIEW_W_TILES, VIEW_H_TILES, VIEW_W_PX, VIEW_H_PX,
  tileCenterPx, pxToTile, cameraFor, advanceToward,
  PlayerMotion, Dir,
} from '../lib/overworldMotion';
import act2GroundUrl from '../assets/textures/act2_ground.png';
import act3GroundUrl from '../assets/textures/act3_ground.png';
import act4GroundUrl from '../assets/textures/act4_ground.png';
import act5GroundUrl from '../assets/textures/act5_ground.png';
import { Compass, MessageCircle, Swords } from "lucide-react";

// MILESTONE B (game-feel rework): the overworld is now a SCROLLING WINDOW onto
// the map — camera follows a smoothly-moving hero, landmarks are drawn glyphs
// with NO floating name plates. Names appear only in the contextual prompt bar
// when standing near a landmark (Zelda-style). Tile-accurate commits via onMove
// keep saves, encounters, and the debug harness working unchanged.

const ACT_GROUND_URLS: Record<number, string> = {
  2: act2GroundUrl,
  3: act3GroundUrl,
  4: act4GroundUrl,
  5: act5GroundUrl,
};
const loadedGroundImgs = new Map<string, HTMLImageElement>();
const getGroundImg = (act: number): HTMLImageElement | null => {
  const url = ACT_GROUND_URLS[act];
  if (!url) return null;
  let img = loadedGroundImgs.get(url);
  if (!img) {
    img = new Image();
    img.src = url;
    loadedGroundImgs.set(url, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
};

interface ZeldaOverworldCanvasProps {
  act: number;
  player: PlayerStats;
  asset: AssetQuote;
  onMove: (
    x: number,
    y: number,
    facing: "UP" | "DOWN" | "LEFT" | "RIGHT",
  ) => void;
  onInteractEntity: (entity: ZeldaEntity) => void;
  onSwordSlash: () => void;
  onOpenSave?: () => void;
  onOpenSaveModal?: () => void;
  /** NG+ Second Cycle: darkened corrupted palette variant. */
  corrupted?: boolean;
}

const TUNIC_COLORS: Record<TunicColor, { main: string; shadow: string; highlight: string }> = {
  green: { main: "#2e7d32", shadow: "#1b5e20", highlight: "#4caf50" },
  blue: { main: "#1d4ed8", shadow: "#1e3a8a", highlight: "#60a5fa" },
  red: { main: "#b91c1c", shadow: "#7f1d1d", highlight: "#f87171" },
  purple: { main: "#7e22ce", shadow: "#581c87", highlight: "#c084fc" },
  black: { main: "#334155", shadow: "#0f172a", highlight: "#64748b" },
};
const HAIR_COLORS: Record<HairColor, string> = {
  blonde: "#facc15",
  brown: "#78350f",
  black: "#111827",
  white: "#f1f5f9",
};

const KEY_DIRS: Record<string, Dir> = {
  ArrowUp: "UP", KeyW: "UP",
  ArrowDown: "DOWN", KeyS: "DOWN",
  ArrowLeft: "LEFT", KeyA: "LEFT",
  ArrowRight: "RIGHT", KeyD: "RIGHT",
};

export const ZeldaOverworldCanvas: React.FC<ZeldaOverworldCanvasProps> = ({
  act,
  player,
  onMove,
  onInteractEntity,
  onSwordSlash,
  corrupted = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapData: ZeldaMap = ZELDA_MAPS[act] || ZELDA_MAPS[1];
  const [nearbyEntity, setNearbyEntity] = useState<ZeldaEntity | null>(null);
  const [isSlashing, setIsSlashing] = useState(false);
  const [, setForceRedraw] = useState(0);

  const worldWpx = mapData.width * TILE_SIZE;
  const worldHpx = mapData.height * TILE_SIZE;

  // Pixel-space motion lives in a ref (mutated per frame, no re-render churn).
  const motionRef = useRef<PlayerMotion>({
    pos: tileCenterPx(player.mapX, player.mapY),
    facing: (player.facing || "DOWN") as Dir,
    walkTick: 0,
  });
  const movingRef = useRef(false);
  const targetTileRef = useRef<{ x: number; y: number } | null>(null);
  const lastCommittedRef = useRef({ x: player.mapX, y: player.mapY });
  const heldDirsRef = useRef<Set<Dir>>(new Set());
  const lastBlockAlarmRef = useRef(0);

  const isSolid = useCallback(
    (x: number, y: number): boolean => {
      if (x < 0 || x >= mapData.width || y < 0 || y >= mapData.height) return true;
      const tile = mapData.tiles[y]?.[x];
      if (!tile) return true;
      return tile === "T" || tile === "#" || tile === "~";
    },
    [mapData],
  );

  // External teleports (harness debug patch, save-load, REST) snap the hero.
  useEffect(() => {
    if (player.mapX !== lastCommittedRef.current.x || player.mapY !== lastCommittedRef.current.y) {
      lastCommittedRef.current = { x: player.mapX, y: player.mapY };
      movingRef.current = false;
      targetTileRef.current = null;
      motionRef.current.pos = tileCenterPx(player.mapX, player.mapY);
      motionRef.current.walkTick = 0;
    }
  }, [player.mapX, player.mapY]);

  // Proximity prompt (Zelda-style): the ONLY place landmark names appear.
  useEffect(() => {
    const found = mapData.entities.find(
      (e) => Math.abs(e.x - lastCommittedRef.current.x) + Math.abs(e.y - lastCommittedRef.current.y) <= 1.2,
    );
    setNearbyEntity(found || null);
  }, [player.mapX, player.mapY, mapData.entities]);

  const triggerSlash = useCallback(() => {
    sound.playSwordSlash();
    setIsSlashing(true);
    onSwordSlash();
    setTimeout(() => setIsSlashing(false), 240);
    if (nearbyEntity && (nearbyEntity.type === "BOSS" || nearbyEntity.type === "NPC_SCAMMER"))
      onInteractEntity(nearbyEntity);
  }, [nearbyEntity, onInteractEntity, onSwordSlash]);

  // ── Input: held-key tracking (keydown adds, keyup removes; re-press = last priority) ──
  useEffect(() => {
    const isTyping = (e: KeyboardEvent) =>
      ["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName);
    const kd = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      const dir = KEY_DIRS[e.code];
      if (dir) {
        e.preventDefault();
        heldDirsRef.current.delete(dir);
        heldDirsRef.current.add(dir); // re-insert → last pressed wins
      } else if (["Space", "KeyE", "Enter"].includes(e.code)) {
        e.preventDefault();
        if (nearbyEntity) onInteractEntity(nearbyEntity);
        else triggerSlash();
      } else if (["KeyJ", "KeyZ"].includes(e.code)) {
        e.preventDefault();
        triggerSlash();
      }
    };
    const ku = (e: KeyboardEvent) => {
      const dir = KEY_DIRS[e.code];
      if (dir) heldDirsRef.current.delete(dir);
    };
    const clear = () => heldDirsRef.current.clear();
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      window.removeEventListener("blur", clear);
    };
  }, [nearbyEntity, onInteractEntity, triggerSlash]);

  // ── Simulation + render loop: smooth movement, scrolling camera, glyph landmarks ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let lastT = performance.now();
    let frame = 0;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      const motion = motionRef.current;

      // Step initiation: idle + a direction held → begin one smooth tile step.
      if (!movingRef.current && heldDirsRef.current.size > 0) {
        const dirs = [...heldDirsRef.current];
        const dir = dirs[dirs.length - 1];
        const cur = pxToTile(motion.pos);
        const nx = cur.x + (dir === "LEFT" ? -1 : dir === "RIGHT" ? 1 : 0);
        const ny = cur.y + (dir === "UP" ? -1 : dir === "DOWN" ? 1 : 0);
        motion.facing = dir;
        if (isSolid(nx, ny)) {
          if (now - lastBlockAlarmRef.current > 400) {
            sound.playAlarmSound();
            lastBlockAlarmRef.current = now;
          }
        } else {
          sound.playKeyClick();
          movingRef.current = true;
          targetTileRef.current = { x: nx, y: ny };
        }
      }

      // Advance the step; commit tile-accurate arrival to App state.
      if (movingRef.current && targetTileRef.current) {
        motion.walkTick += dt;
        const arrived = advanceToward(motion, tileCenterPx(targetTileRef.current.x, targetTileRef.current.y), dt);
        if (arrived) {
          movingRef.current = false;
          motion.walkTick = 0;
          lastCommittedRef.current = { ...targetTileRef.current };
          onMove(targetTileRef.current.x, targetTileRef.current.y, motion.facing);
          targetTileRef.current = null;
        }
      }

      // ── Draw: viewport window with camera offset ──
      const cam = cameraFor(motion.pos, worldWpx, worldHpx);
      frame++;
      ctx.fillStyle = "#060a12";
      ctx.fillRect(0, 0, VIEW_W_PX, VIEW_H_PX);
      const groundImg = getGroundImg(act);
      const t0x = Math.floor(cam.x / TILE_SIZE);
      const t0y = Math.floor(cam.y / TILE_SIZE);
      const t1x = Math.min(mapData.width - 1, t0x + VIEW_W_TILES + 1);
      const t1y = Math.min(mapData.height - 1, t0y + VIEW_H_TILES + 1);
      const fairySparkOffset = (frame * 0.8) % 30;

      for (let y = t0y; y <= t1y; y++) {
        for (let x = t0x; x <= t1x; x++) {
          const tile = mapData.tiles[y]?.[x] || ".";
          const px = x * TILE_SIZE - cam.x;
          const py = y * TILE_SIZE - cam.y;
          if (tile === ".") {
            if (groundImg) {
              const qx = ((x * 13 + y * 7) % 2) * 32;
              const qy = ((x * 7 + y * 11) % 2) * 32;
              ctx.drawImage(groundImg, qx, qy, 32, 32, px, py, TILE_SIZE, TILE_SIZE);
            } else {
              blitGrid(ctx, TILE_GRASS16, BASE_PALETTE, px, py, 2);
            }
          } else if (tile === "F") {
            ctx.fillStyle = "#2d6a2f";
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = "#4ade80";
            ctx.fillRect(px + 17, py + 16, 4, 10);
            ctx.fillStyle = (x + y) % 2 === 0 ? "#fde047" : "#f43f5e";
            ctx.fillRect(px + 14, py + 12, 10, 10);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(px + 17, py + 15, 4, 4);
          } else if (tile === "P") {
            blitGrid(ctx, TILE_DIRT16, BASE_PALETTE, px, py, 2);
          } else if (tile === "T") {
            if (groundImg) {
              ctx.drawImage(groundImg, ((x * 13 + y * 7) % 2) * 32, ((x * 7 + y * 11) % 2) * 32, 32, 32, px, py, TILE_SIZE, TILE_SIZE);
            } else {
              ctx.fillStyle = "#1a2e1a";
              ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            }
            blitGrid(ctx, OAK, BASE_PALETTE, px, py, 2);
          } else if (tile === "~") {
            blitGrid(ctx, TILE_WATER16, BASE_PALETTE, px, py, 2);
          } else if (tile === "=") {
            ctx.fillStyle = "#0369a1";
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = "#854d0e";
            ctx.fillRect(px, py + 4, TILE_SIZE, TILE_SIZE - 8);
            ctx.fillStyle = "#451a03";
            ctx.fillRect(px + 8, py + 4, 2, TILE_SIZE - 8);
            ctx.fillRect(px + 18, py + 4, 2, TILE_SIZE - 8);
            ctx.fillRect(px + 28, py + 4, 2, TILE_SIZE - 8);
            ctx.fillStyle = "#ca8a04";
            ctx.fillRect(px, py + 2, TILE_SIZE, 3);
            ctx.fillRect(px, py + TILE_SIZE - 5, TILE_SIZE, 3);
          } else if (tile === "#") {
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = "#334155";
            ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            ctx.strokeStyle = "#0f172a";
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            ctx.fillStyle = "#475569";
            ctx.fillRect(px + 6, py + 6, 12, 10);
          } else if (tile === "D") {
            if (groundImg) {
              ctx.drawImage(groundImg, ((x * 13 + y * 7) % 2) * 32, ((x * 7 + y * 11) % 2) * 32, 32, 32, px, py, TILE_SIZE, TILE_SIZE);
            } else {
              ctx.fillStyle = "#2d6a2f";
              ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            }
            ctx.fillStyle = "#0f172a";
            ctx.beginPath();
            ctx.arc(px + 19, py + 24, 14, Math.PI, 0, false);
            ctx.fill();
            ctx.strokeStyle = "#d97706";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "#f59e0b";
            ctx.fillRect(px + 4, py + 14, 3, 3);
            ctx.fillRect(px + 31, py + 14, 3, 3);
          }
        }
      }

      // ── Landmarks as drawn glyphs — NO floating name plates, NO text ──
      const inView = (ex: number, ey: number) =>
        ex + TILE_SIZE > cam.x - TILE_SIZE && ex < cam.x + VIEW_W_PX + TILE_SIZE &&
        ey + TILE_SIZE > cam.y - TILE_SIZE && ey < cam.y + VIEW_H_PX + TILE_SIZE;

      mapData.entities.forEach((entity) => {
        const ex = entity.x * TILE_SIZE - cam.x;
        const ey = entity.y * TILE_SIZE - cam.y;
        if (!inView(entity.x * TILE_SIZE, entity.y * TILE_SIZE)) return;
        if (entity.type === "SHRINE") {
          ctx.fillStyle = "rgba(245,158,11,0.25)";
          ctx.beginPath();
          ctx.arc(ex + 19, ey + 24, 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#94a3b8";
          ctx.fillRect(ex + 7, ey + 24, 24, 10);
          ctx.fillStyle = "#e2e8f0";
          ctx.fillRect(ex + 9, ey + 22, 20, 4);
          ctx.fillStyle = "#f8fafc";
          ctx.fillRect(ex + 13, ey + 10, 12, 14);
          ctx.fillStyle = "#cbd5e1";
          ctx.beginPath();
          ctx.moveTo(ex + 13, ey + 14);
          ctx.lineTo(ex + 4, ey + 8);
          ctx.lineTo(ex + 13, ey + 22);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(ex + 25, ey + 14);
          ctx.lineTo(ex + 34, ey + 8);
          ctx.lineTo(ex + 25, ey + 22);
          ctx.fill();
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(ex + 19, ey + 8, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fef08a";
          ctx.beginPath();
          ctx.arc(ex + 19, ey + 8, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(254,240,138,0.8)";
          ctx.fillRect(ex + 14, ey + 20 - fairySparkOffset, 3, 3);
          ctx.fillRect(ex + 22, ey + 15 - ((fairySparkOffset + 12) % 30), 2, 2);
        } else if (entity.type === "NPC_SAGE") {
          ctx.fillStyle = "#1e3a8a";
          ctx.fillRect(ex + 10, ey + 14, 18, 20);
          ctx.fillStyle = "#ffedd5";
          ctx.fillRect(ex + 13, ey + 8, 12, 8);
          ctx.fillStyle = "#e2e8f0";
          ctx.fillRect(ex + 12, ey + 14, 14, 12);
          ctx.fillStyle = "#1e3a8a";
          ctx.beginPath();
          ctx.moveTo(ex + 8, ey + 8);
          ctx.lineTo(ex + 19, ey - 2);
          ctx.lineTo(ex + 30, ey + 8);
          ctx.fill();
          ctx.fillStyle = "#facc15";
          ctx.fillRect(ex + 26, ey + 16, 6, 12);
        } else if (entity.type === "NPC_BROKER") {
          // Broker desk: counter + hanging scale, no text.
          ctx.fillStyle = "#7e22ce";
          ctx.fillRect(ex + 6, ey + 16, 26, 6);
          ctx.fillStyle = "#5b21b6";
          ctx.fillRect(ex + 8, ey + 22, 22, 12);
          ctx.fillStyle = "#fbbf24";
          ctx.fillRect(ex + 18, ey + 6, 2, 10);
          ctx.beginPath();
          ctx.moveTo(ex + 10, ey + 8);
          ctx.lineTo(ex + 28, ey + 8);
          ctx.stroke();
          ctx.fillStyle = "#fbbf24";
          ctx.beginPath();
          ctx.arc(ex + 10, ey + 10, 3, 0, Math.PI * 2);
          ctx.arc(ex + 28, ey + 10, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#fbbf24";
          ctx.beginPath();
          ctx.moveTo(ex + 10, ey + 8);
          ctx.lineTo(ex + 28, ey + 8);
          ctx.stroke();
        } else if (entity.type === "NPC_SCAMMER") {
          ctx.fillStyle = "#18181b";
          ctx.fillRect(ex + 9, ey + 10, 20, 24);
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(ex + 13, ey + 15, 3, 2);
          ctx.fillRect(ex + 22, ey + 15, 3, 2);
          ctx.fillStyle = "#a855f7";
          ctx.beginPath();
          ctx.arc(ex + 27, ey + 22, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (entity.type === "NPC_ASSET") {
          // Gold nugget mound with sparkle, no text.
          ctx.fillStyle = "#ca8a04";
          ctx.beginPath();
          ctx.moveTo(ex + 4, ey + 32);
          ctx.lineTo(ex + 12, ey + 12);
          ctx.lineTo(ex + 24, ey + 18);
          ctx.lineTo(ex + 34, ey + 32);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "#fef08a";
          ctx.fillRect(ex + 14, ey + 20, 4, 4);
          ctx.fillRect(ex + 24, ey + 26, 3, 3);
        } else if (entity.type === "CHEST") {
          ctx.fillStyle = "#78350f";
          ctx.fillRect(ex + 8, ey + 14, 22, 18);
          ctx.fillStyle = "#f59e0b";
          ctx.fillRect(ex + 8, ey + 18, 22, 4);
          ctx.fillRect(ex + 17, ey + 20, 4, 5);
        } else if (entity.type === "PORTAL") {
          const swirl = 0.6 + 0.4 * Math.sin(frame * 0.08);
          ctx.fillStyle = `rgba(124,58,237,${0.25 + 0.2 * swirl})`;
          ctx.beginPath();
          ctx.arc(ex + 19, ey + 22, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#2e1065";
          ctx.fillRect(ex + 9, ey + 10, 20, 26);
          ctx.fillStyle = "#7c3aed";
          for (let s = 0; s < 4; s++) {
            ctx.fillRect(ex + 11, ey + 13 + s * 6, 16 - s * 3, 3);
          }
        } else if (entity.type === "BOSS") {
          // Horned menace silhouette, no text.
          ctx.fillStyle = "#991b1b";
          ctx.beginPath();
          ctx.ellipse(ex + 19, ey + 24, 16, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(ex + 8, ey + 10, 4, 10);
          ctx.fillRect(ex + 26, ey + 10, 4, 10);
          ctx.fillStyle = "#fca5a5";
          ctx.fillRect(ex + 12, ey + 20, 3, 3);
          ctx.fillRect(ex + 23, ey + 20, 3, 3);
          ctx.fillStyle = "#fef2f2";
          ctx.beginPath();
          ctx.moveTo(ex + 13, ey + 30);
          ctx.lineTo(ex + 19, ey + 34);
          ctx.lineTo(ex + 25, ey + 30);
          ctx.lineTo(ex + 19, ey + 32);
          ctx.closePath();
          ctx.fill();
        }
      });

      // ── Hero: smooth pixel position + walk cycle + shadow (no name plate) ──
      const tunic = TUNIC_COLORS[player.avatar?.tunicColor || "green"];
      const hair = HAIR_COLORS[player.avatar?.hairColor || "blonde"];
      const px = motion.pos.x - TILE_SIZE / 2 - cam.x;
      const py = motion.pos.y - TILE_SIZE / 2 - cam.y;
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.ellipse(motion.pos.x - cam.x, motion.pos.y - cam.y + 14, 11, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      const walkFrame = motion.walkTick > 0 ? Math.floor(motion.walkTick * 7) % 4 : 0;
      const legOff = walkFrame % 2 === 1 ? 2 : 0;
      ctx.fillStyle = "#5c381c";
      ctx.fillRect(px + 12, py + 29 - legOff, 6, 6);
      ctx.fillRect(px + 21, py + 29 - (2 - legOff), 6, 6);
      const heroScale = 2;
      const heroW = 16 * heroScale;
      const heroH = 20 * heroScale;
      const bob = walkFrame === 1 || walkFrame === 3 ? 1 : 0;
      blitGrid(
        ctx,
        HERO_D,
        BASE_PALETTE,
        px + (TILE_SIZE - heroW) / 2,
        py + (TILE_SIZE - heroH) - 2 - bob,
        heroScale,
        { tunic: tunic.main, hair, accent: "#f59e0b" }
      );
      if (isSlashing) {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (motion.facing === "RIGHT") ctx.arc(px + 26, py + 18, 20, -Math.PI / 3, Math.PI / 3);
        else if (motion.facing === "LEFT") ctx.arc(px + 12, py + 18, 20, (2 * Math.PI) / 3, (4 * Math.PI) / 3);
        else if (motion.facing === "UP") ctx.arc(px + 19, py + 10, 20, -Math.PI, 0);
        else ctx.arc(px + 19, py + 28, 20, 0, Math.PI);
        ctx.stroke();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // NG+ corrupted wash over the VIEWPORT (not world coords).
      if (corrupted) {
        ctx.fillStyle = "rgba(8, 2, 20, 0.45)";
        ctx.fillRect(0, 0, VIEW_W_PX, VIEW_H_PX);
        const pulse = 0.1 + 0.06 * Math.sin(frame * 0.35);
        const vign = ctx.createRadialGradient(
          VIEW_W_PX / 2, VIEW_H_PX / 2, Math.min(VIEW_W_PX, VIEW_H_PX) * 0.25,
          VIEW_W_PX / 2, VIEW_H_PX / 2, Math.max(VIEW_W_PX, VIEW_H_PX) * 0.7,
        );
        vign.addColorStop(0, "rgba(0,0,0,0)");
        vign.addColorStop(1, `rgba(120, 0, 40, ${pulse.toFixed(3)})`);
        ctx.fillStyle = vign;
        ctx.fillRect(0, 0, VIEW_W_PX, VIEW_H_PX);
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        for (let sy = (frame * 2) % 8; sy < VIEW_H_PX; sy += 8) {
          ctx.fillRect(0, sy, VIEW_W_PX, 2);
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [act, mapData, player.avatar, corrupted, isSlashing, onMove, isSolid, worldWpx, worldHpx]);

  // Touch/click step support: click a tile edge of the canvas to step (mobile).
  const stepTouch = useCallback(
    (dir: Dir) => {
      const motion = motionRef.current;
      if (movingRef.current) return;
      const cur = pxToTile(motion.pos);
      const nx = cur.x + (dir === "LEFT" ? -1 : dir === "RIGHT" ? 1 : 0);
      const ny = cur.y + (dir === "UP" ? -1 : dir === "DOWN" ? 1 : 0);
      motion.facing = dir;
      if (isSolid(nx, ny)) {
        sound.playAlarmSound();
        return;
      }
      sound.playKeyClick();
      movingRef.current = true;
      targetTileRef.current = { x: nx, y: ny };
      setForceRedraw((f) => f + 1);
    },
    [isSolid],
  );

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="zelda-panel p-2 rounded-xl relative w-full max-w-[520px] border-amber-500/30">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-1.5 mb-1.5 text-[11px] px-1">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-cinzel text-amber-300">
              ACT {mapData.act}: {mapData.name}
              {corrupted ? " • ⛧ CORRUPTED ⛧" : ""}
            </span>
          </div>
          <button
            onClick={triggerSlash}
            className="snes-btn flex items-center gap-1 px-2 py-0.5 rounded"
            title="Swing sword (J)"
          >
            <Swords className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
        <div className="rounded-lg border-2 border-amber-500/60 shadow-2xl overflow-hidden">
          <canvas
            ref={canvasRef}
            width={VIEW_W_PX}
            height={VIEW_H_PX}
            className="block w-full h-auto cursor-pointer"
            onClick={triggerSlash}
            title="Click to Swing Master Sword"
          />
        </div>
        {nearbyEntity && (
          <div className="absolute bottom-4 left-3 right-3 bg-slate-950/95 border-2 border-amber-400 p-2 text-amber-300 text-xs flex items-center justify-between shadow-2xl rounded-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold uppercase truncate">{nearbyEntity.interactPrompt}</span>
            </div>
            <button
              onClick={() => onInteractEntity(nearbyEntity)}
              className="snes-btn-primary px-3 py-1 text-xs rounded shrink-0"
            >
              [SPACE]
            </button>
          </div>
        )}
        {/* Mobile step pad (compact, bottom-right) */}
        <div className="lg:hidden grid grid-cols-3 gap-1 w-28 mt-2 mx-auto">
          <div />
          <button onClick={() => stepTouch("UP")} className="snes-btn py-1.5 rounded">▲</button>
          <div />
          <button onClick={() => stepTouch("LEFT")} className="snes-btn py-1.5 rounded">◀</button>
          <div />
          <button onClick={() => stepTouch("RIGHT")} className="snes-btn py-1.5 rounded">▶</button>
          <div />
          <button onClick={() => stepTouch("DOWN")} className="snes-btn py-1.5 rounded">▼</button>
          <div />
        </div>
      </div>
    </div>
  );
};
