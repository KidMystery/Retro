const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('http://localhost:3000/?debug');
  await p.waitForTimeout(2500);
  for (let i = 0; i < 8; i++) {
    const ov = p.locator('div.fixed.inset-0.z-50');
    if (!(await ov.count()) || !(await ov.first().isVisible())) break;
    await ov.first().click({ force: true, timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(600);
  }
  await p.getByText('START QUEST • ENTER OVERWORLD').click();
  await p.waitForTimeout(1500);
  await p.evaluate(() => { const d = window.__dungeon; d.pos = { x: 2.5, y: 4.1 }; d.dir = Math.PI / 2; });
  await p.waitForTimeout(400);
  await p.keyboard.press('KeyE');
  await p.waitForTimeout(1200);
  console.log('sage portrait:', await p.evaluate(() => {
    const im = document.querySelector('div.zelda-panel img[src*="sage"]');
    if (!im) return 'MISSING';
    const r = im.getBoundingClientRect();
    return `VISIBLE ${Math.round(r.width)}x${Math.round(r.height)} natural=${im.naturalWidth}`;
  }));
  await b.close();
})();
