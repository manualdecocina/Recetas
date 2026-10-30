import 'server-only'
import { getSiteUrl } from '@/lib/site'

export interface LiveCheck {
  label: string
  url: string
  status: number | null
  ms: number | null
  kb: number | null
  ok: boolean
  notes: string[]
}

const FETCH_TIMEOUT_MS = 15_000

async function timedGet(url: string): Promise<{ status: number | null; ms: number | null; body: string; headers: Headers | null }> {
  const start = performance.now()
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      redirect: 'manual',
      headers: { 'user-agent': 'ManualDeCocina-Panel/1.0 (comprobación de salud)' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    const body = await res.text()
    return { status: res.status, ms: Math.round(performance.now() - start), body, headers: res.headers }
  } catch {
    return { status: null, ms: null, body: '', headers: null }
  }
}

const count = (body: string, pattern: RegExp) => (body.match(pattern) ?? []).length

/** Qué tiene que traer cada página para que Google la entienda bien. */
function inspect(kind: 'html' | 'receta' | 'sitemap' | 'robots' | 'ads', body: string, expectedRecipes: number): { ok: boolean; notes: string[] } {
  const notes: string[] = []
  let ok = true
  const need = (condition: boolean, good: string, bad: string) => {
    notes.push(condition ? good : bad)
    if (!condition) ok = false
  }
  if (kind === 'html' || kind === 'receta') {
    need(/<title>[^<]+<\/title>/i.test(body), 'tiene título', 'sin <title>')
    need(/<link[^>]+rel="canonical"/i.test(body), 'tiene canonical', 'sin canonical')
    need(!/<meta[^>]+name="robots"[^>]+noindex/i.test(body), 'indexable', '¡tiene noindex!')
    const hreflang = count(body, /hreflang="/gi)
    notes.push(`${hreflang} enlaces hreflang`)
  }
  if (kind === 'receta') {
    need(/"@type"\s*:\s*"Recipe"/.test(body), 'datos de receta para Google (JSON-LD)', 'sin datos de receta (JSON-LD)')
    need(/pinterest\.com\/pin\/create/i.test(body), 'botón de Pinterest', 'sin botón de Pinterest')
  }
  if (kind === 'sitemap') {
    const urls = count(body, /<loc>/g)
    notes.push(`${urls} URLs`)
    need(urls >= expectedRecipes, `incluye al menos las ${expectedRecipes} recetas publicadas`, `tiene menos URLs que recetas publicadas (${expectedRecipes})`)
  }
  if (kind === 'robots') {
    need(/sitemap:/i.test(body), 'anuncia el sitemap', 'no anuncia el sitemap')
    need(!/^\s*disallow:\s*\/\s*$/im.test(body), 'no bloquea el sitio', '¡bloquea todo el sitio (Disallow: /)!')
  }
  if (kind === 'ads') {
    need(/google\.com,\s*pub-\d+/i.test(body), 'línea de AdSense presente', 'falta la línea de AdSense')
  }
  return { ok, notes }
}

/** Revisa en vivo las páginas clave. `expectedRecipes` = recetas publicadas en total
 * (todas las lenguas), para comprobar que el sitemap no se quedó corto. */
export async function runLiveChecks(latestRecipePaths: { label: string; path: string }[], expectedRecipes: number): Promise<LiveCheck[]> {
  const site = getSiteUrl()
  const targets: { label: string; path: string; kind: 'html' | 'receta' | 'sitemap' | 'robots' | 'ads' }[] = [
    { label: 'Portada (es)', path: '/es', kind: 'html' },
    { label: 'Listado de recetas', path: '/es/recetas', kind: 'html' },
    ...latestRecipePaths.map((r) => ({ ...r, kind: 'receta' as const })),
    { label: 'Sitemap', path: '/sitemap.xml', kind: 'sitemap' },
    { label: 'robots.txt', path: '/robots.txt', kind: 'robots' },
    { label: 'ads.txt (AdSense)', path: '/ads.txt', kind: 'ads' },
  ]
  return Promise.all(targets.map(async (target) => {
    const url = `${site}${target.path.startsWith('/') ? '' : '/'}${encodeURI(decodeURI(target.path))}`
    const res = await timedGet(url)
    if (res.status === null) return { label: target.label, url, status: null, ms: null, kb: null, ok: false, notes: ['sin respuesta en 15 s'] }
    if (res.status !== 200) return { label: target.label, url, status: res.status, ms: res.ms, kb: null, ok: false, notes: [`respondió ${res.status} en vez de 200`] }
    const verdict = inspect(target.kind, res.body, expectedRecipes)
    const kb = Math.round(Buffer.byteLength(res.body) / 1024)
    if (res.ms !== null && res.ms > 2500) verdict.notes.push('lenta desde el servidor (> 2,5 s)')
    return { label: target.label, url, status: res.status, ms: res.ms, kb, ok: verdict.ok, notes: verdict.notes }
  }))
}

export interface SpeedMetric { label: string; value: string; rating: 'bueno' | 'mejorable' | 'malo' | null }

export interface SpeedResult {
  url: string
  strategy: 'mobile' | 'desktop'
  score: number | null
  lab: SpeedMetric[]
  /** Datos reales de usuarios de Chrome (los que usa Google para posicionar), si hay suficientes visitas. */
  field: SpeedMetric[]
  error?: string
}

type Audit = { displayValue?: string; score?: number | null }

const ratingFromScore = (score: number | null | undefined): SpeedMetric['rating'] =>
  score == null ? null : score >= 0.9 ? 'bueno' : score >= 0.5 ? 'mejorable' : 'malo'

const ratingFromCategory = (category: string | undefined): SpeedMetric['rating'] =>
  category === 'FAST' ? 'bueno' : category === 'AVERAGE' ? 'mejorable' : category === 'SLOW' ? 'malo' : null

/** Mide con PageSpeed Insights, la herramienta oficial de Google. Tarda 20–40 s.
 * Funciona sin clave; con PAGESPEED_API_KEY en el servidor tiene más cupo diario. */
export async function measureSpeed(url: string, strategy: 'mobile' | 'desktop'): Promise<SpeedResult> {
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  api.searchParams.set('url', url)
  api.searchParams.set('strategy', strategy)
  api.searchParams.set('category', 'performance')
  api.searchParams.set('locale', 'es')
  if (process.env.PAGESPEED_API_KEY) api.searchParams.set('key', process.env.PAGESPEED_API_KEY)

  const empty: SpeedResult = { url, strategy, score: null, lab: [], field: [] }
  try {
    const res = await fetch(api, { cache: 'no-store', signal: AbortSignal.timeout(90_000) })
    const data = await res.json() as {
      error?: { message?: string; code?: number }
      lighthouseResult?: { categories?: { performance?: { score?: number | null } }; audits?: Record<string, Audit> }
      loadingExperience?: { metrics?: Record<string, { percentile?: number; category?: string }> }
    }
    if (!res.ok || data.error) {
      const quota = res.status === 429 || data.error?.code === 429
      return { ...empty, error: quota ? 'Google limitó las mediciones sin clave por hoy. Intenta más tarde.' : `Google respondió: ${data.error?.message ?? res.status}` }
    }
    const audits = data.lighthouseResult?.audits ?? {}
    const lab: SpeedMetric[] = [
      ['largest-contentful-paint', 'Carga del elemento principal (LCP)'],
      ['first-contentful-paint', 'Primer contenido visible (FCP)'],
      ['total-blocking-time', 'Bloqueo por JavaScript (TBT)'],
      ['cumulative-layout-shift', 'Saltos de diseño (CLS)'],
      ['speed-index', 'Índice de velocidad'],
    ].map(([key, label]) => ({ label, value: audits[key]?.displayValue ?? '—', rating: ratingFromScore(audits[key]?.score) }))

    const metrics = data.loadingExperience?.metrics ?? {}
    const field: SpeedMetric[] = []
    const lcp = metrics.LARGEST_CONTENTFUL_PAINT_MS
    if (lcp?.percentile != null) field.push({ label: 'LCP real', value: `${(lcp.percentile / 1000).toFixed(1)} s`, rating: ratingFromCategory(lcp.category) })
    const inp = metrics.INTERACTION_TO_NEXT_PAINT
    if (inp?.percentile != null) field.push({ label: 'Respuesta al tocar (INP) real', value: `${inp.percentile} ms`, rating: ratingFromCategory(inp.category) })
    const cls = metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE
    if (cls?.percentile != null) field.push({ label: 'CLS real', value: (cls.percentile / 100).toFixed(2), rating: ratingFromCategory(cls.category) })

    const score = data.lighthouseResult?.categories?.performance?.score
    return { url, strategy, score: score == null ? null : Math.round(score * 100), lab, field }
  } catch {
    return { ...empty, error: 'Google tardó demasiado en responder. Intenta de nuevo.' }
  }
}
