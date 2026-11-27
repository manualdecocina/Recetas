/**
 * Reglas puras para las redirecciones guardadas en `content_redirects`.
 */

/** Codifica lo que no es ASCII imprimible: Node rechaza una cabecera Location con japonés
 * en crudo (ERR_INVALID_CHAR → error 500). Los %XX ya presentes no se vuelven a codificar. */
export function redirectLocation(path: string): string {
  return path.replace(/[^\x21-\x7e]+/g, (part) => encodeURIComponent(part))
}

const LISTING = /^(\/(es|en|de|fr|it|ja|pt))?\/recetas\/?$/

/** Contenido retirado cuyo único destino es el listado general. Google puede tratarlo como
 * "soft 404", así que debe responder 404. Un listado antiguo que lleva al listado nuevo sí redirige. */
export function isRetiredListingRedirect(sourcePath: string, targetPath: string): boolean {
  return LISTING.test(targetPath) && !LISTING.test(sourcePath)
}
