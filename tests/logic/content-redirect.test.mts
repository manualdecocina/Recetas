import assert from 'node:assert/strict'
import { validateHeaderValue } from 'node:http'
import { isRetiredListingRedirect, redirectLocation } from '@/lib/content-redirect'

// Destinos en japonés: válidos como cabecera Location y equivalentes al original.
for (const path of ['/ja/コロンビア豆カスエラ/', '/ja/コロンビア風豆の煮込み：アンティオキア', '/fr/crème brûlée?x=á#y']) {
  const location = redirectLocation(path)
  assert.doesNotThrow(() => validateHeaderValue('Location', location))
  assert.equal(decodeURIComponent(location), path)
}
// Ni las rutas ASCII ni lo ya codificado cambian.
for (const path of ['/carne-bolonesa-a-la-italiana/', '/ja/%E3%82%A2?page=2']) assert.equal(redirectLocation(path), path)

assert.equal(isRetiredListingRedirect('/jugo-anticancerigeno', '/es/recetas'), true)
assert.equal(isRetiredListingRedirect('/sopa-saludable-para-enfermos/', '/es/recetas/'), true)
assert.equal(isRetiredListingRedirect('/recetas', '/es/recetas'), false)
assert.equal(isRetiredListingRedirect('/ja/recetas/', '/ja/recetas'), false)
assert.equal(isRetiredListingRedirect('/receta-pasta-bolognesa-original', '/carne-bolonesa-a-la-italiana/'), false)
assert.equal(isRetiredListingRedirect('/algo', '/es/recetas?categoria=postres'), false)
console.log('content-redirect: OK')
