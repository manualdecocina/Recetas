import { normalizeEditorialIngredientSections } from '@/lib/editorial-ingredient-sections'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { PUBLIC_REVALIDATE_SECONDS, RECIPES_CACHE_TAG } from '@/lib/cache'
import { rankRelated, recipeTechniques, type RelatedProfile } from '@/lib/related-recipes'
import { getPantryMatchData } from '@/lib/md-data'
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
    .select('*, recipe_ingredients(position, ingredients(name, slug, indexable))')
    .in('public_path', pathCandidates(path))
    .eq('published', true)
    .limit(1)
  if (error) throw new Error(`No se pudo cargar la receta pública: ${error.message}`)

  const row = ((data ?? [])[0] ?? null) as (Recipe & {
    recipe_ingredients?: Array<{
      position: number
      ingredients: { name: string; slug: string; indexable: boolean } | null
    }>
  }) | null
  if (!row) return null

  // Las URLs históricas también necesitan la relación canónica para sincronizar
  // las casillas con el inventario. Las cantidades y textos editoriales siguen
  // viniendo del JSON de la receta.
  const canonicalByPosition = new Map(
    (row.recipe_ingredients ?? []).map((link) => [Number(link.position), link.ingredients]),
  )
  const pantry = await getPantryMatchData(row.language)
  const pantryRecipe = pantry.recipes.find(r => r.id === row.id)
  const slugById = new Map(pantry.ingredients.map(i => [i.id, i.slug]))
  const ingredients = normalizeEditorialIngredientSections(row.ingredients, row.recipe_group_id, row.language).map((ingredient, index) => {
    const canonical = canonicalByPosition.get(index)
    const pantryIngredientSlug = slugById.get(pantryRecipe?.editorialIngredientIds?.[index] ?? '')
    return { ...ingredient, pantryIngredientSlug,
      ...(canonical?.indexable && canonical.slug ? { canonicalIngredientSlug: canonical.slug, canonicalIngredientName: canonical.name } : {}) }

  })
  const { recipe_ingredients: _links, ...recipeRow } = row
  return { ...recipeRow, ingredients } as Recipe
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
    .select('language, public_path, source_url')
    .eq('recipe_group_id', recipeGroupId)
    .eq('published', true)
    .order('language')
  if (error) throw new Error(`No se pudieron cargar las traducciones: ${error.message}`)
  return data ?? []
})


type RelatedRecipeCard = Pick<Recipe, 'id' | 'language' | 'slug' | 'public_path' | 'source_url' | 'title' | 'excerpt' | 'category' | 'image_url'>

const relatedProfiles = cache(unstable_cache(async (): Promise<RelatedProfile[]> => {
  const pantry = await getPantryMatchData('es')
  const rows: Array<{ id: string; recipe_group_id: string; title: string; steps: Recipe['steps']; total_time_minutes: number | null; prep_time_minutes: number | null; cook_time_minutes: number | null; category: string | null; cuisine: string | null }> = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('recipes')
      .select('id, recipe_group_id, title, steps, total_time_minutes, prep_time_minutes, cook_time_minutes, category, cuisine')
      .eq('published', true).eq('language', 'es').order('id').range(from, from + 999)
    if (error) throw new Error(`No se pudieron cargar las afinidades de recetas: ${error.message}`)
    rows.push(...(data ?? []))
    if (!data || data.length < 1000) break
  }
  const ingredients = new Map(pantry.recipes.map(r => [r.id, r.ingredientIds]))
  return rows.map(r => ({ id: r.id, group: r.recipe_group_id, ingredients: ingredients.get(r.id) ?? [], techniques: recipeTechniques(r.title, r.steps ?? []),
    minutes: r.total_time_minutes ?? (r.prep_time_minutes != null && r.cook_time_minutes != null ? r.prep_time_minutes + r.cook_time_minutes : null), category: r.category, cuisine: r.cuisine }))
}, ['related-profiles-v1'], { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [RECIPES_CACHE_TAG] }))

export const getRelatedRecipes = cache(async (recipe: Pick<Recipe, 'id' | 'language' | 'category' | 'cuisine'>): Promise<RelatedRecipeCard[]> => {
  const [profiles, pantry] = await Promise.all([relatedProfiles(), getPantryMatchData(recipe.language)])
  const current = pantry.recipes.find(r => r.id === recipe.id)
  const target = profiles.find(p => p.group === current?.recipe_group_id)
  const available = new Map(pantry.recipes.filter(r => r.id !== recipe.id).map(r => [r.recipe_group_id, r]))
  const groups = target ? rankRelated(target, profiles.filter(p => available.has(p.group) || p.group === target.group)) : [...available.keys()].sort().slice(0, 4)
  return groups.flatMap(group => {
    const row = available.get(group)
    if (!row) return []
    const { id, language, slug, public_path, source_url, title, excerpt, category, image_url } = row
    return [{ id, language, slug, public_path, source_url: source_url ?? null, title, excerpt, category, image_url }]
  })
})

/** Rutas públicas publicadas para prerenderizar las URLs históricas/localizadas conocidas.
 *  No cambia public_path ni inventa rutas; solo convierte las rutas ya publicadas en params
 *  estáticos de Next para reducir TTFB en el primer acceso. */
export const getPublishedPublicPaths = cache(async (): Promise<string[]> => {
  async function readPaths(table: 'recipes' | 'content_pages') {
    const rows: Array<{ public_path: string }> = []
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase.from(table).select('public_path')
        .eq('published', true).not('public_path', 'is', null).order('id').range(from, from + 999)
      if (error) throw new Error(`No se pudieron cargar rutas públicas: ${error.message}`)
      rows.push(...(data ?? []))
      if (!data || data.length < 1000) return rows
    }
  }
  const [recipes, pages] = await Promise.all([readPaths('recipes'), readPaths('content_pages')])

  const paths = [...(recipes ?? []), ...(pages ?? [])]
    .map((row) => normalizePublicPath(row.public_path as string))
    .filter((path) => path !== '/')

  return Array.from(new Set(paths)).sort()
})

/** Redirección registrada para una ruta legada (tabla content_redirects).
 *  status_code 301/308 = permanente; cualquier otro (302/307) = temporal, para URLs
 *  históricas cuya receta aún se está reconstruyendo y volverá a servirse en la misma ruta. */
export const getContentRedirect = cache(async (path: string): Promise<{ target_path: string; permanent: boolean } | null> => {
  const { data, error } = await supabase
    .from('content_redirects')
    .select('target_path, status_code')
    .in('source_path', pathCandidates(path))
    .limit(1)
  if (error) throw new Error(`No se pudo cargar la redirección: ${error.message}`)
  const row = ((data ?? [])[0] ?? null) as { target_path: string; status_code: number | null } | null
  if (!row?.target_path) return null
  return { target_path: row.target_path, permanent: row.status_code === 301 || row.status_code === 308 || row.status_code == null }
})
