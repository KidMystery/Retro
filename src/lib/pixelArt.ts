// pixelArt.ts — SNES-style pixel-bitmap sprites + renderer for Valuaria.
// Sprites are defined as grids of color-key characters at native resolution
// (16px wide), then drawn to an ImageData buffer and upscaled with hard
// edges. This replaces the vector fillRect/arc approach that read as
// "Commodore 64". Access LOOKUP gives the actual hex per key so tunic/hair
// recoloring still works.

export type Palette = Record<string, string>;

export const BASE_PALETTE: Palette = {
  k: '#173B2B', // outline (Luna spec: deep occlusion, no pure black)
  s: '#2E7D3F', // shadow
  g: '#49A94B', // grass mid (Luna base)
  G: '#78C850', // grass light (Luna highlight)
  d: '#2E7D3F', // grass dark
  t: '#8B5A3C', // trunk (Luna wood)
  t2: '#5d3a26', // trunk dark
  l: '#2E7D3F', // leaf dark
  L: '#4CAF5E', // leaf mid
  H: '#78C850', // leaf light
  w: '#2F86C0', // water (Luna-bright)
  W: '#3F9ED0', // water light (Luna)
  w2: '#bae6fd', // wave
  P: '#C19A5B', // path (Luna dirt)
  p: '#D4B276', // path light
  pt: '#8B6B44', // path dark
  D: '#8B5A3C', // dirt edge
  F: '#6b9a4e', // ledge face fill (bright desaturated grass)
  ' ': '',       // transparent
};

// HERO — 16 wide x 20 tall, facing DOWN (idle). Tunic/hair recolorable via
// T / H keys below (the renderer maps these to player.chosen tunic/hair).
export const HERO_D: string[] = [
  '     kkkkkkk      ',
  '    kkkHkkkkk     ',
  '    kHHHHHHHk     ',
  '    kHHHHHHHk     ',
  '     kHHHHHk      ',
  '     kTTTTTk      ',
  '    kTATTTTAk     ',
  '   kkATTTTTTAk    ',
  '   kkTTTTTTTTk    ',
  '   kkTTTTTTTTk    ',
  '   kTTssssssTT    ',
  '   kTssssssssT    ',
  '   kTTssssssTT    ',
  '   kkTTTTTTTkk    ',
  '   kkTTTTTTTkk    ',
  '   kTssssssssTk   ',
  '   kTssssssssTk   ',
  '  kkTssssssssTkk  ',
  '  kkkssssssssskk  ',
  '  kkkssssssssskk  ',
];

// The color keys used for tunic (T) and hair (H) are placeholders; the
// renderer substitutes the player's actual tunic/hair hex from the palette.
// 'A' = tunic accent (belt/buckle), 's' = shadow shade of tunic.

// GRASS TILE dither variants (8x8 cell, tiled): key-based so we can vary.
export const TILE_GRASS: string[] = [
  'ggddddgg',
  'gGGdgdgd',
  'GgGdgddd',
  'gdGdgdGg',
  'ggdggGgd',
  'Gdgddgdg',
  'gdGgdggd',
  'ddggdGdd',
];

export const TILE_PATH: string[] = [
  'PPppPPPP',
  'PpppPPpP',
  'pPPpPpPp',
  'PppPpPPp',
  'pPpPPpPp',
  'PpppPPPP',
  'pPPPpPpP',
  'PpPpPPpP',
];

export const TILE_WATER: string[] = [
  'wwwwwwww',
  'wWWwwwww',
  'wwwWwwww',
  'wwwwwwWw',
  'wWwwwwWw',
  'wwWwwwww',
  'wwwwWwww',
  'Wwwwwwww',
];

// TREE — 16x20 native (an ALttP-style round canopy with a dark outline).
export const TREE: string[] = [
  '      kkLLk      ',
  '    kkLLLLLkk    ',
  '   kLLLLLLLLk    ',
  '  kkLLLLLLLLkk   ',
  '  kHLLLkkLLLHL   ',
  '  kLLLkHHkLLLk   ',
  ' kLHLHkHHkLHLHk  ',
  ' kLLLkkLLkkLLLk  ',
  ' kLLkLLLLLLkLLk  ',
  ' kLkLLLLLLLLkLk  ',
  ' kkLLLLLLLLLLkk  ',
  '  kkLLLLLLLkkk   ',
  '    kkkkkkkkk    ',
  '    ktttttkkk    ',
  '    ktttttttk    ',
  '    kttttttttk   ',
  '     kttttttk    ',
  '     kttttttk    ',
  '      kttttk     ',
  '      kkkkkk     ',
];

// ===== 16x16 NATIVE TILE SET (B-spec: small grid, per-tile detail) =====
// Each pattern is 16 rows x 16 cols of palette keys. Drawn with the
// 2px-per-native-pixel scale so a 38px tile renders as 16px art upscaled.

// Grass: 3 shades + darker speck pixels + a couple tuft blades.
export const TILE_GRASS16: string[] = [
  'ggggGGgggggggggg',
  'gGGgddGgggdggggg',
  'gggggGggggdggdgg',
  'dggggggggggggGgg',
  'gGgddggggggdggGg',
  'gggggdGdgggggggg',
  'ggggggggggGgdggg',
  'gddggGgggggggdgg',
  'ggggGgggggggggGg',
  'ggggggdGggGgddgg',
  'Gdgggggggggggggg',
  'gggdgGggggddgggg',
  'gggggggggGgGgggg',
  'gGgddggdgggggggG',
  'ggggggggGggggggg',
  'gggGgGgdgggdgggg',
];

// Dirt path: tan base, darker edge pixels on top/left, lighter heart.
export const TILE_DIRT16: string[] = [
  'pppDpppppDpppppD',
  'ppDpppppDppppppp',
  'DppPpppDppPPpppp',
  'pppPppppppPpppDp',
  'ppppPpDppppPPppp',
  'ppppPpppppPppppp',
  'DpppPPppppppPppp',
  'ppPpppPppDpppPpp',
  'ppppPpppppppppDp',
  'pppPpppppPpppppp',
  'DpppppppPPPppppD',
  'ppppPppppppppppp',
  'ppppPpppppPppppp',
  'ppDpppppppppPppp',
  'ppppppPppppppppp',
  'pDppDpPpppDppppp',
];

// Water: base blue, lighter shine streaks, darker under-edge.
export const TILE_WATER16: string[] = [
  'wwwwwWwwwwwwWwww',
  'wwwwwwwwwwwwwwww',
  'wwWwwwwwwwwwwWww',
  'wwwwwwwwwwwwwwww',
  'wwwwwwWwwwwwwwww',
  'wWWwwwwwwwwWwwww',
  'wwwwWwwwwwwwwWww',
  'wwwwwwwwwwwwwwww',
  'wwwWwwwwwwwwwwww',
  'wwwwwwWwwwwwwwww',
  'wwwwWWwwwwwwwwWw',
  'wwwwwwwwwwwwwwww',
  'wWwwwwwwwwwwwwww',
  'wwwwwwwwWwwwWwww',
  'wwwwwwWwwwwwwwww',
  'wwwwwWwwwwwwwwww',
];

// faux-3D ledge FACE: darker, desaturated version of grass with a clear
// top edge — used BELOW a raised grass tile to fake elevation.
export const TILE_FACE16: string[] = [
  'dDDDDDDdDDDDDDDD',
  'FdFFdFFdFdFFFFdF',
  'dFddFdFddFdFdddd',
  'FdFdFFdFdFFFFdFd',
  'ddFddFdFddFdddFd',
  'FFFFdFFdFddFFdFF',
  'dFdFddFdFdFFFFdF',
  'FFFdFFdFdFFFFdFd',
  'dFdddFdFddFdFdFd',
  'FFFFFdFdFdFdFFdF',
  'ddFddFdFddFdddFd',
  'FdFFFFdFdFdFFFdF',
  'dFddFFdFddFdFdFd',
  'FFdFdFdFdFFFdFdF',
  'ddFddFdFddFdFFdF',
  'FFFFFdFdFdFFFFdF',
];

// Blocky oak (2x2 canopy + trunk and a solid dark base shadow) per B-spec:
// objects composed of tile blocks, solid shadow directly beneath.
export const OAK: string[] = [
  '  kkLLLLLLLkk   ',
  ' kLLLLLLLLLLLk  ',
  ' kLLLHLLLLLLLk  ',
  'kLLLLLLLLLLLHk  ',
  'kLLLkLLLLkLLLk  ',
  'kLLkLLLkkLLkLLk ',
  'kLkLLLLLLLLkLk  ',
  'kLLkLLkkLLkLLk  ',
  'kLLLLLLkLLLLLk  ',
  ' kkLLLLLLLLkk   ',
  '   kkkkkkkkk    ',
  '      kktt      ',
  '     kktttt     ',
  '     kktttt     ',
  '     kkkkkk     ',
  '    kkkkksk     ',
];

// solid dark shadow plate (the B-spec blocky shadow under objects)
export const SHADOW_PLATE: string[] = [
  '   sssssssss    ',
  '  sssssssssss   ',
  '  sssssssssss   ',
  ' sssssssssssss  ',
];

export interface Sprite {
  rows: string[];
  palette: Palette;
}

// Build an ImageData (native resolution) from a key-grid, substituting
// tunic/hair/accent colors.
export function gridToImageData(
  rows: string[],
  palette: Palette,
  opts?: { tunic?: string; hair?: string; accent?: string }
): ImageData {
  const R = rows.length;
  const C = Math.max(...rows.map((r) => r.length));
  const img = new ImageData(C, R);
  const tunic = opts?.tunic;
  const hair = opts?.hair;
  const accent = opts?.accent;
  for (let yy = 0; yy < R; yy++) {
    const row = rows[yy];
    for (let xx = 0; xx < C; xx++) {
      const key = row[xx] ?? ' ';
      let hex = palette[key] ?? '';
      if (key === 'T' && tunic) hex = tunic;
      else if (key === 'A' && accent) hex = accent;
      else if (key === 'H' && hair) hex = hair;
      if (!hex) continue; // transparent
      const idx = (yy * C + xx) * 4;
      img.data[idx] = parseInt(hex.slice(1, 3), 16);
      img.data[idx + 1] = parseInt(hex.slice(3, 5), 16);
      img.data[idx + 2] = parseInt(hex.slice(5, 7), 16);
      img.data[idx + 3] = 255;
    }
  }
  return img;
}

// Draw a sprite grid onto a 2D context at (dx, dy) scaled by `scale`,
// nearest-neighbor (crisp pixel edges — the SNES look).
export function blitGrid(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  palette: Palette,
  dx: number,
  dy: number,
  scale: number,
  opts?: { tunic?: string; hair?: string; accent?: string }
): void {
  const R = rows.length;
  const C = Math.max(...rows.map((r) => r.length));
  const tunic = opts?.tunic;
  const hair = opts?.hair;
  const accent = opts?.accent;
  for (let yy = 0; yy < R; yy++) {
    const row = rows[yy];
    for (let xx = 0; xx < C; xx++) {
      const key = row[xx] ?? ' ';
      let hex = palette[key] ?? '';
      if (key === 'T' && tunic) hex = tunic;
      else if (key === 'A' && accent) hex = accent;
      else if (key === 'H' && hair) hex = hair;
      if (!hex) continue;
      ctx.fillStyle = hex;
      ctx.fillRect(dx + xx * scale, dy + yy * scale, scale, scale);
    }
  }
}