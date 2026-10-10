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
export function parseRecipePage(value?: string): number {
  if (!value || !/^[1-9]\d{0,5}$/.test(value)) return 1
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : 1
}
