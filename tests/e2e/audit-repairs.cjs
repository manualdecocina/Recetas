const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.AUDIT_BASE || 'http://127.0.0.1:3000';
(async () => {
 const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
 fs.mkdirSync('audit-repairs-qa', { recursive: true });
 try {
  for (const width of [390, 1366]) {
   const context = await browser.newContext({ viewport: { width, height: 900 } });
   const page = await context.newPage();
   const errors = [];
   page.on('pageerror', e => errors.push(e.message));
   await context.route(/pagead2\.googlesyndication\.com/, route => route.fulfill({status:200,contentType:'application/javascript',body:'/* Advertising transport mocked in QA. */'}));
   await page.goto(`${base}/es`, { waitUntil: 'networkidle' });
   const drawer = page.locator('.md-cookie-drawer');
   await drawer.waitFor();
   await page.locator('#md-adsense-script').waitFor({state:'attached'});
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
   assert.equal(await page.getByRole('button', {name:'Rechazar publicidad',exact:true}).count(),0);
   await page.getByRole('button', {name:'Continuar',exact:true}).click();
   await drawer.waitFor({state:'hidden'});
   assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('manualdecocina:privacy:v2')).advertising), undefined);
   await page.reload({waitUntil:'networkidle'});
   assert.equal(await drawer.count(),0);
   await page.locator('#md-adsense-script').waitFor({state:'attached'});
   await page.getByRole('button',{name:'Preferencias de cookies',exact:true}).click();
   await drawer.waitFor();
   assert.equal(await drawer.getByRole('checkbox').count(),0);
   await page.screenshot({path:`audit-repairs-qa/cookies-${width}.png`});
   await page.getByRole('button',{name:'Continuar',exact:true}).click();
   await page.goto(`${base}/como-preparar-cerveza-artesanal`, { waitUntil: 'networkidle' });
   assert(!await page.locator('main').innerText().then(t => t.includes('43380 min')));
   await page.getByRole('button', { name: 'Guardar', exact: true }).click();
   await page.getByRole('button', { name: 'Guardada', exact: true }).waitFor();
   await page.goto(`${base}/es/favoritos`, { waitUntil: 'networkidle' });
   await page.locator('.md-recipe-card').waitFor();
   assert.equal(await page.locator('.md-recipe-card').count(), 1);
   await page.reload({waitUntil:'networkidle'});
   await page.locator('.md-recipe-card').waitFor();
   await page.screenshot({ path: `audit-repairs-qa/favorites-${width}.png` });
   await page.goto(`${base}/en/favoritos`, { waitUntil: 'networkidle' });
   await page.locator('.md-recipe-card').waitFor();
   await page.getByRole('button', { name: /^Remove from favorites:/ }).click();
   await page.getByText('You have not saved any recipes yet.').waitFor();
   await page.goto(`${base}/es/que-puedo-cocinar`, { waitUntil: 'networkidle' });
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
   await page.getByPlaceholder('Busca un ingrediente (ajo, limón, arroz...)').fill('patata');
   assert.equal(await page.getByRole('option').count(),1);
   assert.equal(await page.getByRole('option').innerText().then(t => /hervida|pelada|cocer/.test(t)),false);
   await page.getByRole('option',{name:'Papa',exact:true}).click();
   await page.getByRole('button',{name:/Ver qué puedo cocinar/}).click();
   await page.getByRole('heading',{name:/Puré de papa/}).waitFor();
   await page.screenshot({ path: `audit-repairs-qa/pantry-${width}.png` });
   assert.deepEqual(errors, [], `page errors at ${width}`);
   await context.close();
  }
  const context = await browser.newContext(); const page = await context.newPage();
  for (const lang of ['es','en','de','fr','it','ja','pt']) {
   await page.goto(`${base}/${lang}`, {waitUntil:'networkidle'});
   await page.locator('.md-cookie-drawer').waitFor();
   assert.equal(await page.locator('.md-cookie-actions button').count(),2);
  }
  await context.close();
  console.log('PASS: global drawer, acknowledgement persistence, no local ad veto, CMP-managed choices, favorite save/reload/language/remove, Papa/purée, responsive widths, seven languages.');
 } finally { await browser.close(); }
})().catch(e => { console.error(e);process.exitCode=1; });
