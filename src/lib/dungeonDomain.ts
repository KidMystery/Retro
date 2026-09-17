import { ZELDA_MAPS } from './zeldaWorldData';

/**
 * VOLTRON M3 — Dungeon domain (extracted from App.tsx god-component, Phase 1).
 * Pure data + builders: per-act encounter coordinates, chart-room shrines, deep-floor
 * entities. App consumes via buildDungeonEncounters(); the layouts here are the single
 * source of truth for dungeon geography (Voltron M2's 45x22 floors live in zeldaWorldData).
 */

export interface DungeonEncounter {
  id: string;
  name: string;
  x: number;
  y: number;
  prompt: string;
}

export const ACT_COORDS: { [act: number]: Array<[number, number]> } = {
  1: [
    // M2 expanded floor (45x22, six rooms): sage / broker / scammers / asset / shrine / chest
    [3, 4], [19, 4], [33, 4], [34, 8], [21, 7], [4, 15], [7, 15], [19, 16],
  ],
  2: [
    [4, 1],   // sage
    [7, 2],   // broker
    [1, 9],   // scam: leverage lord (left chamber)
    [16, 9],  // scam: vol siren (right chamber — behind the gates)
    [17, 3],  // undervalued asset
    [2, 13],  // shrine
    [17, 13], // chest (right chamber — better loot past the gates)
    [17, 11], // boss sphinx
  ],
  3: [
    [2, 13],  // sage
    [9, 6],   // shrine (brazier court)
    [16, 1],  // broker
    [16, 13], // undervalued bridge
    [2, 9],   // scam: range gambler (static)
    [16, 9],  // chest
    [9, 13],  // boss crab
  ],
  4: [
    [1, 13],  // sage
    [17, 13], // broker
    [9, 11],  // scam: vol siren
    [1, 1],   // undervalued obsidian shrine
    [9, 3],   // shrine
    [17, 1],  // chest (deep dark = better loot)
    [9, 9],   // boss hydra (deepest chamber)
  ],
};

export const CHART_ROOM_COORDS: Array<[number, number]> = [[9, 5], [25, 4], [9, 16], [25, 16]];

export const FLOOR_ENTITIES: Record<number, DungeonEncounter[]> = {
  1: [
    { id: 'chest_ring_nw', name: 'Sealed Ring Chest — Vault of the Gate', x: 5.5, y: 4.5, prompt: 'Open the alcove chest [Gated Ring loot]' },
    { id: 'chest_ring_se', name: 'Sealed Ring Chest — Outer Ring East', x: 35.5, y: 16.5, prompt: 'Open the alcove chest [Gated Ring loot]' },
    { id: 'sage_ring', name: 'Echo of Ashfall — The Ring', x: 22.5, y: 11.5, prompt: 'Hear the Echo: defined risk is the gate key [spread legs to open]' },
  ],
  2: [
    { id: 'chest_vault', name: 'Vault Chest — The Last Reserve', x: 33.5, y: 8.5, prompt: 'Open the vault chest [deep loot]' },
    { id: 'shrine_vault', name: 'Vault Shrine — Ledger of the Deep', x: 12.5, y: 16.5, prompt: 'Rest at the deep shrine [save + bond]' },
    { id: 'boss_bear', name: 'The Tithe-Monger — Collector of the Harvest', x: 25.5, y: 12.5, prompt: 'Face the Tithe-Monger [Act I Boss — drawdown made flesh]' },
  ],
};

/** Base roster for an act's floor 0 (entities repositioned onto the act's maze). */
export function baseRosterForAct(act: number): DungeonEncounter[] {
  const mapData = ZELDA_MAPS[act] || ZELDA_MAPS[1];
  const coords = ACT_COORDS[act] || ACT_COORDS[1];
  return mapData.entities
    .filter(e => e.type !== 'PORTAL')
    .slice(0, coords.length)
    .map((e, i) => ({
      id: e.id,
      name: e.name,
      x: coords[i][0] + 0.5,
      y: coords[i][1] + 0.5,
      prompt: e.interactPrompt,
    }));
}
