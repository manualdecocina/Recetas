import { notFound, permanentRedirect } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { recipeAlternates } from '@/lib/seo'
import { normalizePublicPath, recipePath, publicUrl } from '@/lib/site'
import { RecipeDocument } from '@/components/RecipeDocument'
import { SUPPORTED_LANGUAGES, type Recipe, type RecipeLanguage } from '@/types/recipe'

export const revalidate = 3600

interface Props {
  params: { lang: string; slug: string }
}

const getRecipe = cache(async (lang: string, slug: string): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('language', lang)
    .eq('slug', decodeURIComponent(slug))
    .eq('published', true)
    .maybeSingle()
  if (error) throw new Error(`No se pudo cargar la receta: ${error.message}`)
  return data as Recipe | null
})

const getTranslations = cache(async (recipeGroupId: string) => {
  const { data, error } = await supabase
    .from('recipes')
    .select('language, public_path')
    .eq('recipe_group_id', recipeGroupId)
    .eq('published', true)
  if (error) throw new Error(`No se pudieron cargar las traducciones: ${error.message}`)
  return data ?? []
})

function isLang(value: string): value is RecipeLanguage {
  return (SUPPORTED_LANGUAGES as string[]).includes(value)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLang(params.lang)) return {}
  const recipe = await getRecipe(params.lang, params.slug)
  if (!recipe) return {}
  const translations = await getTranslations(recipe.recipe_group_id)

  return {
    title: recipe.title,
    description: recipe.excerpt ?? undefined,
    alternates: recipeAlternates(recipe, translations),
    openGraph: {
      type: 'article',
      title: recipe.title,
      description: recipe.excerpt ?? undefined,
      url: publicUrl(recipe.public_path),
      images: recipe.image_url ? [recipe.image_url] : undefined,
    },
  }
}

async function getRelatedRecipes(recipe: Recipe) {
  if (!recipe.category && !recipe.cuisine) return []
  let query = supabase.from('recipes')
    .select('id, language, slug, public_path, title, excerpt, category, image_url')
    .eq('language', recipe.language)
    .eq('published', true)
    .neq('id', recipe.id)
    .limit(4)
  if (recipe.category) query = query.eq('category', recipe.category)
  else if (recipe.cuisine) query = query.eq('cuisine', recipe.cuisine)
  const { data } = await query
  return data ?? []
}

export default async function RecipeDetailPage({ params }: Props) {
  if (!isLang(params.lang)) notFound()
  const recipe = await getRecipe(params.lang, params.slug)
  if (!recipe) notFound()

  const routePath = normalizePublicPath(recipePath(params.lang, recipe.slug))
  const publicPath = normalizePublicPath(recipe.public_path)
  if (routePath !== publicPath) permanentRedirect(publicPath)

  const relatedRecipes = await getRelatedRecipes(recipe)
  return <RecipeDocument recipe={recipe} relatedRecipes={relatedRecipes} />
}
