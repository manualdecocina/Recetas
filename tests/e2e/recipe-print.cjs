/* Actual application PDF regression, including arbitrary late third-party blocks.
 * Artifacts are retained for visual review; text assertions catch missing steps. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const base = process.env.AUDIT_BASE || 'http://127.0.0.1:3000';
const output = 'recipe-print-qa';
const compact = text => text.replace(/\s+/gu, '');

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await context.route(/googlesyndication|doubleclick|fundingchoices|googletagmanager/, route => route.abort());
  // Production media is not stored in Git. Use the exact published cover bytes
  // prepared for this isolated build, without depending on the image optimizer.
  const assets = new Map(JSON.parse(fs.readFileSync(`${output}/assets.json`, 'utf8')).map(asset => [asset.source, asset]));
  await context.route('**/_next/image?**', route => {
    const asset = assets.get(new URL(route.request().url()).searchParams.get('url'));
    return asset ? route.fulfill({ path: asset.file, contentType: asset.mime }) : route.continue();
  });
  const page = await context.newPage();
  const report = [];
  try {
    await page.goto(`${base}/tiramisu`, { waitUntil: 'networkidle' });
    const languages = await page.locator('link[rel="alternate"][hreflang]').evaluateAll(links => links
      .filter(link => link.hreflang !== 'x-default').map(link => ({
        lang: link.hreflang, path: new URL(link.href).pathname,
      })));
    assert.equal(languages.length, 7, 'all seven translations are covered');
    const cases = [...languages, { lang: 'es-guacamole', path: '/receta-guacamole/' }, { lang: 'es-tamal', path: '/es/receta/tamal-tolimense' }];
    for (const entry of cases) {
      await page.goto(`${base}${entry.path}`, { waitUntil: 'networkidle' });
      const title = await page.locator('.md-recipe-hero h1').innerText();
      const ingredients = await page.locator('.md-ingredient-checkbox > span').allTextContents();
      const steps = await page.locator('.md-step-text p').allTextContents();
      const notes = await page.locator('.md-notes .md-rich').allTextContents();
      assert(ingredients.length && steps.length, 'real recipe content is present');
      await page.evaluate(() => {
        document.documentElement.dataset.theme = 'dark';
        document.querySelector('.md-site').setAttribute('aria-hidden', 'true');
        const add = (parent, className, value) => {
          const node = document.createElement('div');
          node.className = className;
          node.style.cssText = 'min-height:350px;padding:80px';
          node.innerHTML = `<p>${value}</p>`;
          parent.append(node);
        };
        add(document.body, 'unknown-third-party-wrapper', 'FORBIDDEN_UNKNOWN_OVERLAY');
        add(document.querySelector('.md-article'), 'google-auto-placed', 'FORBIDDEN_AUTOMATIC_AD');
        add(document.querySelector('.md-notes .md-rich') || document.querySelector('.md-article'), 'google-auto-placed', 'FORBIDDEN_AD_INSIDE_NOTES');
        window.print = () => { window.dispatchEvent(new Event('beforeprint')); };
      });
      await page.locator('.md-article-actions button[aria-busy]').click();
      await page.locator('#md-recipe-print-root').waitFor({ state: 'attached' });
      assert.equal(await page.locator('#md-recipe-print-root .md-print-cover').count(), 1, 'the recipe cover is retained');
      const sheet = await page.locator('#md-recipe-print-root').textContent();
      for (const phrase of [title, ...ingredients, ...steps, ...notes]) assert(compact(sheet).includes(compact(phrase)), `print retains: ${phrase}`);
      assert(!sheet.includes('FORBIDDEN_'));
      assert.equal(await page.locator('#md-recipe-print-root iframe,#md-recipe-print-root button,#md-recipe-print-root input').count(), 0);
      const pdfPath = `${output}/${entry.lang}.pdf`;
      await page.pdf({ path: pdfPath, printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
      const pdfText = execFileSync('pdftotext', ['-layout', pdfPath, '-'], { encoding: 'utf8' });
      for (const phrase of [title, ...ingredients, ...steps, ...notes]) assert(compact(pdfText).includes(compact(phrase)), `PDF retains: ${phrase}`);
      for (const forbidden of ['FORBIDDEN_', 'Pinterest', 'CONSENTIMIENTO_FLOTANTE', 'PUBLICIDAD_CABECERA']) assert(!pdfText.includes(forbidden), `${forbidden} is not printed`);
      const pages = pdfText.split('\f').filter(value => value.trim());
      assert(pages.every(value => value.trim().length > 100), 'no empty or page-number-only pages');
      assert(pages.length <= (entry.lang === 'es-tamal' ? 4 : 3), 'compact pagination for the sample');
      assert.equal(await page.locator('#md-recipe-print-root').count(), 0, 'afterprint restores normal screen DOM');
      assert.equal(await page.locator('.md-article-actions button[aria-busy="true"]').count(), 0);
      assert(await page.locator('.md-recipe-hero h1').isVisible());
      report.push({ ...entry, title, ingredients: ingredients.length, steps: steps.length, pages: pages.length, bytes: fs.statSync(pdfPath).size, textCharacters: pdfText.length });
    }
    // The browser's print command must prepare the same sheet without clicking our button.
    await page.goto(`${base}/tiramisu`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#md-recipe-print-root').count(), 0);
    const direct = `${output}/browser-print.pdf`;
    await page.pdf({ path: direct, printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
    const directText = execFileSync('pdftotext', ['-layout', direct, '-'], { encoding: 'utf8' });
    assert(directText.includes('Tiramisú'));
    assert(!directText.includes('También te puede gustar'));
    assert(!directText.includes('Preguntas frecuentes'));
    fs.writeFileSync(`${output}/report.json`, JSON.stringify({ cases: report, browserPrint: 'PASS', result: 'PASS' }, null, 2));
    console.log('PASS: recipe print button, browser Print, 7 languages, ads injected inside/outside article, complete ingredients and steps, no blank pages, dark theme and cleanup.', JSON.stringify(report));
  } finally { await context.close(); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
