import assert from 'node:assert/strict'
import { COLLECTIONS, arrangeCollection, collectionAlternatePaths, collectionPath, collectionSpanishPaths, findCollection } from '@/lib/collections'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'
import { seoSaveError } from '@/lib/admin/seo-checks'

let n = 0
const check = (name: string, fn: () => void) => { fn(); n++; console.log('OK', name) }
const navidad = COLLECTIONS.find((c) => c.id === 'navidad-colombiana')!

check('Cada colección tiene los 7 idiomas completos', () => {
  for (const c of COLLECTIONS) for (const l of SUPPORTED_LANGUAGES) {
    const t = c.text[l]
    assert.ok(t, `${c.id} sin ${l}`)
    assert.ok(t.slug && t.title && t.seoTitle && t.description && t.intro.length, `${c.id}/${l} incompleto`)
    assert.equal(t.sections.length, c.sections.length, `${c.id}/${l}: secciones`)
    assert.equal(seoSaveError(t.seoTitle, t.description), null, `${c.id}/${l}: SEO`)
  }
})

check('Slugs únicos por idioma y sin barras', () => {
  for (const l of SUPPORTED_LANGUAGES) {
    const slugs = COLLECTIONS.map((c) => c.text[l].slug)
    assert.equal(new Set(slugs).size, slugs.length)
    for (const s of slugs) assert.ok(!s.includes('/'))
  }
})

check('Encuentra la colección por slug, también codificado (japonés)', () => {
  assert.equal(findCollection('es', 'recetas-navidad-colombiana')?.id, 'navidad-colombiana')
  assert.equal(findCollection('ja', encodeURIComponent('コロンビアのクリスマスレシピ'))?.id, 'navidad-colombiana')
  assert.equal(findCollection('es', 'colombian-christmas-recipes'), null)
  assert.equal(findCollection('es', '%E0%A4%A'), null)
})

check('Rutas: /<idioma>/colecciones/<slug> en los 7 idiomas', () => {
  assert.equal(collectionPath('de', navidad), '/de/colecciones/kolumbianische-weihnachtsrezepte')
  assert.equal(Object.keys(collectionAlternatePaths(navidad)).length, 7)
})

check('Ninguna receta repetida dentro de la colección', () => {
  for (const c of COLLECTIONS) assert.equal(collectionSpanishPaths(c).length, c.sections.flat().length)
})

check('Ordena por secciones y omite lo que no existe en ese idioma', () => {
  const groups = new Map([['/receta-de-lechona-colombiana', 'g1'], ['/natilla-colombiana', 'g2'], ['/lomo-de-cerdo-relleno', 'g3']])
  const recipes = new Map([['g1', 'lechona'], ['g3', 'lomo']])
  assert.deepEqual(arrangeCollection(navidad, groups, recipes), [['lechona'], ['lomo']])
})

console.log(`\n${n} pruebas OK`)
