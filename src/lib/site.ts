import type { RecipeLanguage } from '@/types/recipe'

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://manualdecocina.com').replace(/\/$/, '')
}

export function isIndexingAllowed(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'
}

/** ID de publisher de Google AdSense (formato "ca-pub-XXXXXXXXXXXXXXXX"). El dominio ya está
 * aprobado por Google AdSense (pub-2592990699767586, ver public/ads.txt) y muestra anuncios en
 * la versión en producción actual; no hay ninguna aprobación pendiente. Sin configurar esta
 * variable (preview y cualquier entorno de prueba) el sitio no carga el script de AdSense — no
 * hace falta ningún cambio de código para activarlo: basta con definirla en el entorno de
 * producción de Hostinger de este proyecto y volver a desplegar. */
export function adsenseClientId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim()
  return id ? id : undefined
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

/** URL absoluta para imágenes: acepta rutas locales (/recetas/...) o URLs completas. */
export function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : `${getSiteUrl()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}
