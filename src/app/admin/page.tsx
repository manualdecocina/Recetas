import Link from 'next/link'
import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { loadQueue, type GroupSummary } from '@/lib/admin/publication-data'
import { STAGE_LABELS, type GroupStage } from '@/lib/admin/publication'
import { signOutAction } from './actions'
import { NotAdmin } from './NotAdmin'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Centro de publicación — Manual de Cocina',
  robots: { index: false, follow: false },
}

// Orden de la cola: primero lo que necesita una decisión tuya.
const SECTIONS: { stage: GroupStage; hint: string; limit?: number }[] = [
  { stage: 'aprobada', hint: 'Ya las aprobaste: solo falta darles Publicar.' },
  { stage: 'por-revisar', hint: 'Completas en 7 idiomas. Revísalas y apruébalas o devuélvelas.' },
  { stage: 'devuelta', hint: 'Las devolviste con un comentario. Esperan corrección.' },
  { stage: 'incompleta', hint: 'Les falta algo (idiomas, nutrición, SEO…). No se pueden publicar todavía.' },
  { stage: 'publicada', hint: 'En línea en los 7 idiomas. Las más recientes primero.', limit: 20 },
  { stage: 'archivada', hint: 'Recetas viejas archivadas: descartadas o pendientes de rehacer. No forman parte del trabajo.' },
]

function Row({ group }: { group: GroupSummary }) {
  return (
    <li className="adm-row">
      <Link href={`/admin/platos/${group.groupId}`} className="adm-row-link">
        <span className="adm-row-title">{group.title}</span>
        <span className="adm-row-meta">
          {group.languages}/7 idiomas · {group.published}/7 publicadas
          {group.stage === 'incompleta' && group.blockers.length > 0 && ` · ${group.blockers.length} pendiente(s)`}
        </span>
        {group.stage === 'devuelta' && group.review?.comment && (
          <span className="adm-row-note">“{group.review.comment}”</span>
        )}
      </Link>
    </li>
  )
}

export default async function PublicationCenterPage() {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!isAdmin) return <NotAdmin email={user.email} />

  const queue = await loadQueue(supabase)
  const count = (stage: GroupStage) => queue.filter((g) => g.stage === stage).length

  return (
    <main className="adm">
      <header className="adm-header">
        <h1>Centro de publicación</h1>
        <nav className="adm-nav">
          <Link href="/admin/todas">Todas las recetas</Link>
          <form action={signOutAction}><button type="submit" className="adm-link-button">Cerrar sesión</button></form>
        </nav>
      </header>

      <ul className="adm-counters">
        {SECTIONS.map(({ stage }) => (
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
          <section key={stage} id={stage} className={`adm-section adm-stage-${stage}`}>
            <h2>{STAGE_LABELS[stage]} <span className="adm-count">{groups.length}</span></h2>
            {body}
          </section>
        )
      })}
    </main>
  )
}
