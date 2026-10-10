/** Server-only ratings environment resolver.
 * An empty SUPABASE_SERVICE_ROLE_KEY must not shadow a valid secret key.
 * Never log or expose the actual credential values.
 */
export function readRatingsSecrets(env: {
  SUPABASE_SERVICE_ROLE_KEY?: string
  SUPABASE_SECRET_KEY?: string
  RATINGS_HASH_SECRET?: string
}) {
  return {
    serviceKey: env.SUPABASE_SERVICE_ROLE_KEY?.trim() || env.SUPABASE_SECRET_KEY?.trim() || '',
    hashSecret: env.RATINGS_HASH_SECRET?.trim() || '',
  }
}
