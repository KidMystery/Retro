// Dungeon scenario v3: sanctuary trial correct, trade forge, scammer rug-pull.
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
      protections: (t.match(/(\d+) Graham Shields/) || [])[1] || '?',
    };
  });
  const clickBtn = async (re, idx = 0) => page.evaluate(({ src, i }) => {
    const rx = new RegExp(src);
    const all = [...document.querySelectorAll('button')].filter(b => rx.test(b.innerText));
    if (all[i]) { all[i].click(); return all[i].innerText.trim().slice(0, 70); }
    return null;
  }, { src: re.source, i: idx });
  const snap = async tag => {
    const t = await body();
    console.log(`\n===== ${tag} =====`);
    console.log(t.split('\n').map(s => s.trim()).filter(Boolean).slice(-8).join(' | '));
    await page.screenshot({ path: `shots/${tag}.png` });
  };
  const norm = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const walkTo = async goal => {
    for (let guard = 0; guard < 400; guard++) {
      const p = await pose();
      const [px, py] = [Math.floor(p.x), Math.floor(p.y)];
      if (px === goal[0] && py === goal[1] && Math.abs(p.x - (goal[0] + 0.5)) < 0.2 && Math.abs(p.y - (goal[1] + 0.5)) < 0.2) return p;
      const path = bfsPath([px, py], goal).slice(1);
      if (!path.length) return p;
      const [nx, ny] = path[0];
      const tx = nx + 0.5, ty = ny + 0.5;
      for (let s = 0; s < 40; s++) {
        const cur = await pose();
        const dx = tx - cur.x, dy = ty - cur.y;
        if (Math.hypot(dx, dy) < 0.12) break;
        const want = Math.atan2(dy, dx);
        let diff = norm(want - cur.dir), spins = 0;
        while (Math.abs(diff) > 0.04 && spins++ < 30) {
          const k = diff > 0 ? 'KeyD' : 'KeyA';
          await page.keyboard.down(k); await page.waitForTimeout(40); await page.keyboard.up(k);
          diff = norm(want - (await pose()).dir);
        }
        await page.keyboard.down('KeyW'); await page.waitForTimeout(90); await page.keyboard.up('KeyW');
      }
      await page.waitForTimeout(60);
    }
    return pose();
  };
  const pressE = async () => { await page.keyboard.press('KeyE'); await page.waitForTimeout(700); };

  console.log('=== 1. Trigger broker gate wrong → sanctuary ===');
  console.log('pose:', await walkTo([9, 5]));
  await pressE();
  await clickBtn(/^[ABCD]\./, 0); await page.waitForTimeout(400);
  console.log('gate continue:', await clickBtn(/PROCEED|CONTINUE/)); await page.waitForTimeout(800);
  console.log('enter sanctuary:', await clickBtn(/TO THE SANCTUARY/)); await page.waitForTimeout(900);
  console.log('stats (penalized):', await stats());
  console.log('\n=== 2. Sanctuary trial — answer correctly ([B] final 30-7 days) ===');
  for (let idx = 0; idx < 4; idx++) {
    await clickBtn(/^\[[A-D]\]/, idx);
    await page.waitForTimeout(600);
    const restore = await clickBtn(/RESTORE ALL/);
    if (restore) { console.log(`choice ${idx} CORRECT →`, restore); break; }
    console.log(`choice ${idx} wrong`);
    await clickBtn(/RE-READ LESSON/); await page.waitForTimeout(400);
  }
  await page.waitForTimeout(900);
  console.log('stats after sanctuary (hearts restored, protection +1):', await stats());
  await snap('sanctuary-complete');
  console.log('sanctuary closed?', !/TRIAL OF WISDOM/.test(await body()));

  console.log('\n=== 3. Broker gate correct → trade desk → FORGE a rune ===');
  await clickBtn(/\[ESC\] CLOSE/); await page.waitForTimeout(400);
  await pressE(); await page.waitForTimeout(600);
  console.log('picked C:', await clickBtn(/^[ABCD]\./, 2)); await page.waitForTimeout(400);
  console.log('proceed:', await clickBtn(/PROCEED TO TRADE DESK/)); await page.waitForTimeout(1000);
  console.log('stats before trade:', await stats());
  console.log('forge:', await clickBtn(/FORGE SPEAR OF BULLISH LIGHT/)); await page.waitForTimeout(1200);
  await snap('after-forge');
  console.log('stats after trade:', await stats());
  // close trade desk
  console.log('close ledger:', await clickBtn(/CLOSE LEDGER/)); await page.waitForTimeout(600);
  const tClose = await body();
  console.log('desk closed?', !/FORGE SPEAR/.test(tClose));

  console.log('\n=== 4. Walk to scammer (10,9) → rug-pull flow ===');
  console.log('pose:', await walkTo([10, 9]));
  await pressE();
  await snap('scammer-modal');
  const tScam = await body();
  console.log('scam text:', tScam.split('\n').map(s => s.trim()).filter(Boolean).slice(-10).join(' | ').slice(0, 600));
  console.log('invest button:', await clickBtn(/INVEST|BUY|GIVE|FALL FOR|ACCEPT/)); await page.waitForTimeout(1000);
  await snap('scam-result');
  console.log('stats after scam:', await stats());
  const tPost = await body();
  console.log('rug pull lesson?', /Rug|RUG|Ponzi|SBF|Sanctuary/i.test(tPost));

  console.log('\n=== errors ===', errors.length ? errors : 'none');
  await browser.close();
})();
