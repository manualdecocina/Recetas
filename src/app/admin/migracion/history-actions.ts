'use server'

import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
import { type RowDataPacket } from 'mysql2/promise'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { readRatingsSecrets } from '@/lib/ratings-config'
import { mysqlServerPool } from '@/lib/mysql/public'
import { validateRatingHistorySnapshot } from '@/lib/mysql/rating-history-snapshot'
import { RECIPES_CACHE_TAG } from '@/lib/cache'

const CREATE_TABLE=[
  'CREATE TABLE IF NOT EXISTS recipe_rating_votes (',
  'id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,',
  'recipe_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,',
  'voter_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,',
  'rating TINYINT UNSIGNED NOT NULL,',
  'created_at DATETIME(6) NOT NULL,',
  'PRIMARY KEY (id),',
  'UNIQUE KEY uq_recipe_voter_hash (recipe_id,voter_hash),',
  'KEY idx_rating_recipe (recipe_id),',
  'CONSTRAINT chk_rating_between_1_and_5 CHECK (rating BETWEEN 1 AND 5),',
  'CONSTRAINT fk_rating_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id)',
  'ON DELETE CASCADE ON UPDATE RESTRICT)',
  'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci',
].join(' ')

/** Migra exclusivamente la lista de votos históricos privados.
 * Conserva rating_count/rating_sum aun cuando contienen valoraciones anteriores
 * a la tabla privada. No desactiva Supabase ni activa MySQL como escritor.
 * Requiere una pulsación POST explícita desde el panel autenticado.
 */
export async function migrateIndividualRatingVotesAction():Promise<never>{
  if(process.env.MYSQL_READS_ENABLED!=='true'||
     process.env.MYSQL_RATINGS_ENABLED==='true'||
     process.env.ADMIN_AUTH_PROVIDER==='mysql')
    redirect('/admin/migracion?estado=historial_desactivado')

  const {isAdmin}=await requireAdmin()
  if(!isAdmin)redirect('/admin')
  const {serviceKey}=readRatingsSecrets(process.env)
  if(!serviceKey)redirect('/admin/migracion?estado=historial_error')
  try{
    // Esta función existía en el proyecto Supabase: sólo service_role
    // dispone de EXECUTE. Anon y authenticated carecen de ese permiso.
    // NO devolver su contenido a componentes cliente ni registrarlo en logs.
    const source=createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL??'https://eqbdtctxbpepbeickhqi.supabase.co',
      serviceKey,
      {auth:{persistSession:false,autoRefreshToken:false}},
    )
    const {data,error}=await source.rpc('mdc_rating_migration_snapshot')
    if(error)throw Error('Snapshot de origen no disponible')
    const snapshot=validateRatingHistorySnapshot(data)
    const fingerprint=JSON.stringify(snapshot)
    const pool=mysqlServerPool()
    // DDL aditivo de la tabla de votos, si no fue creada ya.
    // Nunca se ejecuta DROP, DELETE, TRUNCATE, ni se reinician contadores.
    await pool.query(CREATE_TABLE)
    const conn=await pool.getConnection()
    try{
      await conn.beginTransaction()
      for(const v of snapshot.votes) {
        const [old]=await conn.execute<RowDataPacket[]>(
          'SELECT id,recipe_id,voter_hash,rating FROM recipe_rating_votes '+
          'WHERE id=? OR (recipe_id=? AND voter_hash=?) FOR UPDATE',
          [v.id,v.recipe_id,v.voter_hash],
        )
        if(old.length>1)throw Error('Conflicto de unicidad de voto')
        if(old.length){
          if(String(old[0].id)!==v.id||
             String(old[0].recipe_id)!==v.recipe_id||
             String(old[0].voter_hash)!==v.voter_hash||
             Number(old[0].rating)!==v.rating)
            throw Error('El voto existente no coincide con Supabase')
        } else {
          await conn.execute(
            'INSERT INTO recipe_rating_votes '+
            '(id,recipe_id,voter_hash,rating,created_at) VALUES (?,?,?,?,?)',
            [v.id,v.recipe_id,v.voter_hash,v.rating,v.created_at],
          )
        }
      }

      // Preservar las seis valoraciones heredadas sin registro individual:
      // reconciliar contadores desde Supabase, NO desde COUNT(votes).
      for(const c of snapshot.counters){
        await conn.execute(
          'UPDATE recipes SET rating_count=?,rating_sum=? '+
          'WHERE id=? AND rating_count<=?',
          [c.rating_count,c.rating_sum,c.id,c.rating_count],
        )
      }
      const [history]=await conn.execute<RowDataPacket[]>(
        'SELECT COUNT(*) AS n FROM recipe_rating_votes',
      )
      const [actual]=await conn.execute<RowDataPacket[]>(
        'SELECT id,rating_count,rating_sum FROM recipes WHERE rating_count>0 FOR UPDATE',
      )
      if(Number(history[0]?.n)!==snapshot.source_vote_count||
         actual.length!==snapshot.counters.length)
        throw Error('Conteos entre origen y destino diferentes')
      const expected=new Map(snapshot.counters.map(v=>[v.id,v]))
      for(const row of actual){
        const c=expected.get(String(row.id))
        if(!c||Number(row.rating_count)!==c.rating_count||
           Number(row.rating_sum)!==c.rating_sum)
          throw Error('Contadores por receta no coinciden')
      }
      // Segundo snapshot: si llegó un voto al origen mientras se importaba,
      // revertir para que el operador lo ejecute de nuevo sin perder nada.
      const fresh=await source.rpc('mdc_rating_migration_snapshot')
      if(fresh.error||JSON.stringify(validateRatingHistorySnapshot(fresh.data))!==fingerprint)
        throw Error('El origen cambió durante la migración')
      await conn.commit()
    }catch(error){await conn.rollback();throw error}finally{conn.release()}
    revalidateTag(RECIPES_CACHE_TAG,'max')
  }catch{
    // No imprimir hashes ni contenido de la exportación en errores o logs.
    console.error('[migration/ratings] Falló la importación privada o su cotejo')
    redirect('/admin/migracion?estado=historial_error')
  }
  redirect('/admin/migracion?estado=historial_ok')
}
