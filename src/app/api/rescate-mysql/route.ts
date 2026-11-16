import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

/**
 * QA temporal y de solo lectura para la vista previa del PR #274.
 * No publica credenciales ni detalles de errores, nunca realiza escrituras,
 * y devuelve 404 fuera del dominio de vista previa. Retirar antes de merge.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const PREVIEW = 'mintcream-squirrel-383743.hostingersite.com'
const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' }
export async function GET(request: NextRequest) {
  if (request.nextUrl.hostname !== PREVIEW) {
    return new Response(null, { status: 404, headers })
  }
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT, MYSQL_SSL_MODE } = process.env
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DATABASE) {
    return NextResponse.json({ status: 'not_configured', mysql: false, production_untouched: true }, { headers })
  }
  try {
    const port = MYSQL_PORT ? Number(MYSQL_PORT) : 3306
    if (!Number.isSafeInteger(port) || port < 1 || port > 65535) throw Error('invalid_port')
    const conn = await mysql.createConnection({
      host: MYSQL_HOST, port, user: MYSQL_USER, password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE, charset: 'utf8mb4', connectTimeout: 4500,
      ...(MYSQL_SSL_MODE === 'required' ? { ssl: { rejectUnauthorized: true } } : {}),
    })
    try {
      const [rows] = await conn.execute<mysql.RowDataPacket[]>(`SELECT
         (SELECT COUNT(*) FROM recipes) AS recipes,
         (SELECT COUNT(*) FROM recipes WHERE published=1) AS published,
         (SELECT COUNT(*) FROM content_redirects) AS redirects,
         (SELECT COUNT(*) FROM content_redirects_backup_20261030) AS old_redirects`)
      const row = rows[0]
      const [langs] = await conn.execute<mysql.RowDataPacket[]>(
        'SELECT language, COUNT(*) AS total FROM recipes WHERE published = 1 GROUP BY language ORDER BY language'
      )
      const ok = Number(row.recipes) === 1782 && Number(row.published) === 1764 &&
        Number(row.redirects) === 242 && Number(row.old_redirects) === 100 &&
        langs.length === 7 && langs.every(x => Number(x.total) === 252)
      return NextResponse.json({
        status: ok ? 'mysql_pass' : 'mysql_counts_mismatch',
        mysql: true,
        verified: { recipes: Number(row.recipes), published: Number(row.published), redirects: Number(row.redirects), old_redirects: Number(row.old_redirects), languages: langs.length },
        production_untouched: true,
      }, { status: ok ? 200 : 503, headers })
    } finally { await conn.end() }
  } catch {
    // Nunca revelar host, usuario, DB o errores con secretos en una ruta pública.
    return NextResponse.json({ status: 'mysql_connection_failed', mysql: false, production_untouched: true }, { status: 503, headers })
  }
}
