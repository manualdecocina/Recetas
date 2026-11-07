import { getSiteUrl } from '@/lib/site'
import { supabase } from '@/lib/supabase/public'

// Keep the historical WordPress sitemap index linked by robots.txt and Search Console.
// Unlike a build timestamp, lastmod reflects a real revision or the latest
// published recipe, ingredient or content-page change.
export const revalidate = 3600

const SITEMAP_REVISION = '2026-11-07T00:00:00.000Z'

/** Returns the latest valid UTC timestamp without inventing dates for every request. */
export function latestSitemapChange(values: Array<string | null | undefined>): string {
  const timestamps = values
    .map(value => value ? Date.parse(value) : Number.NaN)
    .filter(value => Number.isFinite(value))
  return new Date(Math.max(Date.parse(SITEMAP_REVISION), ...timestamps)).toISOString()
}

async function sitemapLastmod(): Promise<string> {
  const [recipes, pages, ingredients] = await Promise.all([
    supabase.from('recipes').select('updated_at')
      .eq('published', true).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('content_pages').select('updated_at')
      .eq('published', true).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('ingredients').select('updated_at')
      .eq('status', 'canonical').eq('indexable', true)
      .order('updated_at', { ascending: false }).limit(1).maybeSingle(),
  ])
  if (recipes.error || pages.error || ingredients.error) {
    // The index must remain available if a read-only upstream lookup fails.
    return SITEMAP_REVISION
  }
  return latestSitemapChange([
    recipes.data?.updated_at, pages.data?.updated_at, ingredients.data?.updated_at,
  ])
}

export async function GET() {
  const sitemapUrl = `${getSiteUrl()}/sitemap.xml`
  let lastmod = SITEMAP_REVISION
  try { lastmod = await sitemapLastmod() } catch { /* Keep a valid index on upstream failures. */ }
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap><loc>${sitemapUrl}</loc><lastmod>${lastmod}</lastmod></sitemap>`,
    '</sitemapindex>',
  ].join('\n')

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
    },
  })
}
