const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.AUDIT_BASE || 'http://127.0.0.1:3000';
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 fs.mkdirSync('audit-repairs-qa',{recursive:true});
 try {
  for (const width of [390,1366]) {
   const context = await browser.newContext({viewport:{width,height:900}});
   await context.route(/pagead2\.googlesyndication\.com/,r=>r.fulfill({status:200,contentType:'application/javascript',body:''}));
   const page = await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(`${base}/es`,{waitUntil:'networkidle'});
   assert(await page.locator('section[aria-labelledby="md-latest-heading"]').evaluate(section=>[...section.querySelectorAll('.md-recipe-card')].every(card=>card.getBoundingClientRect().bottom<=section.getBoundingClientRect().bottom+1)),'home recipe cards stay within their section before scrolling');
   // Reproduce Google's observed zero-width unfilled slot with a surviving large iframe.
   await page.evaluate(()=>{
    const slot=document.createElement('div');slot.className='google-auto-placed';slot.id='quality-unfilled-fixture';slot.style.textAlign='center';
    slot.innerHTML='<ins class="adsbygoogle" data-ad-status="unfilled" style="display:block;width:0;height:0;margin:10px auto"><div style="width:1200px;height:280px;display:inline-block"></div></ins>';
    document.querySelector('main').appendChild(slot);
    const filled=document.createElement('div');filled.className='google-auto-placed';filled.id='quality-filled-fixture';
    filled.innerHTML='<ins class="adsbygoogle" data-ad-status="filled" style="display:block;width:200px;height:50px">Served ad fixture</ins>';
    document.querySelector('main').appendChild(filled);
   });
   assert.equal(await page.locator('#quality-unfilled-fixture ins').isVisible(),false,'only the confirmed unfilled slot is hidden');
   assert.equal(await page.locator('#quality-filled-fixture ins').isVisible(),true,'served ads stay visible');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'unfilled ad must not widen the page');
   await page.screenshot({path:`audit-repairs-qa/quality-ad-layout-${width}.png`});
   await page.goto(`${base}/en/recetas?ingrediente=ajo`,{waitUntil:'networkidle'});
   assert.equal(await page.locator('select[name="ingrediente"] option[value="ajo"]').innerText(),'Garlic');
   assert(await page.locator('.md-recipe-card').count()>0,'English filter must find real recipes');
   assert((await page.locator('meta[name="googlebot"]').getAttribute('content')).includes('noindex'));
   await page.goto(`${base}/en/recetas?q=rice&q=beans`,{waitUntil:'networkidle'});
   assert.equal(await page.locator('main#md-main h1').count(),1,'repeated keys must render the actual catalog');
   await page.goto(`${base}/porra-antequerana-receta`,{waitUntil:'networkidle'});
   assert.equal(await page.locator('dialog.md-lightbox').count(),0,'large photos are not mounted before opening');
   await page.locator('.md-step-photo').first().click();
   await page.getByRole('dialog').waitFor({state:'visible'});
   assert((await page.getByRole('dialog').getAttribute('aria-label')).length>0,'photo dialog has an accessible name');
   await page.keyboard.press('Escape');
   assert.equal(await page.getByRole('dialog').count(),0);
   await page.locator('dialog.md-lightbox').waitFor({state:'detached'});
   assert.deepEqual(errors,[],`runtime errors at width ${width}`);
   await context.close();
  }
  const context=await browser.newContext();const page=await context.newPage();
  const labels={es:'Ajo',en:'Garlic',de:'Knoblauch',fr:'Ail',it:'Aglio',ja:'にんにく',pt:'Alho'};
  for(const [lang,label]of Object.entries(labels)) {
   await page.goto(`${base}/${lang}/recetas?ingrediente=ajo`,{waitUntil:'networkidle'});
   assert.equal(await page.locator('select[name="ingrediente"] option[value="ajo"]').innerText(),label);
   assert(await page.locator('.md-recipe-card').count()>0,lang);
   await page.goto(`${base}/${lang}/recetas?cocina=cocina-estadounidense`,{waitUntil:'networkidle'});
   assert(await page.locator('.md-recipe-card').count()>0,`new cuisine taxonomy in ${lang}`);
   const mushroom=await page.goto(`${base}/${lang}/ingredientes/champi%C3%B1ones`,{waitUntil:'networkidle'});
   assert.equal(mushroom.status(),200,`searchable Unicode ingredient in ${lang}`);
   assert(!/404/.test(await page.locator('main').innerText()),`ingredient body in ${lang}`);
   assert((await page.locator('meta[name="googlebot"]').getAttribute('content')).includes('noindex'),'non-indexable searchable ingredient remains noindex');
   const mushroomCards=await page.locator('.md-card-photo-link').evaluateAll(els=>els.map(a=>a.getAttribute('href')));
   assert(mushroomCards.length>0,'reviewed mushroom preparations must resolve to the real taxonomy identity');
   await page.goto(`${base}/${lang}/recetas?ingrediente=champi%C3%B1ones`,{waitUntil:'networkidle'});
   const mushroomFiltered=await page.locator('.md-card-photo-link').evaluateAll(els=>els.map(a=>a.getAttribute('href')));
   assert(mushroomFiltered.length>0&&mushroomFiltered.every(href=>mushroomCards.includes(href)),'searchable ingredients stay discoverable independently of SEO indexability');
  }
  await context.close();console.log('PASS: unfilled ad layout, served ads, translated ingredient filters, duplicate parameters, photo dialog and responsive widths.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
