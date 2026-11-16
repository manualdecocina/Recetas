import 'server-only'
import {randomUUID} from 'node:crypto'
import type {PoolConnection,RowDataPacket} from 'mysql2/promise'
import type {RecipeFields} from '@/lib/validation'
import {REQUIRED_LANGUAGES} from '@/lib/admin/publication'
import {adminConnection} from './admin-db'
import {requireMysqlAdminWrites} from './editorial-writes'
import {syncRecipePantryMysql} from './pantry-sync'

const UUID=/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
const ISO_LANGS=new Set<string>(REQUIRED_LANGUAGES)
function lang(value:string){if(!ISO_LANGS.has(value))throw Error('Idioma desconocido')}
function uuid(value:string){if(!UUID.test(value))throw Error('Identificador de receta inválido')}
function canonicalPath(language:string,slug:string,path?:string|null){
  const value=(path?.trim()||'/'+language+'/receta/'+slug).replace(/\/+$/,'')
  if(!value.startsWith('/')||value.startsWith('//')||/[\s\\?#]/.test(value))throw Error('URL pública inválida')
  return value
}
function json(v:unknown){return JSON.stringify(v)}
function isDuplicate(error:unknown){return (error as {code?:string})?.code==='ER_DUP_ENTRY'}
function baseFields(fields:RecipeFields){
  return [fields.slug,fields.title,fields.excerpt??null,
    json(fields.ingredients),json(fields.steps),fields.category??null,
    fields.prep_time_minutes??null,fields.cook_time_minutes??null,
    fields.servings??null,fields.image_url??null]
}

/** Evita la edición de recetas a espaldas del panel. El guard se revalida por
 * operación y esta función no está conectada a ninguna ruta pública.
 */
async function recipeInsert(conn:PoolConnection,id:string,group:string,language:string,fields:RecipeFields){
  await conn.execute(
    'INSERT INTO recipes (id,recipe_group_id,language,slug,public_path,title,excerpt,'+
    'ingredients,steps,category,prep_time_minutes,cook_time_minutes,servings,image_url,'+
    'published,published_at,created_at,updated_at,gallery,video_urls,seo,editorial_status,'+
    'rating_count,rating_sum) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,NULL,UTC_TIMESTAMP(6),'+
    'UTC_TIMESTAMP(6),?,?,?, ?,0,0)',
    [id,group,language,fields.slug,canonicalPath(language,fields.slug,fields.public_path),
      fields.title,fields.excerpt??null,json(fields.ingredients),json(fields.steps),
      fields.category??null,fields.prep_time_minutes??null,fields.cook_time_minutes??null,
      fields.servings??null,fields.image_url??null,json([]),json([]),json({}),'draft'],
  )
}
async function assertSlugAvailable(conn:PoolConnection,language:string,slug:string,ignoreId?:string){
  const [rows]=await conn.execute<RowDataPacket[]>(
    'SELECT id FROM recipes WHERE language=? AND slug=? LIMIT 1 FOR UPDATE',[language,slug],
  )
  if(rows.length&&String(rows[0].id)!==ignoreId)throw Error('Ya existe una receta con ese slug en este idioma')
}

/** Crea una receta nueva como borrador. No publica y jamás toca Supabase. */
export async function createRecipeMysql(language:string,fields:RecipeFields){
  await requireMysqlAdminWrites()
  lang(language)
  if(fields.published)throw Error('Crear primero como borrador')
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    await assertSlugAvailable(conn,language,fields.slug)
    const id=randomUUID(),group=randomUUID()
    await recipeInsert(conn,id,group,language,fields)
    await syncRecipePantryMysql(conn,id,language,fields.ingredients)
    await conn.commit()
    return {id,recipe_group_id:group}
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}

/** Bloquea la receta origen y evita añadir dos veces un mismo idioma. */
export async function createTranslationMysql(sourceId:string,language:string,fields:RecipeFields){
  await requireMysqlAdminWrites()
  uuid(sourceId);lang(language)
  if(fields.published)throw Error('Crear la traducción como borrador')
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [source]=await conn.execute<RowDataPacket[]>(
      'SELECT recipe_group_id FROM recipes WHERE id=? LIMIT 1 FOR UPDATE',[sourceId],
    )
    if(!source.length)throw Error('La receta de origen no existe')
    const group=String(source[0].recipe_group_id)
    const [existing]=await conn.execute<RowDataPacket[]>(
      'SELECT id FROM recipes WHERE recipe_group_id=? AND language=? LIMIT 1 FOR UPDATE',[group,language],
    )
    if(existing.length)throw Error('Esta receta ya tiene una versión en ese idioma')
    await assertSlugAvailable(conn,language,fields.slug)
    const id=randomUUID()
    await recipeInsert(conn,id,group,language,fields)
    await syncRecipePantryMysql(conn,id,language,fields.ingredients)
    await conn.commit()
    return {id,recipe_group_id:group}
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}

/** Conserva idioma, grupo, slug público canónico y published_at.
 * No modifica nutrición, galería, SEO, vínculos ni contadores: replica la
 * escritura limitada del formulario básico del administrador antiguo.
 */
export async function updateRecipeMysql(id:string,fields:RecipeFields){
  await requireMysqlAdminWrites()
  uuid(id)
  const conn=await adminConnection()
  try{
    await conn.beginTransaction()
    const [existing]=await conn.execute<RowDataPacket[]>(
      'SELECT language,published,excerpt,summary,category,difficulty,course,cuisine,image_url,'+
      'public_path,ingredients,steps,nutrition,seo,total_time_minutes,servings FROM recipes '+
      'WHERE id=? LIMIT 1 FOR UPDATE',[id],
    )
    if(!existing.length)throw Error('Receta no encontrada')
    const old=existing[0]
    const language=String(old.language)
    lang(language)
    if(Boolean(old.published)!==fields.published){
      throw Error('Publicar y retirar recetas solo desde el centro editorial')
    }
    await assertSlugAvailable(conn,language,fields.slug,id)
    await conn.execute(
      'UPDATE recipes SET slug=?,title=?,excerpt=?,ingredients=?,steps=?,category=?,'+
      'prep_time_minutes=?,cook_time_minutes=?,servings=?,image_url=?,updated_at=UTC_TIMESTAMP(6) '+
      'WHERE id=?',
      [...baseFields(fields),id],
    )
    const pantry=await syncRecipePantryMysql(conn,id,language,fields.ingredients)
    if(language==='es' && fields.published && (pantry?.indexableMatches??0)<1){
      throw Error('Una receta publicada necesita un ingrediente canónico buscable')
    }
    await conn.commit()
    return {id}
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}
