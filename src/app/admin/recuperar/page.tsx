import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthCard } from '../AuthCard'
import { RecoverForm } from './RecoverForm'
import { isMysqlCutoverEnabled } from '@/lib/mysql/cutover-config'
import { resetMysqlPasswordAction } from './actions'

export const metadata: Metadata = {
  title: 'Recuperar contraseña — Manual de Cocina',
  robots: { index: false, follow: false },
}

export default async function RecoverPasswordPage({
  searchParams,
}:{
  searchParams:Promise<{aviso?:string}>,
}) {
  const {aviso}=await searchParams
  if (isMysqlCutoverEnabled()) {
    return <AuthCard title="Recuperar acceso MySQL"
      subtitle="Recuperación mediante clave privada del propietario, configurada en Hostinger.">
      {aviso==='error'&&<p role="alert" className="adm-notice adm-notice-error">No se pudo recuperar el acceso. Comprueba la clave y los datos.</p>}
      <form action={resetMysqlPasswordAction} className="adm-auth-form">
        <label htmlFor="email">Correo del administrador</label>
        <input id="email" name="email" type="email" autoComplete="email" required/>
        <label htmlFor="setup_secret">Clave de recuperación privada de Hostinger</label>
        <input id="setup_secret" name="setup_secret" type="password" autoComplete="off" required/>
        <label htmlFor="password">Nueva contraseña (mínimo 14 caracteres, mayúscula, minúscula y número)</label>
        <input id="password" name="password" type="password" minLength={14} autoComplete="new-password" required/>
        <label htmlFor="confirm">Confirmar nueva contraseña</label>
        <input id="confirm" name="confirm" type="password" minLength={14} autoComplete="new-password" required/>
        <button className="adm-btn adm-btn-primary" type="submit">Restablecer acceso</button>
      </form>
      <p className="adm-auth-foot"><Link href="/admin/login">Volver a iniciar sesión</Link></p>
    </AuthCard>
  }
  return (
    <AuthCard title="Recuperar contraseña" subtitle="Escribe tu correo y te mandamos un enlace para crear una contraseña nueva.">
      <RecoverForm />
      <p className="adm-auth-foot"><Link href="/admin/login">Volver a iniciar sesión</Link></p>
    </AuthCard>
  )
}
