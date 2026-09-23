import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase/public'
import { getSiteUrl, isIndexingAllowed, recipeUrl } from '@/lib/site'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/types/recipe'

export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]
type SitemapLanguages = NonNullable<NonNullable<Entry['alternates']>['languages']>

const BATCH = 1000 // límite de filas por consulta de la API de Supabase

interface Row {
  recipe_group_id: string
  language: string
  slug: string
  updated_at: string
}

async function fetchAllPublished(): Promise<Row[]> {
  const rows: Row[] = []
  for (let from = 0; ; from += BATCH) {
    const { data, error } = await supabase
      .from('recipes')
      .select('recipe_group_id, language, slug, updated_at')
      .eq('published', true)
      .order('id')
      .range(from, from + BATCH - 1)
    if (error) throw new Error(`Sitemap: ${error.message}`)
    rows.push(...(data ?? []))
    if (!data || data.length < BATCH) break
  }
  return rows
}

// Sitemap multilingüe: cada URL declara sus alternates (mismas reglas que las páginas).
// En entornos de prueba devuelve un sitemap vacío.
// Límite de 50.000 URLs por sitemap: cuando el catálogo se acerque, dividir con
// generateSitemaps (decisión pendiente, no bloquea el lanzamiento).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexingAllowed()) return []

  const site = getSiteUrl()
  const rows = await fetchAllPublished()

  const groups = new Map<string, Row[]>()
  for (const row of rows) {
    const list = groups.get(row.recipe_group_id) ?? []
    list.push(row)
    groups.set(row.recipe_group_id, list)
  }

  const staticAlternates = (path: (l: string) => string) => {
    const map: Record<string, string> = {}
    for (const l of SUPPORTED_LANGUAGES) map[l] = `${site}${path(l)}`
    map['x-default'] = `${site}${path(DEFAULT_LANGUAGE)}`
    return { languages: map as SitemapLanguages }
  }

  const entries: MetadataRoute.Sitemap = []

  for (const l of SUPPORTED_LANGUAGES) {
    entries.push({ url: `${site}/${l}`, alternates: staticAlternates((x) => `/${x}`) })
    entries.push({ url: `${site}/${l}/recetas`, alternates: staticAlternates((x) => `/${x}/recetas`) })
  }

  for (const row of rows) {
    const siblings = groups.get(row.recipe_group_id) ?? [row]
    const entry: Entry = {
      url: recipeUrl(row.language, row.slug),
      lastModified: row.updated_at,
    }
    if (siblings.length > 1) {
      const map: Record<string, string> = {}
      for (const s of siblings) map[s.language] = recipeUrl(s.language, s.slug)
      const spanish = siblings.find((s) => s.language === DEFAULT_LANGUAGE)
      if (spanish) map['x-default'] = recipeUrl(spanish.language, spanish.slug)
      entry.alternates = { languages: map as SitemapLanguages }
    }
    entries.push(entry)
  }

  return entries
}
