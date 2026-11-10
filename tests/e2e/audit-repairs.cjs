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
   await context.route(/pagead2\.googlesyndication\.com/, route => route.fulfill({status:200,contentType:'application/javascript',body:`window.__tcfapi = (command, version, callback) => callback({gdprApplies:true,listenerId:1},true); const pending = window.googlefc?.callbackQueue || []; window.googlefc = {showRevocationMessage:()=>{},callbackQueue:{push:entry=>entry.CONSENT_API_READY?.()}}; pending.forEach(entry=>entry.CONSENT_API_READY?.());`}));
   await page.goto(`${base}/es`, { waitUntil: 'networkidle' });
   assert.equal(await page.locator('.md-cookie-drawer').count(),0,'no informational banner replaces the real CMP');
   await page.locator('#md-adsense-script').waitFor({state:'attached'});
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
   assert.equal(await page.getByRole('button',{name:'Continuar',exact:true}).count(),0);
   assert(await page.getByRole('button',{name:'Preferencias de cookies',exact:true}).isVisible());
   await page.goto(`${base}/como-preparar-cerveza-artesanal`, { waitUntil: 'networkidle' });
   assert(!await page.locator('main').innerText().then(t => t.includes('43380 min')));
   for (const id of ['md-ingredientes', 'md-preparacion']) {
    assert(await page.locator(`.md-recipe-jumps a[href="#${id}"]`).isVisible());
    assert.equal(await page.locator(`#${id}`).count(), 1);
   }
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
   const potato=page.getByRole('option',{name:'Papa',exact:true});
   assert.equal(await potato.count(),1,'raw potato has one consolidated choice; distinct processed products may also match');
   assert.equal(await potato.innerText().then(t => /hervida|pelada|cocer/.test(t)),false);
   await page.getByRole('option',{name:'Papa',exact:true}).click();
   await page.getByRole('button',{name:/Ver qué puedo cocinar/}).click();
   await page.getByRole('heading',{name:'Te faltan ingredientes',exact:true}).waitFor();
   await page.getByRole('heading',{name:/Puré de papa/}).waitFor();
   assert.equal(await page.getByRole('heading',{name:'Puedes preparar ahora',exact:true}).count(),0,'selecting only a potato must not suggest a complete recipe');
   await page.screenshot({ path: `audit-repairs-qa/pantry-${width}.png` });
   await page.goto(`${base}/es/ingredientes`, {waitUntil:'networkidle'});
   const ingredientSearch=page.getByRole('combobox',{name:'Buscar ingredientes',exact:true});
   await ingredientSearch.waitFor();
   assert.equal(await page.locator('.md-ingredient-card').count(),12,'only featured ingredients appear on the landing page');
   const sources=await page.locator('.md-ingredient-card img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));
   assert.equal(sources.length,12,'every featured ingredient has a photo');
   assert(sources.every(src=>src.includes('ingredientes')),'never use a recipe photograph for an ingredient');
   await page.getByRole('link',{name:'Ver todos los ingredientes',exact:true}).click();
   await page.waitForURL('**/es/ingredientes?page=1');
   assert.equal(await page.locator('.md-ingredient-card').count(),24);
   await page.getByRole('link',{name:'Siguiente',exact:true}).click();
   await page.waitForURL('**/es/ingredientes?page=2');
   assert.equal(await page.locator('.md-ingredient-card').count(),24);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
   await ingredientSearch.fill('patata');
   const suggestion=page.getByRole('option',{name:/Papa.*recetas/});
   await suggestion.waitFor();
   assert.equal(await suggestion.locator('img').count(),1,'search results include thumbnails');
   await ingredientSearch.press('ArrowDown');
   await ingredientSearch.press('Enter');
   await page.waitForURL('**/es/ingredientes/papas');
   assert(await page.locator('meta[name="robots"]').getAttribute('content').then(v=>v.includes('noindex')),'new ingredient landing retains noindex');
   await page.goto(`${base}/es`,{waitUntil:'networkidle'});
   if(await page.locator('.md-menu-toggle').isVisible()) await page.locator('.md-menu-toggle').click();
   const collections=page.getByRole('link',{name:'Colecciones',exact:true}).filter({visible:true});
   await collections.click();
   await page.getByRole('link',{name:/Navidad colombiana/}).waitFor();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
   await page.screenshot({path:`audit-repairs-qa/collections-${width}.png`});
   assert.deepEqual(errors, [], `page errors at ${width}`);
   await context.close();
  }
  const context = await browser.newContext(); const page = await context.newPage();
  for (const lang of ['es','en','de','fr','it','ja','pt']) {
   await page.goto(`${base}/${lang}`, {waitUntil:'networkidle'});
   assert.equal(await page.locator('.md-cookie-drawer').count(),0);
   assert.equal(await page.locator('footer a[href$="/cookies"]').count(),1);
  }
  await context.close();
  console.log('PASS: no duplicate consent banner, persistent footer access, CMP-managed choices, favorite save/reload/language/remove, Papa/purée, responsive widths, seven languages.');
 } finally { await browser.close(); }
})().catch(e => { console.error(e);process.exitCode=1; });
