import assert from 'node:assert/strict'

process.env.NEXT_PUBLIC_SITE_URL = 'https://manualdecocina.com/'
process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true'
const { recipeAlternates, allLanguageAlternates } = await import('@/lib/seo')
const site = await import('@/lib/site')

let n = 0
const check = (name: string, fn: () => void) => { fn(); n++; console.log('OK', name) }

check('getSiteUrl quita la barra final', () => assert.equal(site.getSiteUrl(), 'https://manualdecocina.com'))
check('normalizePublicPath normaliza rutas históricas con barra final', () => assert.equal(site.normalizePublicPath('/receta-bondiola-de-cerdo/'), '/receta-bondiola-de-cerdo'))
check('canonical conserva la barra histórica y la ruta japonesa exactas', () => {
  const path = '/ja/アグラーツチーズケーキのレシピ/'
  assert.equal(site.publicUrl(path), 'https://manualdecocina.com' + path)
  assert.equal(site.publicPathHref(path), path)
})
check('Brasil usa pt-BR y enlaza la ruta localizada autorreferente', () => {
  const current = { language: 'pt', public_path: '/pt/pao-de-aveia-caseiro/' }
  const a: any = recipeAlternates(current, [current, { language: 'es', public_path: '/receta-pan-de-avena/' }])
  assert.equal(a.languages['pt-BR'], a.canonical)
  assert.equal(a.canonical, 'https://manualdecocina.com/pt/pao-de-aveia-caseiro/')
  assert.equal(a.languages.pt, undefined)
  assert.equal(a.languages.es, 'https://manualdecocina.com/receta-pan-de-avena/')
})

process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'false'
process.env.NEXT_PUBLIC_PREVIEW_SITE_URL = 'https://preview.manualdecocina.com/'
check('preview: canonical y hreflang permanecen en preview y conservan public_path', () => {
  const current = { language: 'es', public_path: '/receta-de-lechona-colombiana' }
  const translations = [current, { language: 'ja', public_path: '/ja/コロンビアのレチョナレシピ' }]
  const a: any = recipeAlternates(current, translations)
  assert.equal(a.canonical, 'https://preview.manualdecocina.com/receta-de-lechona-colombiana')
  assert.equal(a.languages.es, a.canonical)
  assert.equal(a.languages.ja, 'https://preview.manualdecocina.com/ja/コロンビアのレチョナレシピ')
  assert.equal(site.isIndexingAllowed(), false)
})
check('preview: absoluteUrl usa el host desplegado para imágenes sociales', () => {
  assert.equal(site.absoluteUrl('/recetas/canelones-carne-pina/portada.webp'), 'https://preview.manualdecocina.com/recetas/canelones-carne-pina/portada.webp')
})
process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true'
check('producción: absoluteUrl vuelve al dominio canónico', () => {
  assert.equal(site.absoluteUrl('/recetas/canelones-carne-pina/portada.webp'), 'https://manualdecocina.com/recetas/canelones-carne-pina/portada.webp')
})

check('receta sin traducciones: solo canonical', () => {
  const a = recipeAlternates(
    { language: 'de', public_path: '/de/kolumbianisches-lechona-rezept' },
    [{ language: 'de', public_path: '/de/kolumbianisches-lechona-rezept' }]
  )
  assert.deepEqual(a, { canonical: 'https://manualdecocina.com/de/kolumbianisches-lechona-rezept' })
})

check('receta localizada: hreflang usa las URL públicas históricas', () => {
  const tr = [
    { language: 'es', public_path: '/receta-de-lechona-colombiana' },
    { language: 'de', public_path: '/de/kolumbianisches-lechona-rezept' },
    { language: 'ja', public_path: '/ja/コロンビアのレチョナレシピ' },
  ]
  const a: any = recipeAlternates(
    { language: 'de', public_path: '/de/kolumbianisches-lechona-rezept' },
    tr
  )
  assert.equal(a.canonical, 'https://manualdecocina.com/de/kolumbianisches-lechona-rezept')
  assert.deepEqual(Object.keys(a.languages).sort(), ['de', 'es', 'ja', 'x-default'])
  assert.equal(a.languages.es, 'https://manualdecocina.com/receta-de-lechona-colombiana')
  assert.equal(a.languages['x-default'], a.languages.es, 'x-default apunta a la URL española real (raíz histórica)')
  assert.equal(a.languages.de, a.canonical)
})

check('traducciones sin versión es: hreflang sin x-default', () => {
  const tr = [
    { language: 'de', public_path: '/de/a' },
    { language: 'it', public_path: '/it/b' },
  ]
  const a: any = recipeAlternates({ language: 'it', public_path: '/it/b' }, tr)
  assert.deepEqual(Object.keys(a.languages).sort(), ['de', 'it'])
  assert.equal('x-default' in a.languages, false)
})

check('home/listado: 7 idiomas, canonical propia', () => {
  const a: any = allLanguageAlternates('/ja/recetas', (l: string) => `/${l}/recetas`)
  assert.equal(a.canonical, 'https://manualdecocina.com/ja/recetas')
  assert.deepEqual(Object.keys(a.languages).sort(), ['de', 'en', 'es', 'fr', 'it', 'ja', 'pt-BR', 'x-default'])
  assert.equal(a.languages['x-default'], 'https://manualdecocina.com/es/recetas')
})

process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'false'
const robots = (await import('@/app/robots')).default
check('robots sin permiso: Disallow / y sin sitemap', () => {
  const r: any = robots()
  assert.deepEqual(r.rules, { userAgent: '*', disallow: '/' })
  assert.equal(r.sitemap, undefined)
})
process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true'
check('robots con permiso: permite /, bloquea /admin/, declara sitemap', () => {
  const r: any = robots()
  assert.deepEqual((robots() as any).rules, [{ userAgent: '*', allow: '/', disallow: '/admin/' }])
  assert.equal(r.sitemap, 'https://manualdecocina.com/sitemap.xml')
})
process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'TRUE'
check('robots: solo "true" exacto habilita indexación', () => {
  assert.deepEqual((robots() as any).rules, { userAgent: '*', disallow: '/' })
})

console.log(`\n${n} pruebas OK`)

// Recipe time markup is emitted only when prep and cook times are both known.
