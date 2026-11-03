import assert from 'node:assert/strict'
import { consolidatePantryFoods, pantryIngredientRecipeIds } from '@/lib/pantry-foods'
import { filteredPageRobots } from '@/lib/seo'
import { firstQueryValue, parseRecipePage } from '@/lib/catalog-pagination'
import { taxonomyLanding } from '@/lib/taxonomy-landing-seo'

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
console.log('OK full quality: consolidated ingredient routes, localized results, stable identities and filtered-page indexing guards')
