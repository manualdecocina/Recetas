import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase/public'
import { getSiteUrl, isIndexingAllowed, normalizePublicPath, publicUrl } from '@/lib/site'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'

export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]
type SitemapLanguages = NonNullable<NonNullable<Entry['alternates']>['languages']>

const BATCH = 1000

interface Row {
  recipe_group_id: string
  language: string
  slug: string
  public_path: string
  updated_at: string
}

interface ContentRow {
  language: string
  public_path: string
  updated_at: string
}

interface IngredientRow {
  language: string
  slug: string
  updated_at: string
}

async function fetchAllPublished(): Promise<Row[]> {
  const rows: Row[] = []
  for (let from = 0; ; from += BATCH) {
    const { data, error } = await supabase
      .from('recipes')
      .select('recipe_group_id, language, slug, public_path, updated_at')
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
  if (!isIndexingAllowed()) return []

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
    for (const l of SUPPORTED_LANGUAGES) map[l] = `${site}${normalizePublicPath(path(l))}`
    return { languages: map as SitemapLanguages }
  }

  for (const l of SUPPORTED_LANGUAGES) {
    entries.push({ url: `${site}/${l}`, alternates: staticAlternates((x) => `/${x}`) })
    entries.push({ url: `${site}/${l}/recetas`, alternates: staticAlternates((x) => `/${x}/recetas`) })
  }

  for (const row of rows) {
    const siblings = groups.get(row.recipe_group_id) ?? [row]
    const entry: Entry = {
      url: publicUrl(row.public_path),
      lastModified: row.updated_at,
    }

    if (siblings.length > 1) {
      const map: Record<string, string> = {}
      for (const s of siblings) map[s.language] = publicUrl(s.public_path)
      entry.alternates = { languages: map as SitemapLanguages }
    }

    entries.push(entry)
  }

  return entries
}
