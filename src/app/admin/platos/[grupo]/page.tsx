import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { uuidSchema } from '@/lib/validation'
import { checkImagesOnline, loadGroup } from '@/lib/admin/publication-data'
import {
  groupBlockers, groupImageUrls, groupStage, groupTitle, summarizeBlockers,
  LANGUAGE_NAMES, REQUIRED_LANGUAGES, STAGE_LABELS, STAGE_NEXT_STEP,
} from '@/lib/admin/publication'
import { ingredientDisplayText } from '@/lib/recipe-ingredient-format'
import { normalizePublicPath } from '@/lib/site'
import { reviewedRecipeSeo } from '@/lib/recipe-snippet-repairs'
import { NotAdmin } from '../../NotAdmin'
import { AdminNav } from '../../AdminNav'
import { publishGroupAction, reviewGroupAction, unpublishGroupAction } from '../actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Revisar receta — Manual de Cocina',
  robots: { index: false, follow: false },
}

type Props = {
  params: Promise<{ grupo: string }>
  searchParams: Promise<{ idioma?: string; aviso?: string; mensaje?: string }>
}

type Ingredient = { name: string; amount?: string; unit?: string; group?: string }
type Step = { title?: string; content?: string; image_url?: string; image_alt?: string }

export default async function GroupReviewPage({ params, searchParams }: Props) {
  const { grupo } = await params
  const query = await searchParams
  if (!uuidSchema.safeParse(grupo).success) notFound()

  const { supabase, user, isAdmin } = await requireAdmin()
  if (!isAdmin) return <NotAdmin email={user.email} />

  const detail = await loadGroup(supabase, grupo)
  if (!detail) notFound()
  const { rows, review } = detail

  const blockers = groupBlockers(rows)
  const stage = groupStage(rows, review, blockers)
  const isPublished = stage === 'publicada'
  const images = isPublished ? [] : await checkImagesOnline(groupImageUrls(rows))
  const missingImages = images.filter((image) => !image.ok)
  const canPublish = !isPublished && blockers.length === 0 && missingImages.length === 0 && review?.status === 'aprobada'

  const language = REQUIRED_LANGUAGES.find((l) => l === query.idioma) ?? 'es'
  const current = rows.find((row) => row.language === language) ?? rows[0]
  const ingredients = (Array.isArray(current.ingredients) ? current.ingredients : []) as Ingredient[]
  const steps = (Array.isArray(current.steps) ? current.steps : []) as Step[]
  const nutrition = current.nutrition ?? {}
  const seo = reviewedRecipeSeo(current.id, current.seo)

  return (
    <main className="adm">
      <AdminNav current="cola" />
      <h1>{groupTitle(rows)}</h1>
      <p className={`adm-badge adm-stage-${stage}`}>{STAGE_LABELS[stage]}</p>
      <p className={`adm-next adm-next-${stage}`}>
        <span><strong>Siguiente paso</strong>{STAGE_NEXT_STEP[stage]}</span>
      </p>

      {query.aviso && query.mensaje && (
        <p className={query.aviso === 'ok' ? 'adm-notice adm-notice-ok' : 'adm-notice adm-notice-error'} role="status">
          {query.mensaje}
        </p>
      )}

      <section className="adm-section">
        <h2>Revisión automática</h2>
        <ul className="adm-checks">
          <li className={blockers.length ? 'bad' : 'good'}>
            {blockers.length ? 'Falta completar el contenido' : 'Contenido completo en los 7 idiomas'}
            {blockers.length > 0 && (
              <>
                <span className="adm-reasons">
                  {summarizeBlockers(blockers).map((reason) => <span key={reason} className="adm-reason">{reason}</span>)}
                </span>
                <details>
                  <summary>Ver el detalle ({blockers.length})</summary>
                  <ul>{blockers.map((b) => <li key={b}>{b}</li>)}</ul>
                </details>
              </>
            )}
          </li>
          {!isPublished && (
            <li className={missingImages.length ? 'bad' : 'good'}>
              {missingImages.length
                ? `${missingImages.length} de ${images.length} fotos no cargan en la web todavía`
                : `Las ${images.length} fotos cargan en la web`}
              {missingImages.length > 0 && <ul>{missingImages.map((m) => <li key={m.url}>{m.url} ({m.status ?? 'sin respuesta'})</li>)}</ul>}
            </li>
          )}
          {/* Mientras falta contenido, la aprobación no es lo que bloquea: se muestra en gris, no en rojo. */}
          <li className={review?.status === 'aprobada' ? 'good' : review?.status === 'devuelta' || blockers.length === 0 ? 'bad' : 'wait'}>
            {review?.status === 'aprobada'
              ? 'Aprobada por el chef'
              : review?.status === 'devuelta'
                ? 'Devuelta por el chef'
                : blockers.length > 0
                  ? 'Aprobación pendiente: se hace cuando el contenido esté completo'
                  : 'Falta tu aprobación'}
            {review?.comment && <span className="adm-quote"> — “{review.comment}”</span>}
          </li>
        </ul>
      </section>

      <section className="adm-section adm-actions">
        <h2>Decisión</h2>
        <form action={reviewGroupAction} className="adm-form">
          <input type="hidden" name="group" value={grupo} />
          <label htmlFor="comment">Comentario (obligatorio si la devuelves)</label>
          <textarea id="comment" name="comment" rows={3} defaultValue={review?.status === 'devuelta' ? review.comment ?? '' : ''} />
          <div className="adm-buttons">
            <button type="submit" name="decision" value="aprobada" className="adm-btn adm-btn-ok">Aprobar</button>
            <button type="submit" name="decision" value="devuelta" className="adm-btn adm-btn-warn">Devolver</button>
          </div>
        </form>

        {!isPublished ? (
          <form action={publishGroupAction} className="adm-form">
            <input type="hidden" name="group" value={grupo} />
            <button type="submit" className="adm-btn adm-btn-primary" disabled={!canPublish}>Publicar en los 7 idiomas</button>
            {!canPublish && <p className="adm-hint">Se activa cuando la revisión automática está en verde y la aprobaste.</p>}
          </form>
        ) : (
          <form action={unpublishGroupAction} className="adm-form">
            <input type="hidden" name="group" value={grupo} />
            <label className="adm-confirm"><input type="checkbox" name="confirm" value="si" /> Confirmo que quiero retirar esta receta de la web</label>
            <button type="submit" className="adm-btn adm-btn-danger">Retirar de la web</button>
          </form>
        )}
      </section>

      <section className="adm-section">
        <h2>Vista previa</h2>
        <nav className="adm-tabs" aria-label="Idioma">
          {rows.map((row) => (
            <Link key={row.language} href={`/admin/platos/${grupo}?idioma=${row.language}`} aria-current={row.language === current.language ? 'page' : undefined}>
              {LANGUAGE_NAMES[row.language] ?? row.language}{row.published ? ' ✓' : ''}
            </Link>
          ))}
        </nav>

        <article className="adm-preview">
          {current.image_url && <img src={current.image_url} alt="" className="adm-cover" />}
          <h3>{current.title}</h3>
          {current.excerpt && <p>{current.excerpt}</p>}
          <p className="adm-hint">
            URL: {current.published
              ? <a href={normalizePublicPath(current.public_path)} target="_blank" rel="noreferrer">{current.public_path}</a>
              : current.public_path}
          </p>

          <h4>En Google</h4>
          <div className="adm-serp">
            <strong>{String(seo.title ?? '')}</strong>
            <span>{String(seo.description ?? '')}</span>
          </div>
          <p><Link href={`/admin/platos/${grupo}/google`} className="adm-btn">Editar para Google</Link></p>

          <h4>Ingredientes ({ingredients.length})</h4>
          <ul>
            {ingredients.map((ingredient, i) => (
              <li key={i}>{ingredientDisplayText({ name: ingredient.name, amount: ingredient.amount, unit: ingredient.unit }, current.language)}</li>
            ))}
          </ul>

          <h4>Pasos ({steps.length})</h4>
          <ol className="adm-steps">
            {steps.map((step, i) => (
              <li key={i}>
                {step.image_url && <img src={step.image_url} alt={step.image_alt ?? ''} loading="lazy" />}
                <strong>{step.title}</strong>
                <p>{step.content}</p>
              </li>
            ))}
          </ol>

          <h4>Nutrición por ración</h4>
          <p>
            {nutrition.calories != null ? `${nutrition.calories} kcal · ` : ''}
            {nutrition.protein_g != null ? `${nutrition.protein_g} g proteína · ` : ''}
            {nutrition.carbs_g != null ? `${nutrition.carbs_g} g carbohidratos · ` : ''}
            {nutrition.fat_g != null ? `${nutrition.fat_g} g grasa` : ''}
            {nutrition.serving_size ? ` (${String(nutrition.serving_size)})` : ''}
          </p>
        </article>
      </section>
    </main>
  )
}
