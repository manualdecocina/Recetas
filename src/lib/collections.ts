import type { RecipeLanguage } from '@/types/recipe'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'
import { normalizePublicPath } from '@/lib/site'
import { COLLECTIONS, type Collection, type CollectionText } from '@/lib/collections-content'

/** Lógica pura de colecciones (sin red): búsqueda por slug, rutas y orden de recetas. */

export const COLLECTIONS_SEGMENT = 'colecciones'

export function collectionsIndexPath(lang: string): string {
  return `/${lang}/${COLLECTIONS_SEGMENT}`
}

export function collectionPath(lang: RecipeLanguage, collection: Collection): string {
  return `${collectionsIndexPath(lang)}/${collection.text[lang].slug}`
}

function safeDecode(value: string): string {
  try { return decodeURIComponent(value) } catch { return value }
}

/** La colección cuyo slug en ESTE idioma coincide (el parámetro puede llegar codificado). */
export function findCollection(lang: RecipeLanguage, slug: string, list: Collection[] = COLLECTIONS): Collection | null {
  const wanted = safeDecode(slug).normalize('NFC')
  return list.find((c) => c.text[lang].slug.normalize('NFC') === wanted) ?? null
}

/** Ruta de la misma colección en cada idioma (para hreflang y el selector de idioma). */
export function collectionAlternatePaths(collection: Collection): Record<RecipeLanguage, string> {
  return Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, collectionPath(l, collection)])) as Record<RecipeLanguage, string>
}

export function collectionText(collection: Collection, lang: RecipeLanguage): CollectionText {
  return collection.text[lang]
}

/** Todas las rutas en español citadas por la colección, sin repetir y en orden. */
export function collectionSpanishPaths(collection: Collection): string[] {
  return Array.from(new Set(collection.sections.flat().map(normalizePublicPath)))
}

/**
 * Reparte las recetas ya cargadas en las secciones de la colección, en el orden editorial.
 * `groupBySpanishPath`: ruta española → recipe_group_id. `recipeByGroup`: grupo → receta del
 * idioma pedido. Una receta que falte en ese idioma simplemente no se muestra (nunca se
 * rellena con otro idioma).
 */
export function arrangeCollection<T>(
  collection: Collection,
  groupBySpanishPath: Map<string, string>,
  recipeByGroup: Map<string, T>,
): T[][] {
  return collection.sections.map((paths) => paths
    .map((path) => groupBySpanishPath.get(normalizePublicPath(path)))
    .map((group) => (group ? recipeByGroup.get(group) : undefined))
    .filter((recipe): recipe is T => recipe !== undefined))
}

export { COLLECTIONS }
export type { Collection, CollectionText }
