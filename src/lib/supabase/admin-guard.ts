import 'server-only'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { getMysqlAdminRead } from '@/lib/mysql/admin-content'
import { createSupabaseServerClient } from './server'

// Doble verificación en el servidor para cada página y acción del panel:
// 1) hay sesión válida (getUser valida el JWT contra Supabase, no solo lee la cookie);
// 2) el usuario está en la tabla admins.
// El middleware solo filtra "sin sesión"; la autorización real se hace aquí y en la RLS.
export async function requireAdmin() {
  // Migración por etapas: únicamente el preview y con el proveedor activado
  // pueden leer el panel con sesión MySQL. El sitio público sigue en Supabase.
  if (process.env.ADMIN_AUTH_PROVIDER === 'mysql') {
    const h = await headers()
    if (h.get('host')?.split(':')[0] !== 'mintcream-squirrel-383743.hostingersite.com') redirect('/admin/login')
    const mysql = await getMysqlAdminRead()
    if (!mysql) redirect('/admin/qa-mysql')
    return {
      supabase: mysql.client as unknown as SupabaseClient,
      user: mysql.user as unknown as User,
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
