import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies, headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { AuthCard } from '../AuthCard'
import { ADMIN_COOKIE, getAdminByToken } from '@/lib/mysql/admin-auth'
import { adminMysqlPool } from '@/lib/mysql/admin-db'
import { getMysqlAdminRead } from '@/lib/mysql/admin-content'
import { loadQueue } from '@/lib/admin/publication-data'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { RowDataPacket } from 'mysql2'

export const dynamic='force-dynamic'
export const metadata:Metadata={
  title:'Prueba aislada del nuevo acceso — Manual de Cocina',
  robots:{index:false,follow:false},
}
const PREVIEW='mintcream-squirrel-383743.hostingersite.com'
const notices:Record<string,string>={
  entrada_invalida:'Credenciales incorrectas o acceso temporalmente limitado.',
  datos_invalidos:'Revisa los datos y utiliza una contraseña segura de al menos 14 caracteres.',
  no_autorizado:'La clave de instalación no es válida.',
  ya_configurado:'El administrador inicial ya existe.',
  cuenta_creada:'Cuenta preparada. Inicia sesión con la contraseña nueva.',
  bienvenido:'Sesión MySQL iniciada correctamente en el entorno de pruebas.',
  salida:'Sesión cerrada.',
}
export default async function MysqlAuthQAPage({
  searchParams,
}:{
  searchParams:Promise<{aviso?:string}>
}){
  const h=await headers()
  if(h.get('host')?.split(':')[0]!==PREVIEW)notFound()
  const {aviso}=await searchParams
  if(process.env.ADMIN_AUTH_PROVIDER!=='mysql'){
    return <AuthCard title="Acceso MySQL (pruebas)" subtitle="Aún no está activada la autenticación MySQL. El panel real sigue en Supabase.">
      <p>Este entorno está aislado. No se modifican las cuentas ni las recetas públicas.</p>
    </AuthCard>
  }
  let installed=false,empty=true
  try{
    const [rows]=await adminMysqlPool().execute<RowDataPacket[]>('SELECT COUNT(*) AS n FROM admin_auth_users')
    installed=true
    empty=Number(rows[0]?.n??0)===0
  }catch{ /* No se revela el error SQL ni las credenciales. */ }
  if(!installed){
    return <AuthCard title="Esquema administrativo pendiente" subtitle="Importar el esquema 08 en MySQL antes de activar las pruebas de inicio de sesión.">
      <p>El panel original sigue funcionando sin alteraciones.</p>
    </AuthCard>
  }
  const cookie=await cookies()
  const current=await getAdminByToken(cookie.get(ADMIN_COOKIE)?.value)
  if(current){
    let editorialSummary:string|null=null
    try{
      const admin=await getMysqlAdminRead()
      if(admin){
        const queue=await loadQueue(admin.client as unknown as SupabaseClient)
        const published=queue.filter(group=>group.stage==='publicada').length
        const pending=queue.length-published
        editorialSummary='Lectura privada MySQL aprobada: '+queue.length+
          ' grupos editoriales, '+published+' publicados y '+pending+' pendientes o archivados.'
      }
    }catch{
      editorialSummary='Sesión válida, pero falta verificar las consultas editoriales en MySQL.'
    }
    return <AuthCard title="Sesión MySQL comprobada" subtitle="Autenticación en la vista previa, no en el panel público.">
      <p>Acceso autorizado en entorno aislado.</p>
      <p>Usuario: <strong>{current.email}</strong></p>
      <p role="status">{editorialSummary}</p>
      <p><Link href="/admin">Ver cola editorial con lecturas MySQL (vista previa)</Link></p>
      <form method="post" action="/api/rescate-admin">
        <input type="hidden" name="action" value="logout"/>
        <button className="adm-btn adm-btn-primary" type="submit">Cerrar sesión</button>
      </form>
    </AuthCard>
  }
  return <AuthCard title="Acceso MySQL (pruebas)" subtitle="Solo vista previa. No afecta el administrador actual.">
    {aviso&&notices[aviso]&&<p role="status" className="adm-notice">{notices[aviso]}</p>}
    {empty ? (
      process.env.ADMIN_BOOTSTRAP_SECRET?.length && process.env.ADMIN_BOOTSTRAP_SECRET.length>=48
        ? <form method="post" action="/api/rescate-admin" className="adm-auth-form">
            <p>Registrar la primera cuenta. Esta acción no traslada ni cambia tu contraseña actual de Supabase.</p>
            <input type="hidden" name="action" value="bootstrap"/>
            <label htmlFor="setup_secret">Clave de instalación temporal</label>
            <input id="setup_secret" type="password" name="setup_secret" autoComplete="off" required/>
            <label htmlFor="email">Correo del administrador</label>
            <input id="email" type="email" name="email" autoComplete="email" required/>
            <label htmlFor="password">Contraseña nueva (mínimo 14 caracteres, mayúscula, minúscula y número)</label>
            <input id="password" type="password" name="password" autoComplete="new-password" minLength={14} required/>
            <label htmlFor="confirm">Confirmar contraseña</label>
            <input id="confirm" type="password" name="confirm" autoComplete="new-password" minLength={14} required/>
            <button type="submit" className="adm-btn adm-btn-primary">Crear cuenta de prueba</button>
          </form>
        : <p>La clave de instalación aún no está configurada. No es posible crear una cuenta sin autorización privada de Hostinger.</p>
    ):<form method="post" action="/api/rescate-admin" className="adm-auth-form">
      <input type="hidden" name="action" value="login"/>
      <label htmlFor="email">Correo</label>
      <input id="email" name="email" type="email" autoComplete="email" required/>
      <label htmlFor="password">Contraseña nueva de MySQL</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required/>
      <button className="adm-btn adm-btn-primary" type="submit">Iniciar sesión de prueba</button>
    </form>}
    <p className="adm-hint">No uses esta pantalla para publicar recetas. El panel original continúa en /admin.</p>
  </AuthCard>
}
