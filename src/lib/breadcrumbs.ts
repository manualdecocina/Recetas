import { publicUrl } from '@/lib/site'

export interface BreadcrumbItem {
  name: string
  /** Ruta pública interna (por ejemplo "/es/categorias/postres"). */
  path: string
}

/** BreadcrumbList JSON-LD que reproduce exactamente la miga de pan visible.
 * Cada ListItem lleva position, name e item absoluto en el dominio actual (preview o producción). */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: publicUrl(item.path),
    })),
  }
}
