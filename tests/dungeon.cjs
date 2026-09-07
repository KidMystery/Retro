// Dungeon playtest: walk to all 4 encounter nodes, interact, dump what happens.
// Movement: BFS path on the same MAP as DungeonView; hold W to advance, A/D to turn.
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
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.locator('button', { hasText: 'START QUEST' }).first().click();
  await page.waitForTimeout(1500);

  const norm = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const dump = async tag => {
    const t = await page.evaluate(() => document.body.innerText);
    console.log(`\n===== ${tag} =====`);
    console.log(t.split('\n').filter(l => l.trim()).slice(0, 60).join(' | '));
    await page.screenshot({ path: `shots/${tag}.png` });
  };
  const pressE = async () => { await page.keyboard.press('KeyE'); await page.waitForTimeout(600); };

  // walk from (2,4) to each encounter in order; dir starts 0 (+x)
  let pos = [2, 4], dir = 0;
  for (let i = 0; i < ENC.length; i++) {
    const path = bfsPath(pos, ENC[i]).slice(1);
    for (const [nx, ny] of path) {
      const want = Math.atan2(ny - pos[1], nx - pos[0]);
      let diff = norm(want - dir);
      const turnKey = diff > 0 ? 'KeyD' : 'KeyA';
      // ROT = 0.05 rad/frame @60fps -> 3 rad/s
      let ms = Math.abs(diff) / 3 * 1000;
      while (ms > 0) {
        const step = Math.min(ms, 120);
        await page.keyboard.down(turnKey); await page.waitForTimeout(step); await page.keyboard.up(turnKey);
        dir = norm(dir + Math.sign(diff) * (step / 1000) * 3);
        diff = norm(want - dir); ms = Math.abs(diff) / 3 * 1000;
      }
      // move 1 tile: 0.05 t/frame @60fps = 3 t/s; hold a bit extra (walls stop us)
      await page.keyboard.down('KeyW'); await page.waitForTimeout(400); await page.keyboard.up('KeyW');
      pos = [nx, ny];
      await page.waitForTimeout(150);
    }
    await dump(`dun-enc${i}-arrived`);
    await pressE();
    await dump(`dun-enc${i}-interact`);
    // try to close any modal with common buttons
    for (const label of ['CLOSE', 'CONTINUE', 'LEAVE', 'X', 'DONE']) {
      const b = page.locator('button', { hasText: label }).first();
      if (await b.count()) { await b.click().catch(() => {}); await page.waitForTimeout(400); break; }
    }
    await dump(`dun-enc${i}-after`);
  }
  console.log('\n=== CONSOLE ERRORS ===', errors.length ? errors : 'none');
  await browser.close();
})();
