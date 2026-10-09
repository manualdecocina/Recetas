import assert from 'node:assert/strict'
import { localizePantryRecipes } from '@/lib/pantry-localization'
import { ingredientLabel } from '@/lib/ingredient-labels'
import { getPantryCopy } from '@/lib/pantry-copy'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'
const source: any[] = [{ id: 'es-id', recipe_group_id: 'group', title: 'Arroz', language: 'es', public_path: '/receta-arroz', ingredientIds: ['stable-rice-id'], totalIngredients: 3, totalCanonicalIngredients: 1, uncanonicalizedCount: 2 }, { id: 'untranslated', recipe_group_id: 'other', ingredientIds: ['unavailable'] }]
for (const lang of SUPPORTED_LANGUAGES) {
  const translated: any = { id: `${lang}-id`, recipe_group_id: 'group', title: `Rice ${lang}`, language: lang, public_path: `/${lang}/historical-rice-path` }
  const result = localizePantryRecipes(source, [translated])
  assert.equal(result.length, 1, 'unavailable translations must be excluded')
  assert.equal(result[0].id, translated.id)
  assert.equal(result[0].public_path, translated.public_path)
  assert.deepEqual(result[0].ingredientIds, ['stable-rice-id'])
  assert.equal(result[0].uncanonicalizedCount, 2, 'never discard unresolved ingredients or claim complete match')
  assert.ok(getPantryCopy(lang).view)
  assert.ok(getPantryCopy(lang).selected(2))
  assert.equal(ingredientLabel('future-slug', 'New ingredient', lang), 'New ingredient')
}
assert.equal(ingredientLabel('ajo', 'Ajo', 'en'), 'Garlic')
assert.equal(ingredientLabel('ajo', 'Ajo', 'de'), 'Knoblauch')
assert.equal(ingredientLabel('ajo', 'Ajo', 'ja'), 'にんにく')
assert.equal(source[0].id, 'es-id', 'source must remain unchanged')
console.log('OK pantry: seven-language group join, historical paths, stable selections and incomplete ingredient guard')
