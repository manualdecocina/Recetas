import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { PoolConnection, RowDataPacket } from 'mysql2/promise'
import { mysqlServerPool } from './public'
import { parseRatingSnapshot, type RatingSnapshot } from './rating-migration-snapshot'
import { readRatingsSecrets } from '@/lib/ratings-config'

/**
 * Sincronización idempotente de votos históricos al MySQL existente.
 *
 * - Requiere autenticación Supabase de un administrador (controlada por la ruta que llama).
 * - Nunca recibe votos, hashes o secretos del navegador.
 * - Mantiene contadores originales, incluso 6 valoraciones legadas sin voto individual.
 * - No activa MYSQL_RATINGS_ENABLED ni borra datos del origen.
 * - Rechaza inconsistencias y revierte la transacción; no sobrescribe datos conflictivos.
 */
const LOCK='mdc_rating_migration_20261116'
const UUID=/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
export interface RatingMigrationOutcome {
  sourceVotes:number; sourceRatingCount:number; sourceRatingSum:number
  imported:number; alreadyPresent:number
}
async function snapshot():Promise<RatingSnapshot> {
  const {serviceKey}=readRatingsSecrets(process.env)
  if(!serviceKey)throw Error('Servicio de Supabase sin credencial de servidor')
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL||'https://eqbdtctxbpepbeickhqi.supabase.co'
  const supabase=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}})
  const {data,error}=await supabase.rpc('mdc_rating_migration_snapshot')
  if(error)throw Error('No se pudo consultar el snapshot privado de votos')
  return parseRatingSnapshot(data)
}
async function ensureLedger(conn:PoolConnection) {
  // DDL aditivo, idempotente; no sobrescribe tablas previamente instaladas.
  await conn.query(`CREATE TABLE IF NOT EXISTS recipe_rating_votes (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    recipe_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    voter_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    created_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_recipe_voter_hash (recipe_id,voter_hash),
    KEY idx_rating_recipe (recipe_id),
    CONSTRAINT chk_rating_between_1_and_5 CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT fk_rating_recipe FOREIGN KEY (recipe_id) REFERENCES recipes (id)
      ON DELETE CASCADE ON UPDATE RESTRICT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)
  const [keys]=await conn.query<RowDataPacket[]>('SHOW INDEX FROM recipe_rating_votes')
  const unique=new Map<string,string[]>()
  for(const row of keys){
    if(Number(row.Non_unique)!==0)continue
    const name=String(row.Key_name)
    const cols=unique.get(name)??[]
    cols[Number(row.Seq_in_index)-1]=String(row.Column_name)
    unique.set(name,cols)
  }
  if(![...unique.values()].some(c=>c.join(',')==='id')||
     ![...unique.values()].some(c=>c.join(',')==='recipe_id,voter_hash')){
    throw Error('La tabla de votos MySQL carece de las restricciones de unicidad necesarias')
  }
}
function sameSnapshot(a:RatingSnapshot,b:RatingSnapshot):boolean{
  return a.source_vote_count===b.source_vote_count&&
    a.source_rating_count===b.source_rating_count&&
    a.source_rating_sum===b.source_rating_sum&&
    a.votes.every((v,i)=>v.id===b.votes[i]?.id&&v.rating===b.votes[i]?.rating)&&
    a.counters.every((c,i)=>c.id===b.counters[i]?.id&&
      c.rating_count===b.counters[i]?.rating_count&&c.rating_sum===b.counters[i]?.rating_sum)
}
export async function synchronizeRatingsMysql():Promise<RatingMigrationOutcome> {
  if(process.env.MYSQL_READS_ENABLED!=='true')throw Error('Lecturas públicas MySQL no activadas')
  if(process.env.MYSQL_RATINGS_ENABLED==='true')throw Error('No sincronizar sobre un sistema de votos MySQL activo')
  if(process.env.ADMIN_AUTH_PROVIDER==='mysql')throw Error('Se requiere una sesión administrativa Supabase para el corte')
  const fromSource=await snapshot()
  const conn=await mysqlServerPool().getConnection()
  let locked=false,inTransaction=false
  try {
    const [lockRows]=await conn.query<RowDataPacket[]>('SELECT GET_LOCK(?,10) AS acquired',[LOCK])
    locked=Number(lockRows[0]?.acquired)===1
    if(!locked)throw Error('Otra sincronización está en curso')
    await ensureLedger(conn)
    await conn.beginTransaction()
    inTransaction=true
    const [mysqlVotes]=await conn.query<RowDataPacket[]>(
      'SELECT id,recipe_id,voter_hash,rating FROM recipe_rating_votes FOR UPDATE')
    const byId=new Map<string,RowDataPacket>(),byVoter=new Map<string,RowDataPacket>()
    for(const row of mysqlVotes){
      const id=String(row.id).toLowerCase(),key=String(row.recipe_id).toLowerCase()+'|'+String(row.voter_hash)
      byId.set(id,row);byVoter.set(key,row)
    }
    const sourceIds=new Set(fromSource.votes.map(v=>v.id.toLowerCase()))
    if(mysqlVotes.some(r=>!sourceIds.has(String(r.id).toLowerCase()))) {
      throw Error('MySQL contiene votos no presentes en el snapshot de Supabase')
    }
    let imported=0,alreadyPresent=0
    for(const vote of fromSource.votes){
      const byPrimary=byId.get(vote.id.toLowerCase())
      const byUnique=byVoter.get(vote.recipe_id.toLowerCase()+'|'+vote.voter_hash)
      const old=byPrimary??byUnique
      if(old){
        if(String(old.id).toLowerCase()!==vote.id.toLowerCase()||
           String(old.recipe_id).toLowerCase()!==vote.recipe_id.toLowerCase()||
           String(old.voter_hash)!==vote.voter_hash||
           Number(old.rating)!==vote.rating)throw Error('Un voto existente difiere del origen')
        alreadyPresent++
        continue
      }
      await conn.execute(
        'INSERT INTO recipe_rating_votes(id,recipe_id,voter_hash,rating,created_at) VALUES (?,?,?,?,?)',
        [vote.id,vote.recipe_id,vote.voter_hash,vote.rating,vote.created_at])
      imported++
    }
    // Son 31 valoraciones frente a 25 votos individuales: preservar el contador
    // original en todas las recetas, sin reconstruirlo solo desde la tabla de votos.
    const [mysqlCounters]=await conn.query<RowDataPacket[]>(
      'SELECT id,rating_count,rating_sum FROM recipes WHERE rating_count <> 0 OR rating_sum <> 0 FOR UPDATE')
    const countIds=new Set(fromSource.counters.map(c=>c.id.toLowerCase()))
    if(mysqlCounters.some(r=>!countIds.has(String(r.id).toLowerCase()))) {
      throw Error('MySQL tiene contadores ajenos al snapshot del origen')
    }
    for(const counter of fromSource.counters){
      if(!UUID.test(counter.id))throw Error('Identificador de receta inválido')
      const [found]=await conn.execute<RowDataPacket[]>(
        'SELECT id FROM recipes WHERE id=? FOR UPDATE',[counter.id])
      if(found.length!==1)throw Error('Falta una receta con valoraciones en MySQL')
      await conn.execute('UPDATE recipes SET rating_count=?,rating_sum=? WHERE id=?',
        [counter.rating_count,counter.rating_sum,counter.id])
    }
    const [totals]=await conn.query<RowDataPacket[]>(
      'SELECT COALESCE(SUM(rating_count),0) AS n,COALESCE(SUM(rating_sum),0) AS s FROM recipes')
    const [ledger]=await conn.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM recipe_rating_votes')
    if(Number(totals[0]?.n)!==fromSource.source_rating_count||
       Number(totals[0]?.s)!==fromSource.source_rating_sum||
       Number(ledger[0]?.n)!==fromSource.source_vote_count){
      throw Error('Los totales no coinciden con Supabase; operación revertida')
    }
    // Verificar si hubo votos simultáneos antes de confirmar. En tal caso se
    // revierte y se puede reintentar sin perder un solo voto.
    const current=await snapshot()
    if(!sameSnapshot(fromSource,current))throw Error('Hubo votos nuevos durante la sincronización: repetirla')
    await conn.commit()
    inTransaction=false
    return {sourceVotes:fromSource.source_vote_count,
      sourceRatingCount:fromSource.source_rating_count,sourceRatingSum:fromSource.source_rating_sum,
      imported,alreadyPresent}
  }catch(error){
    if(inTransaction)await conn.rollback()
    throw error
  }finally{
    if(locked)await conn.query('SELECT RELEASE_LOCK(?)',[LOCK]).catch(()=>undefined)
    conn.release()
  }
}
