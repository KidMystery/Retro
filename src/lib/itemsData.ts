/**
 * ITEM CHAIN — dispatch milestone 2.
 * Ten curriculum-themed items that map to real trading mechanics. Each drops
 * from its curriculum boss/act and gates or enhances an existing system.
 */
import { PlayerStats } from '../types';

export type ItemId =
  | 'stop_loss_talisman'
  | 'value_lens'
  | 'kelly_ledger'
  | 'shield_iron'
  | 'shield_collar'
  | 'leaps_telescope'
  | 'straddle_charm'
  | 'margin_boots'
  | 'greeks_compass'
  | 'stock_repair_kit'
  | 'seal_sigil';

export interface GameItem {
  id: ItemId;
  name: string;
  /** SNES-style pixel icon (emoji reads as a crisp sprite in the modal). */
  icon: string;
  lore: string;
  effect: string;
  cursed?: boolean;
  /** Curriculum source that drops it. */
  source: string;
}

export const ITEMS: Record<ItemId, GameItem> = {
  stop_loss_talisman: {
    id: 'stop_loss_talisman', name: 'Stop-Loss Talisman', icon: '🧿',
    lore: 'A ward etched with the first rule of the Graham sanctuary: know your exit before you enter.',
    effect: 'Auto-caps any single position loss at 15% — the excess is severed at the talisman\'s mark.',
    source: 'Act I boss — Grizzly Bear of Drawdowns (Graham lesson 1)',
  },
  value_lens: {
    id: 'value_lens', name: 'Value Lens', icon: '🔍',
    lore: 'Benjamin\'s ground glass. When held to the tape, price dissolves and only worth remains.',
    effect: 'Shows the intrinsic-value band on the Trade Desk.',
    source: 'Act I boss — Grizzly Bear of Drawdowns',
  },
  kelly_ledger: {
    id: 'kelly_ledger', name: 'Kelly Ledger', icon: '📏',
    lore: 'A ledger that measures not what you could bet, but what you should.',
    effect: 'Position-size cap meter: flags any opening larger than the 25% Kelly ceiling.',
    source: 'Act II boss — The Chrono-Sphinx',
  },
  shield_iron: {
    id: 'shield_iron', name: 'Iron Shield', icon: '🛡️',
    lore: 'Forged from covered-call premiums, quenched in patience.',
    effect: 'Unlocks COVERED CALL + MARRIED PUT guard actions in combat.',
    source: 'Act II boss — The Chrono-Sphinx',
  },
  shield_collar: {
    id: 'shield_collar', name: 'Collar Shield', icon: '⛓️',
    lore: 'Iron bands bound with put-leather and call-chain. Nothing escapes — up or down.',
    effect: 'Unlocks the COLLAR guard action in combat: full block, both directions.',
    source: 'Act IV boss — Hydra of Implied Vega',
  },
  leaps_telescope: {
    id: 'leaps_telescope', name: 'LEAPS Telescope', icon: '🔭',
    lore: 'Gaze past the next frost and the theta burn softens to starlight.',
    effect: 'Unlocks long-DTE positions (>45 days) on the Trade Desk.',
    source: 'Act III boss — Crab Golem of Sideways Range',
  },
  straddle_charm: {
    id: 'straddle_charm', name: 'Straddle Charm', icon: '🎭',
    lore: 'Two faces on one coin: it pays when the world moves, whichever way it moves.',
    effect: 'Unlocks straddles/strangles (LONG_STRADDLE rune) on the Trade Desk.',
    source: 'Act III boss — Crab Golem of Sideways Range',
  },
  margin_boots: {
    id: 'margin_boots', name: 'Margin Boots', icon: '🥾', cursed: true,
    lore: 'CURSED. They make you unnaturally fast — and every step deeper into the bog.',
    effect: 'CURSED: leverage forced ON (line drawn the moment you lace them) and liquidation hits for double hearts.',
    source: 'Act IV treasury chest (deep dark = cursed loot)',
  },
  greeks_compass: {
    id: 'greeks_compass', name: 'Greeks Compass', icon: '🧭',
    lore: 'Four needles: delta, gamma, theta, vega. It never points north — it points to exposure.',
    effect: 'HUD shows net delta / gamma / theta / vega at all times.',
    source: 'Act IV boss — Hydra of Implied Vega',
  },
  stock_repair_kit: {
    id: 'stock_repair_kit', name: 'Stock Repair Kit', icon: '🧰',
    lore: 'A canvas roll of ratios and rolls: the surgeon\'s answer to a stock that fell.',
    effect: 'Unlocks the STOCK REPAIR strategy on the Trade Desk — break even faster without new capital.',
    source: 'Act II+ broker reward (Olmstead ch16)',
  },
  seal_sigil: {
    id: 'seal_sigil', name: 'Seal Sigil', icon: '🔏',
    lore: 'The wax seal of the Discipline, pressed by the Oracle\'s own thumb. It opens the second cycle.',
    effect: 'The NG+ key — required to enter the Second Oracle regime.',
    source: 'Marduk Vex, final boss of Act V',
  },
};

/** Chapter (act) boss defeat -> items that boss drops. */
export const BOSS_DROPS: Record<number, ItemId[]> = {
  1: ['stop_loss_talisman', 'value_lens'],
  2: ['kelly_ledger', 'shield_iron', 'stock_repair_kit'],
  3: ['leaps_telescope', 'straddle_charm'],
  4: ['shield_collar', 'greeks_compass'],
  5: ['seal_sigil'],
};

export const hasItem = (player: Pick<PlayerStats, 'items'>, id: ItemId): boolean =>
  !!player.items?.includes(id);

/** Pure grant helper: returns a new items array (no duplicates). */
export const grantItems = (existing: string[] | undefined, ids: ItemId[]): string[] => {
  const set = new Set(existing || []);
  ids.forEach(i => set.add(i));
  return [...set];
};
