import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase/public'
import { getSiteUrl, normalizePublicPath, publicUrl, recipeCanonicalUrl, languageTag } from '@/lib/site'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { categorySlugFromLabel } from '@/lib/categories'
import { withXDefault } from '@/lib/seo'

export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]
type SitemapLanguages = NonNullable<NonNullable<Entry['alternates']>['languages']>

const BATCH = 1000

const INSTITUTIONAL_SLUGS = [
  'quienes-somos',
  'contacto',
  'politica-editorial',
  'privacidad',
  'cookies',
  'terminos',
  'aviso-legal',
  'propiedad-intelectual',
] as const

interface Row {
  recipe_group_id: string
  language: string
  slug: string
  public_path: string
  source_url: string | null
  updated_at: string
  category: string | null
}

interface ContentRow {
  language: string
  public_path: string
  updated_at: string
}

interface IngredientRow {
  slug: string
  updated_at: string
}

async function fetchAllPublished(): Promise<Row[]> {
  const rows: Row[] = []
  for (let from = 0; ; from += BATCH) {
    const { data, error } = await supabase
      .from('recipes')
      .select('recipe_group_id, language, slug, public_path, source_url, updated_at, category')
      .eq('published', true)
      .order('id')
      .range(from, from + BATCH - 1)
    if (error) throw new Error(`Sitemap: ${error.message}`)
    rows.push(...(data ?? []).filter((row) => !row.public_path.startsWith('/recipe-cards/')))
    if (!data || data.length < BATCH) break
  }
  return rows
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Preview needs the same URL graph for QA. robots.txt and page noindex keep
  // indexing disabled independently of whether a sitemap can be inspected.
  const site = getSiteUrl()
  const entries: MetadataRoute.Sitemap = []
  const rows = await fetchAllPublished()

  const { data: contentPages, error: contentError } = await supabase
    .from('content_pages')
    .select('language, public_path, updated_at')
    .eq('published', true)
  if (contentError) throw new Error(`Sitemap content: ${contentError.message}`)

  for (const page of (contentPages ?? []) as ContentRow[]) {
    entries.push({
      url: publicUrl(page.public_path),
      lastModified: page.updated_at,
    })
  }

  const groups = new Map<string, Row[]>()
  for (const row of rows) {
    const list = groups.get(row.recipe_group_id) ?? []
    list.push(row)
    groups.set(row.recipe_group_id, list)
  }

  const staticAlternates = (path: (l: string) => string) => {
    const map: Record<string, string> = {}
    for (const l of SUPPORTED_LANGUAGES) map[languageTag(l)] = `${site}${normalizePublicPath(path(l))}`
    return { languages: withXDefault(map) as SitemapLanguages }
  }

  for (const l of SUPPORTED_LANGUAGES) {
    entries.push({ url: `${site}/${l}`, alternates: staticAlternates((x) => `/${x}`) })
    entries.push({ url: `${site}/${l}/recetas`, alternates: staticAlternates((x) => `/${x}/recetas`) })
    entries.push({ url: `${site}/${l}/categorias`, alternates: staticAlternates((x) => `/${x}/categorias`) })
    for (const slug of INSTITUTIONAL_SLUGS) {
      entries.push({
        url: `${site}/${l}/${slug}`,
        alternates: staticAlternates((x) => `/${x}/${slug}`),
      })
    }
  }
  // Herramienta real (gratuita) sin página propia en el sitemap hasta ahora.
  for (const l of SUPPORTED_LANGUAGES) entries.push({ url: `${site}/${l}/que-puedo-cocinar`, alternates: staticAlternates((x) => `/${x}/que-puedo-cocinar`) })

  // Use the same ordered, paginated rows as recipe URLs. A separate unpaginated
  // query stops at the API row limit and can drop category routes in later languages.
  const seenCategories = new Set<string>()
  for (const row of rows) {
    const slug = categorySlugFromLabel(row.language as RecipeLanguage, row.category)
    if (!slug) continue
    const key = `${row.language}/${slug}`
    if (seenCategories.has(key)) continue
    seenCategories.add(key)
    entries.push({
      url: `${site}/${row.language}/categorias/${slug}`,
      alternates: staticAlternates((x) => `/${x}/categorias/${slug}`),
    })
  }

  const { data: ingredients, error: ingredientError } = await supabase
    .from('ingredients')
    .select('slug, updated_at')
    .eq('status', 'canonical')
    .eq('indexable', true)
    .order('name', { ascending: true })
  if (ingredientError) throw new Error(`Sitemap ingredients: ${ingredientError.message}`)

  for (const l of SUPPORTED_LANGUAGES) {
    entries.push({ url: `${site}/${l}/ingredientes`, alternates: staticAlternates((x) => `/${x}/ingredientes`) })
    for (const ingredient of (ingredients ?? []) as IngredientRow[]) {
      entries.push({ url: `${site}/${l}/ingredientes/${ingredient.slug}`, lastModified: ingredient.updated_at,
        alternates: staticAlternates((x) => `/${x}/ingredientes/${ingredient.slug}`) })
    }
  }

  for (const row of rows) {
    const siblings = groups.get(row.recipe_group_id) ?? [row]
    const entry: Entry = {
      url: recipeCanonicalUrl(row),
      lastModified: row.updated_at,
    }

    if (siblings.length > 1) {
      const map: Record<string, string> = {}
      for (const s of siblings) map[languageTag(s.language)] = recipeCanonicalUrl(s)
      entry.alternates = { languages: map as SitemapLanguages }
    }

    entries.push(entry)
  }

  return entries
}
