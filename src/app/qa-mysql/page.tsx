import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { createConnection, type RowDataPacket } from 'mysql2/promise'
import { createMysqlReadClient } from '@/lib/mysql/read-query'

/** Ficha temporal de QA visual: 7 idiomas y medios leídos de Hostinger MySQL.
 * No cambia el cliente público, no muestra borradores y jamás escribe en DB.
 * Retirar esta ruta antes de fusionar el PR.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'QA MySQL — Manual de Cocina',
  robots: { index: false, follow: false },
}
const PREVIEWS = new Set(['mintcream-squirrel-383743.hostingersite.com', 'valiant-tan-hornet-51.hostingersite.com'])
const langs = ['es', 'en', 'de', 'fr', 'it', 'ja', 'pt'] as const
export default async function MysqlPreviewQA() {
  const h = await headers()
  const names = [h.get('host')?.split(':')[0], h.get('x-forwarded-host')?.split(',')[0]?.trim()?.split(':')[0]]
  if (!names.some(name => typeof name === 'string' && PREVIEWS.has(name))) notFound()
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT, MYSQL_SSL_MODE } = process.env
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DATABASE) {
    return <main style={{padding:24}}><h1>Vista previa MySQL</h1><p>Conexión no configurada.</p></main>
  }
  let sections: Array<{ language:string; items:Array<{id:string;title:string;public_path:string;image_url:string|null}> }>=[]
  let issue=''
  let conn: Awaited<ReturnType<typeof createConnection>> | null = null
  try {
    const port = MYSQL_PORT ? Number(MYSQL_PORT) : 3306
    if (!Number.isSafeInteger(port) || port <= 0 || port > 65535) throw Error('Invalid port')
    conn = await createConnection({
      host: MYSQL_HOST, port, user: MYSQL_USER, password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE, charset:'utf8mb4', timezone:'Z', dateStrings:true,
      connectTimeout:5000,
      ...(MYSQL_SSL_MODE==='required' ? {ssl:{rejectUnauthorized:true}} : {}),
    })
    const db = conn
    const client = createMysqlReadClient(async (sql, parameters) => {
      const [rows] = await db.execute<RowDataPacket[]>(sql, parameters as any[])
      return rows as Record<string,any>[]
    })
    for (const lang of langs) {
      const out = await client.from('recipes').select('id,title,public_path,image_url')
        .eq('language',lang).eq('published',true)
        .order('ready_at',{ascending:false}).limit(2)
      if (out.error || !Array.isArray(out.data) || out.data.length !== 2) throw Error('Incomplete QA data')
      sections.push({language:lang,items:out.data.map((recipe:any)=>({
        id:String(recipe.id),title:String(recipe.title),
        public_path:String(recipe.public_path),
        image_url:typeof recipe.image_url==='string' ? recipe.image_url : null,
      }))})
    }
  } catch {
    issue='No se pudo completar la lectura MySQL. Revisa la conexión desde el diagnóstico privado.'
  } finally {
    if (conn) await conn.end()
  }
  return <main style={{maxWidth:1100,margin:'0 auto',padding:'32px 20px'}}>
    <h1>Vista previa técnica · MySQL</h1>
    <p>14 recetas publicadas de muestra, obtenidas directamente desde MySQL de Hostinger.
      Esta página no sustituye la web pública ni muestra borradores.</p>
    {issue ? <p role="alert">{issue}</p> : sections.map(section=>
      <section key={section.language} style={{marginBlock:28}}>
        <h2>{section.language.toUpperCase()}</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:20}}>
          {section.items.map(item=>
            <article key={item.id} style={{padding:16,border:'1px solid #ccc',borderRadius:12}}>
              {item.image_url
                ? <img src={item.image_url} loading="lazy" alt={item.title}
                    style={{display:'block',width:'100%',height:160,objectFit:'cover',borderRadius:8}}/>
                : <p>Sin imagen de portada</p>}
              <h3>{item.title}</h3>
              <p><code style={{overflowWrap:'anywhere'}}>{item.public_path}</code></p>
            </article>
          )}
        </div>
      </section>)}
  </main>
}
