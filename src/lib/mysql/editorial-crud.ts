import 'server-only'
import { randomUUID } from 'node:crypto'
import { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise'
import { adminConnection } from './admin-db'
import { requireMysqlAdminWrites } from './editorial-writes'
import { languageSchema, recipeFieldsSchema } from '@/lib/validation'
import type { RecipeFields } from '@/lib/validation'

type Language = 'es'|'en'|'de'|'fr'|'it'|'ja'|'pt'
const UUID=/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
const columnNames = [
  'id','recipe_group_id','language','slug','title','excerpt','ingredients','steps',
  'category','prep_time_minutes','cook_time_minutes','servings','image_url','public_path',
  'published','published_at','created_at','updated_at','gallery','video_urls','seo',
  'editorial_status','rating_count','rating_sum',
] as const
const sqlName=(value:string)=>'\x60'+value+'\x60'
const columns=columnNames.map(sqlName).join(',')
const placeholders=columnNames.map(()=>'?').join(',')
const nowSql='UTC_TIMESTAMP(6)'
function validateDraft(lang:Language,fields:RecipeFields):RecipeFields {
  const l=languageSchema.safeParse(lang)
  if(!l.success)throw Error('Idioma no admitido')
  const parsed=recipeFieldsSchema.safeParse(fields)
  if(!parsed.success)throw Error('Campos de receta inválidos')
  if(parsed.data.published)throw Error('No se puede publicar desde el formulario básico')
  return parsed.data
}
function normalizedPath(input:string|undefined):string|null {
  if(!input)return null
  const path=input.replace(/\/+$/u,'')||'/'
  if(!path.startsWith('/')||path.startsWith('//')||/[?#\s\\]/u.test(path)||path.length>300)throw Error('URL pública inválida')
  return path
}
function insertValues(id:string,group:string,lang:Language,fields:RecipeFields):unknown[] {
  // La tabla creada con el esquema MySQL carece de los defaults PostgreSQL;
  // establecer TODOS los NOT NULL y fechas explícitamente.
  return [
    id,group,lang,fields.slug,fields.title,fields.excerpt??null,
    JSON.stringify(fields.ingredients),JSON.stringify(fields.steps),
    fields.category??null,fields.prep_time_minutes??null,fields.cook_time_minutes??null,
    fields.servings??null,fields.image_url??null,normalizedPath(fields.public_path),
    0,null,nowSql,nowSql,'[]','[]','{}','draft',0,0,
  ]
}
/** Agrega solo borradores. Confiar en índices MySQL únicos para impedir
 * duplicados bajo concurrencia (script 09), no en una SELECT previa.
 */
async function insertDraft(group:string,lang:Language,fields:RecipeFields):Promise<string>{
  await requireMysqlAdminWrites()
  const valid=validateDraft(lang,fields)
  const conn=await adminConnection()
  const id=randomUUID()
  try{
    await conn.beginTransaction()
    const params=insertValues(id,group,lang,valid)
    const terms=params.map((value,i)=>value===nowSql && (i===16||i===17)?nowSql:'?')
    const bound=params.filter((value,i)=>!(value===nowSql && (i===16||i===17)))
    const [result]=await conn.execute<ResultSetHeader>(
      'INSERT INTO recipes ('+columns+') VALUES ('+terms.join(',')+')',bound as any[],
    )
    if(result.affectedRows!==1)throw Error('Inserción incompleta')
    await conn.commit()
    return id
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}
export async function createDraftMysql(lang:Language,fields:RecipeFields):Promise<string>{
  return insertDraft(randomUUID(),lang,fields)
}
export async function createTranslationMysql(sourceId:string,lang:Language,fields:RecipeFields){
  if(!UUID.test(sourceId))throw Error('Origen inválido')
  await requireMysqlAdminWrites()
  const valid=validateDraft(lang,fields)
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [origin]=await conn.execute<RowDataPacket[]>(
      'SELECT recipe_group_id FROM recipes WHERE id=? LIMIT 1 FOR UPDATE',[sourceId],
    )
    const group=String(origin[0]?.recipe_group_id??'')
    if(!UUID.test(group))throw Error('No existe la receta de origen')
    const [duplicates]=await conn.execute<RowDataPacket[]>(
      'SELECT id FROM recipes WHERE recipe_group_id=? AND language=? LIMIT 1 FOR UPDATE',
      [group,lang],
    )
    if(duplicates.length)throw Error('Ya existe una traducción en ese idioma')
    const id=randomUUID()
    const params=insertValues(id,group,lang,valid)
    const terms=params.map((value,i)=>value===nowSql && (i===16||i===17)?nowSql:'?')
    const bound=params.filter((value,i)=>!(value===nowSql && (i===16||i===17)))
    await conn.execute<ResultSetHeader>('INSERT INTO recipes ('+columns+') VALUES ('+terms.join(',')+')',bound as any[])
    await conn.commit()
    return id
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}
export async function updateDraftMysql(id:string,fields:RecipeFields):Promise<void>{
  if(!UUID.test(id))throw Error('ID inválido')
  await requireMysqlAdminWrites()
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [rows]=await conn.execute<RowDataPacket[]>(
      'SELECT language,published FROM recipes WHERE id=? FOR UPDATE',[id],
    )
    if(!rows.length)throw Error('Receta inexistente')
    // Publicaciones y su SEO deben pasar por el centro editorial, no el formulario básico.
    if(Number(rows[0].published)===1)throw Error('Usar editor aprobado para recetas publicadas')
    const fieldsChecked=validateDraft(rows[0].language as Language,fields)
    const [result]=await conn.execute<ResultSetHeader>(
      'UPDATE recipes SET slug=?,title=?,excerpt=?,ingredients=?,steps=?,category=?,'+
      'prep_time_minutes=?,cook_time_minutes=?,servings=?,image_url=?,updated_at=UTC_TIMESTAMP(6) WHERE id=?',
      [fieldsChecked.slug,fieldsChecked.title,fieldsChecked.excerpt??null,
       JSON.stringify(fieldsChecked.ingredients),JSON.stringify(fieldsChecked.steps),
       fieldsChecked.category??null,fieldsChecked.prep_time_minutes??null,
       fieldsChecked.cook_time_minutes??null,fieldsChecked.servings??null,
       fieldsChecked.image_url??null,id],
    )
    if(result.affectedRows!==1)throw Error('Actualización no realizada')
    await conn.commit()
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}

/** Borra exclusivamente borradores. Limpia relaciones de MySQL sin confiar en
 * cascadas (el esquema inicial no creó las FK). Jamás borra una receta publicada.
 */
export async function deleteDraftMysql(id:string):Promise<void>{
  if(!UUID.test(id))throw Error('ID inválido')
  await requireMysqlAdminWrites()
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [rows]=await conn.execute<RowDataPacket[]>(
      'SELECT recipe_group_id,published FROM recipes WHERE id=? FOR UPDATE',[id],
    )
    if(!rows.length)throw Error('Receta inexistente')
    if(Number(rows[0].published)!==0)throw Error('No se pueden eliminar recetas publicadas')
    const group=String(rows[0].recipe_group_id)
    for(const table of ['recipe_ingredients','recipe_ingredient_pending','recipe_cuisines']){
      await conn.execute('DELETE FROM '+table+' WHERE recipe_id=?',[id])
    }
    const [result]=await conn.execute<ResultSetHeader>('DELETE FROM recipes WHERE id=?',[id])
    if(result.affectedRows!==1)throw Error('Eliminación incompleta')
    const [remaining]=await conn.execute<RowDataPacket[]>(
      'SELECT id FROM recipes WHERE recipe_group_id=? LIMIT 1',[group],
    )
    if(remaining.length===0)await conn.execute('DELETE FROM recipe_reviews WHERE recipe_group_id=?',[group])
    await conn.commit()
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}
