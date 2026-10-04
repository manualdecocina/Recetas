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


type RelatedRecipeCard = Pick<Recipe, 'id' | 'language' | 'slug' | 'public_path' | 'title' | 'excerpt' | 'category' | 'image_url'>

export const getRelatedRecipes = cache(async (recipe: Pick<Recipe, 'id' | 'language' | 'category' | 'cuisine'>): Promise<RelatedRecipeCard[]> => {
  const selected: RelatedRecipeCard[] = []
  const seen = new Set<string>()

  // Una categoría puede tener una sola receta publicada. Completar con la misma cocina
  // y luego con recetas recientes evita dejar sin enlaces las URLs históricas.
  async function collect(filter?: { column: 'category' | 'cuisine'; value: string }) {
    let query = supabase.from('recipes')
      .select('id, language, slug, public_path, title, excerpt, category, image_url')
      .eq('language', recipe.language)
      .eq('published', true)
      .neq('id', recipe.id)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('title', { ascending: true })
      .order('id', { ascending: true })
    if (filter) query = query.eq(filter.column, filter.value)
    const { data, error } = await query.limit(filter ? 4 : 8)
    if (error) throw new Error(`No se pudieron cargar recetas relacionadas: ${error.message}`)
    for (const row of data ?? []) {
      if (selected.length === 4) break
      if (seen.has(row.id)) continue
      selected.push(row as RelatedRecipeCard)
      seen.add(row.id)
    }
  }

  if (recipe.category) await collect({ column: 'category', value: recipe.category })
  if (selected.length < 4 && recipe.cuisine) await collect({ column: 'cuisine', value: recipe.cuisine })
  if (selected.length < 4) await collect()
  return selected
})

/** Rutas públicas publicadas para prerenderizar las URLs históricas/localizadas conocidas.
 *  No cambia public_path ni inventa rutas; solo convierte las rutas ya publicadas en params
 *  estáticos de Next para reducir TTFB en el primer acceso. */
export const getPublishedPublicPaths = cache(async (): Promise<string[]> => {
  const [{ data: recipes, error: recipesError }, { data: pages, error: pagesError }] = await Promise.all([
    supabase.from('recipes').select('public_path').eq('published', true).not('public_path', 'is', null),
    supabase.from('content_pages').select('public_path').eq('published', true).not('public_path', 'is', null),
  ])
  if (recipesError) throw new Error(`No se pudieron cargar rutas públicas de recetas: ${recipesError.message}`)
  if (pagesError) throw new Error(`No se pudieron cargar rutas públicas de contenido: ${pagesError.message}`)

  const paths = [...(recipes ?? []), ...(pages ?? [])]
    .map((row) => normalizePublicPath(row.public_path as string))
    .filter((path) => path !== '/')

  return Array.from(new Set(paths)).sort()
})
