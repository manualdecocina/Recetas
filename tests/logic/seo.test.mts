import assert from 'node:assert/strict'

process.env.NEXT_PUBLIC_SITE_URL = 'https://manualdecocina.com/'
const { recipeAlternates, allLanguageAlternates } = await import('@/lib/seo')
const site = await import('@/lib/site')

let n = 0
const check = (name: string, fn: () => void) => { fn(); n++; console.log('OK', name) }

check('getSiteUrl quita la barra final', () => assert.equal(site.getSiteUrl(), 'https://manualdecocina.com'))
check('normalizePublicPath normaliza rutas históricas con barra final', () => assert.equal(site.normalizePublicPath('/receta-bondiola-de-cerdo/'), '/receta-bondiola-de-cerdo'))

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
  assert.deepEqual(Object.keys(a.languages).sort(), ['de', 'es', 'ja'])
  assert.equal(a.languages.es, 'https://manualdecocina.com/receta-de-lechona-colombiana')
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

check('home/listado: 6 idiomas, canonical propia', () => {
  const a: any = allLanguageAlternates('/ja/recetas', (l: string) => `/${l}/recetas`)
  assert.equal(a.canonical, 'https://manualdecocina.com/ja/recetas')
  assert.deepEqual(Object.keys(a.languages).sort(), ['de', 'en', 'es', 'fr', 'it', 'ja'])
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
