/**
 * dopamineBadges.ts — Valuaria milestone badge system.
 *
 * The dopamine ladder: florin milestones gated by drawdown discipline,
 * plus special non-florin discipline badges for player behavior.
 */

export interface Badge {
  id: string;
  label: string;
  florins: number; // equity threshold in florins (0 for discipline badges)
  description: string;
  requiresLowDrawdown?: number; // optional max drawdown % allowed to earn
  icon: string; // short emoji/glyph
}

export const BADGES: Badge[] = [
  // ── Florin ladder ─────────────────────────────────────────────
  {
    id: 'first-thousand-florin-stretch',
    label: 'First Thousand-Florin Stretch',
    florins: 10_000,
    description: 'Banked 10,000 florins. The first stretch of real wealth — do not get comfortable.',
    icon: '👑',
  },
  {
    id: 'quarter-century-club',
    label: 'Quarter Century Club',
    florins: 25_000,
    description: 'Reached 25,000 florins. A merchant of respectable standing in Valuaria.',
    icon: '🥈',
  },
  {
    id: 'half-century-mark',
    label: 'Half-Century Mark',
    florins: 50_000,
    description: 'Reached 50,000 florins. Your ledgers now command attention at the Exchange.',
    icon: '🥇',
  },
  {
    id: 'six-figures',
    label: 'Six Figures',
    florins: 100_000,
    description: 'Reached 100,000 florins with drawdown never worse than 35%. Earned, not gambled.',
    requiresLowDrawdown: 35,
    icon: '💎',
  },
  {
    id: 'quarter-million',
    label: 'Quarter Million',
    florins: 250_000,
    description: 'Reached 250,000 florins with drawdown never worse than 30%. Conviction, with a spine.',
    requiresLowDrawdown: 30,
    icon: '🏆',
  },
  {
    id: 'the-vault-tier',
    label: 'The Vault Tier',
    florins: 500_000,
    description: 'Reached 500,000 florins with drawdown never worse than 25%. You have a vault now. Use it.',
    requiresLowDrawdown: 25,
    icon: '🏰',
  },
  {
    id: 'myth-and-margin-legend',
    label: 'Myth & Margin: Legend',
    florins: 1_000_000,
    description: 'One million florins with drawdown never worse than 20%. Legends are not made by luck; this badge literally cannot be earned recklessly.',
    requiresLowDrawdown: 20,
    icon: '⚡',
  },
  // ── Special discipline badges (not florin-gated) ──────────────
  {
    id: 'iron-hands',
    label: 'Iron Hands',
    florins: 0,
    description: 'Held a losing position through a noise event without panic-selling. The hands do not shake.',
    icon: '🦾',
  },
  {
    id: 'red-market-survivor',
    label: 'The Red Market Survivor',
    florins: 0,
    description: 'Kept positive equity through a full crash phase. Others burned; you stood in the red and lived.',
    icon: '🩸',
  },
  {
    id: 'sanctuary-scholar',
    label: 'Sanctuary Scholar',
    florins: 0,
    description: 'Completed 5 sanctuary lessons. Knowledge compounds faster than capital.',
    icon: '📜',
  },
  {
    id: 'unprecedented',
    label: 'Unprecedented',
    florins: 0,
    description: 'Ten flawless trades in a row. Precision trading, no errors, no hesitation.',
    icon: '✨',
  },
];

export interface BadgeStreaks {
  flawlessTrades?: number;
  sanctuaryLessons?: number;
  heldThroughNoise?: boolean;
  survivedCrash?: boolean;
  [key: string]: unknown;
}

/**
 * Returns newly-earned badges given current stats.
 * Badges with requiresLowDrawdown are only earned if maxDrawdownPct <= the threshold.
 * Florin badges are earned when equity >= threshold. Discipline badges are
 * earned via the streaks/flags object, not florins.
 */
export function checkBadges(
  equity: number,
  maxDrawdownPct: number,
  held: string[],
  streaks: object
): Badge[] {
  const s = (streaks ?? {}) as BadgeStreaks;
  const earned: Badge[] = [];

  for (const badge of BADGES) {
    // Florin-gated ladder badges
    if (badge.florins > 0) {
      if (equity < badge.florins) continue;
      if (badge.requiresLowDrawdown !== undefined && maxDrawdownPct > badge.requiresLowDrawdown) {
        continue; // earned recklessly — not granted
      }
      earned.push(badge);
      continue;
    }

    // Special discipline badges (not florin-gated)
    switch (badge.id) {
      case 'iron-hands':
        if (s.heldThroughNoise === true) {
          earned.push(badge);
        }
        break;
      case 'red-market-survivor':
        if (s.survivedCrash === true && equity > 0) {
          earned.push(badge);
        }
        break;
      case 'sanctuary-scholar':
        if ((s.sanctuaryLessons ?? 0) >= 5) {
          earned.push(badge);
        }
        break;
      case 'unprecedented':
        if ((s.flawlessTrades ?? 0) >= 10) {
          earned.push(badge);
        }
        break;
    }
  }

  return earned;
}

/**
 * SNES-style fanfare text for a newly-earned badge.
 */
export function badgeFanfare(b: Badge): string {
  return `♪ ACHIEVEMENT UNLOCKED ♪  ${b.icon} ${b.label} — ${b.description} ♫`;
}
