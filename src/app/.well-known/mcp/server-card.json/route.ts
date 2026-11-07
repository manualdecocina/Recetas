import { getSiteUrl } from '@/lib/site'
import { legacyMcpCard } from '@/lib/mcp-manifest'

// SEP-1649 compatibility endpoint; describes real read-only /mcp tools.
export function GET() {
  return Response.json(legacyMcpCard(getSiteUrl()), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
