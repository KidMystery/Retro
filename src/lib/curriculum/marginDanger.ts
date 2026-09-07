// Margin-call danger system — utilization ladder + liquidation events.
// Ties to real Robinhood Gold margin math (~5% APR, compounding daily).

export interface MarginState {
  equity: number;
  marginUsed: number;
  maintenanceReq: number;
}

export function marginUtilization(s: MarginState): number {
  return s.maintenanceReq / (s.equity + s.maintenanceReq);
}

export interface MarginEvent {
  id: string;
  utilization: number;
  severity: 'watch' | 'warning' | 'danger' | 'liquidation';
  message: string;
  consequence: string;
  lesson: string;
}

export const MARGIN_EVENTS: MarginEvent[] = [
  {
    id: 'margin_ladder_40',
    utilization: 0.40,
    severity: 'watch',
    message: 'De-levered voluntarily at 40% utilization.',
    consequence: 'You kept the room margin gives you without ever owing the broker a decision.',
    lesson: 'This is the win condition: the best margin call is the one you never get. Paying down margin while you still control the timing costs a little return and saves the whole account.',
  },
  {
    id: 'margin_ladder_30',
    utilization: 0.30,
    severity: 'watch',
    message: 'Margin used for room, not for positions yet.',
    consequence: 'Borrowing capacity is open. Nothing is being paid on it yet.',
    lesson: 'Unused margin is optionality — free until touched. The danger starts the moment you draw it, because then the ~5% Gold rate starts compounding daily against you.',
  },
  {
    id: 'margin_ladder_50',
    utilization: 0.50,
    severity: 'warning',
    message: 'Interest is compounding daily — quiet until it isn\'t.',
    consequence: 'At 5% APR, $6,300 borrowed costs about $26/month. Your cost basis creeps up while you sleep.',
    lesson: 'Margin interest is invisible in the chart and unforgiving in the ledger: at 5%, every $6,300 drawn adds roughly $0.86/day. It never sleeps, never panics, and never pauses for a drawdown.',
  },
  {
    id: 'margin_ladder_65',
    utilization: 0.65,
    severity: 'danger',
    message: 'A single 12% down candle at 5x liquidates. You have no room for a bad day.',
    consequence: 'One red candle is now an existential event, not a dip to buy.',
    lesson: 'Leverage converts ordinary volatility into account-ending events. At 5x, a boring 12% move — crypto sees those weekly — wipes you. The market does not owe you a gentle path to your thesis playing out.',
  },
  {
    id: 'margin_ladder_80',
    utilization: 0.80,
    severity: 'danger',
    message: 'Forced de-risking zone: the broker starts selling YOUR safest holdings first.',
    consequence: 'Your blue chips get liquidated at the open while your junk rides, because the broker keeps whatever is easiest to settle.',
    lesson: 'You do not choose what gets sold in a margin call — liquidations take the liquid names first, which are usually your best assets. The quality of your portfolio is sacrificed to defend the broker\'s loan, not your future.',
  },
  {
    id: 'margin_ladder_92',
    utilization: 0.92,
    severity: 'liquidation',
    message: 'Cascade warning: your selling pushes price down, hitting OTHERS\' liquidation levels.',
    consequence: 'Every forced seller becomes fuel for the next forced seller. The spiral feeds itself.',
    lesson: 'Liquidation cascades are reflexive: forced selling prints lower prices, lower prices trip more liquidations. This is why leverage crashes are air pockets, not selloffs — and why you cannot assume a stop will fill where you placed it.',
  },
  {
    id: 'margin_ladder_100',
    utilization: 1.00,
    severity: 'liquidation',
    message: 'Liquidation: positions force-closed at the worst price.',
    consequence: 'Equity goes to zero. Recovery from zero needs infinite percent — there is no bounce-back trade from nothing.',
    lesson: 'At 100% utilization the broker closes you out at the moment of maximum panic, locking in the worst print of the cycle. From $0, a 100% gain leaves you at $0. Capital preservation is the only recovery math that works from the bottom.',
  },
  {
    id: 'margin_ladder_redeemed',
    utilization: 1.00,
    severity: 'watch',
    message: 'Redemption arc: margins survived, then retired.',
    consequence: 'The account is intact because de-levering happened on your schedule, not the broker\'s.',
    lesson: 'Survivable leverage is boring leverage: size positions so a 3-sigma candle still leaves you above maintenance. Then pay margin down into strength — the same discipline as taking profits, pointed at your own debt.',
  },
];

export function describeMarginDanger(util: number): MarginEvent | null {
  let best: MarginEvent | null = null;
  for (const e of MARGIN_EVENTS) {
    if (e.utilization <= util && (!best || best.utilization <= e.utilization)) {
      best = e;
    }
  }
  return best;
}
