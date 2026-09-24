import assert from 'node:assert/strict'
process.env.NEXT_PUBLIC_SITE_URL = 'https://manualdecocina.com'
;(globalThis as any).__ROWS__ = [
  { recipe_group_id: 'aaaaaaaa-0000-0000-0000-000000000001', language: 'es', slug: 'lechona-colombiana', public_path: '/receta-de-lechona-colombiana', updated_at: '2026-09-20T00:00:00Z' },
  { recipe_group_id: 'aaaaaaaa-0000-0000-0000-000000000001', language: 'ja', slug: 'コロンビアのレチョナレシピ', public_path: '/ja/コロンビアのレチョナレシピ', updated_at: '2026-09-21T00:00:00Z' },
  { recipe_group_id: 'bbbbbbbb-0000-0000-0000-000000000002', language: 'de', slug: 'nur-deutsch', public_path: '/de/receta/nur-deutsch', updated_at: '2026-09-22T00:00:00Z' },
]
;(globalThis as any).__CONTENT_PAGES__ = [
  { language: 'es', public_path: '/about-manual-de-cocina', updated_at: '2026-09-22T00:00:00Z' },
]
const sitemap = (await import('@/app/sitemap')).default

process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'false'
assert.deepEqual(await sitemap(), [])
console.log('OK sitemap vacío si no se permite indexar')

process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true'
const s: any[] = await sitemap()
const urls = s.map((e) => e.url)
assert.equal(s.length, 6 * 2 + 3 + 1)
console.log('OK home/listado + recetas + contenido')

assert.ok(urls.includes('https://manualdecocina.com/ja/recetas'))
const es = s.find((e) => e.url === 'https://manualdecocina.com/receta-de-lechona-colombiana')
assert.deepEqual(Object.keys(es.alternates.languages).sort(), ['es', 'ja', 'x-default'])
assert.equal(es.alternates.languages['x-default'], es.url)
assert.equal(es.lastModified, '2026-09-20T00:00:00Z')
console.log('OK receta histórica: alternates usan public_path')

const de = s.find((e) => e.url === 'https://manualdecocina.com/de/receta/nur-deutsch')
assert.equal(de.alternates, undefined)
console.log('OK receta sin traducciones: sin alternates')

const page = s.find((e) => e.url === 'https://manualdecocina.com/about-manual-de-cocina')
assert.ok(page)
console.log('OK content page pública incluida')
