// Dungeon scenario: sage close, broker gate WRONG -> sanctuary -> learn -> pass -> trade desk.
const { chromium } = require('playwright');

const MAP = [
  '###################', '#.......C.#.......#', '#######.#.#.###.###',
  '#.....#.#.#...#...#', '#..####.#.#.#.#.#.#', '#.......#...#.#...#',
  '#.#.#.###.###.#.#.#', '#...#...#...#.#.#.#', '#..####.###.#.#.###',
  '#.....#.......#...#', '#####.####.######.#', '#.......#.......#.#',
  '#.#.###.#.#####.#.#', '#.#...#...#.....#.#', '#.###.#####.###.#.#',
  '#...#.............#', '###################',
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
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:4174/?debug', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.locator('button', { hasText: 'START QUEST' }).first().click();
  await page.waitForTimeout(1200);

  const body = () => page.evaluate(() => document.body.innerText);
  const pose = () => page.evaluate(() => window.__dungeon && { ...window.__dungeon.pos, dir: window.__dungeon.dir });
  const stats = () => page.evaluate(() => {
    const t = document.body.innerText;
    return {
      hearts: (t.match(/([\d.]+)\/4 ♥/) || [])[1] || '?',
      florins: (t.match(/([\d,]+) ƒ/) || [])[1] || '?',
      bond: (t.match(/Bond Lv ([\d.]+)/) || [])[1] || '?',
    };
  });
  const btnTexts = () => page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText.trim()));
  const clickBtn = async (re, idx = 0) => page.evaluate(({ src, i }) => {
    const rx = new RegExp(src);
    const all = [...document.querySelectorAll('button')].filter(b => rx.test(b.innerText));
    if (all[i]) { all[i].click(); return all[i].innerText.trim(); }
    return null;
  }, { src: re.source, i: idx });
  const snap = async tag => {
    const t = await body();
    console.log(`\n===== ${tag} =====`);
    console.log(t.split('\n').map(s => s.trim()).filter(Boolean).slice(-12).join(' | '));
    await page.screenshot({ path: `shots/${tag}.png` });
  };
  const norm = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const walkTo = async goal => {
    for (let guard = 0; guard < 200; guard++) {
      const p = await pose();
      const [px, py] = [Math.floor(p.x), Math.floor(p.y)];
      if (px === goal[0] && py === goal[1]) return p;
      const path = bfsPath([px, py], goal).slice(1);
      if (!path.length) return p;
      const [nx, ny] = path[0];
      const want = Math.atan2(ny - py, nx - px);
      let diff = norm(want - p.dir);
      let spins = 0;
      while (Math.abs(diff) > 0.05 && spins++ < 40) {
        const k = diff > 0 ? 'KeyD' : 'KeyA';
        await page.keyboard.down(k); await page.waitForTimeout(50); await page.keyboard.up(k);
        const now = await pose(); diff = norm(want - now.dir);
      }
      await page.keyboard.down('KeyW'); await page.waitForTimeout(430); await page.keyboard.up('KeyW');
      await page.waitForTimeout(100);
    }
    return pose();
  };
  const pressE = async () => { await page.keyboard.press('KeyE'); await page.waitForTimeout(700); };

  console.log('=== 1. SAGE: open + continue (Oracle Bond +0.1) ===');
  await pressE();
  console.log('stats:', await stats());
  console.log('clicked:', await clickBtn(/CONTINUE/));
  await page.waitForTimeout(500);
  console.log('stats after continue:', await stats());

  console.log('\n=== 2. WALK to broker (9,5) with real movement ===');
  console.log('final pose:', await walkTo([9, 5]));

  console.log('\n=== 3. BROKER: E -> mechanic gate ===');
  await pressE();
  await snap('gate-open');
  const gateText = await body();
  const gateChunk = gateText.slice(gateText.indexOf('TRADE GATE'));
  console.log('GATE:', gateChunk.split('\n').map(s => s.trim()).filter(Boolean).join(' | ').slice(0, 700));

  console.log('\n=== 4. Answer WRONG on purpose ===');
  console.log('picked:', await clickBtn(/^[ABCD]\./, 0));
  await page.waitForTimeout(400);
  await snap('gate-answered-wrong');
  console.log('clicked:', await clickBtn(/CONTINUE|CONFIRM|PROCEED|LEARN/));
  await page.waitForTimeout(900);
  console.log('stats after wrong:', await stats());
  await snap('after-wrong');
  const t2 = await body();
  console.log('sanctuary?', /SANCTUARY|Sanctuary|Graham/i.test(t2), '| has "Quiet Oracle":', t2.includes('Quiet Oracle'));

  console.log('\n=== errors ===', errors.length ? errors : 'none');
  await browser.close();
})();
