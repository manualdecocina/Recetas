/**
 * PostgREST rejects a requested offset beyond the total result count with
 * PGRST103 (HTTP 416). On public catalog pages this is a missing page,
 * not a runtime/server failure. Treat only this specific error as 404;
 * other database errors must still be reported normally.
 */
export function isUnsatisfiableRecipePage(error: { code?: string | null } | null): boolean {
  return error?.code === 'PGRST103'
}

/** Ignore malformed page numbers rather than running expensive/unsafe offsets. */
export function firstQueryValue(value?: string | string[]): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export function parseRecipePage(value?: string | string[]): number {
  const first = firstQueryValue(value)
  if (!first || !/^[1-9]\d{0,5}$/.test(first)) return 1
  const parsed = Number(first)
  return Number.isSafeInteger(parsed) ? parsed : 1
}
