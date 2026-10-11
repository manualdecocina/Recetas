import { recipeCanonicalUrl } from '@/lib/site'
import type { RecipeLanguage } from '@/types/recipe'

/** Titles describe the same recipe catalog in each supported language. */
export const RECIPE_LISTING_TITLES: Record<RecipeLanguage, string> = {
  es: 'Todas las recetas paso a paso',
  en: 'Home cooking recipes from around the world',
  de: 'Rezepte aus aller Welt zum Nachkochen',
  fr: 'Recettes maison du monde entier',
  it: 'Ricette fatte in casa dal mondo',
  ja: '料理レシピ一覧｜世界の家庭料理',
  pt: 'Receitas caseiras do mundo todo',
}

/** Descriptions reflect the published recipe collections, not a promised recipe count. */
export const RECIPE_LISTING_DESCRIPTIONS: Record<RecipeLanguage, string> = {
  es: 'Explora recetas caseras de distintas cocinas: platos colombianos, pastas, sopas, ensaladas, panes y postres. Consulta ingredientes y preparación paso a paso.',
  en: 'Find home-cooked recipes from Colombia and around the world: main dishes, pasta, soups, salads, breads and desserts. Browse ingredients and cooking steps.',
  de: 'Entdecke Rezepte aus Kolumbien und aller Welt: Hauptgerichte, Pasta, Suppen, Salate, Brot und Desserts. Mit Zutaten und Schritt-für-Schritt-Anleitungen.',
  fr: 'Explorez des recettes maison de Colombie et du monde entier : plats, pâtes, soupes, salades, pains et desserts. Consultez les ingrédients et les étapes.',
  it: 'Scopri ricette casalinghe della Colombia e di tutto il mondo: piatti principali, pasta, zuppe, insalate, pane e dolci. Ingredienti e passaggi spiegati.',
  ja: '世界各地の家庭料理をレシピ一覧から探せます。コロンビア料理をはじめ、主菜、パスタ、スープ、サラダ、パン、デザートなどを掲載。材料、調理時間、調理手順を確認して、作りたい料理を見つけてください。',
  pt: 'Explore receitas caseiras da Colômbia e do mundo: pratos principais, massas, sopas, saladas, pães e sobremesas. Veja ingredientes e preparo passo a passo.',
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
