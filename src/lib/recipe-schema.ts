import { absoluteUrl, getSiteUrl, recipeCanonicalUrl } from '@/lib/site'

/** Full publisher entity: match the Organization in the root layout by @id,
 * while also making the Recipe publisher self-contained for schema validators. */
export function recipePublisher() {
  const site = getSiteUrl()
  return {
    '@type': 'Organization',
    '@id': `${site}/#organization`,
    name: 'Manual de Cocina',
    url: site,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/brand/logo-manual-de-cocina.png'),
    },
  }
}

/** HowToStep anchors must use the same canonical URL as the containing Recipe.
 * Historical WordPress KEEP URLs include their original trailing slash. */
export function recipeStepAnchor(recipe: { public_path: string; source_url?: string | null }, position: number): string {
  return `${recipeCanonicalUrl(recipe)}#paso-${position}`
}

/** A real, small sample remains visible in the rating widget but does not produce
 * AggregateRating structured data until at least five genuine votes exist. */
export const MIN_AGGREGATE_RATING_VOTES = 5

export function shouldPublishAggregateRating(enabled: boolean, voteCount: number): boolean {
  return enabled && Number.isInteger(voteCount) && voteCount >= MIN_AGGREGATE_RATING_VOTES
}
