/**
 * VOLTRON F1 — Modal queue (one blocking modal at a time).
 * Pure priority resolver: given the active modal states, returns the single winner
 * that renders. Non-winners stay queued (their state persists — they render when
 * they reach the top). Priority ladder per docs/modal-queue-proposal.md.
 * Zero state rewiring: App keeps its states, only the RENDER is gated.
 */

export type ModalKey =
  | 'provingVault' | 'combat' | 'rugpull' | 'sanctuary' | 'story' | 'mechanicGate'
  | 'chart' | 'tradeEncounter' | 'undervalued' | 'grimoire' | 'tradeDesk'
  | 'ledger' | 'inventory' | 'quest' | 'save' | 'fanfare' | 'noise';

const PRIORITY: ModalKey[] = [
  'provingVault',   // endgame cutscene owns the screen
  'combat',         // halts everything
  'rugpull',        // scam lesson (same class as sanctuary)
  'sanctuary',      // protects save progress
  'story',          // Wren / story dialogue — immediate attention
  'mechanicGate',   // prevents broken state (z-70 legacy)
  'chart',          // locks input focus
  'tradeEncounter', // finalizes asset swaps (z-70 legacy)
  'undervalued',    // asset discovery
  'grimoire',       // codex quizzes
  'tradeDesk',      // negotiation surface
  'ledger',         // HISTORY / portfolio overlay
  'inventory',
  'quest',
  'save',
  'fanfare',        // decorative — ALWAYS defers
  'noise',          // background info — always defers
];

/** Returns the single highest-priority active modal key, or null if none active. */
export function resolveTopModal(active: Partial<Record<ModalKey, boolean | undefined | null>>): ModalKey | null {
  for (const key of PRIORITY) {
    if (active[key]) return key;
  }
  return null;
}
