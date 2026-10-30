import assert from 'node:assert/strict'
import { recipePublisher, recipeStepAnchor, shouldPublishAggregateRating } from '@/lib/recipe-schema'
import { ingredientDisplayPrefix, ingredientDisplayText } from '@/lib/recipe-ingredient-format'
import { CATEGORY_LANDING_COPY } from '@/lib/category-landing-copy'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'

type RecipeLike = {
  cuisine?: string | null
  keywords?: string[] | null
}

function schemaExtras(recipe: RecipeLike) {
  return {
    recipeCuisine: recipe.cuisine ?? undefined,
    keywords: recipe.keywords?.filter(Boolean).join(', ') || undefined,
  }
}

let n = 0
const check = (name: string, fn: () => void) => { fn(); n++; console.log('OK', name) }

check('recipeCuisine se omite cuando no existe', () => {
  assert.equal(schemaExtras({ cuisine: null }).recipeCuisine, undefined)
})

check('recipeCuisine conserva la cocina declarada', () => {
  assert.equal(schemaExtras({ cuisine: 'Colombiana' }).recipeCuisine, 'Colombiana')
})

check('keywords se serializan separados por comas', () => {
  assert.equal(schemaExtras({ keywords: ['lechona', 'horno', 'tradicional'] }).keywords, 'lechona, horno, tradicional')
})

check('keywords vacíos se omiten', () => {
  assert.equal(schemaExtras({ keywords: [] }).keywords, undefined)
})

check('Publisher Recipe incluye el logo público y usa el mismo @id que Organization en layout', () => {
  process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true'
  const publisher = recipePublisher()
  assert.equal(publisher['@id'], 'https://manualdecocina.com/#organization')
  assert.equal(publisher.logo.url, 'https://manualdecocina.com/brand/logo-manual-de-cocina.png')
})

check('Anclas HowToStep usan canonical KEEP para URL histórica', () => {
  process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true'
  assert.equal(recipeStepAnchor({ public_path: '/receta-de-lechona-colombiana', source_url: 'https://manualdecocina.com/receta-de-lechona-colombiana/' }, 2), 'https://manualdecocina.com/receta-de-lechona-colombiana/#paso-2')
  assert.equal(recipeStepAnchor({ public_path: '/pt/pandebono-caseiro' }, 1), 'https://manualdecocina.com/pt/pandebono-caseiro#paso-1')
})

check('Las siete portadas de categorías tienen metadatos y texto editorial traducidos', () => {
  for (const lang of SUPPORTED_LANGUAGES) {
    const c = CATEGORY_LANDING_COPY[lang]
    assert(c.title.length >= 12)
    assert(c.description.length >= 60)
    assert(c.intro.length >= (lang === 'ja' ? 40 : 100))
  }
})

console.log(`\\n${n} pruebas OK`)

check('Ingredientes españoles: singular, plural y contracción de unidad', () => {
  assert.equal(ingredientDisplayText({ amount: '2', unit: 'cucharada', name: 'cacao amargo en polvo' }, 'es'), '2 cucharadas de cacao amargo en polvo')
  assert.equal(ingredientDisplayText({ amount: '1', unit: 'cucharada', name: 'miel' }, 'es'), '1 cucharada de miel')
  assert.equal(ingredientDisplayText({ amount: '3', unit: 'cucharadita', name: 'azúcar' }, 'es'), '3 cucharaditas de azúcar')
  assert.equal(ingredientDisplayText({ amount: '4', unit: 'unidad', name: 'huevos' }, 'es'), '4 huevos')
  assert.equal(ingredientDisplayText({ amount: '4', unit: 'rebanada', name: 'pan crujiente' }, 'es'), '4 rebanadas de pan crujiente')
  assert.equal(ingredientDisplayPrefix({ amount: '1.5', unit: 'g' }, 'es'), '1,5 g')
})
check('Ingredientes españoles: unidades guardadas en plural, con "de", sustantivo o tamaño', () => {
  assert.equal(ingredientDisplayText({ amount: '2', unit: 'dientes', name: 'ajo picado' }, 'es'), '2 dientes de ajo picado')
  assert.equal(ingredientDisplayText({ amount: '2', unit: 'cucharadas', name: 'mantequilla' }, 'es'), '2 cucharadas de mantequilla')
  assert.equal(ingredientDisplayText({ amount: '1 1/4', unit: 'tazas', name: 'leche' }, 'es'), '1 1/4 tazas de leche')
  assert.equal(ingredientDisplayText({ amount: '1/2', unit: 'taza', name: 'azúcar' }, 'es'), '1/2 taza de azúcar')
  assert.equal(ingredientDisplayText({ amount: '1', unit: 'taza de', name: 'arroz' }, 'es'), '1 taza de arroz')
  assert.equal(ingredientDisplayText({ amount: '1', unit: 'grande', name: 'cebolla picada' }, 'es'), '1 cebolla grande picada')
  assert.equal(ingredientDisplayText({ amount: '3', unit: 'und', name: 'tomates' }, 'es'), '3 tomates')
  assert.equal(ingredientDisplayText({ amount: '2', unit: 'unidad de', name: 'huevos' }, 'es'), '2 huevos')
})
check('Otros idiomas: "unidad/pieza" no se repite delante del nombre; Stück alemán se conserva', () => {
  assert.equal(ingredientDisplayText({ amount: '4', unit: 'unidade', name: 'ovos' }, 'pt'), '4 ovos')
  assert.equal(ingredientDisplayText({ amount: '4', unit: 'piece', name: 'egg yolks' }, 'en'), '4 egg yolks')
  assert.equal(ingredientDisplayText({ amount: '1', unit: 'pezzo', name: 'uovo' }, 'it'), '1 uovo')
  assert.equal(ingredientDisplayText({ amount: '3', unit: 'unités', name: 'œufs' }, 'fr'), '3 œufs')
  assert.equal(ingredientDisplayText({ amount: '2', unit: 'Stück', name: 'Eier' }, 'de'), '2 Stück Eier')
  assert.equal(ingredientDisplayText({ amount: '200', unit: 'g', name: 'flour' }, 'en'), '200 g flour')})
check('El mismo formateador alimenta el listado visible y Recipe JSON-LD sin tocar datos originales', () => {
  const sample = { amount: '2', unit: 'cucharada', name: 'cacao amargo' }
  assert.equal(ingredientDisplayPrefix(sample, 'es') + ' ' + sample.name, ingredientDisplayText(sample, 'es'))
  assert.equal(ingredientDisplayText(sample, 'en'), '2 cucharada cacao amargo')
})
check('AggregateRating se omite si hay menos de cinco votos reales', () => {
  assert.equal(shouldPublishAggregateRating(true, 0), false)
  assert.equal(shouldPublishAggregateRating(true, 1), false)
  assert.equal(shouldPublishAggregateRating(true, 4), false)
  assert.equal(shouldPublishAggregateRating(true, 5), true)
  assert.equal(shouldPublishAggregateRating(false, 5), false)
})
