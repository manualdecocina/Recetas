import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { createMysqlReadClient } from '@/lib/mysql/read-query'
import { loadQueue } from '@/lib/admin/publication-data'
import type { SupabaseClient } from '@supabase/supabase-js'

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
  // Hostinger puede reenviar el hostname del proceso interno a NextRequest;
  // permitir Host y X-Forwarded-Host de preview sin revelar el valor real.
  const names = [request.nextUrl.hostname, request.headers.get('host')?.split(':')[0],
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()?.split(':')[0]]
  if (!names.includes(PREVIEW)) {
    return NextResponse.json({ status: 'preview_host_mismatch', mysql: false }, { headers })
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
      // Comprobación directa de 4 tablas del esquema administrativo,
      // únicamente SHOW TABLES de la base actual. No consulta information_schema.
      if (request.nextUrl.searchParams.get('schema') === 'admin') {
        const expected = [
          'admin_auth_users','admin_auth_sessions','admin_auth_attempts',
          'admin_auth_password_resets',
        ]
        const [tableRows] = await conn.query<mysql.RowDataPacket[]>('SHOW TABLES')
        const names = new Set(tableRows.map((item) => String(Object.values(item)[0] ?? '')))
        const checks = Object.fromEntries(expected.map((table) => [table, names.has(table)]))
        const passed = Object.values(checks).every(Boolean)
        return NextResponse.json({
          status: passed ? 'admin_schema_pass' : 'admin_schema_incomplete',
          schema: checks, tables_present: Object.values(checks).filter(Boolean).length,
          production_untouched: true,
        }, { status: 200, headers })
      }
      // Verifica las lecturas privadas editoriales con todas las recetas,
      // sin publicar borradores, correos ni títulos en la respuesta.
      if (request.nextUrl.searchParams.get('editorial') === '1') {
        let queryNumber = 0
        let driverErrorCode: string | null = null
        const execute = async (query: string, values: unknown[]) => {
          queryNumber += 1
          try {
            const [result] = await conn.execute<mysql.RowDataPacket[]>(query, values as any[])
            return result as Record<string, any>[]
          } catch (error) {
            const code = (error as { code?: unknown }).code
            if (typeof code === 'string' && /^ER_[A-Z0-9_]{1,48}$/.test(code)) {
              driverErrorCode = code
            }
            throw error
          }
        }
        const privateRead = createMysqlReadClient(execute, { includeUnpublished: true, preserveMediaUrls: true })
        let queue: Awaited<ReturnType<typeof loadQueue>>
        try {
          queue = await loadQueue(privateRead as unknown as SupabaseClient)
        } catch (error) {
          // No se exponen SQL, datos editoriales, títulos ni secretos. Solo etapa y código estándar.
          const message = error instanceof Error ? error.message : ''
          const classification = driverErrorCode ?? (
            /json|unexpected token|unexpected end|not valid/i.test(message) ? 'json_normalization' :
            /column/i.test(message) ? 'unknown_column' :
            /map|filter|reduce|is not a function|not iterable/i.test(message) ? 'array_operation' :
            /sort|localeCompare/i.test(message) ? 'sorting' :
            /undefined|null/i.test(message) ? 'unexpected_data' :
            /stack|recursion/i.test(message) ? 'stack_limit' : 'editorial_conversion'
          )
          const typeName = error instanceof SyntaxError ? 'SyntaxError' :
            error instanceof TypeError ? 'TypeError' :
            error instanceof RangeError ? 'RangeError' : 'Error'
          return NextResponse.json({
            status: 'admin_editorial_diagnostic_failure',
            classification, typeName, queryNumber, messageChars: message.length,
            runtimeHint: error instanceof TypeError && /^Cannot read properties of (null|undefined) \(reading '[a-zA-Z]+'\)$/.test(message)
              ? message.replace(/^Cannot read properties of (null|undefined) \(reading '([a-zA-Z]+)'\)$/,'$1:$2')
              : null,
            production_untouched: true,
          }, { headers })
        }
        const stages = Object.fromEntries(
          [...new Set(queue.map((item) => item.stage))].map(stage => [
            stage, queue.filter((item) => item.stage === stage).length,
          ]),
        )
        const [draftRows] = await conn.execute<mysql.RowDataPacket[]>(
          'SELECT COUNT(*) AS n, COUNT(DISTINCT recipe_group_id) AS draft_groups FROM recipes WHERE published=0',
        )
        const [groupRows] = await conn.execute<mysql.RowDataPacket[]>(
          'SELECT COUNT(DISTINCT recipe_group_id) AS n FROM recipes',
        )
        const drafts = Number(draftRows[0]?.n ?? -1)
        const expectedGroups = Number(groupRows[0]?.n ?? -1)
        const total = queue.length
        const passed = drafts === 18 && total === expectedGroups && total > 0 &&
          queue.every((item) => item.languages >= 1 && item.languages <= 7)
        return NextResponse.json({
          status: passed ? 'admin_editorial_read_pass' : 'admin_editorial_read_mismatch',
          groups: total, drafts, stages, production_untouched: true,
        }, { headers })
      }
      // Comprobación profunda y no destructiva del adaptador en el MISMO servidor.
      // Nunca imprime recetas, usuarios ni variables secretas.
      if (request.nextUrl.searchParams.get('adapter') === '1') {
        const execute = async (query: string, values: unknown[]) => {
          const [result] = await conn.execute<mysql.RowDataPacket[]>(query, values as any[])
          return result as Record<string, any>[]
        }
        const client = createMysqlReadClient(execute)
        const languages = ['es','en','de','fr','it','ja','pt']
        const checks: Record<string, boolean> = {}
        for (const language of languages) {
          const result = await client.from('recipes')
            .select('id,language,title,public_path,image_url,ingredients,steps,seo')
            .eq('language', language).eq('published', true)
            .order('ready_at', { ascending: false, nullsFirst: false }).limit(2)
          checks['recipes_' + language] = result.error === null && result.data?.length === 2 &&
            result.data.every((row: any) => Array.isArray(row.ingredients) && Array.isArray(row.steps))
        }
        const count = await client.from('recipes').select('id', { count: 'exact', head: true })
          .eq('language', 'es').eq('published', true)
        checks['count_es'] = count.error === null && count.count === 252
        const pantry = await client.from('ingredients').select('id,slug,name')
          .eq('status', 'canonical').eq('searchable', true).order('name').limit(3)
        checks['ingredients'] = pantry.error === null && pantry.data?.length === 3
        const search = await client.from('recipes').select('id,title').eq('language', 'es')
          .or('title.ilike."%a%",excerpt.ilike."%a%"').order('ready_at', { ascending: false }).limit(3)
        checks['search'] = search.error === null && search.data?.length > 0
        const redirect = await client.from('content_redirects').select('source_path,target_path,status_code').limit(1)
        checks['redirects'] = redirect.error === null && redirect.data?.length === 1
        const es = await client.from('recipes').select('id,public_path').eq('language', 'es').limit(1)
        const canonical = es.data?.[0]?.public_path
        if (typeof canonical === 'string') {
          const details = await client.from('recipes')
            .select('*, recipe_ingredients(position, ingredients(name, slug, indexable))')
            .in('public_path', [canonical]).limit(1).maybeSingle()
          checks['detail_join'] = details.error === null && details.data?.public_path === canonical &&
            Array.isArray(details.data?.recipe_ingredients)
        } else checks['detail_join'] = false
        const passed = Object.values(checks).every(Boolean)
        return NextResponse.json({
          status: passed ? 'mysql_adapter_pass' : 'mysql_adapter_partial',
          database: 'mysql', checks, production_untouched: true,
        }, { status: passed ? 200 : 503, headers })
      }
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
