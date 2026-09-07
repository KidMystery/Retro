// Clean boss test: fresh page → boss directly → combat → solve puzzle → resolution.
const { chromium } = require('playwright');
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
  const clickBtn = async (re, idx = 0) => page.evaluate(({ src, i }) => {
    const rx = new RegExp(src);
    const all = [...document.querySelectorAll('button')].filter(b => rx.test(b.innerText));
    if (all[i]) { all[i].click(); return all[i].innerText.trim().slice(0, 70); }
    return null;
  }, { src: re.source, i: idx });
  const setPos = (x, y) => page.evaluate(([x, y]) => { window.__dungeon.pos = { x, y }; }, [x, y]);
  const pressE = async () => { await page.keyboard.press('KeyE'); await page.waitForTimeout(900); };

  await setPos(17.5, 15.5); await pressE();
  await page.screenshot({ path: 'shots/boss-open.png' });
  const t = await body();
  console.log('combat?', /BEAR PHANTOM|ENCOUNTER:|GUARDIAN/i.test(t));
  console.log('tail:', t.split('\n').map(s => s.trim()).filter(Boolean).slice(-12).join(' | ').slice(0, 700));
  const btns = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(t => t && t.length < 80));
  console.log('buttons:', JSON.stringify(btns.slice(-10)));

  // combat is puzzle-based: answer attack puzzle correctly up to 5 turns
  for (let turn = 0; turn < 6; turn++) {
    const tb = await body();
    if (/VANQUISHED|VICTORY|GUARDIAN VANQUISHED|Act .* cleared|RESOLUTION/i.test(tb)) { console.log('>> boss defeated at turn', turn); break; }
    // pick the correct puzzle answer: try each A/B/C/D then attack button
    const ans = await clickBtn(/^\[[A-D]\]/, turn % 4);
    if (ans) { console.log('turn', turn, 'answer:', ans.slice(0, 50)); await page.waitForTimeout(300); }
    const atk = await clickBtn(/STRIKE|ATTACK|EXECUTE|SWING|UNLEASH/);
    console.log('  attack:', atk);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `shots/boss-turn${turn}.png` });
  }
  const tEnd = await body();
  console.log('final tail:', tEnd.split('\n').map(s => s.trim()).filter(Boolean).slice(-8).join(' | ').slice(0, 500));
  console.log('chapter still 1?', /#1/.test(tEnd), '| VICTORY?', tEnd.includes('VICTORY') || tEnd.includes('CROWN'));
  console.log('\n=== errors ===', errors.length ? errors : 'none');
  await browser.close();
})();
