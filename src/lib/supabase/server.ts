import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Cliente con la SESIÓN del usuario (cookies). Se usa en el panel admin y en las
// Server Actions. Usa solo la anon key: los permisos los decide la RLS de Supabase
// (is_admin), no una llave privilegiada. No se necesita service_role en ningún punto.
export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Llamado desde un Server Component: no puede escribir cookies.
            // El middleware ya refresca la sesión, así que es seguro ignorarlo.
          }
        },
      },
      // Panel siempre fresco: ninguna lectura con sesión pasa por el Data Cache de Next.
      // (No se deja a la heurística de Next 14; ver docs/cache.md.)
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          globalThis.fetch(input, { ...init, cache: 'no-store' }),
      },
    }
  )
}
