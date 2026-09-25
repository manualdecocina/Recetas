import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/public'
import { SiteHeader } from '@/components/SiteHeader'
import { RecipeCard } from '@/components/RecipeCard'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'
import { publicUrl } from '@/lib/site'

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
    .order('published_at', { ascending: false, nullsFirst: false })

  if (recipesError) throw new Error('No se pudieron cargar las recetas del ingrediente')
  return { ingredient: data, recipes: recipes ?? [] }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang: rawLang, slug } = await params
  const lang = parseLang(rawLang)
  if (!lang || lang !== 'es') return {}
  const result = await getIngredient(lang, slug)
  if (!result) return {}
  return {
    title: result.ingredient.name,
    description: result.ingredient.description ?? `Recetas con ${result.ingredient.name} en Manual de Cocina.`,
    robots: { index: true, follow: true },
  }
}

export default async function IngredientPage({ params }: { params: { lang: string; slug: string } }) {
  const lang = parseLang(params.lang)
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
      <SiteHeader lang={lang} />
      <main className="ingredient-page">
        {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd).replace(/</g, '\\u003c') }} />}
        <header className="ingredient-page__hero">
          <Link href={`/${lang}/ingredientes`} className="eyebrow">← Ingredientes</Link>
          <p className="eyebrow">Ingrediente</p>
          <h1>{ingredient.name}</h1>
          {ingredient.description && <p>{ingredient.description}</p>}
        </header>

        <section className="ingredient-page__recipes" aria-labelledby="ingredient-recipes-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Descubrir</p>
              <h2 id="ingredient-recipes-title">Recetas con {ingredient.name.toLowerCase()}</h2>
            </div>
            <span>{recipes.length} {recipes.length === 1 ? 'receta' : 'recetas'}</span>
          </div>
          {recipes.length ? (
            <div className="recipe-grid catalog-grid">
              {recipes.map((recipe, index) => <RecipeCard key={recipe.id} recipe={recipe} priority={index < 4} />)}
            </div>
          ) : (
            <div className="catalog-empty">
              <p>Aún no hay recetas publicadas con este ingrediente.</p>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
