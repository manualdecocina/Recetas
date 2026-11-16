'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { type RowDataPacket } from 'mysql2/promise'
import { requireAdmin } from '@/lib/supabase/admin-guard'
import { mysqlServerPool } from '@/lib/mysql/public'
import { RECIPES_CACHE_TAG } from '@/lib/cache'

type RatedRow = { id:string; rating_count:number; rating_sum:number }
const UUID=/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
function validRow(value:RatedRow):boolean{
  return UUID.test(value.id) &&
    Number.isSafeInteger(value.rating_count) && value.rating_count>0 &&
    Number.isSafeInteger(value.rating_sum) && value.rating_sum>=value.rating_count &&
    value.rating_sum<=value.rating_count*5
}

/** Sólo copia contadores públicos, no hashes de votantes. Acción privada y
 * explícita para un administrador Supabase ya validado; no funciona por GET.
 * MySQL queda intacto si falla la reconciliación.
 */
export async function reconcileRatingCountersAction(){
  if(process.env.MYSQL_READS_ENABLED!=='true' ||
     process.env.MYSQL_RATINGS_ENABLED==='true' ||
     process.env.ADMIN_AUTH_PROVIDER==='mysql') {
    redirect('/admin/migracion?estado=desactivado')
  }
  const {supabase,isAdmin}=await requireAdmin()
  if(!isAdmin)redirect('/admin')
  const rows:RatedRow[]=[]
  try {
    for(let offset=0;offset<10000;offset+=1000) {
      const {data,error}=await supabase.from('recipes')
        .select('id,rating_count,rating_sum')
        .gt('rating_count',0).order('id').range(offset,offset+999)
      if(error)throw Error('No se pudo leer el origen')
      for(const row of data??[]){
        const normalized={id:String(row.id),rating_count:Number(row.rating_count),rating_sum:Number(row.rating_sum)}
        if(!validRow(normalized))throw Error('Origen con contadores inválidos')
        rows.push(normalized)
      }
      if(!data||data.length<1000)break
      if(offset===9000)throw Error('Límite de páginas excedido')
    }
    const seen=new Set(rows.map(row=>row.id))
    if(seen.size!==rows.length)throw Error('IDs duplicados en origen')
    const total=rows.reduce((sum,r)=>sum+r.rating_count,0)
    const sum=rows.reduce((n,r)=>n+r.rating_sum,0)
    const pool=mysqlServerPool()
    const conn=await pool.getConnection()
    try {
      await conn.beginTransaction()
      // Idempotente; impide que un total anterior sobrescriba una cifra
      // más reciente sincronizada por otra petición de voto.
      for(const row of rows){
        await conn.execute(
          'UPDATE recipes SET rating_sum=?,rating_count=? WHERE id=? AND rating_count<=?',
          [row.rating_sum,row.rating_count,row.id,row.rating_count],
        )
      }
      const [result]=await conn.execute<RowDataPacket[]>(
        'SELECT COUNT(*) AS rated_recipes, COALESCE(SUM(rating_count),0) AS votes, '+
        'COALESCE(SUM(rating_sum),0) AS stars FROM recipes WHERE rating_count>0',
      )
      const actual=result[0]
      if(Number(actual?.rated_recipes)!==rows.length ||
         Number(actual?.votes)!==total || Number(actual?.stars)!==sum){
        throw Error('Los totales de MySQL no coinciden; se deshace la transacción')
      }
      await conn.commit()
    }catch(error){await conn.rollback();throw error}finally{conn.release()}
    revalidateTag(RECIPES_CACHE_TAG,'max')
  } catch {
    console.error('[migration/ratings] No se pudieron reconciliar los contadores')
    redirect('/admin/migracion?estado=error')
  }
  redirect('/admin/migracion?estado=sincronizado')
}
