import Link from 'next/link'
import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { loadQueue, type GroupSummary } from '@/lib/admin/publication-data'
import { REQUIRED_LANGUAGES, STAGE_LABELS, STAGE_NEXT_STEP, summarizeBlockers, type GroupStage } from '@/lib/admin/publication'
import { AdminNav } from './AdminNav'
import { NotAdmin } from './NotAdmin'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Centro de publicación — Manual de Cocina',
  robots: { index: false, follow: false },
}

// Lo que necesita una decisión tuya va arriba, en tarjetas grandes. Si no hay nada, lo dice claro.
const TODO: { stage: GroupStage; label: string; hint: string; clear: string; tone: 'action' | 'alert' }[] = [
  { stage: 'por-revisar', label: 'Por aprobar', hint: 'Completas en 7 idiomas, esperan tu decisión', clear: 'Nada por aprobar', tone: 'action' },
  { stage: 'aprobada', label: 'Listas para publicar', hint: 'Ya aprobadas: solo falta Publicar', clear: 'Nada esperando publicación', tone: 'action' },
  { stage: 'devuelta', label: 'Devueltas', hint: 'Esperan la corrección que pediste', clear: 'Ninguna devuelta', tone: 'alert' },
]

// Orden de las listas: primero lo que necesita una decisión tuya.
const SECTIONS: { stage: GroupStage; hint: string; limit?: number }[] = [
  { stage: 'por-revisar', hint: 'Completas en 7 idiomas. Revísalas y apruébalas o devuélvelas.' },
  { stage: 'aprobada', hint: 'Ya las aprobaste: solo falta darles Publicar.' },
  { stage: 'devuelta', hint: 'Las devolviste con un comentario. Esperan corrección.' },
  { stage: 'incompleta', hint: 'Les falta contenido (idiomas, nutrición, SEO…). Todavía no se pueden aprobar ni publicar: primero hay que completarlas.' },
  { stage: 'publicada', hint: 'En línea en los 7 idiomas. Las más recientes primero.', limit: 20 },
  { stage: 'archivada', hint: 'Recetas viejas archivadas: descartadas o pendientes de rehacer. No forman parte del trabajo.' },
]

const SECONDARY: GroupStage[] = ['incompleta', 'publicada', 'archivada']

function Row({ group }: { group: GroupSummary }) {
  const reasons = group.stage === 'incompleta' ? summarizeBlockers(group.blockers) : []
  return (
    <li className="adm-row">
      <Link href={`/admin/platos/${group.groupId}`} className="adm-row-link">
        <span className="adm-row-main">
          <span className="adm-row-title">{group.title}</span>
          <span className="adm-row-meta">{STAGE_NEXT_STEP[group.stage]}</span>
          {reasons.length > 0 && (
            <span className="adm-reasons">
              {reasons.map((reason) => <span key={reason} className="adm-reason">{reason}</span>)}
            </span>
          )}
          {group.stage === 'devuelta' && group.review?.comment && (
            <span className="adm-row-note">“{group.review.comment}”</span>
          )}
        </span>
        <span className="adm-row-side">
          <span className="adm-langbar" role="img" aria-label={`${group.languages} de ${REQUIRED_LANGUAGES.length} idiomas`}>
            {REQUIRED_LANGUAGES.map((language, i) => <i key={language} className={i < group.languages ? 'on' : undefined} />)}
          </span>
          <span className="adm-row-langs">{group.languages}/7 idiomas · {group.published}/7 publicadas</span>
        </span>
      </Link>
    </li>
  )
}

export default async function PublicationCenterPage() {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!isAdmin) return <NotAdmin email={user.email} />

  const queue = await loadQueue(supabase)
  const count = (stage: GroupStage) => queue.filter((g) => g.stage === stage).length
  const nothingToDecide = TODO.every(({ stage }) => count(stage) === 0)

  return (
    <main className="adm">
      <AdminNav current="cola" />
      <h1>Centro de publicación</h1>
      <p className="adm-sub">
        {nothingToDecide
          ? 'Todo al día: no hay nada que aprobar ni publicar ahora.'
          : 'Esto es lo que necesita una decisión tuya.'}
      </p>

      <ul className="adm-todo">
        {TODO.map(({ stage, label, hint, clear, tone }) => {
          const n = count(stage)
          const state = n === 0 ? 'is-clear' : tone === 'alert' ? 'is-alert' : 'is-action'
          return (
            <li key={stage}>
              <a href={`#${stage}`} className={state}>
                <span className="adm-todo-num">{n === 0 ? '✓' : n}</span>
                <span className="adm-todo-label">{n === 0 ? clear : label}</span>
                <span className="adm-todo-hint">{n === 0 ? label : hint}</span>
              </a>
            </li>
          )
        })}
      </ul>

      <ul className="adm-counters" aria-label="Otras etapas">
        {SECONDARY.map((stage) => (
          <li key={stage}><a href={`#${stage}`}><strong>{count(stage)}</strong> {STAGE_LABELS[stage]}</a></li>
        ))}
      </ul>

      {SECTIONS.map(({ stage, hint, limit }) => {
        const groups = queue.filter((g) => g.stage === stage)
        const shown = limit ? groups.slice(0, limit) : groups
        const body = (
          <>
            <p className="adm-hint">{hint}</p>
            {shown.length === 0
              ? <p className="adm-empty">Nada por aquí.</p>
              : <ul className="adm-list">{shown.map((group) => <Row key={group.groupId} group={group} />)}</ul>}
            {limit && groups.length > limit && <p className="adm-hint">Y {groups.length - limit} más.</p>}
          </>
        )
        if (stage === 'archivada') {
          return (
            <details key={stage} id={stage} className="adm-section adm-stage-archivada">
              <summary><h2>{STAGE_LABELS[stage]} <span className="adm-count">{groups.length}</span></h2></summary>
              {body}
            </details>
          )
        }
        return (
          <section key={stage} id={stage} className={`adm-section adm-stage-${stage}${groups.length === 0 ? ' is-quiet' : ''}`}>
            <h2>{STAGE_LABELS[stage]} <span className="adm-count">{groups.length}</span></h2>
            {body}
          </section>
        )
      })}
    </main>
  )
}
