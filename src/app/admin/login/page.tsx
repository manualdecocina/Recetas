import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar sesión — Manual de Cocina',
  robots: { index: false, follow: false },
}

// Solo login: no hay registro público. Las cuentas se crean desde el dashboard de
// Supabase y se autorizan agregándolas a la tabla admins.
export default function AdminLoginPage() {
  return (
    <main>
      <h1>Iniciar sesión</h1>
      <LoginForm />
    </main>
  )
}
