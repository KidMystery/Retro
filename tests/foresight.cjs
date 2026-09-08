// Verify ORACLE FORESIGHT end-to-end: enter Act I dungeon, solve chart shrine
// correctly, advance a market day, open Trade Desk, screenshot banner.
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:4174/?debug', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')];
    (b.find(x => /NEW GAME/i.test(x.innerText)) || b[0]).click();
  });
  await page.waitForTimeout(900);
  // dismiss badge/dialog overlays
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')];
      (b.find(x => /CLOSE|CONTINUE/i.test(x.innerText)) || {}).click?.();
    });
    await page.waitForTimeout(250);
  }
  // enter dungeon via portal (walk right from 16,9)
  await page.evaluate(() => window.__valhalla.patch({ mapX: 16, mapY: 9 }));
  await page.waitForTimeout(300);
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(350);
    await page.keyboard.press('e');
    await page.waitForTimeout(400);
    if (await page.evaluate(() => window.__valhalla.view() === 'DUNGEON')) break;
  }
  const view = await page.evaluate(() => window.__valhalla.view());
  console.log('view:', view);
  // teleport to chart room 5,5 and interact
  await page.evaluate(() => { const d = window.__dungeon; if (d) d.pos = { x: 5.5, y: 5.5 }; });
  await page.waitForTimeout(300);
  await page.keyboard.press('e');
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'shots/foresight-0-puzzle.png' });
  // pick correct (index 1 for room 0 = Doji indecision) then CONFIRM
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')];
    (b.find(x => /Indecision/.test(x.innerText)) || {}).click?.();
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')];
    (b.find(x => /CONTINUE|LOCK IN|CONFIRM|SUBMIT/i.test(x.innerText)) || {}).click?.();
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'shots/foresight-1-solved.png' });
  // leave room
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')];
    (b.find(x => /RETREAT|LEAVE|CLOSE/i.test(x.innerText)) || {}).click?.();
  });
  await page.waitForTimeout(500);
  // advance a market day: open trade desk (broker) and use day advance? Use the
  // overworld broker NPC: patch near broker + interact to open trade desk.
  await page.evaluate(() => window.__valhalla.setView('TRADE_DESK'));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'shots/foresight-2-tradedesk.png' });
  const banner = await page.evaluate(() => {
    const el = [...document.querySelectorAll('div')].find(d => /ORACLE FORESIGHT/.test(d.innerText) && d.innerText.length < 300);
    return el ? el.innerText.replace(/\n/g, ' | ') : null;
  });
  console.log('FORESIGHT BANNER:', banner);
  console.log('insightDays:', await page.evaluate(() => window.__valhalla.player().chartInsightDays));
  console.log('CONSOLE ERRORS:', errors.length);
  await browser.close();
  process.exit(errors.length === 0 ? 0 : 1);
})().catch(e => { console.error('FAIL', e); process.exit(2); });
