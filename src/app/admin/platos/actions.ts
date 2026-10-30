'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { RECIPES_CACHE_TAG } from '@/lib/cache'
import { uuidSchema } from '@/lib/validation'
import { groupBlockers, groupImageUrls } from '@/lib/admin/publication'
import { checkImagesOnline, loadGroup } from '@/lib/admin/publication-data'
import { seoSaveError } from '@/lib/admin/seo-checks'
import { reviewedRecipeSeo } from '@/lib/recipe-snippet-repairs'

// Las acciones vuelven a la página del plato con un aviso en la URL (?aviso=…), así
// funcionan como formularios normales, incluso desde el celular y sin JavaScript.
function back(groupId: string, kind: 'ok' | 'error', message: string): never {
  const params = new URLSearchParams({ aviso: kind, mensaje: message })
  redirect(`/admin/platos/${groupId}?${params.toString()}`)
}

const reviewSchema = z.object({
  group: uuidSchema,
  decision: z.enum(['aprobada', 'devuelta']),
  comment: z.string().trim().max(2000).optional(),
})

export async function reviewGroupAction(formData: FormData) {
  const parsed = reviewSchema.safeParse({
    group: formData.get('group'),
    decision: formData.get('decision'),
    comment: formData.get('comment') ?? undefined,
  })
  if (!parsed.success) redirect('/admin')
  const { group, decision, comment } = parsed.data

  const { supabase, user, isAdmin } = await requireAdmin()
  if (!isAdmin) back(group, 'error', 'Tu usuario no tiene permisos de administrador.')
  if (decision === 'devuelta' && !comment) back(group, 'error', 'Para devolver la receta escribe qué hay que corregir.')

  const { error } = await supabase.from('recipe_reviews').upsert({
    recipe_group_id: group,
    status: decision,
    comment: comment || null,
    reviewed_by: user.id,
    reviewed_at: new Date().toISOString(),
  })
  if (error) back(group, 'error', `No se pudo guardar la revisión: ${error.message}`)

  revalidatePath('/admin')
  back(group, 'ok', decision === 'aprobada' ? 'Receta aprobada.' : 'Receta devuelta con tu comentario.')
}

export async function publishGroupAction(formData: FormData) {
  const group = uuidSchema.safeParse(formData.get('group'))
  if (!group.success) redirect('/admin')
  const { supabase, isAdmin } = await requireAdmin()
  if (!isAdmin) back(group.data, 'error', 'Tu usuario no tiene permisos de administrador.')

  const detail = await loadGroup(supabase, group.data)
  if (!detail) back(group.data, 'error', 'No se encontró la receta.')
  const blockers = groupBlockers(detail.rows)
  if (blockers.length) back(group.data, 'error', `Falta completar: ${blockers.join('; ')}`)

  // Las fotos tienen que estar en el sitio antes de publicar (despliegue terminado).
  const images = await checkImagesOnline(groupImageUrls(detail.rows))
  const missing = images.filter((image) => !image.ok)
  if (missing.length) back(group.data, 'error', `${missing.length} foto(s) todavía no cargan en la web. Espera a que termine el despliegue y vuelve a intentar.`)

  const { data, error } = await supabase.rpc('admin_publish_recipe_group', { p_group: group.data })
  if (error) back(group.data, 'error', error.message)

  revalidateTag(RECIPES_CACHE_TAG, 'max')
  revalidatePath('/admin')
  const removed = Number((data as { redirects_removed?: number } | null)?.redirects_removed ?? 0)
  back(group.data, 'ok', `Publicada en los 7 idiomas.${removed ? ` Se quitaron ${removed} redirección(es) vieja(s).` : ''}`)
}

export async function unpublishGroupAction(formData: FormData) {
  const group = uuidSchema.safeParse(formData.get('group'))
  if (!group.success) redirect('/admin')
  if (formData.get('confirm') !== 'si') back(group.data, 'error', 'Marca la casilla de confirmación para retirar la receta.')
  const { supabase, isAdmin } = await requireAdmin()
  if (!isAdmin) back(group.data, 'error', 'Tu usuario no tiene permisos de administrador.')

  const { error } = await supabase.rpc('admin_unpublish_recipe_group', { p_group: group.data })
  if (error) back(group.data, 'error', error.message)

  revalidateTag(RECIPES_CACHE_TAG, 'max')
  revalidatePath('/admin')
  back(group.data, 'ok', 'Receta retirada de la web en los 7 idiomas. Sus URLs ahora responden 404.')
}

function backToSeo(groupId: string, kind: 'ok' | 'error', message: string): never {
  const params = new URLSearchParams({ aviso: kind, mensaje: message })
  redirect(`/admin/platos/${groupId}/google?${params.toString()}`)
}

const fieldText = (formData: FormData, name: string) => {
  const value = formData.get(name)
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : null
}

/** Guarda el título y la descripción para Google de los idiomas que cambiaron.
 * Solo toca seo.title y seo.description: el resto de la receta queda igual. */
export async function saveSeoAction(formData: FormData) {
  const group = uuidSchema.safeParse(formData.get('group'))
  if (!group.success) redirect('/admin')
  const { supabase, isAdmin } = await requireAdmin()
  if (!isAdmin) backToSeo(group.data, 'error', 'Tu usuario no tiene permisos de administrador.')

  const detail = await loadGroup(supabase, group.data)
  if (!detail) backToSeo(group.data, 'error', 'No se encontró la receta.')

  const updates: { id: string; language: string; seo: Record<string, unknown> }[] = []
  for (const row of detail.rows) {
    const title = fieldText(formData, `title_${row.language}`)
    const description = fieldText(formData, `description_${row.language}`)
    if (title === null || description === null) continue
    const current = reviewedRecipeSeo(row.id, row.seo)
    const currentTitle = typeof current.title === 'string' ? current.title.trim() : ''
    const currentDescription = typeof current.description === 'string' ? current.description.trim() : ''
    if (title === currentTitle && description === currentDescription) continue
    const problem = seoSaveError(title, description)
    if (problem) backToSeo(group.data, 'error', `${row.language}: ${problem} No se guardó nada.`)
    updates.push({ id: row.id, language: row.language, seo: { ...(row.seo ?? {}), title, description } })
  }
  if (updates.length === 0) backToSeo(group.data, 'ok', 'No había cambios que guardar.')

  for (const update of updates) {
    const { error } = await supabase.from('recipes').update({ seo: update.seo }).eq('id', update.id)
    if (error) backToSeo(group.data, 'error', `${update.language}: no se pudo guardar (${error.message}).`)
  }

  revalidateTag(RECIPES_CACHE_TAG, 'max')
  revalidatePath('/admin/salud')
  backToSeo(group.data, 'ok', `Guardado en ${updates.map((u) => u.language).join(', ')}.`)
}
