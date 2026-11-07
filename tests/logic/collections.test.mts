import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { COLLECTIONS, COVER_FILES, collectionCover, spanishPathVariants, collectionsForSpanishPath, arrangeCollection, collectionAlternatePaths, collectionPath, collectionSpanishPaths, findCollection } from '@/lib/collections'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'
import { seoSaveError } from '@/lib/admin/seo-checks'
import { orderCollections, homeCollections } from '@/lib/collection-order'

let n = 0
const check = (name: string, fn: () => void) => { fn(); n++; console.log('OK', name) }
const navidad = COLLECTIONS.find((c) => c.id === 'navidad-colombiana')!

check('Navidad fija, novedades después y máximo dos colecciones en inicio', () => {
  assert.deepEqual(COLLECTIONS.map(c => c.id), ['navidad-colombiana', 'derivados-de-la-leche', 'postres-caseros', 'cenas-faciles-rapidas'])
  assert.deepEqual(homeCollections(COLLECTIONS).map(c => c.id), ['navidad-colombiana', 'derivados-de-la-leche'])
  // Una futura publicación reemplaza la segunda tarjeta, sin desplazar Navidad ni perder las anteriores.
  const future = { ...COLLECTIONS[1], id: 'futura', publishedAt: '2026-12-01T12:00:00Z' }
  const input = [COLLECTIONS[3], future, navidad, COLLECTIONS[1], COLLECTIONS[2]]
  const before = [...input]
  assert.deepEqual(orderCollections(input).map(c => c.id), ['navidad-colombiana', 'futura', 'derivados-de-la-leche', 'postres-caseros', 'cenas-faciles-rapidas'])
  assert.deepEqual(homeCollections(input).map(c => c.id), ['navidad-colombiana', 'futura'])
  assert.deepEqual(input, before, 'Ordenar no modifica el catálogo recibido')
  assert.deepEqual(homeCollections([]), [])
  assert.deepEqual(homeCollections([navidad]), [navidad])
})

check('Cada colección mantiene su selección editorial completa', () => {
  const counts: Record<string, number> = { 'navidad-colombiana': 21, 'derivados-de-la-leche': 13, 'postres-caseros': 20, 'cenas-faciles-rapidas': 20 }
  for (const c of COLLECTIONS) assert.equal(collectionSpanishPaths(c).length, counts[c.id], `${c.id}: selección incompleta`)
})

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

check('Papaya se usa una sola vez por URL canónica; pollo relleno navideño tiene su posición reservada', () => {
  const christmas = navidad.sections.flat()
  assert.equal(christmas.filter((path) => path.includes('papaya-verde')).length, 1)
  assert.ok(christmas.includes('/dulce-de-papaya-verde'))
  assert.ok(!christmas.includes('/es/receta/dulce-de-papaya-verde'))
  assert.ok(christmas.includes('/es/receta/pollo-relleno-navideno'))
  assert.deepEqual(collectionsForSpanishPath('/dulce-de-papaya-verde').map(c => c.id), ['navidad-colombiana'])
  assert.deepEqual(collectionsForSpanishPath('/es/receta/pollo-relleno-navideno').map(c => c.id), ['navidad-colombiana'])
})

check('Ninguna receta repetida dentro de la colección', () => {
  for (const c of COLLECTIONS) assert.equal(collectionSpanishPaths(c).length, c.sections.flat().length)
})

check('Ordena por secciones y omite lo que no existe en ese idioma', () => {
  const groups = new Map([['/receta-de-lechona-colombiana', 'g1'], ['/natilla-colombiana', 'g2'], ['/lomo-de-cerdo-relleno', 'g3']])
  const recipes = new Map([['g1', 'lechona'], ['g3', 'lomo']])
  assert.deepEqual(arrangeCollection(navidad, groups, recipes), [['lechona'], ['lomo']])
})

check('Portada propia: si se pone la carpeta, los 4 archivos existen en /public', () => {
  for (const c of COLLECTIONS) {
    if (!c.coverDir) continue
    assert.match(c.coverDir, /^\/colecciones\/[a-z0-9-]+$/, `${c.id}: coverDir debe ser /colecciones/<id>`)
    for (const file of COVER_FILES) {
      const path = new URL(`../../public${collectionCover(c, file)}`, import.meta.url)
      assert.ok(existsSync(path), `${c.id}: falta public${collectionCover(c, file)}`)
    }
  }
})

check('Acepta /slug y /es/receta/slug como la misma receta', () => {
  assert.deepEqual(spanishPathVariants('/dulce-de-breva'), ['/dulce-de-breva', '/es/receta/dulce-de-breva'])
  assert.deepEqual(spanishPathVariants('/es/receta/tamal-tolimense'), ['/es/receta/tamal-tolimense', '/tamal-tolimense'])
  assert.deepEqual(spanishPathVariants('/natilla-colombiana/'), ['/natilla-colombiana', '/es/receta/natilla-colombiana'])
})

check('Cada receta sabe en qué colección está (enlace de vuelta)', () => {
  assert.deepEqual(collectionsForSpanishPath('/natilla-colombiana').map((c) => c.id), ['navidad-colombiana'])
  assert.deepEqual(collectionsForSpanishPath('/es/receta/tamal-tolimense').map((c) => c.id), ['navidad-colombiana'])
  assert.deepEqual(collectionsForSpanishPath('/es/receta/dulce-de-breva').map((c) => c.id), ['navidad-colombiana'])
  assert.deepEqual(collectionsForSpanishPath('/suero-costeno-casero').map((c) => c.id), ['derivados-de-la-leche'])
  assert.deepEqual(collectionsForSpanishPath('/receta-bondiola-de-cerdo'), [])
  assert.deepEqual(collectionsForSpanishPath(undefined), [])
})

check('Las preguntas frecuentes están en los 7 idiomas, con la misma cantidad', () => {
  for (const c of COLLECTIONS) {
    const counts = SUPPORTED_LANGUAGES.map((l) => c.text[l].faq?.length ?? 0)
    assert.equal(new Set(counts).size, 1, `${c.id}: distinta cantidad de preguntas por idioma (${counts.join(',')})`)
    for (const l of SUPPORTED_LANGUAGES) for (const f of c.text[l].faq ?? []) assert.ok(f.q.trim() && f.a.trim(), `${c.id}/${l}: pregunta vacía`)
  }
})

console.log(`\n${n} pruebas OK`)
