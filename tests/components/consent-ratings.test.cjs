// Exercise request outcomes and Google's asynchronous callback without browser traffic.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function harness(file, fetch = async () => ({ ok: false, status: 503 })) {
  const slots = [], effects = [], stored = new Map(), timers = new Map();
  let cursor = 0, timerId = 0;
  const listeners = new Map();
  const scripts = [];
  const win = { addEventListener: (name, fn) => { const set = listeners.get(name) ?? new Set(); set.add(fn); listeners.set(name, set); }, removeEventListener: (name, fn) => listeners.get(name)?.delete(fn), dispatchEvent: event => { for (const fn of listeners.get(event.type) ?? []) fn(event); }, location: { reload: () => { win.reloaded = true; } } };
  const doc = { documentElement: { dataset: {} }, activeElement: null, getElementById: id => scripts.find(s => s.id === id), createElement: () => ({}), head: { appendChild: node => scripts.push(node) } };
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], value => { slots[i] = value; }];
    },
    useRef(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = { current: initial };
      return slots[i];
    },
    useEffect(fn) {
      const i = cursor++;
      if (!(i in slots)) { slots[i] = true; effects.push(fn); }
    },
  };
  const storage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) };
  const cache = new Map();
  function compile(source) {
    const resolved = path.resolve(source);
    if (cache.has(resolved)) return cache.get(resolved);
    const js = ts.transpileModule(fs.readFileSync(resolved, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const mod = { exports: {} };
    const load = name => name === 'react' ? react : name.startsWith('@/') ? compile(`src/${name.slice(2)}.ts`) : require(name);
    new Function('require', 'module', 'exports', 'window', 'localStorage', 'fetch', 'setTimeout', 'clearTimeout', 'document', js)(
      load, mod, mod.exports, win, storage, fetch,
      fn => { const id = ++timerId; timers.set(id, fn); return id; }, id => timers.delete(id), doc,
    );
    cache.set(resolved, mod.exports);
    return mod.exports;
  }
  const Component = compile(file).default;
  return {
    render(props) { cursor = 0; const tree = Component(props); effects.splice(0).forEach(fn => fn()); return tree; },
    win, stored, timers, scripts,
  };
}

function elements(tree, predicate) {
  if (Array.isArray(tree)) return tree.flatMap(node => elements(node, predicate));
  if (!tree || typeof tree !== 'object') return [];
  return [...(predicate(tree) ? [tree] : []), ...elements(tree.props?.children, predicate)];
}
function text(tree) {
  if (Array.isArray(tree)) return tree.map(text).join(' ');
  if (tree && typeof tree === 'object') return text(tree.props?.children);
  return typeof tree === 'string' || typeof tree === 'number' ? String(tree) : '';
}

(async () => {
  const props = { recipeId: 'recipe-test', lang: 'es', ratingCount: 0, ratingSum: 0 };
  for (const response of [
    async () => ({ ok: false, status: 503 }),
    async () => { throw new Error('offline'); },
    async () => ({ ok: true, status: 200, json: async () => ({}) }),
  ]) {
    const h = harness('src/components/md/RatingWidget.tsx', response);
    await elements(h.render(props), node => node.type === 'button')[4].props.onClick();
    const tree = h.render(props);
    assert.equal(h.stored.size, 0);
    assert.match(text(tree), /No se pudo guardar/);
    assert.doesNotMatch(text(tree), /Gracias por tu voto/);
    assert(elements(tree, node => node.type === 'button').every(node => !node.props.disabled));
  }
  let calls = 0, resolve;
  const h = harness('src/components/md/RatingWidget.tsx', () => {
    calls++; return new Promise(done => { resolve = done; });
  });
  const star = elements(h.render(props), node => node.type === 'button')[4];
  const pending = star.props.onClick();
  await star.props.onClick();
  assert.equal(calls, 1);
  assert(elements(h.render(props), node => node.type === 'button').every(node => node.props.disabled));
  resolve({ ok: true, status: 200, json: async () => ({ rating_count: 1, rating_sum: 5 }) });
  await pending;
  assert.equal(JSON.parse(h.stored.get('manualdecocina:rated'))['recipe-test'], 5);
  assert.match(text(h.render(props)), /Gracias por tu voto/);
  const duplicate = harness('src/components/md/RatingWidget.tsx', async () => ({ ok: false, status: 409 }));
  await elements(duplicate.render(props), node => node.type === 'button')[0].props.onClick();
  assert.equal(duplicate.stored.size, 0);
  assert.match(text(duplicate.render(props)), /Ya habías valorado/);

  for (const lang of ['es', 'en', 'de', 'it', 'fr', 'ja', 'pt']) {
    const c = harness('src/components/md/ConsentPreferences.tsx');
    assert.equal(c.render({ lang }), null, 'do not offer a dead link before Google is ready');
    let gdprApplies;
    c.win.googlefc.showRevocationMessage = () => {};
    c.win.__tcfapi = (command, version, callback) => { gdprApplies = callback; };
    c.win.googlefc.callbackQueue[0].CONSENT_API_READY();
    for (const applies of [undefined, false]) {
      gdprApplies({gdprApplies:applies}, true);
      assert.equal(c.render({lang}), null, 'unknown and non-European visits have no European revocation link');
    }
    gdprApplies({gdprApplies:true}, false);
    assert.equal(c.render({lang}), null, 'an API failure must not offer a broken action');
    gdprApplies({gdprApplies:true}, true);
    const tree = c.render({lang});
    assert(text(tree).trim().length > 0, 'European visits retain a working revocation link');
    let opened = false;
    c.win.addEventListener('manualdecocina:privacy-open', () => { opened = true; });
    elements(tree, n => n.type === 'button')[0].props.onClick();
    assert(opened);
    assert.equal(c.stored.size, 0, 'opening preferences is not accepting advertising');
    const d = harness('src/components/md/CookieDrawer.tsx');
    assert.equal(d.render({ lang }), null, 'no local notice competes with the certified CMP');
    let reopened = 0;
    d.win.dispatchEvent(new Event('manualdecocina:privacy-open'));
    const queued = d.win.googlefc.callbackQueue;
    assert.equal(queued.length, 1, 'footer queues the real Google API');
    d.win.googlefc.showRevocationMessage = () => { reopened++; };
    d.win.__tcfapi = (command, version, callback) => callback({gdprApplies:true},true);
    queued[0].CONSENT_API_READY();
    assert.equal(reopened, 1, 'delayed Google availability still opens its own dialog');
    assert.equal(d.stored.size, 0, 'opening preferences must never save consent');
    assert.equal(d.render({ lang }), null);
  }
  {
    const d = harness('src/components/md/CookieDrawer.tsx');
    d.render({lang:'es'});
    let opened = 0;
    d.win.__tcfapi = (command, version, callback) => callback({gdprApplies:true},true);
    d.win.googlefc = { callbackQueue: { push: entry => entry.CONSENT_API_READY() }, showRevocationMessage: () => {opened++;} };
    d.win.dispatchEvent(new Event('manualdecocina:privacy-open'));
    assert.equal(opened, 1, 'already-ready CMP is invoked through the supported callback queue');
    assert.equal(d.stored.size, 0);
  }
  {
    const d = harness('src/components/md/CookieDrawer.tsx');
    d.render({lang:'es'});
    d.win.dispatchEvent(new Event('manualdecocina:privacy-open'));
    for (const callback of d.timers.values()) callback();
    assert.match(text(d.render({lang:'es'})), /No se pudieron abrir/,'failed CMP availability must be visible');
    assert.doesNotMatch(text(d.render({lang:'es'})), /Continuar|Aceptar publicidad|Rechazar publicidad/,'no fake fallback consent controls');
    let lateOpens = 0;
    d.win.googlefc.showRevocationMessage = () => { lateOpens++; };
    d.win.__tcfapi = (command, version, callback) => callback({gdprApplies:true},true);
    d.win.googlefc.callbackQueue[0].CONSENT_API_READY();
    assert.equal(lateOpens, 0, 'timed-out requests cannot open an unexpected modal later');
    const close = elements(d.render({lang:'es'}), n => n.type === 'button')[0];
    assert.equal(text(close), 'Cerrar', 'failure has a dismiss action instead of a retry loop');
    close.props.onClick();
    assert.equal(d.render({lang:'es'}), null);
  }
  for (const applies of [false, undefined]) {
    const d = harness('src/components/md/CookieDrawer.tsx');
    d.render({lang:'es'});
    let opened = 0;
    d.win.__tcfapi = (command, version, callback) => callback({gdprApplies:applies},true);
    d.win.googlefc = { callbackQueue: { push: entry => entry.CONSENT_API_READY() }, showRevocationMessage: () => {opened++;} };
    d.win.dispatchEvent(new Event('manualdecocina:privacy-open'));
    assert.equal(opened, 0, 'an inapplicable or unknown region cannot reopen EU consent');
    assert.equal(d.render({lang:'es'}), null);
  }
  {
    const d = harness('src/components/md/CookieDrawer.tsx');
    d.render({lang:'es'});
    let regionCallback, opened = 0;
    d.win.__tcfapi = (command, version, callback) => { if (command === 'addEventListener') regionCallback = callback; };
    d.win.googlefc = { callbackQueue: { push: entry => entry.CONSENT_API_READY() }, showRevocationMessage: () => {opened++;} };
    d.win.dispatchEvent(new Event('manualdecocina:privacy-open'));
    regionCallback({gdprApplies:undefined,listenerId:1},true);
    regionCallback({gdprApplies:true,listenerId:1},true);
    regionCallback({gdprApplies:true,listenerId:1},true);
    assert.equal(opened, 1, 'late region determination opens once, despite repeated TCF events');
  }
  for (const oldChoice of [undefined, true, false]) {
    const a = harness('src/components/md/AdSenseLoader.tsx');
    if (oldChoice !== undefined) a.stored.set('manualdecocina:privacy:v1', JSON.stringify({ version: 1, advertising: oldChoice, savedAt: Date.now() }));
    a.render({ clientId: 'ca-pub-test', cmpReady: true });
    assert.equal(a.scripts.length, 1, 'local acknowledgement or legacy refusal must not disable the certified Google integration');
    a.render({ clientId: 'ca-pub-test', cmpReady: true });
    assert.equal(a.scripts.length, 1, 'no duplicate script');
    assert.equal(a.win.reloaded, undefined);
  }
  for (const props of [{clientId:'ca-pub-test',cmpReady:false},{cmpReady:true}]) {
    const a = harness('src/components/md/AdSenseLoader.tsx');
    a.render(props);
    assert.equal(a.scripts.length, 0, 'retain configuration and CMP readiness guards');
  }
  console.log('OK: ratings; 7-language region-aware preferences; no duplicate local banner; queued Google revocation; failure visibility; local choices cannot disable ad integration; configuration guards.');
})().catch(error => { console.error(error); process.exitCode = 1; });
