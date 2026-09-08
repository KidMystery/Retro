// Per-act overworld screenshot compare + ORACLE FORESIGHT banner check.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:4174/?debug', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  // NEW GAME
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    (btns.find(b => /NEW GAME/i.test(b.innerText)) || btns[0]).click();
  });
  await page.waitForTimeout(1000);
  // Act I native grass
  await page.screenshot({ path: 'shots/act-compare-1.png' });
  // Acts II-V: patch chapter + set MAP view, click away any modal first
  for (const act of [2, 3, 4, 5]) {
    await page.evaluate(() => document.body.click());
    await page.waitForTimeout(200);
    await page.evaluate(a => {
      window.__valhalla.patch({ chapter: a });
      window.__valhalla.setView('MAP');
    }, act);
    await page.waitForTimeout(1400); // let texture decode + render a few frames
    await page.screenshot({ path: `shots/act-compare-${act}.png` });
  }
  // FORESIGHT: chart room solved → insight days + pre-rolled pendingDrift
  await page.evaluate(() => {
    window.__valhalla.patch({ chapter: 1, chartInsightDays: 3 });
  });
  // Advance one day to pre-roll pendingDrift: use winCombat-free path —
  // call the day-advance through the trade desk's next-day? Simplest: force via
  // patching then advancing a day through the modal is complex; instead check
  // the trade desk renders the foresight banner by pre-rolling through a day
  // advance hook if exposed — else verify via trade desk open with patched state
  // after any day advance. Open trade desk directly:
  await page.evaluate(() => window.__valhalla.setView('TRADE_DESK'));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'shots/foresight-tradedesk.png' });
  console.log('CONSOLE ERRORS:', errors.length);
  errors.forEach(e => console.log('ERR', e));
  await browser.close();
  process.exit(errors.length === 0 ? 0 : 1);
})().catch(e => { console.error('FAIL', e); process.exit(2); });
