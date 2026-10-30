import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { reviewedRecipeSeo } from '@/lib/recipe-snippet-repairs'
import { absoluteUrl, getSiteUrl } from '@/lib/site'
import { REQUIRED_LANGUAGES } from './publication'
import { seoLengthIssues } from './seo-checks'

/** Un problema concreto, con el plato al que lleva el enlace del panel. */
export interface HealthItem {
  groupId: string | null
  language?: string
  title: string
  detail: string
}

export interface HealthReport {
  publishedGroups: number
  publishedByLanguage: Record<string, number>
  newLast7: number
  newLast30: number
  /** Problemas que afectan a la web o a Google ahora mismo. Deberían ser cero. */
  errors: { key: string; label: string; help: string; items: HealthItem[] }[]
  /** Títulos y descripciones que Google corta o que desaprovechan espacio. */
  seo: HealthItem[]
}

interface Row {
  id: string
  recipe_group_id: string
  language: string
  title: string | null
  public_path: string
  published: boolean
  image_url: string | null
  nutrition: Record<string, unknown> | null
  seo: Record<string, unknown> | null
  ready_at: string | null
  published_at: string | null
}

const COLUMNS = 'id, recipe_group_id, language, title, public_path, published, image_url, nutrition, seo, ready_at, published_at'
const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

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

export async function loadHealth(supabase: SupabaseClient): Promise<HealthReport> {
  const rows = await readAll<Row>((from, to) => supabase.from('recipes').select(COLUMNS).order('id').range(from, to))
  const redirects = await readAll<{ source_path: string; target_path: string }>((from, to) =>
    supabase.from('content_redirects').select('source_path, target_path').order('source_path').range(from, to))

  const byGroup = new Map<string, Row[]>()
  for (const row of rows) byGroup.set(row.recipe_group_id, [...(byGroup.get(row.recipe_group_id) ?? []), row])
  const nameOf = (groupId: string) => {
    const group = byGroup.get(groupId) ?? []
    return text(group.find((r) => r.language === 'es')?.title) || text(group[0]?.title) || '(sin título)'
  }
  const published = rows.filter((row) => row.published)
  const item = (row: Row, detail: string): HealthItem => ({ groupId: row.recipe_group_id, language: row.language, title: nameOf(row.recipe_group_id), detail })

  // Publicada a medias: Google ve hreflang a páginas que no existen.
  const partial: HealthItem[] = []
  for (const [groupId, group] of byGroup) {
    const on = group.filter((r) => r.published).map((r) => r.language)
    if (on.length === 0) continue
    const off = REQUIRED_LANGUAGES.filter((l) => !on.includes(l))
    if (off.length) partial.push({ groupId, title: nameOf(groupId), detail: `publicada en ${on.length}/7; faltan ${off.join(', ')}` })
  }

  const missing: HealthItem[] = []
  for (const row of published) {
    const seo = reviewedRecipeSeo(row.id, row.seo)
    const gaps = [
      !text(row.image_url) && 'foto de portada',
      (!row.nutrition || row.nutrition.calories == null) && 'nutrición',
      (!text(seo.title) || !text(seo.description)) && 'título o descripción para Google',
      !row.ready_at && 'fecha de listado (no sale en orden en Recetas)',
    ].filter(Boolean)
    if (gaps.length) missing.push(item(row, `sin ${gaps.join(', ')}`))
  }

  // Dos recetas del mismo idioma con el mismo título en Google compiten entre sí.
  const duplicates: HealthItem[] = []
  const seen = new Map<string, Row>()
  for (const row of published) {
    const key = `${row.language}|${text(reviewedRecipeSeo(row.id, row.seo).title).toLowerCase()}`
    if (key.endsWith('|')) continue
    const first = seen.get(key)
    if (first) duplicates.push(item(row, `mismo título para Google que «${nameOf(first.recipe_group_id)}»`))
    else seen.set(key, row)
  }

  const publishedPaths = new Set(published.map((r) => r.public_path))
  const unpublishedPaths = new Map(rows.filter((r) => !r.published).map((r) => [r.public_path, r]))
  const sources = new Set(redirects.map((r) => r.source_path))
  const redirectProblems: HealthItem[] = []
  for (const r of redirects) {
    if (publishedPaths.has(r.source_path)) redirectProblems.push({ groupId: null, title: r.source_path, detail: 'redirige una página que está publicada: la receta no se ve' })
    if (sources.has(r.target_path)) redirectProblems.push({ groupId: null, title: r.source_path, detail: `cadena de redirecciones: ${r.target_path} también redirige` })
    const target = unpublishedPaths.get(r.target_path)
    if (target) redirectProblems.push({ groupId: target.recipe_group_id, title: r.source_path, detail: `manda a una receta sin publicar (${r.target_path})` })
  }

  const seo: HealthItem[] = []
  for (const row of published) {
    const fields = reviewedRecipeSeo(row.id, row.seo)
    const issues = seoLengthIssues(row.language, text(fields.title), text(fields.description))
    if (issues.length) seo.push(item(row, issues.join(' · ')))
  }
  seo.sort((a, b) => a.title.localeCompare(b.title, 'es') || (a.language ?? '').localeCompare(b.language ?? ''))

  const publishedByLanguage: Record<string, number> = {}
  for (const language of REQUIRED_LANGUAGES) publishedByLanguage[language] = published.filter((r) => r.language === language).length

  // "Nueva" = la versión en español salió en ese período (una receta = un plato).
  const now = Date.now()
  const spanishDates = published.filter((r) => r.language === 'es' && r.published_at).map((r) => Date.parse(r.published_at as string))
  const within = (days: number) => spanishDates.filter((t) => now - t <= days * 86_400_000).length

  return {
    publishedGroups: new Set(published.map((r) => r.recipe_group_id)).size,
    publishedByLanguage,
    newLast7: within(7),
    newLast30: within(30),
    errors: [
      { key: 'parcial', label: 'Publicadas a medias', help: 'El plato está en línea en unos idiomas y no en otros. Los enlaces entre idiomas apuntan a páginas que no existen.', items: partial },
      { key: 'incompletas', label: 'Publicadas con datos faltantes', help: 'Recetas en línea a las que les falta algo que Google o el listado necesitan.', items: missing },
      { key: 'duplicados', label: 'Títulos repetidos en Google', help: 'Dos recetas del mismo idioma con el mismo título compiten entre sí en las búsquedas.', items: duplicates },
      { key: 'redirecciones', label: 'Redirecciones con problemas', help: 'Redirecciones viejas que tapan una receta, encadenan saltos o mandan a una receta retirada.', items: redirectProblems },
    ],
    seo,
  }
}

export interface PhotoProblem { groupId: string; title: string; url: string; status: number | null }

/** Comprueba en la web en vivo la foto de portada de cada receta publicada en español.
 * Pocas peticiones a la vez para no cargar el servidor. */
export async function checkPublishedCovers(supabase: SupabaseClient): Promise<{ checked: number; problems: PhotoProblem[] }> {
  const rows = await readAll<{ recipe_group_id: string; title: string | null; image_url: string | null }>((from, to) =>
    supabase.from('recipes').select('recipe_group_id, title, image_url').eq('language', 'es').eq('published', true).order('id').range(from, to))
  const site = getSiteUrl()
  const targets = rows.filter((r) => text(r.image_url))
  const problems: PhotoProblem[] = []
  let next = 0
  async function worker() {
    while (next < targets.length) {
      const row = targets[next++]
      const path = text(row.image_url)
      const url = /^https?:\/\//i.test(path) ? path : `${site}${path.startsWith('/') ? '' : '/'}${path}`
      let status: number | null = null
      try {
        const res = await fetch(url, { method: 'HEAD', cache: 'no-store', signal: AbortSignal.timeout(8000) })
        status = res.status
      } catch { /* sin respuesta */ }
      if (status === null || status >= 400) problems.push({ groupId: row.recipe_group_id, title: text(row.title), url: absoluteUrl(path), status })
    }
  }
  await Promise.all(Array.from({ length: 10 }, worker))
  return { checked: targets.length, problems }
}
