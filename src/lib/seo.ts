import type { Metadata } from 'next'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'
import { getSiteUrl, normalizePublicPath, publicUrl, absoluteUrl, languageTag, isIndexingAllowed } from '@/lib/site'

export const SITE_NAME = 'Manual de Cocina'
const TITLE_SUFFIX = ` | ${SITE_NAME}`

/** Añade " | Manual de Cocina" una única vez, aunque el título ya lo traiga (SQL manual, etc.). */
export function withSiteName(title: string): string {
  const base = title.endsWith(TITLE_SUFFIX) ? title.slice(0, -TITLE_SUFFIX.length) : title
  return `${base}${TITLE_SUFFIX}`
}

/** Robots único del sitio público. Sin NEXT_PUBLIC_ALLOW_INDEXING="true" (preview) devuelve
 * noindex/nofollow también para googlebot. Las páginas que declaran `robots` propio deben usar
 * esta función: un objeto robots en una página reemplaza el del layout y podía reabrir la indexación. */
export function siteRobots(): NonNullable<Metadata['robots']> {
  const allow = isIndexingAllowed()
  return {
    index: allow,
    follow: allow,
    googleBot: allow
      ? { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 }
      : { index: false, follow: false },
  }
}

type Languages = NonNullable<NonNullable<Metadata['alternates']>['languages']>

export function allLanguageAlternates(
  currentPath: string,
  path: (language: string) => string
): Metadata['alternates'] {
  const site = getSiteUrl()
  const map: Record<string, string> = {}
  for (const l of SUPPORTED_LANGUAGES) map[languageTag(l)] = `${site}${normalizePublicPath(path(l))}`
  return { canonical: `${site}${normalizePublicPath(currentPath)}`, languages: withXDefault(map) as Languages }
}

/** Las páginas generales apuntan x-default al español cuando existe.
 * Las recetas solo incluyen sus idiomas publicados, sin x-default. */
export const X_DEFAULT = 'x-default'
export const X_DEFAULT_LANGUAGE = 'es'

/** Añade x-default a un mapa hreflang → URL ya construido, según la política única. */
export function withXDefault(map: Record<string, string>): Record<string, string> {
  const target = map[languageTag(X_DEFAULT_LANGUAGE)]
  return target ? { ...map, [X_DEFAULT]: target } : map
}

export interface RecipeSeoPath {
  language: string
  public_path: string
}

export function recipeAlternates(
  current: RecipeSeoPath,
  translations: RecipeSeoPath[]
): Metadata['alternates'] {
  const canonical = publicUrl(current.public_path)
  if (translations.length <= 1) return { canonical }

  const map: Record<string, string> = {}
  for (const t of translations) map[languageTag(t.language)] = publicUrl(t.public_path)
  // Cada versión enlaza a todas las traducciones publicadas, incluida ella misma.
  map[languageTag(current.language)] = canonical

  return { canonical, languages: map as Languages }
}

/** Título y descripción para buscadores: usa `seo.title` / `seo.description` si existen. */
export function recipeMetaText(recipe: { title: string; excerpt: string | null; seo?: Record<string, unknown> | null }): { title: string; description: string | undefined } {
  const seo = recipe.seo ?? {}
  const rawTitle = typeof seo.title === 'string' && seo.title.trim() ? seo.title.trim() : recipe.title
  const description = typeof seo.description === 'string' && seo.description.trim() ? seo.description.trim() : (recipe.excerpt ?? undefined)
  return { title: withSiteName(rawTitle), description }
}


/** Imágenes sociales de una receta. Si seo.image_variants contiene las variantes
 * 1:1/4:3/16:9, se publican antes de la portada principal. Sin variantes mantiene
 * el comportamiento histórico de una sola portada. */
export function recipeSocialImages(recipe: {
  title: string
  image_url: string | null
  seo?: Record<string, unknown> | null
}): Array<{ url: string; alt: string }> | undefined {
  const seo = recipe.seo ?? {}
  const variants = Array.isArray(seo.image_variants)
    ? seo.image_variants.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    : []
  const urls = [...variants, recipe.image_url]
    .filter((value): value is string => Boolean(value))
    .map(absoluteUrl)
    .filter((url, index, all) => all.indexOf(url) === index)

  return urls.length ? urls.map((url) => ({ url, alt: recipe.title })) : undefined
}
