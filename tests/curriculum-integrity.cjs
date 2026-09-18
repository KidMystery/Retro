// Curriculum integrity gate — Prompt A deliverable (Voltron, 9/16).
// Council-amended: hard-fails ONLY on structural corruption (correctIndex out of range,
// duplicate IDs within a bank, empty banks). The 44-rune doc↔code reconciliation is
// REPORT-FIRST — the 44-runes-vs-70-lessons definitional pass is a user decision,
// so it prints a report and exits 0 unless a doc rune is missing from code (that one
// IS a real mapping defect: the doc promises content the game doesn't teach).

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src', 'lib');
const failures = [];
const report = [];

// ── 1. Load banks (regex-free: compile TS via a tiny transform — strip types) ──
function loadBank(rel, exportName) {
  const raw = fs.readFileSync(path.join(SRC, rel), 'utf-8');
  // Extract id: '...' occurrences in declaration order (ids are unique per bank by design)
  const ids = [...raw.matchAll(/\n\s{2,8}id:\s*'([^']+)'/g)].map(m => m[1]);
  return { raw, ids };
}

// 2. Structural check: duplicate ids within each bank
const banks = [
  ['lessonsData.ts', 'OPTIONS_LESSONS'],
  ['intelligentInvestorData.ts', 'INTELLIGENT_INVESTOR_LESSONS'],
  ['curriculum/grahamCore.ts', 'GRAHAM_CORE_LESSONS'],
  ['curriculum/olmsteadTrack.ts', 'OLMSTEAD_TRACK_LESSONS'],
  ['curriculum/mcmillanTrack.ts', 'MCMILLAN_TRACK_LESSONS'],
  ['curriculum/cryptoArc.ts', 'CRYPTO_ARC_LESSONS'],
];
const seen = new Map();
for (const [rel, exp] of banks) {
  const { ids } = loadBank(rel, exp);
  if (ids.length === 0) failures.push(`${rel}: bank ${exp} is EMPTY`);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) failures.push(`${rel}: duplicate ids WITHIN bank ${[...new Set(dupes)].join(', ')}`);
  for (const id of ids) {
    // Cross-bank shared ids = the same rune re-taught across tracks (reinforcement — The Rule).
    // Legal, but reported so the founder can confirm intentionality.
    if (seen.has(id) && seen.get(id) !== rel) {
      report.push(`↻ rune '${id}' taught in both ${seen.get(id)} and ${rel} (reinforcement — confirm intentional)`);
      continue;
    }
    if (seen.has(id)) continue;
    seen.set(id, rel);
  }
  report.push(`${rel}: ${ids.length} entries`);
}

// 3. correctIndex range check across every choices/options block
for (const [rel] of banks) {
  const raw = fs.readFileSync(path.join(SRC, rel), 'utf-8');
  for (const m of raw.matchAll(/(?:choices|options):\s*\[([\s\S]*?)\][\s\S]{0,220}?correctIndex:\s*(\d+)/g)) {
    const nOpts = (m[1].match(/'/g) || []).length / 2;
    const ci = parseInt(m[2], 10);
    if (!(ci >= 0 && ci < Math.max(1, nOpts))) {
      failures.push(`${rel}: correctIndex ${ci} out of range for ${nOpts} options near "${m[1].slice(0, 60).replace(/\n/g, ' ')}..."`);
    }
  }
}

// 4. Doc↔code rune mapping: every rune in lesson-region-map.md must exist as an id in code
const doc = fs.readFileSync(path.join(__dirname, '..', 'docs', 'lesson-region-map.md'), 'utf-8');
const docRunes = [...doc.matchAll(/`([a-z_0-9]+)`/g)].map(m => m[1]);
const uniqueRunes = [...new Set(docRunes)];
report.push(`lesson-region-map.md: ${uniqueRunes.length} unique rune IDs (doc claims 44)`);
if (uniqueRunes.length !== 44) {
  report.push(`⚠ RUNE COUNT DRIFT: doc defines ${uniqueRunes.length}, header claims 44 — reconcile the doc header or content (user decision, not auto-enforced).`);
}
const allCodeIds = new Set();
for (const [rel] of banks) {
  const { ids } = loadBank(rel, exp = undefined);
  ids.forEach(id => allCodeIds.add(id));
}
// protections ids (the seal currency) from types.ts
const types = fs.readFileSync(path.join(SRC, '..', 'types.ts'), 'utf-8');
const tProt = types.match(/GrahamProtectionId =\s*[\r\n]?(?:\s*\|[^\n]*\n)+/);
if (tProt) [...tProt[0].matchAll(/'([a-z_0-9]+)'/g)].forEach(m => allCodeIds.add(m[1]));
const missingInCode = uniqueRunes.filter(r => !allCodeIds.has(r));
if (missingInCode.length) {
  failures.push(`doc runes with NO code id (promised but not taught): ${missingInCode.join(', ')}`);
} else {
  report.push(`✓ all ${uniqueRunes.length} doc runes exist in code (protections/lesson ids)`);
}
report.push(`code lesson entries beyond the 44 runes: ${allCodeIds.size - uniqueRunes.length} (encounters, badges, extras — legal, they are not runes)`);

// ── Report + verdict ──
console.log('=== CURRICULUM INTEGRITY REPORT ===');
report.forEach(r => console.log('  ' + r));
if (failures.length) {
  console.log('\n=== FAILURES (structural) ===');
  failures.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('\nCURRICULUM INTEGRITY: PASS (structural) — see report lines above for count reconciliation.');
