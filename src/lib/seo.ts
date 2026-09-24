import type { Metadata } from 'next'
import { SUPPORTED_LANGUAGES } from '@/types/recipe'
import { getSiteUrl, normalizePublicPath, publicUrl } from '@/lib/site'

type Languages = NonNullable<NonNullable<Metadata['alternates']>['languages']>

export function allLanguageAlternates(
  currentPath: string,
  path: (language: string) => string
): Metadata['alternates'] {
  const site = getSiteUrl()
  const map: Record<string, string> = {}
  for (const l of SUPPORTED_LANGUAGES) map[l] = `${site}${normalizePublicPath(path(l))}`
  return { canonical: `${site}${normalizePublicPath(currentPath)}`, languages: map as Languages }
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
  for (const t of translations) map[t.language] = publicUrl(t.public_path)

  return { canonical, languages: map as Languages }
}
