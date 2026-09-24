import assert from 'node:assert/strict'

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

console.log(`\\n${n} pruebas OK`)
