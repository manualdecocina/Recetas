import 'server-only'
import { randomUUID, createHash } from 'node:crypto'
import { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise'
import { adminConnection, adminMysqlPool } from './admin-db'
import {
  ADMIN_COOKIE, SESSION_DAYS, attemptsKey, adminAttemptsSecret, constantTimeSecret, emailKey,
  passwordHash, sessionToken, strongPassword, tokenHash, validToken, verifyPassword,
} from './admin-crypto'

export type MysqlAdmin={ id:string;email:string }
export type LoginOutcome={ ok:false } | {ok:true;token:string;user:MysqlAdmin}
type UserRecord=RowDataPacket & {
  id:string;email:string;password_salt:Buffer;password_hash:Buffer;is_active:number
}
const DUMMY_SALT=createHash('sha256').update('manualdecocina-scrypt-fake-salt-v1').digest()

function validEmail(email:string):boolean {
  return email.length>=5 && email.length<=320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
function requireAuthSecret():string {
  return adminAttemptsSecret(process.env)
}

/** Solo se invoca con una autorización de bootstrap muy fuerte, fuera de este módulo.
 * El identificador fijo impide carreras para registrar múltiples administradores iniciales.
 * No acepta contraseña más corta de 14 caracteres.
 */
export async function bootstrapFirstAdmin(email:string,password:string):Promise<boolean> {
  const key=emailKey(email)
  if(!validEmail(key)||!strongPassword(password))throw Error('Cuenta inicial inválida')
  const {salt,hash}=await passwordHash(password)
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [existing]=await conn.execute<RowDataPacket[]>('SELECT id FROM admin_auth_users LIMIT 1 FOR UPDATE')
    if(existing.length){await conn.rollback();return false}
    // Solo una cuenta inicial puede usar este ID. Las posteriores requieren una sesión existente.
    await conn.execute(
      'INSERT INTO admin_auth_users (id,email,password_salt,password_hash,password_version,is_active) VALUES (?,?,?,?,1,1)',
      ['00000000-0000-4000-8000-000000000001',key,salt,hash],
    )
    await conn.commit()
    return true
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}

/** La limitación de intentos vive en MySQL, no en memoria de un worker Node.
 * Un atacante no puede eludirla rotando el navegador o el proceso Node.
 */
export async function loginAdmin(email:string,password:string):Promise<LoginOutcome>{
  const key=emailKey(email)
  if(!validEmail(key)||typeof password!=='string'||password.length<8||password.length>256)return {ok:false}
  const attempt=attemptsKey(requireAuthSecret(),'email',key)
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    await conn.execute(
      'INSERT INTO admin_auth_attempts (attempt_key,failed_count) VALUES (?,0) ON DUPLICATE KEY UPDATE attempt_key=attempt_key',
      [attempt],
    )
    const [previous]=await conn.execute<RowDataPacket[]>(
      'SELECT failed_count,locked_until,locked_until > UTC_TIMESTAMP(6) AS locked FROM admin_auth_attempts WHERE attempt_key=? FOR UPDATE',
      [attempt],
    )
    if(Number(previous[0]?.locked)===1){await conn.rollback();return {ok:false}}
    const [users]=await conn.execute<UserRecord[]>(
      'SELECT id,email,password_salt,password_hash,is_active FROM admin_auth_users WHERE email=? LIMIT 1',
      [key],
    )
    const user=users[0]
    // Scrypt incluso si el email no existe: respuesta constante, sin enumerar usuarios.
    const valid=await verifyPassword(password,user?.password_salt??DUMMY_SALT,
      user?.password_hash??Buffer.alloc(64,0))
    if(!user||Number(user.is_active)!==1||!valid){
      const failures=Math.min(100,Number(previous[0]?.failed_count??0)+1)
      await conn.execute(
        'UPDATE admin_auth_attempts SET failed_count=?,locked_until=IF(? >= 7,DATE_ADD(UTC_TIMESTAMP(6),INTERVAL 15 MINUTE),NULL),updated_at=UTC_TIMESTAMP(6) WHERE attempt_key=?',
        [failures,failures,attempt],
      )
      await conn.commit()
      return {ok:false}
    }
    await conn.execute(
      'UPDATE admin_auth_attempts SET failed_count=0,locked_until=NULL,updated_at=UTC_TIMESTAMP(6) WHERE attempt_key=?',
      [attempt],
    )
    const token=sessionToken()
    await conn.execute(
      'INSERT INTO admin_auth_sessions(token_hash,user_id,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(6),INTERVAL 7 DAY))',
      [tokenHash(token),user.id],
    )
    await conn.execute('UPDATE admin_auth_users SET last_login_at=UTC_TIMESTAMP(6) WHERE id=?',[user.id])
    await conn.commit()
    return {ok:true,token,user:{id:user.id,email:user.email}}
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}
export async function getAdminByToken(token:unknown):Promise<MysqlAdmin|null>{
  if(!validToken(token))return null
  const [rows]=await adminMysqlPool().execute<RowDataPacket[]>(
    'SELECT a.id,a.email FROM admin_auth_sessions s '+
    'JOIN admin_auth_users a ON a.id=s.user_id '+
    'WHERE s.token_hash=? AND s.expires_at > UTC_TIMESTAMP(6) AND s.revoked_at IS NULL AND a.is_active=1 LIMIT 1',
    [tokenHash(token)],
  )
  if(!rows.length)return null
  return {id:String(rows[0].id),email:String(rows[0].email)}
}
export async function revokeAdminSession(token:unknown):Promise<void>{
  if(!validToken(token))return
  await adminMysqlPool().execute(
    'UPDATE admin_auth_sessions SET revoked_at=UTC_TIMESTAMP(6) WHERE token_hash=? AND revoked_at IS NULL',
    [tokenHash(token)],
  )
}
export async function revokeAllAdminSessions(userId:string):Promise<void>{
  if(!/^[0-9a-f-]{36}$/i.test(userId))throw Error('ID inválido')
  await adminMysqlPool().execute(
    'UPDATE admin_auth_sessions SET revoked_at=UTC_TIMESTAMP(6) WHERE user_id=? AND revoked_at IS NULL',
    [userId],
  )
}
export { ADMIN_COOKIE, SESSION_DAYS, constantTimeSecret }
