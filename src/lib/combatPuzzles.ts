import { CombatAttackPuzzle } from '../types';

export const COMBAT_ATTACK_PUZZLES: CombatAttackPuzzle[] = [
  // TIER 1 (Novice: 3-4 Hearts)
  {
    id: 'p1_bear_counter',
    difficultyTier: 1,
    prompt: 'The Bear raises a Bearish Avalanche! Spot is sinking from $100 toward $85. Which option contract gives you positive directional delta to strike back and protect your wealth?',
    context: 'Spot $AETH is plummeting. You must deploy protective options weaponry.',
    options: [
      {
        label: 'A',
        text: 'Buy Long Put (Strike $95) — Delta turns negative/protective, profiting from the drop',
        isCorrect: true,
        explanation: 'Long Puts increase in value as the underlying crashes, generating vital defense and counter-attack force!',
        damageBonus: 45
      },
      {
        label: 'B',
        text: 'Sell Naked Put (Strike $80) without collateral',
        isCorrect: false,
        explanation: 'Disastrous! Selling a naked put into a crashing market exposes you to catastrophic unbounded losses!',
        damageBonus: -15
      },
      {
        label: 'C',
        text: 'Buy Far Out-of-the-Money 0-DTE Call (Strike $130)',
        isCorrect: false,
        explanation: 'Futile! Out-of-the-money calls lose 100% of their value when the market drops.',
        damageBonus: 0
      }
    ]
  },
  {
    id: 'p1_call_surge',
    difficultyTier: 1,
    prompt: 'The beast is staggering! Bullish winds are gathering. To maximize leverage with strictly capped downside risk, which strike should your sword channel?',
    context: 'Spot is $100 and IV is moderate (25%).',
    options: [
      {
        label: 'A',
        text: 'Buy an At-The-Money Call (Strike $100, 30 DTE) with defined premium risk',
        isCorrect: true,
        explanation: 'At-the-money calls offer approximately 0.50 delta, capturing strong upside acceleration with maximum risk capped at the premium paid.',
        damageBonus: 50
      },
      {
        label: 'B',
        text: 'Borrow 50x margin to purchase 5,000 spot shares without stops',
        isCorrect: false,
        explanation: 'Excessive leverage turns a slight pullback into total margin annihilation.',
        damageBonus: -20
      },
      {
        label: 'C',
        text: 'Sell In-The-Money Calls naked',
        isCorrect: false,
        explanation: 'Naked short calls have infinite upside risk. If the bull run continues, you are ruined.',
        damageBonus: -10
      }
    ]
  },
  {
    id: 'p1_intrinsic_puzzle',
    difficultyTier: 1,
    prompt: 'Spot $AETH trades at $108. A Call Option with Strike $100 trades for $11.00. What is its Intrinsic Value?',
    context: 'Understanding real intrinsic value vs extrinsic speculative air.',
    options: [
      {
        label: 'A',
        text: '$8.00 intrinsic value ($108 spot - $100 strike). The remaining $3.00 is extrinsic time value.',
        isCorrect: true,
        explanation: 'Spot price above call strike is pure tangible intrinsic value that cannot decay with time!',
        damageBonus: 40
      },
      {
        label: 'B',
        text: '$11.00 is all intrinsic value; options have no extrinsic value.',
        isCorrect: false,
        explanation: 'Incorrect. Any premium above (Spot - Strike) is extrinsic time value that will evaporate at expiration.',
        damageBonus: 5
      },
      {
        label: 'C',
        text: '$0.00 intrinsic value because the contract has not expired yet.',
        isCorrect: false,
        explanation: 'Incorrect. In-the-money options possess real intrinsic value at all times.',
        damageBonus: 0
      }
    ]
  },

  // TIER 2 (Enterprising: 5-6 Hearts)
  {
    id: 'p2_theta_shield',
    difficultyTier: 2,
    prompt: 'The Chrono-Sphinx channels Temporal Acceleration! There are only 7 Days to Expiration and market movement is quiet. How do you construct your Shield of Theta?',
    context: 'Extrinsic value decays at an exponential rate in the final 14 days.',
    options: [
      {
        label: 'A',
        text: 'Deploy a Credit Spread / Covered Call to become a net seller of decaying extrinsic premium',
        isCorrect: true,
        explanation: 'When holding positive net Theta, the relentless passage of time puts gold into your pocket every sunset!',
        damageBonus: 65
      },
      {
        label: 'B',
        text: 'Buy short-dated out-of-the-money options and pray for a miracle',
        isCorrect: false,
        explanation: 'The Chrono-Sphinx feasts on buyers of short-dated OTM options as time decay wipes them out.',
        damageBonus: -20
      },
      {
        label: 'C',
        text: 'Hold cash in an inflationary unhedged vault',
        isCorrect: false,
        explanation: 'Passive inaction fails to counter the Sphinx\'s temporal vortex.',
        damageBonus: 10
      }
    ]
  },
  {
    id: 'p2_iv_crush_blade',
    difficultyTier: 2,
    prompt: 'The Hydra of Implied Vega is roaring! Implied Volatility is pumped to 80% right before the Realm Earnings announcement. How do you strike without succumbing to IV Crush?',
    context: 'Post-announcement volatility collapses violently regardless of stock direction.',
    options: [
      {
        label: 'A',
        text: 'Execute a Defined-Risk Vertical Spread (e.g. Bull Call Spread) where long vega is hedged by short vega',
        isCorrect: true,
        explanation: 'Vertical spreads neutralize most Vega exposure! The short leg protects you from the sudden post-earnings IV collapse.',
        damageBonus: 70
      },
      {
        label: 'B',
        text: 'Buy naked long options at 80% IV expecting volatility to double to 160%',
        isCorrect: false,
        explanation: 'IV Crush will destroy your contract value tomorrow morning even if the stock jumps in your favor!',
        damageBonus: -25
      },
      {
        label: 'C',
        text: 'Sell naked short straddles with unlimited risk',
        isCorrect: false,
        explanation: 'While IV crush helps short options, an unexpected 30% gap move on naked straddles will bankrupt you.',
        damageBonus: -30
      }
    ]
  },

  // TIER 3 (Master Oracle: 7+ Hearts)
  {
    id: 'p3_iron_condor_mastery',
    difficultyTier: 3,
    prompt: 'The Crab Golem locks the battlefield in a rigid Bollinger Band channel ($95 to $105). IV is elevated at 45%. What grand master spell extracts maximum capital while guaranteeing strictly defined risk?',
    context: 'Rangebound stagnation with elevated volatility calls for four-strike symmetry.',
    options: [
      {
        label: 'A',
        text: 'Cast an Iron Condor: Sell 95 Put / Buy 90 Put & Sell 105 Call / Buy 110 Call for upfront net credit',
        isCorrect: true,
        explanation: 'Supreme mastery! The outer wings cap all potential loss, while theta decay and volatility contraction pour maximum profit into your vault as long as spot remains between 95 and 105!',
        damageBonus: 95
      },
      {
        label: 'B',
        text: 'Buy a Long Straddle (Long 100 Call + Long 100 Put)',
        isCorrect: false,
        explanation: 'Long Straddles require explosive breakout movement to overcome dual theta decay. Inside a rangebound channel, you bleed from both cuts!',
        damageBonus: -20
      },
      {
        label: 'C',
        text: 'Sell naked 100 Calls with zero collateral or protective wings',
        isCorrect: false,
        explanation: 'Naked short options violate the Margin of Safety law and incur fatal liquidation risk.',
        damageBonus: -35
      }
    ]
  },
  {
    id: 'p3_delta_neutral_gamma',
    difficultyTier: 3,
    prompt: 'The Liquidation Lord initiates violent market turbulence! To withstand his fury, you need a Delta-Neutral position that gains from explosive moves in EITHER direction. What is your incantation?',
    context: 'Delta neutrality with long Gamma and long Vega.',
    options: [
      {
        label: 'A',
        text: 'Long Straddle or Strangle at low IV: Buy ATM Call + ATM Put, achieving net zero Delta with positive Gamma',
        isCorrect: true,
        explanation: 'Pure institutional finesse! Delta starts at 0.00. Any massive upward surge turns delta positive; any massive crash turns delta negative. You profit from the violent magnitude of the move!',
        damageBonus: 90
      },
      {
        label: 'B',
        text: '100% long stock shares with no derivatives hedge',
        isCorrect: false,
        explanation: 'Holding pure unhedged equity leaves you with +1.00 directional delta, totally vulnerable to downward liquidation.',
        damageBonus: -15
      },
      {
        label: 'C',
        text: 'Sell OTM calls to finance speculative lottery puts',
        isCorrect: false,
        explanation: 'Asymmetric undefined risk that fails delta neutrality.',
        damageBonus: 0
      }
    ]
  }
];

export function getAttackPuzzleForTier(tier: number): CombatAttackPuzzle {
  const matching = COMBAT_ATTACK_PUZZLES.filter(p => p.difficultyTier <= tier);
  if (matching.length === 0) return COMBAT_ATTACK_PUZZLES[0];
  const randIdx = Math.floor(Math.random() * matching.length);
  return matching[randIdx];
}
