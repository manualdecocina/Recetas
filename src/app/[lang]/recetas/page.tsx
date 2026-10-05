import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import SiteHeader from '@/components/md/SiteHeader'
import SiteFooter from '@/components/md/SiteFooter'
import RecipeListingView, { type MdListingFilters, type MdListingOptions } from '@/components/md/RecipeListingView'
import type { MdRecipeCardData } from '@/components/md/md-types'
import { UI_TEXT } from '@/lib/i18n'
import { allLanguageAlternates } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { categoryLabel } from '@/lib/categories'

const PAGE_SIZE = 24
const CARD_FIELDS = 'id, language, slug, public_path, title, excerpt, category, image_url'

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
    // `category` está traducido por idioma en la base de datos: hay que buscar la
    // etiqueta de ESTE idioma (antes comparaba siempre con la española y el filtro
    // no devolvía nada fuera de /es).
    const label = categoryLabel(lang, categoria)
    if (!label) notFound()
    query = query.eq('category', label)
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

  query = ordenar === 'antiguas'
    ? query.order('published_at', { ascending: true, nullsFirst: false })
    : query.order('ready_at', { ascending: false, nullsFirst: false })

  query = query.range(from, from + PAGE_SIZE - 1)

  const { data: recipes, count, error } = await query
  if (error) throw new Error(`No se pudieron cargar las recetas: ${error.message}`)

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  if (page > totalPages) notFound()

  const cardRecipes = (recipes ?? []) as MdRecipeCardData[]

  // Valores y filtros idénticos a los que ya acepta la consulta de arriba.
  const listingFilters: MdListingFilters = {
    q, categoria, cocina, dificultad, ingrediente, tiempo,
    ordenar: ordenar === 'antiguas' ? 'antiguas' : undefined,
  }
  const options: MdListingOptions = {
    cuisines: (cuisineOptions ?? []).map((item) => ({ value: item.slug, label: item.name })),
    difficulties: ['Fácil', 'Media', 'Difícil'].map((value) => ({ value, label: value })),
    ingredients: (ingredientOptions ?? []).map((item) => ({ value: item.slug, label: item.name })),
    times: [
      { value: '0-20', label: 'Hasta 20 min' },
      { value: '21-40', label: '21–40 min' },
      { value: '41-60', label: '41–60 min' },
      { value: '61-120', label: '61–120 min' },
      { value: '121+', label: 'Más de 120 min' },
    ],
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: cardRecipes.map((recipe, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: getSiteUrl() + recipe.public_path,
    })),
  }

  const headerAlternates = Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, `/${l}/recetas`]))

  return (
    <div className="md-site" lang={lang}>
      <SiteHeader lang={lang} alternates={headerAlternates} />
      {cardRecipes.length >= 2 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c') }} />
      )}
      <RecipeListingView
        lang={lang}
        recipes={cardRecipes}
        filters={listingFilters}
        options={options}
        page={page}
        totalPages={totalPages}
        totalResults={total}
      />
      <SiteFooter lang={lang} />
    </div>
  )
}
