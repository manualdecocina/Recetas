import Link from 'next/link'
import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { checkPublishedCovers, loadHealth, type HealthItem } from '@/lib/admin/health-data'
import { measureSpeed, runLiveChecks, type SpeedMetric } from '@/lib/admin/live-checks'
import { LANGUAGE_NAMES, REQUIRED_LANGUAGES } from '@/lib/admin/publication'
import { SEO_LIMITS } from '@/lib/admin/seo-checks'
import { getSiteUrl, recipeHref } from '@/lib/site'
import { NotAdmin } from '../NotAdmin'
import { AdminNav } from '../AdminNav'

export const dynamic = 'force-dynamic'
// La medición de velocidad de Google tarda hasta ~40 s.
export const maxDuration = 120
export const metadata: Metadata = {
  title: 'Salud del sitio — Manual de Cocina',
  robots: { index: false, follow: false },
}

type Props = { searchParams: Promise<{ fotos?: string; velocidad?: string; modo?: string; idioma?: string }> }

const SPEED_TARGETS = ['portada', 'listado', 'ultima'] as const
type SpeedTarget = (typeof SPEED_TARGETS)[number]
const SPEED_LABELS: Record<SpeedTarget, string> = { portada: 'Portada', listado: 'Listado de recetas', ultima: 'Última receta publicada' }

function Items({ items, limit = 60 }: { items: HealthItem[]; limit?: number }) {
  return (
    <ul className="adm-issues">
      {items.slice(0, limit).map((item, i) => (
        <li key={`${item.groupId}-${item.language}-${i}`}>
          {item.groupId
            ? <Link href={`/admin/platos/${item.groupId}${item.language ? `?idioma=${item.language}` : ''}`}>{item.title}</Link>
            : <code>{item.title}</code>}
          {item.language && <span className="adm-lang">{item.language}</span>}
          <span className="adm-issue-detail">{item.detail}</span>
        </li>
      ))}
      {items.length > limit && <li className="adm-hint">Y {items.length - limit} más.</li>}
    </ul>
  )
}

function Metric({ metric }: { metric: SpeedMetric }) {
  return (
    <li className={`adm-metric adm-rating-${metric.rating ?? 'na'}`}>
      <span>{metric.label}</span>
      <strong>{metric.value}</strong>
    </li>
  )
}

export default async function HealthPage({ searchParams }: Props) {
  const query = await searchParams
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!isAdmin) return <NotAdmin email={user.email} />

  const { data: latest } = await supabase.from('recipes')
    .select('recipe_group_id, language, title, public_path, source_url')
    .eq('published', true).in('language', ['es', 'en'])
    .order('ready_at', { ascending: false, nullsFirst: false }).limit(10)
  const latestEs = latest?.find((r) => r.language === 'es')
  const latestEn = latest?.find((r) => r.language === 'en' && r.recipe_group_id === latestEs?.recipe_group_id)
    ?? latest?.find((r) => r.language === 'en')

  const health = await loadHealth(supabase)
  const totalPublishedRows = Object.values(health.publishedByLanguage).reduce((a, b) => a + b, 0)
  const live = await runLiveChecks([
    ...(latestEs ? [{ label: `Última receta (es)`, path: recipeHref(latestEs) }] : []),
    ...(latestEn ? [{ label: `Última receta (en)`, path: recipeHref(latestEn) }] : []),
  ], totalPublishedRows)

  const photos = query.fotos === '1' ? await checkPublishedCovers(supabase) : null

  const speedTarget = SPEED_TARGETS.find((t) => t === query.velocidad)
  const strategy = query.modo === 'pc' ? 'desktop' : 'mobile'
  const site = getSiteUrl()
  const speedUrl = speedTarget === 'portada' ? `${site}/es`
    : speedTarget === 'listado' ? `${site}/es/recetas`
      : speedTarget === 'ultima' && latestEs ? `${site}${recipeHref(latestEs)}` : null
  const speed = speedUrl ? await measureSpeed(speedUrl, strategy) : null

  const errorCount = health.errors.reduce((n, group) => n + group.items.length, 0)
  const seoLanguage = REQUIRED_LANGUAGES.find((l) => l === query.idioma) ?? 'es'
  const seoItems = health.seo.filter((item) => item.language === seoLanguage)
  const liveProblems = live.filter((check) => !check.ok).length

  return (
    <main className="adm">
      <AdminNav current="salud" />
      <h1>Salud del sitio</h1>
      <p className="adm-hint">Se revisa cada vez que abres esta página. Lo de arriba es lo urgente.</p>

      <ul className="adm-counters">
        <li><strong>{health.publishedGroups}</strong> recetas publicadas</li>
        <li><strong>{health.newLast7}</strong> nuevas en 7 días</li>
        <li><strong>{health.newLast30}</strong> nuevas en 30 días</li>
        <li className={errorCount ? 'bad' : 'good'}><a href="#errores"><strong>{errorCount}</strong> errores</a></li>
        <li className={liveProblems ? 'bad' : 'good'}><a href="#en-vivo"><strong>{liveProblems}</strong> fallas en vivo</a></li>
        <li><a href="#google"><strong>{health.seo.length}</strong> mejoras para Google</a></li>
      </ul>

      <p className="adm-langs">
        {REQUIRED_LANGUAGES.map((l) => (
          <span key={l}>{LANGUAGE_NAMES[l]}: <strong>{health.publishedByLanguage[l]}</strong></span>
        ))}
      </p>

      <section id="en-vivo" className="adm-section">
        <h2>Sitio en vivo</h2>
        <p className="adm-hint">Páginas clave pedidas ahora mismo a manualdecocina.com, como las pide Google.</p>
        <table className="adm-table">
          <thead><tr><th>Página</th><th>Estado</th><th>Tiempo</th><th>Peso</th><th>Revisión</th></tr></thead>
          <tbody>
            {live.map((check) => (
              <tr key={check.url} className={check.ok ? 'good' : 'bad'}>
                <td><a href={check.url} target="_blank" rel="noreferrer">{check.label}</a></td>
                <td>{check.status ?? '—'}</td>
                <td>{check.ms != null ? `${(check.ms / 1000).toFixed(2)} s` : '—'}</td>
                <td>{check.kb != null ? `${check.kb} KB` : '—'}</td>
                <td>{check.notes.join(' · ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="velocidad" className="adm-section">
        <h2>Velocidad (Google PageSpeed)</h2>
        <p className="adm-hint">La medición oficial de Google. Tarda 20–40 segundos: dale un solo clic y espera.</p>
        <form method="get" action="#velocidad" className="adm-inline-form">
          <select name="velocidad" defaultValue={speedTarget ?? 'ultima'} aria-label="Página">
            {SPEED_TARGETS.map((t) => <option key={t} value={t}>{SPEED_LABELS[t]}</option>)}
          </select>
          <select name="modo" defaultValue={strategy === 'desktop' ? 'pc' : 'movil'} aria-label="Dispositivo">
            <option value="movil">Celular</option>
            <option value="pc">Computador</option>
          </select>
          <button type="submit" className="adm-btn adm-btn-primary">Medir</button>
        </form>
        {speed && (
          <div className="adm-speed">
            <p><a href={speed.url} target="_blank" rel="noreferrer">{speed.url}</a> · {speed.strategy === 'mobile' ? 'celular' : 'computador'}</p>
            {speed.error ? <p className="adm-notice adm-notice-error">{speed.error}</p> : (
              <>
                <p className={`adm-score adm-rating-${speed.score == null ? 'na' : speed.score >= 90 ? 'bueno' : speed.score >= 50 ? 'mejorable' : 'malo'}`}>
                  <strong>{speed.score ?? '—'}</strong> / 100
                </p>
                <h3>Prueba de laboratorio</h3>
                <ul className="adm-metrics">{speed.lab.map((m) => <Metric key={m.label} metric={m} />)}</ul>
                <h3>Visitantes reales (últimos 28 días)</h3>
                {speed.field.length
                  ? <ul className="adm-metrics">{speed.field.map((m) => <Metric key={m.label} metric={m} />)}</ul>
                  : <p className="adm-hint">Esta página todavía no tiene suficientes visitas de Chrome para que Google publique datos reales.</p>}
              </>
            )}
          </div>
        )}
      </section>

      <section id="errores" className="adm-section">
        <h2>Errores</h2>
        {health.errors.map((group) => (
          <div key={group.key} className="adm-health-group">
            <h3 className={group.items.length ? 'bad' : 'good'}>
              {group.items.length ? '✗' : '✓'} {group.label} <span className="adm-count">{group.items.length}</span>
            </h3>
            {group.items.length > 0 && <><p className="adm-hint">{group.help}</p><Items items={group.items} /></>}
          </div>
        ))}
      </section>

      <section id="fotos" className="adm-section">
        <h2>Fotos de portada</h2>
        {photos ? (
          photos.problems.length === 0
            ? <p className="good">✓ Las {photos.checked} portadas cargan en la web.</p>
            : (
              <>
                <p className="bad">✗ {photos.problems.length} de {photos.checked} portadas no cargan.</p>
                <ul className="adm-issues">
                  {photos.problems.map((p) => (
                    <li key={p.url}><Link href={`/admin/platos/${p.groupId}`}>{p.title}</Link> <span className="adm-issue-detail">{p.status ?? 'sin respuesta'} · {p.url}</span></li>
                  ))}
                </ul>
              </>
            )
        ) : (
          <form method="get" action="#fotos">
            <input type="hidden" name="fotos" value="1" />
            <p className="adm-hint">Revisa una por una las portadas de las recetas publicadas. Tarda unos segundos.</p>
            <button type="submit" className="adm-btn">Revisar fotos</button>
          </form>
        )}
      </section>

      <section id="google" className="adm-section">
        <h2>Mejoras para Google</h2>
        <p className="adm-hint">
          Títulos de más de {SEO_LIMITS.titleMax} caracteres o descripciones fuera de {SEO_LIMITS.descriptionMin}–{SEO_LIMITS.descriptionMax}:
          Google los corta o desaprovecha espacio, y eso baja los clics. Entra a la receta y usa «Editar para Google».
          No es urgente: arréglalas de a pocas, empezando por las que más visitas tienen.
        </p>
        <nav className="adm-tabs" aria-label="Idioma">
          {REQUIRED_LANGUAGES.filter((l) => l !== 'ja').map((l) => (
            <Link key={l} href={`/admin/salud?idioma=${l}#google`} aria-current={l === seoLanguage ? 'page' : undefined}>
              {LANGUAGE_NAMES[l]} ({health.seo.filter((i) => i.language === l).length})
            </Link>
          ))}
        </nav>
        {seoItems.length ? <Items items={seoItems} limit={100} /> : <p className="good">✓ Todo bien en este idioma.</p>}
      </section>
    </main>
  )
}
