// Focused check (defect 6): boss victory shows the region-gate progression beat.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4174/?debug', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /START|NEW GAME|CONTINUE/i.test(b.innerText))?.click());
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.__valhalla.startCombat(1));
  await page.waitForTimeout(700);
  await page.evaluate(() => window.__valhalla.winCombat());
  await page.waitForTimeout(1000);
  const txt = await page.evaluate(() => document.body.innerText);
  const beat = txt.includes('REGION CLEARED') && txt.includes('OPEN THE WAY');
  const namesNext = txt.includes('Theta Steppes') || txt.includes('Glassmarket');
  console.log(`CHECK6 region beat: ${beat && namesNext ? 'PASS' : 'FAIL'} (beat=${beat}, nextRegionNamed=${namesNext})`);
  await page.screenshot({ path: 'shots/focused-region-beat.png' });
  // CONTINUE routes to the next act's map
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /OPEN THE WAY/i.test(b.innerText))?.click());
  await page.waitForTimeout(600);
  const v = await page.evaluate(() => ({ view: window.__valhalla.view(), chapter: window.__valhalla.player().chapter }));
  console.log(`CHECK6 continue: view=${v.view} chapter=${v.chapter} -> ${v.view === 'MAP' && v.chapter === 2 ? 'PASS' : 'FAIL'}`);
  console.log(`PAGE ERRORS: ${errors.length}`);
  await browser.close();
  process.exit(errors.length === 0 ? 0 : 1);
})().catch(e => { console.error('HARNESS FAILURE:', e); process.exit(2); });
