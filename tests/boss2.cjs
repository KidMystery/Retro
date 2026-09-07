// Boss kill run: repeat SWORD ATTACK -> pick put-ish correct answer -> EXECUTE STRIKE until dead.
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
  const clickBtn = async (re, idx = 0) => page.evaluate(({ src, i }) => {
    const rx = new RegExp(src);
    const all = [...document.querySelectorAll('button')].filter(b => rx.test(b.innerText));
    if (all[i]) { all[i].click(); return all[i].innerText.trim().slice(0, 90); }
    return null;
  }, { src: re.source, i: idx });
  const setPos = (x, y) => page.evaluate(([x, y]) => { window.__dungeon.pos = { x, y }; }, [x, y]);
  const pressE = async () => { await page.keyboard.press('KeyE'); await page.waitForTimeout(900); };

  await setPos(17.5, 15.5); await pressE();
  console.log('in combat:', /SWORD ATTACK/.test(await body()));

  const combatOpen = () => page.evaluate(() => document.body.innerText.includes('SWORD ATTACK'));
  for (let turn = 0; turn < 12; turn++) {
    if (!(await combatOpen())) { console.log('combat view gone at turn', turn); break; }
    const t = await body();
    if (/GUARDIAN VANQUISHED|ACT \d CLEARED|RESOLUTION/i.test(t)) { console.log('>> defeated'); break; }
    // open puzzle
    await clickBtn(/SWORD ATTACK/); await page.waitForTimeout(500);
    const t2 = await body();
    const choices = t2.split('\n').filter(l => /^\[[A-D]\]/.test(l.trim()));
    console.log('turn', turn, 'choices:', choices.length);
    // pick best: prefer choices with "Put" and ("Buy" or "Protective"/"Cash-Secured"/"Bear"), avoid "Call"-only & "Naked" & "margin"
    let pick = 0, best = -1;
    choices.forEach((c, i) => {
      let score = 0;
      if (/Put/i.test(c)) score += 2;
      if (/Buy|Purchase|Protective|Cash-Secured|Bear/i.test(c)) score += 1;
      if (/Call/i.test(c)) score -= 2;
      if (/Naked|margin|50x|lottery|Momentum|chase/i.test(c)) score -= 3;
      if (score > best) { best = score; pick = i; }
    });
    console.log('  pick:', (choices[pick] || 'none').slice(0, 70));
    if (choices.length) { await clickBtn(/^\[[A-D]\]/, pick); await page.waitForTimeout(400); }
    const ex = await clickBtn(/EXECUTE STRIKE/);
    console.log('  execute:', ex ? 'ok' : 'null');
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `shots/bossrun-${turn}.png` });
  }
  const tEnd = await body();
  console.log('TAIL:', tEnd.split('\n').map(s => s.trim()).filter(Boolean).slice(-10).join(' | ').slice(0, 900));
  console.log('\n=== errors ===', errors.length ? errors : 'none');
  await browser.close();
})();
