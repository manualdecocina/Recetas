import { supabase } from '@/lib/supabase/public'
import type { RecipeLanguage } from '@/types/recipe'
import type { MdRecipeCardData } from '@/components/md/md-types'
import { arrangeCollection, collectionSpanishPaths, type Collection } from '@/lib/collections'

const CARD_FIELDS = 'id, language, slug, public_path, source_url, title, excerpt, category, image_url'

/** Recetas de una colección en el idioma pedido, ya repartidas por secciones. Solo publicadas. */
export async function loadCollectionRecipes(collection: Collection, lang: RecipeLanguage): Promise<MdRecipeCardData[][]> {
  const paths = collectionSpanishPaths(collection)
  const { data: spanish, error } = await supabase.from('recipes')
    .select('recipe_group_id, public_path').eq('language', 'es').eq('published', true).in('public_path', paths)
  if (error) throw new Error(`No se pudieron cargar las recetas de la colección: ${error.message}`)

  const groupBySpanishPath = new Map((spanish ?? []).map((r) => [r.public_path as string, r.recipe_group_id as string]))
  const groups = Array.from(new Set(groupBySpanishPath.values()))
  if (groups.length === 0) return collection.sections.map(() => [])

  const { data: localized, error: localizedError } = await supabase.from('recipes')
    .select(`${CARD_FIELDS}, recipe_group_id`).eq('language', lang).eq('published', true).in('recipe_group_id', groups)
  if (localizedError) throw new Error(`No se pudieron cargar las recetas de la colección: ${localizedError.message}`)

  const recipeByGroup = new Map((localized ?? []).map((r) => {
    const { recipe_group_id: group, ...card } = r as MdRecipeCardData & { recipe_group_id: string }
    return [group, card as MdRecipeCardData]
  }))
  return arrangeCollection(collection, groupBySpanishPath, recipeByGroup)
}

export interface CollectionSummary {
  collection: Collection
  count: number
  /** Foto real de la primera receta de la colección en ese idioma, o null. */
  image_url: string | null
}

export async function loadCollectionSummaries(collections: Collection[], lang: RecipeLanguage): Promise<CollectionSummary[]> {
  return Promise.all(collections.map(async (collection) => {
    const recipes = (await loadCollectionRecipes(collection, lang)).flat()
    return { collection, count: recipes.length, image_url: recipes.find((r) => r.image_url)?.image_url ?? null }
  }))
}
