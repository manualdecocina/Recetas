import assert from 'node:assert/strict'

process.env.NEXT_PUBLIC_SITE_URL = 'https://manualdecocina.com/'
const { recipeAlternates, allLanguageAlternates } = await import('@/lib/seo')
const site = await import('@/lib/site')

let n = 0
const check = (name: string, fn: () => void) => { fn(); n++; console.log('OK', name) }

check('getSiteUrl quita la barra final', () => assert.equal(site.getSiteUrl(), 'https://manualdecocina.com'))

check('receta sin traducciones: solo canonical, sin hreflang ni x-default', () => {
  const a = recipeAlternates({ language: 'de', slug: 'lechona' }, [{ language: 'de', slug: 'lechona' }])
  assert.deepEqual(a, { canonical: 'https://manualdecocina.com/de/receta/lechona' })
})

check('receta con traducciones incluyendo es: hreflang completo + x-default a es', () => {
  const tr = [{ language: 'es', slug: 'lechona-colombiana' }, { language: 'de', slug: 'kolumbianisches-lechona-rezept' }, { language: 'ja', slug: 'コロンビアのレチョナレシピ' }]
  const a: any = recipeAlternates({ language: 'de', slug: 'kolumbianisches-lechona-rezept' }, tr)
  assert.equal(a.canonical, 'https://manualdecocina.com/de/receta/kolumbianisches-lechona-rezept')
  assert.deepEqual(Object.keys(a.languages).sort(), ['de', 'es', 'ja', 'x-default'])
  assert.equal(a.languages['x-default'], 'https://manualdecocina.com/es/receta/lechona-colombiana')
  assert.equal(a.languages.de, a.canonical, 'hreflang incluye la propia versión')
})

check('traducciones sin versión es: hreflang sin x-default', () => {
  const tr = [{ language: 'de', slug: 'a' }, { language: 'it', slug: 'b' }]
  const a: any = recipeAlternates({ language: 'it', slug: 'b' }, tr)
  assert.deepEqual(Object.keys(a.languages).sort(), ['de', 'it'])
  assert.equal('x-default' in a.languages, false)
})

check('home/listado: 6 idiomas + x-default a /es, canonical propia', () => {
  const a: any = allLanguageAlternates('/ja/recetas', (l: string) => `/${l}/recetas`)
  assert.equal(a.canonical, 'https://manualdecocina.com/ja/recetas')
  assert.deepEqual(Object.keys(a.languages).sort(), ['de', 'en', 'es', 'fr', 'it', 'ja', 'x-default'])
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
  assert.deepEqual(r.rules, [{ userAgent: '*', allow: '/', disallow: '/admin/' }])
  assert.equal(r.sitemap, 'https://manualdecocina.com/sitemap.xml')
})
process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'TRUE'
check('robots: solo "true" exacto habilita indexación', () => {
  assert.deepEqual((robots() as any).rules, { userAgent: '*', disallow: '/' })
})

console.log(`\n${n} pruebas OK`)
