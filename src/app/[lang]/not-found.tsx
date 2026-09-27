'use client'

import { usePathname } from 'next/navigation'
import LocalizedNotFound from '@/components/md/LocalizedNotFound'
import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

// Next no pasa params a not-found: el idioma se deduce del primer segmento de la URL.
export default function NotFound() {
  const first = (usePathname() ?? '').split('/')[1] ?? ''
  const lang: RecipeLanguage = (SUPPORTED_LANGUAGES as string[]).includes(first) ? (first as RecipeLanguage) : 'es'
  return <LocalizedNotFound lang={lang} />
}
