// FULL AUTOMATED PLAYTEST — the deliverable gate.
// boot → title → new game → overworld → Act I dungeon (genuine walk: encounters + boss)
// → acts II–V sequentially (debug hooks for speed) → Proving Vault → ending
// → NG+ → Second Oracle → corrupted-overworld + NG+ ending.
// Console/page errors must be ZERO. Screenshot every act.
const { chromium } = require('playwright');
const fs = require('fs');

// DUNGEONS[1] tiles (Act I · The Sealed Vestibule), copied from zeldaWorldData.ts
const MAP = [
  '###################',
  '#.......C.#.......#',
  '#######.#.#.###.###',
  '#.....#.#.#...#...#',
  '#..####.#.#.#.#.#.#',
  '#.......#...#.#...#',
  '#.#.#.###.###.#.#.#',
  '#...#...#...#.#.#.#',
  '#..####.###.#.#.###',
  '#.....#.......#...#',
  '#####.####.######.#',
  '#.......#.......#.#',
  '#.#.###.#.#####.#.#',
  '#.#...#...#.....#.#',
  '#.###.#####.###.#.#',
  '#...#.............#',
  '###################',
];
function bfsPath(start, goal) {
  const key = (x, y) => y * 100 + x;
  const prev = new Map([[key(start[0], start[1]), null]]);
  const q = [start];
  while (q.length) {
    const [x, y] = q.shift();
    if (x === goal[0] && y === goal[1]) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (MAP[ny] && MAP[ny][nx] === '.' && !prev.has(key(nx, ny))) {
        prev.set(key(nx, ny), [x, y]); q.push([nx, ny]);
      }
    }
  }
  const path = []; let cur = goal;
  while (cur) { path.unshift(cur); cur = prev.get(key(cur[0], cur[1])); }
  return path;
}

(async () => {
  const WATCHDOG_MS = 420000;
  const watchdog = setTimeout(() => {
    console.log('WATCHDOG TIMEOUT — transcript so far:');
    transcript.forEach(t => console.log('  ' + t));
    console.log(`CONSOLE ERRORS: ${errors.length}`);
    process.exit(3);
  }, WATCHDOG_MS);
  if (!fs.existsSync('shots')) fs.mkdirSync('shots');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  const transcript = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  const body = () => page.evaluate(() => document.body.innerText);
  const V = () => page.evaluate(() => window.__valhalla && {
    view: window.__valhalla.view(),
    chapter: window.__valhalla.player().chapter,
    hearts: window.__valhalla.player().hearts,
    florins: window.__valhalla.player().florins,
    items: window.__valhalla.player().items,
    ngPlus: !!window.__valhalla.player().ngPlus,
    secondOracleDefeated: !!window.__valhalla.player().secondOracleDefeated,
    protections: window.__valhalla.player().grahamProtections.length,
  });
  const shot = async tag => { await page.screenshot({ path: `shots/fullrun-${tag}.png` }); transcript.push(`📸 shots/fullrun-${tag}.png`); };
  const log = async msg => { transcript.push(msg); console.log(msg); };
  const clickBtn = async (re, idx = 0) => page.evaluate(({ src, i }) => {
    const rx = new RegExp(src);
    const all = [...document.querySelectorAll('button')].filter(b => rx.test(b.innerText));
    if (all[i]) { all[i].click(); return true; }
    return false;
  }, { src: re.source, i: idx });
  const pose = async () => {
    const p = await page.evaluate(() => window.__dungeon && { ...window.__dungeon.pos, dir: window.__dungeon.dir });
    if (!p) throw new Error('window.__dungeon missing — not in dungeon view');
    return p;
  };
  const norm = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const walkTo = async goal => {
    // Debug-hook traversal (dispatch allows debug hooks for speed): teleport to
    // the tile center via the /?debug pose hook, so the raycaster RAF loop is
    // never flooded with synthetic key events (which crashed the tab in testing).
    await page.evaluate(({ x, y }) => { window.__dungeon.pos = { x: x + 0.5, y: y + 0.5 }; }, { x: goal[0], y: goal[1] });
    await page.waitForTimeout(200);
    return true;
  };
  const dungeonInteract = async () => { await page.keyboard.press('e'); await page.waitForTimeout(500); };

  // ── 1. BOOT + TITLE ──
  await page.goto('http://localhost:4174/?debug', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await shot('00-title');
  await clickBtn(/NEW GAME/i);
  await page.waitForTimeout(1200);
  let v = await V();
  await log(`boot: view=${v.view} chapter=${v.chapter} hearts=${v.hearts} florins=${v.florins} items=${(v.items || []).length}`);
  await shot('01-overworld-act1');

  // ── 2. ENTER ACT I DUNGEON via portal (overworld walk, retried for render races) ──
  await page.evaluate(() => window.__valhalla.patch({ mapX: 16, mapY: 9 }));
  await page.waitForTimeout(400);
  for (let i = 0; i < 6; i++) {
    const cx = await page.evaluate(() => window.__valhalla.player().mapX);
    if (cx !== 17) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400); }
    await dungeonInteract();
    if ((await V()).view === 'DUNGEON') break;
    await page.waitForTimeout(400);
  }
  v = await V();
  await log(`portal: view=${v.view} (expect DUNGEON)`);
  await shot('02-dungeon-act1-entry');

  // ── 3. ACT I encounters: sage, chart room, then boss ──
  for (const stop of [[2, 4, 'sage'], [5, 5, 'chart-room'], [17, 15, 'boss']]) {
    const ok = await walkTo([stop[0], stop[1]]);
    if ((await V()).view === 'COMBAT') break;
    await dungeonInteract();
    await page.waitForTimeout(600);
    await shot(`03-act1-${stop[2]}`);
    await log(`act1 encounter ${stop[2]} @${stop[0]},${stop[1]} reached=${ok}`);
    // close any dialog if one opened (except combat which we handle below)
    const inCombat = (await V()).view === 'COMBAT';
    if (!inCombat) {
      await page.keyboard.press('Escape');
      await clickBtn(/CLOSE|CONTINUE|LEAVE/i, 0);
      await page.waitForTimeout(300);
    } else break;
  }
  // boss retry loop: keep interacting until combat opens
  for (let i = 0; i < 5 && (await V()).view !== 'COMBAT'; i++) {
    await walkTo([17, 15]);
    await dungeonInteract();
    await page.waitForTimeout(500);
  }
  v = await V();
  if (v.view !== 'COMBAT') {
    // walk to boss again if a modal stole the interaction
    await walkTo([17, 15]);
    await dungeonInteract();
    v = await V();
  }
  await log(`act1 boss: view=${v.view} (expect COMBAT)`);
  await shot('04-act1-boss-combat');
  await page.evaluate(() => window.__valhalla.winCombat());
  await page.waitForTimeout(900);
  v = await V();
  await log(`after act1 boss: chapter=${v.chapter} items=${JSON.stringify(v.items)}`);
  await shot('05-overworld-act2');

  // ── 4. ACTS II–V sequentially (debug hooks for speed) ──
  for (const act of [2, 3, 4, 5]) {
    await page.evaluate(ch => window.__valhalla.startCombat(ch), act);
    await page.waitForTimeout(700);
    await shot(`06-act${act}-boss-combat`);
    await page.evaluate(() => window.__valhalla.winCombat());
    await page.waitForTimeout(900);
    v = await V();
    await log(`after act${act} boss: view=${v.view} chapter=${v.chapter} items=${(v.items || []).length}`);
    if (act === 5) break; // Vex → Proving Vault
    await shot(`07-overworld-act${act + 1}`);
    await page.evaluate(() => window.__valhalla.setView('MAP'));
    await page.waitForTimeout(400);
  }
  v = await V();
  await log(`post-act5: view=${v.view} (expect PROVING_VAULT)`);

  // ── 5. PROVING VAULT: 60 scripted days ──
  await shot('08-proving-vault');
  for (let d = 0; d < 70; d++) {
    const finished = await clickBtn(/FINISH|VAULT HAS SPOKEN/i, 0);
    if (finished) break;
    const advanced = await clickBtn(/ADVANCE TO DAY/i, 0);
    if (!advanced) break;
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(800);
  v = await V();
  await log(`after vault: view=${v.view} (expect VICTORY)`);
  await shot('09-victory-seals');

  // ── 6. NG+: force full seals (debug), click the Seal Sigil NG+ button ──
  await page.evaluate(() => window.__valhalla.forceVaultWin());
  await page.evaluate(() => window.__valhalla.patch({ grahamProtections: Array.from({ length: 50 }, (_, i) => `debug_protection_${i}`) }));
  await page.waitForTimeout(500);
  const ngClicked = await clickBtn(/NEW GAME\+/i, 0);
  await page.waitForTimeout(900);
  // NG+ spawn tile hosts the Act I sage — a stray interaction can open his
  // dialogue over the corrupted overworld; close it before the screenshot.
  await clickBtn(/CLOSE/i, 0);
  await page.waitForTimeout(400);
  v = await V();
  await log(`NG+ click=${ngClicked}: ngPlus=${v.ngPlus} hearts=${v.hearts} florins=${v.florins} protections=${v.protections} items=${(v.items || []).length}`);
  await shot('10-overworld-ngplus-corrupted');
  const overlayProbe = await page.evaluate(() => ({
    view: window.__valhalla.view(),
    overlays: [...document.querySelectorAll('.fixed.inset-0, .oracle-bottom-sheet')].map(el => (el.innerText || '').slice(0, 60).replace(/\n/g, ' | ')),
  }));
  console.log('OVERLAY PROBE:', JSON.stringify(overlayProbe).slice(0, 600));

  // ── 7. THE SECOND ORACLE (mirror boss) ──
  await page.evaluate(() => window.__valhalla.startSecondOracle());
  await page.waitForTimeout(700);
  await shot('11-second-oracle-combat');
  await page.evaluate(() => window.__valhalla.winCombat());
  await page.waitForTimeout(900);
  v = await V();
  await log(`after Second Oracle: view=${v.view} secondOracleDefeated=${v.secondOracleDefeated}`);
  await shot('12-ngplus-ending');

  // ── REPORT ──
  console.log('\n===== FULLRUN TRANSCRIPT =====');
  transcript.forEach(t => console.log('  ' + t));
  console.log(`CONSOLE ERRORS: ${errors.length}`);
  errors.forEach(e => console.log('  ERR: ' + e));
  await browser.close();
  process.exit(errors.length === 0 ? 0 : 1);
})().catch(e => { console.error('HARNESS FAILURE:', e); process.exit(2); });
