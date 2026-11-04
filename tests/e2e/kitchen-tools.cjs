const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.KITCHEN_BASE || 'http://127.0.0.1:3102';
const cartKey = 'manualdecocina:shopping:v1';
const executablePath = process.env.CHROME_PATH;
const transparent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');
async function waitServer() {
 const http=require('node:http');
 const until=Date.now()+30000;
 while(Date.now()<until) {
  const ready=await new Promise(resolve=>{const request=http.get(`${base}/icon.png`,response=>{response.resume();resolve(response.statusCode===200);});request.setTimeout(2000,()=>{request.destroy();resolve(false);});request.on('error',()=>resolve(false));});
  if(ready)return;
  await new Promise(r=>setTimeout(r,250));
 }
 throw Error('Local test server did not start');
}
(async () => {
 const server = process.env.KITCHEN_BASE ? null : spawn(process.execPath, ['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3102'], {stdio:['ignore','pipe','pipe']});
 let serverOutput=''; server?.stdout.on('data',d=>serverOutput+=d);server?.stderr.on('data',d=>serverOutput+=d);
 let browser;
 try {
  console.log('Starting kitchen browser QA');
  if(server) await waitServer();
  console.log('Server ready');
  const launch = () => chromium.launch({ ...(process.env.KITCHEN_PROXY ? {proxy:{server:process.env.KITCHEN_PROXY}} : {}), ...(executablePath ? {executablePath} : {}), args: ['--no-sandbox','--no-zygote','--single-process'] });
  fs.mkdirSync('/tmp/kitchen-qa',{recursive:true});
  for (const width of [390,1366]) {
   browser = await launch();
   const context=await browser.newContext({ignoreHTTPSErrors:Boolean(process.env.KITCHEN_PROXY),viewport:{width,height:900}}), page=await context.newPage();
   page.setDefaultTimeout(12000);page.setDefaultNavigationTimeout(30000);
   console.log('Testing width',width);
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await context.route(/googlesyndication|doubleclick|fundingchoices|google-analytics/,route=>route.abort());
   await context.route(/\/_next\/image\?/,route=>route.fulfill({status:200,contentType:'image/png',body:transparent}));
   await context.addInitScript(()=>{
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text;}}});
    Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.__shared=data;}});
    Object.defineProperty(navigator,'wakeLock',{configurable:true,value:{request:async()=>{window.__wakeRequests=(window.__wakeRequests||0)+1;return {released:false,addEventListener(){},release:async()=>{window.__wakeReleased=true;}};}}});
   });
   await page.goto(`${base}/sabajon-colombiano`);
   await page.locator('#md-servings').waitFor();
   const times=await page.locator('.md-recipe-fact').allTextContents();
   await page.locator('#md-servings').fill('16');
   await page.waitForFunction(()=>document.querySelector('#paso-1')?.textContent.includes('2000 ml'));
   assert.match(await page.locator('#paso-3').innerText(),/500 ml/,'partial ingredient quantities scale');
   assert.match(await page.locator('#paso-8').innerText(),/16 porciones/);
   assert.match(await page.locator('.md-ingredient-checks').innerText(),/unas 12 grandes/);
   assert.match(await page.locator('#paso-1').innerText(),/80–85 °C durante 5–8 minutos/);
   assert.deepEqual((await page.locator('.md-recipe-fact').allTextContents()).filter(x=>!x.includes('Porciones')),times.filter(x=>!x.includes('Porciones')));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'recipe has no horizontal overflow');
   if(width===390) { for(const small of [320,360]) { await page.setViewportSize({width:small,height:900}); assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`header and recipe fit ${small}px`); } await page.setViewportSize({width,height:900}); }
   const alternates=await page.locator('link[rel="alternate"][hreflang]').evaluateAll(links=>links.map(link=>({lang:link.hreflang.split('-')[0],path:new URL(link.href).pathname})).filter(x=>x.lang!=='x'));
   await page.locator('.md-ingredient-checkbox input').first().check();
   await page.getByRole('button',{name:'Añadir faltantes a la lista',exact:true}).click();
   let cart=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),cartKey);
   assert.equal(cart.sources[0].ingredients.length,4,'owned milk excluded');
   assert.equal(cart.sources[0].ingredients.find(i=>i.unit==='g' && i.amount==='216').amount,'216');
   await page.getByRole('button',{name:'Añadir todos a la lista',exact:true}).click();
   await page.getByRole('button',{name:'Añadir todos a la lista',exact:true}).click();
   cart=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),cartKey);
   assert.equal(cart.sources.length,1,'repeated addition does not double quantities');
   console.log('Portions and missing list passed',width);
   await page.goto(`${base}/manjar-blanco-del-valle`);
   await page.locator('#md-servings').fill('10');
   await page.waitForFunction(()=>document.querySelector('.md-ingredient-checks')?.textContent.includes('1000 ml'));
   await page.getByRole('button',{name:'Añadir todos a la lista',exact:true}).click();
   await page.goto(`${base}/es/lista-de-compra`);
   await page.waitForFunction(()=>document.querySelector('.md-shopping-items')?.textContent.includes('3 L'));
   assert.equal(await page.locator('.md-shopping-sources li').count(),2);
   await page.reload();
   await page.locator('.md-shopping-items').waitFor();
   assert.match(await page.locator('.md-shopping-items').innerText(),/3 L/);
   await page.getByRole('button',{name:'Copiar lista',exact:true}).click();
   assert.match(await page.evaluate(()=>window.__copied),/3 L/);
   await page.getByRole('button',{name:'Compartir lista',exact:true}).click();
   assert.match(await page.evaluate(()=>window.__shared.text),/3 L/);
   await page.locator('.md-shopping-items li').filter({hasText:'3 L'}).locator('input').check();
   const slugs=await page.evaluate(()=>JSON.parse(localStorage.getItem('manualdecocina:pantry:selectedSlugs')));
   assert(slugs.length>0);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'shopping list has no overflow');
   await page.screenshot({path:`/tmp/kitchen-qa/shopping-${width}.png`,fullPage:true});
   console.log('Shopping merge/share passed',width);
   await page.goto(`${base}/sabajon-colombiano`);
   await page.waitForFunction(()=>document.querySelector('#md-servings')?.value === '16');
   assert.equal(await page.locator('#md-servings').inputValue(),'16','servings survive reload/navigation');
   await page.getByRole('button',{name:'Empezar a cocinar',exact:true}).click();
   await page.getByRole('dialog').waitFor();
   await page.locator('.md-cooking-main').evaluate(el=>el.scrollTop=el.scrollHeight);
   await page.getByRole('button',{name:'Siguiente paso',exact:true}).click();
   assert.equal(await page.locator('.md-cooking-main').evaluate(el=>el.scrollTop),0,'new step starts at its heading');
   const footer=await page.locator('.md-cooking-footer').boundingBox();
   assert(footer.y+footer.height<=900,'controls stay inside the viewport');
   await page.locator('.md-cooking-ingredients summary').click();
   assert.match(await page.locator('.md-cooking-ingredients').innerText(),/2000 ml/);
   const activeTimer=page.locator('.md-step-timer').filter({has:page.locator('input')}).last();
   if (!(await activeTimer.locator('input').isVisible())) await activeTimer.locator('summary').click();
   await activeTimer.locator('input').fill('0.05');
   await activeTimer.getByRole('button',{name:'Iniciar',exact:true}).click();
   await page.getByRole('button',{name:'Siguiente paso',exact:true}).click();
   assert.equal(await page.locator('.md-timer-chip').count(),1,'other step timer becomes compact');
   await page.getByRole('button',{name:'Cerrar modo cocina',exact:true}).click();
   await page.reload();
   await page.getByRole('button',{name:'Empezar a cocinar',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('.md-cooking-main .md-eyebrow')?.textContent.includes('3'));
   await page.getByText(/Tiempo cumplido/).waitFor({timeout:7000});
   assert(await page.evaluate(()=>window.__wakeRequests>0));
   await page.keyboard.press('Escape');
   assert(await page.evaluate(()=>window.__wakeReleased));
   console.log('Cooking mode passed',width);
   if (width === 390) {
    await page.goto(`${base}/es/recetas`);
    await page.locator('.md-pagination a[href*="page=2"]').click();
    await page.waitForURL(url => url.searchParams.get('page') === '2');
    await page.waitForFunction(()=>window.scrollY <= 1);
    await page.locator('.md-card-title a').last().click();
    await page.waitForURL(url => !url.pathname.endsWith('/recetas'));
    await page.locator('.md-recipe-hero').waitFor();
    await page.waitForFunction(()=>window.scrollY <= 1);
    console.log('PASS: catalogue pagination and opening a recipe from the bottom reset the page to its start');
   }
   await page.goto(`${base}/es/que-puedo-cocinar`);
   await page.locator('.md-pantry-chip-selected').first().waitFor();
   await page.locator('.md-pantry-view-results').click();
   const partial=page.locator('.md-pantry-result').filter({has:page.getByRole('button',{name:'Añadir faltantes a la lista',exact:true})}).first();
   await partial.getByRole('button',{name:'Añadir faltantes a la lista',exact:true}).click();
   cart=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),cartKey);
   assert(cart.sources.length>=2,'pantry adds missing ingredients alongside other recipes');
   assert(cart.sources.every(s=>s.ingredients.every(i=>typeof i.amount==='string')));
   await page.screenshot({path:`/tmp/kitchen-qa/pantry-${width}.png`});
   // Real translated recipes: scaled ingredient list, scaled instructions and local UI.
   for (const {lang,path} of alternates) {
    if(lang==='es')continue;
    console.log('Testing language',lang,width);
    await page.goto(`${base}${path}`);
    await page.locator('#md-servings').fill('16');
    await page.waitForFunction(()=>document.querySelector('.md-ingredient-checks')?.textContent.includes('2000'));
    assert.match(await page.locator('#paso-3').innerText(),/500/);
    assert.equal(await page.locator('.md-related .md-recipe-card').count(),4);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`no overflow: ${lang}/${width}`);
    await page.locator('.md-shopping-add button').last().click();
    await page.goto(`${base}/${lang}/lista-de-compra`);
    await page.locator('.md-shopping-items').waitFor();
    assert.equal(await page.locator('h1').count(),1);
   }
   assert.deepEqual(errors,[],`JavaScript errors at width ${width}`);
   console.log(`PASS: ${width}px: portions, steps, shopping, clipboard/share, reload, pantry, resume, timers, wake lock, related cards and seven languages`);
   await context.close();
   await browser.close(); browser=null;
  }
  browser=await launch();
  const context=await browser.newContext({ignoreHTTPSErrors:Boolean(process.env.KITCHEN_PROXY)}),page=await context.newPage();
  await context.route(/\/_next\/image\?/,route=>route.fulfill({status:200,contentType:'image/png',body:transparent}));
  await context.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Disabled','SecurityError');};Object.defineProperty(navigator,'wakeLock',{configurable:true,value:{request:async()=>{throw new Error('Not supported')}}});Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Unavailable')}}});});
  await page.goto(`${base}/sabajon-colombiano`);
  await page.getByRole('button',{name:'Añadir todos a la lista',exact:true}).click();
  await page.getByText(/El navegador no permite guardar/).waitFor();
  await page.locator('.md-shopping-add a').click();
  await page.locator('.md-shopping-items').waitFor();
  await page.getByRole('button',{name:'Copiar lista',exact:true}).click();
  assert(await page.locator('textarea').isVisible(),'manual copy fallback');
  await context.close();
  console.log('PASS: blocked persistence and clipboard gracefully fall back');
 } catch(error) {console.error(error);console.error(serverOutput.slice(-2000));throw error;}
 finally {await browser?.close();server?.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
