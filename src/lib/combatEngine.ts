import { EnemyStats, PlayerStats, OptionContract, GrahamProtectionId } from '../types';

export interface CombatTurnResult {
  playerDamageDealt: number;
  enemyDamageDealt: number;
  playerHealed: number;
  manaSpent: number;
  logMessages: string[];
  enemyDefeated: boolean;
  playerDefeated: boolean;
  marketShift?: {
    spotChange: number;
    ivChange: number;
  };
  grahamProtectionTriggered?: GrahamProtectionId;
}

/**
 * Rebalanced risk calculation - more forgiving early, teaches discipline
 * Incorporates Graham protections as permanent risk reduction
 */
export function calculatePortfolioRisk(
  player: PlayerStats,
  positions: OptionContract[]
): {
  riskScore: number;
  marginUtilization: number;
  riskCategory: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  reasons: string[];
  kellyCompliant: boolean;
} {
  const reasons: string[] = [];
  let score = 5; // lower baseline - more forgiving for new players

  // 1. Margin Utilization - rebalanced
  const marginUtil = player.marginLimit > 0 ? player.marginUsed / player.marginLimit : 0;
  if (marginUtil > 0.85) {
    score += 40;
    reasons.push('Extreme Margin (>85%) - Liquidation Lord senses you!');
  } else if (marginUtil > 0.60) {
    score += 20;
    reasons.push('Elevated Margin (>60%) - Consider Kelly sizing');
  } else if (marginUtil > 0.35) {
    score += 8;
    reasons.push('Moderate Margin Usage');
  } else {
    score -= 5;
    reasons.push('Healthy Cash Reserve - Survival first!');
  }

  // 2. Theta bleed - with Graham protection bonus
  const hasThetaProtection = player.grahamProtections?.includes('theta_protection');
  const thetaAdjusted = hasThetaProtection ? player.netTheta * 1.2 : player.netTheta;
  
  if (player.netTheta < -50) {
    score += hasThetaProtection ? 10 : 20;
    reasons.push(hasThetaProtection ? 'Theta bleed but protected by Graham wisdom' : 'Severe Theta Bleed (< -50 ƒ/day)');
  } else if (player.netTheta < -20) {
    score += hasThetaProtection ? 3 : 10;
    reasons.push('Moderate Theta Bleed');
  } else if (player.netTheta > 10) {
    score -= 15;
    reasons.push('Positive Theta Flow ✨ Earning while waiting!');
  }

  // 3. Delta exposure - with protection
  const absDelta = Math.abs(player.netDelta);
  const hasMarginProtection = player.grahamProtections?.includes('margin_of_safety');
  if (absDelta > 3.0) {
    score += hasMarginProtection ? 10 : 20;
    reasons.push(hasMarginProtection ? 'High Delta but margin of safety buffers' : 'Extreme Unhedged Delta (>3.0)');
  } else if (absDelta > 1.5) {
    score += 8;
    reasons.push('Moderate Directional Bias');
  } else if (absDelta < 0.5 && positions.length > 0) {
    score -= 12;
    reasons.push('Near Delta-Neutral - Master Oracle balance!');
  }

  // 4. Defined-risk strategies - bigger bonus, teaches Olmstead
  const definedRiskCount = positions.filter(p => 
    ['BULL_CALL_SPREAD', 'BEAR_PUT_SPREAD', 'IRON_CONDOR', 'CALENDAR_SPREAD', 'COVERED_CALL', 'CASH_SECURED_PUT'].includes(p.strategy)
  ).length;
  
  if (definedRiskCount > 0) {
    const bonus = Math.min(20, definedRiskCount * 6);
    score -= bonus;
    reasons.push(`Defined-Risk Armor x${definedRiskCount} (-${bonus} risk) - Olmstead discipline!`);
  }

  // 5. Position sizing - Kelly Criterion check
  const largestPositionPct = positions.length > 0 
    ? Math.max(...positions.map(p => (p.premium * 100 * Math.abs(p.quantity)) / Math.max(1, player.portfolioValue)))
    : 0;
  const kellyCompliant = largestPositionPct <= 0.25 || positions.length === 0;
  
  if (largestPositionPct > 0.5) {
    score += 25;
    reasons.push(`Oversized position ${(largestPositionPct*100).toFixed(0)}% - Size kills! Kelly says max 25%`);
  } else if (largestPositionPct > 0.25) {
    score += 10;
    reasons.push(`Large position ${(largestPositionPct*100).toFixed(0)}% - Consider trimming`);
  } else if (positions.length > 0) {
    score -= 5;
    reasons.push('Kelly-compliant sizing - Survival first!');
  }

  // 6. Graham protections - permanent risk reduction
  if (player.grahamProtections && player.grahamProtections.length > 0) {
    const protectionBonus = player.grahamProtections.length * 4;
    score -= protectionBonus;
    reasons.push(`Graham Protections x${player.grahamProtections.length} (-${protectionBonus} risk) - Permanent wisdom!`);
  }

  // 7. Path bonus - having clear path reduces risk
  if (player.currentPath !== 'UNDECIDED') {
    score -= 3;
    reasons.push(`${player.currentPath} path discipline - Choice matters`);
  }

  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  let category: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'SAFE';
  if (clampedScore >= 70) category = 'CRITICAL';
  else if (clampedScore >= 45) category = 'HIGH';
  else if (clampedScore >= 20) category = 'MODERATE';

  return {
    riskScore: clampedScore,
    marginUtilization: Number(marginUtil.toFixed(2)),
    riskCategory: category,
    reasons,
    kellyCompliant
  };
}

/**
 * Rebalanced enemy scaling - less punishing early, scales with chapter + capital
 * Incorporates weakness/resistance to teach strategy selection
 */
export function getScaledEnemyStats(
  baseEnemy: EnemyStats,
  player: PlayerStats,
  riskScore: number
): EnemyStats {
  // Capital scaling - more gentle early
  const capitalRatio = Math.max(1, player.portfolioValue / 10000);
  const chapterMultiplier = 1 + (player.chapter - 1) * 0.15;
  const capitalScaling = 1 + (capitalRatio - 1) * 0.3; // reduced from 0.45
  
  const scaledMaxHp = Math.round(baseEnemy.baseHp * capitalScaling * chapterMultiplier);
  
  // Risk scaling - with Graham protection mitigation
  const protectionMitigation = (player.grahamProtections?.length || 0) * 0.05;
  const effectiveRiskSensitivity = Math.max(0.5, (baseEnemy.riskSensitivity || 1.2) - protectionMitigation);
  const riskMultiplier = 1.0 + (riskScore / 100) * effectiveRiskSensitivity;
  const scaledAttack = Math.round(baseEnemy.attackPower * riskMultiplier * (0.8 + chapterMultiplier * 0.2));

  return {
    ...baseEnemy,
    maxHp: scaledMaxHp,
    currentHp: scaledMaxHp,
    attackPower: scaledAttack
  };
}

/**
 * Enhanced combat with strategy weaknesses, path bonuses, Graham protections
 */
export function resolveCombatAction(
  action: 'STRIKE' | 'HEDGE_SHIELD' | 'STRADDLE_SHOCK' | 'THETA_SIPHON' | 'USE_ELIXIR' | 'USE_HOURGLASS' | 'COVERED_HARVEST' | 'CALENDAR_SANDS',
  player: PlayerStats,
  enemy: EnemyStats,
  riskScore: number,
  shieldActive: boolean,
  playerPositions: OptionContract[] = []
): CombatTurnResult {
  const log: string[] = [];
  let playerDmg = 0;
  let enemyDmg = 0;
  let playerHealed = 0;
  let manaCost = 0;
  let spotDelta = 0;
  let ivDelta = 0;
  let protectionTriggered: GrahamProtectionId | undefined;

  // Check for strategy weakness/resistance
  const playerStrategies = playerPositions.map(p => p.strategy);
  const hasWeakness = enemy.weaknessStrategy?.some(ws => playerStrategies.includes(ws));
  const hasResistance = enemy.resistanceStrategy?.some(rs => playerStrategies.includes(rs));
  const weaknessMultiplier = hasWeakness ? 1.5 : 1.0;
  const resistanceMultiplier = hasResistance ? 0.6 : 1.0;

  if (hasWeakness) {
    log.push(`> Oracle's Lens reveals weakness! ${enemy.name} vulnerable to ${enemy.weaknessStrategy?.join(', ')}! +50% damage!`);
  }
  if (hasResistance) {
    log.push(`> ${enemy.name} resists your current arsenal... Try ${enemy.weaknessStrategy?.join(' or ')}!`);
  }

  // Path bonus
  const pathBonus = player.currentPath !== 'UNDECIDED' ? 1.15 : 1.0;
  if (player.currentPath !== 'UNDECIDED') {
    log.push(`> ${player.currentPath} path discipline grants +15% combat focus!`);
  }

  // 1. Execute Player Action
  if (action === 'STRIKE') {
    manaCost = 0;
    const baseDamage = 24 + Math.floor(Math.random() * 14);
    const deltaBonus = Math.round(player.netDelta * 12);
    const tierBonus = player.investorTier * 5;
    playerDmg = Math.max(12, Math.round((baseDamage + deltaBonus + tierBonus) * weaknessMultiplier * resistanceMultiplier * pathBonus));
    log.push(`> Rune Strike ᛚ for ${playerDmg} damage (Δ:${deltaBonus >=0?'+':''}${deltaBonus} Tier:+${tierBonus} ${hasWeakness?'Weakness!':''})`);
  } 
  else if (action === 'HEDGE_SHIELD') {
    manaCost = 12;
    const hasMarginProtection = player.grahamProtections?.includes('margin_of_safety');
    if (hasMarginProtection) {
      log.push(`> [Graham Shield: Margin of Safety] +10% collateral buffer! Spectral ward 70% reduction!`);
      protectionTriggered = 'margin_of_safety';
    } else {
      log.push(`> [Protective Put Hedge ᛉ] Spectral ward 60% reduction next turn!`);
    }
  }
  else if (action === 'STRADDLE_SHOCK') {
    manaCost = 22;
    const hasVegaProtection = player.grahamProtections?.includes('vega_protection');
    const volFactor = Math.round(Math.abs(player.netVega) * 5 + 38);
    const vegaMitigation = hasVegaProtection ? 1.2 : 1.0;
    playerDmg = Math.round((volFactor + Math.floor(Math.random() * 22)) * weaknessMultiplier * vegaMitigation);
    ivDelta = hasVegaProtection ? 0.03 : 0.06;
    log.push(`> [Long Straddle Vortex ᛋ] Vol erupts! ${playerDmg} arcane shock! ${hasVegaProtection?'+20% Vega mastery':''} (IV +${(ivDelta*100).toFixed(0)}%)`);
    if (hasVegaProtection) protectionTriggered = 'vega_protection';
  }
  else if (action === 'THETA_SIPHON') {
    manaCost = 8;
    const hasThetaProtection = player.grahamProtections?.includes('theta_protection');
    if (player.netTheta > 0) {
      const baseHeal = Math.min(50, Math.round(player.netTheta * 2 + 18));
      const bonus = hasThetaProtection ? 15 : 0;
      playerHealed = baseHeal + bonus;
      playerDmg = Math.round((player.netTheta * 1.4 + 5) * weaknessMultiplier);
      log.push(`> [Theta Siphon ᛃ] Positive decay → vitality! Heal +${playerHealed} + drain ${playerDmg}! ${hasThetaProtection?'Theta mastery!':''}`);
      if (hasThetaProtection) protectionTriggered = 'theta_protection';
    } else {
      playerHealed = hasThetaProtection ? 20 : 10;
      playerDmg = hasThetaProtection ? 18 : 8;
      log.push(`> [Theta Siphon] Negative theta but ${hasThetaProtection?'Graham protection gives ':'meager '} +${playerHealed} HP`);
    }
  }
  else if (action === 'COVERED_HARVEST') {
    manaCost = 10;
    const hasInvestorPath = player.currentPath === 'INVESTOR' || player.currentPath === 'HYBRID';
    const harvestBonus = hasInvestorPath ? 1.4 : 1.0;
    playerDmg = Math.round((28 + Math.floor(Math.random()*12)) * harvestBonus * weaknessMultiplier);
    playerHealed = Math.round(15 * harvestBonus);
    log.push(`> [Covered Call Harvest ᛃ] Farmer's income! ${playerDmg} dmg + ${playerHealed} HP! ${hasInvestorPath?'Investor path bonus!':''}`);
  }
  else if (action === 'CALENDAR_SANDS') {
    manaCost = 14;
    const hasTheta = player.grahamProtections?.includes('theta_protection');
    playerDmg = Math.round((32 + Math.floor(Math.random()*16)) * (hasTheta?1.3:1.0) * weaknessMultiplier);
    log.push(`> [Calendar Sands ᛝ] Sell near-term decay, buy long-term! ${playerDmg} chrono dmg! Time is ally!`);
    if (hasTheta) protectionTriggered = 'theta_protection';
  }
  else if (action === 'USE_ELIXIR') {
    const hasProtection = player.grahamProtections?.length ? 1.2 : 1.0;
    playerHealed = Math.round(65 * hasProtection);
    log.push(`> Quaff Health Elixir! +${playerHealed} HP ${hasProtection>1?'Graham boosts healing!':''}`);
  }
  else if (action === 'USE_HOURGLASS') {
    playerHealed = 28;
    manaCost = -32;
    log.push(`> Turn Time Hourglass! Temporal recalibration +${playerHealed} HP, +32 Mana!`);
  }

  // Check enemy defeated
  const enemyRemainingHp = Math.max(0, enemy.currentHp - playerDmg);
  if (enemyRemainingHp <= 0) {
    log.push(`> *** TRIUMPH! ${enemy.name} collapses into golden florins! Oracle Bond +1! ***`);
    if (enemy.id === 'boss_liquidation_lord') {
      log.push(`> Marduk Vex whispers: "Rich is survival first... I remember now. Teach me again, Valen." TRUE ENDING!`);
    }
    return {
      playerDamageDealt: playerDmg,
      enemyDamageDealt: 0,
      playerHealed,
      manaSpent: manaCost,
      logMessages: log,
      enemyDefeated: true,
      playerDefeated: false,
      marketShift: { spotChange: spotDelta, ivChange: ivDelta },
      grahamProtectionTriggered: protectionTriggered
    };
  }

  // 2. Enemy Counter-Attack - rebalanced less punishing
  const isEnraged = riskScore >= 70;
  const isSpecial = Math.random() < 0.32;

  let rawEnemyDmg = enemy.attackPower + Math.floor(Math.random() * 7) - 2;
  if (isEnraged) {
    rawEnemyDmg = Math.round(rawEnemyDmg * 1.35); // reduced from 1.5
    log.push(`> [ALERT] Enemy senses leverage and ENRAGES! But your Graham protections buffer!`);
  }

  if (isSpecial) {
    rawEnemyDmg = Math.round(rawEnemyDmg * 1.3); // reduced from 1.4
    log.push(`> ${enemy.name} channels: "${enemy.specialMove}"!`);
    if (enemy.marketAffinity === 'CRASH') {
      spotDelta -= 2; // reduced
    } else if (enemy.marketAffinity === 'SURGE') {
      spotDelta += 3;
    } else if (enemy.marketAffinity === 'CHAOS') {
      ivDelta += 0.06;
    }
  } else {
    log.push(`> ${enemy.name} strikes with ${enemy.title}!`);
  }

  // Mitigation - with Graham protections
  const hasLeverageProtection = player.grahamProtections?.includes('leverage_protection');
  const baseMitigation = hasLeverageProtection ? 0.35 : 0.4;
  
  if (shieldActive || action === 'HEDGE_SHIELD') {
    const mitigation = action === 'HEDGE_SHIELD' && player.grahamProtections?.includes('margin_of_safety') ? 0.3 : baseMitigation;
    enemyDmg = Math.max(3, Math.round(rawEnemyDmg * mitigation));
    log.push(`> Protective Ward absorbs ${Math.round((1-mitigation)*100)}%! Damage: ${enemyDmg} ${hasLeverageProtection?'(Kelly sizing reduces!)':''}`);
    if (hasLeverageProtection) protectionTriggered = 'leverage_protection';
  } else if (riskScore < 30) {
    enemyDmg = Math.max(5, Math.round(rawEnemyDmg * 0.7));
    log.push(`> Disciplined balance deflects 30%! Damage: ${enemyDmg}`);
  } else {
    enemyDmg = rawEnemyDmg;
    log.push(`> Take ${enemyDmg} direct damage!`);
  }

  // Kelly protection reduces damage if compliant
  if (hasLeverageProtection && enemyDmg > 0) {
    enemyDmg = Math.max(2, Math.round(enemyDmg * 0.8));
    log.push(`> Kelly discipline reduces damage further to ${enemyDmg}! Survival first!`);
  }

  const playerRemainingHp = player.hp + playerHealed - enemyDmg;
  const playerDefeated = playerRemainingHp <= 0;
  if (playerDefeated) {
    log.push(`> *** HEARTS DEPLETED! But fail->Graham loop begins! Sanctuary awaits! ***`);
  }

  return {
    playerDamageDealt: playerDmg,
    enemyDamageDealt: enemyDmg,
    playerHealed,
    manaSpent: manaCost,
    logMessages: log,
    enemyDefeated: false,
    playerDefeated,
    marketShift: { spotChange: spotDelta, ivChange: ivDelta },
    grahamProtectionTriggered: protectionTriggered
  };
}
