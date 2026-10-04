import type { Recipe } from '@/types/recipe'
import { parseVideo, isoDuration } from '@/lib/video'
import { publicUrl, absoluteUrl, getSiteUrl, RECIPE_AUTHOR, authorUrl } from '@/lib/site'
import { UI_TEXT } from '@/lib/i18n'
import { getRecipeTranslations } from '@/lib/public-content'
import { normalizePublicPath } from '@/lib/site'
import SiteHeader from '@/components/md/SiteHeader'
import SiteFooter from '@/components/md/SiteFooter'
import RecipeDocumentVisual from '@/components/md/RecipeDocumentVisual'

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

  const seoMeta = (recipe.seo ?? {}) as Record<string, unknown>
  const imageVariants = Array.isArray(seoMeta.image_variants)
    ? seoMeta.image_variants.filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
    : []
  const galleryImages = [
    ...imageVariants,
    recipe.image_url,
    ...(Array.isArray(recipe.gallery) ? recipe.gallery.map((g) => (typeof g?.url === 'string' ? g.url : null)) : []),
  ]
    .filter((u): u is string => Boolean(u))
    .map(absoluteUrl)
    .filter((url, index, all) => all.indexOf(url) === index)
  const n = (recipe.nutrition ?? {}) as Record<string, unknown>
  const num = (k: string) => (typeof n[k] === 'number' ? (n[k] as number) : null)
  const nutritionLd = num('calories') != null ? {
    '@type': 'NutritionInformation',
    servingSize: typeof n.serving_size === 'string' ? n.serving_size : undefined,
    calories: `${num('calories')} calories`,
    proteinContent: num('protein_g') != null ? `${num('protein_g')} g` : undefined,
    carbohydrateContent: num('carbs_g') != null ? `${num('carbs_g')} g` : undefined,
    fatContent: num('fat_g') != null ? `${num('fat_g')} g` : undefined,
    saturatedFatContent: num('saturated_fat_g') != null ? `${num('saturated_fat_g')} g` : undefined,
    fiberContent: num('fiber_g') != null ? `${num('fiber_g')} g` : undefined,
    sugarContent: num('sugar_g') != null ? `${num('sugar_g')} g` : undefined,
    sodiumContent: num('sodium_mg') != null ? `${num('sodium_mg')} mg` : undefined,
  } : undefined
  // aggregateRating: solo con votos reales acumulados vía rate_recipe_once(); nunca un número
  // inventado. Sin votos, se omite el campo por completo (Google penaliza el rating falso).
  const ratingsEnabled = process.env.NEXT_PUBLIC_RATINGS_ENABLED === 'true'
  const ratingCount = recipe.rating_count ?? 0
  const ratingSum = recipe.rating_sum ?? 0
  const aggregateRatingLd = ratingsEnabled && ratingCount > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: (ratingSum / ratingCount).toFixed(1),
    ratingCount,
    bestRating: '5',
    worstRating: '1',
  } : undefined
  const video = parseVideo(recipe.video_urls?.[0])
  const videoLd = video && typeof seoMeta.video_upload_date === 'string' ? {
    '@type': 'VideoObject',
    name: typeof seoMeta.video_name === 'string' ? seoMeta.video_name : recipe.title,
    description: typeof seoMeta.video_description === 'string' ? seoMeta.video_description : (recipe.excerpt ?? recipe.title),
    thumbnailUrl: [absoluteUrl(typeof seoMeta.video_poster === 'string' ? seoMeta.video_poster : (recipe.image_url ?? ''))],
    uploadDate: seoMeta.video_upload_date,
    duration: typeof seoMeta.video_duration_seconds === 'number' ? isoDuration(seoMeta.video_duration_seconds) : undefined,
    embedUrl: video.embedUrl.replace('&dnt=1', '').replace('?dnt=1', ''),
  } : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.excerpt ?? undefined,
    image: galleryImages.length ? galleryImages : undefined,
    author: { '@type': 'Person', '@id': `${authorUrl(recipe.language)}/#person`, name: RECIPE_AUTHOR.name, url: authorUrl(recipe.language) },
    publisher: { '@type': 'Organization', '@id': `${getSiteUrl()}/#organization`, name: 'Manual de Cocina', url: getSiteUrl() },
    mainEntityOfPage: publicUrl(recipe.public_path),
    aggregateRating: aggregateRatingLd,
    nutrition: nutritionLd,
    video: videoLd,
    inLanguage: recipe.language,
    url: publicUrl(recipe.public_path),
    datePublished: recipe.published_at ?? undefined,
    dateModified: recipe.updated_at,
    recipeIngredient: recipe.ingredients.map((i) => [i.amount, i.unit, i.name].filter(Boolean).join(' ')),
    recipeInstructions: recipe.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title || undefined, text: s.content, image: s.image_url ? absoluteUrl(s.image_url) : undefined, url: `${publicUrl(recipe.public_path)}#paso-${i + 1}` })),
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
          notesHtml={notesHtml}
        />
      </main>
      <SiteFooter lang={recipe.language} />
    </div>
  )
}
