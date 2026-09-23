import { signOutAction } from './actions'

export function NotAdmin({ email }: { email?: string }) {
  return (
    <main>
      <h1>Sin permisos</h1>
      <p>
        La cuenta {email ?? ''} inició sesión, pero no está autorizada como administrador.
        Para autorizarla, agrega su user_id a la tabla <code>admins</code> desde el dashboard de Supabase.
      </p>
      <form action={signOutAction}>
        <button type="submit">Cerrar sesión</button>
      </form>
    </main>
  )
}
