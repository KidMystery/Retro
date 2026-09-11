// FOCUSED PLAYTEST-DEFECT CHECKS (defects 1, 3, 4)
// 1. Capital-deployment decision cards render NO path labels/spoilers.
// 3. Chest: rapid double-interact pays once; persisted state says empty after.
// 4. Boss MCQ correct answer is NOT always position A across puzzle opens.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  const body = () => page.evaluate(() => document.body.innerText);

  await page.goto('http://localhost:4174/?debug', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /START|NEW GAME|CONTINUE/i.test(b.innerText))?.click());
  await page.waitForTimeout(1200);

  // ── CHECK 1: decision card neutrality ──
  await page.evaluate(() => window.__valhalla.patch({ mapX: 3, mapY: 10 }));
  await page.waitForTimeout(400);
  await page.keyboard.press('e');
  await page.waitForTimeout(600);
  const modalText = await body();
  const badTokens = ['Investor Path', 'Hybrid Path', 'Fail Path', '(Wrong)', 'TRADER path', 'INVESTOR path', 'Trader Mastery', 'Pure Investor', 'T+', 'I+', 'Silver Vein Compass'];
  const found = badTokens.filter(t => modalText.includes(t));
  console.log(`CHECK1 decision-card spoilers: ${found.length === 0 ? 'PASS (none found)' : 'FAIL -> ' + JSON.stringify(found)}`);
  // close via ACCEPT/EXIT
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /ACCEPT CONSEQUENCE|EXIT/i.test(b.innerText))?.click());
  await page.waitForTimeout(300);
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /ACCEPT CONSEQUENCE|EXIT/i.test(b.innerText))?.click());
  await page.waitForTimeout(300);

  // ── CHECK 3: chest rapid double-interact (same-tick re-fire race) ──
  await page.evaluate(() => window.__valhalla.patch({ mapX: 17, mapY: 1 }));
  await page.waitForTimeout(400);
  const f0 = (await page.evaluate(() => window.__valhalla.player().florins));
  // fire two interactions back-to-back with NO wait between (stale-state race)
  await page.evaluate(() => { window.__valhalla; });
  await page.keyboard.press('e');
  await page.keyboard.press('e');
  await page.waitForTimeout(500);
  await page.keyboard.press('e'); // a third after state caught up
  await page.waitForTimeout(500);
  const p1 = await page.evaluate(() => ({ f: window.__valhalla.player().florins, chests: (window.__valhalla.player().openedChests || []).length }));
  const paidOnce = p1.f - f0 === 580 && p1.chests === 1;
  console.log(`CHECK3 chest rapid re-fire: ${paidOnce ? 'PASS' : 'FAIL'} (delta=${p1.f - f0}, openedChests=${p1.chests})`);

  // ── CHECK 4: boss MCQ answer position rotates ──
  await page.evaluate(() => window.__valhalla.startCombat(2));
  await page.waitForTimeout(700);
  // open the attack puzzle 40 times and record where the correct answer sits
  const positions = await page.evaluate(() => {
    const out = [];
    for (let i = 0; i < 40; i++) {
      // simulate openAttackPuzzle: pull a fresh puzzle through the same shuffle path
      // we instead read the rendered DOM each open — but that's slow; replicate via module?
      // Simplest: click ATTACK, read option buttons, pick correct via outcome after answer.
      out.push(null);
    }
    return out;
  });
  // Do it via UI: open puzzle, click each option once is destructive; instead
  // open 12 times, click option A only, read whether CRITICAL STRIKE fired.
  let correctAtA = 0, opens = 0;
  for (let i = 0; i < 12; i++) {
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /ATTACK|STRIKE/i.test(b.innerText) && !/EXECUTE/.test(b.innerText))?.click());
    await page.waitForTimeout(120);
    const opts = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => /^\[A\]/.test(b.innerText)).length);
    if (!opts) { // puzzle pane not open — try ATTACK button again
      continue;
    }
    opens++;
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /^\[A\]/.test(b.innerText))?.click());
    await page.waitForTimeout(120);
    const txt = await body();
    if (/CRITICAL STRIKE/.test(txt)) correctAtA++;
    // reset puzzle state by executing strike
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /EXECUTE STRIKE/i.test(b.innerText))?.click());
    await page.waitForTimeout(150);
  }
  console.log(`CHECK4 boss MCQ: opened=${opens} correct-at-A=${correctAtA} -> ${correctAtA < opens ? 'PASS (not always A)' : 'FAIL (still always A)'}`);
  console.log(`CONSOLE ERRORS: ${errors.length}`);
  errors.forEach(e => console.log('  ERR: ' + e));
  await browser.close();
  process.exit(errors.length === 0 ? 0 : 1);
})().catch(e => { console.error('HARNESS FAILURE:', e); process.exit(2); });
