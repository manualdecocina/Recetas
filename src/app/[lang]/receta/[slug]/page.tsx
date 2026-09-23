import Image from 'next/image'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { UI_TEXT } from '@/lib/i18n'
import { recipeAlternates } from '@/lib/seo'
import { recipeUrl } from '@/lib/site'
import { SUPPORTED_LANGUAGES, type Recipe, type RecipeLanguage } from '@/types/recipe'

export const revalidate = 3600 // respaldo; la invalidación real es revalidateTag (ver docs/cache.md)

interface Props {
  params: { lang: string; slug: string }
}

// cache(): generateMetadata y la página comparten la misma consulta en un request.
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
    .select('language, slug')
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
      url: recipeUrl(recipe.language, recipe.slug),
      images: recipe.image_url ? [recipe.image_url] : undefined,
    },
  }
}

export default async function RecipeDetailPage({ params }: Props) {
  if (!isLang(params.lang)) notFound()
  const recipe = await getRecipe(params.lang, params.slug)
  if (!recipe) notFound()
  const text = UI_TEXT[recipe.language]
  const editorialText = recipe.content_html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

  const totalMinutes = (recipe.prep_time_minutes ?? 0) + (recipe.cook_time_minutes ?? 0)

  // JSON-LD Recipe solo con datos reales. Nunca inventar aggregateRating.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.excerpt ?? undefined,
    image: recipe.image_url ? [recipe.image_url] : undefined,
    inLanguage: recipe.language,
    url: recipeUrl(recipe.language, recipe.slug),
    datePublished: recipe.published_at ?? undefined,
    dateModified: recipe.updated_at,
    recipeIngredient: recipe.ingredients.map((i) =>
      [i.amount, i.unit, i.name].filter(Boolean).join(' ')
    ),
    recipeInstructions: recipe.steps.map((s) => ({
      '@type': 'HowToStep',
      name: s.title,
      text: s.content,
    })),
    prepTime: recipe.prep_time_minutes ? `PT${recipe.prep_time_minutes}M` : undefined,
    cookTime: recipe.cook_time_minutes ? `PT${recipe.cook_time_minutes}M` : undefined,
    totalTime: totalMinutes > 0 ? `PT${totalMinutes}M` : undefined,
    recipeYield: recipe.servings ? String(recipe.servings) : undefined,
    recipeCategory: recipe.category ?? undefined,
  }

  return (
    <main>
      {/* TODO(diseño): diseño final de la página de receta */}
      <script
        type="application/ld+json"
        // Escapa "<" para que ningún texto de la receta pueda cerrar la etiqueta script.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <h1>{recipe.title}</h1>
      {recipe.excerpt && <p>{recipe.excerpt}</p>}
      {editorialText && <p>{editorialText}</p>}

      {recipe.image_url && (
        <Image
          src={recipe.image_url}
          alt={recipe.title}
          width={1200}
          height={800}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          priority
        />
      )}

      <h2>{text.ingredients}</h2>
      <ul>
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{[ing.amount, ing.unit, ing.name].filter(Boolean).join(' ')}</li>
        ))}
      </ul>

      <h2>{text.preparation}</h2>
      <ol>
        {recipe.steps.map((step, i) => (
          <li key={i}>
            <h3>{step.title}</h3>
            <p>{step.content}</p>
          </li>
        ))}
      </ol>
    </main>
  )
}
