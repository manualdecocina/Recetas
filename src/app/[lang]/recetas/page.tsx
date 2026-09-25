import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { RecipeCard } from '@/components/RecipeCard'
import { SiteHeader } from '@/components/SiteHeader'
import { UI_TEXT } from '@/lib/i18n'
import { allLanguageAlternates } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

const PAGE_SIZE = 24
const CARD_FIELDS = 'id, language, slug, public_path, title, excerpt, category, image_url'

const CATEGORIES = [
  ['Platos principales', 'platos-principales'],
  ['Entrantes y aperitivos', 'entrantes-y-aperitivos'],
  ['Sopas y cremas', 'sopas-y-cremas'],
  ['Ensaladas', 'ensaladas'],
  ['Guarniciones', 'guarniciones'],
  ['Salsas y aderezos', 'salsas-y-aderezos'],
  ['Panes y masas', 'panes-y-masas'],
  ['Postres', 'postres'],
  ['Desayunos y brunch', 'desayunos-y-brunch'],
  ['Bebidas', 'bebidas'],
] as const

interface Props {
  params: Promise<{ lang: string }>
  searchParams: Promise<{
    page?: string
    q?: string
    categoria?: string
    cocina?: string
    dificultad?: string
    ingrediente?: string
    tiempo?: string
    ordenar?: string
  }>
}

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? (value as RecipeLanguage) : null
}

function parsePage(value?: string): number {
  const n = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(n) && n >= 1 ? n : 1
}

function clean(value?: string) {
  return value?.trim().slice(0, 100) || ''
}

function buildUrl(lang: string, params: Record<string, string | undefined>) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value)
  }
  return query.toString() ? `/${lang}/recetas?${query.toString()}` : `/${lang}/recetas`
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params
  const query = await searchParams
  const lang = parseLang(rawLang)
  if (!lang) return {}
  const text = UI_TEXT[lang]
  const page = parsePage(query.page)

  return {
    title: page === 1 ? text.recipesTitle : `${text.recipesTitle} — ${text.page} ${page}`,
    description: text.recipesDescription,
    alternates: page === 1
      ? allLanguageAlternates(`/${lang}/recetas`, (l) => `/${l}/recetas`)
      : { canonical: `${getSiteUrl()}/${lang}/recetas?page=${page}` },
  }
}

export default async function RecipesListPage({ params, searchParams }: Props) {
  const { lang: rawLang } = await params
  const search = await searchParams
  const lang = parseLang(rawLang)
  if (!lang) notFound()

  const text = UI_TEXT[lang]
  const page = parsePage(search.page)
  const q = clean(search.q)
  const categoria = clean(search.categoria)
  const cocina = clean(search.cocina)
  const dificultad = clean(search.dificultad)
  const ingrediente = clean(search.ingrediente)
  const tiempo = clean(search.tiempo)
  const ordenar = search.ordenar === 'antiguas' ? 'antiguas' : 'recientes'
  const from = (page - 1) * PAGE_SIZE

  const [{ data: cuisineOptions }, { data: ingredientOptions }] = await Promise.all([
    supabase.from('cuisines').select('slug, name').eq('status', 'canonical').eq('searchable', true).order('name'),
    supabase.from('ingredients').select('slug, name').eq('status', 'canonical').eq('indexable', true).order('name'),
  ])

  let query = supabase
    .from('recipes')
    .select(CARD_FIELDS, { count: 'exact' })
    .eq('language', lang)
    .eq('published', true)

  if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
  if (categoria) {
    const label = CATEGORIES.find(([, slug]) => slug === categoria)?.[0]
    if (label) query = query.eq('category', label)
  }
  if (cocina) {
    const { data: cuisine } = await supabase
      .from('cuisines')
      .select('id')
      .eq('slug', cocina)
      .eq('status', 'canonical')
      .maybeSingle()
    if (!cuisine) query = query.in('id', ['00000000-0000-0000-0000-000000000000'])
    else {
      const { data: cuisineRelations } = await supabase
        .from('recipe_cuisines')
        .select('recipe_id')
        .eq('cuisine_id', cuisine.id)
      const ids = [...new Set((cuisineRelations ?? []).map((row) => row.recipe_id))]
      query = query.in('id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000'])
    }
  }
  if (dificultad) query = query.eq('difficulty', dificultad)

  if (ingrediente) {
    const { data: ingredient } = await supabase
      .from('ingredients')
      .select('id')
      .eq('slug', ingrediente)
      .eq('status', 'canonical')
      .eq('indexable', true)
      .maybeSingle()
    if (!ingredient) query = query.in('id', ['00000000-0000-0000-0000-000000000000'])
    else {
      const { data: ingredientRelations } = await supabase
        .from('recipe_ingredients')
        .select('recipe_id')
        .eq('ingredient_id', ingredient.id)
      const ids = [...new Set((ingredientRelations ?? []).map((row) => row.recipe_id))]
      query = query.in('id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000'])
    }
  }

  if (tiempo === '0-20') query = query.gte('total_time_minutes', 0).lte('total_time_minutes', 20)
  if (tiempo === '21-40') query = query.gte('total_time_minutes', 21).lte('total_time_minutes', 40)
  if (tiempo === '41-60') query = query.gte('total_time_minutes', 41).lte('total_time_minutes', 60)
  if (tiempo === '61-120') query = query.gte('total_time_minutes', 61).lte('total_time_minutes', 120)
  if (tiempo === '121+') query = query.gte('total_time_minutes', 121)

  query = query
    .order('published_at', { ascending: ordenar === 'antiguas', nullsFirst: false })
    .range(from, from + PAGE_SIZE - 1)

  const { data: recipes, count, error } = await query
  if (error) throw new Error(`No se pudieron cargar las recetas: ${error.message}`)

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  if (page > totalPages) notFound()

  const filters = [
    q ? ['Búsqueda', q] : null,
    categoria ? ['Categoría', CATEGORIES.find(([, slug]) => slug === categoria)?.[0] ?? categoria] : null,
    cocina ? ['Cocina', cuisineOptions?.find((item) => item.slug === cocina)?.name ?? cocina] : null,
    dificultad ? ['Dificultad', dificultad] : null,
    ingrediente ? ['Ingrediente', ingrediente] : null,
    tiempo ? ['Tiempo', tiempo + ' min'] : null,
  ].filter(Boolean) as [string, string][]

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: (recipes ?? []).map((recipe, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: getSiteUrl() + recipe.public_path,
    })),
  }

  return (
    <>
      <SiteHeader lang={lang} />
      <main className="catalog">
        {(recipes ?? []).length >= 2 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c') }} />
        )}

        <header className="catalog__hero">
          <p className="eyebrow">El catálogo</p>
          <h1>Recetas para<br /><em>cualquier momento.</em></h1>
          <p>Busca, filtra y descubre recetas que te apetezca cocinar.</p>
          <form className="catalog-search" action={`/${lang}/recetas`} method="get">
            <input name="q" type="search" defaultValue={q} placeholder="Busca por receta o ingrediente…" aria-label="Buscar recetas" />
            <button type="submit">Buscar</button>
          </form>
        </header>

        <section className="catalog__toolbar" aria-label="Filtros y ordenación">
          <details className="filter-panel">
            <summary>Filtrar recetas</summary>
            <form action={`/${lang}/recetas`} method="get">
              {q && <input type="hidden" name="q" value={q} />}
              <fieldset>
                <legend>Categoría</legend>
                <select name="categoria" defaultValue={categoria}>
                  <option value="">Todas</option>
                  {CATEGORIES.map(([label, slug]) => <option key={slug} value={slug}>{label}</option>)}
                </select>
              </fieldset>
              <fieldset>
                <legend>Cocina</legend>
                <select name="cocina" defaultValue={cocina}>
                  <option value="">Todas</option>
                  {(cuisineOptions ?? []).map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
              </fieldset>
              <fieldset>
                <legend>Dificultad</legend>
                <select name="dificultad" defaultValue={dificultad}>
                  <option value="">Todas</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Media">Media</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </fieldset>
              <fieldset>
                <legend>Ingrediente</legend>
                <select name="ingrediente" defaultValue={ingrediente}>
                  <option value="">Todos</option>
                  {(ingredientOptions ?? []).map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
              </fieldset>
              <fieldset>
                <legend>Tiempo total</legend>
                <select name="tiempo" defaultValue={tiempo}>
                  <option value="">Cualquier tiempo</option>
                  <option value="0-20">Hasta 20 min</option>
                  <option value="21-40">21–40 min</option>
                  <option value="41-60">41–60 min</option>
                  <option value="61-120">61–120 min</option>
                  <option value="121+">Más de 120 min</option>
                </select>
              </fieldset>
              <button className="button button--dark" type="submit">Aplicar filtros</button>
              <Link className="filter-clear" href={buildUrl(lang, {})}>Limpiar filtros</Link>
            </form>
          </details>

          <div className="catalog__sort">
            <span>{total} {total === 1 ? 'receta' : 'recetas'}</span>
            <form action={`/${lang}/recetas`} method="get">
              {q && <input type="hidden" name="q" value={q} />}
              {categoria && <input type="hidden" name="categoria" value={categoria} />}
              {cocina && <input type="hidden" name="cocina" value={cocina} />}
              {dificultad && <input type="hidden" name="dificultad" value={dificultad} />}
              {ingrediente && <input type="hidden" name="ingrediente" value={ingrediente} />}
              {tiempo && <input type="hidden" name="tiempo" value={tiempo} />}
              <label>
                Ordenar
                <select name="ordenar" defaultValue={ordenar} onChange={(event) => event.currentTarget.form?.requestSubmit()}>
                  <option value="recientes">Más recientes</option>
                  <option value="antiguas">Más antiguas</option>
                </select>
              </label>
            </form>
          </div>
        </section>

        {filters.length > 0 && (
          <div className="active-filters" aria-label="Filtros activos">
            <span>Estás viendo:</span>
            {filters.map(([label, value]) => <span className="filter-chip" key={label}>{label}: {value}</span>)}
            <Link href={buildUrl(lang, {})}>Limpiar</Link>
          </div>
        )}

        {total === 0 ? (
          <section className="catalog-empty">
            <p className="eyebrow">Sin resultados</p>
            <h2>No encontramos esa receta.</h2>
            <p>Prueba con otro término o elimina algún filtro para ampliar la búsqueda.</p>
            <Link className="button button--dark" href={`/${lang}/recetas`}>Ver todas las recetas</Link>
          </section>
        ) : (
          <section className="recipe-grid catalog-grid" aria-label="Recetas">
            {(recipes ?? []).map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} priority={index < 4} />)}
          </section>
        )}

        {totalPages > 1 && (
          <nav className="pagination" aria-label="Paginación">
            {page > 1 && <Link href={buildUrl(lang, { q, categoria, cocina, dificultad, ingrediente, tiempo, ordenar, page: page === 2 ? undefined : String(page - 1) })} rel="prev">← Anteriores</Link>}
            <span>Página {page} de {totalPages}</span>
            {page < totalPages && <Link href={buildUrl(lang, { q, categoria, cocina, dificultad, ingrediente, tiempo, ordenar, page: String(page + 1) })} rel="next">Siguientes →</Link>}
          </nav>
        )}
      </main>
    </>
  )
}
