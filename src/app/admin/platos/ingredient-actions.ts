'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { correctPublishedIngredientNameMysql } from '@/lib/mysql/published-ingredient-correction-db'
import { RECIPES_CACHE_TAG } from '@/lib/cache'
import { uuidSchema } from '@/lib/validation'

/** El formulario de corrección es deliberadamente acotado: no acepta cambios
 * de cantidades, publicación, URLs, medios, SEO ni otros idiomas.
 */
export async function correctPublishedIngredientAction(formData: FormData): Promise<never> {
  const group = uuidSchema.safeParse(formData.get('group'))
  const recipe = uuidSchema.safeParse(formData.get('recipe_id'))
  const language = formData.get('language')
  const positionValue = formData.get('ingredient_index')
  const expectedName = formData.get('expected_name')
  const nextName = formData.get('new_name')
  const expectedPreparation = formData.get('expected_preparation')
  const nextPreparation = formData.get('new_preparation')
  if (!group.success || !recipe.success || typeof language !== 'string' ||
      !['es','en','de','fr','it','ja','pt'].includes(language) ||
      typeof positionValue !== 'string' || !/^(0|[1-9]\d{0,2})$/.test(positionValue) ||
      typeof expectedName !== 'string' || typeof nextName !== 'string' ||
      typeof expectedPreparation !== 'string' || typeof nextPreparation !== 'string') {
    redirect('/admin')
  }
  const back = (kind: 'ok' | 'error', message: string): never => {
    const query = new URLSearchParams({ idioma: language, aviso: kind, mensaje: message })
    redirect('/admin/platos/' + group.data + '?' + query.toString() + '#ingredientes')
  }
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) back('error', 'Acceso administrativo no autorizado.')
  if (process.env.ADMIN_AUTH_PROVIDER !== 'mysql' || process.env.ADMIN_WRITE_PROVIDER !== 'mysql') {
    back('error', 'La edición MySQL aún no está habilitada.')
  }
  let outcome: 'updated' | 'unchanged'
  try {
    outcome = await correctPublishedIngredientNameMysql({
      recipeId: recipe.data, groupId: group.data, language,
      position: Number(positionValue), expectedName, expectedPreparation, nextName, nextPreparation,
    })
  } catch (error) {
    console.error('[admin/mysql] ingredient correction failed',
      error instanceof Error ? error.message : 'Error desconocido')
    back('error', 'No se pudo guardar. Si otra edición cambió el ingrediente, actualiza la ficha.')
  }
  if (outcome === 'updated') {
    revalidateTag(RECIPES_CACHE_TAG, 'max')
    revalidatePath('/admin/platos/' + group.data)
    revalidatePath('/admin/recetas/' + recipe.data)
  }
  back('ok', outcome === 'updated' ? 'Ingrediente corregido en MySQL. Comprueba la ficha pública.' : 'No había cambios que guardar.')
}
