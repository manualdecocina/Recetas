import { getSiteUrl } from '@/lib/site'

// The former WordPress sitemap index is still present in some Search Console
// properties. Keep it valid after migration instead of returning 404.
export const dynamic = 'force-static'

export function GET() {
  const sitemapUrl = `${getSiteUrl()}/sitemap.xml`
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap><loc>${sitemapUrl}</loc></sitemap>`,
    '</sitemapindex>',
  ].join('\n')

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
