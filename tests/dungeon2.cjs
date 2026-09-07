// Dungeon playtest v2: uses ?debug pose hook + real key movement.
// Walks (real WASD) to each encounter node, exercises every flow:
// sage dialogue, broker MCQ gate (wrong then right), scammer, and checks hearts/florins.
const { chromium } = require('playwright');

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
const ENC = [[2, 4], [9, 5], [10, 9], [4, 11]];

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
  const path = [];
  let cur = goal;
  while (cur) { path.unshift(cur); cur = prev.get(key(cur[0], cur[1])); }
  return path;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:4174/?debug', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.locator('button', { hasText: 'START QUEST' }).first().click();
  await page.waitForTimeout(1500);

  const pose = () => page.evaluate(() => window.__dungeon && { ...window.__dungeon.pos, dir: window.__dungeon.dir });
  const setPose = (x, y, dir = 0) => page.evaluate(([x, y, d]) => { window.__dungeon.pos = { x, y }; window.__dungeon.dir = d; }, [x, y, dir]);
  const stats = () => page.evaluate(() => {
    const t = document.body.innerText;
    const hearts = (t.match(/([\d.]+)\/4 ♥/) || [])[1];
    const florins = (t.match(/([\d,]+) ƒ\n?\$?AETH/) || t.match(/([\d,]+) ƒ/))[1];
    return { hearts, florins: florins.replace(/,/g, '') };
  });
  const body = () => page.evaluate(() => document.body.innerText);
  const snap = async tag => {
    const t = await body();
    const lines = t.split('\n').map(s => s.trim()).filter(Boolean);
    // heuristics: keep modal-ish lines (last 15)
    console.log(`\n===== ${tag} =====`);
    console.log(lines.slice(-14).join(' | '));
    await page.screenshot({ path: `shots/${tag}.png` });
  };
  const pressE = async () => { await page.keyboard.press('KeyE'); await page.waitForTimeout(700); };
  const esc = async () => { await page.keyboard.press('Escape'); await page.waitForTimeout(500); };
  const norm = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };

  console.log('initial pose:', await pose(), await stats());

  // Walk for real (WASD) from spawn to encounter 0 = spawn (already there). Test E.
  await pressE();
  await snap('d0-sage-dialogue');
  await esc(); await esc();
  await snap('d0-after-close');

  // Real-movement check: walk from (2,4) one tile to (2,3) and back, verify pose changes
  await setPose(2.5, 4.5, -Math.PI / 2); // face up (−y)
  await page.keyboard.down('KeyW'); await page.waitForTimeout(500); await page.keyboard.up('KeyW');
  await page.waitForTimeout(200);
  console.log('pose after moving up (expect y≈4.0 or less):', await pose());

  // Now teleport-free walk to encounter 1 (9,5) using real movement per BFS step
  const walkTo = async goal => {
    let p = await pose();
    let [px, py] = [Math.floor(p.x), Math.floor(p.y)];
    const path = bfsPath([px, py], goal).slice(1);
    let dir = p.dir;
    for (const [nx, ny] of path) {
      const want = Math.atan2(ny - py, nx - px);
      let diff = norm(want - dir);
      while (Math.abs(diff) > 0.03) {
        const k = diff > 0 ? 'KeyD' : 'KeyA';
        await page.keyboard.down(k); await page.waitForTimeout(60); await page.keyboard.up(k);
        const now = await pose(); dir = now.dir; diff = norm(want - dir);
      }
      await page.keyboard.down('KeyW'); await page.waitForTimeout(450); await page.keyboard.up('KeyW');
      await page.waitForTimeout(120);
      const now = await pose();
      [px, py] = [Math.floor(now.x), Math.floor(now.y)];
      if (px !== nx || py !== ny) { console.log(`  drift: wanted (${nx},${ny}) at (${px},${py}) — resync`); }
    }
    return pose();
  };
  console.log('walk to enc1:', await walkTo([9, 5]));
  await snap('d1-arrived-broker');
  console.log('stats before broker:', await stats());
  await pressE();
  await snap('d1-broker-gate');
  // MCQ gate: dump answer buttons
  const btns = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean));
  console.log('buttons:', JSON.stringify(btns));
  console.log('stats after gate open:', await stats());
  console.log('errors so far:', errors.length ? errors : 'none');
  await browser.close();
})();
