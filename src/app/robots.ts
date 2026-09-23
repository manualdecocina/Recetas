import type { MetadataRoute } from 'next'
import { getSiteUrl, isIndexingAllowed } from '@/lib/site'

// Con NEXT_PUBLIC_ALLOW_INDEXING distinto de "true" (preview.manualdecocina.com, etc.)
// bloquea todo. En producción nunca bloquea rutas de idioma (causa de la caída anterior).
export default function robots(): MetadataRoute.Robots {
  if (!isIndexingAllowed()) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/admin/' }],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}
