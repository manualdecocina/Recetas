import type { RecipeLanguage } from '@/types/recipe'

export function getSiteUrl(): string {
  // Preview is independently testable: canonical, hreflang and sitemap stay on
  // its deployed origin. Indexing remains controlled by robots and page metadata.
  if (!isIndexingAllowed()) {
    return (process.env.NEXT_PUBLIC_PREVIEW_SITE_URL ?? 'https://preview.manualdecocina.com').replace(/\/$/, '')
  }
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://manualdecocina.com').replace(/\/$/, '')
}

export function isIndexingAllowed(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'
}

/** Origen desde el que los bots sociales deben cargar assets locales.
 * Las imágenes OG/Twitter deben existir en el host que despliega los assets. */
export function getAssetBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')
  if (!isIndexingAllowed()) {
    return (process.env.NEXT_PUBLIC_PREVIEW_SITE_URL ?? 'https://preview.manualdecocina.com').replace(/\/$/, '')
  }
  return getSiteUrl()
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

/** AdSense queda fail-closed hasta que el nuevo sitio tenga una CMP certificada/TCF
 * configurada. Evita activar monetización personalizada solo con el banner casero. */
export function adsenseCmpReady(): boolean {
  return process.env.NEXT_PUBLIC_GOOGLE_CMP_READY === 'true'
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

/** Stored public paths are authoritative, including historical trailing slashes. */
export function publicPathHref(path: string): string {
  return path ? (path.startsWith('/') ? path : '/' + path) : '/'
}

/** The existing Portuguese catalog is Brazilian Portuguese; /pt remains its route key. */
export function languageTag(language: string): string {
  return language === 'pt' ? 'pt-BR' : language
}

export function recipeUrl(language: RecipeLanguage | string, slug: string): string {
  return `${getSiteUrl()}${recipePath(language, slug)}`
}

export function publicUrl(publicPath: string): string {
  return `${getSiteUrl()}${publicPathHref(publicPath)}`
}

/** Autor editorial de las recetas. La biografía completa vive en la página "Quiénes somos". */
export const RECIPE_AUTHOR = { name: 'Néstor Bastidas', aboutPath: 'quienes-somos' } as const

export function authorUrl(language: string): string {
  return `${getSiteUrl()}/${language}/${RECIPE_AUTHOR.aboutPath}`
}

/** URL absoluta para imágenes: acepta rutas locales (/recetas/...) o URLs completas.
 * Las rutas locales usan el host real de assets, que puede diferir del canonical en preview. */
export function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : `${getAssetBaseUrl()}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}
