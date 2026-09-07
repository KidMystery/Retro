// Play: start quest, dump views
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const click = async t => {
    const b = page.locator('button', { hasText: t }).first();
    if (await b.count()) { await b.click(); await page.waitForTimeout(800); return true; }
    return false;
  };
  console.log('start:', await click('START QUEST'));
  await page.screenshot({ path: 'shots/02-overworld.png' });
  console.log((await page.evaluate(() => document.body.innerText)).slice(0, 1500));
  console.log('=== errors ===', errors.length ? errors : 'none');
  await browser.close();
})();
