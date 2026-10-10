/**
 * PostgREST OR filters use commas/parentheses as grammar. The ILIKE pattern
 * must be quoted so searches such as "pollo, cebolla" remain data, never syntax.
 * Supabase URL-encodes the expression when serializing the HTTP query.
 */
export function recipeSearchOrFilter(search: string): string {
  const escaped = search.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const pattern = `"%${escaped}%"`
  return `title.ilike.${pattern},excerpt.ilike.${pattern}`
}
