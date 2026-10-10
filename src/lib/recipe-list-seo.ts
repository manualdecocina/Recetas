import { recipeCanonicalUrl } from '@/lib/site'
import type { RecipeLanguage } from '@/types/recipe'

/** Titles describe the same recipe catalog in each supported language. */
export const RECIPE_LISTING_TITLES: Record<RecipeLanguage, string> = {
  es: 'Recetas caseras e internacionales',
  en: 'Home cooking recipes from around the world',
  de: 'Rezepte aus aller Welt zum Nachkochen',
  fr: 'Recettes maison du monde entier',
  it: 'Ricette fatte in casa dal mondo',
  ja: '料理レシピ一覧｜世界の家庭料理',
  pt: 'Receitas caseiras do mundo todo',
}

/** Preserve the known historical canonical (WordPress trailing slash) in ItemList
 * even when navigation also accepts a URL without slash.
 * Position is absolute across paginated catalog pages. */
export function recipeListItem(
  recipe: { public_path: string; source_url?: string | null },
  position: number,
) {
  return {
    '@type': 'ListItem' as const,
    position,
    url: recipeCanonicalUrl(recipe),
  }
}
