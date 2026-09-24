// Simula el cliente público: filas publicadas de recetas y páginas.
function query(kind) {
  const source = kind === 'content_pages'
    ? (globalThis.__CONTENT_PAGES__ ?? [])
    : (globalThis.__ROWS__ ?? [])
  let from = 0, to = Infinity
  const q = {
    select() { return q },
    eq() { return q },
    order() { return q },
    range(a, b) { from = a; to = b; return q },
    then(res) { res({ data: source.slice(from, to + 1), error: null }) },
    maybeSingle() { res({ data: source[0] ?? null, error: null }) },
  }
  return q
}
export const supabase = { from: (table) => query(table) }
