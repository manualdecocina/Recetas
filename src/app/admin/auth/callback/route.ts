import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// Destino del enlace del correo de recuperación. Convierte el código del enlace en una
// sesión (cookies) y lleva a la página para crear la contraseña nueva.
// Solo redirige dentro de /admin para que el enlace no pueda usarse para saltar a otro sitio.
export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const nextParam = url.searchParams.get('next') ?? '/admin'
  const next = nextParam.startsWith('/admin') && !nextParam.startsWith('//') ? nextParam : '/admin'
  const supabase = await createSupabaseServerClient()

  const code = url.searchParams.get('code')
  const tokenHash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null

  let ok = false
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    ok = !error
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    ok = !error
  }

  const target = url.clone()
  target.search = ''
  if (ok) {
    target.pathname = next
  } else {
    target.pathname = '/admin/login'
    target.searchParams.set('aviso', 'enlace-invalido')
  }
  return NextResponse.redirect(target)
}
