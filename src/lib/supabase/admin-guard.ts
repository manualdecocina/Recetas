import 'server-only'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './server'

// Doble verificación en el servidor para cada página y acción del panel:
// 1) hay sesión válida (getUser valida el JWT contra Supabase, no solo lee la cookie);
// 2) el usuario está en la tabla admins.
// El middleware solo filtra "sin sesión"; la autorización real se hace aquí y en la RLS.
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: isAdmin, error } = await supabase.rpc('is_admin')
  if (error || isAdmin !== true) {
    return { supabase, user, isAdmin: false as const }
  }
  return { supabase, user, isAdmin: true as const }
}
