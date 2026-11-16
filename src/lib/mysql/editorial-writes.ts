import 'server-only'
import { cookies } from 'next/headers'
import { type RowDataPacket } from 'mysql2/promise'
import { adminConnection } from './admin-db'
import { getAdminByToken, ADMIN_COOKIE } from './admin-auth'
import { groupBlockers, REQUIRED_LANGUAGES, type PublicationRow } from '@/lib/admin/publication'

type AdminSession={id:string;email:string}
type GroupRow=RowDataPacket & PublicationRow
const uuidPattern=/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
function validGroup(id:string){if(!uuidPattern.test(id))throw Error('Grupo inválido')}
function parseJson(value:any):any{if(typeof value==='string')return JSON.parse(value);return value}
export async function requireMysqlAdminWrites():Promise<AdminSession>{
  if(process.env.ADMIN_WRITE_PROVIDER!=='mysql'||process.env.ADMIN_AUTH_PROVIDER!=='mysql'){
    throw Error('Escrituras administrativas MySQL deshabilitadas')
  }
  const token=(await cookies()).get(ADMIN_COOKIE)?.value
  const user=await getAdminByToken(token)
  if(!user)throw Error('Sesión administrativa ausente o revocada')
  return user
}

/** Registra aprobación/devolución como transacción, con revisión de sesión en servidor. */
export async function reviewGroupMysql(groupId:string,decision:'aprobada'|'devuelta',comment:string|null) {
  const admin=await requireMysqlAdminWrites()
  validGroup(groupId)
  if(decision!=='aprobada'&&decision!=='devuelta')throw Error('Revisión inválida')
  if(typeof comment==='string'&&comment.length>2000)throw Error('Comentario demasiado largo')
  if(decision==='devuelta'&&(!comment||!comment.trim()))throw Error('Indicar motivo de devolución')
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [rows]=await conn.execute<RowDataPacket[]>(
      'SELECT id FROM recipes WHERE recipe_group_id=? LIMIT 1 FOR UPDATE',[groupId],
    )
    if(!rows.length)throw Error('Grupo de recetas no encontrado')
    await conn.execute(
      'INSERT INTO recipe_reviews (recipe_group_id,status,comment,reviewed_by,reviewed_at) VALUES (?,?,?,?,UTC_TIMESTAMP(6)) '+
      'ON DUPLICATE KEY UPDATE status=VALUES(status),comment=VALUES(comment),reviewed_by=VALUES(reviewed_by),reviewed_at=VALUES(reviewed_at)',
      [groupId,decision,comment?.trim()||null,admin.id],
    )
    await conn.commit()
    return {ok:true}
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}

/** Replica la RPC de publicación: 7 idiomas exactos, aprobación y gate editorial,
 * actualización conjunta y retirada solo de redirects temporales.
 *
 * IMPORTANTE: el formulario que invoque esta función debe comprobar también
 * imágenes públicas antes de llamar; todavía NO conectada a formularios reales.
 */
export async function publishGroupMysql(groupId:string){
  await requireMysqlAdminWrites()
  validGroup(groupId)
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [raw]=await conn.execute<GroupRow[]>(
      'SELECT id,language,title,image_url,ingredients,steps,nutrition,seo,public_path,published '+
      'FROM recipes WHERE recipe_group_id=? ORDER BY language FOR UPDATE',[groupId],
    )
    if(!raw.length)throw Error('Grupo no encontrado')
    const [review]=await conn.execute<RowDataPacket[]>(
      'SELECT status FROM recipe_reviews WHERE recipe_group_id=? FOR UPDATE',[groupId],
    )
    if(review[0]?.status!=='aprobada')throw Error('Falta aprobación del chef')
    const rows=raw.map(row=>({...row,published:Boolean(row.published),
      ingredients:parseJson(row.ingredients),steps:parseJson(row.steps),
      nutrition:parseJson(row.nutrition),seo:parseJson(row.seo)}))
    if(rows.length!==REQUIRED_LANGUAGES.length ||
       new Set(rows.map(row=>row.language)).size!==REQUIRED_LANGUAGES.length){
      throw Error('Faltan traducciones o existen idiomas duplicados')
    }
    const blockers=groupBlockers(rows)
    if(blockers.length)throw Error('No se puede publicar: '+blockers.join('; '))
    await conn.execute(
      'UPDATE recipes SET published=1,editorial_status=?,ready_at=COALESCE(ready_at,UTC_TIMESTAMP(6)),'+
      'updated_at=UTC_TIMESTAMP(6) WHERE recipe_group_id=? AND (published=0 OR ready_at IS NULL)',
      ['published',groupId],
    )
    const canonical=rows.map(r=>r.public_path).filter((p):p is string=>typeof p==='string'&&p.length>0)
    let removed=0
    if(canonical.length){
      const normalized=[...new Set(canonical.map(p=>p.replace(/\/+$/,'')).filter(Boolean))]
      const [result]=await conn.execute<any>(
        'DELETE FROM content_redirects WHERE status_code IN (302,307) AND '+
        'TRIM(TRAILING \'/\' FROM source_path) IN ('+normalized.map(()=>'?').join(',')+')',
        normalized,
      )
      removed=Number(result.affectedRows??0)
    }
    await conn.commit()
    return {published:7,redirects_removed:removed}
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}

/** Despublicación de las siete traducciones o las que estén activas.
 * Exige confirmación explícita y guard de sesión actualizado.
 */
export async function unpublishGroupMysql(groupId:string,confirmed:boolean){
  await requireMysqlAdminWrites()
  validGroup(groupId)
  if(confirmed!==true)throw Error('Confirmación obligatoria')
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [locked]=await conn.execute<RowDataPacket[]>(
      'SELECT id FROM recipes WHERE recipe_group_id=? FOR UPDATE',[groupId],
    )
    if(!locked.length)throw Error('Grupo no encontrado')
    const [result]=await conn.execute<any>(
      'UPDATE recipes SET published=0,editorial_status=?,updated_at=UTC_TIMESTAMP(6) '+
      'WHERE recipe_group_id=? AND published=1',['draft',groupId],
    )
    await conn.commit()
    return {unpublished:Number(result.affectedRows??0)}
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}


/** Guarda SEO de cualquier combinación válida de idiomas en UNA sola transacción.
 * Nunca sobreescribe los demás campos de seo ni edita otra receta/grupo.
 * El caller de la acción mantiene validación de longitudes y revalidación de caché.
 */
export async function saveSeoMysql(groupId:string,updates:ReadonlyArray<{
  id:string;language:string;title:string;description:string
}>) {
  await requireMysqlAdminWrites()
  validGroup(groupId)
  if(!Array.isArray(updates)||updates.length<1||updates.length>7)throw Error('Cantidad de cambios SEO inválida')
  const seen=new Set<string>()
  for(const x of updates){
    if(!uuidPattern.test(x.id)||!REQUIRED_LANGUAGES.includes(x.language as typeof REQUIRED_LANGUAGES[number])||
       typeof x.title!=='string'||typeof x.description!=='string'||x.title.trim().length<1||
       x.description.trim().length<1||x.title.length>220||x.description.length>320||
       seen.has(x.language))throw Error('SEO de idioma inválido')
    seen.add(x.language)
  }
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [rows]=await conn.execute<RowDataPacket[]>(
      'SELECT id,language,seo FROM recipes WHERE recipe_group_id=? FOR UPDATE',[groupId],
    )
    const available=new Map(rows.map(r=>[String(r.language),r]))
    for(const item of updates){
      const row=available.get(item.language)
      if(!row||String(row.id)!==item.id)throw Error('Receta de idioma distinta del grupo')
      const seo=parseJson(row.seo)
      if(!seo||typeof seo!=='object'||Array.isArray(seo))throw Error('SEO actual inválido')
      const updated={...seo,title:item.title.trim(),description:item.description.trim()}
      await conn.execute(
        'UPDATE recipes SET seo=?,updated_at=UTC_TIMESTAMP(6) WHERE id=?',
        [JSON.stringify(updated),item.id],
      )
    }
    await conn.commit()
    return {updated:updates.length}
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}
