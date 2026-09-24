import type { RecipeLanguage } from '@/types/recipe'

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://manualdecocina.com').replace(/\/$/, '')
}

// Seguro anti-duplicado: solo "true" explícito permite indexar.
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
