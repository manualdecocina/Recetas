/** Navidad permanece primera; el resto se ordena por fecha editorial, de más nueva a más antigua. */
export function orderCollections<T extends { id: string; publishedAt?: string }>(collections: readonly T[]): T[] {
  return [...collections].sort((a, b) => {
    if (a.id === 'navidad-colombiana') return b.id === a.id ? 0 : -1
    if (b.id === 'navidad-colombiana') return 1
    return (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')
  })
}

export const HOME_COLLECTION_LIMIT = 2

/** Solo estas colecciones requieren cargar recetas para el inicio. El índice conserva todas. */
export function homeCollections<T extends { id: string; publishedAt?: string }>(collections: readonly T[]): T[] {
  return orderCollections(collections).slice(0, HOME_COLLECTION_LIMIT)
}
