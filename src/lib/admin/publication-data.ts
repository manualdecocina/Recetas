import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { absoluteUrl, getSiteUrl } from '@/lib/site'
import {
  groupBlockers, groupStage, groupTitle, REQUIRED_LANGUAGES,
  type GroupStage, type PublicationRow, type ReviewRow,
} from './publication'

const LIGHT_COLUMNS = 'id, recipe_group_id, language, title, public_path, published, updated_at'
const FULL_COLUMNS = `${LIGHT_COLUMNS}, image_url, ingredients, steps, nutrition, seo, excerpt, servings, total_time_minutes`

export interface GroupSummary {
  groupId: string
  title: string
  stage: GroupStage
  languages: number
  published: number
  blockers: string[]
  review?: ReviewRow
  updatedAt: string
}

async function readAll<T>(fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const out: T[] = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await fetchPage(from, from + 999)
    if (error) throw new Error(error.message)
    out.push(...(data ?? []))
    if (!data || data.length < 1000) break
  }
  return out
}

/** Cola completa: un resumen por plato (grupo de idiomas). Solo carga el contenido
 * completo de los platos que no están publicados en sus 7 idiomas. */
export async function loadQueue(supabase: SupabaseClient): Promise<GroupSummary[]> {
  const light = await readAll<PublicationRow>((from, to) =>
    supabase.from('recipes').select(LIGHT_COLUMNS).order('id').range(from, to))
  const reviews = await readAll<ReviewRow>((from, to) =>
    supabase.from('recipe_reviews').select('recipe_group_id, status, comment, reviewed_at').range(from, to))
  const reviewByGroup = new Map(reviews.map((r) => [r.recipe_group_id, r]))

  const byGroup = new Map<string, PublicationRow[]>()
  for (const row of light) byGroup.set(row.recipe_group_id, [...(byGroup.get(row.recipe_group_id) ?? []), row])

  const pending = [...byGroup.entries()]
    .filter(([, rows]) => !(rows.length === REQUIRED_LANGUAGES.length && rows.every((r) => r.published)))
    .map(([group]) => group)

  const full = new Map<string, PublicationRow[]>()
  for (let i = 0; i < pending.length; i += 100) {
    const chunk = pending.slice(i, i + 100)
    const { data, error } = await supabase.from('recipes').select(FULL_COLUMNS).in('recipe_group_id', chunk)
    if (error) throw new Error(error.message)
    for (const row of (data ?? []) as PublicationRow[]) full.set(row.recipe_group_id, [...(full.get(row.recipe_group_id) ?? []), row])
  }

  return [...byGroup.entries()].map(([groupId, lightRows]) => {
    const rows = full.get(groupId) ?? lightRows
    const isPending = full.has(groupId)
    const blockers = isPending ? groupBlockers(rows) : []
    const review = reviewByGroup.get(groupId)
    return {
      groupId,
      title: groupTitle(rows),
      stage: groupStage(rows, review, blockers),
      languages: new Set(rows.map((r) => r.language)).size,
      published: rows.filter((r) => r.published).length,
      blockers,
      review,
      updatedAt: rows.map((r) => r.updated_at).sort().at(-1) ?? '',
    }
  }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export interface GroupDetail {
  rows: (PublicationRow & { excerpt?: string | null; servings?: number | null; total_time_minutes?: number | null })[]
  review?: ReviewRow
}

export async function loadGroup(supabase: SupabaseClient, groupId: string): Promise<GroupDetail | null> {
  const { data, error } = await supabase.from('recipes').select(FULL_COLUMNS).eq('recipe_group_id', groupId)
  if (error) throw new Error(error.message)
  if (!data || data.length === 0) return null
  const order = REQUIRED_LANGUAGES as readonly string[]
  const rows = (data as GroupDetail['rows']).sort((a, b) => order.indexOf(a.language) - order.indexOf(b.language))
  const { data: review } = await supabase.from('recipe_reviews')
    .select('recipe_group_id, status, comment, reviewed_at').eq('recipe_group_id', groupId).maybeSingle()
  return { rows, review: (review ?? undefined) as ReviewRow | undefined }
}

export interface ImageCheck { url: string; ok: boolean; status: number | null }

/** Comprueba en el sitio en vivo que cada imagen responda 200. Así no se publica
 * una receta cuyas fotos todavía no llegaron con el despliegue. */
export async function checkImagesOnline(paths: string[]): Promise<ImageCheck[]> {
  const site = getSiteUrl()
  return Promise.all(paths.map(async (path) => {
    const url = /^https?:\/\//i.test(path) ? path : `${site}${path.startsWith('/') ? '' : '/'}${path}`
    try {
      const res = await fetch(url, { method: 'HEAD', cache: 'no-store', signal: AbortSignal.timeout(8000) })
      return { url: absoluteUrl(path), ok: res.ok, status: res.status }
    } catch {
      return { url: absoluteUrl(path), ok: false, status: null }
    }
  }))
}
