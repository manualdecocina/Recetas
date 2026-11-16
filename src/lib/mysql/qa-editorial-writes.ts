import 'server-only'
import {randomUUID} from 'node:crypto'
import type {RowDataPacket} from 'mysql2/promise'
import {adminConnection} from './admin-db'

/** Prueba real de INSERT/UPDATE/DELETE MySQL en transacción SIEMPRE revertida.
 * No usa recetas existentes, no publica, no modifica Supabase y no persiste
 * ninguna fila ni imagen. Solo se invoca desde QA autenticada y preview.
 */
export async function testMysqlEditorialWritesRollback(adminId:string):Promise<boolean>{
  const id=randomUUID(),group=randomUUID()
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const slug='qa-temporal-'+id.slice(0,8)
    await conn.execute(
      'INSERT INTO recipes (id,recipe_group_id,language,slug,public_path,title,excerpt,'+
      'ingredients,steps,category,prep_time_minutes,cook_time_minutes,servings,image_url,'+
      'published,published_at,created_at,updated_at,gallery,video_urls,seo,editorial_status,'+
      'rating_count,rating_sum) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,NULL,UTC_TIMESTAMP(6),'+
      'UTC_TIMESTAMP(6),?,?,?, ?,0,0)',
      [id,group,'es',slug,'/es/receta/'+slug,'QA transaccional',null,
        '[]','[]',null,null,null,null,null,'[]','[]','{}','draft'],
    )
    await conn.execute(
      'INSERT INTO recipe_reviews (recipe_group_id,status,comment,reviewed_by,reviewed_at) '+
      'VALUES (?,?,?,?,UTC_TIMESTAMP(6))',
      [group,'devuelta','Prueba temporal, siempre revertida',adminId],
    )
    await conn.execute(
      "UPDATE recipes SET seo=JSON_OBJECT('title','QA transaccional'),updated_at=UTC_TIMESTAMP(6) WHERE id=?",
      [id],
    )
    const [rows]=await conn.execute<RowDataPacket[]>(
      'SELECT id FROM recipes WHERE id=? AND JSON_UNQUOTE(JSON_EXTRACT(seo,?))=? LIMIT 1',
      [id,'$.title','QA transaccional'],
    )
    if(rows.length!==1)throw Error('No se pudo comprobar la escritura de SEO')
    await conn.execute('DELETE FROM recipe_reviews WHERE recipe_group_id=?',[group])
    await conn.execute('DELETE FROM recipes WHERE id=?',[id])
    return true
  }finally{
    // Incluso cuando la prueba falla, ninguna escritura llega a producción.
    try{await conn.rollback()}finally{conn.release()}
  }
}
