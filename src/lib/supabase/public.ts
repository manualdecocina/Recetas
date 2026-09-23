import { createClient } from '@supabase/supabase-js'
import { PUBLIC_REVALIDATE_SECONDS, RECIPES_CACHE_TAG } from '@/lib/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://eqbdtctxbpepbeickhqi.supabase.co'
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'sb_publishable_5j3BnF3q24MVuU-BTEVzbg_UXTyp6CM'

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.local. ' +
      'Cópialos desde Supabase → Project Settings → API.'
  )
}

// fetch con caché EXPLÍCITA de Next 14 para todas las lecturas públicas.
// Motivo: supabase-js envía la cabecera Authorization (anon key) y, sin opciones
// explícitas, Next 14 decide cachear o no según heurísticas del segmento. Aquí se fija:
//   - tags: permite invalidar todo el contenido público con revalidateTag('recipes');
//   - revalidate: respaldo por tiempo.
// Se llama a globalThis.fetch en cada petición para usar el fetch parcheado por Next.
const taggedFetch: typeof fetch = (input, init) =>
  globalThis.fetch(input, {
    ...init,
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [RECIPES_CACHE_TAG] },
  })

// Cliente público (sin sesión): solo lee recetas publicadas (RLS "public read published recipes").
// Usado en páginas públicas y sitemap. El panel admin usa ./server.ts (sin caché, con sesión).
export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: { fetch: taggedFetch },
  auth: { persistSession: false, autoRefreshToken: false },
})
