import { SUPPORTED_LANGUAGES, type RecipeLanguage } from '@/types/recipe'

/**
 * Contenido de una página legal/institucional simple (aviso legal, cookies, privacidad, etc.):
 * un bloque de introducción opcional y una lista de secciones con encabezado opcional y cuerpo
 * en HTML de confianza (escrito a mano aquí, nunca a partir de datos de usuario).
 */
export interface LegalSection {
  heading?: string
  html: string
}

export interface LegalPageContent {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  title: string
  intro?: string
  sections: LegalSection[]
}

export type LegalPageContentMap = Record<RecipeLanguage, LegalPageContent>

/** Mismo criterio que el resto del sitio: si el segmento de idioma no es válido, usa español. */
export function resolveLegalLanguage(lang: string): RecipeLanguage {
  return (SUPPORTED_LANGUAGES as string[]).includes(lang) ? (lang as RecipeLanguage) : 'es'
}
