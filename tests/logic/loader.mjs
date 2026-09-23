// Resuelve el alias "@/" y sustituye el cliente de Supabase por un mock en memoria,
// para probar la lógica pura sin instalar dependencias ni tocar la base real.
import { pathToFileURL } from 'node:url'
import { existsSync } from 'node:fs'
const SRC = new URL('../../src/', import.meta.url).pathname
export async function resolve(specifier, context, next) {
  if (specifier === '@/lib/supabase/public') return { url: new URL('./mock-supabase.mjs', import.meta.url).href, shortCircuit: true }
  if (specifier === 'next') return { url: 'data:text/javascript,export default {}', shortCircuit: true }
  if (specifier.startsWith('@/')) {
    const base = SRC + specifier.slice(2)
    for (const c of [base + '.ts', base + '.tsx', base + '/index.ts']) {
      if (existsSync(c)) return next(pathToFileURL(c).href, context)
    }
  }
  return next(specifier, context)
}
