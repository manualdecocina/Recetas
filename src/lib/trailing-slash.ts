import { normalizePublicPath, recipeCanonicalUrl } from '@/lib/site'

/**
 * Una sola URL por receta.
 *
 * El sitio responde una receta con y sin barra final (next.config: skipTrailingSlashRedirect),
 * porque las URLs históricas de WordPress llevaban barra. La canónica declarada ya es la correcta
 * (recipeCanonicalUrl), pero si las dos variantes responden 200, Google a veces escoge la otra
 * ("Duplicada: Google ha elegido una versión canónica diferente"). Aquí se decide a qué variante
 * redirigir (301) cuando piden la que no es la canónica. Funciones puras: sin red ni base de datos.
 */

export interface SlashRow {
  public_path: string
  source_url?: string | null
}

/** Ruta normalizada (sin barra final) → true si su canónica lleva barra final. */
export type SlashMap = Map<string, boolean>

/** Misma regla que recipeCanonicalUrl: lleva barra solo si coincide con la URL histórica de WordPress. */
export function canonicalWantsSlash(row: SlashRow): boolean {
  return recipeCanonicalUrl(row).endsWith('/')
}

export function buildSlashMap(rows: SlashRow[]): SlashMap {
  const map: SlashMap = new Map()
  for (const row of rows) {
    if (!row.public_path) continue
    const path = normalizePublicPath(row.public_path)
    if (path === '/') continue
    map.set(path, canonicalWantsSlash(row))
  }
  return map
}

/**
 * Si `pathname` (tal como llegó, ya decodificado) es una receta pedida con la barra equivocada,
 * devuelve la ruta canónica a la que hay que redirigir. Si no es una receta, o ya está bien,
 * devuelve null y la petición sigue igual que siempre.
 */
export function slashRedirectTarget(pathname: string, map: SlashMap): string | null {
  if (!pathname || pathname === '/') return null
  // Solo una barra final: "//" u otras rarezas no se tocan.
  if (pathname.endsWith('//')) return null
  const hasSlash = pathname.endsWith('/')
  const path = normalizePublicPath(pathname)
  const wantsSlash = map.get(path)
  if (wantsSlash === undefined) return null
  if (wantsSlash === hasSlash) return null
  return wantsSlash ? `${path}/` : path
}
