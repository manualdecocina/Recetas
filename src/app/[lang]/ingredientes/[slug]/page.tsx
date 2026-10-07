import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { IngredientDetailView } from '@/components/md/IngredientViews'
import type { MdRecipeCardData } from '@/components/md/md-types'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { publicUrl, absoluteUrl } from '@/lib/site'
import { withSiteName, siteRobots } from '@/lib/seo'

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

  const { data: relations, error: relationError } = await supabase
    .from('recipe_ingredients')
    .select('recipe_id, position')
    .eq('ingredient_id', data.id)
    .order('position', { ascending: true })

  if (relationError) throw new Error('No se pudieron cargar las relaciones del ingrediente')

  const ids = [...new Set((relations ?? []).map((row) => row.recipe_id))]
  if (!ids.length) return { ingredient: data, recipes: [] }

  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('id, language, slug, public_path, title, excerpt, category, image_url')
    .in('id', ids)
    .eq('language', lang)
    .eq('published', true)
    .order('ready_at', { ascending: false, nullsFirst: false })

  if (recipesError) throw new Error('No se pudieron cargar las recetas del ingrediente')
  return { ingredient: data, recipes: recipes ?? [] }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang: rawLang, slug } = await params
  const lang = parseLang(rawLang)
  if (!lang || lang !== 'es') return {}
  const result = await getIngredient(lang, slug)
  if (!result) return {}
  const title = withSiteName(result.ingredient.name)
  const description = result.ingredient.description ?? `Recetas con ${result.ingredient.name} en Manual de Cocina.`
  const url = publicUrl(`/es/ingredientes/${result.ingredient.slug}`)
  const images = result.ingredient.image_url
    ? [{ url: absoluteUrl(result.ingredient.image_url), alt: result.ingredient.name }]
    : undefined
  return {
    title,
    description,
    robots: siteRobots(),
    alternates: { canonical: url },
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
  if (!lang || lang !== 'es') notFound()

  const result = await getIngredient(lang, slug)
  if (!result) notFound()

  const { ingredient, recipes } = result
  const itemListLd = recipes.length > 1 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: recipes.map((recipe, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: publicUrl(recipe.public_path),
      name: recipe.title,
    })),
  } : null

  return (
    <>
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd).replace(/</g, '\\u003c') }} />}
      <IngredientDetailView
        ingredient={{ slug: ingredient.slug, name: ingredient.name }}
        description={ingredient.description}
        recipes={recipes as MdRecipeCardData[]}
      />
    </>
  )
}
