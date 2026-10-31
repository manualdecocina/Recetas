/**
 * Reglas de longitud del título y la descripción que ve Google. Funciones puras para
 * poder usarlas en el servidor (página de salud, validación al guardar) y en el
 * navegador (contador mientras se escribe).
 *
 * El título se mide sin " | Manual de Cocina": el sitio lo añade siempre.
 */

export const SEO_LIMITS = {
  titleMin: 30,
  titleMax: 60,
  descriptionMin: 120,
  descriptionMax: 160,
  // Límites duros al guardar: fuera de esto el texto está claramente roto.
  titleHardMin: 10,
  titleHardMax: 100,
  descriptionHardMin: 50,
  descriptionHardMax: 300,
} as const

/** Cuándo avisar en Salud del sitio. El rango ideal de arriba sirve de guía mientras se escribe,
 * pero quedarse 2–5 caracteres por fuera casi no se nota en Google (corta por ancho en pantalla
 * y a menudo reescribe el texto). La lista de Salud solo marca lo que de verdad se corta o queda pobre. */
export const SEO_ALERT_LIMITS = {
  titleMin: 20,
  titleMax: 70,
  descriptionMin: 80,
  descriptionMax: 180,
} as const

export type LengthStatus = 'ok' | 'corto' | 'largo'

/** Longitud en caracteres visibles (los emoji y acentos cuentan como uno). */
export function visibleLength(value: string): number {
  return Array.from(value.trim()).length
}

export function titleStatus(title: string): LengthStatus {
  const n = visibleLength(title)
  if (n < SEO_LIMITS.titleMin) return 'corto'
  if (n > SEO_LIMITS.titleMax) return 'largo'
  return 'ok'
}

export function descriptionStatus(description: string): LengthStatus {
  const n = visibleLength(description)
  if (n < SEO_LIMITS.descriptionMin) return 'corto'
  if (n > SEO_LIMITS.descriptionMax) return 'largo'
  return 'ok'
}

/** Japonés usa caracteres de doble ancho: Google corta mucho antes, así que no se
 * mide con las mismas reglas que los idiomas con alfabeto latino. */
export function measuresLength(language: string): boolean {
  return language !== 'ja'
}

/** Problemas de longitud que vale la pena arreglar, en palabras sencillas. Lista vacía = bien. */
export function seoLengthIssues(language: string, title: string, description: string): string[] {
  if (!measuresLength(language)) return []
  const issues: string[] = []
  const t = visibleLength(title)
  const d = visibleLength(description)
  if (t > SEO_ALERT_LIMITS.titleMax) issues.push(`título largo (${t} caracteres): Google lo corta`)
  if (t < SEO_ALERT_LIMITS.titleMin) issues.push(`título muy corto (${t} caracteres)`)
  if (d > SEO_ALERT_LIMITS.descriptionMax) issues.push(`descripción larga (${d} caracteres): Google la corta`)
  if (d < SEO_ALERT_LIMITS.descriptionMin) issues.push(`descripción muy corta (${d} caracteres): desaprovecha espacio`)
  return issues
}

/** Error que impide guardar, o null si se puede guardar. */
export function seoSaveError(title: string, description: string): string | null {
  const t = visibleLength(title)
  const d = visibleLength(description)
  if (t < SEO_LIMITS.titleHardMin) return `El título es demasiado corto (${t} caracteres).`
  if (t > SEO_LIMITS.titleHardMax) return `El título es demasiado largo (${t} caracteres, máximo ${SEO_LIMITS.titleHardMax}).`
  if (d < SEO_LIMITS.descriptionHardMin) return `La descripción es demasiado corta (${d} caracteres).`
  if (d > SEO_LIMITS.descriptionHardMax) return `La descripción es demasiado larga (${d} caracteres, máximo ${SEO_LIMITS.descriptionHardMax}).`
  if (/[<>]/.test(title) || /[<>]/.test(description)) return 'Quita los signos < y >: no van en el título ni en la descripción.'
  return null
}
