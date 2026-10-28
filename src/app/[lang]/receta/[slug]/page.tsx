import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { getContentRedirect, getRelatedRecipes, getRecipeByPublicPath } from '@/lib/public-content'
import { recipeAlternates, recipeMetaText, recipeSocialImages } from '@/lib/seo'
import { normalizePublicPath, recipePath, publicUrl, recipeCanonicalUrl, publicPathHref } from '@/lib/site'
import { RecipeDocument } from '@/components/RecipeDocument'
import { SUPPORTED_LANGUAGES, type Recipe, type RecipeLanguage } from '@/types/recipe'

export const revalidate = 3600

interface Props {
  params: Promise<{ lang: string; slug: string }>
}

const getRecipe = cache(async (lang: string, slug: string): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('public_path')
    .eq('language', lang)
    .eq('slug', decodeURIComponent(slug))
    .eq('published', true)
    .maybeSingle()
  if (error) throw new Error(`No se pudo cargar la receta: ${error.message}`)
  if (!data) return null
  return getRecipeByPublicPath(data.public_path)

})

const getTranslations = cache(async (recipeGroupId: string) => {
  const { data, error } = await supabase
    .from('recipes')
    .select('language, public_path, source_url')
    .eq('recipe_group_id', recipeGroupId)
    .eq('published', true)
  if (error) throw new Error(`No se pudieron cargar las traducciones: ${error.message}`)
  return data ?? []
})

function isLang(value: string): value is RecipeLanguage {
  return (SUPPORTED_LANGUAGES as string[]).includes(value)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLang(lang)) return {}
  const recipe = await getRecipe(lang, slug)
  if (!recipe) return {}
  const translations = await getTranslations(recipe.recipe_group_id)
  const meta = recipeMetaText(recipe)
  const images = recipeSocialImages(recipe)

  return {
    title: meta.title,
    description: meta.description,
    alternates: recipeAlternates(recipe, translations),
    openGraph: {
      type: 'article',
      title: meta.title,
      description: meta.description,
      url: recipeCanonicalUrl(recipe),
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title: meta.title,
      description: meta.description,
      images,
    },
  }
}

export default async function RecipeDetailPage({ params }: Props) {
  const { lang, slug } = await params
  if (!isLang(lang)) notFound()
  const recipe = await getRecipe(lang, slug)
  if (!recipe) {
    // URL histórica /{lang}/receta/{slug} de una receta aún no publicada: redirección registrada.
    const redirectTo = await getContentRedirect(recipePath(lang, slug))
    if (redirectTo) {
      if (redirectTo.permanent) permanentRedirect(redirectTo.target_path)
      redirect(redirectTo.target_path)
    }
    notFound()
  }

  const routePath = normalizePublicPath(recipePath(lang, recipe.slug))
  const publicPath = normalizePublicPath(recipe.public_path)
  if (routePath !== publicPath) permanentRedirect(publicPathHref(recipe.public_path))

  const relatedRecipes = await getRelatedRecipes(recipe)
  return <RecipeDocument recipe={recipe} relatedRecipes={relatedRecipes} />
}
