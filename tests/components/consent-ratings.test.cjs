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
    const tree = c.render({ lang });
    assert(text(tree).trim().length > 0, 'preferences must be available without a region-specific CMP');
    let opened = false;
    c.win.addEventListener('manualdecocina:privacy-open', () => { opened = true; });
    elements(tree, n => n.type === 'button')[0].props.onClick();
    assert(opened);
    assert.equal(c.stored.size, 0, 'opening preferences is not accepting advertising');
    const d = harness('src/components/md/CookieDrawer.tsx');
    d.render({ lang });
    assert.match(text(d.render({ lang })), /Google/);
    const buttons = elements(d.render({ lang }), n => n.type === 'button');
    buttons[0].props.onClick();
    assert.equal(JSON.parse(d.stored.get('manualdecocina:privacy:v1')).advertising, false);
    assert.equal(d.render({ lang }), null);
  }
  {
    const d = harness('src/components/md/CookieDrawer.tsx');
    d.render({ lang: 'es' });
    elements(d.render({ lang: 'es' }), n => n.type === 'button')[2].props.onClick();
    assert.equal(JSON.parse(d.stored.get('manualdecocina:privacy:v1')).advertising, true);
    assert.equal(d.render({ lang: 'es' }), null);
  }
  {
    const a = harness('src/components/md/AdSenseLoader.tsx');
    a.render({ clientId: 'ca-pub-test', cmpReady: true });
    assert.equal(a.scripts.length, 0, 'no advertising request before an explicit choice');
    a.stored.set('manualdecocina:privacy:v1', JSON.stringify({ version: 1, advertising: false, savedAt: Date.now() }));
    a.win.dispatchEvent(new Event('manualdecocina:privacy-changed'));
    assert.equal(a.scripts.length, 0, 'rejection blocks advertising');
    a.stored.set('manualdecocina:privacy:v1', JSON.stringify({ version: 1, advertising: true, savedAt: Date.now() }));
    a.win.dispatchEvent(new Event('manualdecocina:privacy-changed'));
    assert.equal(a.scripts.length, 1);
    a.win.dispatchEvent(new Event('manualdecocina:privacy-changed'));
    assert.equal(a.scripts.length, 1, 'no duplicate script');
    a.stored.set('manualdecocina:privacy:v1', JSON.stringify({ version: 1, advertising: false, savedAt: Date.now() }));
    a.win.dispatchEvent(new Event('manualdecocina:privacy-changed'));
    assert.equal(a.win.reloaded, true, 'withdrawal removes third-party code through a new document');
  }
  console.log('OK: failed/offline/malformed ratings remain retryable; successful votes persist once; duplicate clicks and votes; 7 global consent labels; reject/accept persistence; no ads before acceptance; revocation reload; preferences available without CMP.');
})().catch(error => { console.error(error); process.exitCode = 1; });
