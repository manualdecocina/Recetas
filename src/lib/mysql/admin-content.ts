import 'server-only'
import { cookies } from 'next/headers'
import { type RowDataPacket } from 'mysql2/promise'
import { createMysqlReadClient } from './read-query'
import { adminMysqlPool } from './admin-db'
import { ADMIN_COOKIE, getAdminByToken } from './admin-auth'

/** Nunca usar el cliente público para el panel: ocultaría borradores y revisiones.
 * Cada consulta vuelve a validar el token aleatorio contra la sesión no revocada
 * antes de permitir SELECT sobre recetas completas.
 */
export async function getMysqlAdminRead(){
  if(process.env.ADMIN_AUTH_PROVIDER!=='mysql')return null
  const token=(await cookies()).get(ADMIN_COOKIE)?.value
  const user=await getAdminByToken(token)
  if(!user)return null
  const execute=async(sql:string,params:unknown[])=>{
    if(!await getAdminByToken(token))throw Error('Sesión de administrador caducada')
    const [result]=await adminMysqlPool().execute<RowDataPacket[]>(sql,params as any[])
    return result as Record<string,any>[]
  }
  return {user,client:createMysqlReadClient(execute,{includeUnpublished:true})}
}
