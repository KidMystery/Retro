// Dungeon scenario v2: full loop — sage, broker gate wrong→sanctuary→learn→pass→trade, scammer.
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
  const clickBtn = async (re, idx = 0) => page.evaluate(({ src, i }) => {
    const rx = new RegExp(src);
    const all = [...document.querySelectorAll('button')].filter(b => rx.test(b.innerText));
    if (all[i]) { all[i].click(); return all[i].innerText.trim().slice(0, 80); }
    return null;
  }, { src: re.source, i: idx });
  const buttons = () => page.evaluate(() =>
    [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(t => t && !/^(SFX|BGM|OVERWORLD|ORACLE LEDGER|PORTFOLIO|INVENTORY|CODEX|REST \+1 DAY|SAVE)/.test(t)));
  const snap = async tag => {
    const t = await body();
    console.log(`\n===== ${tag} =====`);
    console.log(t.split('\n').map(s => s.trim()).filter(Boolean).slice(-10).join(' | '));
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
      // mini-step toward tile center, correcting heading every step
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

  console.log('=== 1. SAGE dialogue + CONTINUE ===');
  await pressE();
  console.log('before:', await stats());
  console.log('continue:', await clickBtn(/CONTINUE/));
  await page.waitForTimeout(400);
  console.log('after:', await stats());

  console.log('\n=== 2. Walk to broker (9,5) ===');
  console.log('pose:', await walkTo([9, 5]));

  console.log('\n=== 3. Broker gate — answer WRONG (choice A) ===');
  await pressE();
  console.log('picked:', await clickBtn(/^[ABCD]\./, 0));
  await page.waitForTimeout(400);
  console.log('continue:', await clickBtn(/CONTINUE|CONFIRM|PROCEED|ACCEPT|LEARN/));
  await page.waitForTimeout(1000);
  console.log('stats after WRONG:', await stats());
  await snap('wrong-answer-fallout');
  const t1 = await body();
  console.log('sanctuary open?', /Sanctuary of Quiet/i.test(t1));

  console.log('\n=== 4. Sanctuary: learn loop ===');
  { // enter sanctuary
    console.log('enter:', await clickBtn(/TO THE SANCTUARY/));
    await page.waitForTimeout(1000);
    console.log('stats in sanctuary:', await stats());
    await snap('sanctuary-open');
    // try each choice until the RESTORE button appears
    for (let idx = 0; idx < 4; idx++) {
      await clickBtn(/^[ABCD]\./, idx);
      await page.waitForTimeout(600);
      const restore = await clickBtn(/RESTORE ALL/);
      if (restore) { console.log(`choice ${idx} was CORRECT →`, restore); break; }
      console.log(`choice ${idx} wrong, retrying`);
      await clickBtn(/RE-READ LESSON/);
      await page.waitForTimeout(400);
    }
    await page.waitForTimeout(900);
    console.log('stats after sanctuary:', await stats());
    await snap('after-sanctuary');
    const tS = await body();
    console.log('protection granted?', /PROTECTION|protection/.test(tS), '| sanctuary still open?', /Sanctuary of Quiet/.test(tS));
  }

  console.log('\n=== 5. Re-open broker gate — answer CORRECT (choice C = third of time value) ===');
  await clickBtn(/\[ESC\] CLOSE/);
  await page.waitForTimeout(500);
  await pressE();
  console.log('picked C:', await clickBtn(/^[ABCD]\./, 2));
  await page.waitForTimeout(500);
  console.log('continue:', await clickBtn(/CONTINUE|CONFIRM|PROCEED|ENTER|BEGIN/));
  await page.waitForTimeout(1200);
  await snap('after-correct-gate');
  const tT = await body();
  console.log('trade desk open?', /TRADE DESK|Trade Desk|BUY|SELL/i.test(tT));
  console.log('stats:', await stats());
  console.log('buttons now:', JSON.stringify(await buttons()));

  console.log('\n=== errors ===', errors.length ? errors : 'none');
  await browser.close();
})();
