/** Bounded retries for public reads only. Never repeat a write or an explicitly
 * cancelled request, and never let a stalled upstream occupy a render indefinitely. */
export async function publicReadFetch(
  input: RequestInfo | URL,
  init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
  fetcher: typeof fetch = globalThis.fetch,
): Promise<Response> {
  const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
  if (method !== 'GET' && method !== 'HEAD') return fetcher(input, init)
  const callerSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const timeout = AbortSignal.timeout(12000)
      const signal = callerSignal ? AbortSignal.any([callerSignal, timeout]) : timeout
      const response = await fetcher(input, { ...init, signal })
      if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 1 || callerSignal?.aborted) return response
      await response.body?.cancel().catch(() => {})
    } catch (error) {
      if (attempt === 1 || callerSignal?.aborted) throw error
    }
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  throw new Error('Public read attempts exhausted')
}

/** Share concurrent cache misses, then release the value. Persistent caching and
 * invalidation remain owned by Next; this map must never serve stale data. */
export function coalescePublicLoad<K, T>(pending: Map<K, Promise<T>>, key: K, load: () => Promise<T>): Promise<T> {
  const existing = pending.get(key)
  if (existing) return existing
  const task = Promise.resolve().then(load).finally(() => {
    if (pending.get(key) === task) pending.delete(key)
  })
  pending.set(key, task)
  return task
}
