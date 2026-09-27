import type { RecipeLanguage } from '@/types/recipe'

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://manualdecocina.com').replace(/\/$/, '')
}

export function isIndexingAllowed(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'
}

export function normalizePublicPath(path: string): string {
  if (!path) return '/'
  const withSlash = path.startsWith('/') ? path : '/' + path
  if (withSlash === '/') return '/'
  return withSlash.replace(/\/+$/, '')
}

export function recipePath(language: RecipeLanguage | string, slug: string): string {
  return `/${language}/receta/${slug}`
}

export function recipeUrl(language: RecipeLanguage | string, slug: string): string {
  return `${getSiteUrl()}${recipePath(language, slug)}`
}

export function publicUrl(publicPath: string): string {
  return `${getSiteUrl()}${normalizePublicPath(publicPath)}`
}

/** Autor editorial de las recetas. La biografía completa vive en la página "Quiénes somos". */
export const RECIPE_AUTHOR = { name: 'Néstor Bastidas', aboutPath: 'quienes-somos' } as const

export function authorUrl(language: string): string {
  return `${getSiteUrl()}/${language}/${RECIPE_AUTHOR.aboutPath}`
}
