import type { Recipe } from '@/types/recipe'
import { publicUrl } from '@/lib/site'
import { UI_TEXT } from '@/lib/i18n'
import { getRecipeTranslations } from '@/lib/public-content'
import { normalizePublicPath } from '@/lib/site'
import SiteHeader from '@/components/md/SiteHeader'
import SiteFooter from '@/components/md/SiteFooter'
import RecipeDocumentVisual from '@/components/md/RecipeDocumentVisual'

/** HTML editorial heredado de WordPress: se normaliza para que todas las recetas se vean igual. */
function cleanEditorialHtml(html: string): string {
  return cleanHtml(html)
    .replace(/<figure[\s\S]*?<\/figure>/gi, '')          // fotos sueltas: la foto principal ya está arriba
    .replace(/<img[^>]*>/gi, '')
    .replace(/<hr[^>]*>/gi, '')
    .replace(/\s(class|id|style|width|height|data-[a-z-]+)=("[^"]*"|'[^']*')/gi, '')
    .replace(/<h[1-2]([^>]*)>/gi, '<h3$1>').replace(/<\/h[1-2]>/gi, '</h3>')
    .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
    .replace(/(<br\s*\/?>\s*){2,}/gi, '<br/>')
}

function cleanHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/javascript:/gi, '')
}

// Contrato público sin cambios: mismas props, mismo JSON-LD Recipe y BreadcrumbList.
// Solo cambió la presentación (src/components/md/*). Este componente ahora también
// pinta cabecera y pie, para que las rutas que lo usan no tengan que hacerlo.

export async function RecipeDocument({ recipe, relatedRecipes = [] }: { recipe: Recipe; relatedRecipes?: Array<Pick<Recipe, 'id' | 'language' | 'slug' | 'public_path' | 'title' | 'excerpt' | 'category' | 'image_url'>> }) {
  const text = UI_TEXT[recipe.language]
  const translations = recipe.recipe_group_id ? await getRecipeTranslations(recipe.recipe_group_id) : []
  const alternates = Object.fromEntries(
    translations.filter((t) => t.language !== recipe.language).map((t) => [t.language, normalizePublicPath(t.public_path)])
  )
  const editorialHtml = recipe.content_html ? cleanEditorialHtml(recipe.content_html) : ''
  const notesHtml = recipe.notes ? cleanHtml(recipe.notes) : ''
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
    <div className="md-site" lang={recipe.language}>
      <SiteHeader lang={recipe.language} alternates={alternates} />
      <main id="md-main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />
        <RecipeDocumentVisual
          recipe={recipe}
          relatedRecipes={relatedRecipes}
          editorialHtml={editorialHtml}
          notesHtml={notesHtml}
        />
      </main>
      <SiteFooter lang={recipe.language} />
    </div>
  )
}
