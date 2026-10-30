import type { Metadata } from 'next'
import { AuthCard } from '../AuthCard'
import { NewPasswordForm } from './NewPasswordForm'

export const metadata: Metadata = {
  title: 'Nueva contraseña — Manual de Cocina',
  robots: { index: false, follow: false },
}

export default function NewPasswordPage() {
  return (
    <AuthCard title="Crea tu contraseña nueva" subtitle="Mínimo 8 caracteres. Después entrarás con ella.">
      <NewPasswordForm />
    </AuthCard>
  )
}
