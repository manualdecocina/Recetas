import assert from 'node:assert/strict'

process.env.NEXT_PUBLIC_SITE_URL = 'https://manualdecocina.com/'
process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true'
const { recipeAlternates, allLanguageAlternates, siteRobots } = await import('@/lib/seo')
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
check('WordPress KEEP: las URL históricas mantienen la barra final en canonical/hreflang sin cambiar public_path', () => {
  const old = { language: 'es', public_path: '/receta-de-lechona-colombiana', source_url: 'https://manualdecocina.com/receta-de-lechona-colombiana/' }
  const newer = { language: 'ja', public_path: '/ja/コロンビアのレチョナレシピ', source_url: null }
  const a: any = recipeAlternates(old, [old, newer])
  assert.equal(a.canonical, old.source_url)
  assert.equal(a.languages.es, old.source_url)
  assert.equal(a.languages.ja, site.publicUrl(newer.public_path))
  assert.equal(site.recipeCanonicalUrl({public_path: old.public_path, source_url: 'https://othersite.invalid/receta-de-lechona-colombiana/'}), site.publicUrl(old.public_path))
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
  assert.deepEqual(Object.keys(a.languages).sort(), ['de', 'es', 'ja'])
  assert.equal(a.languages.es, 'https://manualdecocina.com/receta-de-lechona-colombiana')
  assert.equal('x-default' in a.languages, false, 'las recetas omiten x-default incluso con versión española')
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
check('preview: siteRobots bloquea index/follow también para googlebot', () => {
  const r: any = siteRobots()
  assert.equal(r.index, false)
  assert.equal(r.follow, false)
  assert.deepEqual(r.googleBot, { index: false, follow: false })
})
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
  assert.equal(r.sitemap, 'https://manualdecocina.com/sitemap_index.xml')
})
process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'TRUE'
check('robots: solo "true" exacto habilita indexación', () => {
  assert.deepEqual((robots() as any).rules, { userAgent: '*', disallow: '/' })
})

console.log(`\n${n} pruebas OK`)

// Recipe time markup is emitted only when prep and cook times are both known.


const { readRatingsSecrets } = await import('@/lib/ratings-config')
check('ratings: blank legacy service key falls back to configured Supabase secret', () => {
  const c = readRatingsSecrets({
    SUPABASE_SERVICE_ROLE_KEY: '   ',
    SUPABASE_SECRET_KEY: '  sb_secret_test  ',
    RATINGS_HASH_SECRET: '  local-test-hmac-key  ',
  })
  assert.equal(c.serviceKey, 'sb_secret_test')
  assert.equal(c.hashSecret, 'local-test-hmac-key')
})
check('ratings: missing both private keys fails closed, without anon fallback', () => {
  const c = readRatingsSecrets({ SUPABASE_SERVICE_ROLE_KEY: '', SUPABASE_SECRET_KEY: '', RATINGS_HASH_SECRET: 'hmac' })
  assert.equal(c.serviceKey, '')
})


const { RECIPE_LISTING_TITLES, recipeListItem } = await import('@/lib/recipe-list-seo')
process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true'
check('catálogo: títulos descriptivos y traducidos a siete idiomas', () => {
  for (const lang of ['es', 'en', 'de', 'fr', 'it', 'ja', 'pt'] as const) {
    assert(RECIPE_LISTING_TITLES[lang].length >= 12)
  }
  assert.notEqual(RECIPE_LISTING_TITLES.es, RECIPE_LISTING_TITLES.pt)
})
check('ItemList respeta canonical WordPress KEEP y posición absoluta al paginar', () => {
  assert.deepEqual(recipeListItem({
    public_path: '/receta-de-lechona-colombiana',
    source_url: 'https://manualdecocina.com/receta-de-lechona-colombiana/',
  }, 25), {
    '@type': 'ListItem',
    position: 25,
    url: 'https://manualdecocina.com/receta-de-lechona-colombiana/',
  })
  assert.equal(recipeListItem({ public_path: '/pt/pandebono-caseiro' }, 1).url,
    'https://manualdecocina.com/pt/pandebono-caseiro')
})


const { RECIPE_LISTING_DESCRIPTIONS } = await import('@/lib/recipe-list-seo')
check('catálogo: descripciones SEO específicas en 7 idiomas', () => {
  for (const lang of ['es','en','de','fr','it','ja','pt'] as const) {
    const description = RECIPE_LISTING_DESCRIPTIONS[lang]
    assert(description.length >= (lang === 'ja' ? 60 : 110))
    assert(description.length <= 170)
  }
})


const { isUnsatisfiableRecipePage, parseRecipePage } = await import('@/lib/catalog-pagination')
check('catálogo: rango excedido devuelve estado de página inexistente', () => {
  assert.equal(isUnsatisfiableRecipePage({code: 'PGRST103'}), true)
  assert.equal(isUnsatisfiableRecipePage({code: 'PGRST301'}), false)
  assert.equal(isUnsatisfiableRecipePage({code: '08006'}), false)
  assert.equal(isUnsatisfiableRecipePage(null), false)
})
check('catálogo: números de página se interpretan sin parseInt parcial', () => {
  assert.equal(parseRecipePage('2'), 2)
  assert.equal(parseRecipePage('8'), 8)
  assert.equal(parseRecipePage('999'), 999)
  assert.equal(parseRecipePage('2abc'), 1)
  assert.equal(parseRecipePage('1e5'), 1)
  assert.equal(parseRecipePage('-1'), 1)
  assert.equal(parseRecipePage('0002'), 1)
  assert.equal(parseRecipePage('9999999999999999'), 1)
})


const securityConfig = (await import('../../next.config.mjs')).default
const securityHeaderRules = await securityConfig.headers()
check('cabeceras: protegen navegación sin bloquear scripts de terceros', () => {
  const globalHeaders = securityHeaderRules.find((rule: any) => rule.source === '/:path*')?.headers ?? []
  const headers = new Map<string, string>(globalHeaders.map((h: any) => [h.key, h.value]))
  assert.equal(headers.get('X-Frame-Options'), 'SAMEORIGIN')
  assert.equal(headers.get('X-Content-Type-Options'), 'nosniff')
  assert.equal(headers.get('Strict-Transport-Security'), 'max-age=86400')
  assert.equal(headers.get('Cross-Origin-Opener-Policy'), 'same-origin-allow-popups')
  assert.equal(headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin')
  const csp = headers.get('Content-Security-Policy') ?? ''
  assert(csp.includes("object-src 'none'"))
  assert(csp.includes("frame-ancestors 'self'"))
  assert(!csp.includes('script-src'), 'script-src necesita compatibilidad separada con AdSense y consentimiento')
})


const { difficultyFilterOptions, storedDifficultyValues, cuisineFilterLabel, timeFilterOptions } =
  await import('@/lib/listing-filter-localization')
check('filtros: etiquetas traducidas para 7 idiomas, sin modificar parámetros de URL', () => {
  for (const lang of ['es','en','de','fr','it','ja','pt'] as const) {
    const difficulty = difficultyFilterOptions(lang)
    assert.deepEqual(difficulty.map(x => x.value), ['Fácil', 'Media', 'Difícil'])
    assert.equal(new Set(difficulty.map(x => x.label)).size, 3)
    const times = timeFilterOptions(lang)
    assert.deepEqual(times.map(x => x.value), ['0-20','21-40','41-60','61-120','121+'])
    assert(times.every(x => x.label.length >= 3))
    const col = cuisineFilterLabel(lang, 'cocina-colombiana', 'Cocina colombiana')
    assert(col.length >= 6)
    if (lang !== 'es') assert.notEqual(col, 'Cocina colombiana')
  }
  assert.deepEqual(difficultyFilterOptions('de').map(x => x.label), ['Einfach','Mittel','Schwer'])
  assert.deepEqual(difficultyFilterOptions('ja').map(x => x.label), ['簡単','普通','難しい'])
  assert.equal(cuisineFilterLabel('de', 'cocina-gallega', 'Cocina gallega'), 'Galicische Küche')
})
check('filtros: cada valor de dificultad publicado coincide con su clase semántica', () => {
  const stored: Record<string, [string[],string[],string[]]> = {
    es: [['Baja','Fácil'],['Media','Intermedia'],['Alta']],
    en: [['Easy'],['Medium','Intermediate'],['High']],
    de: [['Einfach'],['Mittel'],['Hoch']],
    fr: [['Facile'],['Moyenne','Intermédiaire'],['Élevée']],
    it: [['Facile'],['Media'],['Alta']],
    ja: [['簡単','初級','やさしい'],['普通','中級','中程度'],['高']],
    pt: [['Fácil'],['Média','Media','Intermédia'],['Alta']],
  }
  const keys = ['Fácil','Media','Difícil']
  for (const [lang,groups] of Object.entries(stored)) {
    for (let i=0;i<3;i++) for (const value of groups[i]) {
      assert(storedDifficultyValues(lang as 'es', keys[i]).includes(value), `${lang} ${value}`)
    }
  }
  assert.deepEqual(storedDifficultyValues('de','valor-inválido'), [])
})


const { recipeSearchOrFilter } = await import('@/lib/recipe-search-filter')
check('buscador: la puntuación es dato y no divide la gramática OR de PostgREST', () => {
  const comma = recipeSearchOrFilter('pollo, cebolla')
  assert.equal(comma, 'title.ilike."%pollo, cebolla%",excerpt.ilike."%pollo, cebolla%"')
  const accented = recipeSearchOrFilter('¿Pollo (al horno)?')
  assert.equal(accented, 'title.ilike."%¿Pollo (al horno)?%",excerpt.ilike."%¿Pollo (al horno)?%"')
  const escaped = recipeSearchOrFilter('pollo "asado"')
  assert.equal([...escaped].filter((ch, i, chars) => ch === '"' && chars[i-1]?.charCodeAt(0) === 92).length, 4)
  const slash = recipeSearchOrFilter(String.raw`arroz\sopa`)
  assert.equal([...slash].filter(ch => ch.charCodeAt(0) === 92).length, 4)
})


const { uniqueCuisineGroupIds } = await import('@/lib/cuisine-filter-groups')
check('cocina: un vínculo en español incluye las siete traducciones del mismo grupo', () => {
  const colombianGroup = '11111111-1111-4111-8111-111111111111'
  const mexicanGroup = '22222222-2222-4222-8222-222222222222'
  const assignedSourceRecipes = [
    { recipe_group_id: colombianGroup }, // relación de cocina en es
    { recipe_group_id: colombianGroup }, // relación duplicada del mismo grupo
    { recipe_group_id: mexicanGroup },
    { recipe_group_id: null },
  ]
  const groups = uniqueCuisineGroupIds(assignedSourceRecipes)
  assert.deepEqual(groups, [colombianGroup, mexicanGroup])
  const translatedRows = ['es', 'de', 'en', 'fr', 'it', 'ja', 'pt'].map((language) => ({
    language,
    id: `translated-row-${language}`,
    recipe_group_id: colombianGroup,
  }))
  assert.deepEqual(
    translatedRows.filter((row) => groups.includes(row.recipe_group_id)).map((row) => row.language),
    ['es', 'de', 'en', 'fr', 'it', 'ja', 'pt'],
  )
  assert.equal(groups.includes('33333333-3333-4333-8333-333333333333'), false)
  assert.deepEqual(uniqueCuisineGroupIds([]), [])
  assert.deepEqual(uniqueCuisineGroupIds([{ recipe_group_id: null }]), [])
})


const { taxonomyLanding } = await import('@/lib/taxonomy-landing-seo')
check('postres: title/meta precisos con conteo real, sin hardcode', () => {
  const page = taxonomyLanding('category', 'es', 'Postres', 28)
  assert.equal(page.title, 'Recetas de postres: 28 ideas paso a paso')
  assert.equal(page.description, '28 recetas de postres con ingredientes pesados, tiempos y pasos claros. Encuentra opciones para cocinar en casa.')
  assert.match(page.heading, /28/)
  assert.match(taxonomyLanding('category', 'es', 'Postres', 29).title, /29/)
})
check('ajo: title y meta con 44 recetas registradas', () => {
  const page = taxonomyLanding('ingredient', 'es', 'Ajo', 44)
  assert.equal(page.title, 'Recetas con ajo: 44 ideas')
  assert.match(page.description, /^44 recetas que usan ajo/)
  assert.match(page.heading, /44/)
})
check('siete idiomas: taxonomía localizada con H2 e introducción', () => {
  const languages = ['es', 'en', 'de', 'fr', 'it', 'pt', 'ja'] as const
  for (const lang of languages) {
    for (const kind of ['category', 'ingredient'] as const) {
      const page = taxonomyLanding(kind, lang, lang === 'ja' ? 'デザート' : 'Desserts', 28)
      assert.match(page.title, /28/, `${kind}/${lang} must include real count`)
      assert.match(page.description, /28/, `${kind}/${lang} must include real count`)
      assert.match(page.heading, /28/, `${kind}/${lang} H2`)
      assert.ok(page.intro.length > 180, `${kind}/${lang} should have substantial introduction`)
      assert.equal(page.intro.includes('{count}'), false)
      assert.equal(page.intro.includes('{label}'), false)
      assert.equal(page.intro.includes('{subject}'), false)
    }
  }
})
