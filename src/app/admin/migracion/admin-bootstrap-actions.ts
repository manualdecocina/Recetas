'use server'

import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type RowDataPacket } from 'mysql2/promise'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from '@/lib/supabase/keys'
import { mysqlServerPool } from '@/lib/mysql/public'
import { loginAdmin, getAdminByToken, revokeAdminSession } from '@/lib/mysql/admin-auth'
import { adminAttemptsSecret, emailKey, passwordHash, strongPassword, verifyPassword } from '@/lib/mysql/admin-crypto'

const FIRST_ADMIN_ID='00000000-0000-4000-8000-000000000001'
const validEmail=(email:string)=>email.length>=5&&email.length<=320&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

/** Prepara el administrador MySQL desde la sesión administrativa ya existente.
 * Exige comprobar también la CONTRASEÑA ACTUAL contra Supabase antes de escribir,
 * y reutiliza esa contraseña por defecto (o una distinta, opcional, si se elige).\n * Sólo almacena scrypt en MySQL; no modifica credenciales de Supabase. No habilita el login MySQL ni cambia
 * ADMIN_AUTH_PROVIDER: el usuario mantiene el acceso actual hasta completar QA.
 */
export async function prepareMysqlAdminFromCurrentSession(formData:FormData):Promise<never>{
  if(process.env.MYSQL_READS_ENABLED!=='true'||
     process.env.ADMIN_AUTH_PROVIDER==='mysql')
    redirect('/admin/migracion?admin=desactivado')

  const {user,isAdmin}=await requireAdmin()
  if(!isAdmin||!user.email||!validEmail(emailKey(user.email)))
    redirect('/admin/migracion?admin=no_autorizado')

  const current=formData.get('current_password')
  const optionalNew=formData.get('new_password')
  const optionalConfirm=formData.get('confirm_password')
  // Reutilizar la contraseña actual por defecto. No cambiar la de Supabase.
  // Sólo pedir otra para MySQL si el administrador lo elige o si la clave
  // actual no cumple los requisitos de seguridad del nuevo login.
  const useCurrent=optionalNew==='' && optionalConfirm===''
  const proposed=useCurrent ? current : optionalNew
  if(typeof current!=='string'||current.length<1||current.length>256||
     !strongPassword(proposed)||(!useCurrent&&proposed!==optionalConfirm))
    redirect('/admin/migracion?admin=datos_invalidos')

  try { adminAttemptsSecret(process.env) } catch {
    redirect('/admin/migracion?admin=sin_clave')
  }

  let verified=false
  try{
    // Cliente aislado sin cookies persistentes: verificar el secreto actual
    // sin renovar ni sustituir la sesión de administración del navegador.
    const verification=createClient(SUPABASE_URL,SUPABASE_PUBLIC_KEY,{
      auth:{persistSession:false,autoRefreshToken:false},
    })
    const checked=await verification.auth.signInWithPassword({
      email:user.email,password:current,
    })
    verified=!checked.error && checked.data.user?.id===user.id
  }catch{
    // Nunca imprimir la contraseña ni detalles del proveedor.
  }
  if(!verified)redirect('/admin/migracion?admin=credenciales_invalidas')

  const {salt,hash}=await passwordHash(proposed)
  const conn=await mysqlServerPool().getConnection()
  try{
    await conn.beginTransaction()
    const [users]=await conn.execute<RowDataPacket[]>(
      'SELECT id,email FROM admin_auth_users FOR UPDATE',
    )
    const normalized=emailKey(user.email)
    if(users.length>1||(users.length===1&&emailKey(String(users[0].email))!==normalized))
      throw Error('Cuenta administrativa distinta ya configurada')
    if(users.length===0){
      await conn.execute(
        'INSERT INTO admin_auth_users (id,email,password_salt,password_hash,password_version,is_active) '+
        'VALUES (?,?,?,?,1,1)',
        [FIRST_ADMIN_ID,normalized,salt,hash],
      )
    }else{
      // Solo la misma cuenta, nunca adoptar o sustituir otro administrador.
      await conn.execute(
        'UPDATE admin_auth_users SET password_salt=?,password_hash=?,password_version=1,'+
        'is_active=1,updated_at=UTC_TIMESTAMP(6) WHERE id=? AND email=?',
        [salt,hash,String(users[0].id),String(users[0].email)],
      )
      await conn.execute(
        'UPDATE admin_auth_sessions SET revoked_at=UTC_TIMESTAMP(6) '+
        'WHERE user_id=? AND revoked_at IS NULL',[String(users[0].id)],
      )
    }
    // Auto-comprobación contra los bytes realmente escritos, sin habilitar
    // la autenticación nueva para el público todavía.
    const [saved]=await conn.execute<RowDataPacket[]>(
      'SELECT email,password_salt,password_hash,is_active FROM admin_auth_users WHERE email=? LIMIT 1',
      [normalized],
    )
    const stored=saved[0]
    if(!stored||Number(stored.is_active)!==1||
       !(await verifyPassword(proposed,stored.password_salt,stored.password_hash)))
      throw Error('No se pudo verificar el hash almacenado')
    await conn.commit()
  }catch{
    await conn.rollback()
    redirect('/admin/migracion?admin=esquema_o_escritura')
  }finally{conn.release()}

  // Prueba completa y real de login + sesión MySQL, SIN activar el proveedor
  // nuevo ni entregar la cookie al navegador. El token temporal se revoca.
  let verifiedLogin=false
  try{
    const result=await loginAdmin(emailKey(user.email),proposed)
    if(result.ok){
      try{
        const session=await getAdminByToken(result.token)
        verifiedLogin=session?.email===emailKey(user.email)
      }finally{
        await revokeAdminSession(result.token)
      }
    }
  }catch{
    // El administrador Supabase permanece operativo.
  }
  if(!verifiedLogin)redirect('/admin/migracion?admin=verificacion_error')
  redirect('/admin/migracion?admin=preparado')
}
