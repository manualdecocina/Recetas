import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './LoginForm'
import { AuthCard } from '../AuthCard'

export const metadata: Metadata = {
  title: 'Iniciar sesión — Manual de Cocina',
  robots: { index: false, follow: false },
}

// Solo login: no hay registro público. Las cuentas se crean desde el dashboard de
// Supabase y se autorizan agregándolas a la tabla admins.
export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  const { aviso } = await searchParams
  return (
    <AuthCard title="Panel de administración" subtitle="Entra para revisar y publicar recetas.">
      {aviso === 'contrasena-cambiada' && (
        <p className="adm-notice adm-notice-ok" role="status">Contraseña actualizada. Ya puedes entrar.</p>
      )}
      {aviso === 'enlace-invalido' && (
        <p className="adm-notice adm-notice-error" role="alert">El enlace venció o ya se usó. Pide uno nuevo.</p>
      )}
      <LoginForm />
      <p className="adm-auth-foot"><Link href="/admin/recuperar">¿Olvidaste tu contraseña?</Link></p>
    </AuthCard>
  )
}
