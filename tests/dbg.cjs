const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:4174/?debug', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.locator('button', { hasText: 'START QUEST' }).first().click();
  await page.waitForTimeout(1000);
  // open sage, then close via continue
  await page.keyboard.press('KeyE'); await page.waitForTimeout(600);
  const r1 = await page.evaluate(() => {
    const all = [...document.querySelectorAll('button')];
    return { n: all.length, texts: all.map(b => b.innerText.trim().slice(0, 40)) };
  });
  console.log(JSON.stringify(r1, null, 1));
  const clicked = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(b => b.innerText.includes('CONTINUE'));
    if (b) { b.click(); return 'clicked'; } return 'not found';
  });
  console.log('continue:', clicked);
  // open broker gate: teleport to (9.5,5.5) then E
  await page.evaluate(() => { window.__dungeon.pos = { x: 9.5, y: 5.5 }; });
  await page.waitForTimeout(300);
  await page.keyboard.press('KeyE'); await page.waitForTimeout(800);
  const r2 = await page.evaluate(() => {
    const all = [...document.querySelectorAll('button')];
    return { n: all.length, texts: all.map(b => b.innerText.trim().slice(0, 50)) };
  });
  console.log(JSON.stringify(r2, null, 1));
  await browser.close();
})();
