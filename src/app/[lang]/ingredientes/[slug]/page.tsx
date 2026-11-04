import { cache } from 'react'
import { isIndexingAllowed } from '@/lib/site'
import { ingredientImageSrc } from '@/lib/ingredient-photos'
import { ingredientTitleRank } from '@/lib/ingredient-discovery'
import { ingredientLabel } from '@/lib/ingredient-labels'
import { getPantryMatchData } from '@/lib/md-data'
import { pantryIngredientRecipeIds } from '@/lib/pantry-foods'
import { taxonomyLanding } from '@/lib/taxonomy-landing-seo'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { IngredientDetailView } from '@/components/md/IngredientViews'
import type { MdRecipeCardData } from '@/components/md/md-types'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { publicUrl, absoluteUrl, recipeCanonicalUrl } from '@/lib/site'
import { withSiteName, siteRobots, allLanguageAlternates } from '@/lib/seo'

function parseLang(value: string): RecipeLanguage | null {
  return (SUPPORTED_LANGUAGES as string[]).includes(value) ? value as RecipeLanguage : null
}

// Share metadata and page resolution, including negative results, within a render.
// Both decoded and percent-encoded Unicode segments resolve to the stored slug.
const getIngredient = cache(async (lang: RecipeLanguage, rawSlug: string) => {
  let slug: string
  try { slug = decodeURIComponent(rawSlug).normalize('NFC') } catch { return null }
  const { data, error } = await supabase
    .from('ingredients')
    .select('id, name, slug, description, image_url, indexable, status')
    .eq('slug', slug)
    .eq('status', 'canonical')
    .maybeSingle()
  if (error) throw new Error('No se pudo cargar el ingrediente')
  if (!data) return null

  const pantry = await getPantryMatchData(lang)
  const recipeIds = new Set(pantryIngredientRecipeIds(pantry, data.id))
  const name = ingredientLabel(data.slug, data.name, lang)
  const recipes = pantry.recipes.filter(recipe => recipeIds.has(recipe.id))
    .map(recipe => ({ recipe, rank: ingredientTitleRank(recipe.title, name, slug, lang) }))
    .sort((a, b) => a.rank - b.rank)
    .map(item => item.recipe)
  return { ingredient: { ...data, name, description: lang === 'es' ? data.description : null }, recipes }

})

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang: rawLang, slug } = await params
  const lang = parseLang(rawLang)
  if (!lang) return {}
  const result = await getIngredient(lang, slug)
  if (!result) return {}
  const landing = taxonomyLanding('ingredient', lang, result.ingredient.name, result.recipes.length)
  const title = withSiteName(landing.title)
  const description = landing.description
  const url = publicUrl(`/${lang}/ingredientes/${result.ingredient.slug}`)
  const photo = ingredientImageSrc(result.ingredient.slug)
  const images = photo
    ? [{ url: absoluteUrl(photo), alt: result.ingredient.name }]
    : undefined
  return {
    title,
    description,
    robots: result.ingredient.indexable ? siteRobots() : { index: false, follow: isIndexingAllowed(), googleBot: { index: false, follow: isIndexingAllowed() } },
    alternates: allLanguageAlternates(`/${lang}/ingredientes/${result.ingredient.slug}`, (l) => `/${l}/ingredientes/${result.ingredient.slug}`),
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title,
      description,
      images,
    },
  }
}

export default async function IngredientPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: rawLang, slug } = await params
  const lang = parseLang(rawLang)
  if (!lang) notFound()

  const result = await getIngredient(lang, slug)
  if (!result) notFound()

  const { ingredient, recipes } = result
  const itemListLd = recipes.length > 1 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: recipes.map((recipe, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: recipeCanonicalUrl(recipe),
      name: recipe.title,
    })),
  } : null

  return (
    <>
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd).replace(/</g, '\\u003c') }} />}
      <IngredientDetailView
        lang={lang}
        ingredient={{ slug: ingredient.slug, name: ingredient.name }}
        description={ingredient.description}
        recipes={recipes as MdRecipeCardData[]}
      />
    </>
  )
}
