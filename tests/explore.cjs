// Exploratory: load app, dump visible text + buttons, capture console errors
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const text = await page.evaluate(() => document.body.innerText);
  console.log('=== BODY TEXT (first 2000) ===');
  console.log(text.slice(0, 2000));
  const btns = await page.evaluate(() =>
    [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean));
  console.log('=== BUTTONS ===');
  console.log(JSON.stringify(btns, null, 1));
  console.log('=== CONSOLE ERRORS ===', errors.length ? errors : 'none');
  await page.screenshot({ path: 'shots/01-boot.png' });
  await browser.close();
})();
