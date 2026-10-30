import assert from 'node:assert/strict'
import { seoLengthIssues, seoSaveError, titleStatus, descriptionStatus, visibleLength } from '@/lib/admin/seo-checks'

let n = 0
const check = (name: string, fn: () => void) => { fn(); n++; console.log('OK', name) }

check('Cuenta caracteres visibles, no bytes', () => {
  assert.equal(visibleLength('  piña  '), 4)
  assert.equal(visibleLength('café 🍰'), 6)
})

check('Título: corto, bien y largo', () => {
  assert.equal(titleStatus('Arepas'), 'corto')
  assert.equal(titleStatus('Hojuelas colombianas crujientes con canela'), 'ok')
  assert.equal(titleStatus('x'.repeat(61)), 'largo')
})

check('Descripción: rango 120–160', () => {
  assert.equal(descriptionStatus('x'.repeat(119)), 'corto')
  assert.equal(descriptionStatus('x'.repeat(140)), 'ok')
  assert.equal(descriptionStatus('x'.repeat(161)), 'largo')
})

check('Japonés no se mide con la regla latina', () => {
  assert.deepEqual(seoLengthIssues('ja', 'x'.repeat(90), 'y'), [])
  assert.equal(seoLengthIssues('es', 'x'.repeat(90), 'y'.repeat(140)).length, 1)
})

check('No deja guardar textos rotos', () => {
  assert.equal(seoSaveError('Título correcto de receta', 'd'.repeat(130)), null)
  assert.match(seoSaveError('Hola', 'd'.repeat(130)) ?? '', /corto/)
  assert.match(seoSaveError('Título correcto de receta', 'corta') ?? '', /corta/)
  assert.match(seoSaveError('Título <b>malo</b> de receta', 'd'.repeat(130)) ?? '', /</)
})

console.log(`\n${n} pruebas OK`)
