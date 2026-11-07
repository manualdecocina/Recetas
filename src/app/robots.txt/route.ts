import { getSiteUrl, isIndexingAllowed } from '@/lib/site'

// Preserve the production indexing rules and keep preview fully disallowed.
// Advertise the URL-level sitemap directly: some host scanners do not follow sitemap indexes.
// A custom route is necessary: MetadataRoute.Robots does not support Content-Signal.
export function robotsText(): string {
  if (!isIndexingAllowed()) return [
    'User-agent: *',
    'Disallow: /',
    'Content-Signal: search=no, ai-train=no',
    '',
  ].join('\n')

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Content-Signal: search=yes, ai-train=no',
    `Sitemap: ${getSiteUrl()}/sitemap.xml`,
    '',
  ].join('\n')
}

export function GET() {
  return new Response(robotsText(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
