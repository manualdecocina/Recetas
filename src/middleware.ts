import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { DEFAULT_LANGUAGE } from '@/types/recipe'
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from '@/lib/supabase/keys'

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
  matcher: ['/', '/admin', '/admin/:path*'],
}
