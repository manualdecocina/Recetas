'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/site'
import type { FormState } from '../form-state'

const emailSchema = z.string().trim().email('Correo no válido')

/** Envía el correo para crear una contraseña nueva. La respuesta es la misma exista o no
 * la cuenta, para no revelar qué correos están registrados. */
export async function requestPasswordResetAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = emailSchema.safeParse(formData.get('email'))
  if (!email.success) return { ok: false, fieldErrors: { email: ['Correo no válido'] } }

  const supabase = await createSupabaseServerClient()
  const redirectTo = `${getSiteUrl()}/admin/auth/callback?next=/admin/nueva-contrasena`
  const { error } = await supabase.auth.resetPasswordForEmail(email.data, { redirectTo })
  if (error) console.error('[admin] reset password', error.status, error.message)

  return { ok: true, message: 'Si ese correo es de un administrador, te llegará un enlace en unos minutos. Revisa también la carpeta de spam.' }
}

const passwordSchema = z.object({
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirm: z.string(),
}).refine((v) => v.password === v.confirm, { message: 'Las contraseñas no coinciden', path: ['confirm'] })

export async function updatePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = passwordSchema.safeParse({ password: formData.get('password'), confirm: formData.get('confirm') })
  if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login?aviso=enlace-invalido')

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) return { ok: false, message: 'No se pudo cambiar la contraseña. Pide un enlace nuevo e inténtalo otra vez.' }

  await supabase.auth.signOut()
  redirect('/admin/login?aviso=contrasena-cambiada')
}
