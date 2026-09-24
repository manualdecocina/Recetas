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

export const getRecipeByPublicPath = cache(async (path: string): Promise<Recipe | null> => {
  const publicPath = normalizePublicPath(path)
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('public_path', publicPath)
    .eq('published', true)
    .maybeSingle()
  if (error) throw new Error(`No se pudo cargar la receta pública: ${error.message}`)
  return data as Recipe | null
})

export const getContentPageByPublicPath = cache(async (path: string): Promise<ContentPage | null> => {
  const publicPath = normalizePublicPath(path)
  const { data, error } = await supabase
    .from('content_pages')
    .select('*')
    .eq('public_path', publicPath)
    .eq('published', true)
    .maybeSingle()
  if (error) throw new Error(`No se pudo cargar la página pública: ${error.message}`)
  return data as ContentPage | null
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
