// MOBILE PASS VERIFICATION — 390x844 (iPhone SE/14 Pro class) + 1382x746 desktop.
// Checks: no horizontal overflow, visible buttons >= 44x44, small fonts >= 14px,
// zero console errors. Screenshots in shots/mobile-*.png.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  let failures = 0;

  for (const vp of [{ width: 390, height: 844, tag: 'mobile' }, { width: 1382, height: 746, tag: 'desktop' }]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    page.on('console', m => { if (m.type() === 'error') errors.push(`[${vp.tag}] ${m.text()}`); });
    page.on('pageerror', e => errors.push(`[${vp.tag}] PAGEERROR ${e.message}`));
    await page.goto('http://localhost:4174/?debug', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Title screen
    await page.screenshot({ path: `shots/mobile-${vp.tag}-title.png` });

    // Start a new game (click the highlighted/new-game option)
    const started = await page.evaluate(() => {
      const els = [...document.querySelectorAll('button, [role="button"], .title-option, div')];
      const target = els.find(e => /new game|begin|start/i.test(e.textContent || '') && e.children.length < 8);
      if (target) { target.click(); return target.textContent.trim().slice(0, 40); }
      return null;
    });
    await page.waitForTimeout(800);
    console.log(`[${vp.tag}] clicked: ${started}`);

    // Overworld — verify overflow + buttons + fonts
    const audit = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflows = [];
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > vw + 2 && getComputedStyle(el).position !== 'fixed') {
          overflows.push(`${el.tagName}.${(el.className + '').toString().slice(0, 40)} right=${Math.round(r.right)}`);
        }
      });
      const docOverflow = document.documentElement.scrollWidth > vw + 2;
      const smallBtns = [];
      document.querySelectorAll('button').forEach(b => {
        const r = b.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44)) {
          smallBtns.push(`${(b.textContent || b.ariaLabel || '?').trim().slice(0, 24)} ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      });
      const smallFonts = [];
      document.querySelectorAll('span, div, p, td, th, a').forEach(el => {
        if (!el.children.length && el.textContent && el.textContent.trim().length > 2) {
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs < 13.9) smallFonts.push(`${fs}px "${el.textContent.trim().slice(0, 24)}"`);
        }
      });
      return { vw, docOverflow, overflows: overflows.slice(0, 10), smallBtns: smallBtns.slice(0, 15), smallFonts: [...new Set(smallFonts)].slice(0, 15) };
    });
    console.log(`[${vp.tag}] docOverflow=${audit.docOverflow} vw=${audit.vw}`);
    if (audit.docOverflow || audit.overflows.length) { failures++; console.log(`  OVERFLOWS:`, audit.overflows); }
    if (vp.tag === 'mobile' && audit.smallBtns.length) { failures++; console.log(`  SMALL BUTTONS:`, audit.smallBtns); }
    if (vp.tag === 'mobile' && audit.smallFonts.length) { failures++; console.log(`  SMALL FONTS:`, audit.smallFonts); }

    // Open the Trade Desk (biggest modal) and re-audit
    await page.evaluate(() => {
      const els = [...document.querySelectorAll('button')];
      const b = els.find(e => /trade|ledger|oracle/i.test(e.textContent || ''));
      if (b) b.click();
    });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `shots/mobile-${vp.tag}-tradedesk.png` });
    const tradeAudit = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflows = [];
      document.querySelectorAll('body *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > vw + 2 && getComputedStyle(el).position !== 'fixed') {
          overflows.push(`${el.tagName}.${(el.className + '').slice(0, 40)} right=${Math.round(r.right)}`);
        }
      });
      const smallBtns = [];
      document.querySelectorAll('button').forEach(b => {
        const r = b.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44)) {
          smallBtns.push(`${(b.textContent || '?').trim().slice(0, 24)} ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      });
      return { docOverflow: document.documentElement.scrollWidth > vw + 2, overflows: overflows.slice(0, 10), smallBtns: smallBtns.slice(0, 15) };
    });
    console.log(`[${vp.tag}] tradeDesk docOverflow=${tradeAudit.docOverflow}`);
    if (vp.tag === 'mobile' && (tradeAudit.docOverflow || tradeAudit.overflows.length)) { failures++; console.log(`  TRADE OVERFLOWS:`, tradeAudit.overflows); }
    if (vp.tag === 'mobile' && tradeAudit.smallBtns.length) { failures++; console.log(`  TRADE SMALL BUTTONS:`, tradeAudit.smallBtns); }

    await page.close();
  }

  await browser.close();
  console.log(`CONSOLE ERRORS: ${errors.length}`);
  errors.slice(0, 10).forEach(e => console.log('  ' + e));
  console.log(failures === 0 && errors.length === 0 ? 'MOBILE PASS: GREEN' : `MOBILE PASS: ${failures} FAILURES`);
  process.exit(failures === 0 && errors.length === 0 ? 0 : 1);
})();
