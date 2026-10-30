import assert from 'node:assert/strict'
import { groupBlockers, groupStage, groupImageUrls, groupTitle, REQUIRED_LANGUAGES, type PublicationRow } from '@/lib/admin/publication'

let n = 0
const check = (name: string, fn: () => void) => { fn(); n++; console.log('OK', name) }

const complete = (language: string, published = false): PublicationRow => ({
  id: `id-${language}`,
  recipe_group_id: 'g1',
  language,
  title: `Receta ${language}`,
  public_path: `/${language}/receta`,
  published,
  updated_at: '2026-10-30T00:00:00Z',
  image_url: '/recetas/x/portada.webp',
  ingredients: [{ name: 'huevo', amount: '2' }],
  steps: [{ title: 'Paso', content: 'Hacer', image_url: '/recetas/x/paso-01.webp' }],
  nutrition: { calories: 300 },
  seo: { title: 'T', description: 'D', image_variants: ['/recetas/x/portada-1x1.webp'] },
})

check('Un plato completo en 7 idiomas no tiene bloqueos', () => {
  assert.deepEqual(groupBlockers(REQUIRED_LANGUAGES.map((l) => complete(l))), [])
})

check('Detecta idiomas que faltan y campos vacíos', () => {
  const rows = [complete('es'), { ...complete('en'), nutrition: null, seo: { title: 'T' } }]
  const b = groupBlockers(rows)
  assert.ok(b.includes('falta el idioma ja'))
  assert.ok(b.includes('en: sin nutrición'))
  assert.ok(b.includes('en: sin título o descripción SEO'))
  assert.ok(!b.some((x) => x.startsWith('es:')))
})

check('Etapas: incompleta, por revisar, devuelta, aprobada y publicada', () => {
  const ready = REQUIRED_LANGUAGES.map((l) => complete(l))
  const review = (status: 'aprobada' | 'devuelta') => ({ recipe_group_id: 'g1', status, comment: null, reviewed_at: '' })
  assert.equal(groupStage([complete('es')], undefined, groupBlockers([complete('es')])), 'incompleta')
  assert.equal(groupStage(ready, undefined, []), 'por-revisar')
  assert.equal(groupStage(ready, review('devuelta'), []), 'devuelta')
  assert.equal(groupStage(ready, review('aprobada'), []), 'aprobada')
  assert.equal(groupStage(REQUIRED_LANGUAGES.map((l) => complete(l, true)), undefined, []), 'publicada')
})

check('Imágenes: portada, variantes y pasos sin repetidos', () => {
  const urls = groupImageUrls([complete('es'), complete('en')])
  assert.deepEqual(urls.sort(), ['/recetas/x/paso-01.webp', '/recetas/x/portada-1x1.webp', '/recetas/x/portada.webp'])
})

check('El nombre en la cola es el título en español', () => {
  assert.equal(groupTitle([complete('en'), complete('es')]), 'Receta es')
})

console.log(`\n${n} pruebas OK`)
