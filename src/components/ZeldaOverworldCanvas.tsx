import React, { useRef, useEffect, useState, useCallback } from "react";
import { ZeldaMap, ZeldaEntity, ZELDA_MAPS } from '../lib/zeldaWorldData';
import { PlayerStats, AssetQuote, TunicColor, HairColor } from '../types';
import { sound } from '../lib/audioEngine';
import { blitGrid, BASE_PALETTE, HERO_D, TILE_GRASS16, TILE_DIRT16, TILE_WATER16, OAK } from '../lib/pixelArt';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Swords,
  Sparkles,
  MessageCircle,
  Save,
  User,
  Compass,
  Crown,
} from "lucide-react";

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
  onOpenCustomize?: () => void;
  onOpenSaveModal?: () => void;
  onOpenCustomizeModal?: () => void;
}

const TUNIC_COLORS: Record<
  TunicColor,
  { main: string; shadow: string; highlight: string }
> = {
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

export const ZeldaOverworldCanvas: React.FC<ZeldaOverworldCanvasProps> = ({
  act,
  player,
  asset,
  onMove,
  onInteractEntity,
  onSwordSlash,
  onOpenSave,
  onOpenCustomize,
  onOpenSaveModal,
  onOpenCustomizeModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mapData: ZeldaMap = ZELDA_MAPS[act] || ZELDA_MAPS[1];
  const [nearbyEntity, setNearbyEntity] = useState<ZeldaEntity | null>(null);
  const [isSlashing, setIsSlashing] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);
  const [animTick, setAnimTick] = useState(0);
  const TILE_SIZE = 38;
  const width = mapData.width * TILE_SIZE;
  const height = mapData.height * TILE_SIZE;

  const openSave = onOpenSave || onOpenSaveModal;
  const openCustom = onOpenCustomize || onOpenCustomizeModal;

  useEffect(() => {
    let id: number;
    const loop = () => {
      setAnimTick((t) => (t + 1) % 1000);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const isSolid = useCallback(
    (x: number, y: number): boolean => {
      if (x < 0 || x >= mapData.width || y < 0 || y >= mapData.height)
        return true;
      const tile = mapData.tiles[y]?.[x];
      if (!tile) return true;
      if (tile === "T" || tile === "#") return true;
      if (tile === "~") return true;
      return false;
    },
    [mapData],
  );

  useEffect(() => {
    const found = mapData.entities.find(
      (e) => Math.abs(e.x - player.mapX) + Math.abs(e.y - player.mapY) <= 1.2,
    );
    setNearbyEntity(found || null);
  }, [player.mapX, player.mapY, mapData.entities]);

  const handleStep = useCallback(
    (dx: number, dy: number, dir: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
      const tx = player.mapX + dx;
      const ty = player.mapY + dy;
      if (isSolid(tx, ty)) {
        sound.playAlarmSound();
        onMove(player.mapX, player.mapY, dir);
        return;
      }
      sound.playKeyClick();
      setWalkFrame((p) => (p + 1) % 4);
      onMove(tx, ty, dir);
    },
    [player.mapX, player.mapY, isSolid, onMove],
  );

  const triggerSlash = useCallback(() => {
    sound.playSwordSlash();
    setIsSlashing(true);
    onSwordSlash();
    setTimeout(() => setIsSlashing(false), 240);
    if (
      nearbyEntity &&
      (nearbyEntity.type === "BOSS" || nearbyEntity.type === "NPC_SCAMMER")
    )
      onInteractEntity(nearbyEntity);
  }, [nearbyEntity, onInteractEntity, onSwordSlash]);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement)?.tagName,
        )
      )
        return;
      if (["ArrowUp", "KeyW"].includes(e.code)) {
        e.preventDefault();
        handleStep(0, -1, "UP");
      } else if (["ArrowDown", "KeyS"].includes(e.code)) {
        e.preventDefault();
        handleStep(0, 1, "DOWN");
      } else if (["ArrowLeft", "KeyA"].includes(e.code)) {
        e.preventDefault();
        handleStep(-1, 0, "LEFT");
      } else if (["ArrowRight", "KeyD"].includes(e.code)) {
        e.preventDefault();
        handleStep(1, 0, "RIGHT");
      } else if (["Space", "KeyE", "Enter"].includes(e.code)) {
        e.preventDefault();
        if (nearbyEntity) onInteractEntity(nearbyEntity);
        else triggerSlash();
      } else if (["KeyJ", "KeyZ"].includes(e.code)) {
        e.preventDefault();
        triggerSlash();
      }
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  }, [handleStep, nearbyEntity, onInteractEntity, triggerSlash]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#060a12";
    ctx.fillRect(0, 0, width, height);
    const fairySparkOffset = (animTick * 0.8) % 30;

    for (let y = 0; y < mapData.height; y++) {
      for (let x = 0; x < mapData.width; x++) {
        const tile = mapData.tiles[y]?.[x] || ".";
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;
        if (tile === ".") {
          // B-spec: 16x16 native grass tile (3 shades + speck + tuft), crisp.
          blitGrid(ctx, TILE_GRASS16, BASE_PALETTE, px, py, 2);
        } else if (tile === "F") {
          ctx.fillStyle = "#2d6a2f";
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = "#4ade80";
          ctx.fillRect(px + 17, py + 16, 4, 10);
          const flowerColor = (x + y) % 2 === 0 ? "#fde047" : "#f43f5e";
          ctx.fillStyle = flowerColor;
          ctx.fillRect(px + 14, py + 12, 10, 10);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(px + 17, py + 15, 4, 4);
        } else if (tile === "P") {
          // B-spec: native dirt path tile with distinct edges.
          blitGrid(ctx, TILE_DIRT16, BASE_PALETTE, px, py, 2);
        } else if (tile === "T") {
          ctx.fillStyle = "#1a2e1a";
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          // B-spec: blocky oak (canopy + trunk + solid shadow plate beneath).
          blitGrid(ctx, OAK, BASE_PALETTE, px, py, 2);
        } else if (tile === "~") {
          // B-spec: native water tile with shine streaks.
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
          ctx.fillStyle = "#2d6a2f";
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
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

    mapData.entities.forEach((entity) => {
      const ex = entity.x * TILE_SIZE;
      const ey = entity.y * TILE_SIZE;
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
        ctx.fillStyle = "#7e22ce";
        ctx.fillRect(ex + 8, ey + 12, 22, 22);
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(ex + 10, ey + 8, 18, 6);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px monospace";
        ctx.fillText("PUT/CALL", ex + 8, ey + 26);
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
        ctx.fillStyle = "#ca8a04";
        ctx.fillRect(ex + 6, ey + 12, 26, 20);
        ctx.fillStyle = "#fef08a";
        ctx.font = "bold 10px monospace";
        ctx.fillText("VALUE", ex + 8, ey + 25);
      } else if (entity.type === "CHEST") {
        ctx.fillStyle = "#78350f";
        ctx.fillRect(ex + 8, ey + 14, 22, 18);
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(ex + 8, ey + 18, 22, 4);
        ctx.fillRect(ex + 17, ey + 20, 4, 5);
      } else if (entity.type === "BOSS") {
        ctx.fillStyle = "#991b1b";
        ctx.fillRect(ex + 4, ey + 6, 30, 28);
        ctx.fillStyle = "#fef2f2";
        ctx.font = "bold 12px monospace";
        ctx.fillText("BOSS", ex + 6, ey + 24);
      }
      ctx.fillStyle = "rgba(15,23,42,0.9)";
      ctx.fillRect(ex - 8, ey - 10, TILE_SIZE + 16, 14);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1;
      ctx.strokeRect(ex - 8, ey - 10, TILE_SIZE + 16, 14);
      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(entity.name.slice(0, 16), ex + TILE_SIZE / 2, ey);
      ctx.textAlign = "start";
    });

    const px = player.mapX * TILE_SIZE;
    const py = player.mapY * TILE_SIZE;
    const tunic = TUNIC_COLORS[player.avatar?.tunicColor || "green"];
    const hair = HAIR_COLORS[player.avatar?.hairColor || "blonde"];
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.ellipse(px + 19, py + 33, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5c381c";
    const isOdd = walkFrame % 2 === 1;
    if (isOdd) {
      ctx.fillRect(px + 12, py + 29, 6, 6);
      ctx.fillRect(px + 21, py + 27, 6, 6);
    } else {
      ctx.fillRect(px + 12, py + 27, 6, 6);
      ctx.fillRect(px + 21, py + 29, 6, 6);
    }
    ctx.fillStyle = tunic.main;
    ctx.fillRect(px + 11, py + 15, 16, 14);
    ctx.fillStyle = tunic.shadow;
    ctx.fillRect(px + 11, py + 23, 16, 6);
    ctx.fillStyle = "#78350f";
    ctx.fillRect(px + 11, py + 22, 16, 3);
    ctx.fillStyle = "#facc15";
    ctx.fillRect(px + 17, py + 22, 4, 3);
    ctx.fillStyle = "#ffedd5";
    ctx.fillRect(px + 13, py + 7, 12, 10);
    ctx.fillStyle = hair;
    ctx.fillRect(px + 11, py + 9, 3, 5);
    ctx.fillRect(px + 24, py + 9, 3, 5);
    if (player.facing === "DOWN") {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(px + 15, py + 11, 2, 3);
      ctx.fillRect(px + 21, py + 11, 2, 3);
    } else if (player.facing === "LEFT") {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(px + 13, py + 11, 2, 3);
    } else if (player.facing === "RIGHT") {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(px + 23, py + 11, 2, 3);
    }
    ctx.fillStyle = tunic.main;
    if (player.facing === "UP") {
      ctx.fillRect(px + 11, py + 3, 16, 7);
      ctx.fillStyle = tunic.highlight;
      ctx.fillRect(px + 15, py - 1, 8, 5);
    } else if (player.facing === "DOWN") {
      ctx.fillRect(px + 11, py + 3, 16, 6);
      ctx.fillStyle = tunic.highlight;
      ctx.fillRect(px + 14, py + 1, 10, 3);
    } else if (player.facing === "LEFT") {
      ctx.fillRect(px + 9, py + 3, 16, 6);
      ctx.fillRect(px + 6, py + 5, 5, 7);
    } else {
      ctx.fillRect(px + 13, py + 3, 16, 6);
      ctx.fillRect(px + 27, py + 5, 5, 7);
    }
    const shieldStyle = player.avatar?.shieldStyle || "hylian";
    if (shieldStyle === "wooden") {
      ctx.fillStyle = "#92400e";
      ctx.fillRect(px + 6, py + 15, 6, 12);
    } else if (shieldStyle === "mirror") {
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(px + 6, py + 15, 6, 12);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(px + 7, py + 18, 4, 6);
    } else {
      ctx.fillStyle = "#1d4ed8";
      ctx.fillRect(px + 6, py + 15, 6, 12);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(px + 7, py + 19, 4, 4);
    }
    if (isSlashing) {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      if (player.facing === "RIGHT")
        ctx.arc(px + 26, py + 18, 20, -Math.PI / 3, Math.PI / 3);
      else if (player.facing === "LEFT")
        ctx.arc(px + 12, py + 18, 20, (2 * Math.PI) / 3, (4 * Math.PI) / 3);
      else if (player.facing === "UP")
        ctx.arc(px + 19, py + 10, 20, -Math.PI, 0);
      else ctx.arc(px + 19, py + 28, 20, 0, Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(px + 26, py + 14, 3, 11);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(px + 25, py + 12, 5, 3);
    }

    // SNES pixel-art hero: blit the hand-authored 16x20 sprite over the
    // flat fallback, scaled to ~2 so it reads as crisp pixel-art with a
    // bold dark outline, tunic + hair + accent colored from the avatar.
    const heroScale = 2;
    const heroW = 16 * heroScale; // 32
    const heroH = 20 * heroScale; // 40
    blitGrid(
      ctx,
      HERO_D,
      BASE_PALETTE,
      px + (TILE_SIZE - heroW) / 2,
      py + (TILE_SIZE - heroH) - 2,
      heroScale,
      { tunic: tunic.main, hair, accent: '#f59e0b' }
    );
    ctx.fillStyle = "rgba(15,23,42,0.85)";
    ctx.fillRect(px - 6, py - 14, TILE_SIZE + 12, 13);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1;
    ctx.strokeRect(px - 6, py - 14, TILE_SIZE + 12, 13);
    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(player.name, px + TILE_SIZE / 2, py - 4);
    ctx.textAlign = "start";
  }, [
    act,
    mapData,
    player.mapX,
    player.mapY,
    player.facing,
    player.avatar,
    player.name,
    isSlashing,
    walkFrame,
    animTick,
    width,
    height,
  ]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-start justify-center">
      <div className="zelda-panel p-3 rounded-xl relative max-w-full border-amber-500/30">
        <div className="flex items-center justify-between border-b-2 border-amber-500/30 pb-2 mb-2 text-xs">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="font-cinzel text-amber-300 text-xs">
              ACT {mapData.act}: {mapData.name} • {asset.symbol}{" "}
              {asset.spotPrice.toFixed(2)}ƒ IV {(asset.iv * 100).toFixed(0)}%{" "}
              {asset.trend}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 border rounded ${player.currentPath === "TRADER" ? "path-trader border-red-500 text-red-300" : player.currentPath === "INVESTOR" ? "path-investor border-green-500 text-green-300" : player.currentPath === "HYBRID" ? "path-hybrid border-sky-500 text-sky-300" : "bg-slate-800 border-slate-600 text-slate-400"}`}
            >
              {player.currentPath}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-900 px-2 py-0.5 border border-amber-500/30 rounded text-slate-300">
              X:{player.mapX} Y:{player.mapY} • Bond Lv{" "}
              {player.oracleBondLevel?.toFixed(1)}/5
            </span>
          </div>
        </div>
        <div className="overflow-x-auto select-none rounded-xl border-2 border-amber-500/60 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="block max-w-full h-auto cursor-pointer"
            onClick={triggerSlash}
            title="Click to Swing Master Sword"
          />
        </div>
        {nearbyEntity && (
          <div className="absolute bottom-5 left-5 right-5 bg-slate-950/95 border-2 border-amber-400 p-2.5 text-amber-300 text-xs flex items-center justify-between shadow-2xl rounded-xl">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <span className="font-bold uppercase">
                {nearbyEntity.interactPrompt}
              </span>
            </div>
            <button
              onClick={() => onInteractEntity(nearbyEntity)}
              className="snes-btn-primary px-3.5 py-1.5 text-xs rounded-lg"
            >
              [E / SPACE TO ACT]
            </button>
          </div>
        )}
      </div>

      <div className="zelda-panel p-4 flex flex-col items-center gap-3 w-full lg:w-72 rounded-xl">
        <div className="font-cinzel text-amber-300 text-[11px] border-b border-amber-500/30 pb-1.5 w-full text-center">
          HYLIAN CONTROLS • SNES D-PAD
        </div>
        <div className="grid grid-cols-3 gap-1.5 w-36 h-36">
          <div />
          <button
            onClick={() => handleStep(0, -1, "UP")}
            className="snes-btn flex items-center justify-center p-2 rounded-lg active:scale-95"
          >
            <ArrowUp className="w-5 h-5 text-amber-300" />
          </button>
          <div />
          <button
            onClick={() => handleStep(-1, 0, "LEFT")}
            className="snes-btn flex items-center justify-center p-2 rounded-lg active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-amber-300" />
          </button>
          <div className="border border-amber-500/20 bg-slate-950 flex items-center justify-center text-[10px] text-amber-400/60 font-bold rounded-lg">
            D-PAD
          </div>
          <button
            onClick={() => handleStep(1, 0, "RIGHT")}
            className="snes-btn flex items-center justify-center p-2 rounded-lg active:scale-95"
          >
            <ArrowRight className="w-5 h-5 text-amber-300" />
          </button>
          <div />
          <button
            onClick={() => handleStep(0, 1, "DOWN")}
            className="snes-btn flex items-center justify-center p-2 rounded-lg active:scale-95"
          >
            <ArrowDown className="w-5 h-5 text-amber-300" />
          </button>
          <div />
        </div>
        <div className="w-full space-y-2 pt-1 border-t border-amber-500/20">
          <button
            onClick={triggerSlash}
            className="snes-btn-primary w-full py-2.5 px-3 text-xs rounded-xl flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4" />
            [SPACE] Master Sword
          </button>
          {nearbyEntity ? (
            <button
              onClick={() => onInteractEntity(nearbyEntity)}
              className="snes-btn w-full py-2 px-3 text-xs rounded-xl flex items-center justify-center gap-1.5 border-emerald-500/50"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              [E] Interact {nearbyEntity.name.slice(0, 18)}
            </button>
          ) : (
            <div className="text-[11px] text-slate-500 text-center py-1">
              Walk near NPCs/Shrines. Fail→Learn loop active.
            </div>
          )}
        </div>
        <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-amber-500/20">
          {openSave && (
            <button
              onClick={openSave}
              className="snes-btn py-1.5 px-2 text-xs rounded-lg flex items-center justify-center gap-1"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              Save
            </button>
          )}
          {openCustom && (
            <button
              onClick={openCustom}
              className="snes-btn py-1.5 px-2 text-xs rounded-lg flex items-center justify-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              Hero
            </button>
          )}
        </div>
        <div className="w-full text-[11px] text-slate-500 bg-slate-900/60 border border-slate-700 rounded-lg p-2">
          <div className="font-bold text-amber-200/70">Oracle Sight</div>
          <div>
            {asset.name}: {asset.lore.slice(0, 120)}...
          </div>
          <div className="mt-1">
            Path {player.currentPath} • Bond{" "}
            {player.oracleBondLevel?.toFixed(1)}/5 • Protections{" "}
            {player.grahamProtections.length} • Kelly{" "}
            {player.positionSizeDiscipline}/100
          </div>
        </div>
      </div>
    </div>
  );
};
