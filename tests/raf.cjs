const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const raf = await page.evaluate(() => new Promise(res => {
    let n = 0; const t0 = performance.now();
    const loop = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(loop); else res(n); };
    requestAnimationFrame(loop);
  }));
  console.log('rAF frames in 1s:', raf);
  // test movement directly: does keydown reach the app? move for 1.5s then sample prompt
  await page.locator('button', { hasText: 'START QUEST' }).first().click();
  await page.waitForTimeout(1000);
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(1500);
  await page.keyboard.up('KeyW');
  const txt = await page.evaluate(() => document.body.innerText);
  console.log('prompt present:', txt.includes('Speak to Sage'));
  await browser.close();
})();
