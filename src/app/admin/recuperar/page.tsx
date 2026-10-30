import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthCard } from '../AuthCard'
import { RecoverForm } from './RecoverForm'

export const metadata: Metadata = {
  title: 'Recuperar contraseña — Manual de Cocina',
  robots: { index: false, follow: false },
}

export default function RecoverPasswordPage() {
  return (
    <AuthCard title="Recuperar contraseña" subtitle="Escribe tu correo y te mandamos un enlace para crear una contraseña nueva.">
      <RecoverForm />
      <p className="adm-auth-foot"><Link href="/admin/login">Volver a iniciar sesión</Link></p>
    </AuthCard>
  )
}
