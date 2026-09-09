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
import lmSageUrl from '../assets/sprites/landmarks/lm_sage.png';
import lmBrokerUrl from '../assets/sprites/landmarks/lm_broker.png';
import lmScammerUrl from '../assets/sprites/landmarks/lm_scammer.png';
import lmChestUrl from '../assets/sprites/landmarks/lm_chest.png';
import lmShrineUrl from '../assets/sprites/landmarks/lm_shrine.png';
import lmPortalUrl from '../assets/sprites/landmarks/lm_portal.png';
import lmBossUrl from '../assets/sprites/landmarks/lm_boss.png';
import lmAssetUrl from '../assets/sprites/landmarks/lm_asset.png';
import heroDownUrl from '../assets/sprites/hero_down.png';
import heroUpUrl from '../assets/sprites/hero_up.png';
import heroLeftUrl from '../assets/sprites/hero_left.png';
import heroRightUrl from '../assets/sprites/hero_right.png';
import grassTile0 from '../assets/textures/tiles/grass_0.png';
import grassTile1 from '../assets/textures/tiles/grass_1.png';
import grassTile2 from '../assets/textures/tiles/grass_2.png';
import grassTile3 from '../assets/textures/tiles/grass_3.png';
import pathTile0 from '../assets/textures/tiles/path_0.png';
import pathTile1 from '../assets/textures/tiles/path_1.png';
import pathTile2 from '../assets/textures/tiles/path_2.png';
import pathTile3 from '../assets/textures/tiles/path_3.png';
import waterTile0 from '../assets/textures/tiles/water_0.png';
import waterTile1 from '../assets/textures/tiles/water_1.png';
import waterTile2 from '../assets/textures/tiles/water_2.png';
import waterTile3 from '../assets/textures/tiles/water_3.png';
import { Compass, MessageCircle, Swords } from "lucide-react";

// MILESTONE B (game-feel rework): the overworld is now a SCROLLING WINDOW onto
// the map — camera follows a smoothly-moving hero, landmarks are drawn glyphs
// with NO floating name plates. Names appear only in the contextual prompt bar
// when standing near a landmark (Zelda-style). Tile-accurate commits via onMove
// keep saves, encounters, and the debug harness working unchanged.
// ART BATCH 2: landmarks are AI-generated 16-bit sprites (Luna style-lock),
// chroma-keyed, drawn at 44px (fits a 38px tile with overhang like ALttP).

const LANDMARK_IMG_SRC: Record<string, string> = {
  NPC_SAGE: lmSageUrl,
  NPC_BROKER: lmBrokerUrl,
  NPC_SCAMMER: lmScammerUrl,
  CHEST: lmChestUrl,
  SHRINE: lmShrineUrl,
  PORTAL: lmPortalUrl,
  BOSS: lmBossUrl,
  NPC_ASSET: lmAssetUrl,
};
const loadedLandmarkImgs = new Map<string, HTMLImageElement>();
const getLandmarkImg = (type: string): HTMLImageElement | null => {
  const src = LANDMARK_IMG_SRC[type];
  if (!src) return null;
  let img = loadedLandmarkImgs.get(src);
  if (!img) {
    img = new Image();
    img.src = src;
    loadedLandmarkImgs.set(src, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
};
const LM_DRAW = 44; // draw size in px on the 38px tile (slight overhang reads ALttP)

// ART BATCH 3: true terrain tile variants (4 per type, hash-picked) kill the
// stamped-tile grid; AI hero sprites by facing kill the code-drawn avatar.
const HERO_IMG_SRC: Record<string, string> = {
  DOWN: heroDownUrl, UP: heroUpUrl, LEFT: heroLeftUrl, RIGHT: heroRightUrl,
};
const loadedHeroImgs = new Map<string, HTMLImageElement>();
const getHeroImg = (facing: string): HTMLImageElement | null => {
  const s = HERO_IMG_SRC[facing] || heroDownUrl;
  let img = loadedHeroImgs.get(s);
  if (!img) {
    img = new Image();
    img.src = s;
    loadedHeroImgs.set(s, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
};
const TILE_VARIANTS: Record<string, string[]> = {
  ".": [grassTile0, grassTile1, grassTile2, grassTile3],
  P: [pathTile0, pathTile1, pathTile2, pathTile3],
  "~": [waterTile0, waterTile1, waterTile2, waterTile3],
};
const loadedVariantImgs = new Map<string, HTMLImageElement[]>();
const getVariantImgs = (tile: string): HTMLImageElement[] | null => {
  const srcs = TILE_VARIANTS[tile];
  if (!srcs) return null;
  let imgs = loadedVariantImgs.get(tile);
  if (!imgs) {
    imgs = srcs.map((s) => {
      const im = new Image();
      im.src = s;
      return im;
    });
    loadedVariantImgs.set(tile, imgs);
  }
  const ready = imgs.filter((im) => im.complete && im.naturalWidth > 0);
  return ready.length ? ready : null;
};
// Stable per-tile pseudo-hash: same tile always picks the same variant.
const tileHash = (x: number, y: number): number => ((x * 73856093) ^ (y * 19349663)) >>> 0;

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
  /** Chest ids already looted (one-shot chests render open/empty). */
  openedChestIds?: string[];
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
  openedChestIds = [],
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
  const stepOnceRef = useRef<Dir | null>(null);
  const openedChestsRef = useRef<Set<string>>(new Set(openedChestIds));
  useEffect(() => { openedChestsRef.current = new Set(openedChestIds); }, [openedChestIds]);
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
  // Looted chests say they're empty instead of offering to open.
  useEffect(() => {
    const found = mapData.entities.find(
      (e) => Math.abs(e.x - lastCommittedRef.current.x) + Math.abs(e.y - lastCommittedRef.current.y) <= 1.2,
    );
    if (found && found.type === "CHEST" && openedChestsRef.current.has(found.id)) {
      setNearbyEntity({ ...found, interactPrompt: "The chest is empty — already looted" });
    } else {
      setNearbyEntity(found || null);
    }
  }, [player.mapX, player.mapY, mapData.entities, openedChestIds]);

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
        // Tap = one step (grid compat: harness + quick taps). Hold = smooth walk.
        if (!movingRef.current) stepOnceRef.current = dir;
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

      // Step initiation: idle + direction held (or tapped) → one smooth tile step.
      if (!movingRef.current && (stepOnceRef.current || heldDirsRef.current.size > 0)) {
        const dir = stepOnceRef.current || [...heldDirsRef.current][heldDirsRef.current.size - 1];
        stepOnceRef.current = null;
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
      // Luna spec: bright daylight presentation. Clear color = base terrain,
      // never near-black. No screen-wide darkening.
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#49A94B";
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
          const variants = getVariantImgs(tile);
          if (variants) {
            // ART BATCH 3: pick a stable variant per tile → organic field, no stamping
            const img = variants[tileHash(x, y) % variants.length];
            ctx.drawImage(img, px, py, TILE_SIZE, TILE_SIZE);
          } else if (tile === ".") {
            if (groundImg) {
              const qx = ((x * 13 + y * 7) % 2) * 32;
              const qy = ((x * 7 + y * 11) % 2) * 32;
              ctx.drawImage(groundImg, qx, qy, 32, 32, px, py, TILE_SIZE, TILE_SIZE);
            } else {
              blitGrid(ctx, TILE_GRASS16, BASE_PALETTE, px, py, 2);
            }
          } else if (tile === "F") {
            // Unified-world pass: meadow tile = grass base + tiny ALttP-style
            // flower/tuft details (2-3px), varied per-tile so nothing repeats
            // as a block of color.
            if (groundImg) {
              ctx.drawImage(groundImg, ((x * 13 + y * 7) % 2) * 32, ((x * 7 + y * 11) % 2) * 32, 32, 32, px, py, TILE_SIZE, TILE_SIZE);
            } else {
              blitGrid(ctx, TILE_GRASS16, BASE_PALETTE, px, py, 2);
            }
            const h = (x * 31 + y * 17) % 4;
            const fx = [10, 22, 15, 26][h];
            const fy = [12, 20, 25, 9][h];
            ctx.fillStyle = h % 2 === 0 ? "#fde047" : "#f472b6";
            ctx.fillRect(px + fx, py + fy, 3, 3);
            ctx.fillRect(px + fx - 1, py + fy + 1, 1, 1);
            ctx.fillRect(px + fx + 3, py + fy + 1, 1, 1);
            ctx.fillStyle = "#166534";
            ctx.fillRect(px + fx + 1, py + fy + 3, 1, 3);
          } else if (tile === "P") {
            blitGrid(ctx, TILE_DIRT16, BASE_PALETTE, px, py, 2);
          } else if (tile === "T") {
            if (groundImg) {
              ctx.drawImage(groundImg, ((x * 13 + y * 7) % 2) * 32, ((x * 7 + y * 11) % 2) * 32, 32, 32, px, py, TILE_SIZE, TILE_SIZE);
            } else {
              ctx.fillStyle = "#3F8A46"; // Luna: canopy backing, not near-black
              ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            }
            blitGrid(ctx, OAK, BASE_PALETTE, px, py, 2);
          } else if (tile === "~") {
            blitGrid(ctx, TILE_WATER16, BASE_PALETTE, px, py, 2);
          } else if (tile === "=") {
            ctx.fillStyle = "#3F9ED0";
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = "#8B5A3C";
            ctx.fillRect(px, py + 4, TILE_SIZE, TILE_SIZE - 8);
            ctx.fillStyle = "#5d3a26";
            ctx.fillRect(px + 8, py + 4, 2, TILE_SIZE - 8);
            ctx.fillRect(px + 18, py + 4, 2, TILE_SIZE - 8);
            ctx.fillRect(px + 28, py + 4, 2, TILE_SIZE - 8);
            ctx.fillStyle = "#C19A5B";
            ctx.fillRect(px, py + 2, TILE_SIZE, 3);
            ctx.fillRect(px, py + TILE_SIZE - 5, TILE_SIZE, 3);
          } else if (tile === "#") {
            ctx.fillStyle = "#5b7057"; // Luna: readable stone, not navy-black
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = "#7d947b";
            ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            ctx.strokeStyle = "#173B2B";
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            ctx.fillStyle = "#93a892";
            ctx.fillRect(px + 6, py + 6, 12, 10);
          } else if (tile === "D") {
            if (groundImg) {
              ctx.drawImage(groundImg, ((x * 13 + y * 7) % 2) * 32, ((x * 7 + y * 11) % 2) * 32, 32, 32, px, py, TILE_SIZE, TILE_SIZE);
            } else {
              ctx.fillStyle = "#49A94B";
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

      // ── Unified-world pass: shoreline foam + path edge blending ──
      for (let y = t0y; y <= t1y; y++) {
        for (let x = t0x; x <= t1x; x++) {
          const tile = mapData.tiles[y]?.[x] || ".";
          const px = x * TILE_SIZE - cam.x;
          const py = y * TILE_SIZE - cam.y;
          const solidAt = (tx: number, ty: number) => {
            const t = mapData.tiles[ty]?.[tx];
            return t === "T" || t === "#" || t === "~";
          };
          if (tile === "~") {
            // Foam where water touches land (ALttP shoreline)
            ctx.fillStyle = "rgba(186,230,253,0.85)";
            if (!solidAt(x, y - 1)) ctx.fillRect(px, py, TILE_SIZE, 3);
            if (!solidAt(x, y + 1)) ctx.fillRect(px, py + TILE_SIZE - 3, TILE_SIZE, 3);
            if (!solidAt(x - 1, y)) ctx.fillRect(px, py, 3, TILE_SIZE);
            if (!solidAt(x + 1, y)) ctx.fillRect(px + TILE_SIZE - 3, py, 3, TILE_SIZE);
            // animated shimmer line
            const sh = (x * 3 + y * 5 + Math.floor(frame / 24)) % 4;
            if (sh === 0) {
              ctx.fillStyle = "rgba(255,255,255,0.35)";
              ctx.fillRect(px + 8, py + 14, 10, 2);
            }
          } else if (tile === "P") {
            // Soft grass overhang on path edges facing grass (kills hard seams)
            const grassAt = (tx: number, ty: number) => (mapData.tiles[ty]?.[tx] || ".") === ".";
            ctx.fillStyle = "rgba(120,200,80,0.5)";
            if (grassAt(x, y - 1)) { ctx.fillRect(px + 2, py, 6, 2); ctx.fillRect(px + 22, py, 6, 2); }
            if (grassAt(x, y + 1)) { ctx.fillRect(px + 2, py + TILE_SIZE - 2, 6, 2); ctx.fillRect(px + 22, py + TILE_SIZE - 2, 6, 2); }
            if (grassAt(x - 1, y)) { ctx.fillRect(px, py + 2, 2, 6); ctx.fillRect(px, py + 22, 2, 6); }
            if (grassAt(x + 1, y)) { ctx.fillRect(px + TILE_SIZE - 2, py + 2, 2, 6); ctx.fillRect(px + TILE_SIZE - 2, py + 22, 2, 6); }
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
        // ART BATCH 2: AI-generated 16-bit landmark sprite (chroma-keyed PNG),
        // anchored bottom-center on the tile with slight overhang; code glyphs
        // remain as fallback while the image loads.
        const img = getLandmarkImg(entity.type);
        if (img) {
          const aspect = img.naturalHeight / img.naturalWidth;
          const dh = Math.min(LM_DRAW, Math.round(LM_DRAW * aspect));
          const dw = Math.round(dh / aspect);
          if (entity.type === "CHEST" && openedChestsRef.current.has(entity.id)) {
            // LOOTED: dimmed, desaturated, lid drawn open + dark interior.
            ctx.save();
            ctx.filter = "grayscale(0.8) brightness(0.55)";
            ctx.drawImage(img, ex + (TILE_SIZE - dw) / 2, ey + TILE_SIZE - dh + 3, dw, dh);
            ctx.restore();
            ctx.fillStyle = "rgba(10,8,4,0.75)";
            ctx.fillRect(ex + (TILE_SIZE - dw) / 2 + dw * 0.2, ey + TILE_SIZE - dh * 0.55 + 3, dw * 0.6, dh * 0.28);
          } else {
            ctx.drawImage(img, ex + (TILE_SIZE - dw) / 2, ey + TILE_SIZE - dh + 3, dw, dh);
          }
        } else if (entity.type === "SHRINE") {
          ctx.fillStyle = "rgba(245,158,11,0.25)";
          ctx.beginPath();
          ctx.arc(ex + 19, ey + 24, 20, 0, Math.PI * 2);
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
      const bob = walkFrame === 1 || walkFrame === 3 ? 1 : 0;
      const heroImg = getHeroImg(motion.facing);
      if (heroImg) {
        // ART BATCH 3: AI hero sprite, anchored bottom-center like landmarks
        const hs = 46; // draw size (slight overhang of the 38px tile)
        const aspect = heroImg.naturalHeight / heroImg.naturalWidth;
        const hh = Math.min(hs, Math.round(hs * aspect));
        const hw = Math.round(hh / aspect);
        ctx.drawImage(heroImg, motion.pos.x - cam.x - hw / 2, motion.pos.y - cam.y - hh + 6 - bob, hw, hh);
      } else {
        const heroScale = 2;
        const heroW = 16 * heroScale;
        const heroH = 20 * heroScale;
        blitGrid(
          ctx,
          HERO_D,
          BASE_PALETTE,
          px + (TILE_SIZE - heroW) / 2,
          py + (TILE_SIZE - heroH) - 2 - bob,
          heroScale,
          { tunic: tunic.main, hair, accent: "#f59e0b" }
        );
      }
      if (isSlashing) {
        // Sword swing: a rotating blade line + fading trail (reads as a sword,
        // not a bow). Sweep angle animates over the 240ms slash window.
        const t = Math.min(1, (performance.now() % 240) / 240);
        const baseAngle =
          motion.facing === "RIGHT" ? 0 : motion.facing === "DOWN" ? Math.PI / 2 :
          motion.facing === "LEFT" ? Math.PI : -Math.PI / 2;
        const sweep = (a: number) => baseAngle + (a - 0.5) * 1.9;
        const cx = motion.pos.x - cam.x, cy = motion.pos.y - cam.y - 4;
        const R = 26;
        for (let k = 0; k < 5; k++) {
          const a = sweep(t - k * 0.055);
          const alpha = 0.85 - k * 0.17;
          const x1 = cx + Math.cos(a) * (R - 14), y1 = cy + Math.sin(a) * (R - 14);
          const x2 = cx + Math.cos(a) * R, y2 = cy + Math.sin(a) * R;
          ctx.strokeStyle = k === 0 ? `rgba(240,249,255,${alpha})` : `rgba(56,189,248,${alpha * 0.7})`;
          ctx.lineWidth = k === 0 ? 4 : 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // NG+ corrupted wash over the VIEWPORT — Luna spec: capped atmosphere,
      // never a heavy darkening multiply.
      if (corrupted) {
        ctx.fillStyle = "rgba(20, 5, 35, 0.30)";
        ctx.fillRect(0, 0, VIEW_W_PX, VIEW_H_PX);
        const pulse = 0.08 + 0.05 * Math.sin(frame * 0.35);
        const vign = ctx.createRadialGradient(
          VIEW_W_PX / 2, VIEW_H_PX / 2, Math.min(VIEW_W_PX, VIEW_H_PX) * 0.25,
          VIEW_W_PX / 2, VIEW_H_PX / 2, Math.max(VIEW_W_PX, VIEW_H_PX) * 0.7,
        );
        vign.addColorStop(0, "rgba(0,0,0,0)");
        vign.addColorStop(1, `rgba(120, 0, 40, ${pulse.toFixed(3)})`);
        ctx.fillStyle = vign;
        ctx.fillRect(0, 0, VIEW_W_PX, VIEW_H_PX);
        ctx.fillStyle = "rgba(0,0,0,0.18)";
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
