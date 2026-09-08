// MILESTONE B — overworld motion: smooth real-time Zelda-style movement.
// Pure module (no React): position is PIXEL space; App state stays TILE space.
// The component interpolates between tiles and commits tile-accurate arrivals
// via onMove, so saves, encounters, and the debug harness keep working.

export interface Vec {
  x: number;
  y: number;
}

/** Pixel-space motion state for the hero. */
export interface PlayerMotion {
  /** Pixel position of the hero's tile-anchor (center of feet). */
  pos: Vec;
  facing: "UP" | "DOWN" | "LEFT" | "RIGHT";
  /** Monotonic walk-cycle clock (seconds walked); 0 when idle. */
  walkTick: number;
}

export const TILE_SIZE = 38;
export const VIEW_W_TILES = 12;
export const VIEW_H_TILES = 10;
export const VIEW_W_PX = VIEW_W_TILES * TILE_SIZE; // 456
export const VIEW_H_PX = VIEW_H_TILES * TILE_SIZE; // 380
/** Hero walking speed in pixels per second (~4 tiles/s). */
export const HERO_SPEED = 150;

export type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

export const DIR_VEC: Record<Dir, Vec> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const tileKey = (tx: number, ty: number): string => `${tx},${ty}`;

export const tileCenterPx = (tx: number, ty: number): Vec => ({
  x: tx * TILE_SIZE + TILE_SIZE / 2,
  y: ty * TILE_SIZE + TILE_SIZE / 2,
});

export const pxToTile = (p: Vec): Vec => ({
  x: Math.floor(p.x / TILE_SIZE),
  y: Math.floor(p.y / TILE_SIZE),
});

/** Camera top-left in pixels, centered on the hero, clamped to the world. */
export function cameraFor(pos: Vec, worldWpx: number, worldHpx: number): Vec {
  const cx = pos.x - VIEW_W_PX / 2;
  const cy = pos.y - VIEW_H_PX / 2;
  return {
    x: Math.max(0, Math.min(cx, Math.max(0, worldWpx - VIEW_W_PX))),
    y: Math.max(0, Math.min(cy, Math.max(0, worldHpx - VIEW_H_PX))),
  };
}

/** Advance motion toward `target` tile center by HERO_SPEED*dt. Returns true on arrival. */
export function advanceToward(
  motion: PlayerMotion,
  target: Vec,
  dt: number,
): boolean {
  const dx = target.x - motion.pos.x;
  const dy = target.y - motion.pos.y;
  const dist = Math.hypot(dx, dy);
  const step = HERO_SPEED * dt;
  if (dist <= step) {
    motion.pos = { ...target };
    return true;
  }
  motion.pos = {
    x: motion.pos.x + (dx / dist) * step,
    y: motion.pos.y + (dy / dist) * step,
  };
  return false;
}

/** First held direction (priority: last pressed wins — handled by caller order). */
export function firstHeld(held: Set<Dir>): Dir | null {
  for (const d of held) return d;
  return null;
}
