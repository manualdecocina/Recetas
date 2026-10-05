'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { PostgrestError } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { languageSchema, readRecipeForm, uuidSchema, type RecipeFields } from '@/lib/validation'
import { RECIPES_CACHE_TAG } from '@/lib/cache'
import type { FormState } from './form-state'

// ---------- Sesión ----------

const loginSchema = z.object({
  email: z.string().trim().email('Email no válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export async function signInAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) {
    // Mensaje genérico a propósito: no revelar si el email existe.
    return { ok: false, message: 'Email o contraseña incorrectos.' }
  }
  redirect('/admin')
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

// ---------- Utilidades ----------

function toRpcParams(fields: RecipeFields) {
  return {
    p_slug: fields.slug,
    p_public_path: fields.public_path ?? null,
    p_title: fields.title,
    p_excerpt: fields.excerpt ?? null,
    p_ingredients: fields.ingredients,
    p_steps: fields.steps,
    p_category: fields.category ?? null,
    p_prep_time_minutes: fields.prep_time_minutes ?? null,
    p_cook_time_minutes: fields.cook_time_minutes ?? null,
    p_servings: fields.servings ?? null,
    p_image_url: fields.image_url ?? null,
    p_published: fields.published,
  }
}

function dbErrorMessage(error: PostgrestError): string {
  if (error.code === '23505') {
    if (error.message.includes('recipes_group_language_key')) {
      return 'Esta receta ya tiene una versión en ese idioma.'
    }
    return 'Ya existe una receta con ese slug en este idioma.'
  }
  if (error.code === 'P0001') return error.message // mensajes propios de las funciones SQL
  console.error('[admin] error de base de datos', error.code, error.message)
  return 'No se pudo guardar. Revisa los datos e inténtalo de nuevo.'
}

// Invalidación de caché tras cualquier escritura. Ver docs/cache.md.
// Todas las lecturas públicas de recetas (home, listados, detalle, traducciones para
// hreflang, sitemap) se hacen con fetch etiquetado RECIPES_CACHE_TAG. revalidateTag
// marca como obsoletas esas entradas del Data Cache y las páginas/rutas que las usaron;
// se regeneran en la siguiente visita. En una Server Action también limpia el Router
// Cache del navegador del administrador.
function revalidatePublicRecipes() {
  revalidateTag(RECIPES_CACHE_TAG, 'max')
}

const NOT_ADMIN: FormState = { ok: false, message: 'Tu usuario no tiene permisos de administrador.' }

function draftOnlyMessage(): FormState {
  return {
    ok: false,
    message: 'Este formulario básico no puede publicar una receta nueva o una traducción directamente. Créala como borrador y completa primero summary, course, cuisine, difficulty, nutrition, SEO, imágenes y demás campos editoriales obligatorios.',
  }
}

function publicationGaps(row: Record<string, any>): string[] {
  const gaps: string[] = []
  const requiredText = ['excerpt', 'summary', 'category', 'difficulty', 'course', 'cuisine', 'image_url', 'public_path']
  for (const key of requiredText) if (!String(row[key] ?? '').trim()) gaps.push(key)
  if (!Array.isArray(row.ingredients) || row.ingredients.length === 0) gaps.push('ingredients')
  if (!Array.isArray(row.steps) || row.steps.length === 0) gaps.push('steps')
  if (!row.nutrition || typeof row.nutrition !== 'object' || Object.keys(row.nutrition).length === 0) gaps.push('nutrition')
  if (!row.seo || typeof row.seo !== 'object' || !String(row.seo.title ?? '').trim() || !String(row.seo.description ?? '').trim()) gaps.push('seo')
  if (!Number.isFinite(row.total_time_minutes) || row.total_time_minutes < 0) gaps.push('total_time_minutes')
  if (!Number.isFinite(row.servings) || row.servings <= 0) gaps.push('servings')
  return gaps
}

// ---------- Crear plato nuevo (genera recipe_group_id en la base de datos) ----------

export async function createRecipeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, isAdmin } = await requireAdmin()
  if (!isAdmin) return NOT_ADMIN

  const language = languageSchema.safeParse(formData.get('language'))
  if (!language.success) return { ok: false, fieldErrors: { language: ['Idioma no válido'] } }

  const fields = readRecipeForm(formData, language.data)
  if (!fields.success) return { ok: false, fieldErrors: fields.error.flatten().fieldErrors }
  if (fields.data.published) return draftOnlyMessage()

  const { error } = await supabase.rpc('create_recipe', {
    p_language: language.data,
    ...toRpcParams(fields.data),
  })
  if (error) return { ok: false, message: dbErrorMessage(error) }

  revalidatePublicRecipes()
  redirect('/admin')
}

// ---------- Crear traducción ----------
// El formulario envía el id de la receta ORIGEN. La RPC create_recipe_translation
// resuelve el recipe_group_id dentro de la base de datos: ni el cliente ni esta
// Server Action leen ni envían el grupo.

export async function createTranslationAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, isAdmin } = await requireAdmin()
  if (!isAdmin) return NOT_ADMIN

  const sourceId = uuidSchema.safeParse(formData.get('source_id'))
  if (!sourceId.success) return { ok: false, message: 'Receta de origen no válida.' }

  const language = languageSchema.safeParse(formData.get('language'))
  if (!language.success) return { ok: false, fieldErrors: { language: ['Idioma no válido'] } }

  const fields = readRecipeForm(formData, language.data)
  if (!fields.success) return { ok: false, fieldErrors: fields.error.flatten().fieldErrors }
  if (fields.data.published) return draftOnlyMessage()

  const { error } = await supabase.rpc('create_recipe_translation', {
    p_source_recipe_id: sourceId.data,
    p_language: language.data,
    ...toRpcParams(fields.data),
  })
  if (error) return { ok: false, message: dbErrorMessage(error) }

  revalidatePublicRecipes()
  redirect('/admin')
}

// ---------- Editar (no cambia idioma, grupo ni published_at) ----------

export async function updateRecipeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase, isAdmin } = await requireAdmin()
  if (!isAdmin) return NOT_ADMIN

  const id = uuidSchema.safeParse(formData.get('id'))
  if (!id.success) return { ok: false, message: 'Receta no válida.' }

  const { data: identity } = await supabase.from('recipes').select('language').eq('id', id.data).maybeSingle()
  const language = languageSchema.safeParse(identity?.language)
  if (!language.success) return { ok: false, message: 'No se pudo comprobar el idioma de la receta.' }
  const fields = readRecipeForm(formData, language.data)
  if (!fields.success) return { ok: false, fieldErrors: fields.error.flatten().fieldErrors }

  if (fields.data.published) {
    const { data: current, error: currentError } = await supabase
      .from('recipes')
      .select('excerpt, summary, category, difficulty, course, cuisine, image_url, public_path, ingredients, steps, nutrition, seo, total_time_minutes, servings')
      .eq('id', id.data)
      .maybeSingle()
    if (currentError || !current) return { ok: false, message: 'No se pudo validar el gate editorial antes de publicar.' }

    const candidate = {
      ...current,
      excerpt: fields.data.excerpt ?? current.excerpt,
      category: fields.data.category ?? current.category,
      image_url: fields.data.image_url ?? current.image_url,
      ingredients: fields.data.ingredients,
      steps: fields.data.steps,
      servings: fields.data.servings ?? current.servings,
    }
    const gaps = publicationGaps(candidate)
    if (gaps.length) {
      return {
        ok: false,
        message: `No se puede publicar todavía. Faltan campos editoriales obligatorios: ${gaps.join(', ')}.`,
      }
    }
  }

  const updateParams = toRpcParams(fields.data)
  delete (updateParams as Record<string, unknown>).p_public_path
  const { error } = await supabase.rpc('update_recipe', {
    p_id: id.data,
    ...updateParams,
  })
  if (error) return { ok: false, message: dbErrorMessage(error) }

  revalidatePublicRecipes()
  redirect('/admin')
}

// ---------- Eliminar (protegido por RLS: solo admin) ----------

export async function deleteRecipeAction(formData: FormData) {
  const { supabase, isAdmin } = await requireAdmin()
  if (!isAdmin) redirect('/admin')

  const id = uuidSchema.safeParse(formData.get('id'))
  if (!id.success) redirect('/admin')

  const { error } = await supabase.from('recipes').delete().eq('id', id.data)
  if (error) console.error('[admin] no se pudo eliminar', error.code, error.message)

  revalidatePublicRecipes()
  redirect('/admin')
}
