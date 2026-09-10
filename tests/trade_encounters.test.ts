// Focused assertions for the source-backed trade encounters milestone.
// Run: npx tsx tests/trade_encounters.test.ts
import { TRADE_ENCOUNTERS, getTradeEncounter, INTELLIGENT_INVESTOR_LESSONS, getTradeMechanicGate } from '../src/lib/intelligentInvestorData';
import { TradeEncounter } from '../src/types';

let failures = 0;
const check = (cond: boolean, label: string) => {
  if (!cond) { failures++; console.error(`FAIL: ${label}`); }
  else { console.log(`ok: ${label}`); }
};

// 1. A small, coherent set: exactly 5 encounters, one per required concept.
check(TRADE_ENCOUNTERS.length === 5, `exactly 5 encounters (got ${TRADE_ENCOUNTERS.length})`);
const ids = new Set(TRADE_ENCOUNTERS.map(e => e.id));
for (const concept of ['enc_bull_call_vertical', 'enc_calendar_theta', 'enc_covered_vs_naked', 'enc_protective_put_collar', 'enc_position_sizing']) {
  check(ids.has(concept), `covers concept ${concept}`);
}

// 2. Every encounter states thesis, entry, max profit, max loss, source, failReason;
//    breakeven present where the structure has one (calendar/position-sizing are variable).
const noBreakevenAllowed = new Set(['enc_calendar_theta', 'enc_position_sizing']);
for (const e of TRADE_ENCOUNTERS as TradeEncounter[]) {
  check(!!e.thesis && e.thesis.length > 40, `${e.id}: thesis stated`);
  check(!!e.entry && e.entry.length > 10, `${e.id}: entry cost/credit stated`);
  check(!!e.maxProfit && e.maxProfit.length > 10, `${e.id}: max profit stated`);
  check(!!e.maxLoss && e.maxLoss.length > 10, `${e.id}: max loss stated`);
  check(!!e.source && e.source.length > 10, `${e.id}: source cited`);
  check(!!e.failReason, `${e.id}: failReason set`);
  if (noBreakevenAllowed.has(e.id)) {
    check(!e.breakeven, `${e.id}: no fake-precision breakeven`);
  } else {
    check(!!e.breakeven && e.breakeven.length > 3, `${e.id}: breakeven stated`);
  }
  // 3. Decision: >=3 choices, exactly one correct, consequences attached.
  const choices = e.decision.choices;
  check(choices.length >= 3, `${e.id}: decision has >=3 choices`);
  check(choices.filter(c => c.correct).length === 1, `${e.id}: exactly one correct choice`);
  const correct = choices.find(c => c.correct)!;
  check((correct.florins || 0) > 0, `${e.id}: correct choice has a florin consequence`);
  check(choices.filter(c => !c.correct).every(c => (c.hearts || 0) > 0), `${e.id}: every wrong choice costs hearts`);
  check(!!e.decision.prompt && !!e.decision.explanation, `${e.id}: decision prompt + explanation present`);
  // 4. Sanctuary tie-in resolves to a real lesson (no silent fallback to lesson[0]).
  check(INTELLIGENT_INVESTOR_LESSONS.some(l => l.id === e.tiedLessonId), `${e.id}: tiedLessonId ${e.tiedLessonId} resolves in Sanctuary`);
  // 5. Numbers are drawn from the repo's verified extracts, not invented breadth.
  check(/olm_ch|mcmillan|Chapter/i.test(e.source), `${e.id}: source grounded in extracts/chapters`);
}

// 6. Deterministic per-day rotation covers all 5 encounters.
const rotated = new Set(Array.from({ length: 5 }, (_, d) => getTradeEncounter(d).id));
check(rotated.size === 5, 'getTradeEncounter cycles through all 5 by day');
check(getTradeEncounter(7).id === getTradeEncounter(2).id, 'getTradeEncounter is deterministic mod 5');

// 7. Mechanic gate chain still intact (encounter rides after it, same day coherence).
const gate = getTradeMechanicGate(0);
check(!!gate.lesson && !!gate.challenge, 'mechanic gate pick still works');

if (failures > 0) {
  console.error(`\n${failures} assertion(s) failed`);
  process.exit(1);
}
console.log('\nAll trade-encounter assertions passed.');
