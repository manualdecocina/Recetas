import { cache } from 'react'
import { supabase } from '@/lib/supabase/public'
import { normalizePublicPath } from '@/lib/site'
import type { Recipe } from '@/types/recipe'

export interface ContentPage {
  id: string
  language: string
  slug: string
  public_path: string
  title: string
  excerpt: string | null
  content_html: string | null
  featured_image_url: string | null
  seo?: Record<string, unknown> | null
  published: boolean
  published_at: string | null
  updated_at: string
}

/** Variantes equivalentes de una ruta: con/sin barra final y con/sin codificación (%E3…). */
export function pathCandidates(path: string): string[] {
  const base = normalizePublicPath(path)
  const variants = new Set<string>()
  const add = (p: string) => { variants.add(p); variants.add(p + '/') }
  add(base)
  try { add(normalizePublicPath(decodeURI(base))) } catch { /* ruta mal codificada: se ignora */ }
  try { add(normalizePublicPath(encodeURI(decodeURI(base)))) } catch { /* idem */ }
  return Array.from(variants)
}

export const getRecipeByPublicPath = cache(async (path: string): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .in('public_path', pathCandidates(path))
    .eq('published', true)
    .limit(1)
  if (error) throw new Error(`No se pudo cargar la receta pública: ${error.message}`)
  return ((data ?? [])[0] ?? null) as Recipe | null
})

export const getContentPageByPublicPath = cache(async (path: string): Promise<ContentPage | null> => {
  const { data, error } = await supabase
    .from('content_pages')
    .select('*')
    .in('public_path', pathCandidates(path))
    .eq('published', true)
    .limit(1)
  if (error) throw new Error(`No se pudo cargar la página pública: ${error.message}`)
  return ((data ?? [])[0] ?? null) as ContentPage | null
})

export const getRecipeTranslations = cache(async (recipeGroupId: string) => {
  const { data, error } = await supabase
    .from('recipes')
    .select('language, public_path')
    .eq('recipe_group_id', recipeGroupId)
    .eq('published', true)
    .order('language')
  if (error) throw new Error(`No se pudieron cargar las traducciones: ${error.message}`)
  return data ?? []
})
