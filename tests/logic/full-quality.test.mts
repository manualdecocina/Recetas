import assert from 'node:assert/strict'
import { consolidatePantryFoods, pantryIngredientRecipeIds } from '@/lib/pantry-foods'
import { filteredPageRobots } from '@/lib/seo'
import { firstQueryValue, parseRecipePage } from '@/lib/catalog-pagination'
import { taxonomyLanding } from '@/lib/taxonomy-landing-seo'
import { cuisineDiscoverySlugs, cuisineDiscoveryGroupIds, cuisineDiscoveryOptions } from '@/lib/cuisine-discovery'
import { publicReadFetch, coalescePublicLoad } from '@/lib/public-fetch'

const choices = [
  { id: 'short-id', slug: 'limon', name: 'Limón' },
  { id: 'second-id', slug: 'limon-preparado', name: 'Limón, en gajos' },
  { id: 'lime-id', slug: 'lima', name: 'Lima' },
]
const pantry = consolidatePantryFoods(choices, [
  { id: 'first', ingredientIds: ['short-id'] },
  { id: 'second', ingredientIds: ['second-id'] },
  { id: 'lime', ingredientIds: ['lime-id'] },
])
assert.deepEqual(pantryIngredientRecipeIds(pantry, 'second-id'), ['first', 'second'], 'a merged taxonomy identity must still find all recipes')
assert.deepEqual(pantryIngredientRecipeIds(pantry, 'short-id'), ['first', 'second'])
assert.deepEqual(pantryIngredientRecipeIds(pantry, 'lime-id'), ['lime'], 'distinct foods must remain distinct')
assert.deepEqual(pantryIngredientRecipeIds(pantry, 'unknown'), [])
assert.equal(firstQueryValue(['ajo', 'cebolla']), 'ajo', 'repeated query keys use the first value without a server error')
assert.equal(firstQueryValue(undefined), '')
assert.equal(parseRecipePage(['2', '3']), 2)
assert.equal(parseRecipePage(['2x', '3']), 1)
assert.match(taxonomyLanding('ingredient', 'en', 'Garlic', 1).heading, /^1 recipe using Garlic$/)
assert.match(taxonomyLanding('ingredient', 'fr', 'Ail', 1).heading, /^1 recette avec ail$/)
assert.match(taxonomyLanding('ingredient', 'es', 'Ajo', 1).title, /1 idea$/)
assert.deepEqual(cuisineDiscoverySlugs('Colombiana, Caribe'), ['cocina-colombiana'])
assert.deepEqual(cuisineDiscoverySlugs('Italoamericana'), ['cocina-estadounidense', 'cocina-italiana'])
assert.deepEqual(cuisineDiscoverySlugs('Gallega, España'), ['cocina-espanola', 'cocina-gallega'])
assert.deepEqual(cuisineDiscoverySlugs('Undocumented origin'), [], 'never invent a national origin')
const origins = [
  { recipe_group_id: 'new-colombian', cuisine: 'Colombiana, Valle del Cauca' },
  { recipe_group_id: 'new-italian', cuisine: 'Inspiración italiana' },
  { recipe_group_id: 'new-american', cuisine: 'Estadounidense' },
]
assert.deepEqual(cuisineDiscoveryGroupIds(origins, 'cocina-colombiana'), ['new-colombian'], 'new recipes do not need an old relation to be discoverable')
assert(cuisineDiscoveryOptions('ja', origins, []).some(o => o.value === 'cocina-estadounidense' && o.label === 'アメリカ料理・アメリカ風'))
const twice = consolidatePantryFoods(pantry.ingredients, pantry.recipes)
assert.deepEqual(pantryIngredientRecipeIds(twice, 'second-id'), ['first', 'second'], 'identity survives repeated consolidation')
for (const lang of ['en', 'de', 'fr', 'it', 'ja', 'pt']) {
  const localized = { ingredients: pantry.ingredients, recipes: pantry.recipes.map(r => ({ ...r, id: `${lang}-${r.id}` })) }
  assert.deepEqual(pantryIngredientRecipeIds(localized, 'second-id'), [`${lang}-first`, `${lang}-second`])
}
process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'false'
assert.deepEqual(filteredPageRobots(), { index: false, follow: false, googleBot: { index: false, follow: false } })
process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true'
assert.deepEqual(filteredPageRobots(), { index: false, follow: true, googleBot: { index: false, follow: true } })
let calls = 0
let captured: any
const recovered = await publicReadFetch('https://example.test/public', { next: { tags: ['recipes'], revalidate: 3600 } }, (async (_input, init) => {
  calls++; captured = init
  return new Response(calls === 1 ? 'upstream unavailable' : 'ok', { status: calls === 1 ? 503 : 200 })
}) as typeof fetch)
assert.equal(recovered.status, 200)
assert.equal(calls, 2)
assert.deepEqual(captured.next, { tags: ['recipes'], revalidate: 3600 }, 'retries preserve publication cache tags')
calls = 0
await publicReadFetch('https://example.test/write', { method: 'POST' }, (async () => { calls++; return new Response('', { status: 503 }) }) as typeof fetch)
assert.equal(calls, 1, 'never retry a write')
calls = 0
await publicReadFetch('https://example.test/missing', {}, (async () => { calls++; return new Response('', { status: 404 }) }) as typeof fetch)
assert.equal(calls, 1, 'ordinary client errors are not retried')
const controller = new AbortController(); controller.abort()
calls = 0
await assert.rejects(publicReadFetch('https://example.test/cancelled', { signal: controller.signal }, (async () => { calls++; throw new Error('cancelled') }) as typeof fetch))
assert.equal(calls, 1, 'respect explicit cancellation')
const pending = new Map<string, Promise<number>>()
let builds = 0
const load = async () => { builds++; return 7 }
const one = coalescePublicLoad(pending, 'es', load)
const two = coalescePublicLoad(pending, 'es', load)
assert.equal(one, two, 'concurrent cache misses share one build')
assert.deepEqual(await Promise.all([one, two]), [7, 7])
assert.equal(builds, 1)
assert.equal(pending.size, 0, 'never retain a settled value outside the invalidatable Next cache')
await coalescePublicLoad(pending, 'es', load)
assert.equal(builds, 2)
await assert.rejects(coalescePublicLoad(pending, 'bad', async () => { throw new Error('failed') }))
assert.equal(pending.has('bad'), false, 'a failed load cannot poison later attempts')
console.log('OK full quality: consolidated ingredient routes, localized results, stable identities and filtered-page indexing guards')
