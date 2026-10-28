import assert from 'node:assert/strict'
import { buildEditorialPantry, editorialIngredientId, ingredientSuggestions, localizeEditorialIngredients } from '@/lib/pantry-editorial'
const catalog = [
  { id: 'tomato', slug: 'tomate', name: 'Tomate' },
  { id: 'garlic', slug: 'ajo', name: 'Ajo' },
  { id: 'onion', slug: 'cebolla', name: 'Cebolla' },
  { id: 'olive', slug: 'aceite-de-oliva', name: 'Aceite de oliva' },
  { id: 'salt', slug: 'sal', name: 'Sal' },
]
const sauce = { id: 'sauce', recipe_group_id: 'sauce-g', ingredients: ['tomates rojos maduros, sin pedúnculo, con piel y semillas', 'cebolla pelada', 'ajo pelado', 'aceite de oliva', 'sal de mesa'].map(name => ({ name })) }
const figs = { id: 'figs', recipe_group_id: 'figs-g', ingredients: [{ name: 'higos maduros, sin rabito, en cuartos' }] }
const links = [{ recipe_id: 'sauce', ingredient_id: 'onion', position: 1 }, { recipe_id: 'sauce', ingredient_id: 'olive', position: 3 }, { recipe_id: 'sauce', ingredient_id: 'salt', position: 4 }]
const result = buildEditorialPantry([sauce, figs], catalog, links)
assert.deepEqual(result.requirements.get('sauce'), ['tomato', 'onion', 'garlic', 'olive', 'salt'], 'all five sauce ingredients must be selectable, including missing taxonomy links')
assert.deepEqual(result.requirements.get('figs'), [editorialIngredientId(figs.ingredients[0].name)], 'figs must be selectable before taxonomy review')
assert.equal(new Set(result.ingredients.map(i => i.id)).size, result.ingredients.length)
const repeated = buildEditorialPantry([{ id: 'repeat', ingredients: [{ name: 'Ajo pelado' }, { name: 'Ajo pelado' }] }], catalog, [])
assert.deepEqual(repeated.requirements.get('repeat'), ['garlic', 'garlic'], 'retain editorial positions while reusing the ingredient identity')
for (const name of ['agua de coco', 'tomates secos', 'cebolla en polvo', 'ajo negro fermentado', 'perejil seco', 'ajo en polvo', 'tomate concentrado', 'tomate triturado en conserva', 'sal y pimienta', 'aceite de oliva o mantequilla']) {
  const r = buildEditorialPantry([{ id: 'distinct', ingredients: [{ name }] }], catalog, [])
  assert.equal(r.requirements.get('distinct')?.[0], editorialIngredientId(name), `never silently substitute ${name}`)
}
const localized = localizeEditorialIngredients(result.ingredients, [sauce, figs], [{ recipe_group_id: 'figs-g', ingredients: [{ name: 'ripe figs, quartered' }] }], result.requirements)
assert.equal(localized.find(i => i.id === editorialIngredientId(figs.ingredients[0].name))?.name, 'ripe figs, quartered')
const mismatched = localizeEditorialIngredients(result.ingredients, [figs], [{ recipe_group_id: 'figs-g', ingredients: [{ name: 'wrong' }, { name: 'extra' }] }], result.requirements)
assert.equal(mismatched.find(i => i.id === editorialIngredientId(figs.ingredients[0].name))?.name, figs.ingredients[0].name, 'never join mismatched translation positions')
const choices = [...catalog, ...Array.from({ length: 20 }, (_, i) => ({ id: `n${i}`, slug: `n${i}`, name: `Ajo picado ${i}` })), { id: 'sugar', slug: 'azucar', name: 'Azúcar' }]
assert.deepEqual(ingredientSuggestions(choices, '', new Set(), 'es'), [], 'empty search must not render the catalog as buttons')
assert.equal(ingredientSuggestions(choices, 'ajo', new Set(), 'es').length, 8)
assert.equal(ingredientSuggestions(choices, 'ajo', new Set(), 'es')[0].id, 'garlic')
assert.equal(ingredientSuggestions(choices, 'azucar', new Set(), 'es')[0].id, 'sugar', 'accent-insensitive input')
assert.ok(ingredientSuggestions(choices, 'ajo', new Set(['garlic']), 'es').every(i => i.id !== 'garlic'), 'selected ingredients must not reappear as suggestions')
console.log('OK editorial pantry: complete sauce and figs, exact identities, safe aliases, repeated positions, translation guard and bounded autocomplete')
const { normalizeEditorialIngredientSections } = await import('@/lib/editorial-ingredient-sections')
const sections = normalizeEditorialIngredientSections([{ name: 'For the Bowl', amount: '', unit: '' }, { name: 'Quinoa', amount: '1', unit: 'cup' }, { name: 'Salt to taste', amount: '', unit: '' }], 'ordinary', 'en')
assert.equal(sections.length, 2, 'section heading must never enter Recipe.recipeIngredient')
assert.equal((sections[0] as any).group, 'For the Bowl', 'preserve the heading visually')
assert.equal(sections[1].name, 'Salt to taste', 'blank quantities do not mean an ingredient is a section')
const localizedAjiaco = Array.from({ length: 14 }, (_, i) => ({ name: i === 7 ? 'garlic, crushed' : `ingredient-${i}`, amount: String(i) }))
const ordered = normalizeEditorialIngredientSections(localizedAjiaco, '3225779c-4c03-4b93-8c68-7454142f87f3', 'en')
assert.equal(ordered[3].name, 'garlic, crushed', 'ajiaco garlic must map to the garlic requirement, not a potato')
assert.deepEqual(normalizeEditorialIngredientSections(ordered, '3225779c-4c03-4b93-8c68-7454142f87f3', 'en'), ordered, 'normalization must be idempotent')

assert.equal((ordered[3] as any).storagePosition, 7, 'keep saved checkbox identity when correcting ajiaco order')
assert.equal((sections[0] as any).storagePosition, 1, 'keep saved checkbox identity when dropping section headings')
