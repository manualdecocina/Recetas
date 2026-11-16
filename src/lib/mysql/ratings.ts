import 'server-only'
import { randomUUID } from 'node:crypto'
import { type RowDataPacket } from 'mysql2/promise'
import { mysqlServerPool } from './public'

type Outcome =
  | {status:'ok';rating_count:number;rating_sum:number}
  | {status:'duplicate'|'not_found'}
/** Misma semántica que la RPC antigua: exactamente un voto por receta y voter_hash.
 * La tabla recipe_rating_votes debe haberse importado con los 23 votos históricos.
 * Transacción atómica protege los contadores de recetas bajo concurrencia.
 */
export async function voteMysql(recipeId:string,rating:number,voterHash:string):Promise<Outcome>{
  if(process.env.MYSQL_RATINGS_ENABLED!=='true')throw Error('Valoraciones MySQL desactivadas')
  if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(recipeId))throw Error('ID inválido')
  if(!Number.isInteger(rating)||rating<1||rating>5)throw Error('Valoración inválida')
  if(!/^[0-9a-f]{64}$/.test(voterHash))throw Error('Hash inválido')
  const conn=await mysqlServerPool().getConnection()
  try{
    await conn.beginTransaction()
    const [recipes]=await conn.execute<RowDataPacket[]>(
      'SELECT id FROM recipes WHERE id=? AND published=1 FOR UPDATE',[recipeId],
    )
    if(!recipes.length){await conn.rollback();return {status:'not_found'}}
    try{
      await conn.execute(
        'INSERT INTO recipe_rating_votes(id,recipe_id,voter_hash,rating,created_at) VALUES(?,?,?,?,UTC_TIMESTAMP(6))',
        [randomUUID(),recipeId,voterHash,rating],
      )
    }catch(error){
      if((error as {code?:string}).code==='ER_DUP_ENTRY'){
        await conn.rollback()
        return {status:'duplicate'}
      }
      throw error
    }
    await conn.execute(
      'UPDATE recipes SET rating_count=rating_count+1,rating_sum=rating_sum+? WHERE id=? AND published=1',
      [rating,recipeId],
    )
    const [updated]=await conn.execute<RowDataPacket[]>(
      'SELECT rating_count,rating_sum FROM recipes WHERE id=? LIMIT 1',[recipeId],
    )
    await conn.commit()
    return {status:'ok',rating_count:Number(updated[0]?.rating_count??0),rating_sum:Number(updated[0]?.rating_sum??0)}
  }catch(error){await conn.rollback();throw error}finally{conn.release()}
}
