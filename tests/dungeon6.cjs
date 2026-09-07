// Scenario v4: chest, shrine, undervalued asset, scam TAKE BAIT, boss -> combat -> resolution path.
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
  const stats = () => page.evaluate(() => {
    const t = document.body.innerText;
    return {
      hearts: (t.match(/([\d.]+)\/(\d+) ♥/) || []).slice(1).join('/'),
      florins: (t.match(/([\d,]+) ƒ/) || [])[1] || '?',
      bond: (t.match(/Bond Lv ([\d.]+)/) || [])[1] || '?',
      ch: (t.match(/DAY\n?#(\d)/) || [])[1] || (t.match(/#(\d)/) || [])[1],
    };
  });
  const clickBtn = async (re, idx = 0) => page.evaluate(({ src, i }) => {
    const rx = new RegExp(src);
    const all = [...document.querySelectorAll('button')].filter(b => rx.test(b.innerText));
    if (all[i]) { all[i].click(); return all[i].innerText.trim().slice(0, 70); }
    return null;
  }, { src: re.source, i: idx });
  const setPos = (x, y) => page.evaluate(([x, y]) => { window.__dungeon.pos = { x, y }; }, [x, y]);
  const pressE = async () => { await page.keyboard.press('KeyE'); await page.waitForTimeout(800); };
  const log = async tag => { console.log(tag, await stats()); await page.screenshot({ path: `shots/${tag}.png` }); };

  // chest at (9,15)
  await setPos(9.5, 15.5); await pressE();
  console.log('chest:', await clickBtn(/OPEN|OPENING|LOOT|TAKE/));
  await page.waitForTimeout(800); await log('s4-chest');
  await clickBtn(/CLOSE|CONTINUE|COLLECT/); await page.waitForTimeout(400);

  // shrine at (12,9)
  await setPos(12.5, 9.5); await pressE();
  console.log('shrine modal? ', /SAVE|Shrine|PRAY/i.test(await body()));
  const saveBtn = await clickBtn(/SAVE|PRAY|CONFIRM/);
  console.log('save:', saveBtn);
  await page.waitForTimeout(900); await log('s4-shrine');
  await clickBtn(/CLOSE|RETURN|CANCEL|DONE/); await page.waitForTimeout(400);
  await clickBtn(/CLOSE|RETURN|CANCEL|DONE/); await page.waitForTimeout(400);

  // undervalued asset at (2,9)
  await setPos(2.5, 9.5); await pressE();
  await page.screenshot({ path: 'shots/s4-asset.png' });
  const tA = await body();
  console.log('asset modal?', /MINE|Deep Value|ASSET|Inspect/i.test(tA));
  console.log('asset buttons sample:', JSON.stringify((await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(t => t && /BUY|INSPECT|PASS|CLOSE|INVEST/i.test(t)))).slice(0, 6)));
  await clickBtn(/CLOSE|PASS|LEAVE/); await page.waitForTimeout(400);

  // scammer 1 at (10,9): TAKE BAIT
  await setPos(10.5, 9.5); await pressE();
  console.log('take bait:', await clickBtn(/TAKE BAIT/));
  await page.waitForTimeout(1000); await log('s4-bait');
  const tB = await body();
  console.log('bait fallout — rugpull modal?', /Rug Pull|RUG_PULL|Ponzi/i.test(tB), '| sanctuary?', /Sanctuary of Quiet/i.test(tB));
  console.log('bait continue:', await clickBtn(/TO THE SANCTUARY|CONTINUE|LEARN/));
  await page.waitForTimeout(800);

  // boss at (17,15)
  await setPos(17.5, 15.5); await pressE();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'shots/s4-boss.png' });
  const tBoss = await body();
  console.log('combat open?', /COMBAT|BEAR|GUARDIAN|BOSS FIGHT|HP/i.test(tBoss));
  console.log('combat buttons:', JSON.stringify((await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(t => t && t.length < 60))).slice(0, 14)));
  console.log('stats:', await stats());

  console.log('\n=== errors ===', errors.length ? errors : 'none');
  await browser.close();
})();
