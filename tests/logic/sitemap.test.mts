import assert from 'node:assert/strict'
process.env.NEXT_PUBLIC_SITE_URL = 'https://manualdecocina.com'
const g = 'aaaaaaaa-0000-0000-0000-000000000001', solo = 'bbbbbbbb-0000-0000-0000-000000000002'
;(globalThis as any).__ROWS__ = [
  { recipe_group_id: g, language: 'es', slug: 'lechona-colombiana', updated_at: '2026-09-20T00:00:00Z' },
  { recipe_group_id: g, language: 'ja', slug: 'コロンビアのレチョナレシピ', updated_at: '2026-09-21T00:00:00Z' },
  { recipe_group_id: solo, language: 'de', slug: 'nur-deutsch', updated_at: '2026-09-22T00:00:00Z' },
]
const sitemap = (await import('@/app/sitemap')).default

process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'false'
assert.deepEqual(await sitemap(), []); console.log('OK sitemap vacío si no se permite indexar')

process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true'
const s: any[] = await sitemap()
const urls = s.map((e) => e.url)
assert.equal(s.length, 6 * 2 + 3); console.log('OK 12 URLs de home/listado + 3 recetas')
assert.ok(urls.includes('https://manualdecocina.com/ja/recetas')); console.log('OK listados por idioma incluidos')

const es = s.find((e) => e.url.endsWith('/es/receta/lechona-colombiana'))
assert.deepEqual(Object.keys(es.alternates.languages).sort(), ['es', 'ja', 'x-default'])
assert.equal(es.alternates.languages['x-default'], es.url)
assert.equal(es.lastModified, '2026-09-20T00:00:00Z'); console.log('OK receta traducida: alternates es/ja + x-default a es + lastModified')

const de = s.find((e) => e.url.endsWith('/de/receta/nur-deutsch'))
assert.equal(de.alternates, undefined); console.log('OK receta sin traducciones: sin alternates')

const home = s.find((e) => e.url === 'https://manualdecocina.com/fr')
assert.equal(Object.keys(home.alternates.languages).length, 7); console.log('OK home: 6 idiomas + x-default')
