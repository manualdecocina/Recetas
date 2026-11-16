import 'server-only'
import { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise'
import { adminConnection, adminMysqlPool } from './admin-db'
import {
  RESET_MINUTES, emailKey, passwordHash, sessionToken, strongPassword,
  tokenHash, validToken,
} from './admin-crypto'

/**
 * Flujo de recuperación del administrador MySQL.
 * Los tokens de 256 bits nunca se guardan en claro; expiran tras 20 minutos,
 * son de un solo uso y revocan todas las sesiones al cambiar la contraseña.
 *
 * SOLO backend privado. Queda pendiente conectar envío de correo SMTP seguro;
 * nunca devolver tokens en respuestas HTTP o logs.
 */
export async function prepareResetToken(email:string):Promise<{token:string;email:string}|null>{
  if(process.env.ADMIN_AUTH_PROVIDER!=='mysql')throw Error('Auth MySQL inactiva')
  if(!email||email.length>320)return null
  const key=emailKey(email)
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [users]=await conn.execute<RowDataPacket[]>(
      'SELECT id,email FROM admin_auth_users WHERE email=? AND is_active=1 LIMIT 1 FOR UPDATE',
      [key],
    )
    if(!users.length){await conn.rollback();return null}
    const id=String(users[0].id)
    // Reemplazar cualquier token no consumido; no permitir múltiples enlaces válidos.
    await conn.execute(
      'UPDATE admin_auth_password_resets SET consumed_at=UTC_TIMESTAMP(6) '+
      'WHERE user_id=? AND consumed_at IS NULL',[id],
    )
    const token=sessionToken()
    await conn.execute(
      'INSERT INTO admin_auth_password_resets(token_hash,user_id,expires_at) VALUES ('+
      '?,?,DATE_ADD(UTC_TIMESTAMP(6),INTERVAL 20 MINUTE))',
      [tokenHash(token),id],
    )
    await conn.commit()
    return {token,email:key}
  }catch(err){await conn.rollback();throw err}finally{conn.release()}
}

export async function completeResetToken(token:unknown,newPassword:unknown):Promise<boolean>{
  if(process.env.ADMIN_AUTH_PROVIDER!=='mysql')throw Error('Auth MySQL inactiva')
  if(!validToken(token)||!strongPassword(newPassword))return false
  const {salt,hash}=await passwordHash(newPassword)
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [matches]=await conn.execute<RowDataPacket[]>(
      'SELECT user_id,expires_at > UTC_TIMESTAMP(6) AS fresh,consumed_at '+
      'FROM admin_auth_password_resets WHERE token_hash=? LIMIT 1 FOR UPDATE',
      [tokenHash(token)],
    )
    const found=matches[0]
    if(!found||Number(found.fresh)!==1||found.consumed_at!=null){
      await conn.rollback();return false
    }
    const id=String(found.user_id)
    const [saved]=await conn.execute<ResultSetHeader>(
      'UPDATE admin_auth_users SET password_salt=?,password_hash=?,password_version=1,'+
      'updated_at=UTC_TIMESTAMP(6) WHERE id=? AND is_active=1',
      [salt,hash,id],
    )
    if(saved.affectedRows!==1)throw Error('Cuenta administrativa ya no está activa')
    await conn.execute(
      'UPDATE admin_auth_password_resets SET consumed_at=UTC_TIMESTAMP(6) '+
      'WHERE user_id=? AND consumed_at IS NULL',
      [id],
    )
    await conn.execute(
      'UPDATE admin_auth_sessions SET revoked_at=UTC_TIMESTAMP(6) '+
      'WHERE user_id=? AND revoked_at IS NULL',
      [id],
    )
    await conn.commit()
    return true
  }catch(err){await conn.rollback();throw err}finally{conn.release()}
}
