import { ingredientLabel } from '@/lib/ingredient-labels'
import { getPantryMatchData } from '@/lib/md-data'
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

async function getIngredient(lang: RecipeLanguage, slug: string) {
  const { data, error } = await supabase
    .from('ingredients')
    .select('id, name, slug, description, image_url, indexable, status')
    .eq('slug', slug)
    .eq('status', 'canonical')
    .maybeSingle()
  if (error) throw new Error('No se pudo cargar el ingrediente')
  if (!data || !data.indexable) return null

  const pantry = await getPantryMatchData(lang)
  return { ingredient: { ...data, name: ingredientLabel(data.slug, data.name, lang), description: lang === 'es' ? data.description : null },
    recipes: pantry.recipes.filter((recipe) => recipe.ingredientIds.includes(data.id)) }

}

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
  const images = result.ingredient.image_url
    ? [{ url: absoluteUrl(result.ingredient.image_url), alt: result.ingredient.name }]
    : undefined
  return {
    title,
    description,
    robots: siteRobots(),
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
