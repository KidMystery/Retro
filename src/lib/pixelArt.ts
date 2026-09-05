// pixelArt.ts — SNES-style pixel-bitmap sprites + renderer for Valuaria.
// Sprites are defined as grids of color-key characters at native resolution
// (16px wide), then drawn to an ImageData buffer and upscaled with hard
// edges. This replaces the vector fillRect/arc approach that read as
// "Commodore 64". Access LOOKUP gives the actual hex per key so tunic/hair
// recoloring still works.

export type Palette = Record<string, string>;

export const BASE_PALETTE: Palette = {
  k: '#0d0b16', // outline
  s: '#1a1a2e', // shadow
  g: '#2d7a36', // grass mid
  G: '#3c9a44', // grass light
  d: '#24571f', // grass dark
  t: '#5c381c', // trunk
  t2: '#3d2311', // trunk dark
  l: '#2f7d46', // leaf dark
  L: '#4aa85c', // leaf mid
  H: '#6cc47e', // leaf light
  w: '#096b9e', // water
  W: '#1e8fd1', // water light
  w2: '#bae6fd', // wave
  P: '#8a6b3f', // path
  p: '#a98a55', // path light
  pt: '#5a4630', // path dark
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