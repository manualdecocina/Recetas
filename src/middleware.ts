import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { DEFAULT_LANGUAGE } from '@/types/recipe'
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from '@/lib/supabase/keys'
import { buildSlashMap, slashRedirectTarget, type SlashMap, type SlashRow } from '@/lib/trailing-slash'

// ── Una sola URL por receta ─────────────────────────────────────────────────────────────
// Lista de recetas publicadas → si su canónica lleva barra final. Se guarda en memoria
// 10 minutos. Si Supabase falla o tarda, la petición sigue igual que siempre (nunca bloquea
// ni rompe una página): en el peor caso, simplemente no se redirige.
const SLASH_TTL_MS = 10 * 60 * 1000
let slashCache: { map: SlashMap; at: number } | null = null
let slashLoading: Promise<SlashMap | null> | null = null

// Mismo cliente y misma llave pública que el sitio (RLS: solo recetas publicadas), sin sesión.
// Cada consulta se corta a los 3 s para no frenar nunca una página.
const slashClient = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
  global: { fetch: (input, init) => globalThis.fetch(input, { ...init, cache: 'no-store', signal: AbortSignal.timeout(3000) }) },
  auth: { persistSession: false, autoRefreshToken: false },
})

async function fetchSlashMap(): Promise<SlashMap | null> {
  const rows: SlashRow[] = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await slashClient.from('recipes').select('public_path, source_url')
      .eq('published', true).not('public_path', 'is', null).order('id').range(from, from + 999)
    if (error) return null
    rows.push(...((data ?? []) as SlashRow[]))
    if (!data || data.length < 1000) break
  }
  return buildSlashMap(rows)
}

async function getSlashMap(): Promise<SlashMap | null> {
  if (slashCache && Date.now() - slashCache.at < SLASH_TTL_MS) return slashCache.map
  if (!slashLoading) {
    slashLoading = fetchSlashMap()
      .then((map) => {
        if (map && map.size > 0) slashCache = { map, at: Date.now() }
        return slashCache?.map ?? null
      })
      .catch(() => slashCache?.map ?? null)
      .finally(() => { slashLoading = null })
  }
  return slashLoading
}

async function recipeSlashRedirect(request: NextRequest): Promise<NextResponse | null> {
  let decoded: string
  try { decoded = decodeURIComponent(request.nextUrl.pathname) } catch { return null }
  const map = await getSlashMap()
  if (!map) return null
  const target = slashRedirectTarget(decoded, map)
  if (!target) return null
  const url = request.nextUrl.clone()
  url.pathname = encodeURI(target) // japonés y acentos van codificados; la query se conserva
  return NextResponse.redirect(url, 301)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Raíz → idioma por defecto. 308 (permanente): /es es la home canónica en español,
  // como lo era la raíz del sitio anterior. Sin detección de idioma a propósito:
  // Googlebot no envía Accept-Language útil y una redirección variable confunde el rastreo.
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `/${DEFAULT_LANGUAGE}`
    return NextResponse.redirect(url, 308)
  }

  // Rutas públicas: solo se corrige la barra final de las recetas. Todo lo demás pasa igual.
  if (pathname !== '/admin' && !pathname.startsWith('/admin/')) {
    return (await recipeSlashRedirect(request)) ?? NextResponse.next()
  }

  // A partir de aquí solo /admin/* (ver matcher).
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginPage = pathname === '/admin/login'
  // Páginas del panel que se abren sin sesión: entrar, pedir el correo de recuperación
  // y el destino del enlace de ese correo (que es justo el que crea la sesión).
  const isPublicAuthPage = isLoginPage || pathname === '/admin/recuperar' || pathname === '/admin/auth/callback'

  if (!user && !isPublicAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (user && (isLoginPage || pathname === '/admin/recuperar')) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  // Además de la raíz y el panel, las rutas públicas que podrían ser recetas: se excluyen
  // archivos (cualquier ruta con punto: imágenes, sitemap.xml, robots.txt, ads.txt…),
  // /_next y /api. Ninguna receta publicada tiene punto en la ruta (verificado en la base).
  // (/admin también entra por este patrón; el código lo separa más arriba.)
  matcher: ['/', '/admin', '/admin/:path*', '/((?!_next/|api/|.*\\.).+)'],
}
