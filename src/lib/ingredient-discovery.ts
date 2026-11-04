import type { RecipeLanguage } from '@/types/recipe'
import { normalizeIngredientSearch } from './pantry-editorial'

export const INGREDIENT_PAGE_SIZE = 24
export const FEATURED_INGREDIENT_COUNT = 12

export const ingredientDirectoryCopy = {
  es: ['Ingredientes destacados', 'Ver todos los ingredientes', 'Página'],
  en: ['Featured ingredients', 'Browse all ingredients', 'Page'],
  de: ['Beliebte Zutaten', 'Alle Zutaten ansehen', 'Seite'],
  fr: ['Ingrédients à découvrir', 'Voir tous les ingrédients', 'Page'],
  it: ['Ingredienti in evidenza', 'Vedi tutti gli ingredienti', 'Pagina'],
  ja: ['おすすめ食材', 'すべての食材を見る', 'ページ'],
  pt: ['Ingredientes em destaque', 'Ver todos os ingredientes', 'Página'],
} satisfies Record<RecipeLanguage, [string, string, string]>

// Ubiquitous seasonings and liquids are easy to find through search. Give
// ingredients that help choose a dish the first positions on the landing page.
const STAPLES = new Set(['sal', 'agua', 'pimienta-negra', 'aceite-vegetal', 'aceite-de-oliva', 'azucar'])

export function featuredIngredients<T extends { slug: string; count?: number }>(ingredients: T[], limit = FEATURED_INGREDIENT_COUNT): T[] {
  return [...ingredients].sort((a, b) =>
    Number(STAPLES.has(a.slug)) - Number(STAPLES.has(b.slug)) || (b.count ?? 0) - (a.count ?? 0),
  ).slice(0, limit)
}

export function ingredientTitleRank(title: string, name: string, slug: string, lang: RecipeLanguage): number {
  const words = (text: string) => normalizeIngredientSearch(text).replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
  const titleWords = words(title)
  const label = words(name)
  if (lang === 'ja') return Number(!titleWords.includes(label))
  const terms = [label]
  if (slug === 'papas' && lang === 'es') terms.push('papa', 'papas', 'patata', 'patatas')
  else if (lang === 'es' || lang === 'en' || lang === 'fr' || lang === 'pt') terms.push(`${label}s`)
  return Number(!terms.some(term => ` ${titleWords} `.includes(` ${term} `)))
}

export function ingredientDirectoryPath(lang: string, page = 0): string {
  return `/${lang}/ingredientes${page ? `?page=${page}` : ''}`
}
