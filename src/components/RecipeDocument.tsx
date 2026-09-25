import Image from 'next/image'
import type { Recipe } from '@/types/recipe'
import { UI_TEXT } from '@/lib/i18n'
import { publicUrl } from '@/lib/site'
import { FavoriteStar } from '@/components/FavoriteStar'
import { RecipeCookingMode } from '@/components/RecipeCookingMode'
import { PrintRecipeButton } from '@/components/PrintRecipeButton'
import { ShareRecipeButton } from '@/components/ShareRecipeButton'
import { RelatedRecipes } from '@/components/RelatedRecipes'
import { RecipeIngredients } from '@/components/RecipeIngredients'

function cleanHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/javascript:/gi, '')
}

export function RecipeDocument({ recipe, relatedRecipes = [] }: { recipe: Recipe; relatedRecipes?: Array<Pick<Recipe, 'id' | 'language' | 'slug' | 'public_path' | 'title' | 'excerpt' | 'category' | 'image_url'>> }) {
  const text = UI_TEXT[recipe.language]
  const editorialHtml = recipe.content_html ? cleanHtml(recipe.content_html) : ''
  const totalMinutes = recipe.total_time_minutes ??
    ((recipe.prep_time_minutes != null && recipe.cook_time_minutes != null)
      ? recipe.prep_time_minutes + recipe.cook_time_minutes
      : null)

  const breadcrumbLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: text.home, item: publicUrl('/' + recipe.language) },
    { '@type': 'ListItem', position: 2, name: text.recipes, item: publicUrl('/' + recipe.language + '/recetas') },
    { '@type': 'ListItem', position: 3, name: recipe.title, item: publicUrl(recipe.public_path) },
  ] }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.excerpt ?? undefined,
    image: recipe.image_url ? [recipe.image_url] : undefined,
    inLanguage: recipe.language,
    url: publicUrl(recipe.public_path),
    datePublished: recipe.published_at ?? undefined,
    dateModified: recipe.updated_at,
    recipeIngredient: recipe.ingredients.map((i) => [i.amount, i.unit, i.name].filter(Boolean).join(' ')),
    recipeInstructions: recipe.steps.map((s) => ({ '@type': 'HowToStep', name: s.title || undefined, text: s.content })),
    prepTime: recipe.prep_time_minutes != null ? `PT${recipe.prep_time_minutes}M` : undefined,
    cookTime: recipe.cook_time_minutes != null ? `PT${recipe.cook_time_minutes}M` : undefined,
    totalTime: totalMinutes != null && totalMinutes > 0 ? `PT${totalMinutes}M` : undefined,
    recipeYield: recipe.servings ? String(recipe.servings) : undefined,
    recipeCategory: recipe.category ?? undefined,
    recipeCuisine: recipe.cuisine ?? undefined,
    keywords: recipe.keywords?.length ? recipe.keywords.join(', ') : undefined,
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />

      <article className="recipe-document">
        <header className="recipe-document__hero">
          <div className="recipe-document__hero-copy">
            {recipe.category && <p className="eyebrow">{recipe.category}</p>}
            <div className="recipe-document__heading">
              <div>
                <h1>{recipe.title}</h1>
                {recipe.excerpt && <p>{recipe.excerpt}</p>}
              </div>
            </div>
            <div className="recipe-document__actions">
              <FavoriteStar recipeId={recipe.id} />
              <ShareRecipeButton title={recipe.title} />
              <PrintRecipeButton />
            </div>
          </div>

          {recipe.image_url && (
            <figure className="recipe-document__hero-image">
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                width={1400}
                height={930}
                sizes="(max-width: 900px) 100vw, 58vw"
                priority
              />
              <figcaption>Manual de Cocina · {recipe.category ?? 'Receta'}</figcaption>
            </figure>
          )}
        </header>

        <div className="recipe-document__facts" aria-label="Información de la receta">
          {totalMinutes != null && <span><strong>{totalMinutes}</strong><small>minutos</small></span>}
          {recipe.servings != null && <span><strong>{recipe.servings}</strong><small>porciones</small></span>}
          {recipe.difficulty && <span><strong>{recipe.difficulty}</strong><small>dificultad</small></span>}
          {recipe.cuisine && <span><strong>{recipe.cuisine}</strong><small>cocina</small></span>}
        </div>

        <nav className="recipe-document__jump" aria-label="Ir a">
          <span>En esta receta</span>
          <a href="#ingredientes">Ingredientes</a>
          <a href="#preparacion">Preparación</a>
          {recipe.steps.length > 0 && <a href="#modo-cocina">Modo cocina</a>}
        </nav>

        {editorialHtml && (
          <section className="recipe-document__editorial" aria-label="Sobre esta receta">
            <p className="eyebrow">El punto clave</p>
            <div dangerouslySetInnerHTML={{ __html: editorialHtml }} />
          </section>
        )}

        <div className="recipe-document__content">
          <section className="recipe-document__ingredients" aria-labelledby="ingredientes">
            <p className="eyebrow">Antes de empezar</p>
            <h2 id="ingredientes">{text.ingredients}</h2>
            <RecipeIngredients recipeId={recipe.id} language={recipe.language} ingredients={recipe.ingredients} />
          </section>

          <section className="recipe-document__preparation" aria-labelledby="preparacion">
            <p className="eyebrow">Paso a paso</p>
            <h2 id="preparacion">{text.preparation}</h2>
            <ol className="recipe-steps">
              {recipe.steps.map((step, i) => (
                <li key={i}>
                  <h3>{step.title || `Paso ${i + 1}`}</h3>
                  <p>{step.content}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {recipe.notes && (
          <section className="recipe-notes" aria-labelledby="recipe-notes-title">
            <p className="eyebrow">Notas del manual</p>
            <h2 id="recipe-notes-title">Consejos para que salga bien</h2>
            <div dangerouslySetInnerHTML={{ __html: cleanHtml(recipe.notes) }} />
          </section>
        )}

        <div id="modo-cocina"><RecipeCookingMode title={recipe.title} steps={recipe.steps} /></div>
        <RelatedRecipes recipes={relatedRecipes} />
      </article>
    </main>
  )
}
