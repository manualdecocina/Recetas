import Link from 'next/link'
import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { normalizePublicPath } from '@/lib/site'
import { deleteRecipeAction, signOutAction } from './actions'
import { DeleteButton } from './DeleteButton'
import { NotAdmin } from './NotAdmin'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Panel — Manual de Cocina',
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
    <main>
      <h1>Panel de administración</h1>
      <p>{total} recetas en total (todas las versiones de idioma).</p>

      <p>
        <Link href="/admin/recetas/nueva">Nueva receta</Link>
      </p>
      <form action={signOutAction}>
        <button type="submit">Cerrar sesión</button>
      </form>

      {total === 0 ? (
        <p>Todavía no hay recetas. Crea la primera con “Nueva receta”.</p>
      ) : (
        <table>
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
                <td>{r.language}</td>
                <td>{r.title}</td>
                <td>{r.published ? 'Publicada' : 'Borrador'}</td>
                <td>{r.published_at ? new Date(r.published_at).toLocaleDateString('es-CO') : '—'}</td>
                <td>
                  <Link href={`/admin/recetas/${r.id}`}>Editar</Link>{' '}
                  <Link href={`/admin/recetas/nueva?from=${r.id}`}>Añadir traducción</Link>{' '}
                  {r.published && <Link href={normalizePublicPath(r.public_path)}>Ver</Link>}{' '}
                  <form action={deleteRecipeAction} style={{ display: 'inline' }}>
                    <input type="hidden" name="id" value={r.id} />
                    <DeleteButton title={r.title} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginación">
          {page > 1 && <Link href={`/admin?page=${page - 1}`}>Anterior</Link>}{' '}
          Página {page} de {totalPages}{' '}
          {page < totalPages && <Link href={`/admin?page=${page + 1}`}>Siguiente</Link>}
        </nav>
      )}
    </main>
  )
}
