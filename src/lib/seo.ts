import type { Metadata } from 'next'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/types/recipe'
import { getSiteUrl } from '@/lib/site'

// Tipo exacto que Next espera para alternates.languages.
type Languages = NonNullable<NonNullable<Metadata['alternates']>['languages']>

// Alternates para páginas que existen en TODOS los idiomas (home y listado).
// path recibe el idioma y devuelve la ruta, ej. (l) => `/${l}/recetas`.
export function allLanguageAlternates(
  currentPath: string,
  path: (language: string) => string
): Metadata['alternates'] {
  const site = getSiteUrl()
  const map: Record<string, string> = {}
  for (const l of SUPPORTED_LANGUAGES) map[l] = `${site}${path(l)}`
  map['x-default'] = `${site}${path(DEFAULT_LANGUAGE)}`
  return { canonical: `${site}${currentPath}`, languages: map as Languages }
}

// Alternates para una receta: SOLO las traducciones publicadas que existen de verdad.
// Reglas (ver documento de arquitectura):
//  - canonical: siempre la propia URL (cada idioma es su propia canonical).
//  - hreflang: incluye la propia versión + cada traducción publicada.
//  - x-default: la versión en español si existe; si no existe, se omite
//    (no se apunta x-default a una página de otro idioma elegida al azar).
//  - una receta sin traducciones no declara hreflang (solo canonical).
export function recipeAlternates(
  current: { language: string; slug: string },
  translations: { language: string; slug: string }[]
): Metadata['alternates'] {
  const site = getSiteUrl()
  const canonical = `${site}/${current.language}/receta/${current.slug}`
  if (translations.length <= 1) return { canonical }

  const map: Record<string, string> = {}
  for (const t of translations) map[t.language] = `${site}/${t.language}/receta/${t.slug}`
  const spanish = translations.find((t) => t.language === DEFAULT_LANGUAGE)
  if (spanish) map['x-default'] = `${site}/${spanish.language}/receta/${spanish.slug}`
  return { canonical, languages: map as Languages }
}
