/**
 * Reglas del centro de publicación del panel. Funciones puras (sin red ni base de datos)
 * para poder probarlas. La base de datos repite las mismas reglas en
 * public.recipe_group_blockers() antes de publicar, así que el panel nunca es la única barrera.
 */

export const REQUIRED_LANGUAGES = ['es', 'en', 'de', 'fr', 'it', 'ja', 'pt'] as const

export const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Español', en: 'Inglés', de: 'Alemán', fr: 'Francés', it: 'Italiano', ja: 'Japonés', pt: 'Portugués',
}

export interface PublicationRow {
  id: string
  recipe_group_id: string
  language: string
  title: string | null
  public_path: string
  published: boolean
  updated_at: string
  editorial_status?: string | null
  image_url?: string | null
  ingredients?: unknown
  steps?: unknown
  nutrition?: Record<string, unknown> | null
  seo?: Record<string, unknown> | null
}

export type ReviewStatus = 'aprobada' | 'devuelta'

export interface ReviewRow {
  recipe_group_id: string
  status: ReviewStatus
  comment: string | null
  reviewed_at: string
}

/** Etapa de un plato en la cola, en el orden en que se trabaja. */
export type GroupStage = 'incompleta' | 'por-revisar' | 'devuelta' | 'aprobada' | 'publicada' | 'archivada'

export const STAGE_LABELS: Record<GroupStage, string> = {
  'incompleta': 'Incompleta',
  'por-revisar': 'Por revisar',
  'devuelta': 'Devuelta',
  'aprobada': 'Aprobada, sin publicar',
  'publicada': 'Publicada',
  'archivada': 'Archivada',
}

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const nonEmptyArray = (value: unknown) => Array.isArray(value) && value.length > 0

/** Problemas que impiden publicar el plato. Lista vacía = listo para publicar. */
export function groupBlockers(rows: PublicationRow[]): string[] {
  const problems: string[] = []
  for (const language of REQUIRED_LANGUAGES) {
    if (!rows.some((row) => row.language === language)) problems.push(`falta el idioma ${language}`)
  }
  for (const row of rows) {
    const p = (problem: string) => problems.push(`${row.language}: ${problem}`)
    if (!text(row.title)) p('sin título')
    if (!text(row.image_url)) p('sin foto de portada')
    if (!nonEmptyArray(row.ingredients)) p('sin ingredientes')
    if (!nonEmptyArray(row.steps)) p('sin pasos')
    if (!row.nutrition || row.nutrition.calories == null) p('sin nutrición')
    if (!text(row.seo?.title) || !text(row.seo?.description)) p('sin título o descripción SEO')
  }
  return problems.sort()
}

export function groupStage(rows: PublicationRow[], review: ReviewRow | undefined, blockers: string[]): GroupStage {
  if (rows.length === REQUIRED_LANGUAGES.length && rows.every((row) => row.published)) return 'publicada'
  // Recetas viejas archivadas (descartadas o pendientes de rehacer): fuera de la cola de trabajo.
  if (rows.every((row) => !row.published && row.editorial_status === 'archived')) return 'archivada'
  if (blockers.length > 0) return 'incompleta'
  if (review?.status === 'devuelta') return 'devuelta'
  if (review?.status === 'aprobada') return 'aprobada'
  return 'por-revisar'
}

/** Todas las imágenes que la página pública va a pedir: portada, variantes y pasos. Sin repetidos. */
export function groupImageUrls(rows: PublicationRow[]): string[] {
  const urls = new Set<string>()
  for (const row of rows) {
    if (text(row.image_url)) urls.add(text(row.image_url))
    const variants = row.seo?.image_variants
    if (Array.isArray(variants)) for (const v of variants) if (text(v)) urls.add(text(v))
    if (Array.isArray(row.steps)) {
      for (const step of row.steps) {
        const url = text((step as { image_url?: unknown })?.image_url)
        if (url) urls.add(url)
      }
    }
  }
  return Array.from(urls)
}

/** Nombre del plato para la cola: el título en español, o el primero que exista. */
export function groupTitle(rows: PublicationRow[]): string {
  const es = rows.find((row) => row.language === 'es')
  return text(es?.title) || text(rows[0]?.title) || '(sin título)'
}
