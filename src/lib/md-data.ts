import { supabase } from '@/lib/supabase/public'
import type { RecipeLanguage } from '@/types/recipe'
import type { MdRecipeCardData } from '@/components/md/md-types'
import type { MdCategorySummary } from '@/components/md/CategoryViews'
import type { MdIngredientSummary } from '@/components/md/IngredientViews'
import type { MdHomeData } from '@/components/md/HomePageView'
import { CATEGORY_TAXONOMY } from '@/lib/categories'
import { ingredientLabel } from '@/lib/ingredient-labels'
import { localizePantryRecipes } from '@/lib/pantry-localization'

// Solo lectura, con el mismo cliente público y las mismas tablas/filtros que ya usan las
// demás rutas (recetas publicadas por idioma). No inventa datos: si no hay, devuelve vacío.
const CARD_FIELDS = 'id, language, slug, public_path, title, excerpt, category, image_url'

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

/**
 * Ingredientes canónicos indexables (los mismos que lista /es/ingredientes), con conteo
 * real de recetas publicadas y una foto real de una de esas recetas (nunca inventada;
 * mismo criterio que getCategorySummaries). Sin recetas asociadas, count queda en 0 y el
 * llamador decide si lo muestra o no (la página lo filtra, igual que categorías).
 */
export async function getIngredientSummaries(limit?: number, lang: RecipeLanguage = 'es'): Promise<MdIngredientSummary[]> {
  if (lang !== 'es') {
    const [{ data, error }, pantry] = await Promise.all([
      supabase.from('ingredients').select('id, slug, name').eq('status', 'canonical').eq('indexable', true),
      getPantryMatchData(lang),
    ])
    if (error) throw new Error(`No se pudieron cargar los ingredientes: ${error.message}`)
    const summaries = (data ?? []).map((ingredient) => {
      const recipes = pantry.recipes.filter((recipe) => recipe.ingredientIds.includes(ingredient.id))
      return { slug: ingredient.slug, name: ingredientLabel(ingredient.slug, ingredient.name, lang), count: recipes.length,
        image_url: recipes.find((recipe) => recipe.image_url)?.image_url ?? null }
    }).sort((a, b) => a.name.localeCompare(b.name, lang))
    return limit ? summaries.slice(0, limit) : summaries
  }
  let query = supabase
    .from('ingredients')
    .select('id, slug, name')
    .eq('status', 'canonical')
    .eq('indexable', true)
    .order('name', { ascending: true })
  if (limit) query = query.limit(limit)
  const { data: ingredientRows, error } = await query
  if (error) throw new Error(`No se pudieron cargar los ingredientes: ${error.message}`)
  const ingredients = (ingredientRows ?? []) as Array<{ id: string; slug: string; name: string }>
  if (!ingredients.length) return []

  const { data: linkRowsRaw, error: linksError } = await supabase
    .from('recipe_ingredients')
    .select('ingredient_id, recipe_id')
    .in('ingredient_id', ingredients.map((i) => i.id))
  if (linksError) throw new Error(`No se pudieron cargar las relaciones de ingredientes: ${linksError.message}`)
  const linkRows = (linkRowsRaw ?? []) as Array<{ ingredient_id: string; recipe_id: string }>

  const recipeIds = [...new Set(linkRows.map((row) => row.recipe_id))]
  let recipeRows: Array<{ id: string; image_url: string | null }> = []
  if (recipeIds.length) {
    const { data, error: recipesError } = await supabase
      .from('recipes')
      .select('id, image_url')
      .eq('language', 'es')
      .eq('published', true)
      .in('id', recipeIds)
    if (recipesError) throw new Error(`No se pudieron cargar las recetas de los ingredientes: ${recipesError.message}`)
    recipeRows = (data ?? []) as Array<{ id: string; image_url: string | null }>
  }

  const imageByRecipeId = new Map(recipeRows.map((r) => [r.id, r.image_url]))
  const statsByIngredient = new Map<string, { count: number; image_url: string | null }>()
  for (const row of linkRows) {
    if (!imageByRecipeId.has(row.recipe_id)) continue
    const current = statsByIngredient.get(row.ingredient_id) ?? { count: 0, image_url: null }
    current.count += 1
    if (!current.image_url) current.image_url = imageByRecipeId.get(row.recipe_id) ?? null
    statsByIngredient.set(row.ingredient_id, current)
  }

  return ingredients.map((ingredient) => ({
    slug: ingredient.slug,
    name: ingredient.name,
    count: statsByIngredient.get(ingredient.id)?.count ?? 0,
    image_url: statsByIngredient.get(ingredient.id)?.image_url ?? null,
  }))
}

export async function getHomeData(lang: RecipeLanguage): Promise<MdHomeData> {
  const [featuredResult, latestResult, categories, ingredients] = await Promise.all([
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
  ])
  if (featuredResult.error) throw new Error(`No se pudo cargar la receta destacada: ${featuredResult.error.message}`)
  if (latestResult.error) throw new Error(`No se pudieron cargar las últimas recetas: ${latestResult.error.message}`)

  const featured = (featuredResult.data ?? null) as MdRecipeCardData | null
  const latestRaw = (latestResult.data ?? []) as MdRecipeCardData[]
  // La destacada ya se muestra en el hero; las otras nueve conservan su orden editorial.
  const latest = latestRaw.filter((recipe) => recipe.id !== featured?.id).slice(0, 9)

  return { featured, latest, categories, ingredients }
}

export interface MdPantryIngredient {
  id: string;
  slug: string;
  name: string;
}

export interface MdPantryRecipe extends MdRecipeCardData {
  recipe_group_id: string;
  /** ids canónicos reales de recipe_ingredients; nunca inventados. */
  ingredientIds: string[];
  /** total de ingredientes editoriales reales de la receta. */
  totalIngredients: number;
  /** total de ingredientes de esa receta que sí están canonicalizados. */
  totalCanonicalIngredients: number;
  /** ingredientes editoriales que todavía no tienen relación canónica segura. */
  uncanonicalizedCount: number;
}

/**
 * Datos para "¿Qué puedo cocinar?": solo ingredientes canónicos
 * buscables que realmente estén relacionados con al menos una receta ES publicada, y
 * recetas publicadas que ya tengan ingredientes canonicalizados. El emparejamiento real
 * (qué receta calza con qué ingredientes elegidos) se calcula en el cliente sobre estos
 * datos; aquí solo se leen datos reales, sin inventar coincidencias ni opciones huérfanas.
 */
export async function getPantryMatchData(lang: RecipeLanguage = 'es'): Promise<{ ingredients: MdPantryIngredient[]; recipes: MdPantryRecipe[] }> {
  if (lang !== 'es') {
    const [source, { data, error }] = await Promise.all([
      getPantryMatchData('es'),
      supabase.from('recipes').select(`${CARD_FIELDS}, recipe_group_id`).eq('language', lang).eq('published', true),
    ])
    if (error) throw new Error(`No se pudieron cargar las traducciones: ${error.message}`)
    const recipes = localizePantryRecipes(source.recipes, (data ?? []) as Array<MdRecipeCardData & { recipe_group_id: string }>)
    const usedIds = new Set(recipes.flatMap((recipe) => recipe.ingredientIds))
    const ingredients = source.ingredients.filter((ingredient) => usedIds.has(ingredient.id))
      .map((ingredient) => ({ ...ingredient, name: ingredientLabel(ingredient.slug, ingredient.name, lang) }))
      .sort((a, b) => a.name.localeCompare(b.name, lang))
    return { recipes, ingredients }
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

  const recipeRowsTyped = (recipeRows ?? []) as Array<MdRecipeCardData & { recipe_group_id: string; ingredients?: unknown[] | null }>
  const recipes = recipeRowsTyped.map(({ ingredients: _ingredients, ...recipe }) => recipe)
  if (!recipes.length) return { ingredients: [], recipes: [] }

  const recipeIds = recipes.map((r) => r.id)
  // The graph exceeds PostgREST's default 1000-row cap; read every page.
  const linkRows: Array<{ recipe_id: string; ingredient_id: string }> = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('recipe_ingredients')
      .select('recipe_id, ingredient_id').in('recipe_id', recipeIds)
      .order('id').range(from, from + 999)
    if (error) throw new Error(`No se pudieron cargar los ingredientes de las recetas: ${error.message}`)
    linkRows.push(...(data ?? []))
    if (!data || data.length < 1000) break
  }

  const idsByRecipe = new Map<string, string[]>()
  for (const row of (linkRows ?? []) as Array<{ recipe_id: string; ingredient_id: string }>) {
    const list = idsByRecipe.get(row.recipe_id)
    if (list) list.push(row.ingredient_id)
    else idsByRecipe.set(row.recipe_id, [row.ingredient_id])
  }

  const totalIngredientsByRecipe = new Map(
    recipeRowsTyped.map((row) => [row.id, Array.isArray(row.ingredients) ? row.ingredients.length : 0]),
  )

  const pantryRecipes: MdPantryRecipe[] = recipes
    .map((recipe) => {
      const ingredientIds = idsByRecipe.get(recipe.id) ?? []
      const totalIngredients = totalIngredientsByRecipe.get(recipe.id) ?? 0
      return {
        ...recipe,
        ingredientIds,
        totalIngredients,
        totalCanonicalIngredients: ingredientIds.length,
        uncanonicalizedCount: Math.max(0, totalIngredients - ingredientIds.length),
      }
    })
    .filter((recipe) => recipe.totalCanonicalIngredients > 0)

  const usedIngredientIds = new Set((linkRows ?? []).map((row: { ingredient_id: string }) => row.ingredient_id))
  const pantryIngredients = ((ingredientRows ?? []) as MdPantryIngredient[])
    .filter((ingredient) => usedIngredientIds.has(ingredient.id))

  return { ingredients: pantryIngredients, recipes: pantryRecipes }
}

/** Idiomas que tienen al menos una receta publicada (los demás se muestran deshabilitados en el selector). */
export async function getAvailableLanguages(): Promise<RecipeLanguage[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('language')
    .eq('published', true)
    .limit(2000)
  if (error) return ['es']
  return Array.from(new Set((data ?? []).map((row: { language: string }) => row.language as RecipeLanguage)))
}
