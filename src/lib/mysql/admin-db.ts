import 'server-only'
import { createPool, type Pool, type PoolConnection } from 'mysql2/promise'

/** Conexión administrativa, separada del SELECT público. No usar desde Edge ni Client Components. */
const state=globalThis as unknown as {__mdcAdminPool?:Pool}
export function adminMysqlPool():Pool{
  if(process.env.ADMIN_AUTH_PROVIDER!=='mysql')throw Error('Auth MySQL no está activada')
  if(state.__mdcAdminPool)return state.__mdcAdminPool
  const host=process.env.MYSQL_HOST,user=process.env.MYSQL_USER,password=process.env.MYSQL_PASSWORD,
    database=process.env.MYSQL_DATABASE
  if(!host||!user||!password||!database)throw Error('Credenciales MySQL del servidor incompletas')
  const port=process.env.MYSQL_PORT?Number(process.env.MYSQL_PORT):3306
  if(!Number.isSafeInteger(port)||port<1||port>65535)throw Error('MYSQL_PORT inválido')
  state.__mdcAdminPool=createPool({
    host,port,user,password,database,charset:'utf8mb4',timezone:'Z',dateStrings:true,
    waitForConnections:true,connectionLimit:3,maxIdle:2,idleTimeout:60000,
    queueLimit:40,connectTimeout:5000,
    ...(process.env.MYSQL_SSL_MODE==='required'?{ssl:{rejectUnauthorized:true}}:{}),
  })
  return state.__mdcAdminPool
}
export async function adminConnection():Promise<PoolConnection>{
  return adminMysqlPool().getConnection()
}
