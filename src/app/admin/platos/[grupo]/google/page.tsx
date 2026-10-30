import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { uuidSchema } from '@/lib/validation'
import { loadGroup } from '@/lib/admin/publication-data'
import { groupTitle, LANGUAGE_NAMES } from '@/lib/admin/publication'
import { reviewedRecipeSeo } from '@/lib/recipe-snippet-repairs'
import { getSiteUrl, recipeHref } from '@/lib/site'
import { NotAdmin } from '../../../NotAdmin'
import { AdminNav } from '../../../AdminNav'
import { saveSeoAction } from '../../actions'
import { SeoEditor } from './SeoEditor'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Editar para Google — Manual de Cocina',
  robots: { index: false, follow: false },
}

type Props = {
  params: Promise<{ grupo: string }>
  searchParams: Promise<{ aviso?: string; mensaje?: string }>
}

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const safeDecode = (path: string) => { try { return decodeURI(path) } catch { return path } }

export default async function SeoEditPage({ params, searchParams }: Props) {
  const { grupo } = await params
  const query = await searchParams
  if (!uuidSchema.safeParse(grupo).success) notFound()

  const { supabase, user, isAdmin } = await requireAdmin()
  if (!isAdmin) return <NotAdmin email={user.email} />

  const detail = await loadGroup(supabase, grupo)
  if (!detail) notFound()
  const site = getSiteUrl().replace(/^https?:\/\//, '')

  const languages = detail.rows.map((row) => {
    const seo = reviewedRecipeSeo(row.id, row.seo)
    return {
      language: row.language,
      name: LANGUAGE_NAMES[row.language] ?? row.language,
      title: text(seo.title) || text(row.title),
      description: text(seo.description) || text(row.excerpt),
      displayUrl: `${site}${safeDecode(recipeHref({ public_path: row.public_path }))}`,
      published: row.published,
    }
  })

  return (
    <main className="adm">
      <AdminNav current="cola" />
      <p><Link href={`/admin/platos/${grupo}`}>← {groupTitle(detail.rows)}</Link></p>
      <h1>Editar para Google</h1>
      <p className="adm-hint">
        Esto es lo que la gente ve en los resultados de búsqueda antes de entrar. Un buen título dice qué es el plato
        y qué lo hace especial; la descripción convence de hacer clic. No cambia la receta ni su dirección.
      </p>
      {query.aviso && query.mensaje && (
        <p className={query.aviso === 'ok' ? 'adm-notice adm-notice-ok' : 'adm-notice adm-notice-error'} role="status">{query.mensaje}</p>
      )}
      <SeoEditor group={grupo} languages={languages} action={saveSeoAction} />
    </main>
  )
}
