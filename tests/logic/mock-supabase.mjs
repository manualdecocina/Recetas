// Simula el cliente público: devuelve filas publicadas en lotes, como PostgREST.
const ROWS = globalThis.__ROWS__ ?? []
function query() {
  let from = 0, to = Infinity
  const q = {
    select() { return q }, eq() { return q }, order() { return q },
    range(a, b) { from = a; to = b; return q },
    then(res) { res({ data: ROWS.slice(from, to + 1), error: null }) },
  }
  return q
}
export const supabase = { from: () => query() }
