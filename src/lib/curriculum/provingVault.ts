/**
 * provingVault.ts — the Seal of Discipline endgame (luna-pro memo).
 *
 * The Proving Vault: a scripted 60-day portfolio exam run through the same
 * day-advance mechanics (equity, peak, drawdown) with a deterministic price
 * series. Victory for the whole game requires 3 seals:
 *   SURVIVAL   — all five act bosses defeated (quest state)
 *   KNOWLEDGE  — every curriculum rune earned (grahamProtections vs total lessons)
 *   COMPETENCE — pass the Proving Vault: end equity >= start, max drawdown < 25%,
 *                zero liquidations.
 */

import { GRAHAM_CORE_LESSONS } from './grahamCore';
import { OLMSTEAD_TRACK_LESSONS } from './olmsteadTrack';
import { MCMILLAN_TRACK_LESSONS } from './mcmillanTrack';
import { CRYPTO_ARC_LESSONS } from './cryptoArc';

export const TOTAL_CURRICULUM_LESSONS =
  GRAHAM_CORE_LESSONS.length +
  OLMSTEAD_TRACK_LESSONS.length +
  MCMILLAN_TRACK_LESSONS.length +
  CRYPTO_ARC_LESSONS.length;

export type VaultPhase = 'BULL MELT-UP' | 'SIDEWAYS' | 'IV-CRUSH CRASH' | 'RECOVERY';

export function vaultPhaseForDay(day: number): VaultPhase {
  if (day <= 15) return 'BULL MELT-UP';
  if (day <= 30) return 'SIDEWAYS';
  if (day <= 40) return 'IV-CRUSH CRASH';
  return 'RECOVERY';
}

/** Deterministic daily market returns for the 60-day exam. */
export function buildProvingVaultSeries(): number[] {
  const series: number[] = [];
  for (let d = 1; d <= 60; d++) {
    if (d <= 15) {
      series.push(0.018); // bull melt-up: +1.8%/day
    } else if (d <= 30) {
      series.push(d % 2 === 0 ? 0.003 : -0.002); // sideways chop
    } else if (d <= 40) {
      series.push(-0.035); // IV-crush crash: -3.5%/day for 10 days
    } else {
      series.push(0.015); // recovery: +1.5%/day
    }
  }
  return series;
}

export interface ProvingVaultResult {
  startEquity: number;
  endEquity: number;
  maxDrawdownPct: number;
  liquidated: boolean;
  win: boolean;
  daysSurvived: number;
}

/** Win = end >= start AND maxDrawdown < 25% AND zero liquidations. */
export function gradeProvingVault(
  startEquity: number,
  endEquity: number,
  maxDrawdownPct: number,
  liquidated: boolean,
  daysSurvived: number
): ProvingVaultResult {
  const win = !liquidated && endEquity >= startEquity && maxDrawdownPct < 25;
  return { startEquity, endEquity, maxDrawdownPct, liquidated, win, daysSurvived };
}
