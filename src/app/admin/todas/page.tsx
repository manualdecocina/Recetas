import Link from 'next/link'
import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { normalizePublicPath } from '@/lib/site'
import { deleteRecipeAction } from '../actions'
import { AdminNav } from '../AdminNav'
import { DeleteButton } from '../DeleteButton'
import { NotAdmin } from '../NotAdmin'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Todas las recetas — Manual de Cocina',
  robots: { index: false, follow: false },
}

const PAGE_SIZE = 50

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const query = await searchParams
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!isAdmin) return <NotAdmin email={user.email} />

  const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1)
  const from = (page - 1) * PAGE_SIZE

  const { data: recipes, count, error } = await supabase
    .from('recipes')
    .select('id, recipe_group_id, language, slug, public_path, title, published, published_at, updated_at', {
      count: 'exact',
    })
    .order('updated_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  if (error) throw new Error(`No se pudieron cargar las recetas: ${error.message}`)

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <main className="adm">
      <AdminNav current="todas" />
      <h1>Todas las recetas</h1>
      <div className="adm-toolbar">
        <p className="adm-sub">{total} recetas en total (todas las versiones de idioma), las más recientes primero.</p>
        <Link href="/admin/recetas/nueva" className="adm-btn adm-btn-primary">+ Nueva receta</Link>
      </div>

      {total === 0 ? (
        <p className="adm-hint">Todavía no hay recetas. Crea la primera con “Nueva receta”.</p>
      ) : (
        <section className="adm-section adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Idioma</th>
                <th>Título</th>
                <th>Estado</th>
                <th>Publicada desde</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(recipes ?? []).map((r) => (
                <tr key={r.id}>
                  <td><span className="adm-lang">{r.language}</span></td>
                  <td>{r.title}</td>
                  <td><span className={r.published ? 'adm-chip adm-chip-ok' : 'adm-chip'}>{r.published ? 'Publicada' : 'Borrador'}</span></td>
                  <td>{r.published_at ? new Date(r.published_at).toLocaleDateString('es-CO') : '—'}</td>
                  <td>
                    <div className="adm-cell-actions">
                      <Link href={`/admin/recetas/${r.id}`}>Editar</Link>
                      <Link href={`/admin/recetas/nueva?from=${r.id}`}>Añadir traducción</Link>
                      {r.published && <Link href={normalizePublicPath(r.public_path)}>Ver</Link>}
                      <form action={deleteRecipeAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <DeleteButton title={r.title} />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {totalPages > 1 && (
        <nav className="adm-pager" aria-label="Paginación">
          {page > 1 && <Link href={`/admin/todas?page=${page - 1}`}>← Anterior</Link>}
          <span>Página {page} de {totalPages}</span>
          {page < totalPages && <Link href={`/admin/todas?page=${page + 1}`}>Siguiente →</Link>}
        </nav>
      )}
    </main>
  )
}
