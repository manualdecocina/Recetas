import { normalizeEditorialIngredientSections } from '@/lib/editorial-ingredient-sections'
import { cache } from 'react'
import { coalescePublicLoad } from '@/lib/public-fetch'
import { unstable_cache } from 'next/cache'
import { PUBLIC_REVALIDATE_SECONDS, RECIPES_CACHE_TAG } from '@/lib/cache'
import { supabase } from '@/lib/supabase/public'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import type { MdRecipeCardData } from '@/components/md/md-types'
import type { MdCategorySummary } from '@/components/md/CategoryViews'
import type { MdIngredientSummary } from '@/components/md/IngredientViews'
import type { MdHomeData } from '@/components/md/HomePageView'
import { CATEGORY_TAXONOMY } from '@/lib/categories'
import { consolidatePantryFoods, pantryIngredientRecipeIds } from '@/lib/pantry-foods'
import { ingredientImageSrc } from '@/lib/ingredient-photos'
import { featuredIngredients } from '@/lib/ingredient-discovery'
import { ingredientLabel } from '@/lib/ingredient-labels'
import { buildEditorialPantry, localizeEditorialIngredients, type PantryLink } from '@/lib/pantry-editorial'
import { localizePantryRecipes, pantryIngredientCoverage } from '@/lib/pantry-localization'
import { COLLECTIONS } from '@/lib/collections'
import { loadCollectionSummaries } from '@/lib/collections-data'

// Solo lectura, con el mismo cliente público y las mismas tablas/filtros que ya usan las
// demás rutas (recetas publicadas por idioma). No inventa datos: si no hay, devuelve vacío.
const CARD_FIELDS = 'id, language, slug, public_path, source_url, title, excerpt, category, image_url'

/** Una sola consulta: conteo real por categoría y una foto real de una receta de esa categoría.
 *  `category` se guarda traducido por idioma, así que la comparación usa la etiqueta de ese
 *  mismo idioma (CATEGORY_TAXONOMY) y no la española fija: si no, de/en/fr/it/ja/pt siempre
 *  daban 0 en todas las categorías aunque hubiera recetas publicadas y con categoría. */
export async function getCategorySummaries(lang: RecipeLanguage): Promise<MdCategorySummary[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('category, image_url')
    .eq('language', lang)
    .eq('published', true)
    .order('ready_at', { ascending: false, nullsFirst: false })
  if (error) throw new Error(`No se pudieron cargar las categorías: ${error.message}`)
  const rows = (data ?? []) as Array<{ category: string | null; image_url: string | null }>
  return CATEGORY_TAXONOMY.map(({ slug, labels }) => {
    const label = labels[lang]
    const inCategory = rows.filter((row) => row.category === label)
    return {
      slug,
      label,
      count: inCategory.length,
      image_url: inCategory.find((row) => row.image_url)?.image_url ?? null,
    }
  })
}

/** Canonical searchable ingredients with actual published-recipe counts. Search
 * discovery is independent of the per-ingredient SEO/indexable flag. Photographs
 * depict the ingredient itself and come from the reviewed, attributed photo catalog. */
const loadIngredientSummaries = cache(async (lang: RecipeLanguage): Promise<MdIngredientSummary[]> => {
  const [{ data, error }, pantry] = await Promise.all([
    supabase.from('ingredients').select('id, slug, name').eq('status', 'canonical').eq('searchable', true),
    getPantryMatchData(lang),
  ])
  if (error) throw new Error(`No se pudieron cargar los ingredientes: ${error.message}`)
  const summaries = (data ?? []).map((ingredient) => {
    const recipeIds = pantryIngredientRecipeIds(pantry, ingredient.id)
    const aliases = pantry.ingredients.find(item => item.id === ingredient.id || item.sourceIds?.includes(ingredient.id))?.aliases
    return { slug: ingredient.slug, name: ingredientLabel(ingredient.slug, ingredient.name, lang), count: recipeIds.length,
      image_url: ingredientImageSrc(ingredient.slug), aliases: aliases?.filter(alias => alias !== ingredient.slug) }
  }).sort((a, b) => a.name.localeCompare(b.name, lang))
  return summaries.filter(item => item.count > 0)
})

export async function getIngredientSummaries(limit?: number, lang: RecipeLanguage = 'es'): Promise<MdIngredientSummary[]> {
  const ingredients = await loadIngredientSummaries(lang)
  return limit ? featuredIngredients(ingredients, limit) : ingredients
}

export async function getHomeData(lang: RecipeLanguage): Promise<MdHomeData> {
  const [featuredResult, latestResult, categories, ingredients, collections] = await Promise.all([
    // Destacada: la receta publicada actualizada más recientemente que tenga foto real.
    supabase
      .from('recipes')
      .select(CARD_FIELDS)
      .eq('language', lang)
      .eq('published', true)
      .not('image_url', 'is', null)
      .order('ready_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('recipes')
      .select(CARD_FIELDS)
      .eq('language', lang)
      .eq('published', true)
      .order('ready_at', { ascending: false, nullsFirst: false })
      .limit(10),
    getCategorySummaries(lang),
    getIngredientSummaries(12, lang),
    loadCollectionSummaries(COLLECTIONS, lang),
  ])
  if (featuredResult.error) throw new Error(`No se pudo cargar la receta destacada: ${featuredResult.error.message}`)
  if (latestResult.error) throw new Error(`No se pudieron cargar las últimas recetas: ${latestResult.error.message}`)

  const featured = (featuredResult.data ?? null) as MdRecipeCardData | null
  const latestRaw = (latestResult.data ?? []) as MdRecipeCardData[]
  // La destacada ya se muestra en el hero; las otras nueve conservan su orden editorial.
  const latest = latestRaw.filter((recipe) => recipe.id !== featured?.id).slice(0, 9)

  return { featured, latest, categories, ingredients, collections: collections.filter((item) => item.count > 0) }
}

export interface MdPantryIngredient {
  id: string;
  slug: string;
  name: string;
  aliases?: string[];
  /** Original identities retained when equivalent pantry choices are consolidated. */
  sourceIds?: string[];
}

export interface MdPantryRecipe extends MdRecipeCardData {
  recipe_group_id: string;
  /** Verified taxonomy IDs or stable identities from exact editorial ingredient names. */
  ingredientIds: string[];
  /** total de ingredientes editoriales reales de la receta. */
  totalIngredients: number;
  /** Selectable editorial positions (legacy field name retained for compatibility). */
  totalCanonicalIngredients: number;
  /** Editorial positions without a selectable, named identity. */
  uncanonicalizedCount: number;
  editorialIngredients?: unknown[] | null;
  editorialIngredientIds?: string[];
}

/**
 * Datos para "¿Qué puedo cocinar?": solo ingredientes canónicos
 * buscables que realmente estén relacionados con al menos una receta ES publicada, y
 * todas las recetas publicadas y todos sus ingredientes editoriales. El emparejamiento real
 * (qué receta calza con qué ingredientes elegidos) se calcula en el cliente sobre estos
 * datos; aquí solo se leen datos reales, sin inventar coincidencias ni opciones huérfanas.
 */
// Cache the computed public graph as well as its upstream reads. Ingredient
// landings and recipe checklists reuse it; all publication paths invalidate recipes.
type PantryData = { ingredients: MdPantryIngredient[]; recipes: MdPantryRecipe[] }
const pantryPending = new Map<RecipeLanguage, Promise<PantryData>>()
async function loadPantryMatchData(lang: RecipeLanguage): Promise<PantryData> {
  if (lang !== 'es') {
    const [source, { data, error }] = await Promise.all([
      getPantryMatchData('es'),
      supabase.from('recipes').select(`${CARD_FIELDS}, recipe_group_id, ingredients`).eq('language', lang).eq('published', true),
    ])
    if (error) throw new Error(`No se pudieron cargar las traducciones: ${error.message}`)
    const translations = (data ?? []).map(r => ({ ...r, ingredients: normalizeEditorialIngredientSections(r.ingredients ?? [], r.recipe_group_id, lang) })) as Array<MdRecipeCardData & { recipe_group_id: string; ingredients?: unknown[] | null }>
    const localizedRecipes = localizePantryRecipes(source.recipes, translations)
    const translationById = new Map(translations.map(r => [r.id, r]))
    const localChoices: MdPantryIngredient[] = []
    const recipes = localizedRecipes.map(recipe => {
      const translated = translationById.get(recipe.id)
      if (translated?.ingredients?.length === recipe.totalIngredients) return { ...recipe, editorialIngredients: translated.ingredients }
      // Some localized recipes have a different formulation. Their actual list takes
      // precedence over a positional join to the Spanish source.
      const actual = buildEditorialPantry([{ id: recipe.id, ingredients: translated?.ingredients }], [], [])
      localChoices.push(...actual.ingredients)
      const ids = actual.requirements.get(recipe.id) ?? []
      return { ...recipe, ...pantryIngredientCoverage(ids, translated?.ingredients?.length ?? 0),
        editorialIngredients: translated?.ingredients, editorialIngredientIds: ids }
    })
    const usedIds = new Set(recipes.flatMap((recipe) => recipe.ingredientIds))
    const localized = localizeEditorialIngredients(source.ingredients, source.recipes.map(r => ({ id: r.id, recipe_group_id: r.recipe_group_id, ingredients: r.editorialIngredients })), translations, new Map(source.recipes.map(r => [r.id, r.editorialIngredientIds ?? []])))
    const ingredientMap = new Map([...localized, ...localChoices].filter(i => usedIds.has(i.id)).map(i => [i.id, i]))
    const ingredients = [...ingredientMap.values()]
      .map((ingredient) => ({ ...ingredient, name: ingredientLabel(ingredient.slug, ingredient.name, lang) }))
      .sort((a, b) => a.name.localeCompare(b.name, lang))

    return consolidatePantryFoods(ingredients, recipes, lang)
  }
  const { data: ingredientRows, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('id, slug, name')
    .eq('status', 'canonical')
    .eq('searchable', true)
    .order('name', { ascending: true })
  if (ingredientsError) throw new Error(`No se pudieron cargar los ingredientes: ${ingredientsError.message}`)

  const { data: recipeRows, error: recipesError } = await supabase
    .from('recipes')
    .select(`${CARD_FIELDS}, recipe_group_id, ingredients`)
    .eq('language', 'es')
    .eq('published', true)
  if (recipesError) throw new Error(`No se pudieron cargar las recetas: ${recipesError.message}`)

  const recipeRowsTyped = (recipeRows ?? []).map(r => ({ ...r, ingredients: normalizeEditorialIngredientSections(r.ingredients ?? [], r.recipe_group_id, 'es') })) as Array<MdRecipeCardData & { recipe_group_id: string; ingredients?: unknown[] | null }>
  const recipes = recipeRowsTyped.map(({ ingredients: _ingredients, ...recipe }) => recipe)
  if (!recipes.length) return { ingredients: [], recipes: [] }

  const recipeIds = recipes.map((r) => r.id)
  // The graph exceeds PostgREST's default 1000-row cap; read every page.
  const linkRows: PantryLink[] = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('recipe_ingredients')
      .select('recipe_id, ingredient_id, position').in('recipe_id', recipeIds)
      .order('id').range(from, from + 999)
    if (error) throw new Error(`No se pudieron cargar los ingredientes de las recetas: ${error.message}`)
    linkRows.push(...(data ?? []))
    if (!data || data.length < 1000) break
  }

  const complete = buildEditorialPantry(recipeRowsTyped, (ingredientRows ?? []) as MdPantryIngredient[], linkRows)
  const pantryRecipes: MdPantryRecipe[] = recipes.map((recipe) => {
    const source = recipeRowsTyped.find(row => row.id === recipe.id)!
    const ids = complete.requirements.get(recipe.id) ?? []
    return { ...recipe, ...pantryIngredientCoverage(ids, source.ingredients?.length ?? 0),
      editorialIngredients: source.ingredients, editorialIngredientIds: ids }
  })
  const pantryIngredients = complete.ingredients.sort((a, b) => a.name.localeCompare(b.name, lang))

  return consolidatePantryFoods(pantryIngredients, pantryRecipes, lang)
}
export const getPantryMatchData = cache(unstable_cache(
  (lang: RecipeLanguage = 'es') => coalescePublicLoad(pantryPending, lang, () => loadPantryMatchData(lang)),
  ['public-pantry-graph-v5'], { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [RECIPES_CACHE_TAG] },
))

/** Cuisine discovery follows the Spanish editorial origin shared by all seven
 * translations. Existing taxonomy links remain additional reviewed evidence. */
export const getCuisineDiscoveryRows = cache(unstable_cache(async (): Promise<Array<{ recipe_group_id: string; cuisine: string | null }>> => {
  const rows: Array<{ recipe_group_id: string; cuisine: string | null }> = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('recipes').select('recipe_group_id, cuisine')
      .eq('published', true).eq('language', 'es').order('id').range(from, from + 999)
    if (error) throw new Error(`No se pudieron cargar las cocinas publicadas: ${error.message}`)
    rows.push(...(data ?? []))
    if (!data || data.length < 1000) return rows
  }
}, ['published-cuisine-discovery-v1'], { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [RECIPES_CACHE_TAG] }))

/** Idiomas que tienen al menos una receta publicada (los demás se muestran deshabilitados en el selector). */
export async function getAvailableLanguages(): Promise<RecipeLanguage[]> {
  // PostgREST caps a response at 1,000 rows even with limit(2000). Checking
  // existence per language keeps later languages visible as the catalog grows.
  const available = await Promise.all(SUPPORTED_LANGUAGES.map(async (language) => {
    const { data, error } = await supabase
      .from('recipes')
      .select('language')
      .eq('published', true)
      .eq('language', language)
      .limit(1)
    return !error && data?.length ? language : null
  }))
  return available.filter((language): language is RecipeLanguage => language !== null)
}
