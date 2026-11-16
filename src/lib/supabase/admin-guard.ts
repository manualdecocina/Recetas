import 'server-only'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from './server'
import type { User } from '@supabase/supabase-js'
import { isMysqlCutoverEnabled } from '@/lib/mysql/cutover-config'
import { getMysqlAdminRead } from '@/lib/mysql/admin-content'

// Doble verificación en el servidor para cada página y acción del panel:
// 1) hay sesión válida (getUser valida el JWT contra Supabase, no solo lee la cookie);
// 2) el usuario está en la tabla admins.
// El middleware solo filtra "sin sesión"; la autorización real se hace aquí y en la RLS.
export async function requireAdmin() {
  if (isMysqlCutoverEnabled()) {
    const mysql = await getMysqlAdminRead()
    if (!mysql) redirect('/admin/login')
    return {
      supabase: mysql.client as unknown as Awaited<ReturnType<typeof createSupabaseServerClient>>,
      user: mysql.user as User,
      isAdmin: true as const,
    }
  }
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
