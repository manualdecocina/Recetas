import assert from 'node:assert/strict'
import { advanceRecipeTimer, timerInputSeconds } from '@/lib/recipe-timer'
import { buildEditorialPantry } from '@/lib/pantry-editorial'

const running = { remaining: 3, deadline: 4000, duration: 3, started: true }
assert.equal(advanceRecipeTimer(running, 1000), running, 'unchanged second does not cause another render')
const done = advanceRecipeTimer(running, 4500)
assert.equal(done.remaining, 0)
assert.equal(done.deadline, null, 'finished timer releases its interval')
assert.equal(done.started, true, 'completion stays visible until reset')
assert.equal(advanceRecipeTimer(done, 5000), done)
const paused = { remaining: 2, deadline: null, duration: 3, started: true }
assert.equal(advanceRecipeTimer(paused, 9999), paused, 'a paused timer must not advance')
for (const invalid of ['', '0', '-1', '0.00001', '1441', 'Infinity', 'invalid']) assert.equal(timerInputSeconds(invalid), null)
assert.equal(timerInputSeconds('0.05'), 3)
assert.equal(timerInputSeconds('1440'), 86400)

const catalog = [
  { id: 'egg', slug: 'huevo', name: 'Huevo' },
  { id: 'quail', slug: 'huevos-de-codorniz', name: 'Huevos de codorniz' },
  { id: 'blueberry', slug: 'arandanos', name: 'Arándanos' },
]
const sources = [
  { id: 'raw', ingredients: [{ name: 'huevo grande' }] },
  { id: 'cooked', ingredients: [{ name: 'huevo duro, peso comestible cocido sin cáscara' }] },
  { id: 'boil', ingredients: [{ name: 'huevos para cocer, unos 100 g cocidos y pelados' }] },
  { id: 'quail', ingredients: [{ name: 'huevos de codorniz cocidos' }] },
  { id: 'blue', ingredients: [{ name: 'arándanos, limpios y secos' }] },
  { id: 'red', ingredients: [{ name: 'arándanos rojos frescos' }] },
]
const pantry = buildEditorialPantry(sources, catalog, [])
assert.deepEqual(pantry.requirements.get('raw'), ['egg'])
assert.deepEqual(pantry.requirements.get('blue'), ['blueberry'])
for (const id of ['cooked', 'boil', 'quail']) assert.notDeepEqual(pantry.requirements.get(id), ['egg'], 'cooked and quail eggs are distinct foods')
assert.notDeepEqual(pantry.requirements.get('red'), ['blueberry'], 'cranberries must not become blueberries')
console.log('OK site optimization: timers stop at zero; subsecond invalid input; cooked/raw eggs and distinct berries preserved')
