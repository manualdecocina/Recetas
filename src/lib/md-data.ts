import { supabase } from '@/lib/supabase/public'
import type { RecipeLanguage } from '@/types/recipe'
import { MD_CATEGORIES, type MdRecipeCardData } from '@/components/md/md-types'
import type { MdCategorySummary } from '@/components/md/CategoryViews'
import type { MdIngredientSummary } from '@/components/md/IngredientViews'
import type { MdHomeData } from '@/components/md/HomePageView'

// Solo lectura, con el mismo cliente público y las mismas tablas/filtros que ya usan las
// demás rutas (recetas publicadas por idioma). No inventa datos: si no hay, devuelve vacío.
const CARD_FIELDS = 'id, language, slug, public_path, title, excerpt, category, image_url'

/** Una sola consulta: conteo real por categoría y una foto real de una receta de esa categoría. */
export async function getCategorySummaries(lang: RecipeLanguage): Promise<MdCategorySummary[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('category, image_url')
    .eq('language', lang)
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
  if (error) throw new Error(`No se pudieron cargar las categorías: ${error.message}`)
  const rows = (data ?? []) as Array<{ category: string | null; image_url: string | null }>
  return MD_CATEGORIES.map(({ label, slug }) => {
    const inCategory = rows.filter((row) => row.category === label)
    return {
      slug,
      label,
      count: inCategory.length,
      image_url: inCategory.find((row) => row.image_url)?.image_url ?? null,
    }
  })
}

/** Ingredientes canónicos indexables (los mismos que lista /es/ingredientes). */
export async function getIngredientSummaries(limit?: number): Promise<MdIngredientSummary[]> {
  let query = supabase
    .from('ingredients')
    .select('slug, name')
    .eq('status', 'canonical')
    .eq('indexable', true)
    .order('name', { ascending: true })
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) throw new Error(`No se pudieron cargar los ingredientes: ${error.message}`)
  return (data ?? []) as MdIngredientSummary[]
}

export async function getHomeData(lang: RecipeLanguage): Promise<MdHomeData> {
  const [featuredResult, latestResult, categories, ingredients] = await Promise.all([
    // Destacada: la receta publicada más reciente que tenga foto real.
    supabase
      .from('recipes')
      .select(CARD_FIELDS)
      .eq('language', lang)
      .eq('published', true)
      .not('image_url', 'is', null)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('recipes')
      .select(CARD_FIELDS)
      .eq('language', lang)
      .eq('published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(9),
    getCategorySummaries(lang),
    lang === 'es' ? getIngredientSummaries(12) : Promise.resolve([] as MdIngredientSummary[]),
  ])
  if (featuredResult.error) throw new Error(`No se pudo cargar la receta destacada: ${featuredResult.error.message}`)
  if (latestResult.error) throw new Error(`No se pudieron cargar las últimas recetas: ${latestResult.error.message}`)

  const featured = (featuredResult.data ?? null) as MdRecipeCardData | null
  const latest = ((latestResult.data ?? []) as MdRecipeCardData[])
    .filter((recipe) => recipe.id !== featured?.id)
    .slice(0, 8)

  return { featured, latest, categories, ingredients }
}
