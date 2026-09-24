import Image from 'next/image'
import type { Recipe } from '@/types/recipe'
import { UI_TEXT } from '@/lib/i18n'
import { publicUrl } from '@/lib/site'

function cleanHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/javascript:/gi, '')
}

export function RecipeDocument({ recipe }: { recipe: Recipe }) {
  const text = UI_TEXT[recipe.language]
  const editorialHtml = recipe.content_html ? cleanHtml(recipe.content_html) : ''
  const totalMinutes = recipe.total_time_minutes ??
    ((recipe.prep_time_minutes ?? 0) + (recipe.cook_time_minutes ?? 0))

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <article>
        <h1>{recipe.title}</h1>
        {recipe.excerpt && <p>{recipe.excerpt}</p>}
        {editorialHtml && <div dangerouslySetInnerHTML={{ __html: editorialHtml }} />}
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
      </article>
    </main>
  )
}
