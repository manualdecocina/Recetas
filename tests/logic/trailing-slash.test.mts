import assert from 'node:assert/strict'
import { buildSlashMap, slashRedirectTarget } from '@/lib/trailing-slash'
import { recipeCanonicalUrl, recipeHref } from '@/lib/site'

let n = 0
const check = (name: string, fn: () => void) => { fn(); n++; console.log('OK', name) }

const historical = { public_path: '/it/casuela-colombiana-di-fagioli', source_url: 'https://manualdecocina.com/it/casuela-colombiana-di-fagioli/' }
const japanese = { public_path: '/ja/コロンビアのレチョナレシピ', source_url: 'https://manualdecocina.com/ja/コロンビアのレチョナレシピ/' }
const modern = { public_path: '/pt/receita-de-lechona-colombiana', source_url: null }
// En la base, public_path nunca termina en barra (verificado: 0 de 1568 publicadas).
const spanishRoot = { public_path: '/receta-bondiola-de-cerdo', source_url: 'https://manualdecocina.com/receta-bondiola-de-cerdo/' }
const map = buildSlashMap([historical, japanese, modern, spanishRoot])

check('Receta histórica sin barra → redirige a la versión con barra', () => {
  assert.equal(slashRedirectTarget('/it/casuela-colombiana-di-fagioli', map), '/it/casuela-colombiana-di-fagioli/')
  assert.equal(slashRedirectTarget('/receta-bondiola-de-cerdo', map), '/receta-bondiola-de-cerdo/')
})

check('Receta histórica con barra → no se toca', () => {
  assert.equal(slashRedirectTarget('/it/casuela-colombiana-di-fagioli/', map), null)
  assert.equal(slashRedirectTarget('/receta-bondiola-de-cerdo/', map), null)
})

check('Receta nueva (sin URL histórica) con barra → redirige a la versión sin barra', () => {
  assert.equal(slashRedirectTarget('/pt/receita-de-lechona-colombiana/', map), '/pt/receita-de-lechona-colombiana')
  assert.equal(slashRedirectTarget('/pt/receita-de-lechona-colombiana', map), null)
})

check('Japonés: funciona con la ruta decodificada', () => {
  assert.equal(slashRedirectTarget('/ja/コロンビアのレチョナレシピ', map), '/ja/コロンビアのレチョナレシピ/')
  assert.equal(slashRedirectTarget('/ja/コロンビアのレチョナレシピ/', map), null)
})

check('Lo que no es receta no se toca (portada, listados, categorías, desconocidas)', () => {
  for (const path of ['/', '/es', '/es/', '/es/recetas', '/es/recetas/', '/es/categorias/postres', '/no-existe', '/no-existe/', '/it/casuela-colombiana-di-fagioli//']) {
    assert.equal(slashRedirectTarget(path, map), null, path)
  }
})

check('Nunca hay bucle: el destino ya no redirige', () => {
  for (const path of ['/it/casuela-colombiana-di-fagioli', '/pt/receita-de-lechona-colombiana/', '/ja/コロンビアのレチョナレシピ']) {
    const target = slashRedirectTarget(path, map)
    assert.ok(target)
    assert.equal(slashRedirectTarget(target!, map), null)
  }
})

check('El destino coincide con la canónica y con los enlaces internos', () => {
  for (const row of [historical, japanese, modern, spanishRoot]) {
    const canonicalPath = new URL(recipeCanonicalUrl(row)).pathname
    const wrong = canonicalPath.endsWith('/') ? canonicalPath.slice(0, -1) : `${canonicalPath}/`
    assert.equal(slashRedirectTarget(decodeURIComponent(wrong), map), decodeURIComponent(canonicalPath))
    assert.equal(recipeHref(row), decodeURIComponent(canonicalPath))
  }
})

console.log(`\n${n} pruebas OK`)
