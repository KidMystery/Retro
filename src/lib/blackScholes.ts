/**
 * Exact Black-Scholes-Merton Options Pricing and Greeks Engine
 */

export interface Greeks {
  price: number;
  delta: number;
  gamma: number;
  theta: number; // daily theta in florins ($)
  vega: number;  // per 1% change in IV
  rho: number;
}

// Approximation of Cumulative Standard Normal Distribution (Abramowitz & Stegun)
export function cdfNormal(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2.0);

  const t = 1.0 / (1.0 + p * absX);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * erf);
}

// Probability Density Function of standard normal distribution
export function pdfNormal(x: number): number {
  return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

/**
 * Calculate Black-Scholes Price and Greeks
 * @param S Current Spot Price of the underlying asset
 * @param K Strike Price
 * @param dte Days to Expiration (minimum 0.01)
 * @param iv Implied Volatility (e.g. 0.35 for 35%)
 * @param r Risk-Free Interest Rate (default 0.05)
 * @param isCall True for Call, False for Put
 */
export function calculateBlackScholes(
  S: number,
  K: number,
  dte: number,
  iv: number,
  r = 0.05,
  isCall = true
): Greeks {
  // Prevent division by zero
  const safeDte = Math.max(0.01, dte);
  const T = safeDte / 365.0;
  const safeIv = Math.max(0.01, iv);
  const safeS = Math.max(0.01, S);
  const safeK = Math.max(0.01, K);

  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(safeS / safeK) + (r + 0.5 * safeIv * safeIv) * T) / (safeIv * sqrtT);
  const d2 = d1 - safeIv * sqrtT;

  const nd1 = cdfNormal(d1);
  const nd2 = cdfNormal(d2);
  const nPrimeD1 = pdfNormal(d1);
  const discountFactor = Math.exp(-r * T);

  let price = 0;
  let delta = 0;
  let theta = 0;
  let rho = 0;

  if (isCall) {
    price = safeS * nd1 - safeK * discountFactor * nd2;
    delta = nd1;
    // Annual theta, convert to per calendar day
    const annualTheta = -(safeS * nPrimeD1 * safeIv) / (2 * sqrtT) - r * safeK * discountFactor * nd2;
    theta = annualTheta / 365.0;
    rho = (safeK * T * discountFactor * nd2) / 100.0;
  } else {
    const nMinusD1 = cdfNormal(-d1);
    const nMinusD2 = cdfNormal(-d2);
    price = safeK * discountFactor * nMinusD2 - safeS * nMinusD1;
    delta = nd1 - 1.0;
    const annualTheta = -(safeS * nPrimeD1 * safeIv) / (2 * sqrtT) + r * safeK * discountFactor * nMinusD2;
    theta = annualTheta / 365.0;
    rho = (-safeK * T * discountFactor * nMinusD2) / 100.0;
  }

  // Gamma is identical for calls and puts
  const gamma = nPrimeD1 / (safeS * safeIv * sqrtT);
  // Vega is identical for calls and puts (per 1% IV change)
  const vega = (safeS * sqrtT * nPrimeD1) / 100.0;

  return {
    price: Math.max(0.01, Number(price.toFixed(2))),
    delta: Number(delta.toFixed(3)),
    gamma: Number(gamma.toFixed(4)),
    theta: Number(theta.toFixed(3)),
    vega: Number(vega.toFixed(3)),
    rho: Number(rho.toFixed(3))
  };
}

/**
 * Calculates Payoff at Expiration for a position or multi-leg strategy
 */
export function calculateExpirationPayoff(
  legs: Array<{ type: 'CALL' | 'PUT'; strike: number; premium: number; quantity: number }>,
  spotPrices: number[]
): Array<{ spot: number; pnl: number }> {
  return spotPrices.map((spot) => {
    let totalPnl = 0;
    for (const leg of legs) {
      let intrinsic = 0;
      if (leg.type === 'CALL') {
        intrinsic = Math.max(0, spot - leg.strike);
      } else {
        intrinsic = Math.max(0, leg.strike - spot);
      }
      // P&L = (Payout at expiry - Premium paid) * Quantity * 100 (standard options contract multiplier)
      const legPnl = (intrinsic - leg.premium) * leg.quantity * 100;
      totalPnl += legPnl;
    }
    return { spot, pnl: Math.round(totalPnl) };
  });
}

/**
 * Generate Oracle Sight ASCII Payoff Chart - SNES dark-stone-amber divination
 */
export function generateAsciiPayoffChart(
  legs: Array<{ type: 'CALL' | 'PUT'; strike: number; premium: number; quantity: number }>,
  currentSpot: number
): string {
  if (legs.length === 0) {
    return '[ NO ACTIVE POSITIONS TO CHART ]';
  }

  // Range from 80% to 120% of current spot
  const minSpot = Math.round(currentSpot * 0.82);
  const maxSpot = Math.round(currentSpot * 1.18);
  const step = Math.max(1, Math.round((maxSpot - minSpot) / 18));
  
  const spots: number[] = [];
  for (let s = minSpot; s <= maxSpot; s += step) {
    spots.push(s);
  }

  const payoffs = calculateExpirationPayoff(legs, spots);
  const pnls = payoffs.map(p => p.pnl);
  const maxPnl = Math.max(...pnls, 50);
  const minPnl = Math.min(...pnls, -50);
  const range = maxPnl - minPnl || 1;

  const rows = 9; // Height of chart in rows
  const lines: string[] = [];

  lines.push(` ╔══════════════════ EXPIRY PAYOFF PROFILE • ORACLE SIGHT • DIVINATION LENS ══════════════════╗`);
  lines.push(` ║ P&L (Florins)      Spot Range: ${minSpot} to ${maxSpot} | Underlying: ${currentSpot} ║`);
  lines.push(` ╟─────────────────────────────────────────────────────────────────────╢`);

  for (let r = rows; r >= 0; r--) {
    const valAtRow = minPnl + (r / rows) * range;
    const isZeroRow = Math.abs(valAtRow) < range / (rows * 2);
    const label = `${valAtRow >= 0 ? '+' : ''}${Math.round(valAtRow)}`.padStart(6, ' ');

    let charRow = isZeroRow ? '─' : ' ';
    let rowChars = '';

    for (let c = 0; c < payoffs.length; c++) {
      const pnl = payoffs[c].pnl;
      // Find normalized bucket
      const normalized = Math.round(((pnl - minPnl) / range) * rows);
      if (normalized === r) {
        rowChars += pnl >= 0 ? '█' : '▒';
      } else if (isZeroRow) {
        rowChars += '─';
      } else {
        rowChars += ' ';
      }
    }

    lines.push(` ║ ${label} │ ${rowChars.padEnd(52, isZeroRow ? '─' : ' ')} ║`);
  }

  lines.push(` ╟───────┴─────────────────────────────────────────────────────────────╢`);
  const spotLabels = `${minSpot}`.padEnd(16) + `${Math.round(currentSpot)} [SPOT]`.padEnd(20) + `${maxSpot}`.padStart(16);
  lines.push(` ║ Spot:   ${spotLabels} ║`);
  lines.push(` ╚═════════════════════════════════════════════════════════════════════╝`);

  return lines.join('\n');
}
