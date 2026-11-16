import 'server-only'
import { createPool, type Pool, type RowDataPacket } from 'mysql2/promise'
import { createMysqlReadClient } from './read-query'

/**
 * Pool MySQL de lectura pública. Las credenciales solo existen en el proceso Node.
 * Nunca NEXT_PUBLIC_ y nunca se transmiten al navegador.
 * Cero conexiones si MYSQL_READS_ENABLED no está habilitado.
 */
const shared = globalThis as unknown as { __mdcReadMysqlPool?: Pool }
function pool(): Pool {
  if (shared.__mdcReadMysqlPool) return shared.__mdcReadMysqlPool
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DATABASE) {
    throw new Error('Lectura MySQL no configurada: faltan variables MYSQL_* del servidor')
  }
  const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) throw new Error('MYSQL_PORT incorrecto')

  shared.__mdcReadMysqlPool = createPool({
    host: MYSQL_HOST,
    port,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 4,
    maxIdle: 2,
    idleTimeout: 60000,
    queueLimit: 100,
    connectTimeout: 5000,
    charset: 'utf8mb4',
    timezone: 'Z',
    dateStrings: true,
    // Solo se activa TLS si se puede verificar el certificado. No desactivar la verificación.
    ...(process.env.MYSQL_SSL_MODE === 'required' ? { ssl: { rejectUnauthorized: true } } : {}),
  })
  return shared.__mdcReadMysqlPool
}
// Uso exclusivo desde rutas del servidor. No se exporta al navegador.
export function mysqlServerPool(): Pool { return pool() }

async function read(sql: string, params: unknown[]): Promise<Record<string, any>[]> {
  if (process.env.MYSQL_READS_ENABLED !== 'true') {
    throw new Error('Lectura MySQL deshabilitada')
  }
  const [rows] = await pool().execute<RowDataPacket[]>(sql, params as any[])
  return rows as unknown as Record<string, any>[]
}
export const mysqlPublicRead = createMysqlReadClient(read)
