/** Correcciones editoriales seguras de recetas publicadas.
 * No reinterpreta cantidades, reordena ingredientes, ni reconstruye metadatos.
 * Sólo cambia el nombre y, si se solicita, su aclaración ("preparation").
 */
export function correctedIngredientDetails(
  source: unknown, position: number, expectedName: string, expectedPreparation: string,
  nextName: string, nextPreparation: string,
): { changed: boolean; ingredients: unknown[] } {
  if (!Array.isArray(source) || source.length < 1 || source.length > 100) {
    throw new Error('Lista de ingredientes no válida')
  }
  if (!Number.isSafeInteger(position) || position < 0 || position >= source.length) {
    throw new Error('Posición de ingrediente inválida')
  }
  const selected = source[position]
  if (!selected || typeof selected !== 'object' || Array.isArray(selected) ||
      typeof selected.name !== 'string' ||
      (selected.preparation != null && typeof selected.preparation !== 'string')) {
    throw new Error('Ingrediente inválido')
  }
  const currentPreparation: string = typeof selected.preparation === 'string' ? selected.preparation : ''
  if (typeof expectedName !== 'string' || selected.name !== expectedName ||
      typeof expectedPreparation !== 'string' || currentPreparation !== expectedPreparation) {
    throw new Error('El ingrediente cambió desde que abriste la ficha; actualiza la página')
  }
  if (typeof nextName !== 'string' || !nextName.trim() || nextName.length > 200 ||
      nextName !== nextName.trim() || /[\r\n]/.test(nextName) ||
      typeof nextPreparation !== 'string' || nextPreparation.length > 200 ||
      nextPreparation !== nextPreparation.trim() || /[\r\n]/.test(nextPreparation)) {
    throw new Error('Nombre o aclaración de ingrediente inválidos')
  }
  if (nextName === expectedName && nextPreparation === expectedPreparation) {
    return { changed: false, ingredients: source }
  }
  const updated = { ...selected, name: nextName }
  if (nextPreparation !== currentPreparation) {
    if (nextPreparation) updated.preparation = nextPreparation
    else delete updated.preparation
  }
  return {
    changed: true,
    ingredients: source.map((ingredient, i) => i === position ? updated : ingredient),
  }
}
