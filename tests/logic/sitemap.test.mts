import assert from 'node:assert/strict'

process.env.NEXT_PUBLIC_SITE_URL = 'https://manualdecocina.com'

;(globalThis as any).__ROWS__ = [
  { recipe_group_id: 'aaaaaaaa-0000-0000-0000-000000000001', language: 'es', slug: 'lechona-colombiana', public_path: '/receta-de-lechona-colombiana', updated_at: '2026-09-20T00:00:00Z' },
  { recipe_group_id: 'aaaaaaaa-0000-0000-0000-000000000001', language: 'ja', slug: 'コロンビアのレチョナレシピ', public_path: '/ja/コロンビアのレチョナレシピ', updated_at: '2026-09-21T00:00:00Z' },
  { recipe_group_id: 'bbbbbbbb-0000-0000-0000-000000000002', language: 'de', slug: 'nur-deutsch', public_path: '/de/receta/nur-deutsch', updated_at: '2026-09-22T00:00:00Z' },
  { recipe_group_id: 'cccccccc-0000-0000-0000-000000000003', language: 'es', slug: 'legacy-card', public_path: '/recipe-cards/legacy-card', updated_at: '2026-09-23T00:00:00Z' },
]

;(globalThis as any).__INGREDIENTS__ = [
  { slug: 'ajo', updated_at: '2026-09-24T00:00:00Z' },
  { slug: 'aceite-de-oliva', updated_at: '2026-09-23T00:00:00Z' },
]

;(globalThis as any).__CONTENT_PAGES__ = [
  { language: 'es', public_path: '/about-manual-de-cocina', updated_at: '2026-09-22T00:00:00Z' },
]

const sitemap = (await import('@/app/sitemap')).default

process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'false'
process.env.NEXT_PUBLIC_PREVIEW_SITE_URL = 'https://preview.manualdecocina.com/'
const preview: any[] = await sitemap()
assert.ok(preview.length > 0, 'preview debe permitir auditar el sitemap')
assert.ok(preview.every((entry) => entry.url.startsWith('https://preview.manualdecocina.com/')))
const previewRecipe = preview.find((entry) => entry.url === 'https://preview.manualdecocina.com/receta-de-lechona-colombiana')
assert.equal(previewRecipe.alternates.languages.ja, 'https://preview.manualdecocina.com/ja/コロンビアのレチョナレシピ')
assert.equal(process.env.NEXT_PUBLIC_ALLOW_INDEXING, 'false')
console.log('OK sitemap de preview: rutas históricas e hreflang en el propio entorno, sin habilitar indexación')

process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true'
const s: any[] = await sitemap()
const urls = s.map((e) => e.url)

// 7 idiomas × (home, listado, categorías) + 8 institucionales × 7 idiomas
// + 3 recetas publicadas del mock + herramienta + índice ingredientes + 2 ingredientes + content page.
assert.equal(s.length, 7 * 3 + 8 * 7 + 3 + 1 + 1 + 2 + 1)
assert.ok(!urls.some((url) => url.includes('/recipe-cards/')), 'recipe-cards no deben entrar en sitemap')
assert.ok(urls.includes('https://manualdecocina.com/es/ingredientes'))
assert.ok(urls.includes('https://manualdecocina.com/es/ingredientes/ajo'))
assert.ok(urls.includes('https://manualdecocina.com/es/quienes-somos'))
const aboutEs = s.find((e) => e.url === 'https://manualdecocina.com/es/quienes-somos')
assert.deepEqual(Object.keys(aboutEs.alternates.languages).sort(), ['de', 'en', 'es', 'fr', 'it', 'ja', 'pt-BR', 'x-default'])
assert.equal(aboutEs.alternates.languages['x-default'], 'https://manualdecocina.com/es/quienes-somos')
console.log('OK home/listado + institucionales + herramienta + recetas + ingredientes + contenido')

assert.ok(urls.includes('https://manualdecocina.com/ja/recetas'))
const es = s.find((e) => e.url === 'https://manualdecocina.com/receta-de-lechona-colombiana')
assert.deepEqual(Object.keys(es.alternates.languages).sort(), ['es', 'ja'])
assert.equal('x-default' in es.alternates.languages, false, 'el sitemap de recetas omite x-default')
assert.equal(es.lastModified, '2026-09-20T00:00:00Z')
console.log('OK receta histórica: alternates usan public_path')

const de = s.find((e) => e.url === 'https://manualdecocina.com/de/receta/nur-deutsch')
assert.equal(de.alternates, undefined)
console.log('OK receta sin traducciones: sin alternates')

const page = s.find((e) => e.url === 'https://manualdecocina.com/about-manual-de-cocina')
assert.ok(page)
console.log('OK content page pública incluida')

;(globalThis as any).__ROWS__ = [
  { recipe_group_id: 'br', language: 'es', public_path: '/receta-pan-de-avena/', updated_at: '2026-10-05T00:00:00Z' },
  { recipe_group_id: 'br', language: 'pt', public_path: '/pt/pao-de-aveia-caseiro/', updated_at: '2026-10-05T00:00:00Z' },
]
const brazil: any[] = await sitemap()
const pt = brazil.find((e) => e.url === 'https://manualdecocina.com/pt/pao-de-aveia-caseiro/')
assert.ok(pt, 'sitemap conserva la barra final del public_path')
assert.equal(pt.alternates.languages['pt-BR'], pt.url)
assert.equal(pt.alternates.languages.es, 'https://manualdecocina.com/receta-pan-de-avena/')
console.log('OK sitemap: ruta exacta y hreflang de Brasil')


// The public Data API caps a request at 1000 rows. Categories that first occur
// on the next page must stay in the sitemap together with their recipe URLs.
;(globalThis as any).__ROWS__ = [
  ...Array.from({ length: 1000 }, (_, i) => ({
    recipe_group_id: 'filler-' + i, language: 'es', category: null,
    public_path: '/filler-' + i, updated_at: '2026-10-09T00:00:00Z',
  })),
  ...['Sobremesas', 'Saladas', 'Sopas e cremes'].map((category, i) => ({
    recipe_group_id: 'late-pt-' + i, language: 'pt', category,
    public_path: '/pt/late-' + i, updated_at: '2026-10-09T00:00:00Z',
  })),
]
const paginated: any[] = await sitemap()
for (const slug of ['postres', 'ensaladas', 'sopas-y-cremas']) {
  const url = 'https://manualdecocina.com/pt/categorias/' + slug
  const matches = paginated.filter((entry) => entry.url === url)
  assert.equal(matches.length, 1, 'category first seen after 1000 rows must occur exactly once')
  assert.equal(matches[0].alternates.languages['pt-BR'], url)
}
assert.ok(paginated.some((entry) => entry.url === 'https://manualdecocina.com/pt/late-2'))
console.log('OK paginated sitemap: Portuguese category routes after the first 1000 rows are retained')
